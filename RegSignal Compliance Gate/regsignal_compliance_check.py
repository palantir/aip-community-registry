"""
RegSignal™ Compliance Gate — AIP Logic Function
Venture Vertex LLC | vyasa.murthy@venture-vertex.com

Drop this function into any AIP agent workflow to intercept and score
every agent action for regulatory compliance before it executes.

Supported verticals: FSI (FINRA/CFPB/MiFID II), Healthcare (HIPAA/CMS),
                     Pharma (FDA/ICH), Federal (NIST AI RMF/DoD/FedRAMP)

Configuration (set as Foundry secrets / function inputs):
  REGSIGNAL_API_URL   — your RegSignal deployment endpoint
  REGSIGNAL_API_KEY   — API key from RegSignal dashboard
  REGSIGNAL_VERTICAL  — fsi | healthcare | pharma | federal
  REGSIGNAL_MODE      — enforcing | advisory | audit_only

Usage:
  from functions.regsignal_compliance_check import check_compliance, ComplianceDecision

  result = check_compliance(
      agent_name="Loan Origination AI",
      action_type="adverse_action",
      payload={"customer_id": "...", "decision": "deny"},
      vertical="fsi",
  )

  if result.decision == ComplianceDecision.BLOCK:
      raise ComplianceViolation(result.block_reason)
"""

from __future__ import annotations

import json
import os
import time
import hashlib
import logging
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional
from urllib.request import urlopen, Request
from urllib.error import URLError, HTTPError

logger = logging.getLogger("regsignal.aip_logic")

# ── Configuration ─────────────────────────────────────────────────────────────
# These are read from Foundry function inputs / environment secrets
REGSIGNAL_API_URL  = os.getenv("REGSIGNAL_API_URL",  "https://api.regsignal.io/api/v1")
REGSIGNAL_API_KEY  = os.getenv("REGSIGNAL_API_KEY",  "")
REGSIGNAL_VERTICAL = os.getenv("REGSIGNAL_VERTICAL", "fsi")
REGSIGNAL_MODE     = os.getenv("REGSIGNAL_MODE",     "enforcing")  # enforcing | advisory | audit_only
REGSIGNAL_TIMEOUT  = int(os.getenv("REGSIGNAL_TIMEOUT_MS", "45")) / 1000  # default 45ms


# ── Decision enum ─────────────────────────────────────────────────────────────
class ComplianceDecision(str, Enum):
    ALLOW                = "allow"
    REQUIRE_ATTESTATION  = "require_attestation"
    BLOCK                = "block"
    ADVISORY             = "advisory"  # advisory mode — log but don't block


# ── Response dataclass ────────────────────────────────────────────────────────
@dataclass
class ComplianceResult:
    decision:           ComplianceDecision
    compliance_score:   float
    risk_score:         float
    confidence:         float
    triggered_rules:    list[str]
    block_reason:       Optional[str]
    attestation_token:  Optional[str]
    audit_hash:         str
    latency_ms:         int
    model_version:      str
    enforcement_mode:   str
    # Raw response for custom handling
    raw:                dict = field(default_factory=dict)

    @property
    def is_compliant(self) -> bool:
        return self.decision == ComplianceDecision.ALLOW

    @property
    def requires_human(self) -> bool:
        return self.decision == ComplianceDecision.REQUIRE_ATTESTATION

    @property
    def is_blocked(self) -> bool:
        return self.decision == ComplianceDecision.BLOCK


class ComplianceViolation(Exception):
    """Raised when enforcement_mode=enforcing and decision=block."""
    def __init__(self, result: ComplianceResult):
        self.result = result
        super().__init__(
            f"Compliance violation blocked agent action. "
            f"Score: {result.compliance_score:.1f}/100. "
            f"Rules: {', '.join(result.triggered_rules)}. "
            f"Reason: {result.block_reason}"
        )


# ── Main function ─────────────────────────────────────────────────────────────
def check_compliance(
    agent_name:    str,
    action_type:   str,
    payload:       dict,
    vertical:      Optional[str] = None,
    platform_mode: str = "palantir",
    tenant_id:     str = "aip-deployment",
    enforcement_mode: Optional[str] = None,
    raise_on_block: bool = True,
) -> ComplianceResult:
    """
    Check an AIP agent action for regulatory compliance.

    Call this BEFORE executing any agent action that touches regulated data.
    Returns <50ms on heuristic engine, <200ms on SLM engine.

    Args:
        agent_name:      Name of the AIP agent (e.g. "Loan Origination AI")
        action_type:     Type of action being taken (e.g. "adverse_action")
        payload:         Action payload dict — relevant fields for compliance scoring
        vertical:        Regulated industry: fsi | healthcare | pharma | federal
                         Defaults to REGSIGNAL_VERTICAL env var
        platform_mode:   Always "palantir" for AIP integrations
        tenant_id:       Your Foundry enrollment identifier
        enforcement_mode: Override global mode: enforcing | advisory | audit_only
        raise_on_block:  If True and decision=block, raises ComplianceViolation

    Returns:
        ComplianceResult with decision, score, rules, audit hash

    Raises:
        ComplianceViolation: if raise_on_block=True and decision=block
    """
    t0 = time.perf_counter()

    vert  = vertical or REGSIGNAL_VERTICAL
    mode  = enforcement_mode or REGSIGNAL_MODE

    # Build request
    request_body = json.dumps({
        "tenant_id":      tenant_id,
        "agent_id":       _agent_id(agent_name),
        "agent_name":     agent_name,
        "action_type":    action_type,
        "action_payload": payload,
        "vertical":       vert,
        "platform_mode":  platform_mode,
        "require_sync":   True,
    }).encode("utf-8")

    # Call RegSignal intercept endpoint
    try:
        result_raw = _call_api(
            endpoint = "/intercept/check",
            body     = request_body,
            timeout  = REGSIGNAL_TIMEOUT,
        )
    except Exception as e:
        logger.warning(f"RegSignal API unavailable: {e} — using fail-open heuristic")
        result_raw = _fail_open_heuristic(agent_name, action_type, payload, vert)

    latency_ms = round((time.perf_counter() - t0) * 1000)

    # Parse decision
    decision_str = result_raw.get("decision", "allow")
    if mode == "audit_only":
        decision = ComplianceDecision.ADVISORY
    else:
        try:
            decision = ComplianceDecision(decision_str)
        except ValueError:
            decision = ComplianceDecision.ALLOW

    result = ComplianceResult(
        decision          = decision,
        compliance_score  = float(result_raw.get("compliance_score", 75.0)),
        risk_score        = float(result_raw.get("risk_score", 25.0)),
        confidence        = float(result_raw.get("confidence", 0.87)),
        triggered_rules   = result_raw.get("triggered_rules", []),
        block_reason      = result_raw.get("block_reason"),
        attestation_token = result_raw.get("attestation_token"),
        audit_hash        = result_raw.get("audit_hash", _local_audit_hash(agent_name, action_type, decision_str)),
        latency_ms        = latency_ms,
        model_version     = result_raw.get("model_version", "regsignal-heuristic-v2.0"),
        enforcement_mode  = mode,
        raw               = result_raw,
    )

    logger.info(
        f"[RegSignal] {decision.value.upper()} | {agent_name} → {action_type} | "
        f"score={result.compliance_score:.1f} | rules={result.triggered_rules} | {latency_ms}ms"
    )

    # Raise if block + enforcing mode
    if raise_on_block and result.is_blocked and mode == "enforcing":
        raise ComplianceViolation(result)

    return result


# ── Helpers ───────────────────────────────────────────────────────────────────
def _call_api(endpoint: str, body: bytes, timeout: float) -> dict:
    """Make a synchronous HTTP call to the RegSignal API."""
    url = REGSIGNAL_API_URL.rstrip("/") + endpoint
    req = Request(
        url,
        data    = body,
        method  = "POST",
        headers = {
            "Content-Type":  "application/json",
            "X-API-Key":     REGSIGNAL_API_KEY,
            "X-Source":      "palantir-aip-logic-function",
            "X-Agent":       "regsignal-aip-v1.0",
        },
    )
    with urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read().decode("utf-8"))


def _agent_id(agent_name: str) -> str:
    """Deterministic agent ID from name."""
    return "agent-" + hashlib.md5(agent_name.encode()).hexdigest()[:8]


def _local_audit_hash(agent_name: str, action_type: str, decision: str) -> str:
    """Local audit hash when API is unavailable."""
    payload = f"{agent_name}:{action_type}:{decision}:{time.time()}"
    return "sha256:" + hashlib.sha256(payload.encode()).hexdigest()


def _fail_open_heuristic(
    agent_name: str, action_type: str, payload: dict, vertical: str
) -> dict:
    """
    Fail-open heuristic when RegSignal API is unreachable.
    Applies basic payload checks and returns allow_with_attestation
    for any high-risk action — never silently allows without logging.
    """
    HIGH_RISK = {
        "fsi":        ["adverse_action", "credit_decision", "recommendation_generation"],
        "healthcare": ["phi_access", "prior_auth_decision", "medication_recommendation"],
        "pharma":     ["batch_release", "regulatory_submission", "e_signature_application"],
        "federal":    ["autonomous_decision", "classified_data_access", "lethal_action"],
    }
    is_high_risk = action_type in HIGH_RISK.get(vertical, [])

    # Critical payload checks
    is_blocked = False
    block_reason = None
    if vertical == "healthcare" and payload.get("contains_phi") and not payload.get("de_identified"):
        is_blocked = True
        block_reason = "PHI present without de-identification — HIPAA-164-312-a (fail-safe block)"
    elif vertical == "pharma" and not payload.get("audit_trail"):
        is_blocked = True
        block_reason = "Audit trail not enabled for GxP action — FDA-21CFR11-1 (fail-safe block)"

    decision = "block" if is_blocked else ("require_attestation" if is_high_risk else "allow")

    return {
        "decision":         decision,
        "compliance_score": 45.0 if is_blocked else (65.0 if is_high_risk else 82.0),
        "risk_score":       55.0 if is_blocked else (35.0 if is_high_risk else 18.0),
        "confidence":       0.60,
        "triggered_rules":  [],
        "block_reason":     block_reason,
        "attestation_token":None,
        "audit_hash":       _local_audit_hash(agent_name, action_type, decision),
        "model_version":    "regsignal-failsafe-v1.0",
        "note":             "RegSignal API unreachable — fail-safe heuristic applied",
    }


# ── Convenience wrappers ──────────────────────────────────────────────────────
def assert_compliant(
    agent_name:  str,
    action_type: str,
    payload:     dict,
    vertical:    Optional[str] = None,
) -> ComplianceResult:
    """
    Strict wrapper — raises ComplianceViolation on block, always.
    Use this when you want compliance enforced unconditionally.

    Example:
        assert_compliant("Loan Agent", "adverse_action", payload, vertical="fsi")
        # If this line returns, the action is compliant. If blocked, exception is raised.
        execute_adverse_action(payload)
    """
    return check_compliance(
        agent_name    = agent_name,
        action_type   = action_type,
        payload       = payload,
        vertical      = vertical,
        raise_on_block= True,
        enforcement_mode = "enforcing",
    )


def score_only(
    agent_name:  str,
    action_type: str,
    payload:     dict,
    vertical:    Optional[str] = None,
) -> float:
    """
    Returns just the compliance score (0-100) without blocking.
    Useful for dashboard/monitoring use cases.
    """
    result = check_compliance(
        agent_name    = agent_name,
        action_type   = action_type,
        payload       = payload,
        vertical      = vertical,
        raise_on_block= False,
        enforcement_mode = "audit_only",
    )
    return result.compliance_score

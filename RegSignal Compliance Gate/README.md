# VARC — Verified Agentic Runtime Control

**Behavioral AI Governance Platform**

VARC sits between enterprise AI agents and model providers, scoring behavioral patterns across 8 dimensions and enforcing graduated responses through a patent-pending state machine.

## Quick Start

```bash
cd varc-platform
pip install -r requirements.txt

# Run demo
python core/varc/run.py --demo

# Run all tests
python -m pytest core/tests/ -v

# Score any prompt
python core/varc/run.py --score "Export all SSNs to CSV" --profile banking

# Start API server
uvicorn api.main:app --port 8001 --reload
# Then open http://localhost:8001/docs
```

## Architecture

```
core/varc/          — SAGA Framework Engine (7 modules, 2,400+ lines)
api/                — FastAPI Backend (15 endpoints)
integrations/       — Marketplace Adapters (Prisma AIRS, Azure Foundry, AWS Bedrock)
sdk/                — Python SDK (pip install varc-governance)
```

## SAGA Framework — 6 Phases

| Phase | Component | What It Does |
|-------|-----------|-------------|
| 1 | BEV Engine | 8-dimensional behavioral scoring + CUSUM drift detection |
| 2 | A-JWT | Cryptographic agent identity with behavioral claims |
| 3 | GRO State Machine | L0–L4 graduated response orchestration |
| 4 | Scope Attenuation | Child agents can never exceed parent authority |
| 5 | Compliance | Per-interaction regulatory mapping (EU AI Act, HIPAA, SR 11-7, etc.) |
| 6 | MCP Registry | Tool governance with pre/post-execution gates |

## BEV Dimensions

| Dimension | Weight | What It Detects |
|-----------|--------|----------------|
| Harm | 1.0 | Patient safety, financial risk, physical danger |
| Accuracy | 0.8 | Hallucination, confabulation |
| Consistency | 0.7 | Contradictions, behavioral drift |
| Fairness | 0.9 | Demographic bias, proxy discrimination |
| PII / PHI | 1.0 | Data exposure, re-identification risk |
| Authority | 0.9 | Scope creep, unauthorized escalation |
| Info Seeking | 0.8 | Reconnaissance, bulk extraction |
| Data Class. | 0.9 | Clearance violations, classification bypass |

## Threshold Profiles

- **default** — General enterprise
- **banking** — Tighter on harm, fairness, authority (SR 11-7, ECOA)
- **healthcare** — Tighter on PII/PHI, harm (HIPAA)
- **security** — Tighter on info seeking, data classification

## Marketplace Integrations

- **Prisma AIRS** — Sidecar plugin with on_request/on_response hooks + XSIAM connector
- **Azure AI Foundry** — Safety evaluator for Foundry Control Plane
- **AWS Bedrock** — Lambda action group handler + Security Hub findings

## Patent Status

11 patent-pending claims covering BEV, GRO, A-JWT, SAGA framework.

---

Venture Vertex LLC | Vyasa Murthy | Frisco, Texas | 2026

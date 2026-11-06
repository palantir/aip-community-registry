import { createHash, randomUUID } from "node:crypto";
import { WAVE_SIZES, type Finding, type SourceRef, type SwarmResult } from "./shared.js";

const blocked = [/weapon target/i, /covert surveillance/i, /facial tracking/i, /credential bypass/i, /autonomous force/i];
const roles = ["quantum-concepts", "quantum-algorithms", "physics-skeptic", "geospatial-modeler", "geojson-validator", "spatial-statistician", "ontology-architect", "knowledge-engineer", "data-engineer", "provenance-auditor", "source-critic", "uncertainty-analyst", "privacy-reviewer", "security-reviewer", "accessibility-reviewer", "climate-analyst", "infrastructure-planner", "emergency-support", "logistics-analyst", "public-policy-analyst", "visualization-designer", "test-engineer", "zyra-integrator", "red-team-reviewer"] as const;
const SPECIALIST_WAVE_SIZES = [3, 6, 7, 8] as const;

export class AuditJournal {
  readonly events: ReadonlyArray<Record<string, unknown>> = [];
  append(type: string, payload: Record<string, unknown>) {
    const previousHash = (this.events.at(-1)?.hash as string | undefined) ?? "GENESIS";
    const unsigned = { id: randomUUID(), at: new Date().toISOString(), type, payload, previousHash };
    const event = Object.freeze({ ...unsigned, hash: createHash("sha256").update(JSON.stringify(unsigned)).digest("hex") });
    (this.events as Array<typeof event>).push(event);
    return event;
  }
  verify() {
    return this.events.every((event, index) => {
      const { hash, ...unsigned } = event;
      const expectedPreviousHash = index ? this.events[index - 1].hash : "GENESIS";
      const expectedHash = createHash("sha256").update(JSON.stringify(unsigned)).digest("hex");
      return unsigned.previousHash === expectedPreviousHash && hash === expectedHash;
    });
  }
}

export interface SpecialistContext {
  slot: number;
  role: typeof roles[number];
  wave: number;
  objective: string;
  sources: SourceRef[];
}

export type SpecialistExecutor = (context: SpecialistContext) => Finding | Promise<Finding>;

export interface RunFleetOptions {
  executeSpecialist?: SpecialistExecutor;
}

const defaultSpecialistExecutor: SpecialistExecutor = ({ role, objective, sources }) => ({
  role,
  summary: `${role} assessed: ${objective}`,
  confidence: 0.65,
  citations: sources.slice(0, 3).map((source) => source.url)
});

export async function runFleet(
  objective: string,
  sources: SourceRef[] = [],
  journal = new AuditJournal(),
  options: RunFleetOptions = {}
): Promise<SwarmResult> {
  objective = objective.trim();
  if (objective.length < 8 || blocked.some((rule) => rule.test(objective))) {
    throw new Error("Objective rejected by governance policy");
  }

  const executeSpecialist = options.executeSpecialist ?? defaultSpecialistExecutor;
  const findings: Finding[] = [];
  const failures: Array<{ slot: number; role: string; reason: string }> = [];
  let slot = 0;

  for (const [waveIndex, size] of SPECIALIST_WAVE_SIZES.entries()) {
    const contexts: SpecialistContext[] = Array.from({ length: size }, () => {
      const specialistSlot = ++slot;
      return {
        slot: specialistSlot,
        role: roles[specialistSlot - 1],
        wave: waveIndex + 1,
        objective,
        sources
      };
    });

    const outcomes = await Promise.allSettled(
      contexts.map((context) => Promise.resolve().then(() => executeSpecialist(context)))
    );

    outcomes.forEach((outcome, index) => {
      const context = contexts[index];
      if (outcome.status === "fulfilled") {
        findings.push(outcome.value);
      } else {
        failures.push({
          slot: context.slot,
          role: context.role,
          reason: outcome.reason instanceof Error ? outcome.reason.message : String(outcome.reason)
        });
      }
    });

    journal.append("fleet.wave.completed", {
      wave: waveIndex + 1,
      plannedExecutions: size,
      succeeded: outcomes.filter((outcome) => outcome.status === "fulfilled").length,
      failed: outcomes.filter((outcome) => outcome.status === "rejected").length
    });
  }

  const allSpecialistsSucceeded = findings.length === roles.length && failures.length === 0;
  journal.append("fleet.specialist-barrier.evaluated", {
    required: roles.length,
    succeeded: findings.length,
    failed: failures.length,
    status: allSpecialistsSucceeded ? "released" : "blocked",
    failures
  });

  if (!allSpecialistsSucceeded) {
    throw new Error(`Synthesis blocked: ${failures.length} specialist execution(s) failed`);
  }

  const synthesis: Finding = {
    role: "synthesis-coordinator",
    summary: `synthesis-coordinator integrated ${findings.length} specialist findings for: ${objective}`,
    confidence: findings.reduce((total, finding) => total + finding.confidence, 0) / findings.length,
    citations: [...new Set(findings.flatMap((finding) => finding.citations))]
  };
  journal.append("fleet.synthesis.completed", {
    specialistFindings: findings.length,
    coordinatorExecution: 25
  });

  return {
    objective,
    waves: WAVE_SIZES,
    specialistSlots: 24,
    totalExecutions: 25,
    findings: [...findings, synthesis],
    synthesis
  };
}

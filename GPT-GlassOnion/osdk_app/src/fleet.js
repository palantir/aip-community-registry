export const WAVE_SIZES = Object.freeze([3, 6, 7, 9]);
const roles = [
  "quantum-concepts","quantum-algorithms","physics-skeptic","geospatial-modeler","geojson-validator","spatial-statistician",
  "ontology-architect","knowledge-engineer","data-engineer","provenance-auditor","source-critic","uncertainty-analyst",
  "privacy-reviewer","security-reviewer","accessibility-reviewer","climate-analyst","infrastructure-planner",
  "emergency-support","logistics-analyst","public-policy-analyst","visualization-designer","test-engineer",
  "zyra-integrator","red-team-reviewer"
];
const forbidden = [/weapon target/i, /facial recognition/i, /bypass credential/i, /covert surveillance/i, /autonomous force/i];

export class DeterministicProvider {
  async run(task, context) {
    return { summary: `${task.role} assessed: ${task.objective}`,
      claims: [`Analysis constrained to authorized sources.`], confidence: 0.65,
      citations: context.sources.slice(0, 3).map(source => source.url) };
  }
}

export class FleetOrchestrator {
  constructor({ provider = new DeterministicProvider(), journal, concurrency = 3 } = {}) {
    this.provider = provider; this.journal = journal; this.concurrency = Math.max(1, concurrency);
  }
  async run(objective, sources = []) {
    if (typeof objective !== "string" || objective.trim().length < 8) throw new Error("Invalid objective");
    if (forbidden.some(rule => rule.test(objective))) throw new Error("Objective rejected by civilian-use policy");
    const results = []; let slot = 0;
    for (let wave = 0; wave < WAVE_SIZES.length; wave++) {
      const tasks = Array.from({ length: WAVE_SIZES[wave] }, (_, index) => {
        slot += 1; const coordinator = slot === 25;
        return { id: `wave-${wave + 1}-exec-${index + 1}`, slot, wave: wave + 1,
          role: coordinator ? "synthesis-coordinator" : roles[slot - 1], objective, coordinator };
      });
      for (let index = 0; index < tasks.length; index += this.concurrency) {
        results.push(...await Promise.all(tasks.slice(index, index + this.concurrency)
          .map(async task => ({ task, output: await this.provider.run(task, { sources, priorResults: results }) }))));
      }
      this.journal?.append("fleet.wave.completed", "fleet", { wave: wave + 1, executions: tasks.length });
    }
    return { objective, specialistSlots: 24, totalExecutions: 25, waves: WAVE_SIZES,
      results, synthesis: results.at(-1).output };
  }
}

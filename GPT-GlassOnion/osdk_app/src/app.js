import { AuditJournal } from "./audit.js";
import { FleetOrchestrator } from "./fleet.js";
import { Ontology, installCoreTypes } from "./ontology.js";

export function createApp() {
  const journal = new AuditJournal();
  const ontology = new Ontology(journal);
  installCoreTypes(ontology);
  const fleet = new FleetOrchestrator({ journal });
  return { journal, ontology, fleet };
}

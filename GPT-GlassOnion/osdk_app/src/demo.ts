import { AuditJournal, runFleet } from "./core.js";
const journal = new AuditJournal();
const result = await runFleet("Map public climate resilience resources in Virginia", [], journal);
console.log(JSON.stringify({ ...result, auditValid: journal.verify() }, null, 2));

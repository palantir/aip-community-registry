import { createHash, randomUUID } from "node:crypto";

export class AuditJournal {
  #events = [];
  append(type, actor, payload = {}) {
    const previousHash = this.#events.at(-1)?.hash ?? "GENESIS";
    const event = { id: randomUUID(), timestamp: new Date().toISOString(), type, actor, payload, previousHash };
    event.hash = createHash("sha256").update(JSON.stringify(event)).digest("hex");
    this.#events.push(Object.freeze(event));
    return event;
  }
  list() { return [...this.#events]; }
  verify() {
    return this.#events.every((event, index) => {
      const { hash, ...unsigned } = event;
      const previous = index ? this.#events[index - 1].hash : "GENESIS";
      return unsigned.previousHash === previous &&
        createHash("sha256").update(JSON.stringify(unsigned)).digest("hex") === hash;
    });
  }
}

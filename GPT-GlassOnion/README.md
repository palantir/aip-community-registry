<div align="center">

# GPT-GlassOnion

### Governed geospatial intelligence, explained clearly.

**Authorized data → governed ontology → map intelligence → bounded agents → human-approved output**

![GPT-GlassOnion governed intelligence flow](images/architecture.svg)

[Explore the API](#five-steps-every-beginner-can-follow) · [Understand the agents](#what-the-agents-actually-do) · [Connect Foundry](#foundry-readiness) · [Review security](SECURITY.md)

</div>

> **Current status:** the TypeScript runtime, tests, build, GeoJSON validation, agent barrier, and evidence generation are CI-verified. A real Palantir Foundry tenant connection is **not yet verified**.

## The idea in one minute

GlassOnion turns approved information into traceable map intelligence. Every input keeps its source. Every automated step is bounded. Every result is recorded. Important decisions stay with a human.

| Layer | Plain-English job | What it produces |
|---|---|---|
| Authorized sources | Accept only public or properly approved information | Source records with a rights basis |
| Governance core | Validate policy, provenance, and geometry | Trusted objects and audit events |
| Geospatial layer | Place valid points, lines, and polygons on a map | A GeoJSON FeatureCollection |
| Specialist waves | Run 24 limited research roles in a fixed plan | Individual findings with citations |
| Human review | Allow synthesis only after every specialist succeeds | Reviewable output for Zyra or Foundry |

## Five steps every beginner can follow

1. **Send approved data.** GlassOnion receives a source or GeoJSON feature.
2. **Check it.** The service validates rights, policy, coordinates, and required fields.
3. **Organize it.** Valid information becomes typed map-ready data with provenance.
4. **Analyze it.** Twenty-four bounded specialist profiles run in waves of **3 → 6 → 7 → 9**.
5. **Review it.** A coordinator can synthesize only after all 24 specialists succeed; a human remains responsible for consequential decisions.

## What is real today

- Strict WGS84 validation for GeoJSON Point, LineString, and Polygon geometries
- Process-scoped feature storage and FeatureCollection export
- TypeScript Fastify API and React/Vite dashboard
- A fixed 24-specialist completion barrier plus one coordinator
- SHA-256 chained audit events and source citations
- Civilian-use governance controls
- Cloud CI for tests, type checking, frontend/backend builds, and evidence generation

GlassOnion is cloud-only. This repository contains source code for the reference application—not a downloadable model, credentials, customer data, or a claim of Palantir affiliation.

## Quick cloud verification

Run these commands inside an authorized GitHub Actions, Foundry, or other cloud build environment:

```bash
cd GPT-GlassOnion/osdk_app
npm install
npm run quality
npm start
```

The production service compiles from `src/server.ts`. Historical JavaScript files are examples, not the production test authority.

## API command deck

| Route | What it does |
|---|---|
| `GET /api/health` | Reports runtime, audit, and configuration status |
| `POST /api/geo/features` | Validates and stores one authorized map feature |
| `GET /api/map.geojson` | Exports the current FeatureCollection |
| `POST /api/swarm/run` | Runs the bounded specialist workflow |
| `GET /api/audit` | Returns the tamper-evident event journal |

Example map feature:

```json
{
  "id": "richmond-resource-1",
  "geometry": {"type": "Point", "coordinates": [-77.436, 37.54]},
  "properties": {"name": "Public resilience resource", "rightsBasis": "public"}
}
```

The current store lasts only for the cloud process lifetime. A production tenant should replace it with approved Ontology objects and Actions while preserving the same validation boundary.

## What the agents actually do

“Agent” means a registered task profile—not consciousness or independent authority. The reference plan contains 25 executions:

- Executions 1–24: bounded specialist profiles
- Execution 25: synthesis coordinator
- Barrier rule: all 24 specialist outcomes are recorded
- Failure rule: one specialist failure blocks synthesis
- Governance rule: consequential decisions require human approval

## Foundry readiness

The adapter can construct an OSDK client after these values are supplied as cloud secrets:

```text
FOUNDRY_API_URL=https://<enrollment>.palantirfoundry.com
FOUNDRY_ONTOLOGY_RID=ri.ontology.main.ontology.<id>
FOUNDRY_CLIENT_ID=<Developer Console service client>
FOUNDRY_CLIENT_SECRET=<cloud secret; never commit>
```

`foundryConfigured: true` means only that all four values exist. It does **not** prove authentication, generated Ontology bindings, deployment, or tenant verification.

To complete real tenant verification:

1. Generate object and Action bindings in Developer Console.
2. Install the generated SDK package in the authorized cloud build.
3. Connect approved definitions through `src/palantir.ts`.
4. Give the service identity only the permissions it needs.
5. Run a harmless authenticated Ontology read.
6. Retain evidence without committing secrets or customer data.

## Trust boundary

Use only public or properly authorized data. Preserve source URL, rights basis, retrieval time, hashes, citations, confidence, and lineage. The default policy rejects weapon targeting, covert surveillance, facial tracking, credential bypass, and autonomous physical-force workflows.

## Technical requirements

- Node.js 20+
- A Palantir Foundry/AIP tenant for platform integration
- Appropriate Ontology, Action, and Compute Module permissions
- Tenant-generated OSDK bindings for verified Foundry deployment

## Official references

- [Palantir Ontology overview](https://www.palantir.com/docs/foundry/ontology/overview/)
- [Ontology core concepts](https://www.palantir.com/docs/foundry/ontology/core-concepts/)
- [Ontology objects on maps](https://www.palantir.com/docs/foundry/map/integrate-objects/)
- [Action logs](https://www.palantir.com/docs/foundry/action-types/action-log/)
- [Foundry security overview](https://www.palantir.com/docs/foundry/security/overview/)

## License

Apache License 2.0. See [LICENSE](LICENSE).

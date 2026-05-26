# SENRA — Supply and Economic Network Risk Analysis

> A data intelligence tool scoring all 37 Indian states and Union Territories on supply chain risk across 7 structural dimensions. Built to support distribution strategy, logistics planning, and regional risk assessment.

Live tool: https://senra.in  
Author: Harsh Menon · Cambridge AS Level candidate · Mumbai, India  
Data vintage: 2023–24 government publications

---

## The problem

India's logistics landscape is not one market — it is 37 overlapping markets with different road quality, monsoon exposure, cold storage capacity, power reliability, and distributor density. A company making a single national distribution decision is implicitly making 37 different risk decisions, most of them with incomplete information.

Existing tools either operate at the national level (masking state-level variation) or require expensive proprietary data. SENRA provides a free, transparent, and methodologically documented alternative.

---

## What SENRA scores

Seven dimensions of supply chain fragility, each sourced from government data:

| # | Dimension | Source | Default Weight |
|---|---|---|---|
| 1 | Road Infrastructure | MoRTH Annual Report 2023–24 | 22% |
| 2 | Distributor Density | MCA/MSME registrations | 18% |
| 3 | Monsoon Disruption Risk | IMD rainfall statistics | 18% |
| 4 | Logistics Access | LEADS 2023 (Ministry of Commerce) | 16% |
| 5 | Power Grid Reliability | CEA Annual Report 2023–24 | 12% |
| 6 | Cold Chain Infrastructure | NCCD state-wise capacity data | 8% |
| 7 | Distributor Concentration | Derived from MCA district-level data | 6% |

Six sector presets (Default, FMCG, Pharma, Cold Chain, E-Commerce, Agriculture) reweight these dimensions to reflect sector-specific operational priorities.

---

## Features

- **Choropleth map** — all 37 states coloured by risk band, click any state for full breakdown
- **Sector presets** — switch between 6 industry weight profiles; map updates in real time
- **State comparison** — side-by-side radar chart and dimension table for any two states
- **Corridor scoring** — aggregate risk score for any A→B supply route across traversed states
- **Historical trends** — year-on-year composite scores from 2019–2024
- **Uncertainty bands** — ±range on every score reflecting data proxy quality
- **Export** — CSV of all 37 states with dimension scores

---

## Methodology

Scores are normalised using clipped min-max normalisation (5th–95th percentile clipping to prevent outlier compression). Higher scores indicate higher fragility. Risk bands: CRITICAL (≥70), HIGH (50–69), MODERATE (30–49), LOW (<30).

Full methodology, data sources, normalisation formula, and limitations: https://senra.in/methodology

---

## Stack

- **Framework:** Next.js 14 (App Router), TypeScript
- **Database:** SQLite via `better-sqlite3` (auto-created on first request; no runtime DB server)
- **Map:** `react-simple-maps` with India GeoJSON
- **Deployment:** Vercel (deploys from `main`)
- **No external API dependencies** — all scores are precomputed from static government data


```

The database is created and seeded automatically on first load. No setup, no accounts, no environment variables needed.

---

## API

| Endpoint | Description |
|---|---|
| `GET /api/scores?sector=default` | All 37 states ranked by fragility |
| `GET /api/scores/:slug` | Full state profile with history |
| `GET /api/compare?states=a,b&sector=default` | Side-by-side comparison |
| `GET /api/meta` | Data freshness and confidence metadata |

---

## Data sources

See [`data/sources.md`](data/sources.md) for full citations, URLs, and methodology notes per dimension.

---

## Limitations

SENRA captures formal, registered, government-reported infrastructure. It does not capture:
- Informal distribution networks (significant in Bihar, UP)
- Real-time disruption events (strikes, floods, road closures)
- Private logistics infrastructure (3PL warehouses, dark stores)
- Drought risk (the monsoon dimension captures excess rainfall, not deficit)

See the [Limitations section](https://senra.vercel.app/methodology#limitations) for full discussion.

---

## Citing SENRA

```
Menon, Harsh. (2024). SENRA: Supply and Economic Network Risk Analysis [Data tool].
Retrieved from https://senra.in
```

---

## Licence

MIT. Data is sourced from Indian government publications under India's National Data Sharing and Accessibility Policy (NDSAP).

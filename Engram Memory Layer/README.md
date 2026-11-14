# Engram — Persistent Memory Layer for Palantir AIP

**Category:** AI / Analyst Tooling  
**Contributor:** Tanmay Sangam (crossagent.si)  
**MCP Compatible:** Yes — works alongside `@palantir/mcp`

---

## What it does

Palantir's MCP server gives Claude live access to Foundry datasets, ontology objects, and AIP functions. But when the analyst session closes, Claude forgets everything. Tomorrow the analyst starts from zero.

**Engram runs alongside `palantir-mcp` as a second MCP server.** Every Foundry session is recorded. Patterns emerge across sessions. The analyst's query trajectory is decoded over time. Claude enters every new session already knowing where the investigation has been — and where it's heading.

> Palantir knows what's in the data. Engram knows how the analyst thinks about it.

---

## The gap this fills

| What palantir-mcp provides | What Engram adds |
|---|---|
| Live Foundry dataset access | Memory that persists after the session |
| Ontology object queries | Pattern intelligence across sessions |
| AIP function execution | Prediction of what dataset is needed next |
| One-session context | Cross-session analysis trajectory |
| — | Anomaly detection: query pattern breaks |

---

## Setup

**Prerequisites:** Palantir Foundry access, Claude Desktop, Engram API key (free at crossagent.si)

### Step 1 — Get Engram API key

Sign in at [crossagent.si](https://crossagent.si) → Dashboard → API Keys → Generate.

### Step 2 — Add both MCP servers to Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "palantir": {
      "command": "npx",
      "args": ["@palantir/mcp", "--profile", "your-profile"],
      "env": {
        "FOUNDRY_URL": "https://your-stack.palantirfoundry.com"
      }
    },
    "engram": {
      "url": "https://backend-wine-phi-85.vercel.app/mcp",
      "type": "http",
      "headers": {
        "Authorization": "Bearer eng_your_key_here"
      }
    }
  }
}
```

### Step 3 — Use in a session

Open Claude Desktop. Run these Engram tools alongside your normal Foundry queries:

```
# At session start — get pattern signal from past sessions
get_context(prompt="reviewing threat vector analysis for sector 7")

# After querying Foundry — record what you found
foundry_session(
  dataset="flight_risk_model",
  query_intent="evaluating anomaly spike in sector 7 access logs",
  insight="Tuesday spike correlates with contractor badge access — not personnel"
)

# End of week — see your analysis pattern
pattern_signal()
```

---

## MCP Tools Provided

| Tool | Description |
|---|---|
| `foundry_session` | Records a Foundry query session — dataset, intent, insight |
| `pattern_signal` | Returns cognitive fingerprint: dominant data domain, velocity, prediction |
| `get_context` | Injects pattern signal + relevant past sessions before Claude sees your query |
| `recall` | Semantic search across all past Foundry sessions |
| `remember` | Store any free-form analyst note |

---

## What unlocks after 50 sessions

The pattern engine has enough signal to:

- Identify your **dominant data domain** (which ontology types you gravitate toward)
- Track **velocity** — which domains are accelerating in your queries
- **Predict** what dataset you'll need before you search for it
- **Detect anomalies** — when your query pattern breaks its established shape

This is not Palantir's intelligence about the world. It is intelligence about how the analyst thinks about Palantir data. That is a different and complementary capability.

---

## Security

- All memories are stored in a vector database under your Engram user ID (Clerk-authenticated)
- Engram never sees your Foundry credentials or raw dataset contents — only the natural language descriptions you choose to store via `foundry_session`
- API keys are SHA-256 hashed, never stored in plaintext
- MCP connection is HTTPS, Bearer token auth

---

## Links

- **Integration docs:** https://crossagent.si/integrations/palantir
- **MCP server:** https://backend-wine-phi-85.vercel.app/mcp
- **Dashboard:** https://crossagent.si/dashboard
- **Source:** https://github.com/crossagent-si (private, available on request)
- **Contact:** sangam.d@northeastern.edu

# Persistent Memory for AI Agents

A persistent memory layer for AI coding tools that uses Palantir AIP as the enterprise knowledge backend. Gives AI agents permanent memory across sessions — every decision, edit, and conversation is encoded, scored, and stored in the Ontology.

## Overview

AI coding agents lose all context between sessions. This project solves that by intercepting agent conversations, encoding them into hyperdimensional vectors, scoring each message for information value, and storing the results in a Palantir AIP Ontology. The next session recalls relevant context automatically.

### Key Features

- **HDC Encoding**: 4096-dimensional hyperdimensional vectors using character trigrams, word-level encoding, and bigram features for typo-tolerant similarity search
- **AIF-Inspired Gating**: Active Inference-inspired scoring system that evaluates each message for novelty, content quality, and information value before storage — noise stays out, decisions get maximum priority
- **Contextual Rule Tree**: Automatically learns repeated preferences and organizes them into a hierarchical tree that activates rules based on what you're currently working on
- **Excitation Detection**: Distinguishes breakthroughs from routine conversation using speaker-calibrated arousal detection — works differently for casual users vs formal AI responses
- **Topic Shift Detection**: Tracks conversation flow via word overlap and regime tagging, triggering context condensation when topics change
- **Dual Backend**: SQLite for individual developers (zero config), AIP Ontology for enterprise (shared knowledge graph)

## Ontology Schema

Uses two object types with no custom schemas required:

### MemoryEntry
| Property | Type | Purpose |
|---|---|---|
| `raw_text` | string | The message content |
| `source` | string | "user", "assistant", "rule", "condensed" |
| `hdc_vector` | Vector (4096) | HDC-encoded content vector for similarity search |
| `tm_label` | string | Classification label or rule hierarchy path |
| `regime_tag` | string | Topic regime ("new", "continue", "shift") or rule activation keywords |
| `aif_confidence` | float | Information value score (0.0 = noise, 1.0 = breakthrough) |
| `timestamp` | datetime | When the memory was created |

### Entity
| Property | Type | Purpose |
|---|---|---|
| `name` | string | Entity identifier (concept name, file path, tool name) |
| `type` | string | "concept", "file", "tool", "rule" |
| `observation_count` | string | How many times this entity has been referenced |
| `first_seen` / `last_seen` | string | Temporal bounds |

### Link: `hasMemoryEntries`
Connects Entity → MemoryEntry. Enables graph traversal: "show me all memories about HDC encoding" or "what files were discussed alongside this concept."

### Rules as MemoryEntries
Rules are stored as MemoryEntry objects with `source="rule"`, tree hierarchy encoded in `tm_label` prefix (`rule:core`, `rule:hdc`, `rule:hdc:codebook`), and activation keywords in `regime_tag`. No additional object types needed.

## Installation

### Requirements
- Python 3.10+
- Claude CLI (`claude` command available)
- Palantir AIP developer account with Ontology SDK

### Setup

```bash
git clone https://github.com/bcd532/one.git
cd one
python -m venv .venv && source .venv/bin/activate
pip install -e ".[foundry]"
```

Configure AIP credentials:
```bash
mkdir -p ~/.one
echo "host=https://YOUR-INSTANCE.palantirfoundry.com" > ~/.one/config
echo "YOUR_TOKEN" > ~/.one/token
chmod 600 ~/.one/token
```

### Ontology Setup

1. Create a `MemoryEntry` object type with the properties listed above. Enable the `hdc_vector` property as a Vector type (4096 dimensions).
2. Create an `Entity` object type with the properties listed above.
3. Create a `hasMemoryEntries` link from Entity to MemoryEntry.
4. Generate an Ontology SDK and install it in your environment.

### Running

```bash
one                    # start with AIP backend
one --no-foundry       # SQLite-only mode
```

## Usage

### Commands
| Command | Description |
|---|---|
| `/rules` | Display the contextual rule tree |
| `/rule <text>` | Manually add a root rule |
| `/recall` | Force memory recall for current context |
| `/cost` | Show session cost and turn count |
| `/clear` | Clear the chat display |
| `Ctrl+R` | Force recall (keyboard shortcut) |
| `Ctrl+L` | Clear screen |
| `Esc` | Quit |

### How It Works

1. You send a message → it's immediately displayed and sent to the AI agent
2. In the background: AIF gate scores the message → if it passes, HDC encodes it → pushes to AIP Ontology with extracted entities
3. On topic shifts: finished conversation thread is condensed and stored as a high-value summary
4. On recall triggers: relevant memories are retrieved via vector similarity search and injected as context
5. Active rules are checked every turn and injected based on what files/tools/topics are in play

### Optional: Local LLM Condensation

Install [ollama](https://ollama.ai) and pull Gemma 3 4B for local context condensation:

```bash
ollama pull gemma3:4b
```

When available, the system uses Gemma to condense retrieved memories into tight context blocks before injection, reducing token usage while preserving technical detail.

## Architecture

```
User → one TUI → AIF Gate (score) → HDC Encoder (4096-dim) → AIP Ontology
                                                            → Entity Extraction
                                                            → Rule Learning

Recall: Query → HDC encode → nearest_neighbors on Ontology → inject context
Rules:  Per-turn → match activation keywords → inject active branch
```

## Repository

Full source: [github.com/bcd532/one](https://github.com/bcd532/one)

## License

MIT

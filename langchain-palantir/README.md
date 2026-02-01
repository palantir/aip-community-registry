# LangChain on Palantir AIP

langchain-palantir is a library that allows users to call Palantir-provided LLMs in the LangChain framework. It provides LangChain wrappers around Palantir-provided LLMs, and can be used anywhere Palantir-provided LLMs can be used.

## Installation
**TODO: Upload Marketplace .zip file. My AIP account is currently an AIP Developer Tier account and does not support exporting marketplace .zip files.**

Since I do not have a marketplace .zip file yet, the only way to install langchain-palantir currently is to copy or clone the contents of the [GitHub Repository](https://github.com/dragonejt/langchain-palantir.git), upload them to a Palantir Python Library Code Repository, and build a Palantir Python Library from that.

Install langchain-palantir like any other Palantir conda package, with the Libraries left sidebar in a Code Repository or Code Workspace. langchain-palantir currently requires Python version 3.11 or later, and LangChain v1.0.

## Supported Features

### Chat Models

| Chat Model              | Model Family     | Chat Completions | Tool Calling | Image Input |
| ----------------------- | ---------------- | ---------------- | ------------ | ----------- |
| `PalantirChatOpenAI`    | OpenAI GPT       | ✅               | ✅           | ✅          |
| `PalantirChatAnthropic` | Anthropic Claude | ✅               | ✅           | ✅          |
| `PalantirChatGeneric`   | Meta Llama, etc. | ✅               | ❌           | ❌          |

### Embedding Models

| Embedding Model             | Embed Query | Embed Documents |
| --------------------------- | ----------- | --------------- |
| `PalantirGenericEmbeddings` | ✅          | ✅              |

### Vector Stores

| Vector Store       | Add/Remove Vectors | Similarity Search |
| ------------------ | ------------------ | ----------------- |
| `PalantirOntology` | ✅                 | ✅                |

### Document Loaders

| Vector Store              | Images (PNG/JPG) | PDFs |
| ------------------------- | ---------------- | ---- |
| `PalantirVisionLLMLoader` | ✅               | ❌   |

## Usage

langchain-palantir can be used like any other LangChain extension. Examples use LangChain v1.0.

### Basic Agentic Workflow

```python
model = OpenAiGptChatLanguageModel.get("GPT_4_1")
llm = PalantirChatAnthropic(model=model)

messages = [
  HumanMessage("Using the date_time tool, what is today's date?")
]

@tool
def date_time() -> datetime:
  """
  Returns the current datetime in python.
  Parameters: None
  """

  return datetime.now(timezone.utc)

agent = create_agent(model=llm, tools=[date_time])
answer = agent.invoke({"messages": messages})
```

### Basic Multimodal Workflow

```python
model = AnthropicClaudeLanguageModel.get("AnthropicClaude_4_Sonnet")
llm = PalantirChatAnthropic(model=model)

image_data = b64encode(pizza_jpg.read()).decode("utf-8")
messages = [
  HumanMessage("What is in the following image?"),
  HumanMessage(
    [
      {
        "type": "image",
        "source_type": "base64",
        "data": image_data,
        "mime_type": "image/jpeg",
      }
    ]
  ),
]

answer = llm.invoke(messages)
```

### Using Palantir Embedding Models

```python
model = GenericEmbeddingModel.get("Snowflake_Arctic_Embed_M")
texts = ["Hello World", "Hello AI"]
embedding = PalantirGenericEmbeddings(model=model)

embeddings = embedding.embed_documents(texts)
```

### Notes on Palantir Ontology Vector Store

Using the Palantir Ontology as vector store requires creating an Ontology object with a very specific configuration. The object must have the following four properties:

- `id` of type STRING, the primary key.
- `text` of type STRING, the text content of the document.
- `vector` of type VECTOR (ARRAY[FLOAT]), the vector representation of the document.
- `metadata` of type STRING, metadata about the document in JSON format.

All four properties must be backed by actual dataset columns, not user edits. Additionally, there must also exist the `create` and `delete` object actions, to create and delete instances of these objects. These will be passed into `OntologyActions` for the vector store to use.

Finally, an Ontology SDK must be generated, with Python OSDK v2. `with AllowBetaFeatures()` must also be enabled for vector similarity search to work.

### Using Palantir Document Loader

```python
model = VisionLLMDocumentPageExtractor.get("GPT_4_1")
document = Path("a_tale_of_two_cities.jpg")

loader = PalantirVisionLLMLoader(
  model=model,
  documents=[document],
)

documents = loader.load()
```
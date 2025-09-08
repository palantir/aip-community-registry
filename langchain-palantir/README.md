# LangChain on Palantir AIP

langchain-palantir is a library that allows users to call Palantir-provided LLMs in the LangChain framework. It provides LangChain wrappers around Palantir-provided LLMs, and can be used anywhere Palantir-provided LLMs can be used.

## Installation
**TODO: Upload Marketplace .zip file. My AIP account is currently an AIP developer tier account and does not support downloading marketplace .zip files.**

Since I do not have a marketplace .zip file yet, the only way to install langchain-palantir currently is to copy or clone the contents of the [GitHub Repository](https://github.com/dragonejt/langchain-palantir.git), upload them to a Palantir Python Library Code Repository, and build a Palantir Python Library from that.

Once built, install langchain-palantir like any other Palantir conda package, with the Libraries left sidebar in a Code Repository or Code Workspace. langchain-palantir currently requires Python version 3.11.10 or later.

## Supported Features

### Chat Models

| Chat Model              | Model Family     | Chat Completions | Tool Calling | Image Input |
| ----------------------- | ---------------- | ---------------- | ------------ | ----------- |
| `PalantirChatOpenAI`    | OpenAI GPT       | ✅               | ✅           | ✅          |
| `PalantirChatAnthropic` | Anthropic Claude | ✅               | ✅           | ✅          |
| `PalantirChatGeneric`   | Meta Llama       | ✅               | ❌           | ❌          |

### Embedding Models

| Embedding Model             | Embed Query | Embed Documents |
| --------------------------- | ----------- | --------------- |
| `PalantirGenericEmbeddings` | ✅          | ✅              |

## Usage

langchain-palantir can be used like any other LangChain extension.

### Basic Tool Calling Workflow

```python
model = OpenAiGptChatLanguageModel.get("GPT_4_1")
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

tools = {"date_time": date_time}

llm = PalantirChatOpenAI(model=model)
llm_with_tools = llm.bind_tools(tools.values())
answer = llm_with_tools.invoke(messages)
messages.append(answer)

for tool_call in answer.tool_calls:
  messages.append(tools[tool_call["name"]].invoke(tool_call))

final_answer = llm_with_tools.invoke(messages)
```

### Basic Multimodal Workflow

```python
model = AnthropicClaudeLanguageModel.get("AnthropicClaude_4_Sonnet")
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

llm = PalantirChatAnthropic(model=model)

answer = llm.invoke(messages)
```

### Using Palantir Embedding Models

```python
model = GenericEmbeddingModel.get("Text_Embedding_3_Small")
texts = ["Hello World", "Hello AI"]
embedding = PalantirGenericEmbeddings(model=model)

embeddings = embedding.embed_documents(texts)
```

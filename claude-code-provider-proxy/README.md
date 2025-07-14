# Provider Proxy for Claude Code

A proxy service that allows Anthropic API requests to be routed through an OpenAI-compatible URL to access alternative models.

![Claude Proxy Logo](docs/cover.png)

## Overview

Claude Proxy provides a compatibility layer between Claude Code and alternative models available through OpenRouter or your chosen base URL. It dynamically selects models based on the requested Claude model name, mapping Opus/Sonnet to a configured "big model" and Haiku to a "small model".

Key features:

- FastAPI web server exposing Anthropic-compatible endpoints
- Format conversion between Anthropic and OpenAI requests/responses
  (see [mapping](docs/mapping.md) for translation details)
- Support for both streaming and non-streaming responses
- Dynamic model selection based on requested Claude model
- Detailed request/response logging
- Token counting

## Example

**Model**: `deepseek/deepseek-chat-v3-0324`

![Claude Proxy Example](docs/example.png)

## Getting Started

### Prerequisites

- Python 3.10+
- OpenRouter API key
- [uv](https://github.com/astral-sh/uv)

### Configuration

Create a `.env` file with your configuration:

```env
OPENAI_API_KEY=<key>
BIG_MODEL_NAME=google/gemini-2.5-pro-preview
SMALL_MODEL_NAME=google/gemini-2.0-flash-lite-001
LOG_LEVEL=DEBUG
```

See `config.py` for more configuration options.

#### Useful environment variables

`CLAUDE_CODE_EXTRA_BODY`
`MAX_THINKING_TOKENS`
`API_TIMEOUT_MS`
`ANTHROPIC_BASE_URL`
`DISABLE_TELEMETRY`
`DISABLE_ERROR_REPORTING`

### Running the Server

```bash
uv run src/main.py
```

### Running Claude Code

```bash
ANTHROPIC_BASE_URL=http://localhost:8080 claude
```

## Usage

The proxy server exposes the following endpoints:

- `POST /v1/messages`: Create a message (main endpoint)
- `POST /v1/messages/count_tokens`: Count tokens for a request
- `GET /`: Health check endpoint

## License

[LICENSE](./LICENSE)

# IdeaProbe — Open-source AI market research & competitor analysis

[简体中文](README.zh-CN.md) · [Project homepage](https://pauline-zhang-star.github.io/IdeaProbe/) · [Project summary for AI tools](https://pauline-zhang-star.github.io/IdeaProbe/llms.txt)

A local web app that turns a product idea into a sourced market research report. Discover competitors, collect available reviews and discussions, and compare opportunities using your own model and search API keys.

**Use cases:** product idea validation research, competitor discovery, app review analysis, open-source tool research, and market research for indie developers and creators.

## 45-second demo

[![Watch the IdeaProbe introduction video](docs/assets/ideaprobe-demo-cover.jpg)](https://pauline-zhang-star.github.io/IdeaProbe/demo/)

Watch the 45-second introduction: confirm your idea, discover related products, inspect collected evidence, and review the sourced report.

## Features

- **Confirm before research:** edit the interpreted idea, problem, audience, scenario and search keywords. Broad discovery comes first; audience and scenario inform ranking rather than excluding products.
- **Parallel search:** every query runs across all enabled and available sources: Bing RSS, Tavily and Brave. Results are merged and deduplicated; failures show their reasons. Sparse results trigger new keywords within the configured budget.
- **Research the top candidates:** investigate the top 10 by default, adjustable to 5 or fewer. Other candidates remain visible with scores and reasons they were not selected. If fewer candidates are available, research those found.
- **Real feedback:** discover and verify App Store, Google Play and discussion links. Collect what is available; reviews and discussion pages are counted separately. Marketing text is not user feedback, and missing reviews are never invented.
- **Bring your own models:** choose separate providers and models for understanding/keyword generation/extraction and for the final report. Supports OpenAI, Anthropic Claude, Google Gemini and services compatible with OpenAI Chat Completions and JSON output.
- **Local history and export:** progress indicators, collapsible report sections, saved tasks, JSON download and browser print to PDF.
- **Chinese and English:** follows the browser’s first preferred language (Chinese for `zh`, otherwise English), with a manual switch. New reports use the selected interface language; existing reports are not automatically translated.

## Quick start

Requires **Node.js 24+** and **Python 3.9+**. No database, Docker or cloud deployment is needed. There are no Node package dependencies.

```sh
git clone https://github.com/pauline-zhang-star/IdeaProbe.git
cd IdeaProbe
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements.txt
cp .env.example .env
```

Set `PYTHON_BIN=.venv/bin/python` in `.env`, then start:

```sh
npm start
```

Open **http://localhost:3210/**. In **API settings**, select a provider, enter model names and your API key, and save. Configure Tavily or Brave if wanted; Bing RSS is enabled without a search key.

The two stages can use different providers. A saved key is shared when both use the same provider and endpoint. “Configured” means a key is stored; it does not verify access or quota.

On Windows, use `.venv\Scripts\python.exe` for installation and `PYTHON_BIN=.venv/Scripts/python.exe`. Copy `.env.example` to `.env` with your file manager or `Copy-Item .env.example .env` in PowerShell.

### Model configuration

| Provider | Interface | Configuration |
| --- | --- | --- |
| OpenAI | Chat Completions | Model ID + OpenAI API key |
| Anthropic / Claude | Native Messages API | Claude model ID + Anthropic API key |
| Google / Gemini | Official OpenAI-compatible endpoint | Gemini model ID + Gemini API key |
| OpenAI-compatible service | Chat Completions with JSON output | API base URL + model ID + service key |

Custom addresses must use HTTPS; local services may use HTTP (`localhost` or `127.0.0.1`). Use a base URL such as `https://api.example.com/v1`, without `/chat/completions`. Compatibility and model access depend on the selected service. The current app requires a key for model requests, including custom services.

Default OpenAI model IDs are `gpt-6-luna` for understanding/extraction and `gpt-6.1-sol` for reports; replace them with IDs available to your account. Other providers require you to enter their model IDs.

Keys are saved by provider and endpoint in `.data/search-settings.json`; switching services does not reuse another service's key. Password fields never display stored keys. Enter a new key to replace the existing one. Settings apply to subsequent requests without restarting.

You can also configure OpenAI and search keys in `.env`:

```dotenv
OPENAI_API_KEY=
OPENAI_MODEL=gpt-6-luna
OPENAI_REPORT_MODEL=gpt-6.1-sol
TAVILY_API_KEY=
BRAVE_API_KEY=
PYTHON_BIN=.venv/bin/python
PORT=3210
DATA_DIR=.data
MODEL_MAX_OUTPUT_TOKENS=6000
MODEL_TIMEOUT_MS=180000
```

Saved webpage settings take precedence over environment settings. Tavily is used for reading page bodies; without it, product evidence uses search snippets and shows that limitation. Bing's public RSS endpoint may be unavailable or return poor results.

## Workflow

1. Enter your idea, market/language codes and optional known competitors.
2. Click **Understand my idea**, then edit and confirm the interpretation and actual search phrases.
3. Set research limits for search requests, feedback-source searches, pages, tokens, reviews and target products.
4. Search broadly, expand sparse results, score candidates and investigate the selected products.
5. Collect available reviews and verified discussions, analyze evidence, then generate and validate report citations.
6. Expand report cards, inspect coverage and sources, download JSON or print to PDF.

Collect only available feedback. Products remain in the report when no reviews are found, without unsupported user-feedback claims. Selected products and coverage contain at most 10 products; other candidates appear separately.

Closing the browser does not cancel a task. Stopping the server or shutting down the computer interrupts it; restart and continue confirmed tasks from local history. Completed stages are reused. A request interrupted before its result was saved may incur another charge when repeated.

## Data, cost and limits

- Tasks are saved under `.data/<task-id>/state.json`, with evidence and report artifacts alongside them. There is no shared database or cross-user cache in this version.
- Keys and research records stay on your computer; research content is sent to the model/search providers you use. Nothing is sent to the project author.
- Running this app does not require a subscription to the project. External providers may charge for model and search requests. Request/token limits control usage, but are not a guaranteed monetary spending cap.
- The server binds to `127.0.0.1` for local use. This version has no authentication and is not prepared for public hosting.
- Search cannot guarantee complete web coverage. Ranking is an AI estimate, not an objective market score. Valid citation IDs do not guarantee every associated claim is correct; inspect the linked evidence.
- App review collection uses unofficial interfaces and may break or return no reviews. Discussion pages are not verified purchase reviews.
- Hosted subscriptions, payments, a shared product database and incremental cross-user data reuse are not implemented.

## Development

```sh
node --test tests/*.test.ts
python3 -m unittest discover -s tests -p 'test_*.py'
```

Tests use isolated temporary data and simulated provider responses; no paid API calls are required. Claude, Gemini and custom-provider request formats have automated coverage; real end-to-end calls require your own corresponding credentials.

```text
app/          Local server, UI, research workflow, providers and file storage
collectors/   Python App Store / Google Play review collection
tests/        Workflow, model routing, search, localization and collector tests
.env.example  Configuration template without credentials
```

## License

MIT — see [LICENSE](LICENSE).

If a research step times out after evidence has been collected, the app automatically generates a report from available data and lists timed-out and unfinished steps. If report generation also times out or cannot produce a valid partial report, it displays collected source excerpts, explicitly marked as unanalysed. It does not fabricate missing findings.

30% of the total token budget is reserved for evidence analysis and reporting (minimum 12,000, capped by the total). Discovery/extraction pauses before consuming this reserve. “Generate report from existing results” stops further searches and collection, analyzes saved feedback using available reserved tokens, and generates a report. Final report context is reduced to fit the remaining budget; stored evidence is retained. If no model budget remains, it falls back to an explicitly unanalysed evidence report.

New tasks default to 1,000,000 tokens: 700,000 for research and 300,000 reserved for analysis/reporting. Users can adjust the limit. Incomplete reports retain every workflow step and report category, showing the status and reason for missing content.

## Requirement coverage

Confirm an editable requirement list grounded in the original idea. Search plans cover distinct requirement dimensions. Candidate capabilities are supported, unsupported or unknown; confirmed claims require exact source quotes. Ranking uses evidence-backed requirement matching, retaining partial matches. After broad discovery, uncovered needs or a single dominant product form trigger up to two supplemental search rounds even when enough products exist. Coverage searches have an adjustable separate budget (default 20 provider requests). Selected products are rechecked using available product-page evidence. Reports display capability coverage, citations and stopping reasons. The mechanism applies to software, hardware and services.

Public documentation: [English product facts](https://pauline-zhang-star.github.io/IdeaProbe/en/facts/) and [Markdown reference](https://pauline-zhang-star.github.io/IdeaProbe/en/facts/index.md). Site content and FAQ schema are generated from `docs/site-data.json`; run `node scripts/build-site.mjs` after updating facts. See [discovery maintenance notes](SITE_DISCOVERY.md) for crawler scope and verification.

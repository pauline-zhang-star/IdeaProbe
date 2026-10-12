# IdeaProbe — Open-source AI market research & competitor analysis

[Project homepage](https://pauline-zhang-star.github.io/IdeaProbe/) · [Project summary for AI tools](https://pauline-zhang-star.github.io/IdeaProbe/llms.txt)

A local web app that turns a product idea into a sourced market research report. Discover competitors, collect available reviews and discussions, and compare opportunities using your own model and search API keys.

本地运行的产品前期调研工具：输入想法，确认 AI 的理解和检索词，搜索相关产品、采集真实评价，生成带来源引用的报告。使用你自己的 API key。

**Use cases:** product idea validation research, competitor discovery, app review analysis, open-source tool research, and market research for indie developers and creators.

**用途：** 产品想法前期调研、竞品搜索、App 用户评价分析、开源工具调研、独立开发者与创作者市场研究。

## Features / 功能

- **Confirm before research:** edit the interpreted idea, problem, audience, scenario and search keywords. Broad discovery comes first; audience and scenario inform ranking rather than excluding products.
- **Parallel search:** every query runs across all enabled and available sources: Bing RSS, Tavily and Brave. Results are merged and deduplicated; failures show their reasons. Sparse results trigger new keywords within the configured budget.
- **Research the top candidates:** investigate the top 10 by default, adjustable to 5 or fewer. Other candidates remain visible with scores and reasons they were not selected. If fewer candidates are available, research those found.
- **Real feedback:** discover and verify App Store, Google Play and discussion links. Collect what is available; reviews and discussion pages are counted separately. Marketing text is not user feedback, and missing reviews are never invented.
- **Bring your own models:** choose separate providers and models for understanding/keyword generation/extraction and for the final report. Supports OpenAI, Anthropic Claude, Google Gemini and services compatible with OpenAI Chat Completions and JSON output.
- **Local history and export:** progress indicators, collapsible report sections, saved tasks, JSON download and browser print to PDF.
- **中文 / English:** follows the browser's first preferred language (Chinese for `zh`, otherwise English), with a manual switch. New reports use the selected interface language; existing reports are not automatically translated.

## Quick start / 本地启动

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

在网页右侧选择模型供应商、填写模型名称和自己的 API key，然后保存。理解/抽取和最终报告可以使用不同供应商；同一供应商及地址共用已保存的 key。提示“已配置”表示已保存密钥，不代表已验证权限或额度。

On Windows, use `.venv\Scripts\python.exe` for installation and `PYTHON_BIN=.venv/Scripts/python.exe`. Copy `.env.example` to `.env` with your file manager or `Copy-Item .env.example .env` in PowerShell.

### Model configuration / 模型配置

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
```

Saved webpage settings take precedence over environment settings. Tavily is used for reading page bodies; without it, product evidence uses search snippets and shows that limitation. Bing's public RSS endpoint may be unavailable or return poor results.

## Workflow / 调研流程

1. Enter your idea, market/language codes and optional known competitors.
2. Click **Understand my idea**, then edit and confirm the interpretation and actual search phrases.
3. Set research limits for search requests, feedback-source searches, pages, tokens, reviews and target products.
4. Search broadly, expand sparse results, score candidates and investigate the selected products.
5. Collect available reviews and verified discussions, analyze evidence, then generate and validate report citations.
6. Expand report cards, inspect coverage and sources, download JSON or print to PDF.

评论拿到多少算多少。没有评论仍可展示产品信息，但不会生成没有证据的“实际用户反馈”。报告的重点调查和采集覆盖最多包含 10 个入选产品；其他候选单独展示。

Closing the browser does not cancel a task. Stopping the server or shutting down the computer interrupts it; restart and continue confirmed tasks from local history. Completed stages are reused. A request interrupted before its result was saved may incur another charge when repeated.

## Data, cost and limits / 数据、费用与限制

- Tasks are saved under `.data/<task-id>/state.json`, with evidence and report artifacts alongside them. There is no shared database or cross-user cache in this version.
- Keys and research records stay on your computer; research content is sent to the model/search providers you use. Nothing is sent to the project author.
- Running this app does not require a subscription to the project. External providers may charge for model and search requests. Request/token limits control usage, but are not a guaranteed monetary spending cap.
- The server binds to `127.0.0.1` for local use. This version has no authentication and is not prepared for public hosting.
- Search cannot guarantee complete web coverage. Ranking is an AI estimate, not an objective market score. Valid citation IDs do not guarantee every associated claim is correct; inspect the linked evidence.
- App review collection uses unofficial interfaces and may break or return no reviews. Discussion pages are not verified purchase reviews.
- Hosted subscriptions, payments, a shared product database and incremental cross-user data reuse are not implemented.

## Development / 开发

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

## License / 许可证

MIT — see [LICENSE](LICENSE).

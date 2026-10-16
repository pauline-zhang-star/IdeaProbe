# IdeaProbe product facts: AI market research, competitor discovery and review analysis

IdeaProbe is an MIT-licensed, open-source local web application for early product market research. Founders, indie developers and creators describe an idea, confirm requirements and search keywords, discover related products, analyze available reviews and discussions, and generate a report with source references. Users configure their own model and search API keys.

Content updated: 2026-10-16

Canonical: https://pauline-zhang-star.github.io/IdeaProbe/en/facts/

## Product facts

- **Product category:** AI market research and competitor analysis software
- **Intended users:** Founders, indie developers and creators researching a product idea
- **Delivery:** Download source code and run locally; this website is documentation, not the research application
- **License and cost:** MIT-licensed software; selected model and search providers may charge API fees
- **Runtime:** Node.js 24+ and Python 3.9+; no database or Docker required
- **Models:** OpenAI, Anthropic Claude, Google Gemini, and compatible Chat Completions services with JSON output
- **Search:** Bing public RSS, Tavily and Brave; all enabled available sources run in parallel for each query
- **Feedback:** Available App Store and Google Play reviews, plus separately verified discussion pages
- **Output:** Source-linked report, requirement capability matrix, collection coverage, JSON export and browser print to PDF
- **Storage:** Local .data directory; research content is sent to the providers selected by the user
- **Default budget:** 1,000,000 total model tokens; limits can be adjusted by the user
- **Current status:** Local first release; no hosted subscription service, shared product database or payment flow

## Research workflow

1. Describe the idea and confirm an editable requirement list grounded in the original input.
2. Review search directions and the proposed keywords before starting research.
3. Search broadly, extract real candidates and distinguish evidence-backed support, evidence-backed non-support and unknown capabilities.
4. Check requirement coverage and product-form diversity even if enough candidates have been found. Run supplemental searches within the configured budget.
5. Rank candidates by confirmed requirement matching; investigate up to 10 selected products and retain the others with reasons.
6. Collect available feedback and generate a cited report. Record unfinished steps, timeouts or budget limits; never invent missing reviews.

## Questions and limitations

### How is IdeaProbe different from a general chatbot?

IdeaProbe provides a repeatable research workflow with editable requirements, multi-source search, ranked candidates, feedback collection, evidence-linked reports and local history. It does not guarantee that every relevant product is discovered or that every claim is correct.

### Can IdeaProbe research apps, open-source tools, hardware and services?

The search and requirement-coverage workflow is general and can research these product types. App Store and Google Play have dedicated review collectors; other products depend on accessible product pages and discussion sources.

### Does finding 10 competitors mean research is complete?

No. Candidate quantity and requirement coverage are separate checks. Unknown requirements or concentration in one implementation form can trigger supplemental searches within a separate adjustable request budget.

### What does unknown capability mean?

No sufficient supporting source text has been verified. Supported and unsupported capability labels require a source reference and an exact quote. Unknown is not proof that a product lacks the feature.

### Can a browser extension be treated as cross-device software?

No. Product shape alone does not prove device support, synchronization or interoperability. Each requirement must be checked separately against available evidence.

### Can IdeaProbe run without paid search keys?

Bing public search RSS is enabled without a search key. Its availability and result quality vary. A model API key is still required; Tavily and Brave are optional keyed sources, and Tavily is used for page-body extraction.

### What happens when tokens run low or a request times out?

The app reserves part of the token budget for analysis and reporting and can generate a report from collected evidence. Incomplete steps and reasons are shown. If model analysis cannot be completed, the fallback is explicitly labeled source excerpts, not a completed analytical report.

### Are review counts guaranteed?

No. Collectors return whatever feedback is available; unofficial store interfaces can fail or return no reviews. Discussion pages are counted separately and are not verified purchase reviews.

### Is there a public hosted app on this site?

No. GitHub Pages hosts product documentation only. The research application runs on the user’s computer at http://localhost:3210/ after installation.

### Are Claude and Gemini integrations proven with live credentials?

Request routing and format have automated tests. Live end-to-end behavior depends on the selected provider, model access and valid user-supplied credentials.

## Source and installation

- https://github.com/pauline-zhang-star/IdeaProbe
- https://github.com/pauline-zhang-star/IdeaProbe/blob/main/LICENSE

These are project-maintainer descriptions of implemented behavior, not independent reviews or measured market outcomes.

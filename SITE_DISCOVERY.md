# Public-site discovery maintenance

IdeaProbe publishes static documentation under `/IdeaProbe/`, not the local research backend.

## Content and generated files

- `docs/en/` and `docs/zh/`: separate language homepages, available without JavaScript.
- `docs/en/facts/` and `docs/zh/facts/`: concise product definition, factual capability table, workflow, FAQ and limitations.
- `facts/index.md`: the same localized reference in plain Markdown.
- `docs/site-data.json`: editable source for product facts, date and FAQ.
- `docs/llms.txt`: optional tool-friendly navigation, not a recognized indexing guarantee.
- `docs/sitemap.xml`: canonical HTML URLs, actual content modification date and reciprocal language references.

After changing product facts, update `docs/site-data.json` and its `updated` date, then run:

```sh
node scripts/build-site.mjs
node --test tests/site.test.ts
```

The generator also updates the homepage definition and metadata. It preserves the homepage design. Generated FAQ schema must always repeat visible answers. Do not add fabricated ratings, customers, benchmark claims, integrations or outcome guarantees.

## Crawling and deployment

Robots exclusion rules are read at the origin root: `https://pauline-zhang-star.github.io/robots.txt`. A file at `/IdeaProbe/robots.txt` does not govern this host. At the time of this audit, the origin robots URL returned 404; no blocking root rules were found. We have not changed another repository or the user's account-level site. Recheck the origin if hosting changes.

Localized pages advertise `index,follow,max-snippet:-1,max-image-preview:large`. These permit indexing and snippets; they do not force crawling, indexing or AI citation. No bot-specific content, prompt injection, hidden keyword lists or special treatment for AI user agents is used. A crawler requesting a language URL gets that complete language page; only the convenience root selects a language for ordinary browsers.

Submit `https://pauline-zhang-star.github.io/IdeaProbe/sitemap.xml` through Google Search Console and Bing Webmaster Tools after verifying site ownership. Those accounts are not configured by this change. No sitemap submission or indexing is claimed. Root-level crawler policy, response headers and custom-domain control would require control of the origin rather than just this project subdirectory.

## Verification

Automated checks cover canonical URLs, local links and anchors, language alternates, nonempty static content, schema/visible FAQ parity, Markdown/source parity and sitemap coverage. Live checks should request public pages without scripts and with a crawler user agent, verify HTTP 200 and confirm expected content. Keep deployment success distinct from search-engine indexing.

References:
- https://developers.google.com/search/docs/appearance/ai-features
- https://developers.google.com/search/docs/crawling-indexing/robots/intro
- https://www.bing.com/webmasters/help/sitemaps-3b5cf6ed

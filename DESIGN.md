# IdeaProbe public website

The public website is a bilingual introduction and reference for the local research app. The homepages help visitors understand the workflow, inspect a real product example, and install locally. Facts pages prioritize reading. The local app has its own interface and is outside this pass.

Preserve the existing pale sage and deep green identity. Use the tokens in `docs/site.css`: ink for headings and the installation code surface, muted green for supporting text, green for actions, and a subtle line for grouping. System sans typography remains consistent with the existing site and the product interface. Use monospace only for commands and configuration.

Homepages use a two-column introduction with an actual report screenshot, followed by an unboxed feature row, research workflow, installation, product reference, and FAQ. At 640px and below, content becomes a single column and navigation wraps into a separate row. Use generous space between sections and tighter spacing within a task. Keep the screenshot explicitly labeled as an example; its counts are not product-wide metrics.

The primary action scrolls to local installation. The secondary action opens the existing English demo. Keep provider costs, local storage, evidence limitations, and bilingual factual content intact. FAQs use native details controls. Provide visible keyboard focus, skip navigation, 44px navigation targets, image dimensions, and reduced-motion support.

`docs/site.css` is the style source. `node scripts/build-site.mjs` embeds it into the generated homepages and facts pages, and produces the root homepage with adjusted paths. The standalone demo links to the same stylesheet. Change localized homepage content in `docs/en/index.html` and `docs/zh/index.html`; change factual reference content in `docs/site-data.json`.

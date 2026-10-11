# Given's portfolio

Static HTML, CSS and JavaScript portfolio. Serve the repository root with any static web server.

## CV

The resume section, hero download link and assistant use `documents/Tuhaise-Given-CV.pdf`. Replace that file when the CV changes and refresh `documents/cv-preview.png` from its first page. Update the resume highlights and CV facts in `js/assistant.js` at the same time.

## Portfolio assistant

The assistant retrieves answers from the current page's project cards, technology stack, About, blog and contact sections, plus curated facts from the supplied CV. Answers link to their sources. It is a browser-local retrieval assistant, not a trained generative model; there are no API keys, model charges or external chat requests. Questions outside its documented knowledge are referred to Given.

CV facts and the original portfolio can describe different versions of a project. The assistant preserves source labels: the portfolio's LAPOK Ventures concept and the CV's Lapok DMS implementation are distinct records. It does not invent deployment status, credential IDs, dates or metrics.

Run checks with `node --test tests/assistant.test.cjs` and `node --check js/main.js`.

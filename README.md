# Resume Review

A resume editing assistant built with Angular and TypeScript. Upload a PDF or image to request structured feedback, review suggested edits, and print a report. A labelled fictional sample demonstrates the results interface without sending a document.

## History and scope

The original repository was committed on **22 January 2026**. The **25 October 2026** maintenance pass preserves that history and replaces browser-side model credentials with a server route. Earlier incomplete or duplicate resume uploads remain archived as reference material. This repository is a 2026 project.

This is a document-feedback prototype. Its scores, skill levels and role matches are subjective model estimates. It is not a validated ATS checker, skills assessment or hiring predictor.

## Architecture

| Part | Responsibility |
| --- | --- |
| Angular 21 + Signals | File selection, progress/errors and result state |
| `src/services/analyzer.service.ts` | Same-origin `/api/analyze` request; no provider key in browser code |
| `api/analyze.ts` | Vercel Edge route: validates document type/size, calls Gemini, validates response |
| Google Gemini REST API | Multimodal document review |
| Browser print | Report export using print styles |

Live analysis sends the uploaded document to the server and Google. The app has no persistent resume-storage feature. Provider retention and data handling depend on the configured Google account terms; the app does not guarantee zero third-party retention.

## Local setup

Use Node.js 22.12+ and npm. Angular 21 and TypeScript versions must satisfy Angular's compiler requirements.

```sh
npm install
npm run dev
```

This starts the frontend. Use **Analyze → View fictional sample report** without a key. A standalone Angular development server does not serve the Vercel API route.

For full-stack development, install the official Vercel CLI, add `API_KEY` in `.env.local` using `.env.example`, link the project, and run `vercel dev`. Configure the same server environment variable on Vercel for deployment. `GEMINI_MODEL` can override the default `gemini-2.5-flash`. Never put a provider key in Angular source or a public environment file.

Documents are limited to **2 MB** to keep base64 requests below common serverless body limits. PDF, PNG and JPEG MIME types and signatures are checked. File signatures are format checks, not malware scanning.

## Checks and current status

```sh
npm test
npm run build
```

Backend regression tests use mocked provider responses and cover request methods, malformed JSON, document limits/signatures, missing configuration, upstream failure and response normalization. TypeScript syntax was checked during maintenance. Angular dependencies were unavailable in the maintenance environment, so a full Angular build, deployed UI and live Gemini request were **not** validated. No live deployment is claimed here.

Before public launch, run the full Angular build, configure the server key, test with a fictional resume, and add authenticated access or rate limiting to prevent quota abuse. Configure hosting privacy/logging appropriately before handling real personal documents.

## Maintenance improvements

- Clear project naming and documentation instead of the generic export README.
- A server-only provider key and normalized JSON response.
- Document size, MIME/signature, request-origin and error checks.
- File-selection reset and a read-generation guard to prevent stale file data after invalid or rapid selections.
- A key-free fictional sample report.
- Removed unsupported ATS, objective scoring, bias-reduction and absolute privacy claims.
- Corrected index configuration, missing stylesheet reference and import-map leftovers.
- Aligned TypeScript with Angular 21 requirements and removed the compiler version-check bypass.

References: [Angular compatibility](https://angular.dev/reference/versions), [Gemini generateContent API](https://ai.google.dev/api/generate-content).

## Reuse

Keep meaningful changes in this repository with new commits. Archived prototype source bundles can supply earlier components, but their dates do not transfer to new work. Production hardening and evaluation against an explicit feedback rubric remain future work.

# Contributing to Kisan Saathi

Thank you for contributing to Kisan Saathi.
This project welcomes contributions from:

- Developers (frontend, backend, AI, QA)
- NGOs and field teams supporting farmers
- Translators and agri-domain experts

## Project Goals

- Make farming support more accessible in local languages
- Keep advice practical, safe, and actionable
- Work reliably on low-connectivity devices

## Quick Start (Developers)

1. Fork and clone:
```bash
git clone https://github.com/vishalgojha/kisan-saathi.git
cd kisan-saathi
```
2. Install dependencies:
```bash
npm install
```
3. Add `.env`:
```env
VITE_APP_ID=your_app_id
VITE_API_BASE_URL=http://localhost:3000
VITE_WHATSAPP_NUMBER=919876543210
VITE_UPLOAD_ENDPOINT=
```
4. Run locally:
```bash
npm run dev
```
5. Validate before PR:
```bash
npm run typecheck
npm run lint
npm run build
```

## Contribution Types

- Bug fixes and stability improvements
- Better TypeScript safety and code quality
- Farmer UX improvements (clarity, language, accessibility)
- New integrations (weather, mandi prices, schemes, diagnostics)
- Documentation and translation improvements

## Code Guidelines

- Use TypeScript-first patterns and explicit types for shared interfaces.
- Avoid `any` unless unavoidable; prefer narrow, readable types.
- Keep components small and focused.
- Add comments only where logic is non-obvious.
- Write user-facing text in plain language.
- Preserve bilingual behavior where applicable.

## Farmer-Safety Content Rules

- Never present AI output as guaranteed diagnosis.
- Include safe-practice language for sprays and chemical usage.
- Encourage local agronomist/extension officer verification for high-risk actions.
- Avoid dangerous recommendations without dosage context.

## NGO / Field-Team Contribution Guide

- Share common farmer questions from field calls/visits.
- Propose wording updates in Hindi/English for clarity.
- Validate whether advice is understandable for low-literacy users.
- Report region-specific crop, mandi, or scheme gaps using GitHub Issues.

When opening an issue from field work, include:

- State/district
- Crop and season
- Farmer question
- What was unclear or missing
- Suggested local-language phrasing

## Branch and Commit Conventions

- Branch naming:
  - `feat/<short-name>`
  - `fix/<short-name>`
  - `docs/<short-name>`
- Commit messages:
  - Keep imperative and concise
  - Example: `Improve weather advisory fallback copy`

## Pull Request Checklist

- Code builds and type-checks
- Lint passes
- UI works on desktop and mobile
- Text changes reviewed for farmer clarity
- Screenshots attached for UI changes
- Linked issue (if applicable)

## Need Help?

- Open a GitHub Discussion/Issue with context and expected behavior.
- For farmer-content changes, tag maintainers and include bilingual text proposal.

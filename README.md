# Meeting Cost Timer

A minimalist, Apple-inspired web app scaffold for tracking the time and financial impact of meetings in real time. This repository is optimized for AI-first collaboration so humans and agents can iterate quickly on the experience.

## Project Overview
- **Purpose:** Provide a transparent view of how much a meeting costs as it unfolds.
- **Current Scope:** Foundational Next.js + TypeScript project with Tailwind CSS, shared documentation, and working tests.
- **Future Enhancements:** Interactive timer controls, attendee role management, live cost graphing, and deploy-ready polish.

## Tech Stack
- [Next.js 16 (App Router)](https://nextjs.org/) with TypeScript
- Tailwind CSS v4 for utility-first styling
- ESLint + Prettier for opinionated linting/formatting
- Vitest + React Testing Library for component and utility tests

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start the development server**
   ```bash
   npm run dev
   ```
   Visit [http://localhost:3000](http://localhost:3000) to view the app.
3. **Run tests**
   ```bash
   npm test
   ```
   Use `npm run test:watch` for interactive feedback while developing components or utilities.
4. **Lint and format**
   ```bash
   npm run lint
   npm run format
   ```

## AI Collaboration Notes
- **Key folders:**
  - `src/app` → Routes, layout, and global styles
  - `src/components` → Reusable UI blocks (include tests in `tests/components`)
  - `src/lib` → Business logic helpers (group complex logic under descriptive filenames)
  - `docs` → Architecture, testing, and collaboration guides
  - `tests` → Vitest test suites mirroring the structure of `src`
- **Working style:**
  1. Review `docs/architecture.md` and `docs/ai-collaboration-guide.md` before large changes.
  2. Prefer small, well-described pull requests with updated documentation when behavior changes.
  3. Keep business rules pure and covered by tests; UI changes should include screenshots when visual output shifts.
- **Adding new features:**
  1. Draft or update relevant doc files first if the change impacts system understanding.
  2. Implement UI in `src/components` or `src/app` and keep logic in `src/lib`.
  3. Add or update tests under `tests/` and run `npm test`.
  4. Run `npm run lint` and `npm run format` before committing.
- **Vercel readiness:** The app uses environment-agnostic defaults and App Router conventions, so it can be deployed directly with `vercel deploy` once environment variables (if any) are configured.

See `/docs` for deeper architectural context, testing strategy, and the collaboration playbook.

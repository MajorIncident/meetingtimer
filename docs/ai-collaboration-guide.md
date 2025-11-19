# AI Collaboration Guide

This repository is designed for autonomous and semi-autonomous agents. Use this guide to orient quickly.

## How to understand this codebase quickly
1. Skim `README.md` for goals, then read `docs/architecture.md` for structure.
2. Inspect `src/app/page.tsx` to see the current UI surface.
3. Browse `src/lib` for business logic entry points (currently `meetingCost.ts`).
4. Review `tests/` for available helpers and testing style.

## Where to add new components
- Create UI primitives in `src/components` and export them from the same file.
- Co-locate stories or usage notes via comments; visual references should go into PR descriptions with screenshots.
- Add corresponding tests under `tests/components/<ComponentName>.test.tsx`.

## How to add a new feature (step-by-step)
1. **Clarify intent**: Update `docs/architecture.md` or add a new doc when the change alters system understanding.
2. **Design the contract**: Define types/interfaces in `src/lib` for any new data shapes.
3. **Implement logic**: Build or extend pure helpers under `src/lib` with matching tests in `tests/lib`.
4. **Create UI**: Compose components in `src/components` and render them via the appropriate route in `src/app`.
5. **Wire state**: Use React hooks or context in the route file; avoid spreading state through unrelated components.
6. **Validate**: Run `npm test`, `npm run lint`, and (if styles changed) take a screenshot for the PR.

## How to write and run tests
- Use Vitest with React Testing Library. Tests live entirely in `/tests` and mirror the `src` tree.
- Import components via the `@/*` alias.
- Run once with `npm test` or interactively with `npm run test:watch`.

## Conventions for file naming & organization
- Components: `PascalCase.tsx` in `src/components`.
- Hooks: `useThing.ts` in `src/lib` or `src/hooks` (create `src/hooks` if/when needed).
- Tests: `<name>.test.ts` or `.test.tsx` inside `tests/<area>/`.
- Docs: `kebab-case.md` to keep paths predictable.

## Checklist before opening a PR
1. Updated or added documentation for any new behaviors.
2. Added/updated tests with meaningful assertions.
3. Ran `npm test` and `npm run lint` with zero errors.
4. Ran `npm run format` so diffs stay clean.
5. Captured screenshots for any UI shift and referenced them in the PR description.
6. Summarized key decisions in the PR body for other agents.

## Checklist after merging (for maintainers)
1. Ensure deployment previews (Vercel) completed successfully.
2. Create follow-up issues/tasks for deferred work noted in the PR.
3. Archive relevant context in `/docs` if the change introduced a new pattern.

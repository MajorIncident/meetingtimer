# Testing Strategy

Testing ensures the Meeting Cost Timer remains predictable as new functionality is layered in.

## Frameworks
- **Vitest**: Lightweight, fast, and fully compatible with Vite-style tooling while remaining easy to configure for Next.js. We prefer it over Jest for its speed and native ESM support.
- **React Testing Library**: Encourages interaction-focused component tests instead of implementation details.
- **@testing-library/jest-dom**: Provides semantic matchers (e.g., `toBeInTheDocument`).

## What to test
- **Components**: Anything in `src/components` that renders UI logic should have a corresponding test in `tests/components`.
- **Utilities**: Pure helpers under `src/lib` should have tests in `tests/lib` (create subfolders that mirror file names).
- **Hooks (future)**: When custom hooks are added, create `tests/hooks` to cover them.

## File structure & naming
```
tests/
  components/
    ComponentName.test.tsx
  lib/
    someHelper.test.ts
```
Name files with `.test.ts` or `.test.tsx` depending on whether JSX is used.

## Running tests
- Single run: `npm test`
- Watch mode: `npm run test:watch`

## Example pattern
```tsx
import { render, screen } from "@testing-library/react";
import { InfoCard } from "@/components/InfoCard";

describe("InfoCard", () => {
  it("shows the provided title", () => {
    render(<InfoCard title="Timer">Mock copy</InfoCard>);
    expect(screen.getByRole("heading", { name: /timer/i })).toBeVisible();
  });
});
```

Every new feature should include tests covering success paths and edge cases. Use mocks sparingly—prefer real React interactions and deterministic helper inputs.

## Domain logic examples
- Pure calculation helpers (e.g., `tests/lib/meetingCost.test.ts`) should validate edge cases and accumulation math without touching React or the DOM.
- Mirror this pattern for future business rules: import the helper directly, assert on return values, and avoid side effects.

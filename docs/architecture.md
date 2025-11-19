# Architecture Overview

The Meeting Cost Timer is intentionally small but explicit so AI and human contributors can navigate quickly.

## Routing & App Router
- Next.js App Router lives in `src/app`.
- `layout.tsx` defines global fonts, metadata, and shared chrome.
- Each route has its own folder inside `src/app` with a `page.tsx` file. Nested layouts are encouraged for future dashboards or detail views.

## Components
- Shared visual building blocks live in `src/components`.
- Components should remain stateless when possible, pulling data via props and delegating side effects to hooks or server actions.
- Complex components should be colocated with a matching test file under `tests/components` and documented inline with JSDoc or short comments.

## Business Logic
- Utility and domain-specific logic belongs in `src/lib`.
- The meeting cost engine will evolve inside `src/lib/meetingCost.ts` (or a future folder) to calculate elapsed time, role-based rates, and aggregated totals.
- Keep functions pure: receive inputs, return outputs, and avoid accessing the DOM or timers directly.

## State Management (Future)
- Initial state will rely on local React state and custom hooks.
- When multiple components need the same data (e.g., timer + chart), introduce a React context provider or a lightweight state library such as Zustand.
- Server Actions can be introduced later if persistence becomes necessary, but client-side hooks should cover early needs.

## Styles & Theming
- Tailwind CSS v4 powers styling. Base tokens are defined in `src/app/globals.css` and extended via utility classes.
- For reusable theme snippets or documentation, add files inside `src/styles`.

## Testing Surfaces
- All logic in `src/lib` should be covered by Vitest unit tests under `tests/lib` (create the folder when needed).
- Component tests belong in `tests/components` and should use React Testing Library to assert behavior, not implementation details.

This structure aims for clarity: routes in `app`, UI in `components`, logic in `lib`, and knowledge in `docs`.

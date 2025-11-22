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

### Domain logic layer
- Roles and default rates live in `src/lib/rolesConfig.ts`.
- Cost calculations and snapshots live in `src/lib/meetingCost.ts`, with wrappers that use the default roles.
- How to extend:
  - Add new roles or descriptions in `rolesConfig.ts` to surface different attendee types.
  - Swap in alternate rate schemes by passing a different roles array to `calculateCostPerSecond`/`updateMeetingCost`.
  - Keep additional business helpers pure and colocated in `src/lib` with matching tests under `tests/lib`.

### Hooks and UI layer
- `src/hooks/useMeetingTimer.ts` bridges the domain layer and UI by managing timer ticking, role counts, and cost snapshots.
- `src/hooks/useMeetingTimer.ts` also exposes a lightweight `history` array so UI elements can draw recent trends without redoing business math.
- `src/components/MeetingTimerShell.tsx` composes the primary experience from presentational pieces like the timer, cost, role controls, and transport controls.
- `src/components/MiniCostGraph.tsx` renders the recent history as a compact inline chart. For richer analytics, keep logic in `src/lib` and extend hook outputs rather than duplicating calculations.
- UI components rely on hooks for stateful behavior while leaving cost math inside `src/lib`.

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

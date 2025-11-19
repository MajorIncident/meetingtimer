# Domain Model

The Meeting Cost Timer keeps its business rules small, explicit, and reusable. Core logic lives in `src/lib` and is intended to be imported by UI layers rather than reimplemented.

## Key Concepts

### MeetingRole
Defined in [`src/lib/rolesConfig.ts`](../src/lib/rolesConfig.ts). A role describes a category of attendee and the default hourly rate to attribute to them.

- `id`: Stable key for state and analytics (e.g., `senior_leader`).
- `label`: Display name for the UI.
- `hourlyRate`: Currency per hour in the meeting's base currency.
- `description?`: Optional copy for tooltips or documentation.

Default roles (exported as `defaultMeetingRoles`) include:
- Senior Leader — higher strategic rate
- Leader / Manager — mid-tier rate
- Individual Contributor — base maker rate

### RoleCounts
`Record<string, number>` mapping `MeetingRole.id` to how many attendees of that role are in the meeting at a given moment. Defined in [`src/lib/meetingCost.ts`](../src/lib/meetingCost.ts).

### MeetingCostSnapshot
Also defined in [`src/lib/meetingCost.ts`](../src/lib/meetingCost.ts). Captures the cumulative state of a meeting's cost at a point in time.

- `totalSeconds`: Seconds elapsed since the meeting began.
- `totalCost`: Total currency accrued so far.
- `costPerSecond`: Current rate based on the latest `RoleCounts`.

## Cost Per Second Calculation
1. For each role, multiply `hourlyRate * roleCounts[role.id]` (treat missing counts as zero).
2. Sum the hourly totals across roles.
3. Convert to seconds: `hourlyTotal / 3600`.
4. If no attendees are present, the result is `0`.

This logic is implemented in `calculateCostPerSecond` with a convenience `calculateCostPerSecondWithDefaults` that uses `defaultMeetingRoles`.

## Accumulating Total Cost
`updateMeetingCost` evolves a `MeetingCostSnapshot` by:
1. Calculating the current `costPerSecond` for the provided `RoleCounts`.
2. Adding `secondsElapsed` to `totalSeconds`.
3. Incrementing `totalCost` by `costPerSecond * secondsElapsed`.

`createEmptySnapshot` returns a zeroed starting point, and `updateMeetingCostWithDefaults` applies the default role catalog.

## Using in the UI
A React component can store a `MeetingCostSnapshot` in state and update it on a timer tick:

```tsx
const [snapshot, setSnapshot] = useState(createEmptySnapshot());

useEffect(() => {
  const interval = setInterval(() => {
    setSnapshot((prev) =>
      updateMeetingCostWithDefaults(prev, 1, currentRoleCounts),
    );
  }, 1000);
  return () => clearInterval(interval);
}, [currentRoleCounts]);
```

- `currentRoleCounts` should reflect the attendee mix at each tick.
- `costPerSecond` shows the live burn rate; `totalCost` shows the cumulative spend.

## Notes for AI Agents
- Source of truth: [`src/lib/rolesConfig.ts`](../src/lib/rolesConfig.ts) for roles/rates and [`src/lib/meetingCost.ts`](../src/lib/meetingCost.ts) for calculations.
- Update [`tests/lib/meetingCost.test.ts`](../tests/lib/meetingCost.test.ts) whenever domain rules change to keep the contract explicit.
- Avoid duplicating business rules in UI components—import the helpers instead of re-deriving rates.

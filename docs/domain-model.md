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

### Cost History
Defined in [`src/hooks/useMeetingTimer.ts`](../src/hooks/useMeetingTimer.ts) as `CostHistoryPoint`.

- `elapsedSeconds`: Total seconds when the sample was taken.
- `totalCost`: Cumulative cost at that moment.
- `costPerSecond`: Burn rate for the same tick.

The hook stores a sliding window of recent points (not a full audit log) so the UI can render a lightweight graph without persisting every tick for the entire meeting.

### Meeting Summary Export
Defined in [`src/lib/meetingSummary.ts`](../src/lib/meetingSummary.ts) and used when the user downloads a JSON snapshot.

- `generatedAt`: ISO timestamp for when the export was created.
- `totalSeconds`, `totalCost`, `costPerSecond`: Copied directly from the live snapshot.
- `attendees`: For each role, captures `roleId`, `roleLabel`, `hourlyRate`, `count`, and an `estimatedCostShare` based on hourly rate × count proportions.
- `history?`: Optional recent `CostHistoryPoint` array plus a note explaining that it is a sliding window, not a full audit log.

This structure is intentionally self-describing so it can be shared with stakeholders or ingested by tooling (including AI workflows) without extra context.

## Cost Per Second Calculation
1. For each role, multiply `hourlyRate * roleCounts[role.id]` (treat missing counts as zero).
2. Sum the hourly totals across roles.
3. Convert to seconds: `hourlyTotal / 3600`.
4. If no attendees are present, the result is `0`.

This logic is implemented in `calculateCostPerSecond` with a convenience `calculateCostPerSecondWithDefaults` that uses `defaultMeetingRoles` (optionally applying per-role rate overrides for the current session).

## Accumulating Total Cost
`updateMeetingCost` evolves a `MeetingCostSnapshot` by:
1. Calculating the current `costPerSecond` for the provided `RoleCounts`.
2. Adding `secondsElapsed` to `totalSeconds`.
3. Incrementing `totalCost` by `costPerSecond * secondsElapsed`.

`createEmptySnapshot` returns a zeroed starting point, and `updateMeetingCostWithDefaults` applies the default role catalog (and any in-memory rate overrides).

## Using in the UI
A React component can store a `MeetingCostSnapshot` in state and update it on a timer tick:

```tsx
const [snapshot, setSnapshot] = useState(createEmptySnapshot());

useEffect(() => {
  const interval = setInterval(() => {
    setSnapshot((prev) =>
      updateMeetingCostWithDefaults(
        prev,
        1,
        currentRoleCounts,
        currentRoleRates,
      ),
    );
  }, 1000);
  return () => clearInterval(interval);
}, [currentRoleCounts, currentRoleRates]);
```

- `currentRoleCounts` should reflect the attendee mix at each tick.
- `currentRoleRates` holds any temporary rate overrides per role.
- `costPerSecond` shows the live burn rate; `totalCost` shows the cumulative spend.

## Notes for AI Agents
- Source of truth: [`src/lib/rolesConfig.ts`](../src/lib/rolesConfig.ts) for roles/rates and [`src/lib/meetingCost.ts`](../src/lib/meetingCost.ts) for calculations.
- Update [`tests/lib/meetingCost.test.ts`](../tests/lib/meetingCost.test.ts) whenever domain rules change to keep the contract explicit.
- Avoid duplicating business rules in UI components—import the helpers instead of re-deriving rates.

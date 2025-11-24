import {
  applyRoleRateOverrides,
  defaultMeetingRoles,
  type MeetingRole,
  type RoleRateOverrides,
} from "./rolesConfig";

export type RoleCounts = Record<string, number>;

export interface MeetingCostSnapshot {
  /** Total elapsed time since the meeting began, in seconds. */
  totalSeconds: number;
  /** Cumulative cost across the entire meeting duration. */
  totalCost: number;
  /** Current rate based on who is present right now, in currency per second. */
  costPerSecond: number;
}

export type AttendeeGroup = {
  role: string;
  hourlyRate: number;
  count: number;
};

/**
 * Calculate the current cost per second for a meeting.
 *
 * @param roleCounts - Map of role id -> attendee count.
 * @param roles - Role definitions containing hourly rates.
 * @returns currency per second for the provided attendee mix.
 *
 * Typical usage: call on each tick using the latest attendee counts to inform
 * the ongoing meeting rate.
 */
export function calculateCostPerSecond(
  roleCounts: RoleCounts,
  roles: ReadonlyArray<MeetingRole>,
): number {
  const hourlyTotal = roles.reduce((total, role) => {
    const count = roleCounts[role.id] ?? 0;
    return total + role.hourlyRate * count;
  }, 0);

  if (hourlyTotal === 0) {
    return 0;
  }

  return hourlyTotal / 3600;
}

/**
 * Convenience wrapper that uses the default role catalog.
 */
export function calculateCostPerSecondWithDefaults(
  roleCounts: RoleCounts,
  roleRates?: RoleRateOverrides,
): number {
  const roles = applyRoleRateOverrides(defaultMeetingRoles, roleRates);
  return calculateCostPerSecond(roleCounts, roles);
}

/**
 * Create a fresh snapshot with zeroed totals.
 */
export function createEmptySnapshot(): MeetingCostSnapshot {
  return {
    totalSeconds: 0,
    totalCost: 0,
    costPerSecond: 0,
  };
}

/**
 * Update a meeting cost snapshot using a pure, deterministic calculation.
 *
 * @param previous - The last known snapshot (immutable input).
 * @param secondsElapsed - How many seconds have passed since the last update.
 * @param roleCounts - Map of role id -> attendee count for the current interval.
 * @param roles - Role definitions containing hourly rates.
 * @returns A new snapshot reflecting cumulative totals.
 *
 * Typical usage: invoked on each timer tick with the delta seconds and current
 * attendee counts, then stored back into React state.
 */
export function updateMeetingCost(
  previous: MeetingCostSnapshot,
  secondsElapsed: number,
  roleCounts: RoleCounts,
  roles: ReadonlyArray<MeetingRole>,
): MeetingCostSnapshot {
  const costPerSecond = calculateCostPerSecond(roleCounts, roles);
  const totalSeconds = previous.totalSeconds + secondsElapsed;
  const totalCost = previous.totalCost + costPerSecond * secondsElapsed;

  return {
    totalSeconds,
    totalCost,
    costPerSecond,
  };
}

/**
 * Wrapper that applies the default role configuration.
 */
export function updateMeetingCostWithDefaults(
  previous: MeetingCostSnapshot,
  secondsElapsed: number,
  roleCounts: RoleCounts,
  roleRates?: RoleRateOverrides,
): MeetingCostSnapshot {
  const roles = applyRoleRateOverrides(defaultMeetingRoles, roleRates);

  return updateMeetingCost(
    previous,
    secondsElapsed,
    roleCounts,
    roles,
  );
}

/**
 * Legacy convenience that adapts grouped attendee inputs into the new domain
 * model. Prefer `calculateCostPerSecond` for new code.
 */
export function estimateCostPerSecond(groups: AttendeeGroup[]): number {
  const roleCounts: RoleCounts = Object.fromEntries(
    groups.map((group) => [group.role, group.count]),
  );
  const roles: MeetingRole[] = groups.map((group) => ({
    id: group.role,
    label: group.role,
    hourlyRate: group.hourlyRate,
  }));

  return calculateCostPerSecond(roleCounts, roles);
}

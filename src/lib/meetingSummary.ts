import { type CostHistoryPoint } from "@/hooks/useMeetingTimer";
import {
  type MeetingCostSnapshot,
  type RoleCounts,
} from "@/lib/meetingCost";
import {
  applyRoleRateOverrides,
  defaultMeetingRoles,
  type MeetingRole,
  type RoleRateOverrides,
} from "@/lib/rolesConfig";

/**
 * A lightweight, self-describing snapshot of a meeting session intended for
 * download and offline analysis (e.g., sharing with a stakeholder or ingesting
 * into an AI tool).
 */
export interface MeetingSummary {
  /** ISO timestamp indicating when the summary was generated. */
  generatedAt: string;
  /** Cumulative elapsed time, in seconds, for the meeting. */
  totalSeconds: number;
  /** Total cost accrued so far. */
  totalCost: number;
  /** Current burn rate based on the latest attendee mix. */
  costPerSecond: number;
  /** Breakdown of attendees by role, including an estimated share of cost. */
  attendees: {
    roleId: string;
    roleLabel: string;
    hourlyRate: number;
    count: number;
    /**
     * Rough allocation of totalCost attributed to this role group, based on
     * the proportion of hourly rate x count relative to the whole mix.
     */
    estimatedCostShare: number;
  }[];
  /** Optional lightweight history, useful for small trend visualizations. */
  history?: {
    points: {
      elapsedSeconds: number;
      totalCost: number;
      costPerSecond: number;
    }[];
    note: string;
  };
}

function calculateEstimatedCostShare(
  snapshot: MeetingCostSnapshot,
  roleCounts: RoleCounts,
  roles: ReadonlyArray<MeetingRole>,
) {
  const totalWeight = roles.reduce((total, role) => {
    const count = roleCounts[role.id] ?? 0;
    return total + role.hourlyRate * count;
  }, 0);

  if (snapshot.totalCost === 0 || totalWeight === 0) {
    return roles.map((role) => ({ roleId: role.id, share: 0 }));
  }

  return roles.map((role) => {
    const count = roleCounts[role.id] ?? 0;
    const weight = role.hourlyRate * count;

    return {
      roleId: role.id,
      share: (weight / totalWeight) * snapshot.totalCost,
    };
  });
}

/**
 * Build a portable meeting summary JSON structure using the provided snapshot,
 * role counts, role definitions, and optional recent cost history.
 */
export function buildMeetingSummary(
  snapshot: MeetingCostSnapshot,
  roleCounts: RoleCounts,
  roles: ReadonlyArray<MeetingRole>,
  history?: CostHistoryPoint[],
): MeetingSummary {
  const generatedAt = new Date().toISOString();
  const estimatedShares = calculateEstimatedCostShare(snapshot, roleCounts, roles);

  const attendees = roles.map((role) => {
    const count = roleCounts[role.id] ?? 0;
    const shareEntry = estimatedShares.find((entry) => entry.roleId === role.id);

    return {
      roleId: role.id,
      roleLabel: role.label,
      hourlyRate: role.hourlyRate,
      count,
      estimatedCostShare: shareEntry?.share ?? 0,
    };
  });

  const summary: MeetingSummary = {
    generatedAt,
    totalSeconds: snapshot.totalSeconds,
    totalCost: snapshot.totalCost,
    costPerSecond: snapshot.costPerSecond,
    attendees,
  };

  if (history && history.length > 0) {
    summary.history = {
      points: history.map((point) => ({
        elapsedSeconds: point.elapsedSeconds,
        totalCost: point.totalCost,
        costPerSecond: point.costPerSecond,
      })),
      note:
        "Recent cost samples; this is a sliding window, not a full audit log.",
    };
  }

  return summary;
}

/**
 * Convenience wrapper that uses the default meeting roles for building the
 * summary.
 */
export function buildMeetingSummaryWithDefaults(
  snapshot: MeetingCostSnapshot,
  roleCounts: RoleCounts,
  history?: CostHistoryPoint[],
  roleRates?: RoleRateOverrides,
): MeetingSummary {
  const roles = applyRoleRateOverrides(defaultMeetingRoles, roleRates);

  return buildMeetingSummary(snapshot, roleCounts, roles, history);
}

/**
 * Initiate a client-side download of a meeting summary JSON payload.
 *
 * This helper assumes a browser environment (window/document) and should not be
 * invoked during server-side rendering.
 */
export function downloadMeetingSummary(
  summary: MeetingSummary,
  filename = "meeting-summary.json",
): void {
  const json = JSON.stringify(summary, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();

  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

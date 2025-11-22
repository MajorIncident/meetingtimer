import { useEffect, useMemo, useRef, useState } from "react";

import {
  createEmptySnapshot,
  type MeetingCostSnapshot,
  type RoleCounts,
  updateMeetingCostWithDefaults,
} from "@/lib/meetingCost";
import { defaultMeetingRoles } from "@/lib/rolesConfig";

/**
 * React hook that keeps the meeting timer, role counts, and cost snapshot in sync.
 *
 * The hook encapsulates the interval ticking logic and delegates cost math to
 * the domain helpers in `src/lib/meetingCost.ts`.
 *
 * `CostHistoryPoint` captures a lightweight snapshot of the timer and cost at
 * a given second. The hook maintains a recent sliding window of points (not a
 * full audit log) to support compact visualizations.
 *
 * Usage example:
 * ```tsx
 * const {
 *   totalSeconds,
 *   totalCost,
 *   isRunning,
 *   roleCounts,
 *   history,
 *   start,
 *   pause,
 *   reset,
 *   incrementRole,
 * } = useMeetingTimer();
 * ```
 */
export interface CostHistoryPoint {
  /** Total elapsed time in seconds when this sample was recorded. */
  elapsedSeconds: number;
  /** Cumulative cost at that moment. */
  totalCost: number;
  /** Active burn rate in currency per second. */
  costPerSecond: number;
}
export function useMeetingTimer(initialRoleCounts?: RoleCounts) {
  const resolvedInitialCounts = useMemo(() => {
    const zeros = Object.fromEntries(
      defaultMeetingRoles.map((role) => [role.id, 0]),
    );

    return { ...zeros, ...(initialRoleCounts ?? {}) } satisfies RoleCounts;
  }, [initialRoleCounts]);

  const [snapshot, setSnapshot] = useState<MeetingCostSnapshot>(
    createEmptySnapshot(),
  );
  const [isRunning, setIsRunning] = useState(false);
  const [roleCounts, setRoleCounts] = useState<RoleCounts>(resolvedInitialCounts);
  const [history, setHistory] = useState<CostHistoryPoint[]>([]);
  const roleCountsRef = useRef<RoleCounts>(resolvedInitialCounts);

  useEffect(() => {
    roleCountsRef.current = roleCounts;
  }, [roleCounts]);

  useEffect(() => {
    if (!isRunning) return undefined;

    const interval = setInterval(() => {
      setSnapshot((previous) => {
        const nextSnapshot = updateMeetingCostWithDefaults(
          previous,
          1,
          roleCountsRef.current,
        );

        const nextPoint: CostHistoryPoint = {
          elapsedSeconds: nextSnapshot.totalSeconds,
          totalCost: nextSnapshot.totalCost,
          costPerSecond: nextSnapshot.costPerSecond,
        };

        setHistory((prev) => {
          const next = [...prev, nextPoint];
          return next.length > 300 ? next.slice(next.length - 300) : next;
        });

        return nextSnapshot;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    // Reset time and cost while leaving attendee counts untouched for convenience.
    setIsRunning(false);
    setSnapshot(createEmptySnapshot());
    // Clear recent history so the graph reflects the fresh start.
    setHistory([]);
  };

  const setRoleCount = (roleId: string, count: number) => {
    setRoleCounts((current) => ({
      ...current,
      [roleId]: Math.max(0, count),
    }));

    roleCountsRef.current = {
      ...roleCountsRef.current,
      [roleId]: Math.max(0, count),
    };
  };

  const incrementRole = (roleId: string) => {
    setRoleCount(roleId, (roleCountsRef.current[roleId] ?? 0) + 1);
  };

  const decrementRole = (roleId: string) => {
    const nextCount = (roleCountsRef.current[roleId] ?? 0) - 1;
    setRoleCount(roleId, Math.max(0, nextCount));
  };

  return {
    snapshot,
    isRunning,
    roleCounts,
    history,
    totalSeconds: snapshot.totalSeconds,
    totalCost: snapshot.totalCost,
    costPerSecond: snapshot.costPerSecond,
    start,
    pause,
    reset,
    incrementRole,
    decrementRole,
    setRoleCount,
  } as const;
}

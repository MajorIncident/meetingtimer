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
 * Usage example:
 * ```tsx
 * const {
 *   totalSeconds,
 *   totalCost,
 *   isRunning,
 *   roleCounts,
 *   start,
 *   pause,
 *   reset,
 *   incrementRole,
 * } = useMeetingTimer();
 * ```
 */
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
  const roleCountsRef = useRef<RoleCounts>(resolvedInitialCounts);

  useEffect(() => {
    roleCountsRef.current = roleCounts;
  }, [roleCounts]);

  useEffect(() => {
    if (!isRunning) return undefined;

    const interval = setInterval(() => {
      setSnapshot((previous) =>
        updateMeetingCostWithDefaults(previous, 1, roleCountsRef.current),
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning]);

  const start = () => setIsRunning(true);
  const pause = () => setIsRunning(false);
  const reset = () => {
    // Reset time and cost while leaving attendee counts untouched for convenience.
    setIsRunning(false);
    setSnapshot(createEmptySnapshot());
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

import { describe, expect, it, vi, afterEach } from "vitest";

import { buildMeetingSummary, buildMeetingSummaryWithDefaults } from "@/lib/meetingSummary";
import { defaultMeetingRoles, type MeetingRole } from "@/lib/rolesConfig";

const roles: MeetingRole[] = [
  { id: "manager", label: "Manager", hourlyRate: 200 },
  { id: "ic", label: "IC", hourlyRate: 100 },
];

afterEach(() => {
  vi.useRealTimers();
});

describe("buildMeetingSummary", () => {
  it("creates a structured summary with attendees and history", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-02T03:04:05.000Z"));

    const snapshot = {
      totalSeconds: 120,
      totalCost: 90,
      costPerSecond: 0.75,
    };
    const roleCounts = { manager: 1, ic: 2 };
    const history = [
      { elapsedSeconds: 60, totalCost: 40, costPerSecond: 0.66 },
      { elapsedSeconds: 120, totalCost: 90, costPerSecond: 0.75 },
    ];

    const summary = buildMeetingSummary(snapshot, roleCounts, roles, history);

    expect(summary.generatedAt).toBe("2024-01-02T03:04:05.000Z");
    expect(summary.totalSeconds).toBe(snapshot.totalSeconds);
    expect(summary.totalCost).toBe(snapshot.totalCost);
    expect(summary.costPerSecond).toBe(snapshot.costPerSecond);

    expect(summary.attendees).toHaveLength(roles.length);
    expect(summary.attendees).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ roleId: "manager", count: 1 }),
        expect.objectContaining({ roleId: "ic", count: 2 }),
      ]),
    );

    const manager = summary.attendees.find((attendee) => attendee.roleId === "manager");
    const ic = summary.attendees.find((attendee) => attendee.roleId === "ic");

    expect(manager?.estimatedCostShare).toBeCloseTo(45);
    expect(ic?.estimatedCostShare).toBeCloseTo(45);

    expect(summary.history?.points).toHaveLength(2);
    expect(summary.history?.note).toContain("sliding window");
  });

  it("gracefully assigns zero shares when no cost has accrued", () => {
    const snapshot = {
      totalSeconds: 0,
      totalCost: 0,
      costPerSecond: 0,
    };
    const roleCounts = { manager: 1 };

    const summary = buildMeetingSummary(snapshot, roleCounts, roles);

    expect(summary.attendees[0].estimatedCostShare).toBe(0);
  });
});

describe("buildMeetingSummaryWithDefaults", () => {
  it("uses the default role catalog", () => {
    const snapshot = {
      totalSeconds: 10,
      totalCost: 5,
      costPerSecond: 0.5,
    };
    const roleCounts = { senior_leader: 1 };

    const summary = buildMeetingSummaryWithDefaults(snapshot, roleCounts);

    expect(summary.attendees).toHaveLength(defaultMeetingRoles.length);
    const leader = summary.attendees.find((attendee) => attendee.roleId === "senior_leader");
    expect(leader?.count).toBe(1);
  });
});

import { describe, expect, it } from "vitest";
import {
  calculateCostPerSecond,
  calculateCostPerSecondWithDefaults,
  createEmptySnapshot,
  updateMeetingCost,
  updateMeetingCostWithDefaults,
  type MeetingCostSnapshot,
  type RoleCounts,
} from "@/lib/meetingCost";
import { defaultMeetingRoles } from "@/lib/rolesConfig";

describe("calculateCostPerSecond", () => {
  // When no attendees are present, the meeting should not accrue cost.
  it("returns 0 when roleCounts is empty or zeroed", () => {
    expect(calculateCostPerSecond({}, defaultMeetingRoles)).toBe(0);
    expect(
      calculateCostPerSecond(
        { senior_leader: 0, leader_manager: 0 },
        defaultMeetingRoles,
      ),
    ).toBe(0);
  });

  // A single role with a known rate should convert hourly to per-second.
  it("converts hourly rate to per-second for one role", () => {
    const perSecond = calculateCostPerSecond(
      { senior_leader: 1 },
      defaultMeetingRoles,
    );

    expect(perSecond).toBeCloseTo(240 / 3600);
  });

  // Multiple roles should aggregate based on their counts and rates.
  it("aggregates multiple roles and attendee counts", () => {
    const customRoles = [
      { id: "a", label: "A", hourlyRate: 100 },
      { id: "b", label: "B", hourlyRate: 200 },
    ];
    const perSecond = calculateCostPerSecond(
      { a: 2, b: 1 },
      customRoles,
    );

    const expectedHourly = 2 * 100 + 1 * 200; // 400
    expect(perSecond).toBeCloseTo(expectedHourly / 3600);
  });
});

describe("updateMeetingCost", () => {
  // If nothing changes, the snapshot should remain at zero values.
  it("returns an untouched snapshot when nothing has elapsed", () => {
    const empty = createEmptySnapshot();
    const updated = updateMeetingCost(empty, 0, {}, defaultMeetingRoles);

    expect(updated).toEqual<MeetingCostSnapshot>({
      totalSeconds: 0,
      totalCost: 0,
      costPerSecond: 0,
    });
  });

  // A single update should accumulate seconds and cost based on current rates.
  it("updates totals for a single interval", () => {
    const empty = createEmptySnapshot();
    const roleCounts: RoleCounts = { individual_contributor: 3 };
    const seconds = 120; // 2 minutes

    const result = updateMeetingCostWithDefaults(empty, seconds, roleCounts);

    const perSecond = calculateCostPerSecondWithDefaults(roleCounts);
    expect(result.totalSeconds).toBe(seconds);
    expect(result.costPerSecond).toBe(perSecond);
    expect(result.totalCost).toBeCloseTo(perSecond * seconds);
  });

  // Sequential ticks should continue to accumulate cost and time.
  it("accumulates cost across multiple ticks", () => {
    const firstRoleCounts: RoleCounts = { leader_manager: 1 };
    const secondRoleCounts: RoleCounts = { leader_manager: 1, senior_leader: 1 };

    const firstTick = updateMeetingCostWithDefaults(
      createEmptySnapshot(),
      30,
      firstRoleCounts,
    );
    const secondTick = updateMeetingCostWithDefaults(firstTick, 45, secondRoleCounts);

    const expectedFirstCost = calculateCostPerSecondWithDefaults(firstRoleCounts) * 30;
    const expectedSecondCost =
      calculateCostPerSecondWithDefaults(secondRoleCounts) * 45;

    expect(firstTick.totalSeconds).toBe(30);
    expect(secondTick.totalSeconds).toBe(75);
    expect(secondTick.totalCost).toBeCloseTo(
      expectedFirstCost + expectedSecondCost,
    );
  });
});

export type AttendeeGroup = {
  role: string;
  hourlyRate: number;
  count: number;
};

/**
 * Placeholder helper that will evolve into the full meeting cost engine.
 */
export function estimateCostPerSecond(groups: AttendeeGroup[]): number {
  const totalHourly = groups.reduce(
    (sum, group) => sum + group.hourlyRate * group.count,
    0,
  );
  return Number((totalHourly / 3600).toFixed(2));
}

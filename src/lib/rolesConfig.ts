export interface MeetingRole {
  /** Stable key for referencing this role in state or analytics. */
  id: string;
  /** Human-friendly label for UI display. */
  label: string;
  /** Default hourly rate in the meeting's base currency. */
  hourlyRate: number;
  /** Optional descriptive copy for tooltips or helper text. */
  description?: string;
}

/**
 * Default roles used by the Meeting Cost Timer. These can be surfaced in the UI
 * for selection, and future tasks may allow editing or expanding the list.
 *
 * Other modules should import and reuse this config rather than hardcoding
 * rates. This keeps the domain model discoverable and easy to update.
 */
export const defaultMeetingRoles: ReadonlyArray<MeetingRole> = [
  {
    id: "senior_leader",
    label: "Senior Leader",
    hourlyRate: 240,
    description: "Executives or directors guiding strategy for the session.",
  },
  {
    id: "leader_manager",
    label: "Leader / Manager",
    hourlyRate: 180,
    description: "People managers or project leads coordinating the work.",
  },
  {
    id: "individual_contributor",
    label: "Individual Contributor",
    hourlyRate: 120,
    description: "Engineers, designers, analysts, or other makers executing tasks.",
  },
] as const;

/**
 * Lookup helper to grab a role definition by its id. Returns undefined when a
 * role is not known to the default configuration.
 */
export function getRoleById(roleId: string): MeetingRole | undefined {
  return defaultMeetingRoles.find((role) => role.id === roleId);
}

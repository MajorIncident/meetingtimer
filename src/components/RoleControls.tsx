import type { MeetingRole } from "@/lib/rolesConfig";
import type { RoleCounts } from "@/lib/meetingCost";

interface RoleControlsProps {
  roles: ReadonlyArray<MeetingRole>;
  roleCounts: RoleCounts;
  onIncrement: (roleId: string) => void;
  onDecrement: (roleId: string) => void;
}

export function RoleControls({
  roles,
  roleCounts,
  onIncrement,
  onDecrement,
}: RoleControlsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {roles.map((role) => {
        const count = roleCounts[role.id] ?? 0;

        return (
          <div
            key={role.id}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
          >
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-slate-900">{role.label}</span>
              <span className="text-xs text-slate-500">{role.description}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label={`Remove ${role.label}`}
                onClick={() => onDecrement(role.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold text-slate-900">{count}</span>
              <button
                type="button"
                aria-label={`Add ${role.label}`}
                onClick={() => onIncrement(role.id)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

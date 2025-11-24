import type { MeetingRole } from "@/lib/rolesConfig";
import type { RoleCounts } from "@/lib/meetingCost";

interface RoleControlsProps {
  roles: ReadonlyArray<MeetingRole>;
  roleCounts: RoleCounts;
  roleRates: Record<string, number>;
  onIncrement: (roleId: string) => void;
  onDecrement: (roleId: string) => void;
  onRateChange: (roleId: string, hourlyRate: number) => void;
}

export function RoleControls({
  roles,
  roleCounts,
  roleRates,
  onIncrement,
  onDecrement,
  onRateChange,
}: RoleControlsProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {roles.map((role) => {
        const count = roleCounts[role.id] ?? 0;
        const rate = roleRates[role.id] ?? role.hourlyRate;

        return (
          <div
            key={role.id}
            className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
          >
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-slate-900">{role.label}</span>
              <span className="text-xs text-slate-500">{role.description}</span>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 rounded-full border border-slate-100/80 bg-white px-3 py-1.5 text-xs text-slate-700 shadow-sm">
                <span className="text-[11px] lowercase tracking-[0.08em] text-slate-500">rate</span>
                <input
                  type="number"
                  min={0}
                  inputMode="decimal"
                  aria-label={`${role.label} hourly rate`}
                  value={rate}
                  onChange={(event) =>
                    onRateChange(role.id, Number(event.target.value))
                  }
                  className="w-20 rounded-full border border-transparent bg-slate-50 px-3 py-1 text-right text-sm font-medium text-slate-600 shadow-inner focus:border-indigo-200 focus:outline-none focus:ring-1 focus:ring-indigo-100"
                />
                <span className="text-[11px] text-slate-500">/hr</span>
              </div>
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

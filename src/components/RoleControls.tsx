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
        const isCustomRate = rate !== role.hourlyRate;

        return (
          <div
            key={role.id}
            className="flex flex-col gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex flex-col text-left">
              <span className="text-sm font-medium text-slate-900">{role.label}</span>
              <span className="text-xs text-slate-500">{role.description}</span>
            </div>
            <div className="flex items-center gap-2.5 self-start sm:self-auto">
              <div className="flex items-center gap-3 rounded-full border border-slate-100/80 bg-white px-3.5 py-2 text-sm text-slate-700 shadow-sm">
                <span className="text-[12px] lowercase tracking-[0.08em] text-slate-500">rate</span>
                <div className="flex items-center rounded-full border border-transparent bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 shadow-inner focus-within:border-indigo-200 focus-within:outline-none focus-within:ring-1 focus-within:ring-indigo-100">
                  <span aria-hidden="true" className="pr-1 text-slate-400">$</span>
                  <input
                    type="number"
                    min={0}
                    step={10}
                    inputMode="decimal"
                    aria-label={`${role.label} hourly rate in dollars`}
                    value={rate}
                    onChange={(event) =>
                      onRateChange(role.id, Number(event.target.value))
                    }
                    className="w-24 bg-transparent text-right text-sm font-semibold text-slate-700 focus:outline-none"
                  />
                </div>
                <span className="text-[12px] text-slate-500">/hr</span>
              </div>
              {isCustomRate ? (
                <div className="flex items-center gap-1 rounded-full border border-slate-100/80 bg-slate-50 px-2.5 py-1 text-[11px] text-slate-500 shadow-inner">
                  <span className="whitespace-nowrap">Default ${role.hourlyRate}/hr</span>
                  <button
                    type="button"
                    aria-label={`Reset ${role.label} rate to default`}
                    onClick={() => onRateChange(role.id, role.hourlyRate)}
                    className="rounded-full border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
                  >
                    Reset
                  </button>
                </div>
              ) : null}
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

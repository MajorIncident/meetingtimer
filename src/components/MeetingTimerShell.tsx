"use client";

import { CostDisplay } from "@/components/CostDisplay";
import { MiniCostGraph } from "@/components/MiniCostGraph";
import { RoleControls } from "@/components/RoleControls";
import { TimerControls } from "@/components/TimerControls";
import { TimerDisplay } from "@/components/TimerDisplay";
import { type CostHistoryPoint, useMeetingTimer } from "@/hooks/useMeetingTimer";
import { defaultMeetingRoles } from "@/lib/rolesConfig";

export function MeetingTimerShell() {
  const {
    totalSeconds,
    totalCost,
    costPerSecond,
    isRunning,
    roleCounts,
    history,
    start,
    pause,
    reset,
    incrementRole,
    decrementRole,
  } = useMeetingTimer();
  const costHistory: CostHistoryPoint[] = history;

  return (
    <section className="w-full max-w-5xl rounded-2xl border border-white/60 bg-white/90 p-8 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.8)] backdrop-blur">
      <header className="flex flex-col gap-1 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-500">
          Meeting Cost Timer
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Keep time honest and budgets visible.
        </h1>
        <p className="text-sm text-slate-600">
          Adjust attendees, start the clock, and watch a live tally of your meeting’s true cost.
        </p>
      </header>

      <div className="mt-8 space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <TimerDisplay totalSeconds={totalSeconds} />
          <CostDisplay totalCost={totalCost} costPerSecond={costPerSecond} />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-medium text-slate-800">
            <span>Attendees & Roles</span>
            <span className="text-xs font-normal text-slate-500">Tap + or − to match the room</span>
          </div>
          <RoleControls
            roles={defaultMeetingRoles}
            roleCounts={roleCounts}
            onIncrement={incrementRole}
            onDecrement={decrementRole}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-800">Cost trend</p>
          <MiniCostGraph history={costHistory} />
        </div>

        <div className="pt-2">
          <TimerControls
            isRunning={isRunning}
            onStart={start}
            onPause={pause}
            onReset={reset}
          />
        </div>
      </div>
    </section>
  );
}

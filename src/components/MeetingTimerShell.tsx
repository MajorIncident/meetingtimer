"use client";

import { useState } from "react";

import { CostDisplay } from "@/components/CostDisplay";
import { MiniCostGraph } from "@/components/MiniCostGraph";
import { RoleControls } from "@/components/RoleControls";
import { TimerControls } from "@/components/TimerControls";
import { TimerDisplay } from "@/components/TimerDisplay";
import { type CostHistoryPoint, useMeetingTimer } from "@/hooks/useMeetingTimer";
import {
  buildMeetingSummaryWithDefaults,
  downloadMeetingSummary,
} from "@/lib/meetingSummary";
import { defaultMeetingRoles } from "@/lib/rolesConfig";

export function MeetingTimerShell() {
  const [isMinimized, setIsMinimized] = useState(false);
  const {
    snapshot,
    totalSeconds,
    totalCost,
    costPerSecond,
    isRunning,
    roleCounts,
    roleRates,
    history,
    start,
    pause,
    reset,
    incrementRole,
    decrementRole,
    setRoleRate,
  } = useMeetingTimer();
  const costHistory: CostHistoryPoint[] = history;

  const handleDownloadSummary = () => {
    const summary = buildMeetingSummaryWithDefaults(
      snapshot,
      roleCounts,
      history,
      roleRates,
    );
    downloadMeetingSummary(summary);
  };

  const containerClassName = isMinimized
    ? "w-full max-w-3xl rounded-2xl border border-white/60 bg-white/90 p-4 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.8)] backdrop-blur"
    : "w-full max-w-5xl rounded-2xl border border-white/60 bg-white/90 p-8 shadow-[0_20px_50px_-40px_rgba(0,0,0,0.8)] backdrop-blur";

  return (
    <section className={containerClassName}>
      <div className="flex items-start justify-between gap-3">
        {!isMinimized && (
          <header className="flex flex-col gap-1 text-left sm:text-center">
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
        )}

        <button
          type="button"
          onClick={() => setIsMinimized((prev) => !prev)}
          className="inline-flex items-center justify-center rounded-md border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
          aria-pressed={isMinimized}
        >
          {isMinimized ? "Restore full view" : "Minimize view"}
        </button>
      </div>

      {isMinimized ? (
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <TimerDisplay totalSeconds={totalSeconds} />
          <CostDisplay totalCost={totalCost} costPerSecond={costPerSecond} />
        </div>
      ) : (
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
              roleRates={roleRates}
              onIncrement={incrementRole}
              onDecrement={decrementRole}
              onRateChange={setRoleRate}
            />
          </div>

          <div>
            <p className="mb-2 text-sm font-medium text-slate-800">Cost trend</p>
            <MiniCostGraph history={costHistory} />
          </div>

          <div className="pt-2">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <TimerControls
                isRunning={isRunning}
                onStart={start}
                onPause={pause}
                onReset={reset}
              />
              <button
                type="button"
                onClick={handleDownloadSummary}
                className="inline-flex items-center justify-center rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Download summary
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

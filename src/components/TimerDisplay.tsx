interface TimerDisplayProps {
  totalSeconds: number;
}

function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${hours}:${minutes}:${secs}`;
}

export function TimerDisplay({ totalSeconds }: TimerDisplayProps) {
  return (
    <div className="rounded-xl bg-slate-50 px-6 py-4 text-center">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Time Elapsed</p>
      <p className="mt-2 font-mono text-5xl font-semibold text-slate-900 sm:text-6xl">
        {formatTime(totalSeconds)}
      </p>
    </div>
  );
}

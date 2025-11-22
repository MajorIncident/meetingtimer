import { type CostHistoryPoint } from "@/hooks/useMeetingTimer";

interface MiniCostGraphProps {
  history: CostHistoryPoint[];
}

/**
 * Compact, dependency-free line chart for showing how cost changes over time.
 *
 * Normalizes the provided history into a small SVG viewport to keep the
 * visualization lightweight. Intended as a quick glance, not a full analytics
 * surface.
 */
export function MiniCostGraph({ history }: MiniCostGraphProps) {
  if (!history.length || history.length < 2) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white/70 p-4 text-sm text-slate-500">
        <div className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
          Cost over time
        </div>
        <div className="text-slate-400">Not enough data yet</div>
      </div>
    );
  }

  const viewBoxWidth = 200;
  const viewBoxHeight = 60;

  const costs = history.map((point) => point.totalCost);
  const minCost = Math.min(...costs);
  const maxCost = Math.max(...costs);
  const costRange = maxCost - minCost || 1; // Avoid divide-by-zero by forcing a flat line.

  const points = history.map((point, index) => {
    const x = (index / (history.length - 1)) * viewBoxWidth;
    const normalizedY = (point.totalCost - minCost) / costRange;
    const y = viewBoxHeight - normalizedY * viewBoxHeight;

    return `${x},${y}`;
  });

  return (
    <div className="rounded-xl border border-slate-200 bg-white/70 p-4 shadow-sm">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
        Cost over time
      </div>
      <svg
        viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
        role="img"
        aria-label="Mini cost graph"
        className="h-16 w-full text-slate-500"
      >
        {/* Simple polyline to keep rendering fast and dependency-free. */}
        <polyline
          role="presentation"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          points={points.join(" ")}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

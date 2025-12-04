interface CostDisplayProps {
  totalCost: number;
  costPerSecond: number;
}

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatCurrency(amount: number) {
  return currencyFormatter.format(amount);
}

export function CostDisplay({ totalCost, costPerSecond }: CostDisplayProps) {
  const WORKING_SECONDS_PER_YEAR = 40 * 52 * 3600;
  const perSecondLabel = `${formatCurrency(costPerSecond)} / sec`;
  const perMinuteLabel = `${formatCurrency(costPerSecond * 60)} / min`;
  const perHourLabel = `${formatCurrency(costPerSecond * 3600)} / hr`;
  const perYearLabel = `${formatCurrency(costPerSecond * WORKING_SECONDS_PER_YEAR)} / yr`;

  return (
    <div className="rounded-xl bg-white px-6 py-4 text-center shadow-sm ring-1 ring-slate-100">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Total Cost</p>
      <p className="mt-2 text-4xl font-semibold text-slate-900 sm:text-5xl">
        {formatCurrency(totalCost)}
      </p>
      <p className="mt-2 text-sm text-slate-600">
        Current Rate: <span className="font-medium text-slate-800">{perSecondLabel}</span>
        <span className="ml-2 text-slate-400">({perMinuteLabel} · {perHourLabel} · {perYearLabel})</span>
      </p>
    </div>
  );
}

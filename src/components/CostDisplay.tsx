interface CostDisplayProps {
  totalCost: number;
  costPerSecond: number;
}

function formatCurrency(amount: number) {
  return `$${amount.toFixed(2)}`;
}

export function CostDisplay({ totalCost, costPerSecond }: CostDisplayProps) {
  const perSecondLabel = `${formatCurrency(costPerSecond)} / sec`;
  const perMinuteLabel = `${formatCurrency(costPerSecond * 60)} / min`;

  return (
    <div className="rounded-xl bg-white px-6 py-4 text-center shadow-sm ring-1 ring-slate-100">
      <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Total Cost</p>
      <p className="mt-2 text-4xl font-semibold text-slate-900 sm:text-5xl">
        {formatCurrency(totalCost)}
      </p>
      <p className="mt-2 text-sm text-slate-600">
        Current Rate: <span className="font-medium text-slate-800">{perSecondLabel}</span>
        <span className="ml-2 text-slate-400">({perMinuteLabel})</span>
      </p>
    </div>
  );
}

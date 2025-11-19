import type { ReactNode } from "react";

interface InfoCardProps {
  title: string;
  children: ReactNode;
}

export function InfoCard({ title, children }: InfoCardProps) {
  return (
    <section className="w-full rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_40px_-30px_rgba(0,0,0,0.7)] backdrop-blur">
      <h2 className="text-xl font-semibold tracking-tight text-slate-900">{title}</h2>
      <div className="mt-3 text-sm text-slate-600">{children}</div>
    </section>
  );
}

import { InfoCard } from "@/components/InfoCard";

const sections = [
  {
    title: "Timer",
    body: "A precise, second-by-second tracker will power start, pause, resume, and reset controls.",
  },
  {
    title: "Attendees & Roles",
    body: "Future iterations will let you adjust how many senior leaders, leaders, and individual contributors are in the meeting at any moment.",
  },
  {
    title: "Cost Overview",
    body: "Costs will accumulate automatically based on who's present, showing live totals and trends.",
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 py-16 text-center md:text-left">
        <div className="space-y-4">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
            Meeting Cost Timer
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Calm controls for meetings that value time and money.
          </h1>
          <p className="text-base leading-relaxed text-slate-600 md:text-lg">
            This early scaffold focuses on structure: clear routing, reusable components, and
            a predictable folder layout. Future tasks will layer in interactive timers,
            attendee controls, and delightful Apple-inspired polish.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {sections.map((section) => (
            <InfoCard key={section.title} title={section.title}>
              {section.body}
            </InfoCard>
          ))}
        </div>
        <p className="text-sm text-slate-500">
          ✦ Notes for collaborators: Keep features small, document intent in /docs, and favor
          pure functions in <code className="font-mono text-slate-700">src/lib</code> so testing stays simple.
        </p>
      </main>
    </div>
  );
}

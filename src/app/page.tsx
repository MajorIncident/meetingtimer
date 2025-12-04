import { MeetingTimerShell } from "@/components/MeetingTimerShell";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <MeetingTimerShell />
      </main>

      <footer className="border-t border-white/70 bg-white/80 px-6 py-4 text-xs text-slate-600 shadow-[0_-12px_30px_-24px_rgba(0,0,0,0.6)] backdrop-blur">
        <div className="flex flex-col items-center gap-1 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <div className="space-x-1">
            <span>© 2025 Kepner-Tregoe. All rights reserved.</span>
            <a
              href="#"
              className="font-medium text-slate-800 underline-offset-4 hover:text-slate-900 hover:underline"
            >
              Privacy Policy
            </a>
            <span>,</span>
            <a
              href="#"
              className="font-medium text-slate-800 underline-offset-4 hover:text-slate-900 hover:underline"
            >
              EULA
            </a>
            <span>.</span>
            <span>
              Crafted by
              <a
                href="https://www.linkedin.com/in/shanechagpar"
                target="_blank"
                rel="noreferrer"
                className="font-semibold text-slate-900 underline-offset-4 hover:underline"
              >
                {" "}
                Shane Chagpar
              </a>
              .
            </span>
          </div>
          <div className="text-slate-500">
            <span>Version dev</span>
            <span className="mx-1">•</span>
            <span>Built: Dec 4, 2025, 10:35 AM</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

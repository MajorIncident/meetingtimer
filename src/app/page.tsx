import { MeetingTimerShell } from "@/components/MeetingTimerShell";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-10">
      <MeetingTimerShell />
    </div>
  );
}

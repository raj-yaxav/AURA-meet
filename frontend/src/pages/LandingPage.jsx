import { createElement, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Keyboard, LockKeyhole, MessageSquareText, Plus, ScreenShare, Sparkles, Video, Wifi } from "lucide-react";

const features = [
  { icon: Video, title: "Clear conversations", text: "Fast peer-to-peer video that adapts to your connection." },
  { icon: ScreenShare, title: "Share in one click", text: "Present your screen without installing another application." },
  { icon: MessageSquareText, title: "Keep everyone aligned", text: "Built-in chat and participant controls stay close at hand." },
  { icon: LockKeyhole, title: "Guest-friendly privacy", text: "Join by room link and choose the name people see." },
];

export function LandingPage() {
  const navigate = useNavigate();
  const [roomCode, setRoomCode] = useState("");
  const cleanCode = (value) => value.trim().replace(/[^a-zA-Z0-9-_]/g, "-");
  const createMeeting = () => navigate(`/join/${crypto.randomUUID().slice(0, 8)}`);
  const joinMeeting = (event) => {
    event.preventDefault();
    const code = cleanCode(roomCode);
    if (code) navigate(`/join/${code}`);
  };

  return (
    <div className="min-h-dvh bg-slate-950 text-white selection:bg-cyan-300 selection:text-slate-950">
      <header className="border-b border-white/10">
        <nav className="mx-auto flex min-h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Primary navigation">
          <Link to="/" className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"><span className="flex size-10 items-center justify-center rounded-xl bg-blue-600"><Video className="size-5" /></span><span className="text-xl font-extrabold tracking-tight">AuraMeet</span></Link>
          <div className="flex items-center gap-2"><Link to="/auth" className="flex min-h-11 items-center rounded-xl px-4 text-sm font-semibold text-slate-300 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400">Sign in</Link><button onClick={createMeeting} className="hidden min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-bold transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 sm:flex"><Plus className="size-4" />New meeting</button></div>
        </nav>
      </header>

      <main>
        <section className="relative overflow-hidden border-b border-white/10 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/15 blur-3xl" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
            <div className="max-w-3xl">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-sm font-semibold text-cyan-300"><Sparkles className="size-4" />No account needed to join</div>
              <h1 className="text-5xl font-extrabold leading-[1.05] tracking-[-0.04em] sm:text-6xl lg:text-7xl">Meet clearly.<br /><span className="text-cyan-300">Move together.</span></h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 sm:text-xl">Start a secure video room in seconds or join as a guest with a meeting code. No downloads, no complicated setup.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button onClick={createMeeting} className="flex min-h-13 cursor-pointer items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 font-bold transition-colors hover:bg-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"><Video className="size-5" />Start a new meeting</button>
                <form onSubmit={joinMeeting} className="flex min-w-0 flex-1 gap-2 sm:max-w-md"><label htmlFor="room-code" className="sr-only">Meeting code</label><div className="relative min-w-0 flex-1"><Keyboard className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-slate-500" /><input id="room-code" value={roomCode} onChange={(event) => setRoomCode(event.target.value)} placeholder="Enter meeting code" className="min-h-13 w-full rounded-xl border border-white/15 bg-white/5 pl-12 pr-4 text-base outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20" /></div><button type="submit" disabled={!roomCode.trim()} aria-label="Join meeting" className="flex size-13 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-white/15 bg-white/5 transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"><ArrowRight /></button></form>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">{["Guest access", "Browser based", "Free to join"].map((item) => <span key={item} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-cyan-400" />{item}</span>)}</div>
            </div>

            <div className="relative mx-auto w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-3 shadow-2xl shadow-blue-950/50">
              <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-800 p-3"><div className="grid h-full grid-cols-2 gap-3"><div className="relative col-span-2 overflow-hidden rounded-xl bg-blue-950"><div className="absolute inset-0 flex items-center justify-center"><div className="flex size-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold">A</div></div><span className="absolute bottom-3 left-3 rounded-lg bg-slate-950/80 px-2.5 py-1.5 text-xs font-semibold">Alex · Host</span></div><div className="flex items-center justify-center rounded-xl bg-cyan-950"><span className="flex size-12 items-center justify-center rounded-full bg-cyan-600 font-bold">M</span></div><div className="flex items-center justify-center rounded-xl bg-slate-700"><span className="flex size-12 items-center justify-center rounded-full bg-slate-600 font-bold">R</span></div></div></div>
              <div className="flex items-center justify-between px-3 pb-1 pt-4"><div><p className="text-sm font-bold">Product sync</p><p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-400"><Wifi className="size-3.5 text-cyan-400" />Connection is excellent</p></div><div className="flex -space-x-2">{["A", "M", "R"].map((item) => <span key={item} className="flex size-8 items-center justify-center rounded-full border-2 border-slate-900 bg-blue-600 text-xs font-bold">{item}</span>)}</div></div>
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8"><div className="mx-auto max-w-7xl"><div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400">Made for momentum</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Everything your conversation needs</h2><p className="mt-4 text-lg leading-8 text-slate-400">A focused meeting experience without the clutter.</p></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(({ icon, title, text }) => <article key={title} className="rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition-colors hover:border-cyan-400/30"><span className="flex size-11 items-center justify-center rounded-xl bg-blue-600/15 text-cyan-300">{createElement(icon, { className: "size-5" })}</span><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-400">{text}</p></article>)}</div></div></section>
      </main>

      <footer className="border-t border-white/10 px-4 py-8 sm:px-6"><div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between"><p>© {new Date().getFullYear()} AuraMeet</p><div className="flex gap-6"><a href="#" className="hover:text-white">Privacy</a><a href="#" className="hover:text-white">Terms</a><a href="#" className="hover:text-white">Help</a></div></div></footer>
    </div>
  );
}

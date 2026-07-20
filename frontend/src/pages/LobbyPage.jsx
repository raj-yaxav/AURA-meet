import { useEffect, useRef, useState } from "react";
import { AlertCircle, ArrowRight, Mic, MicOff, ShieldCheck, User, Video, VideoOff } from "lucide-react";

export function LobbyPage({ stream, mediaError, username, setUsername, connect, videoEnabled, audioEnabled, toggleVideo, toggleAudio }) {
  const videoRef = useRef(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [joinError, setJoinError] = useState("");
  useEffect(() => { if (videoRef.current) videoRef.current.srcObject = stream; }, [stream, videoEnabled]);

  const handleConnect = async () => {
    if (!username.trim() || !stream) return;
    setIsConnecting(true);
    setJoinError("");
    try { await connect(); } catch (error) { setJoinError(error.message); setIsConnecting(false); }
  };

  return (
    <div className="min-h-dvh bg-canvas text-ink">
      <header className="border-b border-line bg-canvas">
        <div className="mx-auto flex min-h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-2.5"><span className="flex size-9 items-center justify-center rounded-lg bg-canvas text-white"><Video className="size-5" /></span><span className="text-lg font-black tracking-tight">AuraMeet</span></div>
          <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-accent-soft"><ShieldCheck className="size-4" />Private room</span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-3 py-4 sm:px-6 sm:py-8 lg:py-12">
        <div className="grid items-center gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(320px,.65fr)] lg:gap-10">
          <section aria-label="Camera preview">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface sm:aspect-video lg:rounded-2xl">
              {stream && videoEnabled ? <video ref={videoRef} autoPlay muted playsInline className="h-full w-full -scale-x-100 object-cover" /> : <div className="flex h-full flex-col items-center justify-center gap-3 text-muted"><span className="flex size-20 items-center justify-center rounded-full bg-surface-raised"><User className="size-8" /></span><span className="text-sm">{stream ? "Camera is off" : "Preparing your camera…"}</span></div>}
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/80 via-black/30 to-transparent p-3 pt-12 sm:p-4">
                <span className="max-w-[50%] truncate text-sm font-semibold text-white">{username || "Your preview"}</span>
                <div className="flex gap-2">
                  <button type="button" onClick={toggleAudio} disabled={!stream} aria-label={audioEnabled ? "Mute microphone" : "Unmute microphone"} className={`flex size-12 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40 ${audioEnabled ? "border-white/20 bg-black/55 text-white" : "border-red-300 bg-red-600 text-white"}`}>{audioEnabled ? <Mic className="size-5" /> : <MicOff className="size-5" />}</button>
                  <button type="button" onClick={toggleVideo} disabled={!stream} aria-label={videoEnabled ? "Turn camera off" : "Turn camera on"} className={`flex size-12 items-center justify-center rounded-full border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-40 ${videoEnabled ? "border-white/20 bg-black/55 text-white" : "border-red-300 bg-red-600 text-white"}`}>{videoEnabled ? <Video className="size-5" /> : <VideoOff className="size-5" />}</button>
                </div>
              </div>
            </div>
            {mediaError && <p role="alert" className="mt-3 flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 p-3 text-sm text-red-800"><AlertCircle className="mt-0.5 size-4 shrink-0" />{mediaError}</p>}
          </section>

          <section className="border-t border-line pt-5 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-accent-soft">Join as a guest</p>
            <h1 className="mt-2 text-3xl font-black leading-tight tracking-tight sm:text-4xl">How should people see you?</h1>
            <p className="mt-3 text-sm leading-6 text-muted sm:text-base">Use the name you want shown inside this meeting.</p>
            <div className="mt-5">
              <label htmlFor="display-name" className="mb-2 block text-sm font-bold">Display name</label>
              <div className="relative"><User className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted" /><input id="display-name" type="text" inputMode="text" autoComplete="name" autoFocus value={username} onChange={(event) => setUsername(event.target.value)} onKeyDown={(event) => event.key === "Enter" && handleConnect()} placeholder="e.g. Raj Yadav" className="min-h-13 w-full rounded-lg border border-line bg-surface pl-12 pr-4 text-base outline-none transition-colors placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/15" /></div>
            </div>
            {joinError && <p role="alert" className="mt-3 text-sm font-medium text-red-700">{joinError}</p>}
            <button type="button" onClick={handleConnect} disabled={!username.trim() || !stream || isConnecting} className="mt-4 flex min-h-13 w-full items-center justify-center gap-2 rounded-lg bg-accent px-5 font-bold text-white transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted">{isConnecting ? "Joining…" : <>Join meeting<ArrowRight className="size-5" /></>}</button>
            <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-muted"><ShieldCheck className="mt-0.5 size-4 shrink-0 text-accent-soft" />Your camera and microphone stay under your control.</p>
          </section>
        </div>
      </main>
    </div>
  );
}

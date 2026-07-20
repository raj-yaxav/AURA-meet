import { useEffect, useRef, useState } from "react";
import {
  Check, ChevronRight, Copy, Link2, MessageSquare, Mic, MicOff, MonitorUp,
  MoreHorizontal, PhoneOff, Send, ShieldCheck, Users, Video, VideoOff, X,
} from "lucide-react";

function StreamVideo({ stream, muted = false, className = "" }) {
  const ref = useRef(null);
  useEffect(() => { if (ref.current) ref.current.srcObject = stream; }, [stream]);
  return <video ref={ref} autoPlay playsInline muted={muted} className={className} />;
}

function ControlButton({ active = true, danger = false, label, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex size-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg border px-2 text-sm font-semibold outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-canvas sm:min-h-12 sm:w-auto sm:min-w-12 sm:px-3 lg:px-4 ${
        danger ? "border-red-500 bg-red-500 text-white hover:bg-red-600" : active
          ? "border-line bg-surface-raised text-ink hover:bg-line"
          : "border-red-400/30 bg-red-500/15 text-red-300 hover:bg-red-500/25"
      }`}
    >
      {children}<span className="hidden lg:inline">{label}</span>
    </button>
  );
}

export function MeetingPage({
  roomId, localStream, videos, username, messages, sendMessage, socketConnected, videoEnabled, audioEnabled,
  isSharing, toggleVideo, toggleAudio, toggleScreenShare, leaveMeeting,
}) {
  const [panel, setPanel] = useState(null);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);
  const [actionError, setActionError] = useState("");
  const chatEndRef = useRef(null);
  const participants = videos.length + 1;
  const roomName = roomId || "home";

  useEffect(() => {
    if (panel === "chat") chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, panel]);

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };
  const submitMessage = (event) => {
    event.preventDefault();
    const value = message.trim();
    if (!value) return;
    if (!sendMessage(value)) {
      setActionError("Chat is reconnecting. Try again in a moment.");
      return;
    }
    setActionError("");
    setMessage("");
  };
  const handleScreenShare = async () => {
    try {
      setActionError("");
      await toggleScreenShare();
    } catch (error) {
      setActionError(error.message || "Screen sharing could not start.");
    }
  };

  return (
    <div className="flex min-h-dvh flex-col overflow-hidden bg-canvas text-ink">
      <header className="flex min-h-16 items-center justify-between gap-3 border-b border-line bg-canvas px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent"><Video className="size-5" /></div>
          <div className="min-w-0">
            <div className="flex items-center gap-2"><h1 className="truncate text-sm font-bold sm:text-base">{roomName}</h1><ShieldCheck className="size-4 text-accent-soft" aria-label="Secure meeting" /></div>
            <p className="text-xs text-muted">AuraMeet · Live now</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={copyLink} className="flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-line bg-surface px-3 text-sm font-medium text-ink transition-colors hover:bg-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
            {copied ? <Check className="size-4 text-accent-soft" /> : <Link2 className="size-4" />}<span className="hidden sm:inline">{copied ? "Copied" : "Invite"}</span>
          </button>
          <button aria-label="More meeting options" className="flex size-11 cursor-pointer items-center justify-center rounded-xl text-muted hover:bg-surface-raised hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"><MoreHorizontal /></button>
        </div>
      </header>

      <main className="relative flex min-h-0 flex-1">
        {actionError && <p role="alert" className="absolute left-1/2 top-3 z-30 -translate-x-1/2 rounded-xl border border-red-400/20 bg-red-950 px-4 py-2 text-sm text-red-200">{actionError}</p>}
        <section className="flex min-w-0 flex-1 items-center justify-center p-3 pb-24 sm:p-5 sm:pb-28">
          <div className={`grid h-full max-h-[calc(100dvh-11rem)] w-full gap-3 ${participants === 1 ? "max-w-5xl grid-cols-1" : "max-w-7xl grid-cols-1 sm:grid-cols-2"}`}>
            <div className="relative min-h-56 overflow-hidden rounded-2xl border border-line bg-surface">
              <StreamVideo stream={localStream} muted className={`h-full w-full object-cover ${isSharing ? "" : "-scale-x-100"} ${videoEnabled || isSharing ? "" : "invisible"}`} />
              {!videoEnabled && !isSharing && <div className="absolute inset-0 flex items-center justify-center"><div className="flex size-20 items-center justify-center rounded-full bg-accent text-2xl font-bold">{username.slice(0, 1).toUpperCase()}</div></div>}
              <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-canvas/80 px-2.5 py-1.5 text-xs font-semibold backdrop-blur"><span>{username} (You)</span>{audioEnabled ? <Mic className="size-3.5 text-accent-soft" /> : <MicOff className="size-3.5 text-red-400" />}</div>
            </div>
            {videos.map(({ socketId, stream }, index) => (
              <div key={socketId} className="relative min-h-56 overflow-hidden rounded-2xl border border-line bg-surface">
                <StreamVideo stream={stream} className="h-full w-full object-cover" />
                <div className="absolute bottom-3 left-3 rounded-lg bg-canvas/80 px-2.5 py-1.5 text-xs font-semibold backdrop-blur">Participant {index + 2}</div>
              </div>
            ))}
          </div>
        </section>

        {panel && (
          <aside className="fixed inset-x-0 bottom-18 top-16 z-40 flex flex-col border-l border-line bg-canvas sm:absolute sm:inset-y-0 sm:left-auto sm:right-0 sm:max-w-sm" aria-label={`${panel} panel`}>
            <div className="flex min-h-16 items-center justify-between border-b border-line px-5"><div><h2 className="font-bold">{panel === "chat" ? "Meeting chat" : `People (${participants})`}</h2>{panel === "chat" && <p className={`mt-0.5 text-xs ${socketConnected ? "text-accent-soft" : "text-amber-300"}`}>{socketConnected ? "Connected" : "Reconnecting…"}</p>}</div><button onClick={() => setPanel(null)} aria-label="Close panel" className="flex size-11 cursor-pointer items-center justify-center rounded-xl text-muted hover:bg-surface-raised hover:text-white"><X /></button></div>
            {panel === "chat" ? <>
              <div className="flex-1 space-y-4 overflow-y-auto p-5" aria-live="polite">
                {messages.length === 0 ? <div className="flex h-full flex-col items-center justify-center text-center"><MessageSquare className="mb-3 size-10 text-muted" /><p className="font-semibold">No messages yet</p><p className="mt-1 text-sm text-muted">Start the conversation with everyone.</p></div> : messages.map((item) => <div key={item.id} className={`max-w-[88%] ${item.own ? "ml-auto" : ""}`}><p className="mb-1 text-xs text-muted">{item.sender}</p><p className={`rounded-lg px-3 py-2 text-sm ${item.own ? "bg-accent text-white" : "bg-surface-raised"}`}>{item.text}</p></div>)}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={submitMessage} className="flex gap-2 border-t border-line p-4"><label htmlFor="meeting-message" className="sr-only">Message everyone</label><input id="meeting-message" value={message} onChange={(event) => setMessage(event.target.value)} disabled={!socketConnected} placeholder={socketConnected ? "Message everyone" : "Reconnecting…"} className="min-h-12 min-w-0 flex-1 rounded-lg border border-line bg-surface px-4 text-base outline-none placeholder:text-muted focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-50" /><button type="submit" disabled={!message.trim() || !socketConnected} aria-label="Send message" className="flex size-12 cursor-pointer items-center justify-center rounded-lg bg-accent text-white hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"><Send className="size-5" /></button></form>
            </> : <div className="flex-1 space-y-2 overflow-y-auto p-4"><div className="flex items-center gap-3 rounded-xl bg-surface p-3"><div className="flex size-10 items-center justify-center rounded-full bg-accent font-bold">{username.slice(0, 1).toUpperCase()}</div><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{username} (You)</p><p className="text-xs text-muted">Host</p></div><Mic className="size-4 text-accent-soft" /></div>{videos.map((video, index) => <div key={video.socketId} className="flex items-center gap-3 rounded-xl p-3 hover:bg-surface"><div className="flex size-10 items-center justify-center rounded-full bg-accent font-bold">P</div><p className="flex-1 text-sm font-semibold">Participant {index + 2}</p><Mic className="size-4 text-muted" /></div>)}</div>}
          </aside>
        )}
      </main>

      <nav aria-label="Meeting controls" className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-canvas px-2 pt-2 pb-[max(.5rem,env(safe-area-inset-bottom))] sm:px-6 sm:py-3">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-2">
          <div className="hidden min-w-28 text-xs text-muted md:block"><p className="font-semibold text-ink">{new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p><p className="truncate">{roomName}</p></div>
          <div className="flex min-w-0 flex-1 items-center justify-center gap-1 sm:gap-2">
            <ControlButton active={audioEnabled} label={audioEnabled ? "Mute" : "Unmute"} onClick={toggleAudio}>{audioEnabled ? <Mic className="size-5" /> : <MicOff className="size-5" />}</ControlButton>
            <ControlButton active={videoEnabled} label={videoEnabled ? "Stop video" : "Start video"} onClick={toggleVideo}>{videoEnabled ? <Video className="size-5" /> : <VideoOff className="size-5" />}</ControlButton>
            <ControlButton active={!isSharing} label={isSharing ? "Stop sharing" : "Share screen"} onClick={handleScreenShare}><MonitorUp className="size-5" /></ControlButton>
            <ControlButton label="People" onClick={() => setPanel(panel === "people" ? null : "people")}><Users className="size-5" /><span className="hidden rounded-full bg-line px-1.5 text-xs sm:inline">{participants}</span></ControlButton>
            <ControlButton label="Chat" onClick={() => setPanel(panel === "chat" ? null : "chat")}><MessageSquare className="size-5" /></ControlButton>
            <ControlButton danger label="Leave" onClick={leaveMeeting}><PhoneOff className="size-5" /></ControlButton>
          </div>
          <button onClick={copyLink} className="hidden min-w-28 items-center justify-end gap-1 text-xs font-semibold text-muted hover:text-white md:flex">Meeting details <ChevronRight className="size-4" /><Copy className="sr-only" /></button>
        </div>
      </nav>
    </div>
  );
}

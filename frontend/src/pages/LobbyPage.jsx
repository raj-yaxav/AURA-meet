import { Video, Mic, MicOff, VideoOff, ArrowRight, User, Hash } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export function LobbyPage({ localVideoRef, username, setUsername, connect }) {
  const [isCamOn, setIsCamOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [roomId, setRoomId] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [videoStream, setVideoStream] = useState(null);

  useEffect(() => {
    // Preview camera feed
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setVideoStream(stream);
        if (localVideoRef?.current) {
          localVideoRef.current.srcObject = stream;
        }
      })
      .catch(() => setIsCamOn(false));

    return () => {
      videoStream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const toggleCam = () => {
    if (videoStream) {
      videoStream.getVideoTracks().forEach((t) => (t.enabled = !isCamOn ? true : false));
    }
    setIsCamOn((p) => !p);
  };

  const toggleMic = () => setIsMicOn((p) => !p);

  const handleConnect = async () => {
    if (!username.trim()) return;
    setIsConnecting(true);
    await connect?.();
    setIsConnecting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden flex flex-col">
      {/* Ambient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse -top-48 -left-48" />
        <div className="absolute w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000 -bottom-32 -right-32" />
        <div className="absolute w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-slate-800/60 backdrop-blur-xl bg-slate-900/40">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center">
            <Video className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            AuraMeet
          </span>
        </div>
        <span className="text-slate-400 text-sm tracking-widest uppercase">Lobby</span>
      </nav>

      {/* Main content */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid md:grid-cols-2 gap-10 items-center">

          {/* Left: camera preview */}
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-bold text-slate-200 mb-1">Camera Preview</h2>

            <div className="relative rounded-2xl overflow-hidden bg-slate-800/70 border border-slate-700/50 aspect-video shadow-2xl shadow-purple-900/30">
              {isCamOn ? (
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-slate-700 flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-400" />
                  </div>
                  <span className="text-slate-400 text-sm">Camera is off</span>
                </div>
              )}

              {/* Username overlay */}
              {username && (
                <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-slate-900/70 backdrop-blur text-xs text-slate-300 font-medium">
                  {username}
                </div>
              )}

              {/* Live indicator */}
              {isCamOn && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full bg-red-500/20 border border-red-500/40">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-red-300 text-xs font-medium">LIVE</span>
                </div>
              )}
            </div>

            {/* Device controls */}
            <div className="flex gap-3">
              <button
                onClick={toggleCam}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-300 font-medium text-sm ${
                  isCamOn
                    ? 'bg-slate-800/60 border-slate-700 text-white hover:border-purple-500/60'
                    : 'bg-red-500/20 border-red-500/50 text-red-300'
                }`}
              >
                {isCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                {isCamOn ? 'Camera On' : 'Camera Off'}
              </button>
              <button
                onClick={toggleMic}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-300 font-medium text-sm ${
                  isMicOn
                    ? 'bg-slate-800/60 border-slate-700 text-white hover:border-purple-500/60'
                    : 'bg-red-500/20 border-red-500/50 text-red-300'
                }`}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                {isMicOn ? 'Mic On' : 'Mic Off'}
              </button>
            </div>
          </div>

          {/* Right: join form */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-2">
                Ready to{' '}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Connect?
                </span>
              </h1>
              <p className="text-slate-400 text-base leading-relaxed">
                Set your display name and jump straight into your meeting.
              </p>
            </div>

            <div className="space-y-4">
              {/* Username input */}
              <div className="relative group">
                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">
                  Display Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter your name..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-800/70 border border-slate-700 focus:border-purple-500 rounded-xl text-white placeholder-slate-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 text-sm"
                  />
                </div>
              </div>

              {/* Room ID input */}
              <div className="relative group">
                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">
                  Room ID <span className="text-slate-600">(optional)</span>
                </label>
                <div className="relative">
                  <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                  <input
                    type="text"
                    placeholder="Enter room ID to join..."
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 bg-slate-800/70 border border-slate-700 focus:border-purple-500 rounded-xl text-white placeholder-slate-500 outline-none transition-all duration-300 focus:ring-2 focus:ring-purple-500/20 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleConnect}
              disabled={!username.trim() || isConnecting}
              className="group relative w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed py-4 rounded-xl text-white font-semibold text-base transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-900/40 flex items-center justify-center gap-2"
            >
              {isConnecting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  Join Meeting
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <div className="flex-1 h-px bg-slate-800" />
              <span className="text-slate-600 text-xs">or</span>
              <div className="flex-1 h-px bg-slate-800" />
            </div>

            <button className="w-full py-3.5 rounded-xl border border-slate-700 hover:border-purple-500/50 text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 hover:bg-slate-800/50">
              Create New Room
            </button>

            {/* Tips */}
            <p className="text-center text-slate-600 text-xs">
              By joining, you agree to our{' '}
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
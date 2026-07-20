import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import { LobbyPage } from "./LobbyPage";
import { MeetingPage } from "./MeetingPage";
import { backendUrl } from "../config/api";

const peerConfig = { iceServers: [{ urls: "stun:stun.l.google.com:19302" }] };

export default function VideoMeetComponent() {
  const { roomId = "home" } = useParams();
  const socketRef = useRef(null);
  const socketIdRef = useRef(null);
  const peersRef = useRef({});
  const localStreamRef = useRef(null);
  const displayStreamRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [previewStream, setPreviewStream] = useState(null);
  const [mediaError, setMediaError] = useState("");
  const [inLobby, setInLobby] = useState(true);
  const [username, setUsername] = useState("");
  const [videos, setVideos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [isSharing, setIsSharing] = useState(false);

  useEffect(() => {
    let active = true;
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (!active) { stream.getTracks().forEach((track) => track.stop()); return; }
      localStreamRef.current = stream;
      setLocalStream(stream);
      setPreviewStream(stream);
      setVideoEnabled(stream.getVideoTracks().some((track) => track.enabled));
      setAudioEnabled(stream.getAudioTracks().some((track) => track.enabled));
    }).catch((error) => {
      console.error(error);
      setMediaError("Camera or microphone access was blocked. Allow device access in your browser and reload.");
    });
    return () => { active = false; };
  }, []);

  const upsertRemoteVideo = useCallback((socketId, stream) => {
    setVideos((current) => current.some((video) => video.socketId === socketId)
      ? current.map((video) => video.socketId === socketId ? { ...video, stream } : video)
      : [...current, { socketId, stream }]);
  }, []);

  const createPeer = useCallback((socketId) => {
    if (!socketId || socketId === socketIdRef.current) return null;
    if (peersRef.current[socketId]) return peersRef.current[socketId];
    const peer = new RTCPeerConnection(peerConfig);
    peersRef.current[socketId] = peer;
    localStreamRef.current?.getTracks().forEach((track) => peer.addTrack(track, localStreamRef.current));
    peer.onicecandidate = ({ candidate }) => candidate && socketRef.current?.emit("signal", socketId, JSON.stringify({ ice: candidate }));
    peer.ontrack = ({ streams }) => streams[0] && upsertRemoteVideo(socketId, streams[0]);
    peer.onconnectionstatechange = () => {
      if (["failed", "closed"].includes(peer.connectionState)) {
        peer.close();
        delete peersRef.current[socketId];
        setVideos((current) => current.filter((video) => video.socketId !== socketId));
      }
    };
    return peer;
  }, [upsertRemoteVideo]);

  const handleSignal = useCallback(async (fromId, rawMessage) => {
    const peer = createPeer(fromId);
    if (!peer) return;
    const signal = JSON.parse(rawMessage);
    if (signal.sdp) {
      await peer.setRemoteDescription(signal.sdp);
      if (signal.sdp.type === "offer") {
        await peer.setLocalDescription(await peer.createAnswer());
        socketRef.current?.emit("signal", fromId, JSON.stringify({ sdp: peer.localDescription }));
      }
    } else if (signal.ice) {
      await peer.addIceCandidate(signal.ice);
    }
  }, [createPeer]);

  const connectToRoom = useCallback(() => {
    if (socketRef.current) return;
    const socket = io(backendUrl, { transports: ["websocket", "polling"] });
    socketRef.current = socket;
    socket.on("signal", (fromId, message) => handleSignal(fromId, message).catch(console.error));
    socket.on("connect", () => { socketIdRef.current = socket.id; socket.emit("join-call", roomId); });
    socket.on("chat-message", (text, sender, senderId, messageId) => {
      setMessages((current) => current.some((item) => item.id === messageId) ? current : [...current, { id: messageId, text, sender, own: senderId === socket.id }]);
    });
    socket.on("user-left", (id) => {
      peersRef.current[id]?.close();
      delete peersRef.current[id];
      setVideos((current) => current.filter((video) => video.socketId !== id));
    });
    socket.on("user-joined", async (id, clients) => {
      clients.forEach(createPeer);
      if (id !== socket.id) return;
      for (const clientId of clients) {
        if (clientId === socket.id) continue;
        const peer = createPeer(clientId);
        await peer.setLocalDescription(await peer.createOffer());
        socket.emit("signal", clientId, JSON.stringify({ sdp: peer.localDescription }));
      }
    });
  }, [createPeer, handleSignal, roomId]);

  const connect = async () => {
    if (!localStreamRef.current) throw new Error("Camera and microphone are not ready");
    setInLobby(false);
    connectToRoom();
  };

  const toggleTrack = (kind) => {
    const tracks = kind === "video" ? localStreamRef.current?.getVideoTracks() : localStreamRef.current?.getAudioTracks();
    if (!tracks?.length) return;
    const enabled = !tracks[0].enabled;
    tracks.forEach((track) => { track.enabled = enabled; });
    kind === "video" ? setVideoEnabled(enabled) : setAudioEnabled(enabled);
  };

  const stopScreenShare = useCallback(() => {
    const cameraTrack = localStreamRef.current?.getVideoTracks()[0];
    if (cameraTrack) Object.values(peersRef.current).forEach((peer) => peer.getSenders().find(({ track }) => track?.kind === "video")?.replaceTrack(cameraTrack));
    displayStreamRef.current?.getTracks().forEach((track) => { track.onended = null; track.stop(); });
    displayStreamRef.current = null;
    setPreviewStream(localStreamRef.current);
    setIsSharing(false);
  }, []);

  const toggleScreenShare = async () => {
    if (isSharing) { stopScreenShare(); return; }
    if (!navigator.mediaDevices?.getDisplayMedia) throw new Error("Screen sharing is not supported by this browser");
    const displayStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
    const screenTrack = displayStream.getVideoTracks()[0];
    displayStreamRef.current = displayStream;
    await Promise.all(Object.values(peersRef.current).map(async (peer) => {
      const sender = peer.getSenders().find(({ track }) => track?.kind === "video");
      if (sender) await sender.replaceTrack(screenTrack);
    }));
    setPreviewStream(displayStream);
    setIsSharing(true);
    screenTrack.onended = stopScreenShare;
  };

  const sendMessage = (text) => {
    if (!socketRef.current?.connected) return false;
    socketRef.current.emit("chat-message", { text, sender: username });
    return true;
  };

  const cleanUp = useCallback(() => {
    socketRef.current?.disconnect();
    socketRef.current = null;
    Object.values(peersRef.current).forEach((peer) => peer.close());
    peersRef.current = {};
    displayStreamRef.current?.getTracks().forEach((track) => track.stop());
    localStreamRef.current?.getTracks().forEach((track) => track.stop());
  }, []);

  const leaveMeeting = () => { cleanUp(); window.location.assign("/"); };
  useEffect(() => cleanUp, [cleanUp]);

  return inLobby ? (
    <LobbyPage stream={localStream} mediaError={mediaError} username={username} setUsername={setUsername} connect={connect} videoEnabled={videoEnabled} audioEnabled={audioEnabled} toggleVideo={() => toggleTrack("video")} toggleAudio={() => toggleTrack("audio")} />
  ) : (
    <MeetingPage localStream={previewStream} videos={videos} username={username} messages={messages} sendMessage={sendMessage} videoEnabled={videoEnabled} audioEnabled={audioEnabled} isSharing={isSharing} toggleVideo={() => toggleTrack("video")} toggleAudio={() => toggleTrack("audio")} toggleScreenShare={toggleScreenShare} leaveMeeting={leaveMeeting} />
  );
}

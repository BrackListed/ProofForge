import { useEffect, useRef, useState } from "react";
import { LeftSidebar } from "../components/LeftSidebar";
import backgroundImage from "../assets/Debate_Background.jpg";
import { useAuth } from "@clerk/react";
import axios from "axios";

interface SpeechRecognitionResultLike {
  isFinal: boolean;
  [index: number]: { transcript: string };
}

interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResultLike>;
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}

const SpeechRecognitionCtor: (new () => SpeechRecognitionLike) | undefined =
  (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionLike }).SpeechRecognition ??
  (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognitionLike }).webkitSpeechRecognition;

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function Debate() {
  const [inRoom, setInRoom] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [topic, setTopic] = useState("");
  const [argument, setArgument] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseTextRef = useRef("");
  const {userId, getToken} = useAuth()
  const [roomId, setRoomId] = useState('')
  useEffect(() => {
    if (!hasStarted || isDone) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [hasStarted, isDone]);

  const handleArgumentChange = (value: string) => {
    setArgument(value);
    if (!hasStarted && value.length > 0) setHasStarted(true);
  };

  const getRecognition = () => {
    if (recognitionRef.current || !SpeechRecognitionCtor) return recognitionRef.current;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let finalTranscript = "";
      let interimTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) finalTranscript += result[0].transcript;
        else interimTranscript += result[0].transcript;
      }

      const base = baseTextRef.current;
      const needsSpace = base.length > 0 && !base.endsWith(" ") ? " " : "";
      handleArgumentChange(base + needsSpace + finalTranscript + interimTranscript);
    };

    recognition.onend = () => setIsSpeaking(false);
    recognition.onerror = () => setIsSpeaking(false);

    recognitionRef.current = recognition;
    return recognition;
  };

  const toggleSpeaking = () => {
    const recognition = getRecognition();
    if (!recognition) return;

    if (isSpeaking) {
      recognition.stop();
      setIsSpeaking(false);
    } else {
      baseTextRef.current = argument;
      recognition.start();
      setIsSpeaking(true);
    }
  };

  return (
    <div className="relative flex min-h-screen font-mono text-zinc-300">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="fixed inset-0 -z-10 bg-black/70" />

      <LeftSidebar />

      <main
        className="relative flex-1 overflow-y-auto px-8 py-8"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        {inRoom ? (
          <>
            <header className="mb-6">
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) recognitionRef.current?.stop();
                  setIsSpeaking(false);
                  setInRoom(false);
                }}
                className="mb-3 text-xs tracking-wide text-zinc-500 transition-colors hover:text-red-400"
              >
                &larr; Back to Rooms
              </button>
              <h1 className="text-lg font-semibold tracking-wide text-zinc-100">
                {roomName} <span className="text-red-400">[LIVE]</span>
              </h1>
              <p className="mt-1 text-xs text-zinc-500">Topic: {topic}</p>
            </header>

            <div className="grid grid-cols-2 gap-6">
              <div className="border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs tracking-widest text-zinc-500">[YOUR ARGUMENT]</p>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        hasStarted && !isDone ? "bg-red-400 animate-pulse" : "bg-zinc-600"
                      }`}
                    />
                    {formatTime(seconds)}
                  </div>
                </div>

                <div className="relative">
                  <textarea
                    value={argument}
                    onChange={(e) => handleArgumentChange(e.target.value)}
                    readOnly={isDone || isSpeaking}
                    placeholder="Start Typing your arguments... Or click start speaking at the bottom right of this box to speak instead"
                    className="h-64 w-full resize-none border border-zinc-800 bg-black/60 p-3 pb-12 text-sm text-zinc-300 outline-none focus:border-red-500/50"
                  />
                  <button
                    type="button"
                    disabled={isDone || !SpeechRecognitionCtor}
                    onClick={toggleSpeaking}
                    title={SpeechRecognitionCtor ? undefined : "Speech recognition isn't supported in this browser"}
                    className={`absolute right-3 bottom-3 border px-3 py-1.5 text-xs tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                      isSpeaking
                        ? "border-red-500/60 bg-red-500/10 text-red-400"
                        : "border-zinc-700 bg-black/70 text-zinc-400 hover:border-red-500/50 hover:text-red-400"
                    }`}
                  >
                    {isSpeaking ? "● Stop Speaking" : "Start Speaking"}
                  </button>
                </div>
              </div>

              <div className="border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.75}
                    stroke="currentColor"
                    className="h-4 w-4 text-zinc-500"
                  >
                    <rect x="5" y="8" width="14" height="10" rx="2" />
                    <path d="M12 8V5M9 5h6" />
                    <path d="M3 12h2M19 12h2" />
                    <circle cx="9.5" cy="13" r="1" fill="currentColor" stroke="none" />
                    <circle cx="14.5" cy="13" r="1" fill="currentColor" stroke="none" />
                  </svg>
                  <p className="text-xs tracking-widest text-zinc-500">[AI RESPONSE]</p>
                </div>

                <textarea
                  readOnly
                  value=""
                  placeholder="AI response will appear here..."
                  className="h-64 w-full resize-none border border-zinc-800 bg-black/60 p-3 text-sm text-zinc-300 outline-none"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                type="button"
                disabled={isDone}
                onClick={() => {
                  if (isSpeaking) recognitionRef.current?.stop();
                  setIsSpeaking(false);
                  setIsDone(true);
                }}
                className="border border-zinc-700 px-10 py-2.5 text-sm tracking-wide text-zinc-300 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isDone ? "✓ Done" : "> Done <"}
              </button>
            </div>
          </>
        ) : (
          <>
            <header className="mb-6 flex items-start justify-between">
              <div>
                <h1 className="text-lg font-semibold tracking-wide text-zinc-100">
                  Debate <span className="text-red-400">Simulator</span>
                </h1>
                <p className="mt-1 text-xs text-zinc-500">
                  Speak or type your argument — the AI cuts in and interrupts you on the spot.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setRoomName("");
                  setTopic("");
                  setIsCreateOpen(true);
                }}
                className="border border-zinc-700 bg-zinc-950/70 px-4 py-2 text-xs tracking-wide text-zinc-300 backdrop-blur-sm transition-colors hover:border-red-500/50 hover:text-red-400"
              >
                + Create Room
              </button>
            </header>

            <p className="mb-3 text-xs tracking-widest text-zinc-500">[ROOMS]</p>
            <div className="grid grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => {
                  setRoomName("Sample Debate Room");
                  setTopic("Should social media be regulated like a public utility?");
                  setArgument("");
                  setIsSpeaking(false);
                  setIsDone(false);
                  setHasStarted(false);
                  setSeconds(0);
                  setInRoom(true);
                }}
                className="group border border-zinc-700 bg-zinc-950/70 p-4 text-left backdrop-blur-sm transition-colors hover:border-red-500/50 hover:bg-zinc-900"
              >
                <p className="mb-2 text-xs tracking-widest text-red-400">[SAMPLE DEBATE ROOM]</p>
                <p className="text-xs leading-relaxed text-zinc-500">
                  Topic: Should social media be regulated like a public utility?
                </p>
                <span className="mt-2 inline-block text-xs text-red-400 opacity-0 transition-opacity group-hover:opacity-100">
                  Enter &rarr;
                </span>
              </button>
            </div>
          </>
        )}
      </main>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="w-full max-w-sm border border-zinc-700 bg-zinc-950/95 p-5 font-mono backdrop-blur-sm">
            <p className="mb-4 text-xs tracking-widest text-zinc-500">[CREATE ROOM]</p>

            <label className="mb-1 block text-xs text-zinc-500">Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Universal Basic Income"
              className="mb-4 w-full border border-zinc-800 bg-black/60 p-2 text-sm text-zinc-300 outline-none focus:border-red-500/50"
            />

            <label className="mb-1 block text-xs text-zinc-500">Topic to Debate</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Should UBI replace existing welfare programs?"
              className="mb-5 w-full border border-zinc-800 bg-black/60 p-2 text-sm text-zinc-300 outline-none focus:border-red-500/50"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="px-4 py-2 text-xs tracking-wide text-zinc-500 transition-colors hover:text-zinc-300"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!roomName.trim() || !topic.trim()}
                onClick={() => {
                  setIsCreateOpen(false);
                  setArgument("");
                  setIsSpeaking(false);
                  setIsDone(false);
                  setHasStarted(false);
                  setSeconds(0);
                  setInRoom(true);
                  createRoom(roomName, topic, userId)
                }}
                className="border border-zinc-700 px-4 py-2 text-xs tracking-wide text-zinc-300 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                &gt; Create &lt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  async function createRoom(title: string, topic: string, userId: string | undefined | null){
    const token = getToken()
    const result = await axios.post(`http://localhost:5000/create-room/${userId}`, {title: title, topic: topic}, {headers: {Authorization: `Bearer ${token}`}})
    setRoomId(result.data)
  }
}

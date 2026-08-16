import { useEffect, useRef, useState } from "react";
import { LeftSidebar } from "../components/LeftSidebar";
import backgroundImage from "../assets/Debate_Background.jpg";
import { useAuth } from "@clerk/react";
import axios from "axios";
import { useTourPrefill } from "../tour/useTourPrefill";
import { DEMO_ARGUMENT, DEMO_ROOM_TITLE, DEMO_ROOM_TOPIC } from "../tour/steps";

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

interface roomType {
    id: string
    user_id: string
    title: string
    topic: string
}

interface transcriptType{
    text: string | { response: string }
    sender: string
}

function transcriptText(entry: transcriptType): string {
  return typeof entry.text === "string" ? entry.text : entry.text?.response ?? "";
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
  const [rooms, setRooms] = useState<roomType[]>([])
  const [roomId, setRoomId] = useState('')
  const [aiTranscript, setAiTranscript] = useState<transcriptType[]>([])
  const [userTranscript, setUserTranscript] = useState<transcriptType[]>([])
  const [timeLimit, setTimeLimit] = useState(180)
  const [aiResponseText, setAiResponseText] = useState("")
  const [isAiTyping, setIsAiTyping] = useState(false)
  const revealIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const activeRoom = rooms.find((r) => r.id === roomId) ?? null;

  useTourPrefill("debate-create", !isCreateOpen, () => {
    setRoomName(DEMO_ROOM_TITLE);
    setTopic(DEMO_ROOM_TOPIC);
    setIsCreateOpen(true);
  });

  useTourPrefill("debate-argument", Boolean(roomId) && !argument, () => {
    setArgument(DEMO_ARGUMENT);
  });

  useEffect(() => {
    if (!hasStarted || isDone) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [hasStarted, isDone]);

  // auto-submit the current argument once the user's clock runs out
  useEffect(() => {
    if (!hasStarted || isDone) return;
    if (timeLimit - seconds > 0) return;
    const timeout = setTimeout(() => {
      if (isSpeaking) recognitionRef.current?.stop();
      setIsSpeaking(false);
      setIsDone(true);
      processArgument(argument, userId, roomId);
    }, 0);
    return () => clearTimeout(timeout);
  }, [seconds, timeLimit, isDone, hasStarted]);

  useEffect(() => {
    return () => {
      if (revealIntervalRef.current) clearInterval(revealIntervalRef.current);
    };
  }, []);

  const typeOutResponse = (fullText: string, submittedArgument: string) => {
    if (revealIntervalRef.current) clearInterval(revealIntervalRef.current);
    setAiResponseText("");
    setIsAiTyping(true);
    let i = 0;
    revealIntervalRef.current = setInterval(() => {
      i++;
      setAiResponseText(fullText.slice(0, i));
      if (i >= fullText.length) {
        if (revealIntervalRef.current) clearInterval(revealIntervalRef.current);
        revealIntervalRef.current = null;
        setIsAiTyping(false);
        setUserTranscript((prev) => [...prev, { text: submittedArgument, sender: "user" }]);
        setAiTranscript((prev) => [...prev, { text: fullText, sender: "ai" }]);
        setArgument("");
        setSeconds(0);
        setIsDone(false);
      }
    }, 20);
  };

  useEffect(() => {
    if (!userId) return;
    const fetchRoomData = async() => {
        const token = await getToken()
        const result = await axios.get(`http://localhost:5000/rooms/${userId}`, {headers: {Authorization: `Bearer ${token}`}})
        setRooms(result.data)
    }
    fetchRoomData()
  }, [userId])
  useEffect(() => {
    if(!roomId) return 
    const fetchDebateLogs = async() => {
        const token = await getToken()
        const result = await axios.get(`http://localhost:5000/debate/logs/${roomId}/${userId}`, {headers: {Authorization: `Bearer ${token}`}})
        const log = result.data?.[0]
        if(!log?.transcript){
          setUserTranscript([])
          setAiTranscript([])
          return
        }
        const userTranscript = log.transcript.filter((item: transcriptType) => item.sender === "user")
        const aiTranscript = log.transcript.filter((item: transcriptType) => item.sender === "ai")
        setUserTranscript(userTranscript)
        setAiTranscript(aiTranscript)
    }
    if(roomId) fetchDebateLogs()
  }, [roomId])

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
        {roomId ? (
          <>
            <header className="mb-6">
              <button
                type="button"
                onClick={() => {
                  if (isSpeaking) recognitionRef.current?.stop();
                  setIsSpeaking(false);
                  setRoomId('');
                }}
                className="mb-3 text-xs tracking-wide text-zinc-500 transition-colors hover:text-red-400"
              >
                &larr; Back to Rooms
              </button>
              <h1 className="text-lg font-semibold tracking-wide text-zinc-100">
                {activeRoom?.title} <span className="text-red-400">[LIVE]</span>
              </h1>
              <p className="mt-1 text-xs text-zinc-500">Topic: {activeRoom?.topic}</p>
            </header>

            <div data-tour="debate-argument-input">
            <div className="grid grid-cols-2 gap-6">
              <div className="border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs tracking-widest text-zinc-500">[YOUR ARGUMENT]</p>
                  <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        hasStarted && !isDone ? "bg-red-400 animate-pulse" : "bg-zinc-600"
                      }`}
                    />
                    {formatTime(Math.max(timeLimit - seconds, 0))}
                    <button
                      type="button"
                      disabled={isDone}
                      onClick={() => setTimeLimit((t) => t + 60)}
                      className="border border-zinc-700 px-1.5 py-0.5 text-[10px] tracking-wide text-zinc-400 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +1m
                    </button>
                    <button
                      type="button"
                      disabled={isDone}
                      onClick={() => setTimeLimit((t) => t + 300)}
                      className="border border-zinc-700 px-1.5 py-0.5 text-[10px] tracking-wide text-zinc-400 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      +5m
                    </button>
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
                  {isAiTyping && <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />}
                </div>

                <textarea
                  readOnly
                  value={aiResponseText}
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
                  processArgument(argument, userId, roomId)
                }}
                className="border border-zinc-700 px-10 py-2.5 text-sm tracking-wide text-zinc-300 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isDone ? "✓ Done" : "> Done <"}
              </button>
            </div>
            </div>

            {(userTranscript.length > 0 || aiTranscript.length > 0) && (
              <div className="mt-6 grid grid-cols-2 gap-6">
                <div className="border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
                  <p className="mb-3 text-xs tracking-widest text-zinc-500">
                    [YOUR TRANSCRIPT] ({userTranscript.length})
                  </p>
                  <div className="max-h-48 space-y-2 overflow-y-auto text-xs leading-relaxed text-zinc-400">
                    {userTranscript.map((entry, i) => (
                      <p key={i} className="border-b border-zinc-800 pb-2 last:border-b-0 last:pb-0">
                        {transcriptText(entry)}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
                  <p className="mb-3 text-xs tracking-widest text-zinc-500">
                    [AI TRANSCRIPT] ({aiTranscript.length})
                  </p>
                  <div className="max-h-48 space-y-2 overflow-y-auto text-xs leading-relaxed text-zinc-400">
                    {aiTranscript.map((entry, i) => (
                      <p key={i} className="border-b border-zinc-800 pb-2 last:border-b-0 last:pb-0">
                        {transcriptText(entry)}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            )}
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

            <p className="mb-3 text-xs tracking-widest text-zinc-500">[ROOMS] ({rooms.length} active)</p>
            <div className="grid grid-cols-3 gap-4">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  onClick={() => {
                    setArgument("");
                    setIsSpeaking(false);
                    setIsDone(false);
                    setHasStarted(false);
                    setSeconds(0);
                    setTimeLimit(180);
                    setRoomId(room.id);
                  }}
                  className="group relative cursor-pointer border border-zinc-700 bg-zinc-950/70 p-4 text-left backdrop-blur-sm transition-colors hover:border-red-500/50 hover:bg-zinc-900"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteRoom(room.id, userId);
                    }}
                    className="absolute top-2 right-2 border border-zinc-700 px-1.5 py-0.5 text-[10px] tracking-wide text-zinc-500 opacity-0 transition-colors group-hover:opacity-100 hover:border-red-500/50 hover:text-red-400"
                  >
                    ✕
                  </button>
                  <p className="mb-2 pr-6 text-xs tracking-widest text-red-400">[{room.title.toUpperCase()}]</p>
                  <p className="text-xs leading-relaxed text-zinc-500">Topic: {room.topic}</p>
                  <span className="mt-2 inline-block text-xs text-red-400 opacity-0 transition-opacity group-hover:opacity-100">
                    Enter &rarr;
                  </span>
                </div>
              ))}
              {rooms.length === 0 && (
                <p className="text-xs text-zinc-600">No rooms yet. Create one to get started.</p>
              )}
            </div>
          </>
        )}
      </main>

      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div data-tour="debate-create-room" className="w-full max-w-sm border border-zinc-700 bg-zinc-950/95 p-5 font-mono backdrop-blur-sm">
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
                  setTimeLimit(180);
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
    if(!userId) return
    const token = await getToken()
    const result = await axios.post(`http://localhost:5000/create-room/${userId}`, {title: title, topic: topic}, {headers: {Authorization: `Bearer ${token}`}})
    const newRoom: roomType = { id: result.data, user_id: userId ?? "", title, topic }
    setRooms((prev) => [...prev, newRoom])
    setRoomId(newRoom.id)
  }

  async function deleteRoom(roomId: string, userId: string | undefined | null){
    if(!userId) return
    const token = await getToken()
    await axios.delete(`http://localhost:5000/rooms/${userId}/${roomId}`, {headers: {Authorization: `Bearer ${token}`}})
    setRooms((prev) => prev.filter((r) => r.id !== roomId))
  }

  async function processArgument(argument: string, userId: string | undefined | null, roomId: string){
    if(!userId) return
    try {
      const token = await getToken()
      const result = await axios.post(`http://localhost:5000/process-argument/${userId}/${roomId}`, {argument: argument}, {headers: {Authorization: `Bearer ${token}`}})
      const responseText: string = result.data?.response ?? ""
      typeOutResponse(responseText, argument)
    } catch (err) {
      console.error(err)
      typeOutResponse("⚠ Failed to get a response. Try again.", argument)
    }
  }
}

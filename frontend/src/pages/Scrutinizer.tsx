import { useEffect, useMemo, useRef, useState } from "react";
import { LeftSidebar } from "../components/LeftSidebar";
import backgroundImage from "../assets/Scrutinize_Background.jpg";
import { useAuth } from "@clerk/react";
import axios from "axios";
import { useTourPrefill } from "../tour/useTourPrefill";
import { useTourReady } from "../tour/useTourReady";
import { DEMO_SCRUTINIZE_TEXT } from "../tour/steps";


interface ScrutinizeType {
  id: string;
  user_id: string;
  content: string;
  document_name: string | null;
  page_number: string | null;
  premise: string;
  logic: {
    step: number;
    claim: string;
    relation: {
      type: "CAUSE" | "EVIDENCE" | "INFERENCE" | "CONTRADICTION" | "SUB-CLAIM";
      targetStep: number | null;
    };
    flagType: "UNPROV." | "ABSOL." | "WEAK." | null;
  }[];
  flags: {
    type: "UNPROV." | "ABSOL." | "WEAK.";
    instance: string;
    critique: string;
  }[];
  flag_count: number;
  created_at: string;
}

const flagColorClass: Record<string, string> = {
  "UNPROV.": "text-sky-400",
  "ABSOL.": "text-amber-400",
  "WEAK.": "text-red-400",
};

export function Scrutinizer() {
  const [inputMode, setInputMode] = useState<"text" | "file">("text");
  const [file, setFile] = useState<File | null>(null);
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  const {userId, getToken} = useAuth()
  const [text, setText] = useState("")
  const [scrutinizeLogs, setScrutinizeLogs] = useState<ScrutinizeType[]>([])
  const [selectedLog, setSelectedLog] = useState<ScrutinizeType | null>(null)
  useTourPrefill("scrutinize-intro", !text, () => setText(DEMO_SCRUTINIZE_TEXT));
  useTourReady("scrutinize-intro", Boolean(selectedLog && selectedLog.content === DEMO_SCRUTINIZE_TEXT));
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    if (!userId) return;
    const fetchScrutinizeLogs = async() => {
      const result = await axios.get<ScrutinizeType[]>(`http://localhost:5000/logs/scrutinize/${userId}`)
      setScrutinizeLogs(result.data)
    }
    fetchScrutinizeLogs()
  }, [userId])

  const selectLog = (log: ScrutinizeType) => {
    if (selectedLog?.id === log.id) {
      setSelectedLog(null);
      setText("");
      return;
    }
    setSelectedLog(log);
    setInputMode("text");
    setText(log.content);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) setFile(selected);
  };

  const handleClearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
        <header className="mb-6">
          <h1 className="text-lg font-semibold tracking-wide text-zinc-100">
            Text <span className="text-sky-400">Scrutinizer</span>
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Extracts the premise, maps the logical chains, and flags unproven leaps, weak evidence, and absolute claims.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
          <div data-tour="scrutinize-input" className="border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs tracking-widest text-zinc-500">
                [{inputMode === "text" ? "TEXT" : "FILE"} INPUT AREA]
              </p>
              <div className="flex gap-3 text-xs tracking-wide">
                <button
                  type="button"
                  onClick={() => setInputMode("text")}
                  className={inputMode === "text" ? "text-sky-400" : "text-zinc-600 hover:text-zinc-400"}
                >
                  [TEXT]
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode("file")}
                  className={inputMode === "file" ? "text-sky-400" : "text-zinc-600 hover:text-zinc-400"}
                >
                  [FILE]
                </button>
              </div>
            </div>

            {inputMode === "text" ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste the text you want scrutinized..."
                className="h-40 w-full resize-none border border-zinc-800 bg-black/60 p-3 text-sm text-zinc-300 outline-none focus:border-sky-500/50"
              />
            ) : (
              <div className="space-y-3">
                <label className="flex h-40 w-full cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-zinc-700 bg-black/60 px-3 text-center text-xs text-zinc-500 transition-colors hover:border-sky-500/50 hover:text-sky-400">
                  <span>{file ? "Click to replace file" : "Click to browse or drop a PDF"}</span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>

                {file && (
                  <div className="flex items-center justify-between gap-3 text-xs text-zinc-400">
                    <p className="truncate">
                      <span className="text-zinc-500">[FILE]:</span> {file.name}{" "}
                      <span className="text-zinc-600">({(file.size / 1024).toFixed(1)} KB)</span>
                    </p>
                    <button
                      type="button"
                      onClick={handleClearFile}
                      className="shrink-0 text-red-400 transition-colors hover:text-red-300"
                    >
                      [REMOVE]
                    </button>
                  </div>
                )}

                {previewUrl && (
                  <iframe title="PDF preview" src={previewUrl} className="h-48 w-full border border-zinc-800 bg-black/60" />
                )}
              </div>
            )}

            <button
              onClick={() => {
                if(inputMode === "text") process(text, null, userId) 
                else process(null, file, userId)
                }}
              type="button"
              className="mt-4 w-full border border-zinc-700 py-2.5 text-sm tracking-wide text-zinc-300 transition-colors hover:border-sky-500/50 hover:text-sky-400"
            >
              &gt; Begin Audit &lt;
            </button>
          </div>

          <div className="border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
            <p className="mb-3 text-xs tracking-widest text-zinc-500">
              [HISTORY] ({scrutinizeLogs.length} logged)
            </p>
            <div className="max-h-40 space-y-1 overflow-y-auto">
              {scrutinizeLogs.length === 0 && (
                <p className="text-xs text-zinc-600">No previous audits yet.</p>
              )}
              {scrutinizeLogs.map((log) => (
                <button
                  key={log.id}
                  type="button"
                  onClick={() => selectLog(log)}
                  className={`block w-full truncate border-l-2 px-2 py-1 text-left text-xs transition-colors ${
                    selectedLog?.id === log.id
                      ? "border-sky-400 bg-sky-500/10 text-sky-300"
                      : "border-transparent text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                  }`}
                >
                  {log.document_name ?? (log.content.length > 60 ? `${log.content.slice(0, 60)}…` : log.content)}
                </button>
              ))}
            </div>
          </div>
          </div>

          <div className="flex flex-col gap-6">
            <div data-tour="scrutinize-premise" className="border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
              <p className="mb-3 text-xs tracking-widest text-zinc-500">[ ] PREMISE AUDIT</p>
              <p className="text-sm leading-relaxed text-zinc-300">
                The foundational assertion: "
                {selectedLog ? selectedLog.premise : "We should replace the entire database immediately."}"
              </p>
              <p className="mt-2 text-xs text-zinc-500">[Status: Isolated]</p>
            </div>

            <div data-tour="scrutinize-logic" className="border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
              <p className="mb-3 text-xs tracking-widest text-zinc-500">[X] LOGIC MAP</p>
              {selectedLog ? (
                <div className="space-y-1 text-sm">
                  {selectedLog.logic.map((step, i) => (
                    <div key={step.step}>
                      <p className={step.flagType ? flagColorClass[step.flagType] : "text-zinc-300"}>
                        [{step.step}] {step.flagType ? `(FLAG: ${step.flagType}) ` : ""}
                        {step.claim}
                      </p>
                      {i < selectedLog.logic.length - 1 && (
                        <>
                          <p className="pl-2 text-zinc-600">|</p>
                          <p className="pl-2 text-zinc-600">[{step.relation.type}]</p>
                          <p className="pl-2 text-zinc-600">V</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-1 text-sm">
                  <p className="text-zinc-300">[1] We should replace db.</p>
                  <p className="pl-2 text-zinc-600">|</p>
                  <p className="pl-2 text-zinc-600">[CAUSE]</p>
                  <p className="pl-2 text-zinc-600">V</p>
                  <p className="text-amber-400">[2] (FLAG: ORANGE) The old one WILL crash soon.</p>
                  <p className="pl-2 text-zinc-600">|</p>
                  <p className="pl-2 text-zinc-600">[CAUSE]</p>
                  <p className="pl-2 text-zinc-600">V</p>
                  <p className="text-amber-400">[3] (FLAG: ORANGE) This is ALWAYS a good decision.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div data-tour="scrutinize-flags" className="mt-6 border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-y-2">
            <p className="text-xs tracking-widest text-zinc-500">
              [!] CRITICAL FLAGS ({selectedLog ? selectedLog.flag_count : 4} Identified)
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span className="text-sky-400">UNPROV.</span> Unproven Statements
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span className="text-amber-400">ABSOL.</span> Absolute Statements
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                <span className="text-red-400">WEAK.</span> Weak Reasoning
              </span>
            </div>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="text-xs tracking-widest text-zinc-500">
              <tr className="border-b border-zinc-800">
                <th className="py-2 pr-4 font-normal">TYPE</th>
                <th className="py-2 pr-4 font-normal">INSTANCE</th>
                <th className="py-2 font-normal">CRITIQUE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {selectedLog ? (
                selectedLog.flags.map((flag, i) => (
                  <tr key={i}>
                    <td className={`py-2 pr-4 align-top ${flagColorClass[flag.type]}`}>{flag.type}</td>
                    <td className="py-2 pr-4 align-top text-zinc-300">"{flag.instance}"</td>
                    <td className="py-2 align-top text-zinc-500">{flag.critique}</td>
                  </tr>
                ))
              ) : (
                <>
                  <tr>
                    <td className="py-2 pr-4 align-top text-sky-400">UNPROV.</td>
                    <td className="py-2 pr-4 align-top text-zinc-300">"Old DB will crash soon"</td>
                    <td className="py-2 align-top text-zinc-500">No data provided regarding impending failure.</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 align-top text-amber-400">ABSOL.</td>
                    <td className="py-2 pr-4 align-top text-zinc-300">"Updating ALWAYS leads..."</td>
                    <td className="py-2 align-top text-zinc-500">Universal claim. Ignores context, cost, time.</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 align-top text-amber-400">ABSOL.</td>
                    <td className="py-2 pr-4 align-top text-zinc-300">"ALWAYS a good decision"</td>
                    <td className="py-2 align-top text-zinc-500">Overgeneralization. Fails risk simulation.</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 align-top text-red-400">WEAK.</td>
                    <td className="py-2 pr-4 align-top text-zinc-300">"We should do it now."</td>
                    <td className="py-2 align-top text-zinc-500">Lacks a strong basis in evidence.</td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );


  async function process(text: string | null, file: File | null, userId: string | null | undefined){
    if(!userId) return
    const token = await getToken()
    if(text){
      const result = await axios.post<ScrutinizeType>(`http://localhost:5000/scrutinize/${userId}`, {text: text}, {headers: {Authorization: `Bearer ${token}`}})
      setScrutinizeLogs((prev) => [result.data, ...prev])
      setSelectedLog(result.data)
    } else{
      const formData = new FormData()
      if(file) formData.append('file', file)
      const result = await axios.post<ScrutinizeType>(`http://localhost:5000/scrutinize/${userId}`, formData, {headers: {Authorization: `Bearer ${token}`}})
      setScrutinizeLogs((prev) => [result.data, ...prev])
      setSelectedLog(result.data)
    }
  }
}

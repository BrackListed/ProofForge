import { LeftSidebar } from "../components/LeftSidebar";
import backgroundImage from "../assets/Scrutinize_Background.jpg";

export function Scrutinizer() {
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
          <div className="border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
            <p className="mb-3 text-xs tracking-widest text-zinc-500">[TEXT INPUT AREA]</p>
            <textarea
              readOnly
              defaultValue={
                "We should replace the entire database immediately because the old one will crash soon. It's a proven fact that updating ALWAYS leads to better efficiency, and this is always a good decision, with no downsides."
              }
              className="h-40 w-full resize-none border border-zinc-800 bg-black/60 p-3 text-sm text-zinc-300 outline-none"
            />
            <button
              type="button"
              className="mt-4 w-full border border-zinc-700 py-2.5 text-sm tracking-wide text-zinc-300 transition-colors hover:border-sky-500/50 hover:text-sky-400"
            >
              &gt; Begin Audit &lt;
            </button>
          </div>

          <div className="flex flex-col gap-6">
            <div className="border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
              <p className="mb-3 text-xs tracking-widest text-zinc-500">[ ] PREMISE AUDIT</p>
              <p className="text-sm leading-relaxed text-zinc-300">
                The foundational assertion: "We should replace the entire database immediately."
              </p>
              <p className="mt-2 text-xs text-zinc-500">[Status: Isolated]</p>
            </div>

            <div className="border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
              <p className="mb-3 text-xs tracking-widest text-zinc-500">[X] LOGIC MAP</p>
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
            </div>
          </div>
        </div>

        <div className="mt-6 border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
          <p className="mb-3 text-xs tracking-widest text-zinc-500">[!] CRITICAL FLAGS (4 Identified)</p>
          <table className="w-full text-left text-sm">
            <thead className="text-xs tracking-widest text-zinc-500">
              <tr className="border-b border-zinc-800">
                <th className="py-2 pr-4 font-normal">TYPE</th>
                <th className="py-2 pr-4 font-normal">INSTANCE</th>
                <th className="py-2 font-normal">CRITIQUE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
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
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

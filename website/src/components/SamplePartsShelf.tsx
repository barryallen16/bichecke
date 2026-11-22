import { SAMPLE_PARTS, SamplePart } from "../sampleData";
import { Sparkles, AlertTriangle, CheckCircle2 } from "lucide-react";

interface SamplePartsShelfProps {
  onSelectSample: (sample: SamplePart) => void;
  selectedSampleId: string | null;
}

export function SamplePartsShelf({
  onSelectSample,
  selectedSampleId,
}: SamplePartsShelfProps) {
  return (
    <div className="mt-6 pt-5 border-t border-slate-800/80">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Or test with a pre-loaded verification sample:</span>
        </div>
        <span className="text-[11px] text-slate-500 hidden sm:inline">
          1-click inspection
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {SAMPLE_PARTS.map((sample) => {
          const isSelected = selectedSampleId === sample.id;
          const isFake = sample.expectedStatus === "counterfeit";

          return (
            <button
              key={sample.id}
              onClick={() => onSelectSample(sample)}
              className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? "bg-slate-800 border-emerald-500/60 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/40"
                  : "bg-slate-900/60 hover:bg-slate-800/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <img
                src={sample.thumbnailUrl}
                alt={sample.name}
                className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 object-cover shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-slate-200 truncate">
                    {sample.category}
                  </span>
                  {isFake ? (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                      <AlertTriangle className="w-2.5 h-2.5" /> Fake
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Real
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">
                  {sample.name}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

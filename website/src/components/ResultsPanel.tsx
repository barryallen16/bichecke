import {
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Eye,
  Tag,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Award,
  Wrench,
  MessageSquare,
  Layers,
  Sparkles,
} from "lucide-react";
import { DetectionResult } from "../types";

interface ResultsPanelProps {
  result: DetectionResult;
  isDemoFallback?: boolean;
}

function QualityBadge({ quality }: { quality: string }) {
  if (quality === "HIGH") {
    return (
      <div className="flex items-center gap-3.5 p-4 sm:p-5 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl shadow-sm">
        <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl shrink-0">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-emerald-400">Likely Authentic</p>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
              Verified
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300/80 mt-0.5">
            Physical manufacturing indicators match factory genuine specifications.
          </p>
        </div>
      </div>
    );
  }

  if (quality === "LOW") {
    return (
      <div className="flex items-center gap-3.5 p-4 sm:p-5 bg-rose-500/10 border border-rose-500/30 rounded-2xl shadow-sm">
        <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl shrink-0">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-lg font-bold text-rose-400">Potential Counterfeit</p>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-500/20 text-rose-300">
              Defects Found
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300/80 mt-0.5">
            Critical manufacturing discrepancies or finishing flaws detected.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3.5 p-4 sm:p-5 bg-amber-500/10 border border-amber-500/30 rounded-2xl shadow-sm">
      <div className="p-2.5 bg-amber-500/20 text-amber-400 rounded-xl shrink-0">
        <ShieldQuestion className="w-7 h-7" />
      </div>
      <div>
        <p className="text-lg font-bold text-amber-400">Inconclusive</p>
        <p className="text-xs sm:text-sm text-slate-300/80 mt-0.5">
          Key inspection features are not visible in the frame.
        </p>
      </div>
    </div>
  );
}

function ConfidenceBar({ confidence }: { confidence: number }) {
  const pct = Math.round(confidence * 100);
  const color =
    pct >= 75
      ? "from-emerald-500 to-teal-400"
      : pct >= 50
      ? "from-amber-500 to-yellow-400"
      : "from-rose-500 to-orange-400";

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-xs">
        <span className="font-medium text-slate-400 uppercase tracking-wider">
          Inspection Confidence Score
        </span>
        <span className="font-mono font-bold text-white text-sm">{pct}%</span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function ResultsPanel({ result, isDemoFallback }: ResultsPanelProps) {
  return (
    <div className="space-y-4">
      {isDemoFallback && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs">
          <Sparkles className="w-4 h-4 shrink-0 text-cyan-400" />
          <span>
            Demonstration inspection loaded from distilled test dataset (LM Studio local server not detected).
          </span>
        </div>
      )}

      {/* Main Verdict Badge */}
      <QualityBadge quality={result.visual_quality} />

      {/* Confidence */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4">
        <ConfidenceBar confidence={result.confidence} />
      </div>

      {/* Primary Spec Grid */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] uppercase tracking-wider mb-1 font-medium">
            <Wrench className="w-3.5 h-3.5 text-cyan-400" />
            <span>Part</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-white capitalize">
            {result.part_type.replace(/_/g, " ").toLowerCase()}
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] uppercase tracking-wider mb-1 font-medium">
            <Eye className="w-3.5 h-3.5 text-teal-400" />
            <span>View Angle</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-white capitalize">
            {result.view_type.replace(/_/g, " ").toLowerCase()}
          </p>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-3">
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] uppercase tracking-wider mb-1 font-medium">
            <Tag className="w-3.5 h-3.5 text-emerald-400" />
            <span>Brand</span>
          </div>
          <p className="text-xs sm:text-sm font-semibold text-white truncate">
            {result.brand_detected || "Unbranded / Masked"}
          </p>
        </div>
      </div>

      {/* Defects or Positives List */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            {result.visible_defects.length > 0 ? (
              <>
                <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                <span>Identified Defect Indicators</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Verified Quality Indicators</span>
              </>
            )}
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            {result.visible_defects.length > 0
              ? `${result.visible_defects.length} flags`
              : "0 anomalies"}
          </span>
        </div>

        {result.visible_defects.length > 0 ? (
          <ul className="space-y-1.5">
            {result.visible_defects.map((defect, idx) => (
              <li
                key={idx}
                className="flex items-start gap-2 p-2 rounded-lg bg-rose-500/5 border border-rose-500/20 text-xs text-rose-300 leading-snug"
              >
                <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                <span>{defect}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-xs text-emerald-300/90 leading-relaxed flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Component shows no evidence of remanufacturing, thread stripping, or ceramic discoloration.
            </span>
          </div>
        )}
      </div>

      {/* Reasoning Walkthrough */}
      <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
          <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
          <span>VLM Visual Rationale</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
          {result.reasoning}
        </p>
      </div>
    </div>
  );
}

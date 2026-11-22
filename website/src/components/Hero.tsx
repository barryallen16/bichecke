import { ShieldCheck, Cpu, Zap, Lock } from "lucide-react";

export function Hero() {
  return (
    <section className="text-center pt-2 pb-8 sm:pb-12 max-w-3xl mx-auto">
      {/* Pill Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-5 shadow-sm">
        <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Edge VLM Distillation &middot; Qwen3-VL-4B</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4 leading-[1.15]">
        Motorcycle Part Authentication <br className="hidden sm:inline" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
          Directly On-Device
        </span>
      </h1>

      {/* 5-Second Subheadline */}
      <p className="text-base sm:text-lg text-slate-300/90 leading-relaxed max-w-2xl mx-auto mb-8 font-normal">
        Automated warranty inspection for spark plugs, helmets, and air filters.
        Detects counterfeit fabrication and micro-defects with reasoning in under 400ms.
      </p>

      {/* Trust & Proof Chips */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-w-2xl mx-auto text-left">
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <Cpu className="w-4 h-4 text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">4B Small VLM</p>
            <p className="text-[11px] text-slate-400 truncate">Qwen3-VL distilled</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">&lt; 400ms Local</p>
            <p className="text-[11px] text-slate-400 truncate">GGUF quantized</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <Lock className="w-4 h-4 text-teal-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">100% Private</p>
            <p className="text-[11px] text-slate-400 truncate">Runs in LM Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">Zero API Cost</p>
            <p className="text-[11px] text-slate-400 truncate">Free edge inference</p>
          </div>
        </div>
      </div>
    </section>
  );
}

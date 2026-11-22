import { ShieldCheck, Settings, Github, ExternalLink } from "lucide-react";

interface HeaderProps {
  onSettingsClick: () => void;
  apiUrl: string;
}

export function Header({ onSettingsClick, apiUrl }: HeaderProps) {
  return (
    <header className="bg-slate-950/80 border-b border-slate-800/80 sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-2 rounded-xl shadow-md shadow-emerald-500/10">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                Bichecke
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold uppercase tracking-wider">
                Edge VLM
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              On-Device Counterfeit Detection &amp; Warranty Verification
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Hugging Face Model Link */}
          <a
            href="https://huggingface.co/sarav7s/qwen3vl-4b-bichecke-gguf"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <span>Model GGUF</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          {/* GitHub Star Button */}
          <a
            href="https://github.com/barryallen16/bichecke"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/80 transition-all shadow-sm"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Star on GitHub</span>
          </a>

          {/* Settings Trigger */}
          <button
            onClick={onSettingsClick}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700/60 transition-all cursor-pointer"
            title={`Settings (Target: ${apiUrl})`}
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

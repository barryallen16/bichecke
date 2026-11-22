import { useState } from "react";
import { Scan, RotateCcw, Loader2, AlertCircle } from "lucide-react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { SettingsModal } from "./components/SettingsModal";
import { UploadZone } from "./components/UploadZone";
import { SamplePartsShelf } from "./components/SamplePartsShelf";
import { ResultsPanel } from "./components/ResultsPanel";
import { useImageUpload } from "./hooks/useImageUpload";
import { useAnalysis } from "./hooks/useAnalysis";
import { DEFAULT_API_URL } from "./constants";
import { SamplePart } from "./sampleData";

export function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [apiUrl, setApiUrl] = useState(DEFAULT_API_URL);
  const [modelName, setModelName] = useState("");
  const [activeSample, setActiveSample] = useState<SamplePart | null>(null);

  const { imageData, fileName, handleDrop, handleFileInput, clearImage, setImageData, setFileName } =
    useImageUpload();
  const { status, result, error, isDemoFallback, analyze, reset } = useAnalysis();

  const handleSelectSample = (sample: SamplePart) => {
    setActiveSample(sample);
    setImageData(sample.thumbnailUrl);
    setFileName(sample.fileName);
    reset();
  };

  const handleAnalyze = () => {
    if (!imageData) return;
    analyze(imageData, apiUrl, modelName, activeSample);
  };

  const handleReset = () => {
    clearImage();
    setActiveSample(null);
    reset();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-emerald-500/30 selection:text-emerald-200">
      <Header onSettingsClick={() => setSettingsOpen(true)} apiUrl={apiUrl} />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiUrl={apiUrl}
        onApiUrlChange={setApiUrl}
        modelName={modelName}
        onModelNameChange={setModelName}
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Above-the-fold Clarity Hero */}
        <Hero />

        {/* Primary Interactive Card */}
        <div className="bg-slate-900/40 border border-slate-800/90 rounded-3xl p-5 sm:p-8 backdrop-blur-sm shadow-2xl">
          {/* Upload Zone */}
          <UploadZone
            imageData={imageData}
            fileName={fileName}
            onDrop={(e) => {
              setActiveSample(null);
              handleDrop(e);
            }}
            onFileInput={(e) => {
              setActiveSample(null);
              handleFileInput(e);
            }}
            onClear={handleReset}
          />

          {/* Quick-test Sample Selector */}
          {!result && status !== "analyzing" && (
            <SamplePartsShelf
              onSelectSample={handleSelectSample}
              selectedSampleId={activeSample?.id || null}
            />
          )}

          {/* Main Action Trigger */}
          {imageData && status !== "done" && (
            <div className="flex flex-col sm:flex-row gap-3 mt-6">
              <button
                onClick={handleAnalyze}
                disabled={status === "analyzing"}
                className="flex-1 flex items-center justify-center gap-2.5 py-3 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 text-white font-semibold rounded-xl shadow-lg shadow-emerald-500/20 disabled:shadow-none transition-all cursor-pointer text-sm"
              >
                {status === "analyzing" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Running On-Device Inspection...</span>
                  </>
                ) : (
                  <>
                    <Scan className="w-4 h-4" />
                    <span>Run Part Verification</span>
                  </>
                )}
              </button>

              <button
                onClick={handleReset}
                disabled={status === "analyzing"}
                className="flex items-center justify-center gap-2 py-3 px-5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 font-medium rounded-xl border border-slate-700 transition-colors text-sm cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          )}

          {/* Error Message */}
          {status === "error" && (
            <div className="mt-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-rose-400 mb-0.5">
                    Inspection Call Failed
                  </p>
                  <p className="text-xs text-rose-300/90 leading-relaxed break-words">{error}</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={handleAnalyze}
                      className="px-3 py-1.5 text-xs font-medium bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 rounded-lg transition-colors cursor-pointer"
                    >
                      Retry Call
                    </button>
                    <button
                      onClick={handleReset}
                      className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Results Output */}
          {status === "done" && result && (
            <div className="mt-6 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <span>Inspection Results</span>
                </h2>
                <button
                  onClick={handleReset}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>New Inspection</span>
                </button>
              </div>
              <ResultsPanel result={result} isDemoFallback={isDemoFallback} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

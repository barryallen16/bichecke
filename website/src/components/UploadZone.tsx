import { useState, useRef } from "react";
import { Upload, ImagePlus, Clipboard, X, CheckCircle2 } from "lucide-react";

interface UploadZoneProps {
  imageData: string | null;
  fileName: string;
  onDrop: (e: React.DragEvent) => void;
  onFileInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
}

export function UploadZone({
  imageData,
  fileName,
  onDrop,
  onFileInput,
  onClear,
}: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    setIsDragging(false);
    onDrop(e);
  };

  if (imageData) {
    return (
      <div className="relative group rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/70 shadow-xl">
        <div className="relative flex items-center justify-center p-4 bg-slate-950/70 min-h-[260px] max-h-[380px]">
          <img
            src={imageData}
            alt="Uploaded part for inspection"
            className="max-h-[340px] max-w-full object-contain rounded-lg"
          />
          <button
            onClick={onClear}
            className="absolute top-3 right-3 p-2 rounded-xl bg-slate-900/90 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700/80 shadow-md transition-all cursor-pointer"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-4 py-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs font-mono text-slate-300 truncate max-w-[240px] sm:max-w-md">
              {fileName}
            </span>
          </div>
          <button
            onClick={onClear}
            className="text-xs font-medium text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            Change image
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          fileInputRef.current?.click();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Upload part image"
      className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 ${
        isDragging
          ? "border-emerald-400 bg-emerald-500/10 scale-[1.01]"
          : "border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/70"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileInput}
        className="hidden"
      />

      <div className="flex flex-col items-center gap-3">
        <div
          className={`p-3.5 rounded-2xl transition-all duration-200 ${
            isDragging ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800/80 text-slate-400"
          }`}
        >
          {isDragging ? (
            <ImagePlus className="w-8 h-8" />
          ) : (
            <Upload className="w-8 h-8" />
          )}
        </div>

        <div>
          <p className="text-sm sm:text-base font-semibold text-slate-200">
            {isDragging ? "Drop your part image here" : "Upload part photo for inspection"}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            Drag &amp; drop, browse from disk, or paste from clipboard (Ctrl+V)
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2 mt-1">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400">
            <Upload className="w-3 h-3" /> Drag &amp; Drop
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400">
            <ImagePlus className="w-3 h-3" /> File Browser
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-400">
            <Clipboard className="w-3 h-3" /> Clipboard
          </span>
        </div>

        <p className="text-[11px] text-slate-500 mt-1">
          JPEG, PNG, WEBP &middot; Best results with close-up lighting
        </p>
      </div>
    </div>
  );
}

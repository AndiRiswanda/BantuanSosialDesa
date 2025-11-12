import React, { useRef, useState } from "react";
import { X, Upload, FileText } from "lucide-react";

/**
 * UploadProofModal
 * Props:
 * - onClose: () => void
 * - onSave: (file: File | null) => void
 */
export default function UploadProofModal({ onClose, onSave }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);

  const handleChoose = () => inputRef.current?.click();
  const handleChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
    const f = e.dataTransfer?.files?.[0];
    if (f) setFile(f);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-[92%] max-w-lg rounded-2xl bg-white p-5 md:p-6 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#0B2B5E]">
            <Upload className="w-4 h-4" /> Upload Bukti Transfer
          </div>
          <button
            aria-label="Tutup"
            onClick={onClose}
            className="rounded-full p-1 text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drop zone */}
        <div
          role="button"
          tabIndex={0}
          onClick={handleChoose}
          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleChoose()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`mt-4 rounded-xl border-2 border-dashed ${
            dragOver ? "border-green-500 bg-green-50" : "border-slate-300 bg-[#F9FBFF]"
          } p-8 text-center cursor-pointer transition-colors`}
        >
          <Upload className="w-10 h-10 text-slate-400 mx-auto" />
          {!file ? (
            <>
              <div className="mt-2 text-sm text-slate-700">Klik untuk pilih file</div>
              <div className="text-xs text-slate-500">atau drag&amp;drop file disini</div>
            </>
          ) : (
            <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
              <FileText className="w-4 h-4" /> {file.name}
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={handleChange}
          />
        </div>

        {/* Action */}
        <div className="mt-5 flex justify-end">
          <button
            onClick={() => onSave?.(file || null)}
            disabled={!file}
            className={`rounded-lg px-4 py-2 text-white font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed ${
              file ? "bg-[#43A047] hover:bg-green-700" : "bg-[#43A047]"
            }`}
          >
            Simpan File
          </button>
        </div>
      </div>
    </div>
  );
}

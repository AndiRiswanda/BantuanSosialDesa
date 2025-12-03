import React, { useState, useEffect } from "react";
import { X, FileText, Download, Eye } from "lucide-react";
import { donorAPI } from "../../../utils/api";

/**
 * ViewProofModal
 * Props:
 * - onClose: () => void
 * - programId: string/number - ID program untuk melihat bukti transfer
 * - program: object - Data program
 */
export default function ViewProofModal({ onClose, programId, program }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [proofUrl, setProofUrl] = useState(null);

  useEffect(() => {
    if (program && program.bukti_transfer) {
      // If we already have proof URL from program data
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      setProofUrl(baseUrl + program.bukti_transfer);
      setLoading(false);
    } else if (programId) {
      // Fetch program details to get proof URL
      loadProof();
    }
  }, [programId, program]);

  const loadProof = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await donorAPI.getProgramDetail(programId);
      
      if (response && response.bukti_transfer) {
        const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
        setProofUrl(baseUrl + response.bukti_transfer);
      } else {
        setError('Bukti transfer tidak ditemukan');
      }
    } catch (err) {
      console.error('Load proof error:', err);
      setError('Gagal memuat bukti transfer');
    } finally {
      setLoading(false);
    }
  };

  const isImage = (url) => {
    return url && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url);
  };

  const isPdf = (url) => {
    return url && /\.pdf$/i.test(url);
  };

  const handleDownload = () => {
    if (proofUrl) {
      window.open(proofUrl, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative z-10 w-[95%] max-w-4xl max-h-[90vh] rounded-2xl bg-white shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div className="flex items-center gap-2 text-lg font-semibold text-[#0B2B5E]">
            <Eye className="w-5 h-5" /> Bukti Transfer
          </div>
          <div className="flex items-center gap-2">
            {proofUrl && (
              <button
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 text-emerald-700 px-3 py-2 text-sm font-medium hover:bg-emerald-50"
              >
                <Download className="w-4 h-4" /> Download
              </button>
            )}
            <button
              aria-label="Tutup"
              onClick={onClose}
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 max-h-[70vh] overflow-auto">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <span className="ml-3 text-slate-600">Memuat bukti transfer...</span>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <div className="text-slate-600">{error}</div>
            </div>
          )}

          {!loading && !error && proofUrl && (
            <div className="text-center">
              {isImage(proofUrl) && (
                <img 
                  src={proofUrl} 
                  alt="Bukti Transfer" 
                  className="max-w-full max-h-[60vh] object-contain mx-auto rounded-lg shadow-sm"
                  onError={() => setError('Gagal memuat gambar')}
                />
              )}
              
              {isPdf(proofUrl) && (
                <div className="w-full h-[60vh]">
                  <iframe
                    src={proofUrl}
                    className="w-full h-full border border-slate-300 rounded-lg"
                    title="Bukti Transfer PDF"
                  >
                    <div className="text-center py-8">
                      <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                      <div className="text-slate-600 mb-3">Browser tidak mendukung preview PDF</div>
                      <button
                        onClick={handleDownload}
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                      >
                        <Download className="w-4 h-4" /> Download PDF
                      </button>
                    </div>
                  </iframe>
                </div>
              )}

              {!isImage(proofUrl) && !isPdf(proofUrl) && (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                  <div className="text-slate-600 mb-3">File bukti transfer</div>
                  <button
                    onClick={handleDownload}
                    className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                  >
                    <Download className="w-4 h-4" /> Download File
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
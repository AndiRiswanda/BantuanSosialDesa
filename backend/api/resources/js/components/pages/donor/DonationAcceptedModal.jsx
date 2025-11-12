import React from "react";
import {
  CheckCircle2,
  X,
  Landmark,
  Phone,
  Mail,
  MapPin,
  Banknote,
} from "lucide-react";

/**
 * DonationAcceptedModal
 * Props:
 * - type: 'UANG' | 'BARANG'
 * - onClose: () => void
 * - onBackToHistory: () => void
 */
export default function DonationAcceptedModal({ type = "UANG", onClose, onBackToHistory }) {
  const isMoney = type === "UANG";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 w-[92%] max-w-xl rounded-2xl bg-[#E8F1FF] p-5 md:p-6 shadow-xl ring-1 ring-slate-200">
        {/* Close button */}
        <button
          aria-label="Tutup"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-full p-1 text-slate-600 hover:bg-white/70"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title banner */}
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <span className="inline-flex items-center justify-center rounded bg-green-100 p-0.5">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </span>
          Pengajuan Donasi Diterima
        </div>

        <div className="mt-3 grid grid-cols-[auto,1fr] gap-4">
          {/* Illustration */}
          <div className="flex items-start justify-center">
            {isMoney ? (
              <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                <Landmark className="w-12 h-12 text-orange-500" />
              </div>
            ) : (
              <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">
                <Landmark className="w-12 h-12 text-amber-600" />
              </div>
            )}
          </div>

          {/* Content */}
          <div>
            <p className="text-[13px] text-slate-700 leading-relaxed">
              Terima kasih atas niat baik Anda!{" "}
              {isMoney
                ? "Silakan transfer sesuai nominal yang Anda isi ke rekening berikut ini:"
                : "Untuk penyerahan barang bantuan, silakan hubungi admin kami untuk koordinasi penyaluran:"}
            </p>

            {isMoney ? (
              <div className="mt-3 space-y-1 text-[13px]">
                <div className="font-semibold text-slate-800">Bank Desa Sejahtera</div>
                <div>
                  No. Rekening:
                  <span className="font-extrabold text-slate-900"> 123-456-789-0</span>
                </div>
                <div>a.n. Sistem Bantuan Sosial Desa</div>
              </div>
            ) : (
              <div className="mt-3 grid gap-1 text-[13px]">
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-700" />
                  <span>
                    Admin Desa: <span className="font-semibold">0812-xxxx-xxxx</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-700" />
                  <span>
                    Email: <span className="font-semibold">desaku@gmail.com</span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-700" />
                  <span>
                    Alamat Posko: <span className="font-semibold">Balai Desa</span>
                  </span>
                </div>
              </div>
            )}

            <p className="mt-3 text-[12px] text-slate-600">
              {isMoney
                ? "Setelah transfer, upload bukti transfer Anda di halaman ‘Programku’."
                : "Setelah barang diserahkan, admin akan memverifikasi donasi Anda."}
            </p>

            <div className="mt-5 flex justify-center">
              <button
                onClick={onBackToHistory}
                className="inline-flex items-center rounded-lg bg-[#43A047] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-green-700"
              >
                Kembali ke Riwayat Donasi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

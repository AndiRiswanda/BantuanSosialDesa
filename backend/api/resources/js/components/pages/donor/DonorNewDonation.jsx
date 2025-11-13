import React, { useState } from "react";
import NavbarDonor from "../../layout/NavbarDonor";
import {
  FileText,
  Type,
  Layers,
  CalendarDays,
  Gift,
  Coins,
  Users,
  Info,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import DonationAcceptedModal from "./DonationAcceptedModal";

const labelClass = "text-[#0B2B5E] font-semibold flex items-center gap-2";
const hintClass = "text-[11px] text-slate-500 mt-1";
const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500";

export default function DonorNewDonation() {
  const [category, setCategory] = useState("");
  const [donationType, setDonationType] = useState("UANG"); // UANG | BARANG
  const [showAccepted, setShowAccepted] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      <NavbarDonor />

      {/* Header */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-xl md:text-2xl font-extrabold text-center text-[#0B2B5E]">
          Formulir Pengajuan Donasi
        </h1>
        <p className="text-sm text-slate-600 text-center mt-2 max-w-2xl mx-auto">
          Isi data berikut untuk mengajukan donasi dan membantu program bantuan yang Anda pilih.
        </p>
      </div>

      {/* Form Card */}
      <div className="max-w-5xl mx-auto px-4 pb-12">
        <div className="rounded-2xl border border-green-200 bg-white shadow-sm p-5 md:p-7">
          <form className="space-y-6">
            {/* Nama Program */}
            <div>
              <label className={labelClass} htmlFor="programName">
                <Type className="w-4 h-4" /> Nama Program
              </label>
              <p className={hintClass}>(Ket: Masukkan nama lengkap program yang akan dijalankan.)</p>
              <input
                id="programName"
                className={`${inputClass} mt-2`}
                placeholder="contoh: Bantuan Pangan untuk Keluarga Prasejahtera"
                type="text"
              />
            </div>

            {/* Deskripsi Program */}
            <div>
              <label className={labelClass} htmlFor="description">
                <FileText className="w-4 h-4" /> Deskripsi Program
              </label>
              <p className={hintClass}>
                (Ket: Jelaskan tujuan dan manfaat dari program ini secara singkat agar penerima memahami arah bantunya.)
              </p>
              <textarea
                id="description"
                className={`${inputClass} mt-2 min-h-[90px]`}
                placeholder="contoh: Program ini bertujuan untuk membantu masyarakat prasejahtera melalui penyaluran bahan pangan pokok secara berkala."
              />
            </div>

            {/* Kategori Bantuan */}
            <div>
              <label className={labelClass} htmlFor="category">
                <Layers className="w-4 h-4" /> Kategori Bantuan
              </label>
              <p className={hintClass}>(Ket: Pilih kategori utama yang menggambarkan jenis bantuan ini.))</p>
              <select
                id="category"
                className={`${inputClass} mt-2`}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>
                  Pilih kategori
                </option>
                <option>Pangan & Sembako</option>
                <option>Perumahan & Infrastruktur</option>
                <option>Air Bersih & Sanitasi</option>
                <option>Pendidikan & Sosial</option>
                <option>Kesehatan & Gizi</option>
              </select>
            </div>

            {/* Pelaksanaan Program (Tanggal) */}
            <div>
              <label className={labelClass}>
                <CalendarDays className="w-4 h-4" /> Pelaksanaan Program
              </label>
              <p className={hintClass}>
                (Ket: Tentukan tanggal mulai dan berakhirnya pelaksanaan program bantuan ini.)
              </p>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="relative">
                  <span className="text-xs text-slate-600 mb-1 block">Tanggal Dimulai</span>
                  <input type="date" className={inputClass} />
                  <CalendarDays className="w-4 h-4 text-slate-400 absolute right-3 top-9" />
                </div>
                <div className="relative">
                  <span className="text-xs text-slate-600 mb-1 block">Tanggal Selesai</span>
                  <input type="date" className={inputClass} />
                  <CalendarDays className="w-4 h-4 text-slate-400 absolute right-3 top-9" />
                </div>
              </div>
            </div>

            {/* Jenis Donasi yang Diterima */}
            <div>
              <label className={labelClass}>
                <Gift className="w-4 h-4" /> Jenis Donasi yang Diterima
              </label>
              <p className={hintClass}>(Ket: Pilih jenis donasi yang diterima dalam program ini.)</p>
              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDonationType("UANG")}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold shadow-sm transition-colors ${
                    donationType === "UANG"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Coins className="w-4 h-4" /> Uang
                </button>
                <button
                  type="button"
                  onClick={() => setDonationType("BARANG")}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold shadow-sm transition-colors ${
                    donationType === "BARANG"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Gift className="w-4 h-4" /> Barang
                </button>
              </div>
            </div>

            {/* Jumlah Donasi */}
            <div>
              <label className={labelClass} htmlFor="amount">
                <Coins className="w-4 h-4" /> Jumlah Donasi
              </label>
              <p className={hintClass}>
                (Ket: Masukkan jumlah target donasi yang dibutuhkan untuk menjalankan program (berikan juga nominalnya seperti contoh).)
              </p>
              <input
                id="amount"
                className={`${inputClass} mt-2`}
                placeholder="contoh: Rp. 10.000.000,- (sepuluh juta rupiah) atau 100 (seratus) paket sembako"
                type="text"
              />
            </div>

            {/* Kriteria Penerima Donasi */}
            <div>
              <label className={labelClass} htmlFor="criteria">
                <Users className="w-4 h-4" /> Kriteria Penerima Donasi
              </label>
              <p className={hintClass}>
                (Ket: Tentukan kriteria calon penerima bantuan, jika program ini memiliki syarat khusus.)
              </p>
              <textarea
                id="criteria"
                className={`${inputClass} mt-2 min-h-[80px]`}
                placeholder="contoh: 'Penghasilan di bawah Rp 1.000.000 per bulan' atau 'Kepala keluarga tunggal' atau 'Lansia tanpa tanggungan'"
              />
            </div>

            {/* Keterangan Penerima Donasi */}
            <div>
              <label className={labelClass} htmlFor="notes">
                <Info className="w-4 h-4" /> Keterangan Penerima Donasi
              </label>
              <p className={hintClass}>
                (Ket: Tambahkan informasi tambahan tentang kelompok penerima bantuan atau target banyaknya keluarga yang akan dibantu.)
              </p>
              <textarea
                id="notes"
                className={`${inputClass} mt-2 min-h-[80px]`}
                placeholder="contoh: 'Program ini ditujukan bagi 100 keluarga yang terdampak banjir tahunan.'"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAccepted(true)}
                className="w-full md:w-auto md:min-w-[220px] rounded-lg bg-green-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-green-700"
              >
                Ajukan Donasi
              </button>
            </div>
          </form>
        </div>
      </div>

      {showAccepted && (
        <DonationAcceptedModal
          type={donationType}
          onClose={() => setShowAccepted(false)}
          onBackToHistory={() => navigate("/donor/programku")}
        />
      )}
    </div>
  );
}

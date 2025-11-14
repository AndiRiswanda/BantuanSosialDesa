import React, { useState, useEffect } from "react";
import NavbarDonatur from "../../layout/NavbarDonatur";
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
import api from "../../../services/api";

const labelClass = "text-[#0B2B5E] font-semibold flex items-center gap-2";
const hintClass = "text-[11px] text-slate-500 mt-1";
const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500";

export default function DonorNewDonation() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    nama_program: '',
    deskripsi: '',
    id_kategori: '',
    tanggal_mulai: '',
    tanggal_selesai: '',
    jenis_bantuan: 'uang',
    jumlah_bantuan: '',
    kriteria_penerima: '',
    keterangan_penerima: ''
  });
  const [showAccepted, setShowAccepted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/donatur/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await api.post('/api/donatur/programs', formData);
      setShowAccepted(true);
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        alert('Gagal membuat program: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <NavbarDonatur />

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
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nama Program */}
            <div>
              <label className={labelClass} htmlFor="nama_program">
                <Type className="w-4 h-4" /> Nama Program
              </label>
              <p className={hintClass}>(Ket: Masukkan nama lengkap program yang akan dijalankan.)</p>
              <input
                id="nama_program"
                name="nama_program"
                value={formData.nama_program}
                onChange={handleChange}
                className={`${inputClass} mt-2`}
                placeholder="contoh: Bantuan Pangan untuk Keluarga Prasejahtera"
                type="text"
                required
              />
              {errors.nama_program && (
                <p className="text-xs text-red-600 mt-1">{errors.nama_program[0]}</p>
              )}
            </div>

            {/* Deskripsi Program */}
            <div>
              <label className={labelClass} htmlFor="deskripsi">
                <FileText className="w-4 h-4" /> Deskripsi Program
              </label>
              <p className={hintClass}>
                (Ket: Jelaskan tujuan dan manfaat dari program ini secara singkat agar penerima memahami arah bantunya.)
              </p>
              <textarea
                id="deskripsi"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                className={`${inputClass} mt-2 min-h-[90px]`}
                placeholder="contoh: Program ini bertujuan untuk membantu masyarakat prasejahtera melalui penyaluran bahan pangan pokok secara berkala."
              />
              {errors.deskripsi && (
                <p className="text-xs text-red-600 mt-1">{errors.deskripsi[0]}</p>
              )}
            </div>

            {/* Kategori Bantuan */}
            <div>
              <label className={labelClass} htmlFor="id_kategori">
                <Layers className="w-4 h-4" /> Kategori Bantuan
              </label>
              <p className={hintClass}>(Ket: Pilih kategori utama yang menggambarkan jenis bantuan ini.))</p>
              <select
                id="id_kategori"
                name="id_kategori"
                value={formData.id_kategori}
                onChange={handleChange}
                className={`${inputClass} mt-2`}
                required
              >
                <option value="">Pilih kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id_kategori} value={cat.id_kategori}>
                    {cat.nama_kategori}
                  </option>
                ))}
              </select>
              {errors.id_kategori && (
                <p className="text-xs text-red-600 mt-1">{errors.id_kategori[0]}</p>
              )}
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
                  <input 
                    type="date" 
                    name="tanggal_mulai"
                    value={formData.tanggal_mulai}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  />
                  {errors.tanggal_mulai && (
                    <p className="text-xs text-red-600 mt-1">{errors.tanggal_mulai[0]}</p>
                  )}
                </div>
                <div className="relative">
                  <span className="text-xs text-slate-600 mb-1 block">Tanggal Selesai (Opsional)</span>
                  <input 
                    type="date" 
                    name="tanggal_selesai"
                    value={formData.tanggal_selesai}
                    onChange={handleChange}
                    className={inputClass}
                  />
                  {errors.tanggal_selesai && (
                    <p className="text-xs text-red-600 mt-1">{errors.tanggal_selesai[0]}</p>
                  )}
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
                  onClick={() => setFormData(prev => ({ ...prev, jenis_bantuan: 'uang' }))}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold shadow-sm transition-colors ${
                    formData.jenis_bantuan === "uang"
                      ? "border-green-600 bg-green-50 text-green-700"
                      : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <Coins className="w-4 h-4" /> Uang
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, jenis_bantuan: 'barang' }))}
                  className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold shadow-sm transition-colors ${
                    formData.jenis_bantuan === "barang"
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
              <label className={labelClass} htmlFor="jumlah_bantuan">
                <Coins className="w-4 h-4" /> Jumlah Donasi
              </label>
              <p className={hintClass}>
                (Ket: Masukkan jumlah target donasi yang dibutuhkan untuk menjalankan program dalam angka.)
              </p>
              <input
                id="jumlah_bantuan"
                name="jumlah_bantuan"
                value={formData.jumlah_bantuan}
                onChange={handleChange}
                className={`${inputClass} mt-2`}
                placeholder="contoh: 10000000 (untuk uang) atau 100 (untuk jumlah barang)"
                type="number"
                min="0"
                step="0.01"
                required
              />
              {errors.jumlah_bantuan && (
                <p className="text-xs text-red-600 mt-1">{errors.jumlah_bantuan[0]}</p>
              )}
            </div>

            {/* Kriteria Penerima Donasi */}
            <div>
              <label className={labelClass} htmlFor="kriteria_penerima">
                <Users className="w-4 h-4" /> Kriteria Penerima Donasi
              </label>
              <p className={hintClass}>
                (Ket: Tentukan kriteria calon penerima bantuan, jika program ini memiliki syarat khusus.)
              </p>
              <textarea
                id="kriteria_penerima"
                name="kriteria_penerima"
                value={formData.kriteria_penerima}
                onChange={handleChange}
                className={`${inputClass} mt-2 min-h-20`}
                placeholder="contoh: 'Penghasilan di bawah Rp 1.000.000 per bulan' atau 'Kepala keluarga tunggal' atau 'Lansia tanpa tanggungan'"
              />
            </div>

            {/* Keterangan Penerima Donasi */}
            <div>
              <label className={labelClass} htmlFor="keterangan_penerima">
                <Info className="w-4 h-4" /> Keterangan Penerima Donasi
              </label>
              <p className={hintClass}>
                (Ket: Tambahkan informasi tambahan tentang kelompok penerima bantuan atau target banyaknya keluarga yang akan dibantu.)
              </p>
              <textarea
                id="keterangan_penerima"
                name="keterangan_penerima"
                value={formData.keterangan_penerima}
                onChange={handleChange}
                className={`${inputClass} mt-2 min-h-20`}
                placeholder="contoh: 'Program ini ditujukan bagi 100 keluarga yang terdampak banjir tahunan.'"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto md:min-w-[220px] rounded-lg bg-green-600 px-5 py-2.5 text-white font-semibold shadow hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? 'Memproses...' : 'Ajukan Donasi'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showAccepted && (
        <DonationAcceptedModal
          type={formData.jenis_bantuan}
          onClose={() => setShowAccepted(false)}
          onBackToHistory={() => navigate("/donatur/programku")}
        />
      )}
    </div>
  );
}

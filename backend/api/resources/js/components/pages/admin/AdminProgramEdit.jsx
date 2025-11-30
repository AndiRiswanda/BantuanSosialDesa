import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { ArrowLeft, Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { adminAPI } from "../../../utils/api";

export default function AdminProgramEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [form, setForm] = useState({
    nama_program: "",
    deskripsi: "",
    tanggal_mulai: "",
    tanggal_selesai: "",
    jenis_bantuan: "uang",
    jumlah_bantuan: "",
    kriteria_penerima: "",
    keterangan: "",
    status: "aktif",
    id_kategori: "",
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load program detail and categories in parallel
      const [programResponse, categoriesResponse] = await Promise.all([
        adminAPI.getProgramDetail(id),
        adminAPI.getCategories()
      ]);
      
      if (programResponse.success && programResponse.data) {
        const programData = programResponse.data;
        setProgram(programData);
        
        // Populate form with existing data
        setForm({
          nama_program: programData.nama_program || "",
          deskripsi: programData.deskripsi || "",
          tanggal_mulai: programData.tanggal_mulai || "",
          tanggal_selesai: programData.tanggal_selesai || "",
          jenis_bantuan: programData.jenis_bantuan || "uang",
          jumlah_bantuan: programData.jumlah_bantuan || "",
          kriteria_penerima: programData.kriteria_penerima || "",
          keterangan: programData.keterangan || "",
          status: programData.status || "aktif",
          id_kategori: programData.id_kategori || "",
        });
      }
      
      if (categoriesResponse.success && categoriesResponse.data) {
        setCategories(Array.isArray(categoriesResponse.data) ? categoriesResponse.data : []);
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err.message || "Gagal memuat data program");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      setError(null);
      
      const response = await adminAPI.updateProgram(id, form);
      
      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate(`/admin/programs/${id}`);
        }, 1500);
      }
    } catch (err) {
      console.error("Error updating program:", err);
      setError(err.message || "Gagal menyimpan perubahan");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6EFFA]">
        <NavbarAdmin />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="ml-3 text-slate-600">Memuat data program...</span>
        </div>
      </div>
    );
  }

  if (error && !program) {
    return (
      <div className="min-h-screen bg-[#E6EFFA]">
        <NavbarAdmin />
        <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
          <button 
            onClick={() => navigate(-1)} 
            className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-700 mb-6"
          >
            <ArrowLeft className="w-5 h-5" /> Kembali
          </button>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-red-800 font-semibold">Gagal Memuat Data</div>
              <div className="text-red-700 text-sm">{error}</div>
              <button 
                onClick={loadData}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarAdmin />

      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        <button 
          onClick={() => navigate(-1)} 
          className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-700 mb-6"
        >
          <ArrowLeft className="w-5 h-5" /> Kembali
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block bg-white shadow-md border border-blue-200 px-6 sm:px-8 py-3 rounded-lg">
            <h1 className="text-[#0B2B5E] font-semibold text-lg sm:text-xl">Kelola Program Bantuan</h1>
            <p className="text-xs text-slate-600 mt-1">Edit informasi program bantuan</p>
          </div>
        </div>

        {/* Success Alert */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-green-800 font-semibold">Berhasil!</div>
              <div className="text-green-700 text-sm">Program berhasil diperbarui</div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-red-800 font-semibold">Gagal Menyimpan</div>
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Program */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Program <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.nama_program}
                onChange={handleChange("nama_program")}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            {/* Kategori */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                value={form.id_kategori}
                onChange={handleChange("id_kategori")}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="">Pilih Kategori</option>
                {categories.map(cat => (
                  <option key={cat.id_kategori} value={cat.id_kategori}>
                    {cat.nama_kategori}
                  </option>
                ))}
              </select>
            </div>

            {/* Jenis Bantuan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Jenis Bantuan <span className="text-red-500">*</span>
              </label>
              <select
                value={form.jenis_bantuan}
                onChange={handleChange("jenis_bantuan")}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="uang">Uang</option>
                <option value="barang">Barang</option>
              </select>
            </div>

            {/* Jumlah Bantuan */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Jumlah Bantuan <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={form.jumlah_bantuan}
                onChange={handleChange("jumlah_bantuan")}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
                min="0"
              />
              <p className="text-xs text-slate-500 mt-1">
                {form.jenis_bantuan === "uang" ? "Jumlah dalam Rupiah" : "Jumlah paket barang"}
              </p>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <select
                value={form.status}
                onChange={handleChange("status")}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              >
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Nonaktif</option>
                <option value="selesai">Selesai</option>
              </select>
            </div>

            {/* Tanggal Mulai */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.tanggal_mulai}
                onChange={handleChange("tanggal_mulai")}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            {/* Tanggal Selesai */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tanggal Selesai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.tanggal_selesai}
                onChange={handleChange("tanggal_selesai")}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            {/* Deskripsi */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deskripsi Program <span className="text-red-500">*</span>
              </label>
              <textarea
                value={form.deskripsi}
                onChange={handleChange("deskripsi")}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>

            {/* Kriteria Penerima */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kriteria Penerima
              </label>
              <textarea
                value={form.kriteria_penerima}
                onChange={handleChange("kriteria_penerima")}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            {/* Keterangan */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Keterangan
              </label>
              <textarea
                value={form.keterangan}
                onChange={handleChange("keterangan")}
                rows={3}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-slate-200">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={saving}
              className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

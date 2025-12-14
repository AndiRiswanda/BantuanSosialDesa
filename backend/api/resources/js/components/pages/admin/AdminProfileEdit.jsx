/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { ArrowLeft, CheckCircle2, X, LogOut, Pencil, Loader2, AlertCircle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { adminAPI, removeAuthToken, removeUser } from "../../../utils/api";

export default function AdminProfileEdit() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [form, setForm] = useState({
    full_name: "",
    nomor_telepon: "",
  });
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [confirm, setConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [success, setSuccess] = useState(false);
  const [openLogout, setOpenLogout] = useState(false);
  
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getProfile();
      
      if (response.success && response.data) {
        const data = {
          full_name: response.data.full_name || "",
          nomor_telepon: response.data.nomor_telepon || "",
        };
        setForm(data);
        setOriginalData(response.data);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      setError(err.message || "Gagal memuat data profil");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onConfirm = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const response = await adminAPI.updateProfile(form);
      
      if (response.success) {
        setConfirm(false);
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/admin/profil");
        }, 2000);
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError(err.message || "Gagal menyimpan perubahan");
      setConfirm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    removeUser();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavbarAdmin />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <span className="ml-3 text-slate-600">Memuat data profil...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <NavbarAdmin />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-700">
          <ArrowLeft className="w-5 h-5" /> Profil
        </button>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-4">
          <div className="rounded-xl bg-white p-4 shadow-sm border border-slate-200">
            <div className="space-y-2">
              <button
                onClick={() => navigate("/admin/profil")}
                className={`w-full rounded-md px-3 py-2 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                  pathname === "/admin/profil"
                    ? "bg-emerald-50 border border-emerald-300 text-emerald-700"
                    : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:border-emerald-300"
                }`}
              >
                Data Profil
              </button>
              <button
                onClick={() => navigate("/admin/profil/edit")}
                className={`w-full rounded-md px-3 py-2 text-sm inline-flex items-center justify-center gap-2 ${
                  pathname.startsWith("/admin/profil/edit")
                    ? "bg-emerald-600 text-white border border-emerald-600"
                    : "border border-emerald-300 bg-white text-emerald-700 hover:bg-emerald-50"
                }`}
              >
                <Pencil className="w-4 h-4"/> Edit Data Profil
              </button>
              <button onClick={() => setOpenLogout(true)} className="w-full rounded-md border border-rose-200 bg-white px-3 py-2 text-sm text-rose-700 hover:bg-rose-50 inline-flex items-center justify-center gap-2"><LogOut className="w-4 h-4"/> Keluar</button>
            </div>
          </div>
          <div className="rounded-xl bg-emerald-700 text-white p-4 shadow-sm">
            <div className="text-lg font-semibold">{originalData?.full_name || "Admin"}</div>
            <div className="text-white/90 text-sm">Admin</div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-red-800 font-semibold">Gagal Menyimpan</div>
              <div className="text-red-700 text-sm">{error}</div>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-green-800 font-semibold">Berhasil!</div>
              <div className="text-green-700 text-sm">Perubahan profil berhasil disimpan</div>
            </div>
          </div>
        )}

        <div className="mt-5 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Edit Data Admin</h2>
          <div className="mt-3 grid grid-cols-1 gap-4">
            <div>
              <p className="text-xs text-slate-500">Nama Lengkap</p>
              <input 
                value={form.full_name} 
                onChange={onChange("full_name")} 
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" 
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div>
              <p className="text-xs text-slate-500">Username</p>
              <input 
                value={originalData?.username || ""} 
                disabled
                className="mt-1 w-full rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-500 cursor-not-allowed" 
              />
              <p className="text-xs text-slate-400 mt-1">Username tidak dapat diubah</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">No. Telepon/WhatsApp</p>
              <input 
                value={form.nomor_telepon} 
                onChange={onChange("nomor_telepon")} 
                className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" 
                placeholder="Contoh: 081234567890"
              />
            </div>
          </div>

          <div className="mt-4">
            <button 
              onClick={() => setConfirm(true)} 
              disabled={saving}
              className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>

        {confirm && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-blue/50 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-md rounded-xl bg-[#afcfef] shadow-2xl">
              <div className="flex items-center justify-between border-b border-black px-4 py-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-black"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Simpan Perubahan Data?</div>
                <button onClick={() => setConfirm(false)} className="text-black hover:text-slate-500" aria-label="Tutup"><X className="w-5 h-5"/></button>
              </div>
              <div className="px-4 py-3 text-sm text-black space-y-2">
                <p>Apakah Anda yakin ingin menyimpan perubahan pada data ini?</p>
                <p>Pastikan semua informasi yang diperbarui sudah benar sebelum disimpan.</p>
                <p className="text-black">Mohon periksa kembali agar tidak ada kesalahan input.</p>
              </div>
              <div className="flex justify-end gap-2 border-t border-black px-4 py-3">
                <button 
                  onClick={() => setConfirm(false)} 
                  disabled={saving}
                  className="rounded-md border border-emerald-500 bg-white px-4 py-2 text-sm font-medium text-black hover:bg-slate-200 disabled:opacity-50"
                >
                  Batalkan
                </button>
                <button 
                  onClick={onConfirm} 
                  disabled={saving}
                  className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        )}

        {showSuccess && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-blue/50 p-4">
            <div className="w-full max-w-sm rounded-xl bg-[#afcfef] shadow-2xl p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-7 h-7 text-emerald-600" />
              </div>
              <h3 className="text-black font-semibold mb-2">Data admin berhasil diperbarui</h3>
              <button onClick={() => setShowSuccess(false)} className="mt-4 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold">OK</button>
            </div>
          </div>
        )}

        {/* Logout Confirmation */}
        {openLogout && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-blue/50 p-4">
            <div className="w-full max-w-md rounded-xl bg-[#afcfef] shadow-2xl p-6">
              <h3 className="text-black font-semibold text-lg mb-3 inline-flex items-center gap-2"><LogOut className="w-5 h-5 text-emerald-600"/> Konfirmasi Keluar Akun</h3>
              <p className="text-black text-sm mb-6">
                Apakah Anda yakin ingin keluar dari akun ini? Semua sesi aktif akan ditutup dan Anda harus login kembali untuk mengakses sistem.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setOpenLogout(false)}
                  className="flex-1 px-4 py-2 border border-emerald-500 bg-slate-200 hover:bg-slate-300 text-black rounded-lg text-sm font-semibold"
                >
                  Batal
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

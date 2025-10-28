import React, { useState } from "react";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { ArrowLeft, CheckCircle2, X, LogOut, Pencil } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const initial = {
  name: "Ahmad Wijaya",
  username: "ahmad.wijaya",
  email: "wijaya.desaMurni@donasi.id",
  phone: "081234567890",
};

export default function AdminProfileEdit() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [form, setForm] = useState(initial);
  const [confirm, setConfirm] = useState(false);
  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onConfirm = () => {
    setConfirm(false);
    navigate("/admin/profil");
  };

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
              <button onClick={() => navigate("/login")} className="w-full rounded-md border border-rose-200 bg-white px-3 py-2 text-sm text-rose-700 hover:bg-rose-50 inline-flex items-center justify-center gap-2"><LogOut className="w-4 h-4"/> Keluar</button>
            </div>
          </div>
          <div className="rounded-xl bg-emerald-700 text-white p-4 shadow-sm">
            <div className="text-lg font-semibold">{form.name}</div>
            <div className="text-white/90 text-sm">Admin</div>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Edit Data Admin</h2>
          <div className="mt-3 grid grid-cols-1 gap-4">
            <div>
              <p className="text-xs text-slate-500">Nama Lengkap</p>
              <input value={form.name} onChange={onChange("name")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Username</p>
              <input value={form.username} onChange={onChange("username")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <input value={form.email} onChange={onChange("email")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">No. Telepon/Whatsapp</p>
              <input value={form.phone} onChange={onChange("phone")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div className="mt-4">
            <button onClick={() => setConfirm(true)} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Simpan Perubahan</button>
          </div>
        </div>

        {confirm && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Simpan Perubahan Data?</div>
                <button onClick={() => setConfirm(false)} className="text-slate-500 hover:text-slate-700" aria-label="Tutup"><X className="w-5 h-5"/></button>
              </div>
              <div className="px-4 py-3 text-sm text-slate-700 space-y-2">
                <p>Apakah Anda yakin ingin menyimpan perubahan pada data ini?</p>
                <p className="text-slate-600">Pastikan semua informasi yang diperbarui sudah benar sebelum disimpan. Mohon periksa kembali agar tidak ada kesalahan input.</p>
              </div>
              <div className="flex justify-end gap-2 border-t px-4 py-3">
                <button onClick={() => setConfirm(false)} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Batalkan</button>
                <button onClick={onConfirm} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Simpan Perubahan</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

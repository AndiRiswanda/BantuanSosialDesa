import React, { useState } from "react";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { ArrowLeft, LogOut, Pencil, UserCircle2, X, AlertTriangle } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const mockAdmin = {
  name: "Ahmad Wijaya",
  role: "Admin",
  email: "wijaya.desaMurni@donasi.id",
  phone: "081234567890",
  username: "ahmad.wijaya",
};

export default function AdminProfile() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [openLogout, setOpenLogout] = useState(false);

  const initials = mockAdmin.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <NavbarAdmin />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-700">
          <ArrowLeft className="w-5 h-5" /> Profil
        </button>

        {/* header */}
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
            <div className="flex items-center gap-4">
              <div className="grid h-16 w-16 place-items-center rounded-full bg-white/20 text-xl font-bold">{initials}</div>
              <div>
                <div className="text-lg font-semibold">{mockAdmin.name}</div>
                <div className="text-white/90 text-sm">{mockAdmin.role}</div>
                <div className="text-white/90 text-xs">Email : {mockAdmin.email}</div>
                <div className="text-white/90 text-xs">Telepon : {mockAdmin.phone}</div>
              </div>
            </div>
          </div>
        </div>

        {/* data admin */}
        <div className="mt-5 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Data Admin</h2>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {[
              { label: "Nama Lengkap", value: mockAdmin.name },
              { label: "Username", value: mockAdmin.username },
              { label: "Email", value: mockAdmin.email },
              { label: "No. Telepon/WhatsApp", value: mockAdmin.phone },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs text-slate-500">{f.label}</p>
                <div className="mt-1 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">{f.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* logout confirm */}
        {openLogout && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><UserCircle2 className="w-4 h-4 text-emerald-600"/> Konfirmasi Keluar Akun</div>
                <button onClick={() => setOpenLogout(false)} className="text-slate-500 hover:text-slate-700" aria-label="Tutup"><X className="w-5 h-5"/></button>
              </div>
              <div className="px-4 py-3 text-sm text-slate-700 space-y-3">
                <p>Apakah Anda yakin ingin keluar dari akun ini? Setelah keluar, untuk melanjutkan admin harus login kembali untuk mengakses sistem.</p>
              </div>
              <div className="flex justify-end gap-2 border-t px-4 py-3">
                <button onClick={() => setOpenLogout(false)} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Batal</button>
                <button onClick={() => navigate("/login")} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Keluar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

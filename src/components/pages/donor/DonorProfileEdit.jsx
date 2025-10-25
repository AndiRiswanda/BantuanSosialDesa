import React, { useState } from "react";
import NavbarDonor from "../../layout/NavbarDonor";
import { ArrowLeft, ShieldCheck, User, Pencil, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function SaveConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-[92%] max-w-md rounded-2xl bg-[#E8F1FF] p-5 shadow-xl">
        <div className="text-sm font-semibold text-[#0B2B5E]">Simpan Perubahan Data?</div>
        <p className="mt-2 text-sm text-slate-700">
          Apakah Anda yakin ingin menyimpan perubahan pada data ini? Pastikan semua informasi yang diperbarui sudah benar sebelum disimpan.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Batalkan</button>
          <button onClick={onConfirm} className="rounded-lg bg-[#43A047] px-4 py-2 text-sm font-semibold text-white">Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
}

function LogoutConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-[92%] max-w-md rounded-2xl bg-[#E8F1FF] p-5 shadow-xl">
        <div className="text-sm font-semibold text-[#0B2B5E]">Konfirmasi Keluar Akun</div>
        <p className="mt-2 text-sm text-slate-700">Apakah Anda yakin ingin keluar dari akun ini?</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Batal</button>
          <button onClick={onConfirm} className="rounded-lg bg-[#43A047] px-4 py-2 text-sm font-semibold text-white">Keluar</button>
        </div>
      </div>
    </div>
  );
}

export default function DonorProfileEdit() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const { pathname } = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <NavbarDonor />
      <div className="bg-[#1976d26c]/30">
        <div className="max-w-6xl mx-auto px-3 py-2 text-sm text-[#0B2B5E] flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 hover:text-green-700">
            <ArrowLeft className="w-4 h-4" />
            <span>Profil</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[240px,1fr] gap-4">
        {/* Left actions card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3 space-y-2 h-fit">
          <Link
            to="/donor/profil"
            aria-current={pathname === "/donor/profil" ? "page" : undefined}
            className={`w-full inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
              pathname === "/donor/profil"
                ? "bg-green-600 text-white border-green-600 shadow"
                : "bg-white text-[#0B2B5E] border-green-600 hover:bg-green-50"
            }`}
          >
            <User className="w-4 h-4"/> Data Profil
          </Link>
          <Link
            to="/donor/profil/edit"
            aria-current={pathname === "/donor/profil/edit" ? "page" : undefined}
            className={`w-full inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
              pathname === "/donor/profil/edit"
                ? "bg-green-600 text-white border-green-600 shadow"
                : "bg-white text-[#0B2B5E] border-green-600 hover:bg-green-50"
            }`}
          >
            <Pencil className="w-4 h-4"/> Edit Data Profil
          </Link>
          <button onClick={() => setShowLogout(true)} className="w-full inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"><LogOut className="w-4 h-4"/> Keluar</button>
        </div>

        {/* Right content: summary card + edit form */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-gradient-to-br from-green-500 to-green-600 p-4 text-white shadow">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-lg font-extrabold">YPN</div>
              <div>
                <div className="text-lg font-extrabold">Yayasan Peduli Negeri</div>
                <div className="mt-1 inline-flex items-center gap-1 rounded bg-white/20 px-2 py-0.5 text-xs"><ShieldCheck className="w-3.5 h-3.5"/> Organisasi</div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-200 shadow-sm p-4 md:p-5">
          <div className="font-semibold text-[#0B2B5E] mb-3">Edit Data Donatur</div>
          <form className="grid gap-4">
            {[{label:'Nama Instansi',placeholder:'Yayasan Peduli Negeri'},{label:'Email Instansi',placeholder:'yypnPN@gmail.com'},{label:'Alamat Instansi',placeholder:'Jl. Melati No. 12, RT 01/RW 02, Jakarta Barat, Indonesia'},{label:'No. Telepon/WhatsApp',placeholder:'085334*****46'},{label:'Jenis Donatur',placeholder:'Organisasi'}].map((f) => (
              <div key={f.label}>
                <div className="text-sm text-slate-600 mb-1">{f.label}</div>
                <input className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder={f.placeholder} />
              </div>
            ))}
            <div className="pt-2">
              <button type="button" onClick={() => setShowConfirm(true)} className="rounded-lg bg-[#43A047] px-4 py-2 text-sm font-semibold text-white">Simpan Perubahan</button>
            </div>
          </form>
          </div>
        </div>
      </div>

      {showConfirm && (
        <SaveConfirmModal onClose={() => setShowConfirm(false)} onConfirm={() => { setShowConfirm(false); navigate('/donor/profil'); }} />
      )}
      {showLogout && (
        <LogoutConfirmModal onClose={() => setShowLogout(false)} onConfirm={() => navigate('/login/donatur')} />
      )}
    </div>
  );
}

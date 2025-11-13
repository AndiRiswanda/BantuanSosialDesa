import React, { useState } from "react";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { ArrowLeft, CheckCircle2, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const donorMock = {
  1: {
    id: 1,
    name: "Yayasan Peduli Negeri",
    type: "Organisasi",
    email: "yysPN@mail.com",
    phone: "08513***999",
    address: "Jl. Melati No. 12, RT 01/RW 02, Jakarta Barat, Indonesia",
  },
};

export default function AdminDonorEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const init = donorMock[id] ?? donorMock[1];
  const [form, setForm] = useState(init);
  const [confirm, setConfirm] = useState(false);

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onConfirm = () => {
    setConfirm(false);
    // pretend to save then navigate to detail
    navigate(`/admin/verifikasi/donatur/${init.id}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <NavbarAdmin />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-700">
            <ArrowLeft className="w-5 h-5" /> Edit Profil Donatur
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Informasi</h2>
          <div className="mt-3 grid grid-cols-1 gap-4">
            <div>
              <p className="text-xs text-slate-500">Nama Organisasi/Instansi</p>
              <input value={form.name} onChange={onChange("name")} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Jenis Donatur</p>
              <input value={form.type} onChange={onChange("type")} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Email Donatur</p>
              <input value={form.email} onChange={onChange("email")} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">No. Telepon/WhatsApp</p>
              <input value={form.phone} onChange={onChange("phone")} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Alamat Lengkap</p>
              <input value={form.address} onChange={onChange("address")} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>

          <div className="mt-4">
            <button onClick={() => setConfirm(true)} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Simpan Perubahan Data</button>
          </div>
        </div>

        {confirm && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Simpan Perubahan Data?</div>
                <button onClick={() => setConfirm(false)} className="text-slate-500 hover:text-slate-700"><X className="w-5 h-5"/></button>
              </div>
              <div className="px-4 py-3 text-sm text-slate-700 space-y-2">
                <p>Apakah Anda yakin ingin menyimpan perubahan pada data ini? Pastikan semua informasi yang diperbarui sudah benar sebelum disimpan.</p>
                <p className="text-slate-600">Mohon periksa kembali agar tidak ada kesalahan input.</p>
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

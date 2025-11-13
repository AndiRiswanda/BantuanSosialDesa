import React, { useRef, useState } from "react";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { ArrowLeft, CloudUpload, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const initial = {
  kk: "3601****5678",
  kepalaKeluarga: "Ahmad Yani",
  pekerjaan: "Petani",
  statusAnak: "Anak Sekolah",
  statusPekerjaanIstri: "Ibu Rumah Tangga",
  alamat: "Jl. Melati No. 12, RT 01/RW 02",
  penghasilan: "Rp 1.000.000,-  -  Rp 2.000.000,-",
  telepon: "085555****40",
  tanggungan: 2,
  dokumen: [
    { id: "kk", name: "Foto Kartu Keluarga", file: "KK_AhmadYani_3601****5678.png" },
    { id: "rumah", name: "Foto Rumah", file: "FotoRumah_AhmadYani_3601****5678.pdf" },
  ],
};

export default function AdminRecipientEdit() {
  const navigate = useNavigate();
  useParams();
  const [form, setForm] = useState(initial);
  const fileInputs = useRef({});

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const updateDoc = (id, fileName) => setForm((f) => ({ ...f, dokumen: f.dokumen.map((d) => (d.id === id ? { ...d, file: fileName } : d)) }));

  const onChooseFile = (id) => fileInputs.current[id]?.click();
  const onFile = (id) => (e) => {
    const file = e.target.files?.[0];
    if (file) updateDoc(id, file.name);
  };

  const save = () => {
    // pretend save
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <NavbarAdmin />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-700">
          <ArrowLeft className="w-5 h-5" /> Edit Profil Penerima
        </button>

        {/* Data Keluarga */}
        <section className="mt-4 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Data Keluarga</h2>
          <div className="mt-3 grid grid-cols-1 gap-3">
            <div>
              <p className="text-xs text-slate-500">No. Kartu Keluarga</p>
              <input value={form.kk} onChange={onChange("kk")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Nama Kepala Keluarga</p>
              <input value={form.kepalaKeluarga} onChange={onChange("kepalaKeluarga")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pekerjaan</p>
              <input value={form.pekerjaan} onChange={onChange("pekerjaan")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Status Anak</p>
              <select value={form.statusAnak} onChange={onChange("statusAnak")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
                <option>Anak Sekolah</option>
                <option>Tidak Sekolah</option>
              </select>
            </div>
            <div>
              <p className="text-xs text-slate-500">Status Pekerjaan Istri</p>
              <select value={form.statusPekerjaanIstri} onChange={onChange("statusPekerjaanIstri")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
                <option>Ibu Rumah Tangga</option>
                <option>Bekerja</option>
              </select>
            </div>
          </div>
        </section>

        {/* Informasi Lainnya */}
        <section className="mt-5 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Informasi Lainnya</h2>
          <div className="mt-3 grid grid-cols-1 gap-3">
            <div>
              <p className="text-xs text-slate-500">Alamat Lengkap</p>
              <input value={form.alamat} onChange={onChange("alamat")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Penghasilan</p>
              <select value={form.penghasilan} onChange={onChange("penghasilan")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
                <option>Rp 1.000.000,-  -  Rp 2.000.000,-</option>
                <option>{"< Rp 1.000.000,-"}</option>
                <option>{"> Rp 2.000.000,-"}</option>
              </select>
            </div>
            <div>
              <p className="text-xs text-slate-500">No. Telepon/WhatsApp</p>
              <input value={form.telepon} onChange={onChange("telepon")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Jumlah Tanggungan</p>
              <input type="number" min={0} value={form.tanggungan} onChange={onChange("tanggungan")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </section>

        {/* Dokumen Pendukung */}
        <section className="mt-5 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Dokumen Pendukung</h2>
          <div className="mt-3 space-y-4">
            {form.dokumen.map((d) => (
              <div key={d.id} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="h-32 rounded-lg bg-slate-100 grid place-items-center text-slate-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                </div>
                <div className="mt-3">
                  <div className="text-sm font-medium text-slate-800">{d.name}</div>
                  <div className="text-xs text-slate-600">{d.file}</div>
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <button className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"><Eye className="w-4 h-4"/> Lihat Dokumen</button>
                  <input ref={(el) => (fileInputs.current[d.id] = el)} type="file" className="hidden" onChange={onFile(d.id)} />
                  <button onClick={() => onChooseFile(d.id)} className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"><CloudUpload className="w-4 h-4"/> Unggah Ulang Dokumen</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="my-6 flex justify-center">
          <button onClick={save} className="rounded-md bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">Simpan Perubahan Data</button>
        </div>
      </div>
    </div>
  );
}

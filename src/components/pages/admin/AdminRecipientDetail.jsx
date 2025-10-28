import React from "react";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { ArrowLeft, Download, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const recipientMock = {
  1: {
    id: 1,
    kk: "3601****5678",
    kepalaKeluarga: "Ahmad Yani",
    pekerjaan: "Petani",
    statusAnak: "Anak Sekolah",
    statusPekerjaanIstri: "Ibu Rumah Tangga",
    alamat: "Jl. Melati No. 12, RT 01/RW 02",
    penghasilan: "Rp 1.000.000,-  -  Rp 1.000.000,-",
    telepon: "085555****40",
    tanggungan: 2,
    dokumen: [
      { id: "kk", name: "Foto Kartu Keluarga", file: "KK_AhmadYani_3601****5678.png" },
      { id: "rumah", name: "Foto Rumah", file: "FotoRumah_AhmadYani_3601****5678.pdf" },
    ],
  },
};

export default function AdminRecipientDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const r = recipientMock[id] ?? recipientMock[1];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <NavbarAdmin />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-700">
          <ArrowLeft className="w-5 h-5" /> Detail Profil Penerima
        </button>

        {/* Data Keluarga */}
        <section className="mt-4 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Data Keluarga</h2>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {[
              { label: "No. Kartu Keluarga", value: r.kk },
              { label: "Nama Kepala Keluarga", value: r.kepalaKeluarga },
              { label: "Pekerjaan", value: r.pekerjaan },
              { label: "Status Anak", value: r.statusAnak },
              { label: "Status Pekerjaan Istri", value: r.statusPekerjaanIstri },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs text-slate-500">{f.label}</p>
                <div className="mt-1 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">{f.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Informasi Lainnya */}
        <section className="mt-5 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Informasi Lainnya</h2>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {[
              { label: "Alamat Lengkap", value: r.alamat },
              { label: "Penghasilan", value: r.penghasilan },
              { label: "No. Telepon/WhatsApp", value: r.telepon },
              { label: "Jumlah Tanggungan", value: String(r.tanggungan) },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs text-slate-500">{f.label}</p>
                <div className="mt-1 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">{f.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Dokumen Pendukung */}
        <section className="mt-5 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Dokumen Pendukung</h2>
          <div className="mt-3 space-y-4">
            {r.dokumen.map((d) => (
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
                  <button className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"><Download className="w-4 h-4"/> Unduh Dokumen</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

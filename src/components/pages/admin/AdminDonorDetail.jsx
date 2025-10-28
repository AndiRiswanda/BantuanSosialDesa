import React from "react";
import { ArrowLeft, Calendar, CircleDollarSign } from "lucide-react";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { useNavigate, useParams } from "react-router-dom";

const donorMock = {
  1: {
    id: 1,
    name: "Yayasan Peduli Negeri",
    type: "Organisasi",
    email: "yysPN@mail.com",
    phone: "08513***999",
    address: "Jl. Melati No. 12, RT 01/RW 02, Jakarta Barat, Indonesia",
    stats: { programs: 1, total: 25000000, beneficiaries: 25 },
    programs: [
      {
        id: 101,
        title: "Bantuan Modal Usaha Mikro untuk Ibu Rumah Tangga",
        donor: "Yayasan Peduli Negeri",
        start: "1 Oktober 2025",
        end: "30 Desember 2025",
        amount: 25000000,
        progressPct: 50,
        progressText: "50% (25/50 KK)",
      },
    ],
  },
};

function formatIDR(n) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

export default function AdminDonorDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const donor = donorMock[id] ?? donorMock[1];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <NavbarAdmin />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-700">
          <ArrowLeft className="w-5 h-5" /> Detail Profil Donatur
        </button>

        {/* Informasi */}
        <div className="mt-4 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Informasi Organisasi</h2>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {[
              { label: "Nama Organisasi/Instansi", value: donor.name },
              { label: "Jenis Donatur", value: donor.type },
              { label: "Email Donatur", value: donor.email },
              { label: "No. Telepon/WhatsApp", value: donor.phone },
              { label: "Alamat Lengkap", value: donor.address },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs text-slate-500">{f.label}</p>
                <div className="mt-1 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">{f.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4 text-center shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-emerald-700">{donor.stats.programs}</div>
            <div className="text-sm text-slate-600">Program Bantuan</div>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-emerald-700">{formatIDR(donor.stats.total)}</div>
            <div className="text-sm text-slate-600">Total Donasi</div>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-emerald-700">{donor.stats.beneficiaries}</div>
            <div className="text-sm text-slate-600">Penerima Terbantu</div>
          </div>
        </div>

        {/* Program list */}
        <div className="mt-5 space-y-4">
          {donor.programs.map((p) => (
            <div key={p.id} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{p.title}</h3>
                    <p className="text-xs text-slate-600">Donatur: {p.donor}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                    Uang
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1"><Calendar className="w-3 h-3"/> {p.start}</span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1"><Calendar className="w-3 h-3"/> {p.end}</span>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CircleDollarSign className="w-5 h-5 text-emerald-600"/>
                    <div>
                      <div className="text-slate-700">Jumlah Donasi</div>
                      <div className="text-slate-900 font-semibold">{formatIDR(p.amount)} <span className="text-xs font-normal text-slate-600">(dua puluh lima juta rupiah)</span></div>
                    </div>
                  </div>
                  <button onClick={() => navigate(`/admin/penyaluran`)} className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700">Detail Program</button>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                    <span>Progress Penyaluran</span>
                    <span>{p.progressText}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${p.progressPct}%` }} />
                  </div>
                </div>

                <div className="mt-3">
                  <button className="w-full rounded-lg border border-emerald-300 bg-white px-4 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-50">Menunggu Semua Tersalurkan</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

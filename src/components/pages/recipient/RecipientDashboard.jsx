import React from "react";
import NavbarRecipient from "../../layout/NavbarRecipient";
import { BadgeCheck, Package, Wallet } from "lucide-react";

function InfoPill({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-xs font-medium">
      {children}
    </span>
  );
}

function StatusTag({ status }) {
  const map = {
    Terjadwal: "bg-amber-100 text-amber-800",
    Selesai: "bg-emerald-100 text-emerald-800",
    Aktif: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${map[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}

function RecipientProgramCard({ program }) {
  const { title, donor, status, type, start, end, donation, goods, schedule } = program;
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-slate-900 font-semibold leading-snug">{title}</h3>
          <p className="text-xs text-slate-600">Donatur: {donor}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <InfoPill>
              <span role="img" aria-label="tanggal">📅</span> {start}
            </InfoPill>
            <InfoPill>
              <span role="img" aria-label="tanggal">📅</span> {end}
            </InfoPill>
            <InfoPill>{type}</InfoPill>
          </div>
        </div>
        <StatusTag status={status} />
      </div>

      {/* Donation summary */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
          {type === "Uang" ? <Wallet className="w-4 h-4 text-emerald-600" /> : <Package className="w-4 h-4 text-emerald-600" />} 
          Jumlah Donasi
        </div>
        <p className="mt-1 text-sm text-slate-700">
          {type === "Uang" ? donation : `Barang: ${goods}`}
        </p>
      </div>

      {/* Jadwal table (latest row shown) */}
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
          <BadgeCheck className="w-4 h-4 text-emerald-600" />
          Jadwal Pengambilan Bantuan
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-slate-200 rounded-md overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-b from-green-600 to-green-300">
                <th className="py-2 px-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white">Tanggal</th>
                <th className="py-2 px-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white">Lokasi</th>
                <th className="py-2 px-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white">Jam</th>
                <th className="py-2 px-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white">Tahap</th>
                <th className="py-2 px-3 text-left text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-white">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {schedule.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                  <td className="py-2.5 px-3 text-xs sm:text-sm font-medium text-slate-800">{row.tanggal}</td>
                  <td className="py-2.5 px-3 text-xs sm:text-sm text-slate-700">{row.lokasi}</td>
                  <td className="py-2.5 px-3 text-xs sm:text-sm text-slate-700">{row.jam}</td>
                  <td className="py-2.5 px-3 text-xs sm:text-sm text-slate-700">{row.tahap}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-medium ${row.status === "Selesai" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {row.status === "Selesai" ? "✓" : ""} {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-center">
        <button className="bg-white text-slate-800 font-medium px-5 py-2 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 hover:shadow transition-colors">Detail Program</button>
      </div>
    </div>
  );
}

export default function RecipientDashboard() {
  const programs = [
    {
      title: "Pemberdayaan Ibu Rumah Tangga melalui Kebun Sayur",
      donor: "Yayasan Peduli Negeri",
      status: "Terjadwal",
      type: "Barang",
      start: "1 Oktober 2025",
      end: "30 Desember 2025",
      goods: "Bibit, polybag, pupuk organik",
      schedule: [
        { tanggal: "3 November 2025", lokasi: "Kantor Desa", jam: "08:00 - 11:00, 14:00 - 16:00", tahap: "Tahap 2", status: "Terjadwal" },
      ],
    },
    {
      title: "Bantuan Langsung Tunai (BLT)",
      donor: "Kementerian Sosial",
      status: "Selesai",
      type: "Uang",
      start: "1 Juli 2025",
      end: "30 Agustus 2025",
      donation: "Rp. 150.000,00 (setiap bulan)",
      schedule: [
        { tanggal: "3 Agustus 2025", lokasi: "Kantor Desa", jam: "08:00 - 11:00, 14:00 - 16:00", tahap: "Tahap 1", status: "Selesai" },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarRecipient />

      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        {/* Greeting */}
        <section className="bg-white/80 border border-blue-200 rounded-lg shadow-sm px-4 py-4 sm:px-6 sm:py-5 mb-6">
          <h2 className="text-[#0B2B5E] font-semibold text-lg sm:text-xl">Selamat Datang Kembali, Ahmad Yani</h2>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            Status Penerimaan Anda:
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold">
              <BadgeCheck className="w-3 h-3" /> Anda Terdaftar Untuk Dapat Menerima Bantuan
            </span>
          </div>
        </section>

        {/* Section title */}
        <div className="mb-4 flex items-center gap-2">
          <span className="text-amber-600">🍎</span>
          <h3 className="text-[#0B2B5E] font-semibold">Program Bantuan yang Diterima</h3>
        </div>

        {/* Program list */}
        <div className="space-y-6">
          {programs.map((p, idx) => (
            <RecipientProgramCard key={idx} program={p} />)
          )}
        </div>
      </main>
    </div>
  );
}

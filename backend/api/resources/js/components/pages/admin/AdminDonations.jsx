import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { Calendar, Clock4, Filter, Package, Search, Wallet, XCircle, CheckCircle2 } from "lucide-react";

function Toggle({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
        active ? "bg-emerald-600 text-white border-emerald-600 shadow" : "bg-white text-[#0B2B5E] border-slate-300 hover:bg-slate-50"
      }`}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  );
}

function Chip({ children, className = "" }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${className}`}>{children}</span>;
}

function ScheduledCard({ item, onEdit }) {
  const safeProgress = Math.min(100, Math.max(0, item.progress || 0));
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-slate-900 font-semibold leading-snug">{item.title}</h3>
          <p className="text-xs text-slate-600">Donatur: {item.donor}</p>
        </div>
        <Chip className="bg-blue-50 text-blue-700 border border-blue-200">{item.type}</Chip>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip className="bg-slate-100 text-slate-700">📅 {item.start}</Chip>
        <Chip className="bg-slate-100 text-slate-700">📅 {item.end}</Chip>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
        <div className="flex items-center gap-2 text-slate-800 font-medium">
          {item.type === "Uang" ? <Wallet className="w-4 h-4 text-emerald-600" /> : <Package className="w-4 h-4 text-emerald-600" />}
          Jumlah Donasi
        </div>
        <p className="mt-1 text-slate-700">{item.type === "Uang" ? item.amount : item.goods}</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-800">Progress Penyaluran</span>
          <span className="text-sm text-slate-700 font-semibold">{safeProgress}% <span className="text-slate-500 font-normal">({item.progressNote})</span></span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${safeProgress}%` }} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-between">
  <button onClick={onEdit} className="px-4 py-2 rounded-md border border-slate-300 bg-white text-slate-800 font-medium hover:bg-slate-50">Edit Program</button>
        <button className="px-4 py-2 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200 disabled:opacity-70" disabled>
          Menunggu Semua Tersalurkan
        </button>
      </div>
    </section>
  );
}

function PendingCard({ item, onSchedule }) {
  return (
    <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-slate-900 font-semibold leading-snug">{item.title}</h3>
          <p className="text-xs text-slate-600">Donatur: {item.donor}</p>
        </div>
        <Chip className="bg-blue-50 text-blue-700 border border-blue-200">{item.type}</Chip>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip className="bg-slate-100 text-slate-700">📅 {item.start}</Chip>
        <Chip className="bg-slate-100 text-slate-700">📅 {item.end}</Chip>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm">
        <div className="flex items-center gap-2 text-slate-800 font-medium">
          {item.type === "Uang" ? <Wallet className="w-4 h-4 text-emerald-600" /> : <Package className="w-4 h-4 text-emerald-600" />}
          Jumlah Donasi
        </div>
        <p className="mt-1 text-slate-700">{item.type === "Uang" ? item.amount : item.goods}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {item.hasProof ? (
          <Chip className="bg-violet-100 text-violet-800 border border-violet-200">Lihat Bukti Transfer</Chip>
        ) : (
          <Chip className="bg-slate-200 text-slate-700 border border-slate-300">Bukti Transfer Belum Ada</Chip>
        )}
        <Chip className="bg-white text-slate-700 border border-slate-300">{item.hasProof ? "Menunggu penjadwalan" : "Menunggu upload bukti transfer"}</Chip>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <button className="px-4 py-2 rounded-md border border-slate-300 bg-white text-slate-800 font-medium hover:bg-slate-50">Detail Program</button>
        <div className="flex flex-col sm:flex-row gap-2">
          {item.hasProof ? (
            <button onClick={onSchedule} className="px-4 py-2 rounded-md bg-emerald-600 text-white font-semibold hover:bg-emerald-700">Lakukan Penjadwalan</button>
          ) : (
            <button className="px-4 py-2 rounded-md bg-violet-600 text-white font-semibold hover:bg-violet-700">Lihat Bukti Transfer</button>
          )}
          <button className="px-4 py-2 rounded-md bg-rose-600 text-white font-semibold hover:bg-rose-700">Tolak</button>
        </div>
      </div>
    </section>
  );
}

export default function AdminDonations() {
  const [tab, setTab] = useState("terjadwal"); // "pending" | "terjadwal"
  const navigate = useNavigate();

  const donations = useMemo(
    () => ({
      terjadwal: [
        {
          id: 1,
          title: "Bantuan Modal Usaha Mikro untuk Ibu Rumah Tangga",
          donor: "PT Djarum",
          type: "Uang",
          start: "1 Oktober 2025",
          end: "30 Desember 2025",
          amount: "Rp 25.000.000,- (dua puluh lima juta rupiah)",
          progress: 50,
          progressNote: "25/50 KK",
        },
        {
          id: 2,
          title: "Bantuan Pakaian Layak Pakai",
          donor: "PT Pan Brothers Tbk",
          type: "Barang",
          start: "1 Oktober 2025",
          end: "30 Desember 2025",
          goods: "Pakaian baru (kos, celana, dan kemeja)",
          progress: 0,
          progressNote: "0/30 KK",
        },
      ],
      pending: [
        {
          id: 3,
          title: "Bantuan Pangan Desa Mandiri",
          donor: "Yayasan Peduli Negeri",
          type: "Uang",
          start: "1 Oktober 2025",
          end: "30 Desember 2025",
          amount: "Rp. 10.000.000,- (sepuluh juta rupiah)",
          hasProof: false,
        },
        {
          id: 4,
          title: "Santunan Biaya Sekolah Anak Yatim",
          donor: "Yayasan Peduli Negeri",
          type: "Uang",
          start: "1 Januari 2026",
          end: "30 Februari 2026",
          amount: "Rp. 25.000.000,- (dua puluh lima juta rupiah)",
          hasProof: true,
        },
      ],
    }),
    []
  );

  const [query, setQuery] = useState("");
  const list = (donations[tab] || []).filter((d) => {
    const q = query.trim().toLowerCase();
    return !q || d.title.toLowerCase().includes(q) || d.donor.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarAdmin />

      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        <div className="text-center mb-6">
          <div className="inline-block bg-white shadow-md border border-blue-200 px-6 sm:px-8 py-3 rounded-lg">
            <h1 className="text-[#0B2B5E] font-semibold text-lg sm:text-xl">Kelola Donasi dari Donatur</h1>
            <p className="text-xs text-slate-600 mt-1">Lihat, verifikasi, dan jadwalkan donasi yang masuk ke sistem desa.</p>
          </div>
        </div>

        {/* Toggle */}
        <section className="bg-white rounded-xl shadow-sm border border-green-300 p-3 sm:p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <Toggle active={tab === "pending"} icon={Clock4} label="Pending" onClick={() => setTab("pending")} />
            <Toggle active={tab === "terjadwal"} icon={Calendar} label="Terjadwal" onClick={() => setTab("terjadwal")} />
          </div>
          <div className="mt-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari Program atau Kategori"
                className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
              />
            </div>
          </div>
        </section>

        {/* List */}
        <div className="space-y-5">
          {list.map((d) =>
            tab === "pending" ? (
              <PendingCard key={d.id} item={d} onSchedule={() => navigate(`/admin/donasi/${d.id}/jadwal`)} />
            ) : (
              <ScheduledCard key={d.id} item={d} onEdit={() => navigate(`/admin/donasi/${d.id}/edit`)} />
            )
          )}
          {list.length === 0 && <div className="text-center text-slate-600 text-sm py-8">Tidak ada data.</div>}
        </div>
      </main>
    </div>
  );
}

import React, { useMemo, useState } from "react";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { Filter, Search, Package, Wallet, BadgeCheck } from "lucide-react";

function StatusPill({ active, children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
        active
          ? "bg-green-600 text-white border-green-600 shadow"
          : "bg-white text-[#0B2B5E] border-green-600 hover:bg-green-50"
      }`}
    >
      {children}
    </button>
  );
}

function TypePill({ icon: Icon, label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
        active
          ? "bg-emerald-600 text-white border-emerald-600 shadow"
          : "bg-white text-[#0B2B5E] border-emerald-600 hover:bg-emerald-50"
      }`}
    >
      <Icon className="w-3.5 h-3.5" /> {label}
    </button>
  );
}

function ProgramCard({ item }) {
  const safeProgress = Math.min(100, Math.max(0, item.progress || 0));
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-slate-900 font-semibold leading-snug">{item.title}</h3>
          <p className="text-xs text-slate-600">Donatur: {item.donor}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[11px] font-medium">📅 {item.start}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[11px] font-medium">📅 {item.end}</span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-[11px] font-semibold">{item.type}</span>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
          item.status === "Terjadwal" ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
        }`}>
          {item.status}
        </span>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
          {item.type === "Uang" ? (
            <Wallet className="w-4 h-4 text-emerald-600" />
          ) : (
            <Package className="w-4 h-4 text-emerald-600" />
          )}
          Jumlah Donasi
        </div>
        <p className="mt-1 text-sm text-slate-700">{item.type === "Uang" ? item.amount : item.goods}</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-800">Progress Penyaluran</span>
          <span className="text-sm text-slate-700 font-semibold">
            {safeProgress}% <span className="text-slate-500 font-normal">({item.progressNote})</span>
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-emerald-600 h-2 rounded-full transition-all" style={{ width: `${safeProgress}%` }} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-end">
        <button className="bg-white text-slate-800 font-medium px-5 py-2 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
          Detail dan Transparansi Program
        </button>
        <button className="bg-emerald-600 text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-emerald-700">
          Kelola Program
        </button>
      </div>
    </div>
  );
}

export default function AdminPrograms() {
  const programs = useMemo(
    () => [
      {
        id: 1,
        title: "Pemberdayaan Ibu Rumah Tangga melalui Kebun Sayur",
        donor: "Yayasan Peduli Negeri",
        status: "Terjadwal",
        type: "Barang",
        start: "1 Oktober 2025",
        end: "30 Desember 2025",
        goods: "Bibit, polybag, pupuk organik",
        amount: null,
        progress: 20,
        progressNote: "20/100 KK",
      },
      {
        id: 2,
        title: "Bantuan Modal Usaha Mikro untuk Ibu Rumah Tangga",
        donor: "PT Djurnu",
        status: "Terjadwal",
        type: "Uang",
        start: "1 Oktober 2025",
        end: "30 Desember 2025",
        amount: "Rp. 250.000,00 (tiap bulan)",
        goods: null,
        progress: 50,
        progressNote: "25/50 KK",
      },
    ],
    []
  );

  const [statusFilter, setStatusFilter] = useState("Semua");
  const [typeFilter, setTypeFilter] = useState("Semua");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    return programs.filter((p) => {
      const okStatus = statusFilter === "Semua" || p.status === statusFilter;
      const okType = typeFilter === "Semua" || p.type === typeFilter;
      const q = query.trim().toLowerCase();
      const okQuery = !q || p.title.toLowerCase().includes(q) || p.donor.toLowerCase().includes(q);
      return okStatus && okType && okQuery;
    });
  }, [programs, statusFilter, typeFilter, query]);

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarAdmin />

      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block bg-white shadow-md border border-blue-200 px-6 sm:px-8 py-3 rounded-lg">
            <h1 className="text-[#0B2B5E] font-semibold text-lg sm:text-xl">Daftar Program Bantuan Desa</h1>
            <p className="text-xs text-slate-600 mt-1">Tinjau kembali semua program aktif, dijadwalkan, maupun yang telah selesai.</p>
          </div>
        </div>

        {/* Filter card */}
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 mb-6">
          <div className="flex items-center gap-2 text-slate-800 mb-4 font-semibold">
            <Filter className="w-4 h-4 text-blue-600" /> Filter
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status group */}
            <div>
              <p className="text-sm text-slate-700 mb-2">Status:</p>
              <div className="flex flex-wrap gap-2">
                {["Semua", "Terjadwal", "Selesai"].map((s) => (
                  <StatusPill key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
                    {s}
                  </StatusPill>
                ))}
              </div>
            </div>
            {/* Type group */}
            <div>
              <p className="text-sm text-slate-700 mb-2">Jenis Donasi:</p>
              <div className="flex flex-wrap gap-2">
                <TypePill icon={Wallet} label="Uang" active={typeFilter === "Uang"} onClick={() => setTypeFilter(typeFilter === "Uang" ? "Semua" : "Uang")} />
                <TypePill icon={Package} label="Barang" active={typeFilter === "Barang"} onClick={() => setTypeFilter(typeFilter === "Barang" ? "Semua" : "Barang")} />
              </div>
            </div>
            {/* Search */}
            <div className="md:col-span-2">
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
          </div>
        </section>

        {/* List */}
        <section className="space-y-5">
          {filtered.map((item) => (
            <ProgramCard key={item.id} item={item} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center text-slate-600 text-sm py-8">Tidak ada program yang cocok dengan filter.</div>
          )}
        </section>
      </main>
    </div>
  );
}

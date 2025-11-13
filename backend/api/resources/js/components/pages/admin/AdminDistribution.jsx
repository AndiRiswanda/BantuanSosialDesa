import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../layout/NavbarAdmin";

function StatusBadge({ status }) {
  const isVerified = (status || "").toLowerCase().includes("verif");
  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
        isVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"
      }`}
    >
      {isVerified ? "Verifikasi" : status}
    </span>
  );
}

function CategoryChip({ label }) {
  return (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-slate-300 bg-slate-50 text-slate-700">
      {label}
    </span>
  );
}

export default function AdminDistribution() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const rows = useMemo(
    () => [
      {
        name: "Bantuan Langsung Tunai (BLT)",
        desc: "Bantuan uang tunai untuk warga miskin dari bantuan pemerintah pusat.",
        category: "Uang",
        period: "Juli - Agustus 2025",
        status: "Verifikasi",
      },
      {
        name: "Pemberdayaan Ibu Rumah Tangga melalui Kebun Sayur",
        desc: "Program ini mengajak ibu rumah tangga menanam sayuran organik di pekarangan rumah sebagai sumber tambahan pangan dan penghasilan.",
        category: "Barang",
        period: "Oktober - Desember 2025",
        status: "Verifikasi",
      },
      {
        name: "Program Pupuk Bersubsidi Petani Kecil",
        desc: "Distribusi pupuk bersubsidi kepada para petani dan pekebun yang terdaftar.",
        category: "Barang",
        period: "Oktober - Desember 2025",
        status: "Verifikasi",
      },
      {
        name: "Bantuan Modal Usaha Mikro untuk Ibu Rumah Tangga",
        desc: "Memberikan bantuan modal usaha untuk IRT yang bergerak sebagai pelaku usaha mikro sebagai penggerak sektor UMKM",
        category: "Uang",
        period: "Oktober - Desember 2025",
        status: "Verifikasi",
      },
    ],
    []
  );

  const list = rows.filter((r) => {
    const q = query.trim().toLowerCase();
    return (
      !q ||
      r.name.toLowerCase().includes(q) ||
      r.desc.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.period.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarAdmin />
      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        <header className="text-center mb-6">
          <h1 className="text-[#0B2B5E] font-semibold text-xl">Penyaluran Bantuan ke Warga</h1>
          <p className="text-xs text-slate-600 mt-1">Konfirmasi penerima, tandai status penyaluran, dan unggah dokumentasi transparansi.</p>
        </header>

        <div className="mb-4 max-w-md">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari program, kategori, atau periode"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-emerald-700 text-white">
                <th className="px-4 py-3 text-left">Nama Program</th>
                <th className="px-4 py-3 text-left">Deskripsi</th>
                <th className="px-4 py-3 text-left">Kategori</th>
                <th className="px-4 py-3 text-left">Periode</th>
                <th className="px-4 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {list.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="align-top px-4 py-3 text-slate-900 font-medium w-[22rem]">{row.name}</td>
                  <td className="align-top px-4 py-3 text-slate-700">{row.desc}</td>
                  <td className="align-top px-4 py-3"><CategoryChip label={row.category} /></td>
                  <td className="align-top px-4 py-3 whitespace-nowrap text-slate-900">{row.period}</td>
                  <td className="align-top px-4 py-3">
                    <button
                      type="button"
                      onClick={() => navigate(`/admin/penyaluran/${idx + 1}/verifikasi`)}
                      className="focus:outline-none"
                    >
                      <StatusBadge status={row.status} />
                    </button>
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-600">Tidak ada data.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden space-y-4">
          {list.map((row, idx) => (
            <section key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <h3 className="text-slate-900 font-semibold">{row.name}</h3>
              <p className="mt-1 text-sm text-slate-700">{row.desc}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <CategoryChip label={row.category} />
                <span className="text-xs text-slate-600">{row.period}</span>
                <button type="button" onClick={() => navigate(`/admin/penyaluran/${idx + 1}/verifikasi`)} className="focus:outline-none">
                  <StatusBadge status={row.status} />
                </button>
              </div>
            </section>
          ))}
          {list.length === 0 && <div className="text-center text-slate-600 text-sm py-8">Tidak ada data.</div>}
        </div>
      </main>
    </div>
  );
}

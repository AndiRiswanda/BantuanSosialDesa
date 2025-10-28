import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { ArrowLeft, Calendar as CalendarIcon, Info, Upload, Search } from "lucide-react";

function Chip({ children, className = "" }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${className}`}>{children}</span>;
}

function Progress({ value, note }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <section className="bg-white rounded-xl shadow-sm border border-emerald-300 p-4">
      <div className="flex items-center justify-between text-sm text-slate-800 mb-2">
        <span>Progress Penyaluran</span>
        <span className="font-semibold">{pct}% <span className="text-slate-500 font-normal">{note}</span></span>
      </div>
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-600" style={{ width: `${pct}%` }} />
      </div>
    </section>
  );
}

function UploadModal({ open, onClose }) {
  const [file, setFile] = useState(null);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="w-full max-w-md bg-white rounded-xl shadow-xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b bg-blue-50 rounded-t-xl">
          <p className="font-semibold text-slate-800 text-sm">Upload Dokumen</p>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100" aria-label="Tutup">✕</button>
        </div>
        <div className="p-4">
          <label className="block border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50">
            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            <Upload className="w-8 h-8 mx-auto text-slate-500" />
            <p className="text-sm text-slate-700 mt-2">Klik untuk pilih file</p>
            <p className="text-xs text-slate-500">atau drag & drop di sini</p>
            {file && <p className="text-xs text-emerald-700 font-medium mt-2">Dipilih: {file.name}</p>}
          </label>
          <div className="mt-4 text-right">
            <button onClick={onClose} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">Simpan File</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDistributionVerify() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock program detail
  const program = {
    id,
    title: "Pemberdayaan Ibu Rumah Tangga melalui Kebun Sayur",
    categories: ["Barang", "Pangan & Sembako"],
    status: "Terjadwal",
    start: "2025-10-01",
    end: "2025-12-30",
    donation: "Barang (bibit, polybag, pupuk organik)",
    criteria:
      "Ibu rumah tangga tidak memiliki penghasilan tetap yang memiliki lahan pekarangan minimal 2x2 meter serta tanggungan keluarga lebih dari 2 orang",
    description:
      "Penerima diutamakan ibu rumah tangga dengan kondisi ekonomi menengah ke bawah yang ingin memulai kebun sayur mandiri di rumahnya.",
  };

  const schedules = [
    { date: "3 Oktober 2025", location: "Kantor Desa", time: "08:00 - 11:00\n14:00 - 16:00", note: "Tahap 1", recipients: 20, status: "Selesai" },
    { date: "3 November 2025", location: "Kantor Desa", time: "08:00 - 11:00\n14:00 - 16:00", note: "Tahap 2", recipients: 40, status: "Terjadwal" },
    { date: "3 Desember 2025", location: "Kantor Desa", time: "08:00 - 11:00\n14:00 - 16:00", note: "Tahap 3", recipients: 40, status: "Terjadwal" },
  ];

  const recipients = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        id: i + 1,
        kk: `3174-45${String(i + 1).padStart(4, "0")}`,
        name: ["Ahmad Yani", "Siti Aminah", "Ratna Dewi", "Joko Susilo", "Siti Nurhayati"][i % 5] + ` ${Math.floor(i / 5) + 1}`,
        address: `Jl. Mawar No. ${i + 10}, RT 0${(i % 4) + 1}/0${(i % 3) + 1}`,
        tahap: (i % 3) + 1,
        status: i % 7 === 0 ? "Selesai" : "Menunggu",
      })),
    []
  );
  const [tahap, setTahap] = useState(0); // 0 = Semua
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const containerRef = useRef(null);
  const [openUpload, setOpenUpload] = useState(false);

  const filtered = recipients.filter((r) => {
    const byTahap = !tahap || r.tahap === tahap;
    const q = query.trim().toLowerCase();
    const bySearch = !q || r.name.toLowerCase().includes(q) || r.kk.includes(q) || r.address.toLowerCase().includes(q);
    return byTahap && bySearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageData = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    // reset to first page on filter/search change
    setPage(1);
  }, [tahap, query]);

  // Simple touch swipe support for mobile: swipe left/right to change page
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    const onStart = (e) => {
      startX = e.touches?.[0]?.clientX ?? 0;
    };
    const onEnd = (e) => {
      const endX = e.changedTouches?.[0]?.clientX ?? 0;
      const dx = endX - startX;
      const threshold = 40; // px
      if (Math.abs(dx) < threshold) return;
      if (dx < 0 && safePage < totalPages) setPage((p) => Math.min(totalPages, p + 1));
      if (dx > 0 && safePage > 1) setPage((p) => Math.max(1, p - 1));
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [safePage, totalPages]);

  const fmtDate = (iso) => {
    // Keep it simple; display day month year in id style if preformatted
    try {
      const d = new Date(iso);
      if (!isNaN(d)) return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch {}
    return iso;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarAdmin />
      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-[#0B2B5E] text-sm font-semibold mb-3 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Verifikasi Penyaluran
        </button>

        {/* Header card */}
        <section className="bg-white rounded-xl border border-emerald-300 shadow-sm p-4 sm:p-5">
          <h1 className="text-center text-[#0B2B5E] font-semibold text-lg sm:text-xl">Verifikasi Penyaluran Bantuan ke Warga</h1>
          <p className="text-center text-xs text-slate-600 mt-1">Konfirmasi penerima, tandai status penyaluran, dan unggah dokumentasi transparansi.</p>

          <div className="mt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-slate-900 font-semibold leading-snug">{program.title}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {program.categories.map((c) => (
                    <Chip key={c} className="bg-indigo-50 text-indigo-700 border border-indigo-200">{c}</Chip>
                  ))}
                </div>
              </div>
              <Chip className="bg-blue-100 text-blue-800 border border-blue-200">{program.status}</Chip>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs font-medium text-slate-700">Tanggal Dimulai</label>
                <div className="relative mt-1">
                  <CalendarIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input disabled value={fmtDate(program.start)} className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Tanggal Selesai</label>
                <div className="relative mt-1">
                  <CalendarIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input disabled value={fmtDate(program.end)} className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-sm" />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                <div className="flex items-center gap-2 text-slate-800 font-medium">📦 Jumlah Donasi</div>
                <p className="mt-1 text-slate-700">{program.donation}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                <div className="flex items-center gap-2 text-slate-800 font-medium"><Info className="w-4 h-4 text-emerald-600" /> Kriteria Penerima Donasi</div>
                <p className="mt-1 text-slate-700">{program.criteria}</p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm mt-3">
              <div className="flex items-center gap-2 text-slate-800 font-medium"><Info className="w-4 h-4 text-emerald-600" /> Keterangan Penerimaan Donasi</div>
              <p className="mt-1 text-slate-700">{program.description}</p>
            </div>
          </div>
        </section>

        <div className="mt-4"><Progress value={20} note="(20/100 KK)" /></div>

        {/* Schedule table */}
        <section className="bg-white rounded-xl shadow-sm border border-emerald-300 mt-4">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2 text-sm font-semibold text-[#0B2B5E]">
            <span>🗓️ Jadwal Penyaluran Bantuan</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-emerald-700 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Tanggal</th>
                  <th className="px-4 py-2 text-left">Lokasi Penyebaran</th>
                  <th className="px-4 py-2 text-left">Jam Pengambilan</th>
                  <th className="px-4 py-2 text-left">Keterangan</th>
                  <th className="px-4 py-2 text-left">Penerima</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {schedules.map((s, idx) => (
                  <tr key={idx} className="align-top">
                    <td className="px-4 py-3 whitespace-nowrap">{s.date}</td>
                    <td className="px-4 py-3">{s.location}</td>
                    <td className="px-4 py-3 whitespace-pre-line">{s.time}</td>
                    <td className="px-4 py-3">{s.note}</td>
                    <td className="px-4 py-3">{s.recipients}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        s.status === "Selesai" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-800"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recipient verification */}
        <section className="mt-6">
          <h2 className="text-slate-900 font-semibold">Verifikasi Penerima Program Bantuan</h2>
          <div className="mt-2 border-2 border-dashed border-emerald-300 rounded-xl p-3 sm:p-4">
            <div className="flex flex-wrap items-center gap-2">
              {[{ k:0, l:"Semua" }, {k:1,l:"Tahap 1"}, {k:2,l:"Tahap 2"}, {k:3,l:"Tahap 3"}].map(({k,l}) => (
                <button key={k} onClick={() => setTahap(k)} className={`px-3 py-1 rounded-md border text-xs font-semibold ${tahap===k?"bg-emerald-600 text-white border-emerald-600":"bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}>{l}</button>
              ))}
            </div>

            <div className="mt-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Cari Nama atau No. KK" className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
              </div>
            </div>

            <div ref={containerRef} className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-emerald-700 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">No</th>
                    <th className="px-3 py-2 text-left">No. KK</th>
                    <th className="px-3 py-2 text-left">Nama Penerima</th>
                    <th className="px-3 py-2 text-left">Alamat</th>
                    <th className="px-3 py-2 text-left">Penyaluran</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pageData.map((r, i) => (
                    <tr key={r.id}>
                      <td className="px-3 py-2">{(safePage - 1) * pageSize + i + 1}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.kk}</td>
                      <td className="px-3 py-2">{r.name}</td>
                      <td className="px-3 py-2">{r.address}</td>
                      <td className="px-3 py-2">Tahap {r.tahap}</td>
                      <td className="px-3 py-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${r.status==="Selesai"?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-800"}`}>{r.status}</span>
                      </td>
                    </tr>
                  ))}
                  {filtered.length===0 && (
                    <tr><td className="px-3 py-6 text-center text-slate-600" colSpan={6}>Tidak ada data.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-full border border-slate-300 bg-white text-slate-700 disabled:opacity-50"
                aria-label="Halaman sebelumnya"
              >
                ‹
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).slice(0, 10).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setPage(pageNum)}
                      className={`w-2.5 h-2.5 rounded-full ${pageNum === safePage ? "bg-blue-600" : "bg-blue-300"}`}
                      aria-label={`Halaman ${pageNum}`}
                    />
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-full border border-slate-300 bg-white text-slate-700 disabled:opacity-50"
                aria-label="Halaman berikutnya"
              >
                ›
              </button>
            </div>

            <div className="mt-4 text-center">
              <button onClick={()=>setOpenUpload(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">
                <Upload className="w-4 h-4" /> Upload Dokumentasi Penyaluran
              </button>
            </div>
          </div>
        </section>

        <UploadModal open={openUpload} onClose={()=>setOpenUpload(false)} />
      </main>
    </div>
  );
}

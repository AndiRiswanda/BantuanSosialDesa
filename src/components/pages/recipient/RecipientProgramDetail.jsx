import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarRecipient from "../../layout/NavbarRecipient";
import { Calendar, Users2, Image as ImageIcon, Info, Check, Clock4 } from "lucide-react";

function Pill({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${className}`}>
      {children}
    </span>
  );
}

function Tab({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
        active ? "bg-emerald-600 text-white border-emerald-600 shadow" : "bg-white text-[#0B2B5E] border-emerald-600 hover:bg-emerald-50"
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />} {children}
    </button>
  );
}

export default function RecipientProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("detail"); // detail | jadwal | penerima | dokumentasi

  // Mock program data; replace with API later
  const program = useMemo(
    () => ({
      id: Number(id) || 1,
      title: "Pemberdayaan Ibu Rumah Tangga melalui Kebun Sayur",
      donor: "Yayasan Peduli Negeri",
      status: "Terjadwal",
      categories: ["Barang", "Pangan & Sembako"],
      start: "1 Oktober 2025",
      end: "30 Desember 2025",
      progress: 20,
      progressNote: "20/100 KK",
      goods: "Bibit, polybag, pupuk organik",
      schedules: [
        { tanggal: "3 Oktober 2025", lokasi: "Kantor Desa", jam: ["08:00 - 11:00", "14:00 - 16:00"], ket: "Tahap 1", penerima: 20, status: "Selesai" },
        { tanggal: "3 November 2025", lokasi: "Kantor Desa", jam: ["08:00 - 11:00", "14:00 - 16:00"], ket: "Tahap 2", penerima: 40, status: "Terjadwal" },
        { tanggal: "3 Desember 2025", lokasi: "Kantor Desa", jam: ["08:00 - 11:00", "14:00 - 16:00"], ket: "Tahap 3", penerima: 40, status: "Terjadwal" },
      ],
      recipients: Array.from({ length: 10 }).map((_, i) => ({
        no: i + 1,
        kk: [
          "731306112204",
          "3601****3688",
          "3601****5578",
          "3601****7890",
          "3601****1234",
          "3601****4932",
          "3601****7248",
          "3601****1256",
          "3601****2523",
          "3601****9988",
        ][i],
        nama: [
          "Ahmad Yani",
          "Siti Aminah",
          "Ratna Dewi",
          "Joko Susilo",
          "Siti Nurhayati",
          "Rina Mariana",
          "Maya Lestari",
          "Fitri Handayani",
          "Dewi Paramita",
          "Nur Aini",
        ][i],
        alamat: [
          "Jl. Melati No. 12, RT 01/02",
          "Jl. Mawar 3, RT 02/03",
          "Jl. Kenanga No. 5, RT 03/04",
          "Jl. Anggrek No. 13, RT 01/02",
          "Jl. Kemiri 5, RT 03/01",
          "Jl. Merpati 11, RT 04/02",
          "Jl. Flamboyan 8, RT 03/02",
          "Jl. Pelita 1, RT 01/02",
          "Jl. Pelita 1, RT 01/02",
          "Jl. Kebon 9, RT 02/03",
        ][i],
        tahap: "Tahap 1",
        status: "Selesai",
      })),
      images: Array.from({ length: 6 }).map((_, i) => `https://placehold.co/400x300?text=Dokumentasi+${i + 1}`),
    }),
    [id]
  );

  const safeProgress = Math.min(100, Math.max(0, program.progress));

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarRecipient />

      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Back */}
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-[#0B2B5E] hover:text-emerald-700">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border border-slate-200">←</span>
            Detail Program Bantuan
          </button>

          {/* Header card */}
          <section className="bg-white/90 rounded-xl border border-green-200 shadow-sm p-4 sm:p-6">
            <div className="text-center">
              <h1 className="text-[#0B2B5E] font-semibold text-lg sm:text-xl">Detail dan Transparansi Program Bantuan</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Lihat jadwal penyaluran, penerima manfaat, serta dokumentasi kegiatan untuk memastikan bantuan tersalurkan dengan tepat.</p>
            </div>

            <div className="mt-4">
              <h2 className="text-slate-900 font-semibold">{program.title}</h2>
              <p className="text-xs text-slate-600 mt-1">Program ini mengajak ibu rumah tangga menanam sayuran organik di pekarangan rumah sebagai sumber tambahan pangan dan penghasilan.</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {program.categories.map((c) => (
                  <Pill key={c} className="bg-blue-50 text-blue-700 border border-blue-200">{c}</Pill>
                ))}
                <Pill className="ml-auto bg-amber-100 text-amber-800">{program.status}</Pill>
              </div>
            </div>
          </section>

          {/* Progress */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between text-sm font-medium text-slate-800">
              <span>Progress Penyaluran</span>
              <span>{safeProgress}% <span className="text-slate-500 font-normal">({program.progressNote})</span></span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${safeProgress}%` }} />
            </div>
          </section>

          {/* Tabs */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
            <div className="flex flex-wrap gap-2">
              <Tab active={tab === "detail"} onClick={() => setTab("detail")} icon={Info}>Detail Program</Tab>
              <Tab active={tab === "jadwal"} onClick={() => setTab("jadwal")} icon={Calendar}>Jadwal Penyaluran</Tab>
              <Tab active={tab === "penerima"} onClick={() => setTab("penerima")} icon={Users2}>Daftar Penerima</Tab>
              <Tab active={tab === "dokumentasi"} onClick={() => setTab("dokumentasi")} icon={ImageIcon}>Dokumentasi</Tab>
            </div>
          </section>

          {/* Tab content */}
          {tab === "detail" && (
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-slate-800 font-semibold mb-3">
                  <Calendar className="w-4 h-4" /> Pelaksanaan Program
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600">Tanggal Dimulai</label>
                    <div className="mt-1 flex items-center gap-2 rounded-md border border-slate-300 px-2 py-2 text-sm bg-white">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <input value={program.start} readOnly className="w-full outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600">Tanggal Selesai</label>
                    <div className="mt-1 flex items-center gap-2 rounded-md border border-slate-300 px-2 py-2 text-sm bg-white">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <input value={program.end} readOnly className="w-full outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800 mb-1">Jumlah Donasi</p>
                <p className="text-xs text-slate-700">Barang (bibit, polybag, pupuk organik)</p>
              </div>

              <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                <p className="text-sm font-semibold text-slate-800">Kriteria Penerima Donasi</p>
                <p className="text-xs text-slate-700 mt-1">Ibu rumah tangga tidak memiliki penghasilan tetap yang memiliki lahan pekarangan minimal 2×2 meter serta tanggungan keluarga lebih dari 2 orang</p>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800">Keterangan Penerima Donasi</p>
                <p className="text-xs text-slate-700 mt-1">Penerima diutamakan ibu rumah tangga dengan kondisi ekonomi menengah ke bawah yang ingin memulai kebun sayur mandiri di rumahnya.</p>
              </div>
            </section>
          )}

          {tab === "jadwal" && (
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <div className="flex items-center gap-2 text-slate-800 font-semibold mb-3">
                <Calendar className="w-4 h-4" /> Jadwal Penyaluran Bantuan
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-emerald-50 text-slate-800">
                      <th className="px-3 py-2 text-left rounded-l-lg">Tanggal</th>
                      <th className="px-3 py-2 text-left">Lokasi Penyebaran</th>
                      <th className="px-3 py-2 text-left">Jam Pengambilan</th>
                      <th className="px-3 py-2 text-left">Keterangan</th>
                      <th className="px-3 py-2 text-left">Penerima</th>
                      <th className="px-3 py-2 text-left rounded-r-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {program.schedules.map((row, idx) => (
                      <tr key={idx} className="border-b last:border-0">
                        <td className="px-3 py-2 whitespace-nowrap">{row.tanggal}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{row.lokasi}</td>
                        <td className="px-3 py-2">
                          <div className="flex flex-col">
                            <span>{row.jam[0]}</span>
                            <span>{row.jam[1]}</span>
                          </div>
                        </td>
                        <td className="px-3 py-2 whitespace-nowrap">{row.ket}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{row.penerima}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          {row.status === "Selesai" ? (
                            <Pill className="bg-emerald-100 text-emerald-800 border border-emerald-200"><Check className="w-3.5 h-3.5" /> Selesai</Pill>
                          ) : (
                            <Pill className="bg-amber-100 text-amber-800 border border-amber-200"><Clock4 className="w-3.5 h-3.5" /> Terjadwal</Pill>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {tab === "penerima" && (
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <div className="flex items-center gap-2 text-slate-800 font-semibold mb-3">
                <Users2 className="w-4 h-4" /> Daftar Penerima Bantuan
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-emerald-50 text-slate-800">
                      <th className="px-3 py-2 text-left rounded-l-lg">No</th>
                      <th className="px-3 py-2 text-left">No. KK</th>
                      <th className="px-3 py-2 text-left">Nama Penerima</th>
                      <th className="px-3 py-2 text-left">Alamat</th>
                      <th className="px-3 py-2 text-left">Penyaluran</th>
                      <th className="px-3 py-2 text-left rounded-r-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {program.recipients.map((r) => (
                      <tr key={r.no} className="border-b last:border-0">
                        <td className="px-3 py-2 whitespace-nowrap">{r.no}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{r.kk}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{r.nama}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{r.alamat}</td>
                        <td className="px-3 py-2 whitespace-nowrap">{r.tahap}</td>
                        <td className="px-3 py-2 whitespace-nowrap">
                          <Pill className="bg-emerald-100 text-emerald-800 border border-emerald-200"><Check className="w-3.5 h-3.5" /> Selesai</Pill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination mock */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <button className="w-7 h-7 rounded-full border border-slate-300 bg-white hover:bg-slate-50">‹</button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <span key={i} className={`w-2 h-2 rounded-full ${i === 0 ? "bg-emerald-600" : "bg-slate-300"}`} />
                  ))}
                </div>
                <button className="w-7 h-7 rounded-full border border-slate-300 bg-white hover:bg-slate-50">›</button>
              </div>
            </section>
          )}

          {tab === "dokumentasi" && (
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <div className="flex items-center gap-2 text-slate-800 font-semibold mb-3">
                <ImageIcon className="w-4 h-4" /> Dokumentasi
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {program.images.map((src, i) => (
                  <div key={i} className="aspect-[4/3] rounded-lg bg-slate-100 border border-slate-200 overflow-hidden">
                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                    <img src={src} alt={`Dokumentasi ${i + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

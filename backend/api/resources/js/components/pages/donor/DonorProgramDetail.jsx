import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarDonor from "../../layout/NavbarDonor";
import { ArrowLeft, CalendarDays, Layers, Package, BadgeDollarSign, Users, Image as ImageIcon, FileText, ChevronLeft, ChevronRight } from "lucide-react";

const StatusPill = ({ color = "slate", children }) => {
  const map = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[color]}`}>{children}</span>;
};

export default function DonorProgramDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useState("DETAIL"); // DETAIL | SCHEDULE | RECIPIENTS | DOCS

  const program = useMemo(() => {
    const data = {
      1: {
        title: "Bantuan Pangan Desa Mandiri",
        category: "Pangan & Sembako",
        type: "Uang",
        start: "1 Oktober 2025",
        end: "30 Desember 2025",
        description:
          "Program ini bertujuan membantu keluarga prasejahtera melalui penyaluran bahan pangan pokok secara berkala.",
        status: { label: "Pending", color: "yellow" },
        progress: 10,
        amount: "Rp. 10.000.000,- (sepuluh juta rupiah)",
        criteria:
          "Keluarga dengan penghasilan di bawah UMR setempat dan memiliki tanggungan lebih dari 2 orang.",
        notes: "Diprioritaskan pada keluarga rentan pangan di wilayah rawan banjir.",
      },
      2: {
        title: "Santunan Biaya Sekolah Anak Yatim",
        category: "Pendidikan & Sosial",
        type: "Uang",
        start: "1 Januari 2026",
        end: "30 Februari 2026",
        description:
          "Santunan untuk mendukung biaya sekolah anak yatim agar tetap melanjutkan pendidikan.",
        status: { label: "Pending", color: "yellow" },
        progress: 5,
        amount: "Rp. 25.000.000,- (dua puluh lima juta rupiah)",
        criteria: "Anak yatim dari keluarga kurang mampu dan bersekolah aktif.",
        notes: "Bekerja sama dengan pihak sekolah untuk validasi data.",
      },
      3: {
        title: "Pemberdayaan Ibu Rumah Tangga melalui Kebun Sayur",
        category: "Pangan & Sembako",
        type: "Barang",
        start: "1 Oktober 2025",
        end: "30 Desember 2025",
        description:
          "Program ini mengajak ibu rumah tangga menanam sayuran organik di pekarangan rumah sebagai sumber tambahan pangan dan penghasilan.",
        status: { label: "Terjadwal", color: "blue" },
        progress: 20,
        amount: "Barang (bibit, polybag, pupuk organik)",
        criteria:
          "Ibu rumah tangga tidak memiliki penghasilan tetap yang memiliki lahan pekarangan minimal 2x2 meter serta tanggungan keluarga lebih dari 2 orang",
        notes:
          "Penerima diutamakan ibu rumah tangga dengan kondisi ekonomi menengah ke bawah yang ingin memulai kebun sayur mandiri di rumahnya.",
      },
      4: {
        title: "Bantuan Langsung Tunai (BLT)",
        category: "Kesehatan & Gizi",
        type: "Uang",
        start: "1 Juli 2025",
        end: "30 Desember 2025",
        description: "Penyaluran dana tunai langsung kepada keluarga prasejahtera.",
        status: { label: "Selesai", color: "green" },
        progress: 100,
        amount: "Rp. 150.000.000,- (seratus lima puluh juta rupiah)",
        criteria: "Keluarga prasejahtera sesuai data DTKS dan hasil verifikasi lapangan.",
        notes: "Penyaluran selesai dan terdokumentasi.",
      },
    };
    return data[id] || data[3];
  }, [id]);

  return (
    <div className="min-h-screen bg-white">
      <NavbarDonor />

      {/* Back header */}
      <div className="bg-[#1976d26c]/30">
        <div className="max-w-6xl mx-auto px-3 py-2 text-sm text-[#0B2B5E] flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 hover:text-green-700">
            <ArrowLeft className="w-4 h-4" />
            <span>Detail Program Bantuan</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-8">
        {/* Top intro card */}
        <div className="rounded-2xl border border-green-200 shadow-sm p-5 md:p-6 bg-white">
          <h2 className="text-xl md:text-2xl font-extrabold text-center text-[#0B2B5E]">
            Detail dan Transparansi Program Bantuan
          </h2>
          <p className="text-xs md:text-sm text-slate-600 text-center mt-2">
            Lihat jadwal penyaluran, penerima manfaat, serta dokumentasi kegiatan untuk memastikan bantuan tersalurkan dengan tepat.
          </p>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 className="text-base md:text-lg font-semibold text-[#0B2B5E]">{program.title}</h3>
              <StatusPill color={program.status.color}>{program.status.label}</StatusPill>
            </div>
            <p className="mt-2 text-sm text-slate-700">
              {program.description}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold inline-flex items-center gap-1">
                <Package className="w-3.5 h-3.5" /> {program.type}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold inline-flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> {program.category}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
            <span>Progress Penyaluran</span>
            <span>{program.progress}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${program.progress}%` }} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { key: "DETAIL", label: "Detail Program", icon: FileText },
            { key: "SCHEDULE", label: "Jadwal Penyaluran", icon: CalendarDays },
            { key: "RECIPIENTS", label: "Daftar Penerima", icon: Users },
            { key: "DOCS", label: "Dokumentasi", icon: ImageIcon },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold shadow-sm border transition-colors ${
                tab === key
                  ? "bg-green-600 text-white border-green-700 hover:bg-green-700"
                  : "bg-white text-[#0B2B5E] border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Tab contents */}
        {tab === "DETAIL" && (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <div className="text-[#0B2B5E] font-semibold flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> Pelaksanaan Program
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-600 mb-1">Tanggal Dimulai</div>
                <div className="relative">
                  <input readOnly value={program.start} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"/>
                  <CalendarDays className="w-4 h-4 text-slate-400 absolute right-3 top-3.5"/>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">Tanggal Selesai</div>
                <div className="relative">
                  <input readOnly value={program.end} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"/>
                  <CalendarDays className="w-4 h-4 text-slate-400 absolute right-3 top-3.5"/>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-slate-100 rounded-lg p-3 flex items-start gap-3">
              <BadgeDollarSign className="w-5 h-5 text-green-700"/>
              <div className="text-sm">
                <div className="font-semibold text-slate-700">Jumlah Donasi</div>
                <div className="text-slate-700">{program.amount}</div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[#0B2B5E] font-semibold text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"/> Kriteria Penerima Donasi
              </div>
              <div className="mt-2 rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-700">
                {program.criteria}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[#0B2B5E] font-semibold text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"/> Keterangan Penerima Donasi
              </div>
              <div className="mt-2 rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-700">
                {program.notes}
              </div>
            </div>
          </div>
        )}

        {tab === "SCHEDULE" && (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-[#0B2B5E]">
              <CalendarDays className="w-4 h-4"/> Jadwal Penyaluran Bantuan
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    {["Tanggal","Lokasi Penyerahan","Jam Pengambilan","Keterangan","Penerima","Status"].map((h) => (
                      <th key={h} className="bg-green-200/60 text-[#0B2B5E] font-semibold px-3 py-2 border border-green-300 first:rounded-l-lg last:rounded-r-lg">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    {t:"3 Oktober 2025", l:"Kantor Desa", jam:"08:00 - 11:00\n14:00 - 16:00", ket:"Tahap 1", p:20, s:{label:"Selesai", color:"green"}},
                    {t:"3 November 2025", l:"Kantor Desa", jam:"08:00 - 11:00\n14:00 - 16:00", ket:"Tahap 2", p:40, s:{label:"Terjadwal", color:"blue"}},
                    {t:"3 Desember 2025", l:"Kantor Desa", jam:"08:00 - 11:00\n14:00 - 16:00", ket:"Tahap 3", p:40, s:{label:"Terjadwal", color:"blue"}},
                  ].map((r, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="px-3 py-3 align-top border-l border-slate-200">{r.t}</td>
                      <td className="px-3 py-3 align-top">{r.l}</td>
                      <td className="px-3 py-3 align-top whitespace-pre-line">{r.jam}</td>
                      <td className="px-3 py-3 align-top">{r.ket}</td>
                      <td className="px-3 py-3 align-top">{r.p}</td>
                      <td className="px-3 py-3 align-top border-r border-slate-200"><StatusPill color={r.s.color}>{r.s.label}</StatusPill></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "RECIPIENTS" && (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-[#0B2B5E]">
              <Users className="w-4 h-4"/> Daftar Penerima Bantuan
            </div>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left">
                    {["No","No. KK","Nama Penerima","Alamat","Penyaluran","Status"].map((h) => (
                      <th key={h} className="bg-green-200/60 text-[#0B2B5E] font-semibold px-3 py-2 border border-green-300 first:rounded-l-lg last:rounded-r-lg">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    [1,"7324****1204","Ahmad Yani","Jl. Melati No. 12, RT 01/02","Tahap 1","Selesai"],
                    [2,"3601****5678","Siti Aminah","Jl. Mawar No. 8, RT 02/03","Tahap 1","Selesai"],
                    [3,"3601****7890","Ratna Dewi","Jl. Kenanga No. 5, RT 03/03","Tahap 1","Selesai"],
                    [4,"3601****7890","Joko Susilo","Jl. Anggrek No. 15, RT 01/02","Tahap 1","Selesai"],
                    [5,"3601****5436","Siti Nurhayati","Jl. Kemiri 5, RT 03/01","Tahap 1","Selesai"],
                    [6,"3601****2932","Rina Marina","Jl. Mawar 3, RT 05/01","Tahap 1","Selesai"],
                    [7,"3601****9732","Nur Aini","Jl. Kebon 9, RT 04/02","Tahap 1","Selesai"],
                    [8,"3601****7248","Maya Lestari","Jl. Merpati 11, RT 02/01","Tahap 1","Selesai"],
                    [9,"3601****1256","Fitri Handayani","Jl. Flamboyan 4, RT 03/02","Tahap 1","Selesai"],
                    [10,"3601****2523","Dewi Paramita","Jl. Pelita 1, RT 04/01","Tahap 1","Selesai"],
                  ].map((r, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      {r.map((c, idx) => (
                        <td key={idx} className={`px-3 py-3 align-top ${idx===0?"border-l border-slate-200":""} ${idx===5?"border-r border-slate-200":""}`}>{idx===5? <StatusPill color="green">Selesai</StatusPill> : c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pager */}
            <div className="mt-4 flex items-center justify-center gap-3 text-slate-600">
              <button className="rounded-full p-1 hover:bg-slate-100"><ChevronLeft className="w-5 h-5"/></button>
              {[1,2,3,4,5].map(n => (
                <span key={n} className={`w-2 h-2 rounded-full ${n===2?"bg-blue-600":"bg-slate-300"}`}></span>
              ))}
              <button className="rounded-full p-1 hover:bg-slate-100"><ChevronRight className="w-5 h-5"/></button>
            </div>
          </div>
        )}

        {tab === "DOCS" && (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-[#0B2B5E]">
              <ImageIcon className="w-4 h-4"/> Dokumentasi
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl border border-slate-300 bg-slate-100 flex items-center justify-center">
                  <ImageIcon className="w-14 h-14 text-slate-400"/>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

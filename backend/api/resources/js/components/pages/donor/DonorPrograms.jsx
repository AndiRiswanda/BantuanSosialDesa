import React, { useMemo, useState } from "react";
import NavbarDonor from "../../layout/NavbarDonor";
import { Filter, Search, UploadCloud, Info, CalendarDays, BadgeDollarSign, PackageCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadProofModal from "./UploadProofModal";

function StatusPill({ color = "slate", children }) {
  const map = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[color]}`}>{children}</span>
  );
}

function ProgramCard({ title, start, end, type, amount, status, cta, note, progress, onDetail }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="px-4 md:px-5 py-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <h3 className="font-semibold text-[#0B2B5E]">{title}</h3>
          <div className="flex items-center gap-2">
            <StatusPill color={status.color}>{status.label}</StatusPill>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-slate-600 flex-wrap">
          <div className="flex items-center gap-1"><CalendarDays className="w-4 h-4"/>{start}</div>
          <span>—</span>
          <div className="flex items-center gap-1"><CalendarDays className="w-4 h-4"/>{end}</div>
          <StatusPill color="blue">{type}</StatusPill>
        </div>

        {/* Body */}
        <div className="mt-4 bg-slate-100 rounded-lg p-3 flex items-start gap-3">
          <BadgeDollarSign className="w-5 h-5 text-green-700 shrink-0"/>
          <div className="text-sm">
            <div className="font-semibold text-slate-700">Jumlah Donasi</div>
            <div className="text-slate-700">{amount}</div>
          </div>
        </div>

        {note && (
          <div className="mt-3 text-xs text-slate-600 bg-yellow-50 border border-yellow-200 rounded-lg p-2.5 flex items-start gap-2">
            <Info className="w-4 h-4 text-yellow-600 mt-0.5"/>
            <span>{note}</span>
          </div>
        )}

        {typeof progress === 'number' && (
          <div className="mt-4">
            <div className="text-xs text-slate-600 mb-1">Progress Penyaluran</div>
            <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-2 bg-blue-600 rounded-full" style={{width: `${progress}%`}} />
            </div>
            <div className="text-[11px] text-right text-slate-600 mt-1">{progress}%</div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between gap-3 flex-wrap">
          <button onClick={onDetail} className="px-4 py-2 rounded-lg border border-green-600 text-green-700 text-sm font-semibold hover:bg-green-50">
            Detail Program
          </button>
          {cta && (
            <button onClick={cta.onClick} className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700 shadow inline-flex items-center gap-2">
              {cta.icon}
              <span>{cta.label}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DonorPrograms() {
  const navigate = useNavigate();
  const [showUpload, setShowUpload] = useState(false);
  const [activeProgramId, setActiveProgramId] = useState(null);
  // Filters state
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | PENDING | SCHEDULED | COMPLETED
  const [query, setQuery] = useState("");

  // Static sample data to demonstrate filtering
  const programs = useMemo(
    () => [
      {
        id: 1,
        title: "Bantuan Pangan Desa Mandiri",
        start: "1 Oktober 2025",
        end: "30 Desember 2025",
        type: "Uang",
        amount: "Rp. 10.000.000,- (sepuluh juta rupiah)",
        status: "PENDING",
        note: "Menunggu upload bukti transfer",
        ctaKey: "upload",
      },
      {
        id: 2,
        title: "Santunan Biaya Sekolah Anak Yatim",
        start: "1 Januari 2026",
        end: "30 Februari 2026",
        type: "Uang",
        amount: "Rp. 25.000.000,- (dua puluh lima juta rupiah)",
        status: "PENDING",
        note: "Menunggu review admin. Program akan segera aktif setelah disetujui.",
        ctaKey: "view",
      },
      {
        id: 3,
        title: "Pemberdayaan Ibu Rumah Tangga melalui Kebun Sayur",
        start: "1 Oktober 2025",
        end: "30 Desember 2025",
        type: "Barang",
        amount: "Barang (bibit, polybag, pupuk organik)",
        status: "SCHEDULED",
        progress: 20,
      },
      {
        id: 4,
        title: "Bantuan Langsung Tunai (BLT)",
        start: "1 Juli 2025",
        end: "30 Desember 2025",
        type: "Uang",
        amount: "Rp. 150.000.000,- (seratus lima puluh juta rupiah)",
        status: "COMPLETED",
        progress: 100,
      },
    ],
    []
  );

  const statusMeta = {
    PENDING: { label: "Pending", color: "yellow" },
    SCHEDULED: { label: "Terjadwal", color: "blue" },
    COMPLETED: { label: "Selesai", color: "green" },
  };

  // Derived, filtered data
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return programs.filter((p) => {
      const byStatus = statusFilter === "ALL" || p.status === statusFilter;
      const byQuery =
        q === "" ||
        p.title.toLowerCase().includes(q) ||
        p.type.toLowerCase().includes(q);
      return byStatus && byQuery;
    });
  }, [programs, statusFilter, query]);

  const groups = useMemo(
    () => ({
      PENDING: filtered.filter((p) => p.status === "PENDING"),
      SCHEDULED: filtered.filter((p) => p.status === "SCHEDULED"),
      COMPLETED: filtered.filter((p) => p.status === "COMPLETED"),
    }),
    [filtered]
  );

  const pillBase =
    "px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors";
  const pillActive = "bg-green-600 text-white";
  const pillIdle = "bg-slate-100 text-slate-700 hover:bg-slate-200";

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarDonor />

      {/* Page header */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
          <h2 className="text-xl md:text-2xl font-extrabold text-[#0B2B5E] flex items-center gap-2">
            Jejak Program Kebaikan Anda <span role="img" aria-label="sparkles">💖</span>
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            Lihat kembali program-program yang telah Anda dukung. Setiap langkah kecil Anda membantu menghadirkan harapan baru bagi masyarakat desa.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="rounded-2xl border border-slate-200 shadow-sm p-4 md:p-5">
            <div className="flex items-center gap-2 text-slate-700 font-semibold text-sm mb-3"><Filter className="w-4 h-4"/> Filter Status</div>
            <div className="flex flex-wrap gap-2">
              <button
                className={`${pillBase} ${statusFilter === "ALL" ? pillActive : pillIdle}`}
                onClick={() => setStatusFilter("ALL")}
              >
                Semua
              </button>
              <button
                className={`${pillBase} ${statusFilter === "PENDING" ? pillActive : pillIdle}`}
                onClick={() => setStatusFilter("PENDING")}
              >
                Ditunda
              </button>
              <button
                className={`${pillBase} ${statusFilter === "SCHEDULED" ? pillActive : pillIdle}`}
                onClick={() => setStatusFilter("SCHEDULED")}
              >
                Terjadwal
              </button>
              <button
                className={`${pillBase} ${statusFilter === "COMPLETED" ? pillActive : pillIdle}`}
                onClick={() => setStatusFilter("COMPLETED")}
              >
                Selesai
              </button>
            </div>

            <div className="mt-3 relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2"/>
              <input
                className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 text-sm"
                placeholder="Cari Program atau Kategori"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Empty state */}
      {filtered.length === 0 && (
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-10">
            <div className="border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-600">
              Tidak ada program ditemukan.
            </div>
          </div>
        </section>
      )}

      {/* Waiting confirmation */}
      {(statusFilter === "ALL" || statusFilter === "PENDING") && groups.PENDING.length > 0 && (
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h3 className="font-semibold text-[#0B2B5E]">Menunggu Konfirmasi</h3>
            <p className="text-xs text-slate-600 mt-1">
              Donasi Anda telah diajukan dan sedang menunggu konfirmasi. Jika donasi berupa uang, silakan unggah bukti transfer agar cepat diverifikasi.
            </p>

            <div className="mt-4 space-y-4">
              {groups.PENDING.map((p) => (
                <ProgramCard
                  key={p.id}
                  title={p.title}
                  start={p.start}
                  end={p.end}
                  type={p.type}
                  amount={p.amount}
                  status={statusMeta[p.status]}
                  onDetail={() => navigate(`/donor/programku/${p.id}`)}
                  cta={
                    p.ctaKey === "upload"
                      ? {
                          label: "Upload Bukti Transfer",
                          icon: <UploadCloud className="w-4 h-4" />,
                          onClick: () => {
                            setActiveProgramId(p.id);
                            setShowUpload(true);
                          },
                        }
                      : p.ctaKey === "view"
                      ? { label: "Lihat Bukti Transfer", icon: <PackageCheck className="w-4 h-4" /> }
                      : undefined
                  }
                  note={p.note}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* In progress */}
      {(statusFilter === "ALL" || statusFilter === "SCHEDULED") && groups.SCHEDULED.length > 0 && (
        <section className="bg-white">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h3 className="font-semibold text-[#0B2B5E] flex items-center gap-2"><span className="w-2 h-2 bg-green-600 rounded-full"/> Sedang Diproses (Terjadwal)</h3>
            <div className="mt-4 space-y-4">
              {groups.SCHEDULED.map((p) => (
                <ProgramCard
                  key={p.id}
                  title={p.title}
                  start={p.start}
                  end={p.end}
                  type={p.type}
                  amount={p.amount}
                  status={statusMeta[p.status]}
                  progress={p.progress}
                  onDetail={() => navigate(`/donor/programku/${p.id}`)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Completed */}
      {(statusFilter === "ALL" || statusFilter === "COMPLETED") && groups.COMPLETED.length > 0 && (
        <section className="bg-white pb-10">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <h3 className="font-semibold text-[#0B2B5E] flex items-center gap-2"><span className="w-2 h-2 bg-blue-600 rounded-full"/> Sudah Tersalurkan</h3>
            <div className="mt-4 space-y-4">
              {groups.COMPLETED.map((p) => (
                <ProgramCard
                  key={p.id}
                  title={p.title}
                  start={p.start}
                  end={p.end}
                  type={p.type}
                  amount={p.amount}
                  status={statusMeta[p.status]}
                  progress={p.progress}
                  onDetail={() => navigate(`/donor/programku/${p.id}`)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {showUpload && (
        <UploadProofModal
          onClose={() => setShowUpload(false)}
          onSave={(file) => {
            // Placeholder: integrate API upload here
            console.log("Saved proof for program", activeProgramId, file);
            setShowUpload(false);
          }}
        />
      )}
    </div>
  );
}

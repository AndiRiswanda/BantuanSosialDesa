import React, { useMemo, useState, useEffect } from "react";
import NavbarDonatur from "../../layout/NavbarDonatur";
import { Filter, Search, UploadCloud, Info, CalendarDays, BadgeDollarSign, PackageCheck, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import UploadProofModal from "./UploadProofModal";
import api from "../../../services/api";

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
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  // Filters state
  const [statusFilter, setStatusFilter] = useState("ALL"); // ALL | PENDING | SCHEDULED | COMPLETED
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await api.get('/api/donatur/programs');
      console.log('API Response:', response.data); // Debug log
      
      // Laravel pagination returns data in response.data.data
      const programsData = response.data.data || response.data;
      
      // Transform API data to match component format
      const transformedPrograms = programsData.map(program => {
        // Format tanggal dengan safety check
        const startDate = program.tanggal_mulai 
          ? new Date(program.tanggal_mulai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          : '-';
        const endDate = program.tanggal_selesai 
          ? new Date(program.tanggal_selesai).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
          : 'Tidak ditentukan';
        
        // Format jumlah bantuan
        const amount = program.jenis_bantuan === 'uang' 
          ? `Rp ${parseFloat(program.jumlah_bantuan).toLocaleString('id-ID')}`
          : `${parseFloat(program.jumlah_bantuan).toLocaleString('id-ID')} unit`;
        
        // Map status dari database ke UI
        let uiStatus = 'PENDING';
        let statusColor = 'yellow';
        if (program.status === 'aktif') {
          uiStatus = 'SCHEDULED';
          statusColor = 'blue';
        } else if (program.status === 'selesai') {
          uiStatus = 'COMPLETED';
          statusColor = 'green';
        } else if (program.status === 'ditunda') {
          uiStatus = 'PENDING';
          statusColor = 'yellow';
        }
        
        return {
          id: program.id_program,
          title: program.nama_program,
          start: startDate,
          end: endDate,
          type: program.jenis_bantuan === 'uang' ? 'Uang' : 'Barang',
          amount: amount,
          status: uiStatus,
          note: program.status === 'aktif' ? 'Program sedang berjalan' : null,
          ctaKey: 'view',
          progress: program.status === 'selesai' ? 100 : (program.status === 'aktif' ? 50 : 0),
        };
      });
      
      console.log('Transformed Programs:', transformedPrograms); // Debug log
      setPrograms(transformedPrograms);
    } catch (error) {
      console.error('Error fetching programs:', error);
      alert('Gagal memuat program: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <NavbarDonatur />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-slate-600">Memuat program...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarDonatur />

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
                  onDetail={() => navigate(`/donatur/programku/${p.id}`)}
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
                  onDetail={() => navigate(`/donatur/programku/${p.id}`)}
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
                  onDetail={() => navigate(`/donatur/programku/${p.id}`)}
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

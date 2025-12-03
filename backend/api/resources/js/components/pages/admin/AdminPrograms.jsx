import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { Filter, Search, Package, Wallet, BadgeCheck, Loader2 } from "lucide-react";
import { adminAPI } from "../../../utils/api";

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

function ProgramCard({ item, onDetail }) {
  const safeProgress = Math.min(100, Math.max(0, item.statistics?.persentase_selesai || 0));
  
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-slate-900 font-semibold leading-snug">{item.nama_program}</h3>
          <p className="text-xs text-slate-600">Donatur: {item.donatur?.nama_organisasi || item.donatur?.nama_lengkap || '-'}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[11px] font-medium">
              📅 {formatDate(item.tanggal_mulai)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-[11px] font-medium">
              📅 {formatDate(item.tanggal_selesai)}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-0.5 text-[11px] font-semibold">
              {item.kategori?.nama_kategori || '-'}
            </span>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
          item.status === "aktif" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
        }`}>
          {item.status === "aktif" ? "Aktif" : "Nonaktif"}
        </span>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
          {item.jenis_bantuan === "uang" ? (
            <Wallet className="w-4 h-4 text-emerald-600" />
          ) : (
            <Package className="w-4 h-4 text-emerald-600" />
          )}
          Jumlah Bantuan
        </div>
        <p className="mt-1 text-sm text-slate-700">
          {item.jenis_bantuan === "uang" ? formatCurrency(item.jumlah_bantuan) : `${parseInt(item.jumlah_bantuan)} paket`}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-800">Progress Penyaluran</span>
          <span className="text-sm text-slate-700 font-semibold">
            {safeProgress.toFixed(0)}% 
            <span className="text-slate-500 font-normal">
              ({item.statistics?.total_tersalurkan || 0}/{item.statistics?.total_penerima || 0} penerima)
            </span>
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-emerald-600 h-2 rounded-full transition-all" style={{ width: `${safeProgress}%` }} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-end">
        <button 
          onClick={() => onDetail(item.id_program)}
          className="bg-emerald-600 text-white font-semibold px-5 py-2 rounded-lg shadow hover:bg-emerald-700 transition-colors"
        >
          Detail dan Transparansi Program
        </button>
      </div>
    </div>
  );
}

export default function AdminPrograms() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [statusFilter, setStatusFilter] = useState("Semua");
  const [typeFilter, setTypeFilter] = useState("Semua");
  const [query, setQuery] = useState("");

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = {};
      
      if (statusFilter !== "Semua") {
        params.status = statusFilter.toLowerCase();
      }
      if (typeFilter !== "Semua") {
        params.jenis_bantuan = typeFilter.toLowerCase();
      }
      if (query.trim()) {
        params.search = query.trim();
      }
      
      const response = await adminAPI.getPrograms(params);
      console.log("Programs data:", response);
      
      if (response.success && response.data) {
        // Handle both paginated and non-paginated responses
        const programsData = response.data.data || response.data;
        setPrograms(Array.isArray(programsData) ? programsData : []);
      } else {
        setPrograms([]);
      }
    } catch (err) {
      console.error("Error loading programs:", err);
      setError(err.message || "Gagal memuat data program");
      setPrograms([]);
    } finally {
      setLoading(false);
    }
  };

  // Reload when filters change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPrograms();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [statusFilter, typeFilter, query]);

  const filtered = useMemo(() => {
    return programs;
  }, [programs]);

  const handleDetail = (programId) => {
    navigate(`/admin/programs/${programId}`);
  };

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

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <div className="text-red-600">⚠️</div>
            <div>
              <div className="text-red-800 font-semibold">Gagal Memuat Data</div>
              <div className="text-red-700 text-sm">{error}</div>
              <button 
                onClick={loadPrograms}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

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
                {["Semua", "aktif", "nonaktif"].map((s) => (
                  <StatusPill key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
                    {s === "Semua" ? s : s.charAt(0).toUpperCase() + s.slice(1)}
                  </StatusPill>
                ))}
              </div>
            </div>
            {/* Type group */}
            <div>
              <p className="text-sm text-slate-700 mb-2">Jenis Bantuan:</p>
              <div className="flex flex-wrap gap-2">
                <TypePill 
                  icon={Wallet} 
                  label="Uang" 
                  active={typeFilter === "uang"} 
                  onClick={() => setTypeFilter(typeFilter === "uang" ? "Semua" : "uang")} 
                />
                <TypePill 
                  icon={Package} 
                  label="Barang" 
                  active={typeFilter === "barang"} 
                  onClick={() => setTypeFilter(typeFilter === "barang" ? "Semua" : "barang")} 
                />
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

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-slate-600">Memuat data program...</span>
          </div>
        )}

        {/* List */}
        {!loading && (
          <section className="space-y-5">
            {filtered.map((item) => (
              <ProgramCard 
                key={item.id_program} 
                item={item} 
                onDetail={handleDetail}
              />
            ))}
            {filtered.length === 0 && (
              <div className="text-center bg-white rounded-xl shadow-sm border border-slate-200 py-12">
                <Package className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <p className="text-slate-600 text-sm">
                  {query || statusFilter !== "Semua" || typeFilter !== "Semua" 
                    ? "Tidak ada program yang cocok dengan filter." 
                    : "Belum ada program bantuan."}
                </p>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

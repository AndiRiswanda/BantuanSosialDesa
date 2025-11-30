import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { Calendar, Clock4, Filter, Package, Search, Wallet, XCircle, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { adminAPI } from "../../../utils/api";

function Toggle({ active, icon: Icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 w-full sm:w-auto px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
        active ? "bg-emerald-600 text-white border-emerald-600 shadow" : "bg-white text-[#0B2B5E] border-slate-300 hover:bg-slate-50"
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />} {label}
    </button>
  );
}

function Chip({ children, className = "" }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${className}`}>{children}</span>;
}

function ScheduledCard({ item, onDetail }) {
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
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-slate-900 font-semibold leading-snug">{item.nama_program}</h3>
          <p className="text-xs text-slate-600">Donatur: {item.donatur?.nama_organisasi || item.donatur?.nama_lengkap || '-'}</p>
        </div>
        <Chip className="bg-blue-50 text-blue-700 border border-blue-200">
          {item.jenis_bantuan === 'uang' ? 'Uang' : 'Barang'}
        </Chip>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Chip className="bg-slate-100 text-slate-700">📅 {formatDate(item.tanggal_mulai)}</Chip>
        <Chip className="bg-slate-100 text-slate-700">📅 {formatDate(item.tanggal_selesai)}</Chip>
      </div>

      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
        <div className="flex items-center gap-2 text-slate-800 font-medium">
          {item.jenis_bantuan === 'uang' ? <Wallet className="w-4 h-4 text-emerald-600" /> : <Package className="w-4 h-4 text-emerald-600" />}
          Jumlah Donasi
        </div>
        <p className="mt-1 text-slate-700">
          {item.jenis_bantuan === 'uang' ? formatCurrency(item.jumlah_bantuan) : `${parseInt(item.jumlah_bantuan)} paket`}
        </p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-slate-800">Progress Penyaluran</span>
          <span className="text-sm text-slate-700 font-semibold">
            {safeProgress.toFixed(0)}% 
            <span className="text-slate-500 font-normal">
              ({item.statistics?.penerima_selesai || 0}/{item.statistics?.total_penerima || 0} penerima)
            </span>
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${safeProgress}%` }} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <button 
          onClick={() => onDetail(item.id_program)} 
          className="px-4 py-2 rounded-md border border-slate-300 bg-white text-slate-800 font-medium hover:bg-slate-50"
        >
          Detail Program
        </button>
        <button className="px-4 py-2 rounded-md bg-slate-100 text-slate-700 font-semibold border border-slate-200 disabled:opacity-70" disabled>
          Menunggu Semua Tersalurkan
        </button>
      </div>
    </section>
  );
}

function PendingCard({ item, onApprove, onReject, onDetail, onSchedule, onViewProof }) {
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

  // Check if bukti transfer exists
  const hasBuktiTransfer = item.bukti_transfer && item.bukti_transfer.trim() !== '';
  const isUang = item.jenis_bantuan === 'uang';

  return (
    <section className="rounded-xl bg-amber-50 p-5 space-y-4">
      {/* Header - Title and Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-slate-900 font-semibold text-base mb-1">{item.nama_program}</h3>
          <p className="text-sm text-slate-600">Donatur: {item.donatur?.nama_organisasi || item.donatur?.nama_lengkap || '-'}</p>
        </div>
        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold shrink-0">
          {isUang ? 'Uang' : 'Barang'}
        </span>
      </div>

      {/* Dates */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>{formatDate(item.tanggal_mulai)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Calendar className="w-4 h-4 text-blue-600" />
          <span>{formatDate(item.tanggal_selesai)}</span>
        </div>
      </div>

      {/* Donation Amount */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-emerald-600">
          {isUang ? <Wallet className="w-5 h-5" /> : <Package className="w-5 h-5" />}
          <span className="text-sm font-medium">Jumlah Donasi</span>
        </div>
        <p className="text-base font-bold text-slate-900">
          {isUang ? formatCurrency(item.jumlah_bantuan) : `${parseInt(item.jumlah_bantuan)} paket`}
        </p>
      </div>

      {/* Status */}
      <div>
        <span className="inline-block px-4 py-2 bg-white rounded-lg text-sm text-slate-600">
          Menunggu penjadwalan
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => onDetail(item.id_program)}
          className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50"
        >
          Detail Program
        </button>
        {isUang ? (
          !hasBuktiTransfer ? (
            <>
              <button
                disabled
                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-400 text-sm font-semibold cursor-not-allowed"
              >
                Bukti transfer belum ada
              </button>
              <button
                disabled
                className="px-4 py-2 rounded-lg bg-slate-200 text-slate-400 text-sm font-semibold cursor-not-allowed"
              >
                Menunggu upload bukti transfer
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => onViewProof(item.id_program)}
                className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700"
              >
                Lihat Bukti Transfer
              </button>
              <button 
                onClick={() => onSchedule(item.id_program)}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
              >
                Lakukan Penjadwalan dan Aktifkan Donasi
              </button>
            </>
          )
        ) : (
          <button 
            onClick={() => onSchedule(item.id_program)}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
          >
            Lakukan Penjadwalan dan Aktifkan Donasi
          </button>
        )}
        <button 
          onClick={() => onReject(item.id_program)}
          className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
        >
          Tolak
        </button>
      </div>
    </section>
  );
}

export default function AdminDonations() {
  const [tab, setTab] = useState("pending"); // "pending" | "terjadwal"
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingPrograms, setPendingPrograms] = useState([]);
  const [activePrograms, setActivePrograms] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is logged in
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setError('Anda belum login atau token tidak valid.');
        console.error('No auth token found in localStorage');
        return;
      }
      
      console.log('🔐 Auth token exists:', token.substring(0, 20) + '...');
      
      // Load pending programs
      console.log('📋 Fetching pending programs...');
      const pendingResponse = await adminAPI.getPendingPrograms();
      console.log('📋 Pending response:', pendingResponse);
      
      if (pendingResponse.success && pendingResponse.data) {
        const pendingData = pendingResponse.data.data || pendingResponse.data;
        setPendingPrograms(Array.isArray(pendingData) ? pendingData : []);
        console.log('✅ Pending programs loaded:', pendingData.length);
      }
      
      // Load active programs
      console.log('📅 Fetching active programs...');
      const activeResponse = await adminAPI.getPrograms({ status: 'aktif' });
      console.log('📅 Active response:', activeResponse);
      
      if (activeResponse.success && activeResponse.data) {
        const activeData = activeResponse.data.data || activeResponse.data;
        setActivePrograms(Array.isArray(activeData) ? activeData : []);
        console.log('✅ Active programs loaded:', activeData.length);
      }
    } catch (err) {
      console.error("❌ Error loading programs:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response,
        status: err.response?.status
      });
      
      // Handle specific error types
      if (err.response?.status === 401) {
        setError('Anda belum login atau token tidak valid. Silakan login kembali.');
        // Optionally redirect to login
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      } else if (err.response?.status === 403) {
        setError('Anda tidak memiliki akses ke halaman ini.');
      } else {
        setError(err.message || "Gagal memuat data program");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApproveProgram = async (programId) => {
    if (!confirm('Apakah Anda yakin ingin menyetujui program ini?')) return;
    
    try {
      setLoading(true);
      const response = await adminAPI.approveProgram(programId);
      
      if (response.success) {
        alert('Program berhasil disetujui!');
        await loadData(); // Reload data
      }
    } catch (err) {
      console.error("Error approving program:", err);
      alert('Gagal menyetujui program: ' + (err.message || 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  const handleRejectProgram = async (programId) => {
    const reason = prompt('Masukkan alasan penolakan (opsional):');
    if (reason === null) return; // User cancelled
    
    try {
      setLoading(true);
      const response = await adminAPI.rejectProgram(programId, { 
        alasan_penolakan: reason 
      });
      
      if (response.success) {
        alert('Program berhasil ditolak!');
        await loadData(); // Reload data
      }
    } catch (err) {
      console.error("Error rejecting program:", err);
      alert('Gagal menolak program: ' + (err.message || 'Terjadi kesalahan'));
    } finally {
      setLoading(false);
    }
  };

  const handleDetailProgram = (programId) => {
    navigate(`/admin/donasi/${programId}`);
  };

  const handleScheduleProgram = (programId) => {
    navigate(`/admin/donasi/${programId}/jadwal`);
  };

  const handleViewProof = (programId) => {
    // Find program to get bukti_transfer URL
    const program = pendingPrograms.find(p => p.id_program === programId);
    if (program && program.bukti_transfer) {
      // Open bukti transfer in new tab
      window.open(program.bukti_transfer, '_blank');
    } else {
      alert('Bukti transfer tidak ditemukan');
    }
  };

  // Filter by search query
  const filteredPending = pendingPrograms.filter((d) => {
    const q = query.trim().toLowerCase();
    return !q || 
      d.nama_program.toLowerCase().includes(q) || 
      (d.donatur?.nama_organisasi || '').toLowerCase().includes(q) ||
      (d.kategori?.nama_kategori || '').toLowerCase().includes(q);
  });

  const filteredActive = activePrograms.filter((d) => {
    const q = query.trim().toLowerCase();
    return !q || 
      d.nama_program.toLowerCase().includes(q) || 
      (d.donatur?.nama_organisasi || '').toLowerCase().includes(q) ||
      (d.kategori?.nama_kategori || '').toLowerCase().includes(q);
  });

  const list = tab === "pending" ? filteredPending : filteredActive;

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
            <Toggle active={tab === "pending"} icon={Clock4} label={`Pending (${pendingPrograms.length})`} onClick={() => setTab("pending")} />
            <Toggle active={tab === "terjadwal"} icon={Calendar} label={`Terjadwal (${activePrograms.length})`} onClick={() => setTab("terjadwal")} />
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

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12 bg-white rounded-xl border border-green-300">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-2 text-gray-600">Memuat data...</span>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-900">Gagal Memuat Data</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <button 
                onClick={loadData}
                className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* List */}
        {!loading && !error && (
          <div className="space-y-5">
            {list.length === 0 ? (
              <div className="text-center text-slate-600 text-sm py-8 bg-white rounded-xl border border-green-300">
                {query ? "Tidak ada program yang cocok dengan pencarian" : 
                 tab === "pending" ? "Tidak ada program pending" : "Tidak ada program terjadwal"}
              </div>
            ) : (
              list.map((d) =>
                tab === "pending" ? (
                  <PendingCard 
                    key={d.id} 
                    item={d}
                    onApprove={handleApproveProgram}
                    onReject={handleRejectProgram}
                    onDetail={handleDetailProgram}
                    onSchedule={handleScheduleProgram}
                    onViewProof={handleViewProof}
                  />
                ) : (
                  <ScheduledCard 
                    key={d.id} 
                    item={d}
                    onDetail={handleDetailProgram}
                  />
                )
              )
            )}
          </div>
        )}
      </main>
    </div>
  );
}

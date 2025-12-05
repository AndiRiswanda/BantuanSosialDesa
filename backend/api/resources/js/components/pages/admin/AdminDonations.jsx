/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
              ({item.statistics?.total_tersalurkan || 0}/{item.statistics?.total_penerima || 0} penerima)
            </span>
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${safeProgress}%` }} />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 justify-between">
        <button 
          onClick={() => {
            console.log('=== SCHEDULED CARD DETAIL CLICK ===');
            console.log('Program ID:', item.id_program);
            console.log('Program Name:', item.nama_program);
            console.log('Will navigate to: /admin/donasi/' + item.id_program + '/detail-jadwal');
            onDetail(item.id_program);
          }}
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

function RejectedCard({ item, onDetail }) {
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

  const isUang = item.jenis_bantuan === 'uang';

  return (
    <section className="rounded-xl bg-red-50 p-5 space-y-4 border border-red-200">
      {/* Header - Title and Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-slate-900 font-semibold text-base mb-1">{item.nama_program}</h3>
          <p className="text-sm text-slate-600">Donatur: {item.donatur?.nama_organisasi || item.donatur?.nama_lengkap || '-'}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-blue-100 text-blue-700 text-sm font-semibold">
            {isUang ? 'Uang' : 'Barang'}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-red-100 text-red-700 text-sm font-semibold">
            <XCircle className="w-4 h-4" /> Ditolak
          </span>
        </div>
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

      {/* Rejection Reason */}
      {item.alasan_penolakan && (
        <div className="rounded-lg bg-white border border-red-200 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-700 mb-1">Alasan Penolakan:</p>
              <p className="text-sm text-slate-700">{item.alasan_penolakan}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => onDetail(item.id_program)}
          className="px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-800 text-sm font-semibold hover:bg-slate-50"
        >
          Detail Program
        </button>
      </div>
    </section>
  );
}

function CompletedCard({ item, onDetail }) {
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

  const isUang = item.jenis_bantuan === 'uang';

  return (
    <section className="rounded-xl bg-green-50 p-5 space-y-4 border border-green-300">
      {/* Header - Title and Badge */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h3 className="text-slate-900 font-semibold text-base mb-1">{item.nama_program}</h3>
          <p className="text-sm text-slate-600">Donatur: {item.donatur?.nama_organisasi || item.donatur?.nama_lengkap || '-'}</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-600 text-white">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-xs font-semibold">Selesai</span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-slate-500 mb-1">Kategori</p>
          <p className="font-medium text-slate-800">{item.kategori?.nama_kategori || '-'}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-1">Jenis Bantuan</p>
          <p className="font-medium text-slate-800 capitalize">{item.jenis_bantuan}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-1">Tanggal Mulai</p>
          <p className="font-medium text-slate-800">{formatDate(item.tanggal_mulai)}</p>
        </div>
        <div>
          <p className="text-slate-500 mb-1">Tanggal Selesai</p>
          <p className="font-medium text-slate-800">{formatDate(item.tanggal_selesai)}</p>
        </div>
      </div>

      {/* Donation Amount */}
      <div className="rounded-lg bg-white border border-green-200 p-3">
        <p className="text-xs text-slate-600 mb-1">Total Bantuan</p>
        <p className="text-base font-bold text-slate-900">
          {isUang ? formatCurrency(item.jumlah_bantuan) : `${parseInt(item.jumlah_bantuan)} paket`}
        </p>
      </div>

      {/* Success Message */}
      <div className="rounded-lg bg-white border border-green-200 p-3">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-700 mb-1">Program Selesai</p>
            <p className="text-sm text-slate-700">Semua penerima telah diverifikasi dan bantuan telah tersalurkan 100%</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => onDetail(item.id_program || item.id)}
          className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm font-semibold hover:bg-green-700"
        >
          Lihat Detail Program
        </button>
      </div>
    </section>
  );
}

function RejectModal({ open, onClose, onConfirm, programName }) {
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!reason.trim()) {
      alert('Mohon masukkan alasan penolakan');
      return;
    }
    
    setSubmitting(true);
    try {
      await onConfirm(reason);
      setReason('');
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!submitting) {
      setReason('');
      onClose();
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={handleClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Tolak Program Donasi</h3>
            <p className="text-sm text-slate-600">Masukkan alasan penolakan</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-slate-700 mb-3">
            Program: <span className="font-semibold">{programName}</span>
          </p>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Alasan Penolakan <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Contoh: Dokumen tidak lengkap, jumlah donasi tidak sesuai, dll..."
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
            rows="4"
            maxLength="500"
            disabled={submitting}
          />
          <p className="text-xs text-slate-500 mt-1">{reason.length}/500 karakter</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleClose}
            disabled={submitting}
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={submitting || !reason.trim()}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Menolak...' : 'Tolak Program'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDonations() {
  const [tab, setTab] = useState("pending"); // "pending" | "terjadwal" | "ditolak" | "selesai"
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingPrograms, setPendingPrograms] = useState([]);
  const [activePrograms, setActivePrograms] = useState([]);
  const [rejectedPrograms, setRejectedPrograms] = useState([]);
  const [completedPrograms, setCompletedPrograms] = useState([]);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [programToReject, setProgramToReject] = useState(null);

  useEffect(() => {
    console.log('🔄 Component mounted or location.state changed');
    loadData();
    
    // Check if we're coming back from scheduling page
    if (location.state?.switchToTab) {
      console.log('🔄 Switching to tab:', location.state.switchToTab);
      setTab(location.state.switchToTab);
      // Clear the state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  // Add window focus listener separately to avoid infinite loop
  useEffect(() => {
    const handleFocus = () => {
      console.log('🔄 Window focused, reloading data...');
      loadData();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
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
      
      // Load active programs (terjadwal)
      console.log('📅 Fetching active/scheduled programs...');
      const activeResponse = await adminAPI.getScheduledPrograms({ per_page: 100 });
      console.log('📅 Active response:', activeResponse);
      console.log('📅 Active response structure:', {
        success: activeResponse.success,
        hasData: !!activeResponse.data,
        dataKeys: activeResponse.data ? Object.keys(activeResponse.data) : [],
        dataType: typeof activeResponse.data
      });
      
      if (activeResponse.success && activeResponse.data) {
        // Handle paginated response
        let activeData;
        if (activeResponse.data.data) {
          // Paginated response
          activeData = activeResponse.data.data;
          console.log('📅 Paginated data detected, total:', activeResponse.data.total);
        } else if (Array.isArray(activeResponse.data)) {
          // Direct array response
          activeData = activeResponse.data;
        } else {
          activeData = [];
        }
        
        setActivePrograms(Array.isArray(activeData) ? activeData : []);
        console.log('✅ Active/scheduled programs loaded:', activeData.length);
        console.log('✅ Sample active program:', activeData[0]);
      }

      // Load rejected programs
      console.log('🚫 Fetching rejected programs...');
      const rejectedResponse = await adminAPI.getRejectedPrograms();
      console.log('🚫 Rejected response:', rejectedResponse);
      
      if (rejectedResponse.success && rejectedResponse.data) {
        const rejectedData = rejectedResponse.data.data || rejectedResponse.data;
        setRejectedPrograms(Array.isArray(rejectedData) ? rejectedData : []);
        console.log('✅ Rejected programs loaded:', rejectedData.length);
      }

      // Load completed programs
      console.log('✅ Fetching completed programs...');
      const completedResponse = await adminAPI.getCompletedPrograms();
      console.log('✅ Completed response:', completedResponse);
      
      if (completedResponse.success && completedResponse.data) {
        const completedData = completedResponse.data.data || completedResponse.data;
        setCompletedPrograms(Array.isArray(completedData) ? completedData : []);
        console.log('✅ Completed programs loaded:', completedData.length);
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

  // New handlers for rejection modal
  const handleRejectClick = (programId, programName) => {
    setProgramToReject({ id: programId, name: programName });
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (reason) => {
    if (!programToReject) return;
    
    try {
      const response = await adminAPI.rejectProgram(programToReject.id, { 
        alasan_penolakan: reason 
      });
      
      if (response.success) {
        setRejectModalOpen(false);
        setProgramToReject(null);
        alert('Program berhasil ditolak!');
        await loadData(); // Reload data
      }
    } catch (err) {
      console.error("Error rejecting program:", err);
      alert('Gagal menolak program: ' + (err.message || 'Terjadi kesalahan'));
      throw err; // Let modal handle loading state
    }
  };

  const handleDetailProgram = (programId) => {
    navigate(`/admin/donasi/${programId}`);
  };

  const handleScheduledProgramDetail = (programId) => {
    console.log('=== HANDLE SCHEDULED PROGRAM DETAIL ===');
    console.log('Program ID:', programId);
    console.log('Navigating to:', `/admin/donasi/${programId}/detail-jadwal`);
    navigate(`/admin/donasi/${programId}/detail-jadwal`);
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
  const filteredPending = pendingPrograms.filter(d => {
    const q = query.trim().toLowerCase();
    return !q || 
      d.nama_program.toLowerCase().includes(q) || 
      (d.donatur?.nama_organisasi || '').toLowerCase().includes(q) ||
      (d.kategori?.nama_kategori || '').toLowerCase().includes(q);
  });

  const filteredActive = activePrograms.filter(d => {
    const q = query.trim().toLowerCase();
    return !q || 
      d.nama_program.toLowerCase().includes(q) || 
      (d.donatur?.nama_organisasi || '').toLowerCase().includes(q) ||
      (d.kategori?.nama_kategori || '').toLowerCase().includes(q);
  });

  const filteredRejected = rejectedPrograms.filter(d => {
    const q = query.trim().toLowerCase();
    return !q || 
      d.nama_program.toLowerCase().includes(q) || 
      (d.donatur?.nama_organisasi || '').toLowerCase().includes(q) ||
      (d.kategori?.nama_kategori || '').toLowerCase().includes(q);
  });

  const filteredCompleted = completedPrograms.filter(d => {
    const q = query.trim().toLowerCase();
    return !q || 
      d.nama_program.toLowerCase().includes(q) || 
      (d.donatur?.nama_organisasi || '').toLowerCase().includes(q) ||
      (d.kategori?.nama_kategori || '').toLowerCase().includes(q);
  });

  const list = tab === "pending" ? filteredPending : 
               tab === "terjadwal" ? filteredActive : 
               tab === "ditolak" ? filteredRejected : 
               filteredCompleted;

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
            <Toggle active={tab === "selesai"} icon={CheckCircle2} label={`Selesai (${completedPrograms.length})`} onClick={() => setTab("selesai")} />
            <Toggle active={tab === "ditolak"} icon={XCircle} label={`Ditolak (${rejectedPrograms.length})`} onClick={() => setTab("ditolak")} />
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
                 tab === "pending" ? "Tidak ada program pending" : 
                 tab === "terjadwal" ? "Tidak ada program terjadwal" :
                 tab === "selesai" ? "Tidak ada program yang selesai" :
                 "Tidak ada program yang ditolak"}
              </div>
            ) : (
              list.map((d) =>
                tab === "pending" ? (
                  <PendingCard 
                    key={d.id} 
                    item={d}
                    onApprove={handleApproveProgram}
                    onReject={(id) => handleRejectClick(id, d.nama_program)}
                    onDetail={handleDetailProgram}
                    onSchedule={handleScheduleProgram}
                    onViewProof={handleViewProof}
                  />
                ) : tab === "terjadwal" ? (
                  <ScheduledCard 
                    key={d.id_program || d.id} 
                    item={d}
                    onDetail={handleScheduledProgramDetail}
                  />
                ) : tab === "selesai" ? (
                  <CompletedCard
                    key={d.id_program || d.id}
                    item={d}
                    onDetail={handleScheduledProgramDetail}
                  />
                ) : (
                  <RejectedCard
                    key={d.id_program || d.id}
                    item={d}
                    onDetail={handleDetailProgram}
                  />
                )
              )
            )}
          </div>
        )}
      </main>

      {/* Reject Modal */}
      <RejectModal
        open={rejectModalOpen}
        onClose={() => {
          setRejectModalOpen(false);
          setProgramToReject(null);
        }}
        onConfirm={handleConfirmReject}
        programName={programToReject?.name}
      />
    </div>
  );
}

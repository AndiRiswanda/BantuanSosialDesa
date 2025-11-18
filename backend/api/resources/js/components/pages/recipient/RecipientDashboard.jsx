import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarRecipient from "../../layout/NavbarRecipient";
import { BadgeCheck, Package, Wallet, AlertTriangle } from "lucide-react";
import { recipientAPI } from "../../../utils/api";

function InfoPill({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 px-2.5 py-0.5 text-xs font-medium">
      {children}
    </span>
  );
}

function StatusTag({ status }) {
  const map = {
    Terjadwal: "bg-amber-100 text-amber-800",
    Selesai: "bg-emerald-100 text-emerald-800",
    Aktif: "bg-blue-100 text-blue-800",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${map[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}

function RecipientProgramCard({ program, navigate }) {
  const { id, title, donor, status, type, start, end, amount, goods, progress, latest_transaction } = program;
  
  const getStatusColor = () => {
    switch (status) {
      case 'menunggu': return 'bg-amber-100 text-amber-800'; // Program aktif/terjadwal
      case 'selesai': return 'bg-emerald-100 text-emerald-800';
      case 'batal': return 'bg-rose-100 text-rose-800';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'menunggu': return 'Terjadwal'; // Program aktif yang sedang berjalan
      case 'selesai': return 'Selesai';
      case 'batal': return 'Dibatalkan';
      default: return status;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-slate-900 font-semibold leading-snug">{title}</h3>
          <p className="text-xs text-slate-600">Donatur: {donor}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <InfoPill>
              <span role="img" aria-label="tanggal">📅</span> {start}
            </InfoPill>
            <InfoPill>
              <span role="img" aria-label="tanggal">📅</span> {end}
            </InfoPill>
            <InfoPill>{type}</InfoPill>
          </div>
        </div>
        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${getStatusColor()}`}>
          {getStatusText()}
        </span>
      </div>

      {/* Donation summary */}
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
        <div className="flex items-center gap-2 text-sm font-medium text-slate-800">
          {type === "Uang" ? <Wallet className="w-4 h-4 text-emerald-600" /> : <Package className="w-4 h-4 text-emerald-600" />} 
          Jumlah Donasi
        </div>
        <p className="mt-1 text-sm text-slate-700">
          {type === "Uang" ? amount : `Barang: ${goods || 'N/A'}`}
        </p>
      </div>

      {/* Latest transaction */}
      {latest_transaction && (
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800 mb-2">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            Transaksi Penyaluran Terakhir
          </div>
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-xs text-slate-600">Tanggal</div>
                <div className="font-medium">{latest_transaction.date}</div>
              </div>
              <div>
                <div className="text-xs text-slate-600">Waktu</div>
                <div className="font-medium">{latest_transaction.time}</div>
              </div>
              <div>
                <div className="text-xs text-slate-600">Lokasi</div>
                <div className="font-medium">{latest_transaction.location}</div>
              </div>
              <div>
                <div className="text-xs text-slate-600">Jumlah Diterima</div>
                <div className="font-medium">
                  {type === "Uang" 
                    ? `Rp ${latest_transaction.amount?.toLocaleString('id-ID')}`
                    : `${latest_transaction.amount} paket`
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Progress */}
      {progress !== undefined && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-slate-800">Progress Penyaluran</span>
            <span className="text-sm text-slate-700 font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-emerald-600 h-2 rounded-full transition-all" 
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }} 
            />
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button 
          onClick={() => navigate && navigate(`/penerima/program/${id}`)}
          className="bg-white text-slate-800 font-medium px-5 py-2 rounded-lg shadow-sm border border-slate-200 hover:bg-slate-50 hover:shadow transition-colors"
        >
          Detail Program
        </button>
      </div>
    </div>
  );
}

export default function RecipientDashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    console.log('=== RECIPIENT DASHBOARD MOUNTED - BUILD v3 ===');
    console.log('Timestamp:', new Date().toISOString());
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      console.log('Fetching dashboard...');
      setLoading(true);
      setError(null);
      const response = await recipientAPI.getDashboard();
      console.log('Dashboard API response:', response);
      
      if (response && response.success) {
        console.log('Setting dashboard data:', response);
        setDashboardData(response);
      } else {
        console.error('API response not successful:', response);
        setError('Gagal memuat data dashboard - Response tidak valid');
      }
    } catch (err) {
      console.error('Error fetching dashboard:', err);
      setError(err.message || 'Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
        <NavbarRecipient />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Memuat dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
        <NavbarRecipient />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto" />
            <p className="mt-4 text-slate-600">{error}</p>
            <button 
              onClick={fetchDashboard}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Coba Lagi
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { user, stats, recent_programs } = dashboardData;
  const programs = recent_programs || [];

  const getStatusBadge = () => {
    switch (user.status_verifikasi) {
      case 'disetujui':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold">
            <BadgeCheck className="w-3 h-3" /> Anda Terdaftar Untuk Dapat Menerima Bantuan
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold">
            Menunggu Verifikasi
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarRecipient />

      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        {/* Greeting */}
        <section className="bg-white/80 border border-blue-200 rounded-lg shadow-sm px-4 py-4 sm:px-6 sm:py-5 mb-6">
          <h2 className="text-[#0B2B5E] font-semibold text-lg sm:text-xl">
            Selamat Datang Kembali, {user.name}
          </h2>
          <div className="mt-3 flex items-center gap-2 text-sm text-slate-700">
            <BadgeCheck className="w-4 h-4 text-emerald-600" />
            Status Penerimaan Anda:
            {getStatusBadge()}
          </div>
        </section>

        {/* Section title */}
        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-[#0B2B5E] font-semibold">Program Bantuan yang Diterima</h3>
        </div>

        {/* Program list */}
        <div className="space-y-6">
          {programs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-600">Belum ada program yang diikuti</p>
            </div>
          ) : (
            programs.map((p, idx) => (
              <RecipientProgramCard key={idx} program={p} navigate={navigate} />
            ))
          )}
        </div>
      </main>
    </div>
  );
}

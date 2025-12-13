/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../layout/NavbarAdmin";
import heroIcon from "../../../assets/Icon.png";
import { Users2, HandCoins, ClipboardList, CheckCircle2, Clock4, TrendingUp, Package } from "lucide-react";
import { adminAPI } from "../../../utils/api";

function StatCard({ icon: Icon, label, value, accent = "emerald", loading = false }) {
  const accentMap = {
    emerald: "text-emerald-700 border-emerald-200",
    blue: "text-blue-700 border-blue-200",
    violet: "text-violet-700 border-violet-200",
    amber: "text-amber-700 border-amber-200",
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className={`w-10 h-10 rounded-lg bg-slate-50 border ${accentMap[accent]} flex items-center justify-center mb-2`}>
        <Icon className={`w-5 h-5 ${accentMap[accent].split(" ")[0]}`} />
      </div>
      {loading ? (
        <div className="animate-pulse">
          <div className="h-6 bg-slate-200 rounded w-20 mb-1"></div>
          <div className="h-4 bg-slate-100 rounded w-24"></div>
        </div>
      ) : (
        <>
          <div className="text-slate-800 text-lg font-bold">{value}</div>
          <div className="text-slate-600 text-sm">{label}</div>
        </>
      )}
    </div>
  );
}


// Custom AttentionCard for dashboard as per design
function AttentionCard({ icon, title, count, description, buttonLabel, onClick, loading = false }) {
  return (
    <div className="bg-[#FFF7DF] border-2 border-[#A97A2C] rounded-xl p-6 flex flex-col items-center text-center min-w-[320px]">
      <div className="flex items-center justify-center mb-2">
        <span className="inline-flex items-center justify-center w-16 h-16 rounded-full border-2 border-[#A97A2C] bg-white">
          {icon}
        </span>
      </div>
      <div className="font-bold text-xl text-[#2D2A26] mb-1">{title}</div>
      <div className="text-3xl font-bold text-[#2D2A26] mb-1">{loading ? '...' : count}</div>
      <div className="text-[#2D2A26] text-base mb-4">{description}</div>
      <button
        onClick={onClick}
        className="w-full mt-2 px-6 py-3 rounded-xl bg-[#4CAF50] text-white text-lg font-semibold hover:bg-[#388E3C] transition-colors"
      >
        {buttonLabel}
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      console.log("Dashboard data:", response);
      setDashboardData(response);
      setError(null);
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError(err.message || "Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const stats = dashboardData?.stats || {};

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarAdmin />

      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        {/* Welcome */}
        <section className="bg-white/90 border border-blue-200 rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-start gap-3">
            <img src={heroIcon} alt="Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-[#0B2B5E] font-semibold text-lg sm:text-2xl">Selamat Datang, Admin</h1>
              <p className="text-sm text-slate-700">Pantau seluruh aktivitas bantuan desa di sini.</p>
            </div>
          </div>
        </section>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <div className="text-red-600">⚠️</div>
            <div>
              <div className="text-red-800 font-semibold">Gagal Memuat Data</div>
              <div className="text-red-700 text-sm">{error}</div>
              <button 
                onClick={loadDashboardData}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {/* Summary */}
        <section className="rounded-xl bg-green-100/70 border border-green-300 p-4 sm:p-6 mb-6">
          <h2 className="text-center text-[#0B2B5E] font-bold text-3xl mb-4">Ringkasan Singkat Sistem</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
                <HandCoins className="w-5 h-5 text-emerald-700" /> Total Bantuan Uang
              </div>
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-6 bg-slate-200 rounded w-32 mb-1"></div>
                  <div className="h-4 bg-slate-100 rounded w-24"></div>
                </div>
              ) : (
                <>
                  <div className="text-[#0B2B5E] font-extrabold text-lg">
                    {formatCurrency(stats.total_bantuan_uang || 0)}
                  </div>
                  <div className="text-slate-600 text-xs mt-1">
                    + {parseInt(stats.total_bantuan_barang || 0)} paket barang
                  </div>
                </>
              )}
            </div>
            <StatCard 
              icon={ClipboardList} 
              label="Total Program" 
              value={loading ? "..." : stats.total_programs || 0}
              accent="blue"
              loading={loading}
            />
            <StatCard 
              icon={Users2} 
              label="Total Donatur" 
              value={loading ? "..." : stats.total_donors || 0}
              accent="emerald"
              loading={loading}
            />
            <StatCard 
              icon={Users2} 
              label="Total Penerima" 
              value={loading ? "..." : stats.total_recipients || 0}
              accent="violet"
              loading={loading}
            />
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
            <StatCard 
              icon={CheckCircle2} 
              label="Program Aktif" 
              value={loading ? "..." : stats.active_programs || 0}
              accent="emerald"
              loading={loading}
            />
            <StatCard 
              icon={TrendingUp} 
              label="Penyaluran Selesai" 
              value={loading ? "..." : stats.completed_distributions || 0}
              accent="blue"
              loading={loading}
            />
            <StatCard 
              icon={Package} 
              label="Penyaluran Terjadwal" 
              value={loading ? "..." : stats.pending_distributions || 0}
              accent="amber"
              loading={loading}
            />
          </div>
        </section>

        {/* Attention */}
        <section>
          <h3 className="text-center text-[#19325C] font-bold text-3xl mb-8">Perlu Diperhatikan</h3>
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 mb-8">
            <AttentionCard
              icon={<Clock4 className="w-14 h-14 text-[#A97A2C]" />}
              title="Donasi Masuk"
              count={loading ? '...' : stats.pending_donations || 0}
              description="Pengajuan menunggu penjadwalan untuk diaktifkan"
              buttonLabel="Jadwalkan dan Aktifkan Program Donasi"
              onClick={() => navigate('/admin/donasi')}
              loading={loading}
            />
            <AttentionCard
              icon={<Clock4 className="w-14 h-14 text-[#A97A2C]" />}
              title="Pengajuan Penerimaan"
              count={loading ? '...' : stats.pending_recipient_applications || 0}
              description="Pengajuan menunggu verifikasi"
              buttonLabel="Verifikasi Pengajuan Penerimaan"
              onClick={() => navigate('/admin/verifikasi')}
              loading={loading}
            />
          </div>
        </section>

        {/* Recent Activity Preview */}
        {!loading && dashboardData?.recent_programs && (
          <section className="mt-6">
            <h3 className="text-center text-[#0B2B5E] font-bold text-3xl mb-4">Program Terbaru</h3>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="space-y-3">
                {dashboardData.recent_programs.slice(0, 5).map((program) => (
                  <div key={program.id} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800 text-sm">{program.nama_program}</div>
                      <div className="text-xs text-slate-600">
                        {program.donatur} • {program.kategori} • {program.status}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-emerald-600">
                        {program.jenis_bantuan === 'uang' ? formatCurrency(program.jumlah_bantuan) : `${parseInt(program.jumlah_bantuan)} paket`}
                      </div>
                      <div className="text-xs text-slate-500">{program.tanggal_mulai}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

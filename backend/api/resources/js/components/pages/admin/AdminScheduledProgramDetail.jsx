import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { ArrowLeft, Calendar, Wallet, Package, Clock, MapPin, Users, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { adminAPI } from "../../../utils/api";

export default function AdminScheduledProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadProgramDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load program detail
      const programResponse = await adminAPI.getProgramDetail(id);
      console.log("Program detail:", programResponse);
      setProgram(programResponse.data || programResponse);
      
      // Load schedules
      const schedulesResponse = await adminAPI.getSchedules(id);
      console.log("Schedules:", schedulesResponse);
      setSchedules(schedulesResponse.schedules || []);
      
    } catch (err) {
      console.error("Error loading program detail:", err);
      setError(err.message || "Gagal memuat detail program");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProgramDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

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
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
        <NavbarAdmin />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-slate-600">Memuat detail program...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
        <NavbarAdmin />
        <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Gagal Memuat Data</h3>
                <p className="text-red-700">{error || "Program tidak ditemukan"}</p>
                <button 
                  onClick={() => navigate('/admin/donasi')}
                  className="mt-3 text-sm text-red-600 hover:text-red-700 underline"
                >
                  Kembali ke Daftar Donasi
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const isUang = program.jenis_bantuan === 'uang';
  const safeProgress = Math.min(100, Math.max(0, program.statistics?.persentase_selesai || 0));

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarAdmin />

      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/admin/donasi')}
            className="flex items-center gap-2 text-slate-700 hover:text-slate-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Daftar Donasi</span>
          </button>
        </div>

        {/* Program Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6 mb-6">
          {/* Title and Status */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-slate-900">
                  {program.nama_program}
                </h1>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-emerald-100 text-emerald-700 text-sm font-semibold">
                  <CheckCircle className="w-4 h-4" />
                  Aktif & Terjadwal
                </span>
              </div>
              <p className="text-slate-600">
                Donatur: {program.donatur?.nama_organisasi || program.donatur?.nama_lengkap || '-'}
              </p>
            </div>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-700 font-semibold shrink-0">
              {isUang ? <Wallet className="w-5 h-5" /> : <Package className="w-5 h-5" />}
              {isUang ? 'Uang' : 'Barang'}
            </span>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-700">{formatDate(program.tanggal_mulai)}</span>
            </div>
            <span className="text-slate-400">—</span>
            <div className="flex items-center gap-2 px-3 py-2 bg-slate-100 rounded-lg">
              <Calendar className="w-4 h-4 text-slate-600" />
              <span className="text-sm text-slate-700">{formatDate(program.tanggal_selesai)}</span>
            </div>
          </div>

          {/* Donation Amount */}
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-slate-600 mb-2">
              {isUang ? <Wallet className="w-5 h-5" /> : <Package className="w-5 h-5" />}
              <span className="font-medium">Jumlah Donasi</span>
            </div>
            <p className="text-xl font-bold text-slate-900">
              {isUang 
                ? formatCurrency(program.jumlah_bantuan)
                : `${parseInt(program.jumlah_bantuan)} paket`
              }
            </p>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-800">Progress Penyaluran</span>
              <span className="text-sm text-slate-700 font-semibold">
                {safeProgress.toFixed(0)}% 
                <span className="text-slate-500 font-normal ml-1">
                  ({program.statistics?.penerima_selesai || 0}/{program.statistics?.total_penerima || 0} penerima)
                </span>
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5">
              <div className="bg-emerald-600 h-2.5 rounded-full transition-all" style={{ width: `${safeProgress}%` }} />
            </div>
          </div>
        </div>

        {/* Schedules */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Jadwal Penyaluran</h2>
          
          {schedules.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500">Belum ada jadwal penyaluran</p>
            </div>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule, idx) => (
                <div key={idx} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">{schedule.date}</span>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">{schedule.time}</span>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-slate-600">
                      <Users className="w-4 h-4 inline mr-1" />
                      {schedule.total_recipients} penerima
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-slate-700 mb-3">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm font-medium">{schedule.location}</span>
                  </div>
                  
                  {schedule.note && (
                    <div className="text-sm text-slate-600 mb-3 pl-6">
                      <span className="font-medium">Catatan: </span>{schedule.note}
                    </div>
                  )}
                  
                  {/* Recipients List */}
                  <div className="mt-3 pt-3 border-t border-slate-300">
                    <p className="text-sm font-medium text-slate-700 mb-2">Daftar Penerima:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {schedule.recipients?.map((recipient, rIdx) => (
                        <div key={rIdx} className="text-sm text-slate-600 bg-white rounded px-3 py-2 border border-slate-200">
                          <div className="font-medium text-slate-800">{recipient.name}</div>
                          <div className="text-xs text-slate-500">
                            No KK: {recipient.kk} • {recipient.address}
                          </div>
                          <div className="text-xs mt-1">
                            <span className={`inline-block px-2 py-0.5 rounded ${
                              recipient.status === 'selesai' 
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-amber-100 text-amber-700'
                            }`}>
                              {recipient.status === 'selesai' ? 'Selesai' : 'Dijadwalkan'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Program Description */}
        {program.deskripsi && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Deskripsi Program</h2>
            <p className="text-slate-700 leading-relaxed">{program.deskripsi}</p>
          </div>
        )}

        {/* Kriteria Penerima */}
        {program.kriteria_penerima && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Kriteria Penerima</h2>
            <p className="text-slate-700 leading-relaxed">{program.kriteria_penerima}</p>
          </div>
        )}

        {/* Keterangan Penerima */}
        {program.keterangan && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mt-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Keterangan Penerima</h2>
            <p className="text-slate-700 leading-relaxed">{program.keterangan}</p>
          </div>
        )}
      </main>
    </div>
  );
}

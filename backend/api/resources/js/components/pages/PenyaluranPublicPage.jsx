/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import api from "../../utils/api";

// Add inline styles for animation
const modalStyles = `
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }
  .animate-fade-in {
    animation: fadeIn 0.3s ease-out;
  }
`;

export default function PenyaluranPublicPage() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showCheckStatusModal, setShowCheckStatusModal] = useState(false);
  const [showTransparencyModal, setShowTransparencyModal] = useState(false);

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public/programs/schedules');
      const data = await response.json();
      
      if (data.success && data.data) {
        setPrograms(data.data);
      } else {
        setError('Gagal memuat data program');
      }
    } catch (err) {
      console.error("Error loading programs:", err);
      setError(err.message || "Gagal memuat data program");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getStatusBadge = (status) => {
    if (status === 'selesai') {
      return { bg: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-300', label: '✓ Selesai' };
    }
    return { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300', label: 'Terjadwal' };
  };

  const totalPages = programs.length;
  const currentProgram = programs[currentPage - 1];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-slate-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error || programs.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-amber-600 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Tidak Ada Program Aktif</h2>
          <p className="text-slate-600 text-center">{error || 'Belum ada program bantuan yang aktif.'}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{modalStyles}</style>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-100 to-blue-50 border-b-2 border-blue-200 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center gap-3">
            <div className="bg-white p-3 rounded-xl shadow-md">
              <Calendar className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              Detail Jadwal Penyaluran Program Bantuan Desa
            </h1>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {currentProgram && (
          <>
            {/* Unified Program Card with Schedule */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 overflow-hidden">
              {/* Program Info Section */}
              <div className="p-6 border-b-2 border-slate-200">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-5">
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">
                      {currentProgram.nama_program}
                    </h2>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {currentProgram.deskripsi}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-emerald-100 text-emerald-700 border border-emerald-300">
                      Aktif
                    </span>
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-300">
                      {currentProgram.jenis_bantuan === 'uang' ? 'Uang' : 'Barang'}
                    </span>
                  </div>
                </div>

                {/* Button - Above Progress */}
                <div className="mb-4">
                  <button 
                    onClick={() => setShowCheckStatusModal(true)}
                    className="px-5 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
                  >
                    Cek Status Penerima Bantuan
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-slate-700">Progress Penyaluran</span>
                    <span className="text-sm font-bold text-slate-800">
                      {currentProgram.progress_percentage}% ({currentProgram.completed_recipients}/{currentProgram.jumlah_penerima} KK)
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 shadow-inner"
                      style={{ width: `${currentProgram.progress_percentage}%` }}
                    />
                  </div>
                </div>

                {/* Transparency Button */}
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => setShowTransparencyModal(true)}
                    className="px-6 py-2 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors shadow-md"
                  >
                    Lihat Transparansi Lengkap
                  </button>
                </div>
              </div>

              {/* Schedule Table Section */}
              <div className="px-6 py-4 bg-slate-50 border-b-2 border-slate-200">
                <h3 className="text-lg font-bold text-slate-800">Jadwal Penyaluran</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead className="bg-emerald-600">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase">
                        Tanggal
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase">
                        Lokasi Penyebaran
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase">
                        Jam Pengambilan
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-bold text-white uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {currentProgram.schedules.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                          Belum ada jadwal penyaluran.
                        </td>
                      </tr>
                    ) : (
                      currentProgram.schedules.map((schedule) => {
                        const statusConfig = getStatusBadge(schedule.status);
                        return (
                          <tr key={schedule.id_transaksi} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4 text-sm font-medium text-slate-800">
                              {formatDate(schedule.tanggal)}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-700">
                              {schedule.lokasi}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm font-medium text-slate-700">
                                {schedule.jam_mulai} - {schedule.jam_selesai}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text} border ${statusConfig.border}`}>
                                {statusConfig.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-slate-50 border-t-2 border-slate-200 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-blue-600" />
                  </button>

                  {[...Array(totalPages)].map((_, index) => {
                    const page = index + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`w-10 h-10 rounded-full font-semibold transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-white text-blue-600 hover:bg-blue-50 border-2 border-slate-300'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-blue-600" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Modal - Check Status */}
      {showCheckStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
            <button
              onClick={() => setShowCheckStatusModal(false)}
              className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all border-2 border-slate-800"
            >
              <X className="w-7 h-7 text-slate-800 font-bold" strokeWidth={3} />
            </button>

            <div className="text-center mb-6">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FF6B35" />
                      <stop offset="100%" stopColor="#F7931E" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M100 20 L160 50 L160 110 Q160 150 100 180 Q40 150 40 110 L40 50 Z" 
                    fill="url(#shieldGradient)" 
                    stroke="#fff" 
                    strokeWidth="4"
                  />
                  <text x="100" y="120" fontSize="80" fontWeight="bold" fill="white" textAnchor="middle">!</text>
                </svg>
                
                {/* Decorative people illustrations */}
                <div className="absolute -left-8 bottom-0 w-16 h-20 bg-purple-400 rounded-t-full"></div>
                <div className="absolute -left-8 bottom-0 w-16 h-8 bg-purple-300 rounded-lg"></div>
                <div className="absolute -right-8 bottom-0 w-16 h-20 bg-pink-200 rounded-t-full"></div>
                <div className="absolute -right-8 bottom-0 w-16 h-10 bg-gray-100 rounded-lg"></div>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                Ingin mengetahui apakah Anda terdaftar sebagai penerima program ini?
              </h2>
              <p className="text-slate-700 text-base leading-relaxed">
                Login untuk mengecek status dan jadwal penyaluran Anda.
              </p>
            </div>

            <button className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              Login untuk Cek Status
            </button>
          </div>
        </div>
      )}

      {/* Modal - Transparency */}
      {showTransparencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
            <button
              onClick={() => setShowTransparencyModal(false)}
              className="absolute top-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-100 transition-all border-2 border-slate-800"
            >
              <X className="w-7 h-7 text-slate-800 font-bold" strokeWidth={3} />
            </button>

            <div className="text-center mb-6">
              <div className="w-32 h-32 mx-auto mb-6 relative">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  <defs>
                    <linearGradient id="shieldGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#FF6B35" />
                      <stop offset="100%" stopColor="#F7931E" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M100 20 L160 50 L160 110 Q160 150 100 180 Q40 150 40 110 L40 50 Z" 
                    fill="url(#shieldGradient2)" 
                    stroke="#fff" 
                    strokeWidth="4"
                  />
                  <text x="100" y="120" fontSize="80" fontWeight="bold" fill="white" textAnchor="middle">!</text>
                </svg>
                
                {/* Decorative people illustrations */}
                <div className="absolute -left-8 bottom-0 w-16 h-20 bg-purple-400 rounded-t-full"></div>
                <div className="absolute -left-8 bottom-0 w-16 h-8 bg-purple-300 rounded-lg"></div>
                <div className="absolute -right-8 bottom-0 w-16 h-20 bg-pink-200 rounded-t-full"></div>
                <div className="absolute -right-8 bottom-0 w-16 h-10 bg-gray-100 rounded-lg"></div>
              </div>

              <h2 className="text-2xl font-bold text-slate-800 mb-3">
                Ingin melihat transparansi penyaluran bantuan di desa Anda?
              </h2>
              <p className="text-slate-700 text-base leading-relaxed">
                Login dahulu untuk mengakses transparansi program secara lengkap.
              </p>
            </div>

            <button className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-lg font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105">
              Login untuk Lihat Transparansi
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}

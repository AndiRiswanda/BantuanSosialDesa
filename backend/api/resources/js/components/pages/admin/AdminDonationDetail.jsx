import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { ArrowLeft, Calendar, Wallet, Package, Image, XCircle, Loader2, AlertCircle } from "lucide-react";
import { adminAPI } from "../../../utils/api";

export default function AdminDonationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showProofModal, setShowProofModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  const loadProgramDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getProgramDetail(id);
      console.log("Program detail:", response);
      setProgram(response.data || response);
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

  const handleReject = async () => {
    const reason = prompt('Masukkan alasan penolakan (opsional):');
    if (reason === null) return;
    
    try {
      setProcessing(true);
      await adminAPI.rejectProgram(id, { reason });
      alert('Program berhasil ditolak');
      navigate('/admin/donasi');
    } catch (err) {
      console.error('Error rejecting program:', err);
      alert('Gagal menolak program: ' + (err.message || 'Terjadi kesalahan'));
    } finally {
      setProcessing(false);
    }
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

  const hasBuktiTransfer = program.bukti_transfer && program.bukti_transfer.trim() !== '';
  const isUang = program.jenis_bantuan === 'uang';

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

        {/* Program Card - Design Sederhana */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
          {/* Title and Badge */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                {program.nama_program}
              </h1>
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

          {/* Status */}
          {isUang && (
            <div>
              <span className="inline-block px-4 py-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg text-sm font-medium">
                {hasBuktiTransfer ? 'Menunggu penjadwalan' : 'Menunggu upload bukti transfer'}
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200">
            {isUang ? (
              !hasBuktiTransfer ? (
                <>
                  <button
                    disabled
                    className="px-5 py-2.5 rounded-lg bg-slate-200 text-slate-400 font-semibold cursor-not-allowed"
                  >
                    Bukti transfer belum ada
                  </button>
                  <button
                    disabled
                    className="px-5 py-2.5 rounded-lg bg-slate-200 text-slate-400 font-semibold cursor-not-allowed"
                  >
                    Menunggu upload bukti transfer
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowProofModal(true)}
                    className="px-5 py-2.5 rounded-lg bg-violet-600 text-white font-semibold hover:bg-violet-700"
                  >
                    Lihat Bukti Transfer
                  </button>
                  <button
                    onClick={() => navigate(`/admin/donasi/${id}/jadwal`)}
                    className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
                  >
                    Lakukan Penjadwalan dan Aktifkan Donasi
                  </button>
                </>
              )
            ) : (
              <button
                onClick={() => navigate(`/admin/donasi/${id}/jadwal`)}
                className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
              >
                Lakukan Penjadwalan dan Aktifkan Donasi
              </button>
            )}
            {/* Tolak button always shown */}
            <button
              onClick={handleReject}
              disabled={processing}
              className="px-5 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 disabled:bg-slate-400 flex items-center gap-2"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  Tolak
                </>
              )}
            </button>
          </div>
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
      </main>

      {/* Proof Modal */}
      {showProofModal && hasBuktiTransfer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#0B2B5E]">Bukti Transfer</h2>
              <button
                onClick={() => setShowProofModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <img 
                src={`http://localhost:8000/storage/${program.bukti_transfer}`}
                alt="Bukti Transfer"
                className="w-full h-auto rounded-lg border border-slate-200"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300"><rect width="400" height="300" fill="%23f1f5f9"/><text x="50%" y="50%" text-anchor="middle" fill="%2364748b" font-size="16">Gambar tidak dapat dimuat</text></svg>';
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


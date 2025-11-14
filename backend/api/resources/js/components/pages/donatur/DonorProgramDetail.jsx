import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarDonatur from "../../layout/NavbarDonatur";
import { ArrowLeft, CalendarDays, Layers, Package, BadgeDollarSign, Users, Image as ImageIcon, FileText } from "lucide-react";
import api from "../../../services/api";

const StatusPill = ({ color = "slate", children }) => {
  const map = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    slate: "bg-slate-100 text-slate-700",
    red: "bg-red-100 text-red-700",
    gray: "bg-gray-100 text-gray-700",
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[color]}`}>{children}</span>;
};

export default function DonorProgramDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useState("DETAIL");
  const [program, setProgram] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [recipientsFetched, setRecipientsFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgramDetail = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/donatur/programs/${id}`);
      const { program: programData, statistics: stats } = response.data;
      
      setProgram(programData);
      setStatistics(stats);
    } catch (error) {
      console.error('Error fetching program detail:', error);
      setError('Gagal memuat data program');
    } finally {
      setLoading(false);
    }
  }, [id]);

  const fetchRecipients = useCallback(async () => {
    try {
      console.log('[DEBUG] Fetching recipients for program:', id);
      const response = await api.get(`/api/donatur/programs/${id}/recipients`);
      console.log('[DEBUG] Recipients response:', response.data);
      console.log('[DEBUG] Recipients array:', response.data.recipients);
      setRecipients(response.data.recipients || []);
      setRecipientsFetched(true);
    } catch (error) {
      console.error('Error fetching recipients:', error);
      setRecipientsFetched(true);
    }
  }, [id]);

  useEffect(() => {
    fetchProgramDetail();
  }, [fetchProgramDetail]);

  useEffect(() => {
    console.log('[DEBUG] Tab changed to:', tab);
    console.log('[DEBUG] Recipients fetched:', recipientsFetched);
    console.log('[DEBUG] Recipients count:', recipients.length);
    
    if (tab === "RECIPIENTS" && !recipientsFetched) {
      console.log('[DEBUG] Triggering fetchRecipients...');
      fetchRecipients();
    }
  }, [tab, fetchRecipients, recipientsFetched, recipients.length]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'aktif': { label: 'Aktif', color: 'blue' },
      'selesai': { label: 'Selesai', color: 'green' },
      'ditunda': { label: 'Ditunda', color: 'yellow' },
    };
    return statusMap[status] || { label: status, color: 'slate' };
  };

  const calculateProgress = () => {
    if (!statistics) return 0;
    if (statistics.total_penerima === 0) return 0;
    return Math.round((statistics.total_tersalurkan / statistics.total_penerima) * 100);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <NavbarDonatur />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Memuat detail program...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-white">
        <NavbarDonatur />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-slate-600 mb-2">Program tidak ditemukan</p>
            {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
            <button 
              onClick={() => navigate(-1)} 
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  const statusInfo = getStatusInfo(program.status);
  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-white">
      <NavbarDonatur />

      {/* Back header */}
      <div className="bg-[#1976d26c]/30">
        <div className="max-w-6xl mx-auto px-3 py-2 text-sm text-[#0B2B5E] flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 hover:text-green-700">
            <ArrowLeft className="w-4 h-4" />
            <span>Detail Program Bantuan</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-8">
        {/* Top intro card */}
        <div className="rounded-2xl border border-green-200 shadow-sm p-5 md:p-6 bg-white">
          <h2 className="text-xl md:text-2xl font-extrabold text-center text-[#0B2B5E]">
            Detail dan Transparansi Program Bantuan
          </h2>
          <p className="text-xs md:text-sm text-slate-600 text-center mt-2">
            Lihat jadwal penyaluran, penerima manfaat, serta dokumentasi kegiatan untuk memastikan bantuan tersalurkan dengan tepat.
          </p>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 className="text-base md:text-lg font-semibold text-[#0B2B5E]">{program.nama_program}</h3>
              <StatusPill color={statusInfo.color}>{statusInfo.label}</StatusPill>
            </div>
            <p className="mt-2 text-sm text-slate-700">
              {program.deskripsi || 'Tidak ada deskripsi'}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold inline-flex items-center gap-1">
                <Package className="w-3.5 h-3.5" /> {program.jenis_bantuan === 'uang' ? 'Uang' : 'Barang'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold inline-flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> {program.kategori?.nama_kategori || 'Kategori Lainnya'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
            <span>Progress Penyaluran</span>
            <span>{progress}% ({statistics?.total_tersalurkan || 0}/{statistics?.total_penerima || 0})</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-2 bg-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          <button
            onClick={() => setTab("DETAIL")}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold shadow-sm border transition-colors ${
              tab === "DETAIL"
                ? "bg-green-600 text-white border-green-700 hover:bg-green-700"
                : "bg-white text-[#0B2B5E] border-slate-200 hover:bg-slate-50"
            }`}
          >
            <FileText className="w-4 h-4" /> Detail Program
          </button>
          <button
            onClick={() => setTab("SCHEDULE")}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold shadow-sm border transition-colors ${
              tab === "SCHEDULE"
                ? "bg-green-600 text-white border-green-700 hover:bg-green-700"
                : "bg-white text-[#0B2B5E] border-slate-200 hover:bg-slate-50"
            }`}
          >
            <CalendarDays className="w-4 h-4" /> Jadwal Penyaluran
          </button>
          <button
            onClick={() => setTab("RECIPIENTS")}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold shadow-sm border transition-colors ${
              tab === "RECIPIENTS"
                ? "bg-green-600 text-white border-green-700 hover:bg-green-700"
                : "bg-white text-[#0B2B5E] border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Users className="w-4 h-4" /> Daftar Penerima
          </button>
          <button
            onClick={() => setTab("DOCS")}
            className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold shadow-sm border transition-colors ${
              tab === "DOCS"
                ? "bg-green-600 text-white border-green-700 hover:bg-green-700"
                : "bg-white text-[#0B2B5E] border-slate-200 hover:bg-slate-50"
            }`}
          >
            <ImageIcon className="w-4 h-4" /> Dokumentasi
          </button>
        </div>

        {/* Tab contents */}
        {tab === "DETAIL" && (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <div className="text-[#0B2B5E] font-semibold flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> Pelaksanaan Program
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-600 mb-1">Tanggal Dimulai</div>
                <div className="relative">
                  <input 
                    readOnly 
                    value={formatDate(program.tanggal_mulai)} 
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                  />
                  <CalendarDays className="w-4 h-4 text-slate-400 absolute right-3 top-3.5"/>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">Tanggal Selesai</div>
                <div className="relative">
                  <input 
                    readOnly 
                    value={formatDate(program.tanggal_selesai)} 
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"
                  />
                  <CalendarDays className="w-4 h-4 text-slate-400 absolute right-3 top-3.5"/>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-slate-100 rounded-lg p-3 flex items-start gap-3">
              <BadgeDollarSign className="w-5 h-5 text-green-700"/>
              <div className="text-sm">
                <div className="font-semibold text-slate-700">Jumlah Donasi</div>
                <div className="text-slate-700">
                  {program.jenis_bantuan === 'uang' 
                    ? formatCurrency(program.jumlah_bantuan)
                    : `${program.jumlah_bantuan} ${program.satuan_barang || 'Unit'}`
                  }
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[#0B2B5E] font-semibold text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"/> Kriteria Penerima Donasi
              </div>
              <div className="mt-2 rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-700">
                {program.kriteria_penerima || 'Tidak ada kriteria spesifik'}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[#0B2B5E] font-semibold text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"/> Keterangan Penerima Donasi
              </div>
              <div className="mt-2 rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-700">
                {program.keterangan || 'Tidak ada keterangan tambahan'}
              </div>
            </div>
          </div>
        )}

        {tab === "SCHEDULE" && (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-[#0B2B5E]">
              <CalendarDays className="w-4 h-4"/> Jadwal Penyaluran Bantuan
            </div>
            <div className="mt-3 text-sm text-slate-600">
              <p>Jadwal penyaluran akan ditampilkan setelah data tersedia dari backend.</p>
              <div className="mt-3 bg-slate-50 rounded-lg p-4 border border-slate-200">
                <div className="font-semibold text-slate-700 mb-2">Informasi Program:</div>
                <div className="space-y-1">
                  <div>Periode: {formatDate(program.tanggal_mulai)} - {formatDate(program.tanggal_selesai)}</div>
                  <div>Total Penerima: {statistics?.total_penerima || 0} orang</div>
                  <div>Sudah Tersalurkan: {statistics?.total_tersalurkan || 0} orang</div>
                  <div>Belum Tersalurkan: {statistics?.total_belum_tersalurkan || 0} orang</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "RECIPIENTS" && (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-[#0B2B5E] mb-3">
              <Users className="w-4 h-4"/> Daftar Penerima Bantuan
            </div>
            
            {loading ? (
              <div className="text-center py-8 text-slate-600">Loading...</div>
            ) : recipients.length > 0 ? (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      {["No","No. KK","Nama Penerima","Alamat","Status Penyaluran"].map((h) => (
                        <th key={h} className="bg-green-200/60 text-[#0B2B5E] font-semibold px-3 py-2 border border-green-300 first:rounded-l-lg last:rounded-r-lg">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recipients.map((r, i) => (
                      <tr key={r.id_penerima_program} className="border-b last:border-b-0">
                        <td className="px-3 py-3 align-top border-l border-slate-200">{i + 1}</td>
                        <td className="px-3 py-3 align-top">{r.penerima?.no_kk || '-'}</td>
                        <td className="px-3 py-3 align-top">{r.penerima?.nama_kepala || '-'}</td>
                        <td className="px-3 py-3 align-top">{r.penerima?.alamat || '-'}</td>
                        <td className="px-3 py-3 align-top border-r border-slate-200">
                          <StatusPill color={r.status_penerimaan === 'selesai' ? 'green' : r.status_penerimaan === 'proses' ? 'blue' : 'yellow'}>
                            {r.status_penerimaan === 'selesai' ? 'Selesai' : r.status_penerimaan === 'proses' ? 'Proses' : 'Menunggu'}
                          </StatusPill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-600">Belum ada penerima untuk program ini</div>
            )}
          </div>
        )}

        {tab === "DOCS" && (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-[#0B2B5E]">
              <ImageIcon className="w-4 h-4"/> Dokumentasi
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="aspect-square rounded-xl border border-slate-300 bg-slate-100 flex items-center justify-center">
                  <ImageIcon className="w-14 h-14 text-slate-400"/>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

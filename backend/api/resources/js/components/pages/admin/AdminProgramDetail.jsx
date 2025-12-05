/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { ArrowLeft, Calendar, Package, Users, Loader2, AlertCircle, CalendarDays, Layers, BadgeDollarSign, FileText, Image as ImageIcon } from "lucide-react";
import { adminAPI } from "../../../utils/api";

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

export default function AdminProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("DETAIL");
  const [program, setProgram] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [dokumentasi, setDokumentasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadProgramDetail();
  }, [id]);

  const loadProgramDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getProgramDetail(id);
      
      if (response.success && response.data) {
        setProgram(response.data);
        setSchedules(response.schedules || []);
        setDokumentasi(response.dokumentasi || []);
      }
    } catch (err) {
      console.error("Error loading program detail:", err);
      setError(err.message || "Gagal memuat detail program");
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

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      'aktif': { label: 'Aktif', color: 'blue' },
      'selesai': { label: 'Selesai', color: 'green' },
      'nonaktif': { label: 'Nonaktif', color: 'yellow' },
    };
    return statusMap[status] || { label: status, color: 'slate' };
  };

  const calculateProgress = () => {
    if (!program?.statistics) return 0;
    if (program.statistics.total_penerima === 0) return 0;
    const tersalurkan = program.statistics.total_tersalurkan || 0;
    return Math.round((tersalurkan / program.statistics.total_penerima) * 100);
  };

  const getStatusPenyaluran = (penerimaProgram) => {
    // Check if there's any transaction with status 'selesai'
    if (penerimaProgram.transaksi_penyaluran && penerimaProgram.transaksi_penyaluran.length > 0) {
      const hasSelesai = penerimaProgram.transaksi_penyaluran.some(t => t.status_penyaluran === 'selesai');
      if (hasSelesai) return { status: 'selesai', label: 'Selesai', color: 'green' };
    }
    return { status: 'menunggu', label: 'Menunggu', color: 'yellow' };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <NavbarAdmin />
        <div className="flex-1 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Memuat detail program...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-white">
        <NavbarAdmin />
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
  const recipients = program.recipients || [];

  return (
    <div className="min-h-screen bg-white">
      <NavbarAdmin />

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
            <span>{progress}% ({program.statistics?.total_tersalurkan || 0}/{program.statistics?.total_penerima || 0})</span>
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
                    : `${parseInt(program.jumlah_bantuan)} Paket`
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
                  <div>Total Penerima: {program.statistics?.total_penerima || 0} orang</div>
                  <div>Sudah Tersalurkan: {program.statistics?.total_tersalurkan || 0} orang</div>
                  <div>Belum Tersalurkan: {program.statistics?.total_belum_tersalurkan || 0} orang</div>
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
            
            {recipients.length > 0 ? (
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
                    {recipients.map((r, i) => {
                      const statusInfo = getStatusPenyaluran(r);
                      return (
                        <tr key={r.id_penerima_program} className="border-b last:border-b-0">
                          <td className="px-3 py-3 align-top border-l border-slate-200">{i + 1}</td>
                          <td className="px-3 py-3 align-top">{r.penerima?.no_kk || '-'}</td>
                          <td className="px-3 py-3 align-top">{r.penerima?.nama_kepala || '-'}</td>
                          <td className="px-3 py-3 align-top">{r.penerima?.alamat || '-'}</td>
                          <td className="px-3 py-3 align-top border-r border-slate-200">
                            <StatusPill color={statusInfo.color}>
                              {statusInfo.label}
                            </StatusPill>
                          </td>
                        </tr>
                      );
                    })}
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
            <div className="flex items-center gap-2 font-semibold text-[#0B2B5E] mb-3">
              <ImageIcon className="w-4 h-4"/> Dokumentasi Penyaluran
            </div>
            {dokumentasi.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {dokumentasi.map((doc) => (
                  <div key={doc.id} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                    {doc.file_type?.startsWith('image/') ? (
                      <img src={doc.file_path} alt={doc.judul} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-slate-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-5xl mb-2">📄</div>
                          <p className="text-xs text-slate-600 font-medium">{doc.file_type || 'Document'}</p>
                        </div>
                      </div>
                    )}
                    <div className="p-3">
                      <h4 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2">{doc.judul}</h4>
                      {doc.deskripsi && <p className="text-xs text-slate-600 mb-2 line-clamp-2">{doc.deskripsi}</p>}
                      <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                        <span>{doc.tanggal_upload}</span>
                        <span>{(doc.file_size / 1024).toFixed(0)} KB</span>
                      </div>
                      <a 
                        href={doc.file_path} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full px-3 py-2 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700 text-center transition-colors"
                      >
                        Lihat Dokumentasi
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-600">
                <ImageIcon className="w-16 h-16 mx-auto text-slate-300 mb-3" />
                <p className="font-medium">Belum ada dokumentasi</p>
                <p className="text-sm text-slate-500 mt-1">Dokumentasi penyaluran akan ditampilkan di sini</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

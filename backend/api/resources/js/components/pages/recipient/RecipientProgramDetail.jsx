import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarRecipient from "../../layout/NavbarRecipient";
import { Calendar, Users2, Image as ImageIcon, Info, Check, Clock4 } from "lucide-react";
import { recipientAPI } from "../../../utils/api";

function Pill({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${className}`}>
      {children}
    </span>
  );
}

function Tab({ active, onClick, icon: Icon, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
        active ? "bg-emerald-600 text-white border-emerald-600 shadow" : "bg-white text-[#0B2B5E] border-emerald-600 hover:bg-emerald-50"
      }`}
    >
      {Icon && <Icon className="w-4 h-4" />} {children}
    </button>
  );
}

export default function RecipientProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState("detail"); // detail | jadwal | penerima | dokumentasi
  const [currentUserKK, setCurrentUserKK] = useState(null);
  const [program, setProgram] = useState(null);
  const [dokumentasi, setDokumentasi] = useState([]);
  const [dokumentasiFetched, setDokumentasiFetched] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch current user's No. KK
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await recipientAPI.getProfile();
        if (response.success && response.profile) {
          setCurrentUserKK(response.profile.no_kk);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
      }
    };
    fetchUserProfile();
  }, []);

  // Fetch dokumentasi
  useEffect(() => {
    const fetchDokumentasi = async () => {
      if (tab === "dokumentasi" && !dokumentasiFetched) {
        try {
          const response = await recipientAPI.getDokumentasiProgram(id);
          if (response.success) {
            setDokumentasi(response.data || []);
          }
          setDokumentasiFetched(true);
        } catch (error) {
          console.error('Error fetching dokumentasi:', error);
          setDokumentasiFetched(true);
        }
      }
    };
    fetchDokumentasi();
  }, [tab, id, dokumentasiFetched]);

  // Fetch program detail
  useEffect(() => {
    const fetchProgramDetail = async () => {
      try {
        setLoading(true);
        const response = await recipientAPI.getProgramDetail(id);
        if (response.success) {
          setProgram(response.data);
        }
      } catch (err) {
        console.error('Error fetching program detail:', err);
        setError(err.message || 'Gagal memuat detail program');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchProgramDetail();
    }
  }, [id]);

  // Function to mask KK number if it's not the current user's
  const maskKK = (kk) => {
    if (!kk) return "N/A";
    if (kk === currentUserKK) {
      // Don't mask current user's KK
      return kk;
    }
    // Mask other users' KK: show first 4 and last 4 digits
    if (kk.length >= 8) {
      return `${kk.substring(0, 4)}****${kk.substring(kk.length - 4)}`;
    }
    return kk;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // Calculate progress - use same logic as AdminProgramDetail
  const calculateProgress = () => {
    if (!program || !program.statistics) return { progress: 0, note: '0/0 Penerima' };
    const { total_penerima, total_tersalurkan, penerima_selesai } = program.statistics;
    const tersalurkan = total_tersalurkan || penerima_selesai || 0;
    const progress = total_penerima > 0 ? Math.round((tersalurkan / total_penerima) * 100) : 0;
    return {
      progress,
      note: `${tersalurkan}/${total_penerima} Penerima`
    };
  };

  const getStatusPenyaluran = (recipient) => {
    // Check if there's any transaction with status 'selesai'
    if (recipient.transaksi_penyaluran && recipient.transaksi_penyaluran.length > 0) {
      const hasSelesai = recipient.transaksi_penyaluran.some(t => t.status_penyaluran === 'selesai');
      if (hasSelesai) return 'selesai';
    }
    return 'menunggu';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
        <NavbarRecipient />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Memuat detail program...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
        <NavbarRecipient />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || 'Program tidak ditemukan'}</p>
            <button
              onClick={() => navigate('/penerima/program')}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Kembali ke Daftar Program
            </button>
          </div>
        </main>
      </div>
    );
  }

  const progressData = calculateProgress();
  const safeProgress = Math.min(100, Math.max(0, progressData.progress));

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarRecipient />

      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Back */}
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-sm text-[#0B2B5E] hover:text-emerald-700">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-white border border-slate-200">←</span>
            Detail Program Bantuan
          </button>

          {/* Header card */}
          <section className="bg-white/90 rounded-xl border border-green-200 shadow-sm p-4 sm:p-6">
            <div className="text-center">
              <h1 className="text-[#0B2B5E] font-semibold text-lg sm:text-xl">Detail dan Transparansi Program Bantuan</h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">Lihat jadwal penyaluran, penerima manfaat, serta dokumentasi kegiatan untuk memastikan bantuan tersalurkan dengan tepat.</p>
            </div>

            <div className="mt-4">
              <h2 className="text-slate-900 font-semibold">{program.nama_program}</h2>
              <p className="text-xs text-slate-600 mt-1">{program.deskripsi || 'Tidak ada deskripsi'}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Pill className="bg-blue-50 text-blue-700 border border-blue-200">
                  {program.jenis_bantuan === 'uang' ? 'Uang' : 'Barang'}
                </Pill>
                <Pill className="bg-blue-50 text-blue-700 border border-blue-200">
                  {program.kategori?.nama_kategori || 'Tidak ada kategori'}
                </Pill>
                <Pill className={`ml-auto ${
                  program.status === 'aktif' ? 'bg-emerald-100 text-emerald-800' :
                  program.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                  program.status === 'selesai' ? 'bg-blue-100 text-blue-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {program.status === 'aktif' ? 'Aktif' :
                   program.status === 'pending' ? 'Pending' :
                   program.status === 'selesai' ? 'Selesai' :
                   program.status}
                </Pill>
              </div>
            </div>
          </section>

          {/* Progress */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
            <div className="flex items-center justify-between text-sm font-medium text-slate-800">
              <span>Progress Penyaluran</span>
              <span>{safeProgress}% <span className="text-slate-500 font-normal">({progressData.note})</span></span>
            </div>
            <div className="mt-2 h-2 w-full rounded-full bg-slate-200">
              <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${safeProgress}%` }} />
            </div>
          </section>

          {/* Tabs */}
          <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
            <div className="flex flex-wrap gap-2">
              <Tab active={tab === "detail"} onClick={() => setTab("detail")} icon={Info}>Detail Program</Tab>
              <Tab active={tab === "jadwal"} onClick={() => setTab("jadwal")} icon={Calendar}>Jadwal Penyaluran</Tab>
              <Tab active={tab === "penerima"} onClick={() => setTab("penerima")} icon={Users2}>Daftar Penerima</Tab>
              <Tab active={tab === "dokumentasi"} onClick={() => setTab("dokumentasi")} icon={ImageIcon}>Dokumentasi</Tab>
            </div>
          </section>

          {/* Tab content */}
          {tab === "detail" && (
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-slate-800 font-semibold mb-3">
                  <Calendar className="w-4 h-4" /> Pelaksanaan Program
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-600">Tanggal Dimulai</label>
                    <div className="mt-1 flex items-center gap-2 rounded-md border border-slate-300 px-2 py-2 text-sm bg-white">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <input value={formatDate(program.tanggal_mulai)} readOnly className="w-full outline-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600">Tanggal Selesai</label>
                    <div className="mt-1 flex items-center gap-2 rounded-md border border-slate-300 px-2 py-2 text-sm bg-white">
                      <Calendar className="w-4 h-4 text-slate-500" />
                      <input value={formatDate(program.tanggal_selesai)} readOnly className="w-full outline-none" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-sm font-semibold text-slate-800 mb-1">Jumlah Bantuan</p>
                <p className="text-xs text-slate-700">
                  {program.jenis_bantuan === 'uang' 
                    ? `Rp ${Number(program.jumlah_bantuan || 0).toLocaleString('id-ID')}`
                    : program.deskripsi_bantuan || 'Bantuan berupa barang'}
                </p>
              </div>

              {program.kriteria_penerima && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p className="text-sm font-semibold text-slate-800">Kriteria Penerima Bantuan</p>
                  <p className="text-xs text-slate-700 mt-1">{program.kriteria_penerima}</p>
                </div>
              )}

              {program.keterangan_tambahan && (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <p className="text-sm font-semibold text-slate-800">Keterangan Tambahan</p>
                  <p className="text-xs text-slate-700 mt-1">{program.keterangan_tambahan}</p>
                </div>
              )}
            </section>
          )}

          {tab === "jadwal" && (
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <div className="flex items-center gap-2 text-slate-800 font-semibold mb-3">
                <Calendar className="w-4 h-4" /> Jadwal Penyaluran Bantuan
              </div>
              {program.schedules && program.schedules.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="bg-emerald-50 text-slate-800">
                        <th className="px-3 py-2 text-left rounded-l-lg">Tanggal</th>
                        <th className="px-3 py-2 text-left">Lokasi Penyaluran</th>
                        <th className="px-3 py-2 text-left">Jam</th>
                        <th className="px-3 py-2 text-left">Keterangan</th>
                        <th className="px-3 py-2 text-left rounded-r-lg">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {program.schedules.map((schedule, idx) => (
                        <tr key={schedule.id || idx} className="border-b last:border-0">
                          <td className="px-3 py-2 whitespace-nowrap">{formatDate(schedule.tanggal_penyaluran)}</td>
                          <td className="px-3 py-2">{schedule.lokasi_penyaluran || '-'}</td>
                          <td className="px-3 py-2 whitespace-nowrap">{schedule.waktu_penyaluran || '-'}</td>
                          <td className="px-3 py-2">{schedule.keterangan || '-'}</td>
                          <td className="px-3 py-2 whitespace-nowrap">
                            {schedule.status_penyaluran === "selesai" ? (
                              <Pill className="bg-emerald-100 text-emerald-800 border border-emerald-200">
                                <Check className="w-3.5 h-3.5" /> Selesai
                              </Pill>
                            ) : (
                              <Pill className="bg-amber-100 text-amber-800 border border-amber-200">
                                <Clock4 className="w-3.5 h-3.5" /> Terjadwal
                              </Pill>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Belum ada jadwal penyaluran</p>
                </div>
              )}
            </section>
          )}

          {tab === "penerima" && (
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <div className="flex items-center gap-2 text-slate-800 font-semibold mb-3">
                <Users2 className="w-4 h-4" /> Daftar Penerima Bantuan
              </div>
              {program.recipients && program.recipients.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="bg-emerald-50 text-slate-800">
                          <th className="px-3 py-2 text-left rounded-l-lg">No</th>
                          <th className="px-3 py-2 text-left">No. KK</th>
                          <th className="px-3 py-2 text-left">Nama Penerima</th>
                          <th className="px-3 py-2 text-left">Alamat</th>
                          <th className="px-3 py-2 text-left rounded-r-lg">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {program.recipients.map((recipient, idx) => {
                          const status = getStatusPenyaluran(recipient);
                          return (
                            <tr key={recipient.id || idx} className="border-b last:border-0">
                              <td className="px-3 py-2 whitespace-nowrap">{idx + 1}</td>
                              <td className="px-3 py-2 whitespace-nowrap">{maskKK(recipient.no_kk || recipient.kk)}</td>
                              <td className="px-3 py-2 whitespace-nowrap">{recipient.nama || recipient.nama_lengkap}</td>
                              <td className="px-3 py-2">{recipient.alamat}</td>
                              <td className="px-3 py-2 whitespace-nowrap">
                                {status === "selesai" ? (
                                  <Pill className="bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    <Check className="w-3.5 h-3.5" /> Selesai
                                  </Pill>
                                ) : (
                                  <Pill className="bg-amber-100 text-amber-800 border border-amber-200">
                                    <Clock4 className="w-3.5 h-3.5" /> Menunggu
                                  </Pill>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Users2 className="w-12 h-12 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">Belum ada penerima bantuan</p>
                </div>
              )}
            </section>
          )}

          {tab === "dokumentasi" && (
            <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-3 sm:p-4">
              <div className="flex items-center gap-2 text-slate-800 font-semibold mb-3">
                <ImageIcon className="w-4 h-4" /> Dokumentasi Penyaluran
              </div>
              {dokumentasi.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <ImageIcon className="w-16 h-16 mx-auto mb-3 opacity-20" />
                  <p className="font-medium">Belum ada dokumentasi</p>
                  <p className="text-xs text-slate-400 mt-1">Dokumentasi penyaluran akan ditampilkan di sini</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {dokumentasi.map((doc) => (
                    <div key={doc.id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {doc.file_type?.startsWith('image/') ? (
                        <img src={doc.file_path} alt={doc.judul} className="w-full h-40 object-cover" />
                      ) : (
                        <div className="w-full h-40 bg-slate-100 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-4xl mb-2">📄</div>
                            <p className="text-xs text-slate-600">{doc.file_type || 'Document'}</p>
                          </div>
                        </div>
                      )}
                      <div className="p-3">
                        <h4 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2">{doc.judul}</h4>
                        {doc.deskripsi && <p className="text-xs text-slate-600 mb-2 line-clamp-2">{doc.deskripsi}</p>}
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                          <span>{doc.tanggal_upload}</span>
                          <span>{(doc.file_size / 1024).toFixed(0)} KB</span>
                        </div>
                        <a 
                          href={doc.file_path} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="block w-full px-3 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded hover:bg-emerald-700 text-center"
                        >
                          Lihat Dokumentasi
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

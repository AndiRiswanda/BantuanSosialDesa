import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { ArrowLeft, Calendar as CalendarIcon, Info, Upload, Search, Loader2 } from "lucide-react";
import { adminAPI } from "../../../utils/api";

function Chip({ children, className = "" }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${className}`}>{children}</span>;
}

function Progress({ value, note }) {
  const pct = Math.min(100, Math.max(0, value));
  return (
    <section className="bg-white rounded-xl shadow-sm border border-emerald-300 p-4">
      <div className="flex items-center justify-between text-sm text-slate-800 mb-2">
        <span>Progress Penyaluran</span>
        <span className="font-semibold">{pct}% <span className="text-slate-500 font-normal">{note}</span></span>
      </div>
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div className="h-full bg-emerald-600" style={{ width: `${pct}%` }} />
      </div>
    </section>
  );
}

function UploadModal({ open, onClose, programId = null, programName = '' }) {
  const [programs, setPrograms] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState(programId || '');
  const [judul, setJudul] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  useEffect(() => {
    if (open && !programId) {
      loadPrograms();
    }
    if (programId) {
      setSelectedProgram(programId);
    }
  }, [open, programId]);

  const loadPrograms = async () => {
    setLoadingPrograms(true);
    try {
      const response = await adminAPI.getPrograms();
      if (response.success) {
        const activePrograms = (response.data.data || response.data || [])
          .filter(p => p.status === 'aktif' || p.status === 'terjadwal');
        setPrograms(activePrograms);
      }
    } catch (error) {
      console.error('Error loading programs:', error);
    } finally {
      setLoadingPrograms(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedProgram || !judul || !file) {
      alert('Mohon lengkapi semua field yang diperlukan');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('id_program', selectedProgram);
      formData.append('judul', judul);
      formData.append('deskripsi', deskripsi);
      formData.append('file', file);

      const response = await adminAPI.uploadDokumentasi(formData);
      
      if (response.success) {
        alert('Dokumentasi berhasil diupload!');
        setJudul('');
        setDeskripsi('');
        setFile(null);
        setSelectedProgram(programId || '');
        onClose(true); // Pass true to indicate success
      } else {
        alert('Gagal mengupload dokumentasi: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Terjadi kesalahan saat mengupload dokumentasi');
    } finally {
      setUploading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-4 py-3 border-b bg-blue-50 rounded-t-xl">
          <p className="font-semibold text-slate-800">Upload Dokumentasi Penyaluran</p>
          <button onClick={() => onClose()} className="p-1 rounded hover:bg-slate-100" aria-label="Tutup">✕</button>
        </div>
        <div className="p-4 space-y-4">
          {/* Program Selection */}
          {!programId && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Pilih Program <span className="text-red-600">*</span>
              </label>
              {loadingPrograms ? (
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memuat program...
                </div>
              ) : (
                <select
                  value={selectedProgram}
                  onChange={(e) => setSelectedProgram(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                >
                  <option value="">-- Pilih Program --</option>
                  {programs.map((prog) => (
                    <option key={prog.id_program} value={prog.id_program}>
                      {prog.nama_program}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {programId && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Program</label>
              <div className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm">
                {programName}
              </div>
            </div>
          )}

          {/* Judul */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Judul Dokumentasi <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              placeholder="Misal: Dokumentasi Penyaluran Tahap 1"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Deskripsi
            </label>
            <textarea
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Keterangan tambahan (opsional)"
              rows={3}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              File <span className="text-red-600">*</span>
            </label>
            <label className="block border-2 border-dashed border-slate-300 rounded-xl p-6 text-center cursor-pointer hover:bg-slate-50">
              <input 
                type="file" 
                className="hidden" 
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
              />
              <Upload className="w-8 h-8 mx-auto text-slate-500" />
              <p className="text-sm text-slate-700 mt-2">Klik untuk pilih file</p>
              <p className="text-xs text-slate-500">Format: JPG, PNG, PDF, DOC, DOCX (Max 10MB)</p>
              {file && (
                <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-xs text-emerald-700 font-medium">{file.name}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-emerald-700 hover:text-emerald-900"
                  >
                    ✕
                  </button>
                </div>
              )}
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button 
              onClick={() => onClose()} 
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 text-sm font-medium hover:bg-slate-50"
              disabled={uploading}
            >
              Batal
            </button>
            <button 
              onClick={handleUpload}
              disabled={uploading || !selectedProgram || !judul || !file}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Mengupload...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload Dokumentasi
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDistributionVerify() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [program, setProgram] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [dokumentasi, setDokumentasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [tahap, setTahap] = useState(0); // 0 = Semua
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const containerRef = useRef(null);
  const [openUpload, setOpenUpload] = useState(false);

  useEffect(() => {
    loadProgramData();
  }, [id]);

  const loadProgramData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Load program detail
      const programResponse = await adminAPI.getProgramDetail(id);
      if (programResponse.success && programResponse.data) {
        const programData = programResponse.data.data || programResponse.data;
        setProgram(programData);
      }

      // Load dokumentasi
      try {
        const dokumentasiResponse = await adminAPI.getDokumentasiProgram(id);
        if (dokumentasiResponse.success) {
          setDokumentasi(dokumentasiResponse.data || []);
        }
      } catch (dokError) {
        console.error('Error loading dokumentasi:', dokError);
        setDokumentasi([]);
      }

      // Load schedules from API
      try {
        const scheduleResponse = await adminAPI.getSchedules(id);
        if (scheduleResponse.success && scheduleResponse.schedules) {
          // Format schedules for display
          const formattedSchedules = scheduleResponse.schedules.map(schedule => {
            const dateObj = new Date(schedule.date);
            const formattedDate = dateObj.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            
            // Use status from backend (already calculated based on recipients and date)
            const status = schedule.status === 'selesai' ? 'Selesai' : 'Terjadwal';
            
            return {
              date: formattedDate,
              location: schedule.location || '-',
              time: schedule.time || '-',
              note: schedule.note || '-',
              recipients: schedule.total_recipients || 0,
              status: status,
              recipientsData: schedule.recipients || []
            };
          });
          setSchedules(formattedSchedules);
          
          // Extract all recipients from schedules
          const allRecipients = [];
          scheduleResponse.schedules.forEach((schedule, scheduleIdx) => {
            schedule.recipients.forEach(recipient => {
              // Extract tahap number from schedule.note (e.g., "Tahap 1", "Tahap 2 Ya", etc.)
              // Look for pattern "Tahap X" where X is a number
              const tahapMatch = schedule.note?.match(/[Tt]ahap\s*(\d+)/);
              const tahapNumber = tahapMatch ? parseInt(tahapMatch[1]) : scheduleIdx + 1;
              
              allRecipients.push({
                id: recipient.id,
                transaction_id: recipient.transaction_id,
                kk: recipient.kk,
                name: recipient.name,
                address: recipient.address,
                tahap: tahapNumber, // Store as number for filtering
                tahapLabel: schedule.note || `Tahap ${scheduleIdx + 1}`, // Display label
                status: recipient.status === 'selesai' ? 'Selesai' : 'Menunggu',
              });
            });
          });
          setRecipients(allRecipients);
        } else {
          setSchedules([]);
          setRecipients([]);
        }
      } catch (schedError) {
        console.error('Error loading schedules:', schedError);
        setSchedules([]);
        setRecipients([]);
      }
      
    } catch (err) {
      console.error("Error loading program data:", err);
      setError(err.message || "Gagal memuat data program");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (transactionId, newStatus) => {
    try {
      const response = await adminAPI.updateTransaksiPenyaluran(transactionId, {
        status_penyaluran: newStatus
      });
      
      if (response.success) {
        // Reload data to reflect changes
        await loadProgramData();
        alert(`Status berhasil diubah menjadi ${newStatus === 'selesai' ? 'Selesai' : 'Menunggu'}`);
      } else {
        alert('Gagal mengubah status: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Terjadi kesalahan saat mengubah status');
    }
  };

  const filtered = recipients.filter((r) => {
    // Filter by tahap number (1, 2, 3, etc.)
    const byTahap = tahap === 0 || r.tahap === tahap;
    const q = query.trim().toLowerCase();
    const bySearch = !q || r.name.toLowerCase().includes(q) || r.kk.includes(q) || r.address.toLowerCase().includes(q);
    return byTahap && bySearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const pageData = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    // reset to first page on filter/search change
    setPage(1);
  }, [tahap, query]);

  // Simple touch swipe support for mobile: swipe left/right to change page
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    const onStart = (e) => {
      startX = e.touches?.[0]?.clientX ?? 0;
    };
    const onEnd = (e) => {
      const endX = e.changedTouches?.[0]?.clientX ?? 0;
      const dx = endX - startX;
      const threshold = 40; // px
      if (Math.abs(dx) < threshold) return;
      if (dx < 0 && safePage < totalPages) setPage((p) => Math.min(totalPages, p + 1));
      if (dx > 0 && safePage > 1) setPage((p) => Math.max(1, p - 1));
    };
    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchend", onEnd);
    };
  }, [safePage, totalPages]);

  const fmtDate = (iso) => {
    try {
      const d = new Date(iso);
      if (!isNaN(d)) return d.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    } catch {}
    return iso;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
        <NavbarAdmin />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto" />
            <p className="mt-4 text-slate-600">Memuat data program...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
        <NavbarAdmin />
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
            <div className="text-red-600 mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Data Tidak Ditemukan</h2>
            <p className="text-slate-600 mb-6">{error || "Program tidak ditemukan"}</p>
            <button
              onClick={() => navigate('/admin/penyaluran')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
            >
              Kembali
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarAdmin />
      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-[#0B2B5E] text-sm font-semibold mb-3 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Verifikasi Penyaluran
        </button>

        {/* Header card */}
        <section className="bg-white rounded-xl border border-emerald-300 shadow-sm p-4 sm:p-5">
          <h1 className="text-center text-[#0B2B5E] font-semibold text-lg sm:text-xl">Verifikasi Penyaluran Bantuan ke Warga</h1>
          <p className="text-center text-xs text-slate-600 mt-1">Konfirmasi penerima, tandai status penyaluran, dan unggah dokumentasi transparansi.</p>

          <div className="mt-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-slate-900 font-semibold leading-snug">{program.nama_program}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Chip className="bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {program.jenis_bantuan === 'barang' ? 'Barang' : program.jenis_bantuan === 'uang' ? 'Uang' : program.jenis_bantuan}
                  </Chip>
                  {program.kategori?.nama_kategori && (
                    <Chip className="bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {program.kategori.nama_kategori}
                    </Chip>
                  )}
                </div>
              </div>
              <Chip className="bg-blue-100 text-blue-800 border border-blue-200">
                {program.status === 'aktif' ? 'Aktif' : program.status === 'terjadwal' ? 'Terjadwal' : program.status}
              </Chip>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs font-medium text-slate-700">Tanggal Dimulai</label>
                <div className="relative mt-1">
                  <CalendarIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input disabled value={fmtDate(program.tanggal_mulai)} className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Tanggal Selesai</label>
                <div className="relative mt-1">
                  <CalendarIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input disabled value={fmtDate(program.tanggal_selesai)} className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 bg-slate-50 text-sm" />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3 mt-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                <div className="flex items-center gap-2 text-slate-800 font-medium">📦 Jumlah Donasi</div>
                <p className="mt-1 text-slate-700">{program.jumlah_donasi || '-'}</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                <div className="flex items-center gap-2 text-slate-800 font-medium"><Info className="w-4 h-4 text-emerald-600" /> Kriteria Penerima Donasi</div>
                <p className="mt-1 text-slate-700">{program.kriteria_penerima || '-'}</p>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm mt-3">
              <div className="flex items-center gap-2 text-slate-800 font-medium"><Info className="w-4 h-4 text-emerald-600" /> Keterangan Penerimaan Donasi</div>
              <p className="mt-1 text-slate-700">{program.keterangan_penerima || program.deskripsi || '-'}</p>
            </div>
          </div>
        </section>

        <div className="mt-4"><Progress value={20} note="(20/100 KK)" /></div>

        {/* Schedule table */}
        <section className="bg-white rounded-xl shadow-sm border border-emerald-300 mt-4">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2 text-sm font-semibold text-[#0B2B5E]">
            <span>🗓️ Jadwal Penyaluran Bantuan</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-emerald-700 text-white">
                <tr>
                  <th className="px-4 py-2 text-left">Tanggal</th>
                  <th className="px-4 py-2 text-left">Lokasi Penyebaran</th>
                  <th className="px-4 py-2 text-left">Jam Pengambilan</th>
                  <th className="px-4 py-2 text-left">Keterangan</th>
                  <th className="px-4 py-2 text-left">Penerima</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {schedules.map((s, idx) => (
                  <tr key={idx} className="align-top">
                    <td className="px-4 py-3 whitespace-nowrap">{s.date}</td>
                    <td className="px-4 py-3">{s.location}</td>
                    <td className="px-4 py-3 whitespace-pre-line">{s.time}</td>
                    <td className="px-4 py-3">{s.note}</td>
                    <td className="px-4 py-3">{s.recipients}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        s.status === "Selesai" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-800"
                      }`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recipient verification */}
        <section className="mt-6">
          <h2 className="text-slate-900 font-semibold">Verifikasi Penerima Program Bantuan</h2>
          <div className="mt-2 border-2 border-dashed border-emerald-300 rounded-xl p-3 sm:p-4">
            <div className="flex flex-wrap items-center gap-2">
              {[{ k:0, l:"Semua" }, {k:1,l:"Tahap 1"}, {k:2,l:"Tahap 2"}, {k:3,l:"Tahap 3"}].map(({k,l}) => (
                <button key={k} onClick={() => setTahap(k)} className={`px-3 py-1 rounded-md border text-xs font-semibold ${tahap===k?"bg-emerald-600 text-white border-emerald-600":"bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}>{l}</button>
              ))}
            </div>

            <div className="mt-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Cari Nama atau No. KK" className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
              </div>
            </div>

            <div ref={containerRef} className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
              <table className="min-w-full text-sm">
                <thead className="bg-emerald-700 text-white">
                  <tr>
                    <th className="px-3 py-2 text-left">No</th>
                    <th className="px-3 py-2 text-left">No. KK</th>
                    <th className="px-3 py-2 text-left">Nama Penerima</th>
                    <th className="px-3 py-2 text-left">Alamat</th>
                    <th className="px-3 py-2 text-left">Penyaluran</th>
                    <th className="px-3 py-2 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pageData.map((r, i) => (
                    <tr key={r.id}>
                      <td className="px-3 py-2">{(safePage - 1) * pageSize + i + 1}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{r.kk}</td>
                      <td className="px-3 py-2">{r.name}</td>
                      <td className="px-3 py-2">{r.address}</td>
                      <td className="px-3 py-2">{r.tahapLabel || `Tahap ${r.tahap}`}</td>
                      <td className="px-3 py-2">
                        <button
                          onClick={() => handleStatusChange(r.transaction_id, r.status === 'Selesai' ? 'dijadwalkan' : 'selesai')}
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            r.status === "Selesai" 
                              ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border border-emerald-300" 
                              : "bg-amber-100 text-amber-800 hover:bg-amber-200 border border-amber-300"
                          }`}
                        >
                          {r.status}
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filtered.length===0 && (
                    <tr><td className="px-3 py-6 text-center text-slate-600" colSpan={6}>Tidak ada data.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* pagination */}
            <div className="flex items-center justify-center gap-3 mt-3">
              <button
                type="button"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="w-8 h-8 rounded-full border border-slate-300 bg-white text-slate-700 disabled:opacity-50"
                aria-label="Halaman sebelumnya"
              >
                ‹
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).slice(0, 10).map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setPage(pageNum)}
                      className={`w-2.5 h-2.5 rounded-full ${pageNum === safePage ? "bg-blue-600" : "bg-blue-300"}`}
                      aria-label={`Halaman ${pageNum}`}
                    />
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="w-8 h-8 rounded-full border border-slate-300 bg-white text-slate-700 disabled:opacity-50"
                aria-label="Halaman berikutnya"
              >
                ›
              </button>
            </div>

            <div className="mt-4 text-center">
              <button onClick={()=>setOpenUpload(true)} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">
                <Upload className="w-4 h-4" /> Upload Dokumentasi Penyaluran
              </button>
            </div>
          </div>
        </section>

        {/* Dokumentasi Section */}
        <section className="bg-white rounded-xl shadow-sm border border-emerald-300 mt-4">
          <div className="px-4 py-3 border-b border-slate-200 flex items-center gap-2 text-sm font-semibold text-[#0B2B5E]">
            <span>📸 Dokumentasi Penyaluran</span>
          </div>
          <div className="p-4">
            {dokumentasi.length === 0 ? (
              <div className="text-center py-8 text-slate-600">
                <Upload className="w-12 h-12 mx-auto text-slate-400 mb-2" />
                <p className="text-sm">Belum ada dokumentasi</p>
                <p className="text-xs text-slate-500 mt-1">Upload dokumentasi untuk program ini</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      <h4 className="font-semibold text-slate-800 text-sm mb-1">{doc.judul}</h4>
                      {doc.deskripsi && <p className="text-xs text-slate-600 mb-2">{doc.deskripsi}</p>}
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>{doc.tanggal_upload}</span>
                        <span>{(doc.file_size / 1024).toFixed(0)} KB</span>
                      </div>
                      <div className="mt-2 flex gap-2">
                        <a 
                          href={doc.file_path} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 text-center"
                        >
                          Lihat
                        </a>
                        <button
                          onClick={async () => {
                            if (confirm('Hapus dokumentasi ini?')) {
                              try {
                                await adminAPI.deleteDokumentasi(doc.id);
                                alert('Dokumentasi berhasil dihapus');
                                loadProgramData();
                              } catch (error) {
                                alert('Gagal menghapus dokumentasi');
                              }
                            }
                          }}
                          className="px-3 py-1.5 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                        >
                          Hapus
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        <UploadModal 
          open={openUpload} 
          onClose={(success) => {
            setOpenUpload(false);
            if (success) {
              // Reload program data to refresh dokumentasi
              loadProgramData();
            }
          }}
          programId={id}
          programName={program?.nama_program}
        />
      </main>
    </div>
  );
}

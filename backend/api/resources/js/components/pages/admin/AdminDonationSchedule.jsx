import React, { useMemo, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { apiFetch } from "../../../utils/api";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Clock4 as ClockIcon,
  MapPin,
  Info,
  Plus,
  X,
  Users2,
  Package,
  Wallet,
  XCircle,
  Loader2,
} from "lucide-react";

function Chip({ children, className = "" }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${className}`}>{children}</span>
  );
}

function StageCard({ index, stage, onChange, onPickRecipients, onRemove, canRemove }) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between bg-blue-100 text-[#0B2B5E] px-4 py-2">
        <p className="font-semibold">Tahap {index + 1}</p>
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="p-1 rounded-full hover:bg-blue-200 text-slate-700"
            aria-label="Hapus tahap"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="p-4 sm:p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-800">Tanggal Penyaluran</label>
          <div className="relative mt-1">
            <CalendarIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="date"
              value={stage.date}
              onChange={(e) => onChange({ ...stage, date: e.target.value })}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
              placeholder="dd/mm/yyyy"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800">Jam Penyaluran</label>
          <div className="relative mt-1">
            <ClockIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="time"
              value={stage.time}
              onChange={(e) => onChange({ ...stage, time: e.target.value })}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800">Lokasi Penyaluran</label>
          <div className="relative mt-1">
            <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={stage.location}
              onChange={(e) => onChange({ ...stage, location: e.target.value })}
              placeholder="contoh: Kantor Desa"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-800">Keterangan (Opsional)</label>
          <input
            type="text"
            value={stage.note}
            onChange={(e) => onChange({ ...stage, note: e.target.value })}
            placeholder="Tambahkan keterangan untuk tahap ini"
            className="w-full mt-1 px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm"
          />
        </div>

        <div>
          <button
            type="button"
            onClick={onPickRecipients}
            className="inline-flex items-center gap-2 w-full sm:w-auto px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700"
          >
            <Users2 className="w-4 h-4" /> Pilih Penerima ({stage.recipients.length})
          </button>
        </div>
      </div>
    </section>
  );
}

function RecipientPickerModal({ open, onClose, onSave, initialSelected = [] }) {
  // Income tiers mapping
  const incomeTiers = [
    { key: "< Rp 500.000", label: "< Rp 500.000,-" },
    { key: "Rp 500.000 - Rp 1.000.000", label: "Rp 500.000,- – Rp 1.000.000" },
    { key: "Rp 1.000.000 - Rp 2.000.000", label: "Rp 1.000.000,- – Rp 2.000.000" },
    { key: "Rp 2.000.000 - Rp 3.000.000", label: "Rp 2.000.000,- – Rp 3.000.000" },
    { key: "> Rp 3.000.000", label: "> Rp 3.000.000+" },
  ];

  const [allRecipients, setAllRecipients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(new Set(initialSelected));
  const [tierFilter, setTierFilter] = useState(new Set());
  const [minDeps, setMinDeps] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Fetch recipients from API
  useEffect(() => {
    if (open) {
      fetchRecipients();
      setSelected(new Set(initialSelected));
    }
  }, [open, initialSelected]);

  const fetchRecipients = async () => {
    setLoading(true);
    try {
      // Request all recipients with large per_page parameter and filter by status
      const response = await apiFetch('/api/admin/recipients?per_page=1000&status_verifikasi=disetujui', {
        method: 'GET',
      });
      
      console.log('API Response:', response);
      
      if (response.success) {
        // Laravel paginated response structure: response.data is the pagination object, response.data.data is the array
        const recipients = response.data.data || [];
        console.log('Recipients loaded:', recipients.length);
        setAllRecipients(recipients);
      }
    } catch (error) {
      console.error('Error fetching recipients:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTier = (key) => {
    const next = new Set(tierFilter);
    next.has(key) ? next.delete(key) : next.add(key);
    setTierFilter(next);
  };

  const filtered = allRecipients.filter((r) => {
    const q = query.trim().toLowerCase();
    const bySearch = !q || r.nama_kepala?.toLowerCase().includes(q) || r.no_kk?.includes(q) || r.alamat?.toLowerCase().includes(q);
    const byTier = tierFilter.size === 0 || tierFilter.has(r.penghasilan);
    const byDeps = Number(r.jumlah_tanggungan || 0) >= Number(minDeps || 0);
    return bySearch && byTier && byDeps;
  });

  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  if (!open) return null;

  const selectedList = allRecipients.filter((r) => selected.has(r.id_penerima));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40" onClick={onClose}>
      <div
        className="w-full max-w-4xl max-h-[90vh] bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-blue-50 sticky top-0 z-10">
          <h3 className="font-semibold text-slate-900">Pilih Penerima Bantuan</h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-100" aria-label="Tutup">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 space-y-5 flex-1 overflow-y-auto">
          {/* Selected table */}
          <section className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 font-semibold text-[#0B2B5E]">Daftar Penerima Yang Dipilih</div>
            {loading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              </div>
            ) : (
              <div className="overflow-auto max-h-56">
                <table className="w-full text-sm">
                  <thead className="bg-white sticky top-0 shadow-sm">
                    <tr className="text-slate-700">
                      <th className="px-3 py-2 text-left w-10">No</th>
                      <th className="px-3 py-2 text-left">No KK</th>
                      <th className="px-3 py-2 text-left">Nama Penerima</th>
                      <th className="px-3 py-2 text-left">Alamat</th>
                      <th className="px-3 py-2 text-left">Tanggungan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {selectedList.length === 0 ? (
                      <tr>
                        <td className="px-3 py-3 text-slate-500" colSpan={5}>Belum ada penerima dipilih.</td>
                      </tr>
                    ) : (
                      selectedList.map((r, idx) => (
                        <tr key={r.id_penerima} className="hover:bg-slate-50">
                          <td className="px-3 py-2">{idx + 1}</td>
                          <td className="px-3 py-2">{r.no_kk}</td>
                          <td className="px-3 py-2">{r.nama_kepala}</td>
                          <td className="px-3 py-2">{r.alamat}</td>
                          <td className="px-3 py-2">{r.jumlah_tanggungan}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Filter + search */}
          <section>
            <h4 className="text-[#0B2B5E] font-semibold mb-2">Pilih Penerima</h4>
            <div className="border-2 border-dashed border-emerald-300 rounded-xl p-3 sm:p-4">
              <div className="grid sm:grid-cols-2 gap-3 items-start">
                <div>
                  <p className="text-sm font-medium text-slate-800 mb-2">Filter Penghasilan:</p>
                  <div className="flex flex-wrap gap-2">
                    {incomeTiers.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        onClick={() => toggleTier(t.key)}
                        className={`px-2.5 py-1 rounded-md border text-xs font-semibold ${
                          tierFilter.has(t.key)
                            ? "bg-emerald-600 text-white border-emerald-600"
                            : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-800 mb-2">Jumlah Tanggungan</p>
                  <input
                    type="number"
                    min={0}
                    value={minDeps}
                    onChange={(e) => setMinDeps(e.target.value)}
                    className="w-24 px-2 py-1 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="mt-3">
                <input
                  className="w-full pl-3 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  placeholder="Cari Nama, NIK, KK, atau alamat"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* Result list */}
          <section className="max-h-72 overflow-auto border border-slate-200 rounded-lg divide-y">
            {loading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-600" />
              </div>
            ) : (
              <>
                {filtered.map((r) => (
                  <label key={r.id_penerima} className="flex items-start gap-3 p-3 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={selected.has(r.id_penerima)}
                      onChange={() => toggle(r.id_penerima)}
                      className="h-4 w-4 mt-1"
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">{r.no_kk} – {r.nama_kepala} – {r.alamat}</p>
                      <p className="text-xs text-slate-600">Penghasilan: {r.penghasilan || 'Tidak ada data'} | Tanggungan: {r.jumlah_tanggungan || 0} | Pekerjaan: {r.pekerjaan || '-'}</p>
                    </div>
                  </label>
                ))}
                {filtered.length === 0 && <div className="p-4 text-sm text-slate-600">Tidak ada hasil.</div>}
              </>
            )}
          </section>

          <div className="flex items-center justify-end">
            <button
              onClick={() => setConfirmOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
            >
              Simpan Penerima
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-slate-200 bg-slate-50 sticky bottom-0">
          <p className="text-sm text-slate-700">
            Dipilih: <span className="font-semibold">{selected.size}</span>
          </p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-medium">
              Batal
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
            >
              Simpan Pilihan
            </button>
          </div>
        </div>

        {/* Confirmation mini-modal */}
        {confirmOpen && (
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg border border-slate-200">
              <div className="flex items-center justify-between px-4 py-3 bg-blue-50 border-b border-slate-200 rounded-t-xl">
                <p className="font-semibold text-slate-800 text-sm">Konfirmasi Penerima Program</p>
                <button onClick={() => setConfirmOpen(false)} className="p-1 rounded hover:bg-slate-100" aria-label="Tutup">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 text-sm text-slate-700 space-y-3">
                <p>Apakah Anda yakin semua penerima yang Anda pilih sudah sesuai dan benar?</p>
                <p>Jika masih ingin memeriksa, klik tombol "Periksa Kembali".</p>
              </div>
              <div className="flex items-center justify-end gap-2 px-4 py-3 bg-slate-50 border-t border-slate-200 rounded-b-xl">
                <button
                  className="px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-medium"
                  onClick={() => setConfirmOpen(false)}
                >
                  Periksa Kembali
                </button>
                <button
                  className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
                  onClick={() => {
                    setConfirmOpen(false);
                    onSave(Array.from(selected));
                  }}
                >
                  Ya, Saya Yakin
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminDonationSchedule() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [donation, setDonation] = useState(null);

  // Editable meta fields for the program window and notes
  const [meta, setMeta] = useState({
    startDate: "",
    endDate: "",
    criteria: "",
    description: "",
    donationValue: "",
  });

  const [stages, setStages] = useState([
    { date: "", time: "", location: "", note: "", recipients: [] },
  ]);

  const [picker, setPicker] = useState({ open: false, index: 0 });

  // Fetch program details
  useEffect(() => {
    // Reset states when ID changes
    setDonation(null);
    setMeta({
      startDate: "",
      endDate: "",
      criteria: "",
      description: "",
      donationValue: "",
    });
    setStages([
      { date: "", time: "", location: "", note: "", recipients: [] },
    ]);
    
    // Fetch new program details
    if (id) {
      fetchProgramDetails();
    }
  }, [id]); // Re-run when ID changes

  const fetchProgramDetails = async () => {
    setLoading(true);
    try {
      console.log('=== FETCHING PROGRAM DETAILS ===');
      console.log('Program ID from URL params:', id);
      console.log('Full API URL:', `/api/admin/programs/${id}`);
      
      const response = await apiFetch(`/api/admin/programs/${id}`, {
        method: 'GET',
      });
      
      console.log('API Response:', response);
      
      if (response.success) {
        const program = response.data;
        console.log('Program Data Received:', {
          id: program.id_program,
          nama: program.nama_program,
          jenis: program.jenis_bantuan,
          jumlah: program.jumlah_bantuan,
          tanggal_mulai: program.tanggal_mulai,
          tanggal_selesai: program.tanggal_selesai,
        });
        
        setDonation(program);
        
        // Format dates properly (handle ISO timestamp, YYYY-MM-DD, and object formats)
        const formatDate = (date) => {
          if (!date) return "";
          
          // Handle string dates (including ISO timestamps)
          if (typeof date === 'string') {
            try {
              const dateObj = new Date(date);
              // Check if valid date
              if (!isNaN(dateObj.getTime())) {
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const year = dateObj.getFullYear();
                return `${day}-${month}-${year}`;
              }
            } catch (e) {
              console.error('Error parsing date:', e);
            }
          }
          
          // Handle {date: "..."} format
          if (date.date) {
            try {
              const dateObj = new Date(date.date);
              if (!isNaN(dateObj.getTime())) {
                const day = String(dateObj.getDate()).padStart(2, '0');
                const month = String(dateObj.getMonth() + 1).padStart(2, '0');
                const year = dateObj.getFullYear();
                return `${day}-${month}-${year}`;
              }
            } catch (e) {
              console.error('Error parsing date:', e);
            }
          }
          
          return "";
        };
        
        // Prepare donation value display
        let donationValueText = "";
        if (program.jenis_bantuan === 'uang') {
          // Format currency for display
          const amount = parseFloat(program.jumlah_bantuan) || 0;
          donationValueText = new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
          }).format(amount);
        } else {
          // For goods, use deskripsi or a description of the items
          donationValueText = program.deskripsi || program.keterangan || "";
        }
        
        console.log('Formatted donation value:', donationValueText);
        
        // Initialize meta with program data
        setMeta({
          startDate: formatDate(program.tanggal_mulai),
          endDate: formatDate(program.tanggal_selesai),
          criteria: program.keterangan || "",
          description: program.deskripsi || "",
          donationValue: donationValueText,
        });
      }
    } catch (error) {
      console.error('Error fetching program:', error);
      alert('Gagal memuat data program');
    } finally {
      setLoading(false);
    }
  };

  const updateStage = (idx, next) => {
    setStages((arr) => arr.map((s, i) => (i === idx ? next : s)));
  };

  const addStage = () => setStages((arr) => [...arr, { date: "", time: "", location: "", note: "", recipients: [] }]);
  const removeStage = (idx) => setStages((arr) => (arr.length <= 1 ? arr : arr.filter((_, i) => i !== idx)));

  const openPicker = (idx) => setPicker({ open: true, index: idx });
  const closePicker = () => setPicker({ open: false, index: 0 });
  const savePicker = (ids) => {
    setStages((arr) => arr.map((s, i) => (i === picker.index ? { ...s, recipients: ids } : s)));
    closePicker();
  };

  const onSaveSchedule = async () => {
    // Validate stages
    for (let i = 0; i < stages.length; i++) {
      const stage = stages[i];
      if (!stage.date || !stage.time || !stage.location) {
        alert(`Tahap ${i + 1}: Harap lengkapi tanggal, jam, dan lokasi penyaluran`);
        return;
      }
      if (stage.recipients.length === 0) {
        alert(`Tahap ${i + 1}: Harap pilih minimal 1 penerima`);
        return;
      }
    }

    if (!meta.startDate || !meta.endDate) {
      alert('Harap lengkapi tanggal mulai dan selesai program');
      return;
    }

    setSaving(true);
    try {
      console.log('=== SAVING SCHEDULE ===');
      console.log('Program ID:', id);
      console.log('Meta data:', meta);
      console.log('Stages data:', stages);
      
      const payload = {
        meta,
        stages,
      };
      
      console.log('Full payload:', JSON.stringify(payload, null, 2));
      
      const response = await apiFetch(`/api/admin/programs/${id}/schedule`, {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      console.log('Server response:', response);

      if (response.success) {
        alert('✅ Jadwal berhasil disimpan!\n\nProgram telah diaktifkan dan dipindahkan ke tab "Terjadwal".\nPenerima yang terpilih sekarang dapat melihat bantuan ini di dashboard mereka.');
        // Navigate with state to trigger reload and switch to terjadwal tab
        navigate('/admin/donasi', { 
          state: { 
            reloadData: true, 
            switchToTab: 'terjadwal',
            message: 'Program berhasil dijadwalkan dan diaktifkan' 
          } 
        });
      } else {
        console.error('Save failed:', response);
        alert('Gagal menyimpan jadwal: ' + (response.message || 'Terjadi kesalahan'));
      }
    } catch (error) {
      console.error('Error saving schedule:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        response: error.response
      });
      alert('Gagal menyimpan jadwal: ' + (error.message || 'Silakan coba lagi.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#E6EFFA] flex flex-col">
        <NavbarAdmin />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </main>
      </div>
    );
  }

  if (!donation) {
    return (
      <div className="min-h-screen bg-[#E6EFFA] flex flex-col">
        <NavbarAdmin />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600">Program tidak ditemukan</p>
            <button
              onClick={() => navigate('/admin/donasi')}
              className="mt-4 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700"
            >
              Kembali
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#E6EFFA] flex flex-col">
      <NavbarAdmin />

      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        {/* Back */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[#0B2B5E] text-sm font-semibold mb-3 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali Ke Donasi
        </button>

        {/* Header */}
        <div className="mb-5">
          <div className="mx-auto bg-white border border-green-300 rounded-xl shadow-sm p-4 sm:p-5">
            <h1 className="text-center text-[#0B2B5E] font-semibold text-lg sm:text-xl">Buat Jadwal Penyaluran Program</h1>
            <p className="text-center text-xs text-slate-600 mt-1">
              Atur jadwal penyaluran untuk program bantuan ini dengan memilih tanggal, waktu, lokasi, dan penerima untuk setiap tahap penyaluran.
            </p>

            <div className="mt-4 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{donation.nama_program}</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Chip className="bg-indigo-50 text-indigo-700 border border-indigo-200">{donation.kategori?.nama_kategori || 'Kategori'}</Chip>
                    <Chip className="bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {donation.jenis_bantuan === 'uang' ? 'Uang' : 'Barang'}
                    </Chip>
                  </div>
                </div>
                <Chip className="bg-amber-100 text-amber-800 border border-amber-200">
                  {donation.status === 'pending' ? 'Pending' : donation.status === 'aktif' ? 'Aktif' : donation.status === 'selesai' ? 'Selesai' : 'Ditunda'}
                </Chip>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700">Tanggal Dimulai</label>
                  <div className="mt-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    {meta.startDate || '-'}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700">Tanggal Selesai</label>
                  <div className="mt-1 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    {meta.endDate || '-'}
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    {donation.jenis_bantuan === 'uang' ? (
                      <Wallet className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Package className="w-4 h-4 text-emerald-600" />
                    )}
                    Jumlah Donasi
                  </div>
                  <div className="mt-2 w-full rounded-lg border border-slate-300 bg-white text-sm p-2">
                    {meta.donationValue || 'Tidak ada informasi'}
                  </div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                  <div className="flex items-center gap-2 text-slate-800 font-medium">
                    <Info className="w-4 h-4 text-emerald-600" /> Kriteria Penerima Donasi
                  </div>
                  <div className="mt-2 w-full rounded-lg border border-slate-300 bg-slate-50 text-sm p-2 text-slate-700 whitespace-pre-wrap">
                    {meta.criteria || '-'}
                  </div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  <Info className="w-4 h-4 text-emerald-600" /> Keterangan Penyerahan Donasi
                </div>
                <div className="mt-2 w-full rounded-lg border border-slate-300 bg-white text-sm p-2 text-slate-700 whitespace-pre-wrap">
                  {meta.description || '-'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stages */}
        <div className="space-y-5">
          {stages.map((s, idx) => (
            <StageCard
              key={idx}
              index={idx}
              stage={s}
              canRemove={idx > 0}
              onRemove={() => removeStage(idx)}
              onChange={(next) => updateStage(idx, next)}
              onPickRecipients={() => openPicker(idx)}
            />
          ))}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={addStage}
            className="w-full border-2 border-dashed border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl py-3 font-semibold inline-flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Tambah Tahap Penyaluran
          </button>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between">
          <button
            onClick={() => navigate("/admin/donasi")}
            disabled={saving}
            className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-medium disabled:opacity-50"
          >
            Batal Simpan Penjadwalan
          </button>
          <button
            onClick={onSaveSchedule}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Menyimpan...' : 'Simpan Penjadwalan dan Aktifkan Program'}
          </button>
        </div>
      </main>

      <RecipientPickerModal
        open={picker.open}
        onClose={closePicker}
        onSave={savePicker}
        initialSelected={stages[picker.index]?.recipients || []}
      />
    </div>
  );
}

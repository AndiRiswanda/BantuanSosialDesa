import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarAdmin from "../../layout/NavbarAdmin";
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
} from "lucide-react";

function Chip({ children, className = "" }) {
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${className}`}>{children}</span>;
}

function StageCard({ index, stage, onChange, onPickRecipients, onRemove, canRemove }) {
  return (
    <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="flex items-center justify-between bg-blue-100 text-[#0B2B5E] px-4 py-2">
        <p className="font-semibold">Tahap {index + 1}</p>
        {canRemove && (
          <button type="button" onClick={onRemove} className="p-1 rounded-full hover:bg-blue-200 text-slate-700" aria-label="Hapus tahap">
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
            placeholder="misal: agar membawa kartu keluarga"
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

// Reuse the richer modal from the schedule page by inlining here
function RecipientPickerModal({ open, onClose, onSave, initialSelected = [] }) {
  const incomeTiers = [
    { key: "lt500", label: "< Rp 500.000,-" },
    { key: "500to1m", label: "Rp 500.000,- – Rp 1.000.000" },
    { key: "1to2m", label: "Rp 1.000.000,- – Rp 2.000.000" },
    { key: "gt2m", label: "Rp 2.000.000,- – Rp 3.000.000+" },
  ];
  const allRecipients = useMemo(() => {
    const jobs = ["Buruh", "Petani", "Pedagang", "Ibu Rumah Tangga"]; 
    const streets = ["Melati", "Mawar", "Kenanga", "Anggrek", "Flamboyan"];
    return Array.from({ length: 40 }).map((_, i) => {
      const tierIndex = i % incomeTiers.length;
      return {
        id: i + 1,
        name: `Warga ${i + 1}`,
        kk: `3174-45${String(i + 1).padStart(4, "0")}`,
        nik: `3173${String(i + 1).padStart(8, "0")}`,
        address: `Jl. ${streets[i % streets.length]} No. ${10 + i}, RT 0${(i % 4) + 1}/0${(i % 3) + 1}`,
        dependents: (i % 5) + 0,
        incomeTier: incomeTiers[tierIndex].key,
        job: jobs[i % jobs.length],
      };
    });
  }, []);

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(new Set(initialSelected));
  const [tierFilter, setTierFilter] = useState(new Set());
  const [minDeps, setMinDeps] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  React.useEffect(() => {
    if (open) setSelected(new Set(initialSelected));
  }, [open, initialSelected]);

  const toggleTier = (key) => {
    const next = new Set(tierFilter);
    next.has(key) ? next.delete(key) : next.add(key);
    setTierFilter(next);
  };

  const filtered = allRecipients.filter((r) => {
    const q = query.trim().toLowerCase();
    const bySearch = !q || r.name.toLowerCase().includes(q) || r.kk.includes(q) || r.nik.includes(q) || r.address.toLowerCase().includes(q);
    const byTier = tierFilter.size === 0 || tierFilter.has(r.incomeTier);
    const byDeps = Number(r.dependents) >= Number(minDeps || 0);
    return bySearch && byTier && byDeps;
  });

  const toggle = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  if (!open) return null;

  const selectedList = allRecipients.filter((r) => selected.has(r.id));

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
          <section className="border border-slate-200 rounded-lg overflow-hidden">
            <div className="bg-slate-50 px-4 py-2 font-semibold text-[#0B2B5E]">Daftar Penerima Yang Dipilih</div>
            <div className="overflow-auto max-h-56">
              <table className="w-full text-sm">
                <thead className="bg-white sticky top-0 shadow-sm">
                  <tr className="text-slate-700">
                    <th className="px-3 py-2 text-left w-10">No</th>
                    <th className="px-3 py-2 text-left">NIK</th>
                    <th className="px-3 py-2 text-left">Nama Penerima</th>
                    <th className="px-3 py-2 text-left">Alamat</th>
                    <th className="px-3 py-2 text-left">Tanggungan</th>
                    <th className="px-3 py-2 text-left">Ket</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedList.length === 0 ? (
                    <tr>
                      <td className="px-3 py-3 text-slate-500" colSpan={6}>Belum ada penerima dipilih.</td>
                    </tr>
                  ) : (
                    selectedList.map((r, idx) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2">{idx + 1}</td>
                        <td className="px-3 py-2">{r.nik}</td>
                        <td className="px-3 py-2">{r.name}</td>
                        <td className="px-3 py-2">{r.address}</td>
                        <td className="px-3 py-2">{r.dependents}</td>
                        <td className="px-3 py-2">
                          <button type="button" className="px-2 py-1 text-xs rounded bg-emerald-600 text-white">Detail</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

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
                        onClick={() => {
                          const next = new Set(tierFilter);
                          next.has(t.key) ? next.delete(t.key) : next.add(t.key);
                          setTierFilter(next);
                        }}
                        className={`px-2.5 py-1 rounded-md border text-xs font-semibold ${tierFilter.has(t.key) ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-800 mb-2">Jumlah Tanggungan</p>
                  <input type="number" min={0} value={minDeps} onChange={(e) => setMinDeps(e.target.value)} className="w-24 px-2 py-1 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
              </div>
              <div className="mt-3">
                <input className="w-full pl-3 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm" placeholder="Cari Nama, NIK, KK, atau alamat" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
            </div>
          </section>

          <section className="max-h-72 overflow-auto border border-slate-200 rounded-lg divide-y">
            {filtered.map((r) => (
              <label key={r.id} className="flex items-start gap-3 p-3 hover:bg-slate-50">
                <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)} className="h-4 w-4 mt-1" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{r.kk} – {r.name} – {r.address}</p>
                  <p className="text-xs text-slate-600">Penghasilan: {incomeTiers.find((t) => t.key === r.incomeTier)?.label} | Tanggungan: {r.dependents} | Pekerjaan: {r.job}</p>
                </div>
              </label>
            ))}
            {filtered.length === 0 && <div className="p-4 text-sm text-slate-600">Tidak ada hasil.</div>}
          </section>

          <div className="flex items-center justify-end">
            <button onClick={() => onSave(Array.from(selected))} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">Simpan Penerima</button>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2 px-4 py-3 border-t border-slate-200 bg-slate-50 sticky bottom-0">
          <p className="text-sm text-slate-700">Dipilih: <span className="font-semibold">{selected.size}</span></p>
          <div className="flex gap-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-medium">Batal</button>
            <button onClick={() => onSave(Array.from(selected))} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">Simpan Pilihan</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDonationEdit() {
  const navigate = useNavigate();
  const { id } = useParams();

  const donation = {
    id,
    title: "Bantuan Alat Sekolah untuk Anak Kurang Mampu",
    type: "Barang",
    categories: ["Barang", "Pendidikan & Sosial"],
    status: "Pending",
  };

  const [meta, setMeta] = useState({
    startDate: "2025-10-01",
    endDate: "2025-12-30",
    donationValue: "satu paket alat sekolah baru (tas, tempat pensil, pulpen, pensil, penggaris, penghapus, dll)",
    criteria: "Anak-anak yang menempuh pendidikan sekolah dasar - menengah atas pada keluarga berpenghasilan rendah",
    description: "Penyaluran diutamakan kepada anak dengan jenjang pendidikan yang lebih rendah dan yang memiliki saudara banyak",
  });

  const [stages, setStages] = useState([
    { date: "2025-10-03", time: "08:00", location: "Kantor Desa", note: "Lengkapi Kartu Keluarga", recipients: [] },
    { date: "2025-10-12", time: "09:00", location: "Lapangan Desa", note: "Bawa alat tulis", recipients: [] },
  ]);

  const [picker, setPicker] = useState({ open: false, index: 0 });
  const openPicker = (idx) => setPicker({ open: true, index: idx });
  const closePicker = () => setPicker({ open: false, index: 0 });
  const savePicker = (ids) => {
    setStages((arr) => arr.map((s, i) => (i === picker.index ? { ...s, recipients: ids } : s)));
    closePicker();
  };

  const updateStage = (idx, next) => setStages((arr) => arr.map((s, i) => (i === idx ? next : s)));
  const addStage = () => setStages((arr) => [...arr, { date: "", time: "", location: "", note: "", recipients: [] }]);
  const removeStage = (idx) => setStages((arr) => (arr.length <= 1 ? arr : arr.filter((_, i) => i !== idx)));

  const onSave = () => navigate("/admin/donasi");

  return (
    <div className="min-h-screen bg-[#E6EFFA] flex flex-col">
      <NavbarAdmin />
      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-[#0B2B5E] text-sm font-semibold mb-3 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Kembali Ke Donasi
        </button>

        <div className="mx-auto bg-white border border-green-300 rounded-xl shadow-sm p-4 sm:p-5 mb-5">
          <h1 className="text-center text-[#0B2B5E] font-semibold text-lg sm:text-xl">Edit Penyaluran</h1>
          <p className="text-center text-xs text-slate-600 mt-1">Anda dapat membagi penyaluran menjadi beberapa tahap. Setiap tahap bisa dijadwalkan di waktu dan lokasi berbeda dengan penerima yang berbeda.</p>

          <div className="mt-4 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{donation.title}</p>
                <div className="mt-1 flex flex-wrap gap-2">
                  {donation.categories.map((c) => (
                    <Chip key={c} className="bg-indigo-50 text-indigo-700 border border-indigo-200">{c}</Chip>
                  ))}
                </div>
              </div>
              <Chip className="bg-amber-100 text-amber-800 border border-amber-200">Pending</Chip>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700">Tanggal Dimulai</label>
                <div className="relative mt-1">
                  <CalendarIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="date" value={meta.startDate} onChange={(e) => setMeta((m) => ({ ...m, startDate: e.target.value }))} className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-700">Tanggal Selesai</label>
                <div className="relative mt-1">
                  <CalendarIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input type="date" value={meta.endDate} onChange={(e) => setMeta((m) => ({ ...m, endDate: e.target.value }))} className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-sm" />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                <div className="flex items-center gap-2 text-slate-800 font-medium">
                  {donation.type === "Uang" ? <Wallet className="w-4 h-4 text-emerald-600" /> : <Package className="w-4 h-4 text-emerald-600" />}
                  Jumlah Donasi
                </div>
                {donation.type === "Uang" ? (
                  <input className="mt-2 w-full rounded-lg border border-slate-300 bg-white text-sm p-2 focus:outline-none focus:ring-2 focus:ring-green-500" value={meta.donationValue} onChange={(e) => setMeta((m) => ({ ...m, donationValue: e.target.value }))} />
                ) : (
                  <textarea className="mt-2 w-full rounded-lg border border-slate-300 bg-white text-sm p-2 focus:outline-none focus:ring-2 focus:ring-green-500" rows={3} value={meta.donationValue} onChange={(e) => setMeta((m) => ({ ...m, donationValue: e.target.value }))} />
                )}
              </div>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
                <div className="flex items-center gap-2 text-slate-800 font-medium"><Info className="w-4 h-4 text-emerald-600" /> Kriteria Penerima Donasi</div>
                <textarea className="mt-2 w-full rounded-lg border border-slate-300 bg-white text-sm p-2 focus:outline-none focus:ring-2 focus:ring-green-500" rows={3} value={meta.criteria} onChange={(e) => setMeta((m) => ({ ...m, criteria: e.target.value }))} />
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm">
              <div className="flex items-center gap-2 text-slate-800 font-medium"><Info className="w-4 h-4 text-emerald-600" /> Keterangan Penyerahan Donasi</div>
              <textarea className="mt-2 w-full rounded-lg border border-slate-300 bg-white text-sm p-2 focus:outline-none focus:ring-2 focus:ring-green-500" rows={3} value={meta.description} onChange={(e) => setMeta((m) => ({ ...m, description: e.target.value }))} />
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {stages.map((s, idx) => (
            <StageCard key={idx} index={idx} stage={s} canRemove={idx > 0} onRemove={() => removeStage(idx)} onChange={(next) => updateStage(idx, next)} onPickRecipients={() => openPicker(idx)} />
          ))}
        </div>

        <div className="mt-4">
          <button type="button" onClick={addStage} className="w-full border-2 border-dashed border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-xl py-3 font-semibold inline-flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Tambah Tahap Penyaluran
          </button>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between">
          <button onClick={() => navigate("/admin/donasi")} className="px-4 py-2 rounded-lg border border-slate-300 bg-white text-slate-800 text-sm font-medium">Batal Perubahan Detail Program</button>
          <button onClick={onSave} className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700">Simpan Perubahan Detail Program</button>
        </div>
      </main>

      <RecipientPickerModal open={picker.open} onClose={closePicker} onSave={savePicker} initialSelected={stages[picker.index]?.recipients || []} />
    </div>
  );
}

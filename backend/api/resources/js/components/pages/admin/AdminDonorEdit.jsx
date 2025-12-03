import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { ArrowLeft, CheckCircle2, X, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { adminAPI } from "../../../utils/api";

export default function AdminDonorEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    nama_organisasi: '',
    email: '',
    nomor_telepon: '',
    alamat: '',
    status: 'aktif'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadDonor();
    }
  }, [id]);

  const loadDonor = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDonorDetail(id);
      console.log('Donor response:', response);
      const data = response.data || response;
      console.log('Donor data:', data);
      setForm({
        nama_organisasi: data.nama_organisasi || '',
        email: data.email || '',
        nomor_telepon: data.nomor_telepon || '',
        alamat: data.alamat || '',
        status: data.status || 'aktif'
      });
      setError(null);
    } catch (err) {
      console.error('Error loading donor:', err);
      setError(err.message || 'Gagal memuat data donatur');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onConfirm = async () => {
    try {
      setSaving(true);
      await adminAPI.updateDonor(id, form);
      setConfirm(false);
      alert('Data donatur berhasil diperbarui');
      navigate(-1);
    } catch (err) {
      console.error('Error updating donor:', err);
      alert(err.message || 'Gagal memperbarui data donatur');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavbarAdmin />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavbarAdmin />
        <div className="mx-auto max-w-4xl px-4 py-6">
          <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-red-700">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <NavbarAdmin />
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-700">
            <ArrowLeft className="w-5 h-5" /> Edit Profil Donatur
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Informasi</h2>
          <div className="mt-3 grid grid-cols-1 gap-4">
            <div>
              <p className="text-xs text-slate-500">Nama Organisasi/Instansi</p>
              <input value={form.nama_organisasi} onChange={onChange("nama_organisasi")} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" placeholder="Nama organisasi (jika ada)" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Email Donatur</p>
              <input type="email" value={form.email} onChange={onChange("email")} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">No. Telepon/WhatsApp</p>
              <input value={form.nomor_telepon} onChange={onChange("nomor_telepon")} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Alamat Lengkap</p>
              <textarea value={form.alamat} onChange={onChange("alamat")} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" rows="3"></textarea>
            </div>
            <div>
              <p className="text-xs text-slate-500">Status</p>
              <select value={form.status} onChange={onChange("status")} className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
                <option value="aktif">Aktif</option>
                <option value="nonaktif">Non-Aktif</option>
              </select>
            </div>
          </div>

          <div className="mt-4">
            <button onClick={() => setConfirm(true)} disabled={saving} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
              {saving ? 'Menyimpan...' : 'Simpan Perubahan Data'}
            </button>
          </div>
        </div>

        {confirm && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
            <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><CheckCircle2 className="w-4 h-4 text-emerald-600"/> Simpan Perubahan Data?</div>
                <button onClick={() => setConfirm(false)} disabled={saving} className="text-slate-500 hover:text-slate-700 disabled:opacity-50"><X className="w-5 h-5"/></button>
              </div>
              <div className="px-4 py-3 text-sm text-slate-700 space-y-2">
                <p>Apakah Anda yakin ingin menyimpan perubahan pada data ini? Pastikan semua informasi yang diperbarui sudah benar sebelum disimpan.</p>
                <p className="text-slate-600">Mohon periksa kembali agar tidak ada kesalahan input.</p>
              </div>
              <div className="flex justify-end gap-2 border-t px-4 py-3">
                <button onClick={() => setConfirm(false)} disabled={saving} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50">Batalkan</button>
                <button onClick={onConfirm} disabled={saving} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
                  {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* eslint-disable no-unused-vars */
import React, { useRef, useState, useEffect } from "react";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { ArrowLeft, CloudUpload, Eye, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { adminAPI } from "../../../utils/api";

export default function AdminRecipientEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({
    no_kk: '',
    nama_kepala: '',
    pekerjaan: '',
    status_anak: '',
    pekerjaan_istri: '',
    alamat: '',
    penghasilan: '',
    nomor_telepon: '',
    jumlah_tanggungan: 0,
    status_verifikasi: 'pending'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const fileInputs = useRef({});

  useEffect(() => {
    if (id) {
      loadRecipient();
    }
  }, [id]);

  const loadRecipient = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getRecipientDetail(id);
      console.log('Recipient response:', response);
      const data = response.data || response;
      console.log('Recipient data:', data);
      setForm({
        no_kk: data.no_kk || '',
        nama_kepala: data.nama_kepala || '',
        pekerjaan: data.pekerjaan || '',
        status_anak: data.status_anak || '',
        pekerjaan_istri: data.pekerjaan_istri || '',
        alamat: data.alamat || '',
        penghasilan: data.penghasilan || '',
        nomor_telepon: data.nomor_telepon || '',
        jumlah_tanggungan: data.jumlah_tanggungan || 0,
        status_verifikasi: data.status_verifikasi || 'pending'
      });
      setError(null);
    } catch (err) {
      console.error('Error loading recipient:', err);
      setError(err.message || 'Gagal memuat data penerima');
    } finally {
      setLoading(false);
    }
  };

  const onChange = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async () => {
    try {
      setSaving(true);
      await adminAPI.updateRecipient(id, form);
      alert('Data penerima berhasil diperbarui');
      navigate(-1);
    } catch (err) {
      console.error('Error updating recipient:', err);
      alert(err.message || 'Gagal memperbarui data penerima');
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
        <div className="mx-auto max-w-5xl px-4 py-6">
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
      <div className="mx-auto max-w-5xl px-4 py-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-700">
          <ArrowLeft className="w-5 h-5" /> Edit Profil Penerima
        </button>

        {/* Data Keluarga */}
        <section className="mt-4 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Data Keluarga</h2>
          <div className="mt-3 grid grid-cols-1 gap-3">
            <div>
              <p className="text-xs text-slate-500">No. Kartu Keluarga</p>
              <input value={form.no_kk} onChange={onChange("no_kk")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Nama Kepala Keluarga</p>
              <input value={form.nama_kepala} onChange={onChange("nama_kepala")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pekerjaan</p>
              <input value={form.pekerjaan} onChange={onChange("pekerjaan")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Status Anak</p>
              <input value={form.status_anak} onChange={onChange("status_anak")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Pekerjaan Istri/Suami</p>
              <input value={form.pekerjaan_istri} onChange={onChange("pekerjaan_istri")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
          </div>
        </section>

        {/* Informasi Lainnya */}
        <section className="mt-5 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Informasi Lainnya</h2>
          <div className="mt-3 grid grid-cols-1 gap-3">
            <div>
              <p className="text-xs text-slate-500">Alamat Lengkap</p>
              <textarea value={form.alamat} onChange={onChange("alamat")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" rows="3"></textarea>
            </div>
            <div>
              <p className="text-xs text-slate-500">Penghasilan</p>
              <input value={form.penghasilan} onChange={onChange("penghasilan")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" placeholder="Contoh: < Rp 1.000.000" />
            </div>
            <div>
              <p className="text-xs text-slate-500">No. Telepon/WhatsApp</p>
              <input value={form.nomor_telepon} onChange={onChange("nomor_telepon")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Jumlah Tanggungan</p>
              <input type="number" min={0} value={form.jumlah_tanggungan} onChange={onChange("jumlah_tanggungan")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Status Verifikasi</p>
              <select value={form.status_verifikasi} onChange={onChange("status_verifikasi")} className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:ring-2 focus:ring-emerald-500">
                <option value="belum_mengajukan">Belum Mengajukan</option>
                <option value="pending">Menunggu</option>
                <option value="disetujui">Disetujui</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>
          </div>
        </section>

        <div className="mt-5 flex gap-3">
          <button onClick={() => navigate(-1)} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
            Batal
          </button>
          <button onClick={save} disabled={saving} className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50">
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
}

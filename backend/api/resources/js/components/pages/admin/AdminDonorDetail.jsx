import React, { useState, useEffect } from "react";
import { ArrowLeft, Calendar, CircleDollarSign, Loader2 } from "lucide-react";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { useNavigate, useParams } from "react-router-dom";
import { adminAPI } from "../../../utils/api";

function formatIDR(n) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n);
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function AdminDonorDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [donor, setDonor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDonorDetail();
  }, [id]);

  const fetchDonorDetail = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDonorDetail(id);
      if (response.success && response.data) {
        console.log('Donor Data:', response.data); // Debug
        setDonor(response.data);
      } else {
        setError('Data donatur tidak ditemukan');
      }
    } catch (err) {
      console.error('Error fetching donor detail:', err);
      setError(err.message || 'Gagal memuat data donatur');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavbarAdmin />
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      </div>
    );
  }

  if (error || !donor) {
    return (
      <div className="min-h-screen bg-slate-50">
        <NavbarAdmin />
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="text-center text-red-600">{error || 'Data tidak ditemukan'}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <NavbarAdmin />
      <div className="mx-auto max-w-5xl px-4 py-6">
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-700">
          <ArrowLeft className="w-5 h-5" /> Detail Profil Donatur
        </button>

        {/* Informasi */}
        <div className="mt-4 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Informasi {donor.jenis_instansi || 'Donatur'}</h2>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {[
              { label: "Nama Organisasi", value: donor.nama_organisasi || '-' },
              { label: "Jenis Instansi", value: donor.jenis_instansi || '-' },
              { label: "Email Donatur", value: donor.email || '-' },
              { label: "No. Telepon/WhatsApp", value: donor.nomor_telepon || '-' },
              { label: "Alamat Lengkap", value: donor.alamat || '-' },
              { label: "Status", value: donor.status === 'aktif' ? 'Aktif' : donor.status === 'nonaktif' ? 'Nonaktif' : 'Menunggu' },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs text-slate-500">{f.label}</p>
                <div className="mt-1 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">{f.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-4 text-center shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-emerald-700">{donor.statistics?.total_programs || 0}</div>
            <div className="text-sm text-slate-600">Program Bantuan</div>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-emerald-700">{formatIDR(donor.statistics?.total_contribution || 0)}</div>
            <div className="text-sm text-slate-600">Total Donasi</div>
          </div>
          <div className="rounded-xl bg-white p-4 text-center shadow-sm border border-slate-200">
            <div className="text-2xl font-bold text-emerald-700">{donor.statistics?.total_recipients || 0}</div>
            <div className="text-sm text-slate-600">Penerima Terbantu</div>
          </div>
        </div>

        {/* Program list */}
        <div className="mt-5 space-y-4">
          {donor.program_bantuan && donor.program_bantuan.length > 0 ? (
            donor.program_bantuan.map((program) => {
              const totalTarget = program.jumlah_penerima || 0;
              const distributed = program.penerima_count || 0;
              const progressPct = totalTarget > 0 ? Math.round((distributed / totalTarget) * 100) : 0;
              
              return (
            <div key={program.id_program} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-800">{program.nama_program}</h3>
                    <p className="text-xs text-slate-600">Donatur: {donor.nama_organisasi || '-'}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                    {program.kategori?.nama_kategori || 'Uang'}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                    <Calendar className="w-3 h-3"/> {formatDate(program.tanggal_mulai)}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1">
                    <Calendar className="w-3 h-3"/> {formatDate(program.tanggal_selesai)}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CircleDollarSign className="w-5 h-5 text-emerald-600"/>
                    <div>
                      <div className="text-slate-700">Jumlah Donasi</div>
                      <div className="text-slate-900 font-semibold">{formatIDR(program.jumlah_bantuan || 0)}</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => navigate(`/admin/penyaluran/${program.id_program}`)} 
                    className="rounded-md bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                  >
                    Detail Program
                  </button>
                </div>

                <div className="mt-4">
                  <div className="mb-1 flex items-center justify-between text-xs text-slate-600">
                    <span>Progress Penyaluran</span>
                    <span>{progressPct}% ({distributed}/{totalTarget} KK)</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>

                <div className="mt-3">
                  <span className={`inline-block w-full text-center rounded-lg border px-4 py-2 text-sm font-medium ${
                    program.status === 'aktif' 
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : program.status === 'selesai'
                      ? 'border-blue-300 bg-blue-50 text-blue-700'
                      : 'border-slate-300 bg-slate-50 text-slate-700'
                  }`}>
                    {program.status === 'aktif' ? 'Program Aktif' :
                     program.status === 'selesai' ? 'Program Selesai' :
                     program.status === 'dijadwalkan' ? 'Dijadwalkan' :
                     'Menunggu'}
                  </span>
                </div>
              </div>
            </div>
              );
            })
          ) : (
            <div className="text-center py-8 text-slate-500">
              Belum ada program bantuan
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

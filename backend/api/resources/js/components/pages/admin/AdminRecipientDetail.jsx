import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { ArrowLeft, Download, Eye, Loader2 } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { adminAPI } from "../../../utils/api";

export default function AdminRecipientDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [recipient, setRecipient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRecipientDetail();
  }, [id]);

  const fetchRecipientDetail = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getRecipientDetail(id);
      if (response.success && response.data) {
        console.log('Recipient Data:', response.data); // Debug
        setRecipient(response.data);
      } else {
        setError('Data penerima tidak ditemukan');
      }
    } catch (err) {
      console.error('Error fetching recipient detail:', err);
      setError(err.message || 'Gagal memuat data penerima');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <NavbarAdmin />
        <div className="mx-auto max-w-5xl px-4 py-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-emerald-600 mx-auto mb-4" />
            <p className="text-slate-600">Memuat data penerima...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !recipient) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800">
        <NavbarAdmin />
        <div className="mx-auto max-w-5xl px-4 py-6">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-700 hover:text-emerald-700">
            <ArrowLeft className="w-5 h-5" /> Kembali
          </button>
          <div className="mt-8 text-center">
            <p className="text-slate-600">{error || 'Data penerima tidak ditemukan'}</p>
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
          <ArrowLeft className="w-5 h-5" /> Detail Profil Penerima
        </button>

        {/* Data Keluarga */}
        <section className="mt-4 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Data Keluarga</h2>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {[
              { label: "No. Kartu Keluarga", value: recipient.no_kk || '-' },
              { label: "Nama Kepala Keluarga", value: recipient.nama_kepala || '-' },
              { label: "Pekerjaan", value: recipient.pekerjaan || '-' },
              { label: "Status Anak", value: recipient.status_anak || '-' },
              { label: "Pekerjaan Istri", value: recipient.pekerjaan_istri || '-' },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs text-slate-500">{f.label}</p>
                <div className="mt-1 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">{f.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Informasi Lainnya */}
        <section className="mt-5 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Informasi Lainnya</h2>
          <div className="mt-3 grid grid-cols-1 gap-3">
            {[
              { label: "Alamat Lengkap", value: recipient.alamat || '-' },
              { 
                label: "Penghasilan", 
                value: recipient.penghasilan 
                  ? (typeof recipient.penghasilan === 'number' 
                      ? `Rp ${recipient.penghasilan.toLocaleString('id-ID')}`
                      : recipient.penghasilan)
                  : '-'
              },
              { label: "No. Telepon/WhatsApp", value: recipient.nomor_telepon || '-' },
              { label: "Jumlah Tanggungan", value: recipient.jumlah_tanggungan ? String(recipient.jumlah_tanggungan) : '-' },
            ].map((f) => (
              <div key={f.label}>
                <p className="text-xs text-slate-500">{f.label}</p>
                <div className="mt-1 rounded-md border border-slate-200 bg-slate-100 px-3 py-2 text-sm text-slate-700">{f.value}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Dokumen Pendukung */}
        <section className="mt-5 rounded-xl border border-emerald-300 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-emerald-700">Dokumen Pendukung</h2>
          {((recipient.dokumen_verifikasi || recipient.dokumenVerifikasi || []).length > 0) ? (
            <div className="mt-3 space-y-4">
              {(recipient.dokumen_verifikasi || recipient.dokumenVerifikasi || []).map((d) => {
                const fileUrl = `/storage/${d.path_file}`;
                const isImage = d.nama_file && /\.(jpg|jpeg|png|gif|webp)$/i.test(d.nama_file);
                
                return (
                <div key={d.id_dokumen} className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="h-32 rounded-lg bg-slate-100 overflow-hidden">
                    {isImage ? (
                      <img 
                        src={fileUrl} 
                        alt={d.jenis_dokumen}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'grid';
                        }}
                      />
                    ) : null}
                    <div className={`h-full grid place-items-center text-slate-400 ${isImage ? 'hidden' : ''}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="M21 15l-5-5L5 21"/>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-3">
                    <div className="text-sm font-medium text-slate-800">{d.jenis_dokumen || 'Dokumen'}</div>
                    <div className="text-xs text-slate-600">{d.nama_file || (d.path_file ? d.path_file.split('/').pop() : 'N/A')}</div>
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    {d.path_file && (
                      <>
                        <a 
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-violet-700"
                        >
                          <Eye className="w-4 h-4"/> Lihat Dokumen
                        </a>
                        <a 
                          href={fileUrl}
                          download
                          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          <Download className="w-4 h-4"/> Unduh Dokumen
                        </a>
                      </>
                    )}
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-3 text-center py-8 text-slate-500 text-sm">
              Tidak ada dokumen pendukung
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

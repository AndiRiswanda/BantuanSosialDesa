import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { Check, Eye, Mail, MoreVertical, Search, ThumbsUp, ThumbsDown, UserX, ShieldCheck, Edit, Lock, Unlock, Trash2, X, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../../utils/api";

const Segmented = ({ value, onChange }) => {
  const items = [
    { key: "pengajuan", label: "Pengajuan Penerima Baru" },
    { key: "donatur", label: "Kelola Akun Donatur" },
    { key: "penerima", label: "Kelola Akun Penerima" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onChange(it.key)}
          className={`flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold transition ${
            value === it.key ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-300 hover:border-emerald-500"
          }`}
          type="button"
        >
          {it.label}
        </button>
      ))}
    </div>
  );
};

export default function AdminVerificationDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("pengajuan");
  const [openDetail, setOpenDetail] = useState({});
  const [query, setQuery] = useState("");
  
  // State for data
  const [pendingRecipients, setPendingRecipients] = useState([]);
  const [donors, setDonors] = useState([]);
  const [recipients, setRecipients] = useState([]);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, [active]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (active === "pengajuan") {
        const response = await adminAPI.getPendingRecipients({ search: query });
        if (response.success && response.data) {
          const data = response.data.data || response.data;
          setPendingRecipients(Array.isArray(data) ? data : []);
        }
      } else if (active === "donatur") {
        const response = await adminAPI.getDonors({ search: query });
        if (response.success && response.data) {
          const data = response.data.data || response.data;
          setDonors(Array.isArray(data) ? data : []);
        }
      } else if (active === "penerima") {
        const response = await adminAPI.getRecipients({ search: query });
        if (response.success && response.data) {
          const data = response.data.data || response.data;
          setRecipients(Array.isArray(data) ? data : []);
        }
      }
    } catch (err) {
      console.error("Error loading data:", err);
      setError(err.message || "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query) {
        loadData();
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [query]);

  const handleVerifyRecipient = async (id, status) => {
    try {
      setActionLoading(true);
      await adminAPI.verifyRecipient(id, { 
        status_verifikasi: status 
      });
      loadData();
      alert(status === 'terverifikasi' ? 'Penerima berhasil diverifikasi' : 'Pengajuan ditolak');
    } catch (err) {
      console.error("Error verifying recipient:", err);
      alert(err.message || "Gagal memverifikasi penerima");
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyDonor = async (id, status) => {
    try {
      setActionLoading(true);
      await adminAPI.verifyDonor(id, { status });
      loadData();
      alert(status === 'aktif' ? 'Donatur berhasil diverifikasi' : 'Verifikasi donatur ditolak');
    } catch (err) {
      console.error("Error verifying donor:", err);
      alert(err.message || "Gagal memverifikasi donatur");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteDonor = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus donatur ini?')) return;
    
    try {
      setActionLoading(true);
      await adminAPI.deleteDonor(id);
      loadData();
      alert('Donatur berhasil dihapus');
      setConfirmDelete(null);
    } catch (err) {
      console.error("Error deleting donor:", err);
      alert(err.message || "Gagal menghapus donatur");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRecipient = async (id) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus penerima ini?')) return;
    
    try {
      setActionLoading(true);
      await adminAPI.deleteRecipient(id);
      loadData();
      alert('Penerima berhasil dihapus');
      setConfirmDelete(null);
    } catch (err) {
      console.error("Error deleting recipient:", err);
      alert(err.message || "Gagal menghapus penerima");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <NavbarAdmin />
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-slate-800">Verifikasi & Manajemen Akun</h1>
          <p className="text-sm text-slate-600">Kelola pengajuan penerima baru, akun donatur, dan akun penerima bantuan.</p>
        </div>

        <Segmented value={active} onChange={setActive} />

        <div className="mt-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={active === "donatur" ? "Cari nama donatur atau email" : "Cari Nama Penerima atau NIK"}
              className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
            <div>
              <div className="text-red-800 font-semibold">Gagal Memuat Data</div>
              <div className="text-red-700 text-sm">{error}</div>
              <button 
                onClick={loadData}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-slate-600">Memuat data...</span>
          </div>
        )}

        {!loading && active === "pengajuan" && (
          <section className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <span role="img" aria-label="sparkles">✨</span>
              <h2 className="text-sm font-semibold">Verifikasi Pengajuan Penerima Baru</h2>
            </div>
            <div className="space-y-4">
              {pendingRecipients.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
                  <p className="text-slate-600 text-sm">Tidak ada pengajuan penerima yang menunggu verifikasi.</p>
                </div>
              ) : (
                pendingRecipients.map((recipient) => {
                  const open = !!openDetail[recipient.id_penerima];
                  return (
                    <div key={recipient.id_penerima} className="rounded-xl border border-slate-200 bg-white shadow-sm">
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-base font-semibold text-slate-800">{recipient.nama_kepala}</h3>
                            <p className="text-xs text-slate-600">NIK/No. KK: {recipient.no_kk}</p>
                            <p className="mt-1 text-xs text-slate-600">Alamat: {recipient.alamat || '-'}</p>
                            <div className="mt-2 inline-flex items-center gap-2">
                              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                                {recipient.pekerjaan || 'Tidak Bekerja'}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
                              {recipient.status_verifikasi === 'pending' ? 'Pending' : recipient.status_verifikasi}
                            </span>
                          </div>
                        </div>

                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => setOpenDetail((m) => ({ ...m, [recipient.id_penerima]: !m[recipient.id_penerima] }))}
                            className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                          >
                            {open ? "Sembunyikan Detail" : "Lihat Detail Lengkap"}
                          </button>
                        </div>

                        {open && (
                          <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs text-slate-500">Pekerjaan</p>
                                  <p className="font-medium">{recipient.pekerjaan || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500">Jumlah Tanggungan</p>
                                  <p className="font-medium">{recipient.jumlah_tanggungan || 0} orang</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500">Penghasilan</p>
                                  <p className="font-medium">{recipient.penghasilan || '-'}</p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs text-slate-500">Pekerjaan Istri/Suami</p>
                                  <p className="font-medium">{recipient.pekerjaan_istri || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500">No. Telepon / WhatsApp</p>
                                  <p className="font-medium">{recipient.nomor_telepon || '-'}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-slate-500">Status Anak</p>
                                  <p className="font-medium">{recipient.status_anak || '-'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-3">
                          <button 
                            onClick={() => handleVerifyRecipient(recipient.id_penerima, 'terverifikasi')}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <ThumbsUp className="w-4 h-4" /> Setujui
                          </button>
                          <button 
                            onClick={() => handleVerifyRecipient(recipient.id_penerima, 'ditolak')}
                            disabled={actionLoading}
                            className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
                          >
                            <ThumbsDown className="w-4 h-4" /> Tolak
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </section>
        )}

        {!loading && active === "donatur" && (
          <section className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <span role="img" aria-label="donor">🧑‍💼</span>
              <h2 className="text-sm font-semibold">Kelola Data Donatur</h2>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100">
                  <tr className="text-left text-slate-700">
                    <th className="px-3 py-2">Nama Donatur</th>
                    <th className="px-3 py-2">Jenis</th>
                    <th className="px-3 py-2">Alamat</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Aksi</th>
                  </tr>
                </thead>
                {donors.length === 0 ? (
                  <tbody>
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-600">
                        Tidak ada data donatur.
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody className="divide-y divide-slate-200">
                    {donors.map((donor) => (
                      <tr key={donor.id_donatur}>
                        <td className="px-3 py-2">
                          <button 
                            type="button" 
                            onClick={() => navigate(`/admin/donors/${donor.id_donatur}`)} 
                            className="text-left text-emerald-700 hover:underline"
                          >
                            {donor.nama_organisasi || donor.nama_lengkap}
                          </button>
                        </td>
                        <td className="px-3 py-2">{donor.nama_organisasi ? 'Organisasi' : 'Individu'}</td>
                        <td className="px-3 py-2 text-xs">{donor.alamat || '-'}</td>
                        <td className="px-3 py-2">{donor.email}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                            donor.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {donor.status}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            {donor.status === 'nonaktif' && (
                              <button 
                                onClick={() => handleVerifyDonor(donor.id_donatur, 'aktif')}
                                disabled={actionLoading}
                                className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 disabled:opacity-50" 
                                title="Verifikasi"
                              >
                                <ShieldCheck className="w-4 h-4"/>
                              </button>
                            )}
                            <button 
                              onClick={() => navigate(`/admin/donors/${donor.id_donatur}/edit`)} 
                              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200" 
                              title="Ubah"
                            >
                              <Edit className="w-4 h-4"/>
                            </button>
                            <button 
                              onClick={() => handleDeleteDonor(donor.id_donatur)}
                              disabled={actionLoading}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50" 
                              title="Hapus Akun"
                            >
                              <Trash2 className="w-4 h-4"/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </section>
        )}

        {!loading && active === "penerima" && (
          <section className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <span role="img" aria-label="recipient">👨‍👩‍👧‍👦</span>
              <h2 className="text-sm font-semibold">Kelola Akun Penerima</h2>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100">
                  <tr className="text-left text-slate-700">
                    <th className="px-3 py-2">Nama</th>
                    <th className="px-3 py-2">No. KK</th>
                    <th className="px-3 py-2">Alamat</th>
                    <th className="px-3 py-2">No. HP</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Aksi</th>
                  </tr>
                </thead>
                {recipients.length === 0 ? (
                  <tbody>
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm text-slate-600">
                        Tidak ada data penerima.
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody className="divide-y divide-slate-200">
                    {recipients.map((recipient) => (
                      <tr key={recipient.id_penerima}>
                        <td className="px-3 py-2">
                          <button 
                            type="button" 
                            onClick={() => navigate(`/admin/recipients/${recipient.id_penerima}`)} 
                            className="text-left text-emerald-700 hover:underline"
                          >
                            {recipient.nama_kepala}
                          </button>
                        </td>
                        <td className="px-3 py-2">{recipient.no_kk}</td>
                        <td className="px-3 py-2 text-xs">{recipient.alamat || '-'}</td>
                        <td className="px-3 py-2">{recipient.nomor_telepon || '-'}</td>
                        <td className="px-3 py-2">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
                            recipient.status_verifikasi === 'terverifikasi' ? 'bg-emerald-100 text-emerald-700' : 
                            recipient.status_verifikasi === 'pending' ? 'bg-amber-100 text-amber-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {recipient.status_verifikasi}
                          </span>
                        </td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => navigate(`/admin/recipients/${recipient.id_penerima}/edit`)} 
                              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700 hover:bg-amber-200" 
                              title="Ubah"
                            >
                              <Edit className="w-4 h-4"/>
                            </button>
                            <button 
                              onClick={() => handleDeleteRecipient(recipient.id_penerima)}
                              disabled={actionLoading}
                              className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-700 hover:bg-red-200 disabled:opacity-50" 
                              title="Hapus Akun"
                            >
                              <Trash2 className="w-4 h-4"/>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

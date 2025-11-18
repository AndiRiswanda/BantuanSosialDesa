import React, { useEffect, useState } from "react";
import NavbarRecipient from "../../layout/NavbarRecipient";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, FileDown, FileText, Image as ImageIcon, LogOut, Receipt, ShieldCheck, UserCircle2 } from "lucide-react";
import { recipientAPI } from "../../../utils/api";

function Section({ title, children }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200">
      <header className="px-4 sm:px-5 py-3 border-b border-slate-200">
        <h3 className="text-[#0B2B5E] font-semibold">{title}</h3>
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function Field({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-slate-600">{label}</div>
      <div className="rounded-md bg-slate-100/70 border border-slate-200 px-3 py-2 text-sm text-slate-800">{value}</div>
    </div>
  );
}

function Pill({ className = "", children }) {
  return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${className}`}>{children}</span>;
}

function SidebarItem({ active, icon: Icon, children, onClick }) {
  return (
    <button onClick={onClick} className={`w-full inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-semibold ${active ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-[#0B2B5E] border-slate-300 hover:bg-slate-50"}`}>
      {Icon && <Icon className="w-4 h-4" />} {children}
    </button>
  );
}

function Modal({ open, onClose, title, children, primary, onPrimary }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-[#0B2B5E] font-semibold mb-1">{title}</h4>
              <div className="text-sm text-slate-700">{children}</div>
            </div>
            <button onClick={onClose} className="ml-2 text-slate-500 hover:text-slate-700">✕</button>
          </div>
          <div className="mt-5 flex gap-3 justify-end">
            <button onClick={onClose} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 font-medium hover:bg-slate-50">Batal</button>
            <button onClick={onPrimary} className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700">Keluar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecipientProfile() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("data"); // data | bantuan | dokumen
  const [showLogout, setShowLogout] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await recipientAPI.getProfile();
      console.log('Profile data:', response);
      
      if (response.success) {
        setProfileData(response);
      } else {
        setError('Gagal memuat data profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError(err.message || 'Gagal memuat data profile');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
        <NavbarRecipient />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Memuat data profile...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
        <NavbarRecipient />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto" />
            <p className="mt-4 text-slate-600">{error}</p>
            <button 
              onClick={fetchProfile}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Coba Lagi
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!profileData) {
    return null;
  }

  const profileInfo = profileData.profile;
  const programs = profileData.programs || [];
  const documents = profileData.documents || [];
  const stats = profileData.program_stats || {
    total: 0,
    disetujui: 0,
    menunggu: 0,
    selesai: 0,
    ditolak: 0,
  };

  // Mask No. KK untuk keamanan (show first 4 and last 4 digits)
  const maskedKK = profileInfo.no_kk ? 
    `${profileInfo.no_kk.substring(0, 4)}****${profileInfo.no_kk.substring(12)}` : 
    'N/A';

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'N/A';
    const parts = name.split(' ');
    return parts.length > 1 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  };

  // Format status verifikasi badge
  const getStatusBadge = () => {
    switch (profileInfo.status_verifikasi) {
      case 'disetujui':
        return (
          <Pill className="bg-white/90 text-emerald-800">
            <ShieldCheck className="w-4 h-4" /> Anda Terdaftar Untuk Dapat Menerima Bantuan
          </Pill>
        );
      case 'pending':
        return (
          <Pill className="bg-amber-100 text-amber-800">
            Menunggu Verifikasi
          </Pill>
        );
      case 'ditolak':
        return (
          <Pill className="bg-rose-100 text-rose-800">
            Ditolak
          </Pill>
        );
      default:
        return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login/penerima');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarRecipient />

      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-4">
          {/* Sidebar */}
          <aside className="space-y-3 self-start">
            <SidebarItem active={tab === "data"} onClick={() => setTab("data")} icon={UserCircle2}>Data Profil</SidebarItem>
            <SidebarItem active={tab === "bantuan"} onClick={() => setTab("bantuan")} icon={Receipt}>Bantuan Diterima</SidebarItem>
            <SidebarItem active={tab === "dokumen"} onClick={() => setTab("dokumen")} icon={FileText}>Dokumen</SidebarItem>
            <SidebarItem active={false} onClick={() => setShowLogout(true)} icon={LogOut}>Keluar</SidebarItem>
          </aside>

          {/* Main content */}
          <div className="space-y-4">
            {/* Header card */}
            <section className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl shadow-sm text-white p-4 sm:p-6 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-white/90 text-emerald-700 flex items-center justify-center text-xl font-bold">
                    {getInitials(profileInfo.nama_kepala)}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold leading-tight">{profileInfo.nama_kepala || 'N/A'}</h1>
                    <p className="text-sm opacity-95">Kepala Keluarga</p>
                    <p className="text-sm opacity-95">No. KK : {maskedKK}</p>
                    <div className="mt-2">
                      {getStatusBadge()}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="rounded-md bg-black/10 px-3 py-1 text-xs">
                    {profileInfo.jumlah_tanggungan || 0} Tanggungan
                  </div>
                  <div className="rounded-md bg-black/10 px-3 py-1 text-xs">
                    {stats.total || 0} Program Diikuti
                  </div>
                </div>
              </div>
            </section>

            {tab === "data" && (
              <div className="space-y-4">
                <Section title="Data Keluarga">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="No. Kartu Keluarga" value={profileInfo.no_kk || 'N/A'} />
                    <Field label="Nama Kepala Keluarga" value={profileInfo.nama_kepala || 'N/A'} />
                    <Field label="Pekerjaan" value={profileInfo.pekerjaan || 'N/A'} />
                    <Field label="Status Anak" value={profileInfo.status_anak || 'N/A'} />
                    <Field label="Status Pekerjaan Istri" value={profileInfo.pekerjaan_istri || 'N/A'} />
                  </div>
                </Section>

                <Section title="Informasi Lainnya">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Alamat Lengkap" value={profileInfo.alamat || 'N/A'} />
                    <Field label="Penghasilan" value={profileInfo.penghasilan || 'N/A'} />
                    <Field label="No. Telepon/WhatsApp" value={profileInfo.nomor_telepon || 'N/A'} />
                    <Field label="Jumlah Tanggungan" value={String(profileInfo.jumlah_tanggungan || 0)} />
                  </div>
                </Section>

                <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="text-[#0B2B5E] font-semibold">Pemberitahuan Perubahan Data Penerima Bantuan</h4>
                      <p className="text-sm text-slate-800 mt-1">Apabila terdapat perubahan pada data diri Anda (seperti alamat, status keluarga, pekerjaan, atau kondisi ekonomi), silakan segera <span className="font-semibold">menghubungi admin desa melalui kontak di bawah ini</span>.</p>
                      <div className="mt-2 text-sm text-slate-700 space-y-0.5">
                        <div>☎ Admin Desa: 0812-xxxx-xxxx</div>
                        <div>Email : desaku@gmail.com</div>
                      </div>
                      <p className="text-sm text-slate-700 mt-2">atau datang langsung ke Kantor Desa Sejahtera untuk proses pembaruan data.</p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {tab === "bantuan" && (
              <div className="space-y-4">
                {programs.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                    <Receipt className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600">Belum ada program yang diikuti</p>
                  </div>
                ) : (
                  programs.map((p) => (
                    <section key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-slate-900 font-semibold">{p.title}</h3>
                          <p className="text-xs text-slate-600">Donatur: {p.donor}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <Pill className="bg-slate-100 text-slate-700">{p.start_date}</Pill>
                            <Pill className="bg-slate-100 text-slate-700">{p.end_date}</Pill>
                            <Pill className="bg-blue-50 text-blue-700 border border-blue-200">{p.type}</Pill>
                          </div>
                        </div>
                        <Pill className={`${
                          p.status === "selesai" 
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                            : p.status === "disetujui"
                            ? "bg-blue-100 text-blue-800 border border-blue-200"
                            : p.status === "menunggu"
                            ? "bg-amber-100 text-amber-800 border border-amber-200"
                            : "bg-rose-100 text-rose-800 border border-rose-200"
                        }`}>
                          {p.status === 'disetujui' ? 'Disetujui' : 
                           p.status === 'menunggu' ? 'Menunggu' : 
                           p.status === 'selesai' ? 'Selesai' : 'Ditolak'}
                        </Pill>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <div className="text-sm font-medium text-slate-800">Kategori: {p.category}</div>
                        <div className="text-sm text-slate-700 mt-1">
                          Total Diterima: <span className="font-semibold">{p.total_received_formatted}</span>
                        </div>
                        <div className="text-xs text-slate-600 mt-1">
                          Transaksi: {p.transaction_count}x penyaluran
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <button 
                          onClick={() => navigate(`/penerima/program/${p.program_id}`)} 
                          className="px-4 py-2 rounded-md border border-slate-300 bg-white text-slate-800 font-medium hover:bg-slate-50"
                        >
                          Detail Program
                        </button>
                      </div>
                    </section>
                  ))
                )}
              </div>
            )}
            {tab === "dokumen" && (
              <div className="space-y-4">
                {documents.length === 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600">Belum ada dokumen yang diupload</p>
                  </div>
                ) : (
                  documents.map((d) => (
                    <section key={d.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-3">
                      <div className="aspect-[16/6] rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                        <FileText className="w-16 h-16 text-slate-400" />
                      </div>
                      <div>
                        <h4 className="text-slate-900 font-semibold">{d.jenis_dokumen}</h4>
                        <p className="text-xs text-slate-600">{d.nama_file}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Ukuran: {d.ukuran_file_formatted} • Upload: {d.uploaded_at}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <a 
                          href={d.url} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-white font-semibold hover:bg-violet-700"
                        >
                          <ImageIcon className="w-4 h-4" /> Lihat Dokumen
                        </a>
                        <a 
                          href={d.url} 
                          download={d.nama_file}
                          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700"
                        >
                          <FileDown className="w-4 h-4" /> Unduh Dokumen
                        </a>
                      </div>
                    </section>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Logout modal */}
      <Modal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        title="Konfirmasi Keluar Akun"
        onPrimary={handleLogout}
      >
        Apakah Anda yakin ingin keluar dari akun ini? Semua sesi aktif akan ditutup dan Anda harus login kembali untuk mengakses sistem.
      </Modal>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

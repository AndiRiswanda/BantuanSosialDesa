import React, { useEffect, useState } from "react";
import NavbarRecipient from "../../layout/NavbarRecipient";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Download, Eye, FileText, User } from "lucide-react";
import { recipientAPI } from "../../../utils/api";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

function Field({ label, value }) {
  return (
    <div className="space-y-1.5">
      <div className="text-sm text-slate-600">{label}</div>
      <div className="bg-slate-100 rounded-lg px-3 py-2.5 text-slate-800">{value || "-"}</div>
    </div>
  );
}

function LogoutModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-[92%] max-w-md rounded-2xl bg-[#E8F1FF] p-5 shadow-xl">
        <div className="text-sm font-semibold text-[#0B2B5E]">Konfirmasi Keluar Akun</div>
        <p className="mt-2 text-sm text-slate-700">
          Apakah Anda yakin ingin keluar dari akun ini? Semua sesi aktif akan ditutup dan Anda harus login kembali untuk mengakses sistem.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Batal</button>
          <button onClick={onConfirm} className="rounded-lg bg-[#43A047] px-4 py-2 text-sm font-semibold text-white">Keluar</button>
        </div>
      </div>
    </div>
  );
}

function DocumentCard({ document }) {
  const imageUrl = document.file_path 
    ? `${API_BASE_URL}/storage/${document.file_path}`
    : null;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      {/* Document Preview */}
      <div className="aspect-[16/9] bg-slate-100 flex items-center justify-center relative">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={document.jenis_dokumen}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ) : (
          <FileText className="w-16 h-16 text-slate-300" />
        )}
      </div>

      {/* Document Info */}
      <div className="p-4">
        <h4 className="font-semibold text-slate-900 mb-1">{document.jenis_dokumen}</h4>
        <p className="text-sm text-slate-600">{document.nama_file}</p>

        {/* Action Buttons */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <a
            href={imageUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors"
          >
            <Eye className="w-4 h-4" /> Lihat Dokumen
          </a>
          <a
            href={imageUrl}
            download={document.nama_file}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            <Download className="w-4 h-4" /> Unduh Dokumen
          </a>
        </div>
      </div>
    </div>
  );
}

function ProgramCard({ program, onDetailClick }) {
  const getStatusBadge = () => {
    const statusMap = {
      'disetujui': { bg: 'bg-green-100', text: 'text-green-800', label: '✓ Disetujui' },
      'selesai': { bg: 'bg-emerald-100', text: 'text-emerald-800', label: '✓ Selesai' },
      'menunggu': { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Menunggu' },
      'pending': { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Menunggu' },
      'ditolak': { bg: 'bg-red-100', text: 'text-red-800', label: '✕ Ditolak' },
    };
    
    const status = statusMap[program.status] || statusMap.menunggu;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.text}`}>
        {status.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <div className="text-xs text-slate-600">Jumlah Donasi</div>
            <div className="font-bold text-slate-900">{program.title}</div>
          </div>
        </div>
        {getStatusBadge()}
      </div>

      <div className="bg-emerald-50 rounded-lg p-3 mb-4">
        <div className="flex items-center gap-2 text-sm mb-2">
          <svg className="w-4 h-4 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          <span className="font-medium text-emerald-900">Jadwal Pengambilan Bantuan Anda</span>
        </div>
        <p className="text-xs text-emerald-700">Jangan Lupa Datang Sesuai Pembagian Waktu Anda</p>
      </div>

      <button
        onClick={onDetailClick}
        className="w-full px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-800 font-medium hover:bg-slate-50 transition-colors"
      >
        Detail Program
      </button>
    </div>
  );
}

export default function RecipientProfile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("data");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileData, setProfileData] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
        setProfileData(response.profile);
        
        // Set programs from profile response
        if (response.programs) {
          setPrograms(response.programs);
        }
        
        // Set documents from profile response
        if (response.documents) {
          setDocuments(response.documents);
        }
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

  // Mask No. KK untuk keamanan
  const maskedKK = profileData.no_kk && profileData.no_kk.length >= 8
    ? `${profileData.no_kk.substring(0, 4)}****${profileData.no_kk.substring(profileData.no_kk.length - 4)}`
    : profileData.no_kk || 'N/A';

  // Get initials for avatar
  const getInitials = (name) => {
    if (!name) return 'NA';
    const parts = name.trim().split(' ');
    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return parts[0].substring(0, 2).toUpperCase();
  };

  const hasSubmittedApplication = profileData.status_verifikasi !== 'belum_mengajukan';

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login/penerima');
  };

  return (
    <div className="min-h-screen bg-[#E6EFFA]">
      <NavbarRecipient />

      <main className="px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto">
        {/* Sidebar + Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[200px,1fr] gap-4">
          {/* Sidebar */}
          <aside className="space-y-3">
            <button
              onClick={() => setActiveTab("data")}
              className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-colors ${
                activeTab === "data"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              <User className="w-4 h-4" /> Data Profil
            </button>
            <button
              onClick={() => setActiveTab("bantuan")}
              className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-colors ${
                activeTab === "bantuan"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Bantuan Diterima
            </button>
            {hasSubmittedApplication && (
              <button
                onClick={() => setActiveTab("dokumen")}
                className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium transition-colors ${
                  activeTab === "dokumen"
                    ? "bg-emerald-600 text-white border-emerald-600"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                <FileText className="w-4 h-4" /> Dokumen
              </button>
            )}
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-2 px-4 py-2.5 rounded-lg border font-medium bg-white text-slate-700 border-slate-300 hover:bg-slate-50 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Keluar
            </button>
          </aside>

          {/* Main Content */}
          <div className="space-y-4">
            {/* Profile Header Card */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl p-5 text-white relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-emerald-700 font-bold text-xl">
                    {getInitials(profileData.nama_kepala)}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold mb-0.5">{profileData.nama_kepala || 'N/A'}</h1>
                    <p className="text-sm opacity-90">Kepala Keluarga</p>
                    <p className="text-sm opacity-90">Nomor KK : {maskedKK}</p>
                    {profileData.status_verifikasi === 'disetujui' && (
                      <div className="mt-2 inline-flex items-center gap-1 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                        Anda Terdaftar Untuk Dapat Menerima Bantuan
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end">
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium">
                    {profileData.jumlah_tanggungan || 0} Tanggungan
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-medium">
                    {programs.length || 0} Bantuan Diterima
                  </div>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "data" && (
              <div className="space-y-4">
                {/* Data Keluarga Section */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
                    <h2 className="font-semibold text-slate-900">Data Keluarga</h2>
                  </div>
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="No. Kartu Keluarga" value={profileData.no_kk} />
                    <Field label="Nama Kepala Keluarga" value={profileData.nama_kepala} />
                    <Field label="Pekerjaan" value={profileData.pekerjaan} />
                    <Field label="Status Anak" value={profileData.status_anak} />
                    <Field label="Status Pekerjaan Istri" value={profileData.pekerjaan_istri} />
                  </div>
                </div>

                {/* Informasi Lainnya Section */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 border-b border-slate-200 px-5 py-3">
                    <h2 className="font-semibold text-slate-900">Informasi Lainnya</h2>
                  </div>
                  <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Alamat Lengkap" value={profileData.alamat} />
                    <Field label="Penghasilan" value={profileData.penghasilan} />
                    <Field label="No. Telepon/WhatsApp" value={profileData.nomor_telepon} />
                    <Field label="Jumlah Tanggungan" value={String(profileData.jumlah_tanggungan || 0)} />
                  </div>
                </div>

                {/* Warning Notice */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">
                        Pemberitahuan Perubahan Data Penerima Bantuan
                      </h3>
                      <p className="text-sm text-slate-700 mb-2">
                        Apabila terdapat perubahan pada data diri Anda (seperti alamat, status keluarga, pekerjaan, atau kondisi ekonomi), 
                        silakan segera menghubungi admin desa melalui kontak di bawah ini.
                      </p>
                      <div className="text-sm text-slate-700 space-y-1 mb-2">
                        <div>☎ <strong>Admin Desa: 0812-xxxx-xxxx</strong></div>
                        <div>✉ Email: <strong>desaku@gmail.com</strong></div>
                      </div>
                      <p className="text-sm text-slate-700">
                        atau datang langsung ke Kantor Desa Sejahtera untuk proses pembaruan data.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bantuan" && (
              <div className="space-y-4">
                {programs.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <svg className="w-16 h-16 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                    </svg>
                    <p className="text-slate-600 font-medium">Anda menerima bantuan ini</p>
                  </div>
                ) : (
                  programs.map((program) => (
                    <ProgramCard
                      key={program.id}
                      program={program}
                      onDetailClick={() => navigate(`/penerima/program/${program.program_id}`)}
                    />
                  ))
                )}
              </div>
            )}

            {activeTab === "dokumen" && hasSubmittedApplication && (
              <div className="space-y-4">
                {documents.length === 0 ? (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
                    <FileText className="w-16 h-16 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-600 font-medium">Belum ada dokumen yang diupload</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {documents.map((doc) => (
                      <DocumentCard key={doc.id} document={doc} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Logout Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}

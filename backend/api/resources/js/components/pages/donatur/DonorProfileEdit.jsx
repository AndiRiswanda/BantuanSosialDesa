import React, { useState, useEffect } from "react";
import NavbarDonatur from "../../layout/NavbarDonatur";
import { ArrowLeft, ShieldCheck, User, Pencil, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";

function SaveConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-[92%] max-w-md rounded-2xl bg-[#E8F1FF] p-5 shadow-xl">
        <div className="text-sm font-semibold text-[#0B2B5E]">Simpan Perubahan Data?</div>
        <p className="mt-2 text-sm text-slate-700">
          Apakah Anda yakin ingin menyimpan perubahan pada data ini? Pastikan semua informasi yang diperbarui sudah benar sebelum disimpan.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Batalkan</button>
          <button onClick={onConfirm} className="rounded-lg bg-[#43A047] px-4 py-2 text-sm font-semibold text-white">Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
}

function LogoutConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-[92%] max-w-md rounded-2xl bg-[#E8F1FF] p-5 shadow-xl">
        <div className="text-sm font-semibold text-[#0B2B5E]">Konfirmasi Keluar Akun</div>
        <p className="mt-2 text-sm text-slate-700">Apakah Anda yakin ingin keluar dari akun ini?</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Batal</button>
          <button onClick={onConfirm} className="rounded-lg bg-[#43A047] px-4 py-2 text-sm font-semibold text-white">Keluar</button>
        </div>
      </div>
    </div>
  );
}

export default function DonorProfileEdit() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const { pathname } = useLocation();
  
  // State for profile data
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    nama_organisasi: "",
    email: "",
    alamat: "",
    nomor_telepon: "",
    jenis_instansi: ""
  });
  const [emailError, setEmailError] = useState("");

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        console.log("=== Fetching Profile for Edit ===");
        const response = await api.get("/api/donatur/profile");
        console.log("Profile Response:", response.data);
        
        setProfileData(response.data);
        setFormData({
          nama_organisasi: response.data.nama_organisasi || "",
          email: response.data.email || "",
          alamat: response.data.alamat || "",
          nomor_telepon: response.data.nomor_telepon || "",
          jenis_instansi: response.data.jenis_instansi || ""
        });
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'email') {
      setEmailError('');
    }
  };

  const handleSave = async () => {
    try {
      // Validate all required fields
      if (!formData.nama_organisasi.trim()) {
        alert('Nama instansi wajib diisi');
        return;
      }

      if (!formData.email.trim()) {
        alert('Email wajib diisi');
        return;
      }

      // Validate email format
      const emailRegex = /\S+@\S+\.\S+/;
      if (!emailRegex.test(formData.email)) {
        setEmailError('Format email tidak valid');
        return;
      }

      if (!formData.jenis_instansi) {
        alert('Jenis donatur wajib dipilih');
        return;
      }

      setSaving(true);
      console.log("=== Saving Profile ===");
      console.log("Form Data:", formData);

      const response = await api.put("/api/donatur/profile", formData);
      console.log("Save Response:", response.data);

      // Update local state with response
      if (response.data.data) {
        setProfileData(response.data.data);
        
        // Update localStorage with new data
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...currentUser,
          ...response.data.data
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log("LocalStorage updated with:", updatedUser);
      }
      
      setShowConfirm(false);
      
      // Show success message
      alert('Profil berhasil diperbarui!');
      
      // Navigate back to profile
      navigate('/donatur/profil');
    } catch (error) {
      console.error("=== ERROR SAVING PROFILE ===");
      console.error("Error object:", error);
      console.error("Error response:", error.response);
      console.error("Error status:", error.response?.status);
      console.error("Error data:", error.response?.data);
      
      // Handle validation errors from backend
      if (error.response?.status === 422) {
        const errors = error.response.data.errors;
        const errorMessages = Object.values(errors).flat().join('\n');
        alert('Validasi gagal:\n' + errorMessages);
      } else if (error.response?.status === 500) {
        console.error("Server error 500:", error.response.data);
        alert("Terjadi kesalahan server. Cek console untuk detail error.");
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Gagal menyimpan perubahan. Cek console untuk detail error.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login/donatur');
  };

  // Get initials from organization name
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 3);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <NavbarDonatur />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-slate-600">Memuat data profil...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavbarDonatur />
      <div className="bg-[#1976d26c]/30">
        <div className="max-w-6xl mx-auto px-3 py-2 text-sm text-[#0B2B5E] flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 hover:text-green-700">
            <ArrowLeft className="w-4 h-4" />
            <span>Profil</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-[240px,1fr] gap-4">
        {/* Left actions card */}
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-3 space-y-2 h-fit">
          <Link
            to="/donatur/profil"
            aria-current={pathname === "/donatur/profil" ? "page" : undefined}
            className={`w-full inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
              pathname === "/donatur/profil"
                ? "bg-green-600 text-white border-green-600 shadow"
                : "bg-white text-[#0B2B5E] border-green-600 hover:bg-green-50"
            }`}
          >
            <User className="w-4 h-4"/> Data Profil
          </Link>
          <Link
            to="/donatur/profil/edit"
            aria-current={pathname === "/donatur/profil/edit" ? "page" : undefined}
            className={`w-full inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 ${
              pathname === "/donatur/profil/edit"
                ? "bg-green-600 text-white border-green-600 shadow"
                : "bg-white text-[#0B2B5E] border-green-600 hover:bg-green-50"
            }`}
          >
            <Pencil className="w-4 h-4"/> Edit Data Profil
          </Link>
          <button onClick={() => setShowLogout(true)} className="w-full inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200"><LogOut className="w-4 h-4"/> Keluar</button>
        </div>

        {/* Right content: summary card + edit form */}
        <div className="space-y-4">
          <div className="rounded-2xl bg-linear-to-br from-green-500 to-green-600 p-4 text-white shadow">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-lg font-extrabold">
                {getInitials(formData.nama_organisasi)}
              </div>
              <div>
                <div className="text-lg font-extrabold">{formData.nama_organisasi || "Nama Organisasi"}</div>
                <div className="mt-1 inline-flex items-center gap-1 rounded bg-white/20 px-2 py-0.5 text-xs">
                  <ShieldCheck className="w-3.5 h-3.5"/> 
                  {formData.jenis_instansi === 'perorangan' ? 'Perorangan' : 
                   formData.jenis_instansi === 'yayasan' ? 'Yayasan' : 
                   formData.jenis_instansi === 'perusahaan' ? 'Perusahaan' :
                   formData.jenis_instansi || 'Jenis Instansi'}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-green-200 shadow-sm p-4 md:p-5">
          <div className="font-semibold text-[#0B2B5E] mb-3">Edit Data Donatur</div>
          <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <div className="text-sm text-slate-600 mb-1">Nama Instansi</div>
              <input 
                value={formData.nama_organisasi}
                onChange={(e) => handleInputChange('nama_organisasi', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" 
                placeholder="Masukkan nama instansi"
              />
            </div>
            
            <div>
              <div className="text-sm text-slate-600 mb-1">Email Instansi</div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="email@example.com"
              />
              {emailError && <div className="text-sm text-red-600 mt-1">{emailError}</div>}
            </div>
            
            <div>
              <div className="text-sm text-slate-600 mb-1">Alamat Instansi</div>
              <textarea
                value={formData.alamat}
                onChange={(e) => handleInputChange('alamat', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Masukkan alamat lengkap"
                rows="3"
              />
            </div>
            
            <div>
              <div className="text-sm text-slate-600 mb-1">No. Telepon/WhatsApp</div>
              <input
                type="tel"
                value={formData.nomor_telepon}
                onChange={(e) => handleInputChange('nomor_telepon', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="08xxxxxxxxxx"
              />
            </div>
            
            <div>
              <div className="text-sm text-slate-600 mb-1">Jenis Donatur</div>
              <select
                value={formData.jenis_instansi}
                onChange={(e) => handleInputChange('jenis_instansi', e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Pilih jenis donatur</option>
                <option value="perorangan">Perorangan</option>
                <option value="yayasan">Yayasan</option>
                <option value="perusahaan">Perusahaan</option>
              </select>
            </div>

            <div className="pt-2">
              <button 
                type="button" 
                onClick={() => {
                  // validate email before showing confirm modal
                  const re = /\S+@\S+\.\S+/;
                  if (!re.test(formData.email)) {
                    setEmailError('Format email tidak valid');
                    return;
                  }
                  setEmailError('');
                  setShowConfirm(true);
                }} 
                disabled={saving}
                className="rounded-lg bg-[#43A047] px-4 py-2 text-sm font-semibold text-white hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </button>
            </div>
          </form>
          </div>
        </div>
      </div>

      {showConfirm && (
        <SaveConfirmModal 
          onClose={() => setShowConfirm(false)} 
          onConfirm={handleSave}
        />
      )}
      {showLogout && (
        <LogoutConfirmModal 
          onClose={() => setShowLogout(false)} 
          onConfirm={handleLogout}
        />
      )}
    </div>
  );
}

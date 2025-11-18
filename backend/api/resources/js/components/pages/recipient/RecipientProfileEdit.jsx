import React, { useState, useEffect } from "react";
import NavbarRecipient from "../../layout/NavbarRecipient";
import { ArrowLeft, ShieldCheck, UserCircle2, Pencil, LogOut, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { recipientAPI } from "../../../utils/api";

function SaveConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-[92%] max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="text-sm font-semibold text-[#0B2B5E]">Simpan Perubahan Data?</div>
        <p className="mt-2 text-sm text-slate-700">
          Apakah Anda yakin ingin menyimpan perubahan pada data ini? Pastikan semua informasi yang diperbarui sudah benar sebelum disimpan.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Batalkan</button>
          <button onClick={onConfirm} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
}

function LogoutConfirmModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-[92%] max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="text-sm font-semibold text-[#0B2B5E]">Konfirmasi Keluar Akun</div>
        <p className="mt-2 text-sm text-slate-700">Apakah Anda yakin ingin keluar dari akun ini?</p>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700">Batal</button>
          <button onClick={onConfirm} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">Keluar</button>
        </div>
      </div>
    </div>
  );
}

function SidebarItem({ active, icon: Icon, children, onClick }) {
  return (
    <button onClick={onClick} className={`w-full inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-semibold ${active ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-[#0B2B5E] border-slate-300 hover:bg-slate-50"}`}>
      {Icon && <Icon className="w-4 h-4" />} {children}
    </button>
  );
}

export default function RecipientProfileEdit() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  
  // State for profile data
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [customPekerjaan, setCustomPekerjaan] = useState("");
  const [customPekerjaanIstri, setCustomPekerjaanIstri] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    nama_kepala: "",
    alamat: "",
    nomor_telepon: "",
    pekerjaan: "",
    penghasilan: "",
    jumlah_tanggungan: "",
    pekerjaan_istri: "",
    status_anak: ""
  });

  // Fetch profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("=== Fetching Profile for Edit ===");
        const response = await recipientAPI.getProfile();
        console.log("Profile Response:", response);
        
        if (response.success && response.profile) {
          setProfileData(response);
          setFormData({
            nama_kepala: response.profile.nama_kepala || "",
            alamat: response.profile.alamat || "",
            nomor_telepon: response.profile.nomor_telepon || "",
            pekerjaan: response.profile.pekerjaan || "",
            penghasilan: response.profile.penghasilan || "",
            jumlah_tanggungan: response.profile.jumlah_tanggungan || "",
            pekerjaan_istri: response.profile.pekerjaan_istri || "",
            status_anak: response.profile.status_anak || ""
          });
          
          // Check if pekerjaan or pekerjaan_istri is custom (not in dropdown)
          const pekerjaanOptions = ['Tidak bekerja', 'Petani', 'Buruh Tani', 'Nelayan', 'Pedagang', 'Wiraswasta', 'Buruh Harian', 'Karyawan Swasta', 'PNS', 'Lainnya'];
          const pekerjaanIstriOptions = ['Tidak bekerja', 'Ibu Rumah Tangga (IRT)', 'Petani', 'Pedagang', 'Wiraswasta', 'Buruh Harian', 'Karyawan Swasta', 'PNS', 'Lainnya'];
          
          if (response.profile.pekerjaan && !pekerjaanOptions.includes(response.profile.pekerjaan)) {
            setCustomPekerjaan(response.profile.pekerjaan);
            setFormData(prev => ({...prev, pekerjaan: 'Lainnya'}));
          }
          
          if (response.profile.pekerjaan_istri && !pekerjaanIstriOptions.includes(response.profile.pekerjaan_istri)) {
            setCustomPekerjaanIstri(response.profile.pekerjaan_istri);
            setFormData(prev => ({...prev, pekerjaan_istri: 'Lainnya'}));
          }
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message || 'Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear custom input if user changes selection from "Lainnya"
    if (field === 'pekerjaan' && value !== 'Lainnya') {
      setCustomPekerjaan('');
    }
    if (field === 'pekerjaan_istri' && value !== 'Lainnya') {
      setCustomPekerjaanIstri('');
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.nama_kepala.trim()) {
        alert('Nama kepala keluarga wajib diisi');
        return;
      }

      if (!formData.alamat.trim()) {
        alert('Alamat wajib diisi');
        return;
      }

      setSaving(true);
      console.log("=== Saving Profile ===");
      console.log("Form Data:", formData);

      // Prepare data with custom values if "Lainnya" is selected
      const submitData = {
        ...formData,
        pekerjaan: formData.pekerjaan === 'Lainnya' ? customPekerjaan : formData.pekerjaan,
        pekerjaan_istri: formData.pekerjaan_istri === 'Lainnya' ? customPekerjaanIstri : formData.pekerjaan_istri,
      };

      const response = await recipientAPI.updateProfile(submitData);
      console.log("Save Response:", response);

      if (response.success) {
        // Update local state
        setProfileData(prev => ({
          ...prev,
          profile: { ...prev.profile, ...formData }
        }));
        
        // Update localStorage
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        const updatedUser = {
          ...currentUser,
          ...formData
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log("LocalStorage updated");
      }
      
      setShowConfirm(false);
      
      // Show success message
      alert('Profil berhasil diperbarui!');
      
      // Navigate back to profile
      navigate('/penerima/profil');
    } catch (err) {
      console.error("=== ERROR SAVING PROFILE ===");
      console.error("Error:", err);
      
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Gagal menyimpan perubahan. Silakan coba lagi.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
    navigate('/login/penerima');
  };

  // Get initials from name
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    return parts.length > 1 
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : parts[0].substring(0, 2).toUpperCase();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
        <NavbarRecipient />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
            <p className="mt-2 text-sm text-slate-600">Memuat data profil...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
        <NavbarRecipient />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-amber-600 mx-auto" />
            <p className="mt-4 text-slate-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarRecipient />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-20 py-3">
          <button 
            onClick={() => navigate('/penerima/profil')} 
            className="inline-flex items-center gap-1 text-sm text-[#0B2B5E] hover:text-emerald-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Profil</span>
          </button>
        </div>
      </div>

      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-4">
          {/* Sidebar */}
          <aside className="space-y-3 self-start">
            <SidebarItem active={false} onClick={() => navigate('/penerima/profil')} icon={UserCircle2}>Data Profil</SidebarItem>
            <SidebarItem active={true} icon={Pencil}>Edit Profil</SidebarItem>
            <SidebarItem active={false} onClick={() => setShowLogout(true)} icon={LogOut}>Keluar</SidebarItem>
          </aside>

          {/* Main content */}
          <div className="space-y-4">
            {/* Header card */}
            <section className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl shadow-sm text-white p-4 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center text-lg font-extrabold">
                  {getInitials(formData.nama_kepala)}
                </div>
                <div>
                  <div className="text-lg font-extrabold">{formData.nama_kepala || "Nama Kepala Keluarga"}</div>
                  <div className="mt-1 inline-flex items-center gap-1 rounded bg-white/20 px-2 py-0.5 text-xs">
                    <ShieldCheck className="w-3.5 h-3.5"/> 
                    Edit Data Profil
                  </div>
                </div>
              </div>
            </section>

            {/* Edit form */}
            <section className="bg-white rounded-xl shadow-sm border border-slate-200">
              <header className="px-4 sm:px-5 py-3 border-b border-slate-200">
                <h3 className="text-[#0B2B5E] font-semibold">Edit Data Profil</h3>
              </header>
              <div className="p-4 sm:p-5">
                <form className="grid gap-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-600 mb-1 block">Nama Kepala Keluarga <span className="text-red-500">*</span></label>
                      <input 
                        type="text"
                        value={formData.nama_kepala}
                        onChange={(e) => handleInputChange('nama_kepala', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                        placeholder="Masukkan nama kepala keluarga"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-600 mb-1 block">No. Telepon/WhatsApp</label>
                      <input
                        type="tel"
                        value={formData.nomor_telepon}
                        onChange={(e) => handleInputChange('nomor_telepon', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="08xxxxxxxxxx"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">Alamat Lengkap <span className="text-red-500">*</span></label>
                    <textarea
                      value={formData.alamat}
                      onChange={(e) => handleInputChange('alamat', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Masukkan alamat lengkap"
                      rows="3"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-600 mb-1 block">Pekerjaan</label>
                      <select
                        value={formData.pekerjaan}
                        onChange={(e) => handleInputChange('pekerjaan', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Pilih pekerjaan</option>
                        <option value="Tidak bekerja">Tidak bekerja</option>
                        <option value="Petani">Petani</option>
                        <option value="Buruh Tani">Buruh Tani</option>
                        <option value="Nelayan">Nelayan</option>
                        <option value="Pedagang">Pedagang</option>
                        <option value="Wiraswasta">Wiraswasta</option>
                        <option value="Buruh Harian">Buruh Harian</option>
                        <option value="Karyawan Swasta">Karyawan Swasta</option>
                        <option value="PNS">PNS</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      {formData.pekerjaan === 'Lainnya' && (
                        <input
                          type="text"
                          placeholder="Masukkan pekerjaan Anda"
                          value={customPekerjaan}
                          onChange={(e) => setCustomPekerjaan(e.target.value)}
                          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      )}
                    </div>

                    <div>
                      <label className="text-sm text-slate-600 mb-1 block">Penghasilan</label>
                      <select
                        value={formData.penghasilan}
                        onChange={(e) => handleInputChange('penghasilan', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Pilih penghasilan</option>
                        <option value="< Rp 500.000">&lt; Rp 500.000</option>
                        <option value="Rp 500.000 - Rp 1.000.000">Rp 500.000 - Rp 1.000.000</option>
                        <option value="Rp 1.000.000 - Rp 2.000.000">Rp 1.000.000 - Rp 2.000.000</option>
                        <option value="Rp 2.000.000 - Rp 3.000.000">Rp 2.000.000 - Rp 3.000.000</option>
                        <option value="> Rp 3.000.000">&gt; Rp 3.000.000</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-600 mb-1 block">Jumlah Tanggungan</label>
                      <input
                        type="number"
                        value={formData.jumlah_tanggungan}
                        onChange={(e) => handleInputChange('jumlah_tanggungan', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="0"
                        min="0"
                      />
                    </div>

                    <div>
                      <label className="text-sm text-slate-600 mb-1 block">Status Pekerjaan Istri</label>
                      <select
                        value={formData.pekerjaan_istri}
                        onChange={(e) => handleInputChange('pekerjaan_istri', e.target.value)}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="">Pilih status pekerjaan istri</option>
                        <option value="Tidak bekerja">Tidak bekerja</option>
                        <option value="Ibu Rumah Tangga (IRT)">Ibu Rumah Tangga (IRT)</option>
                        <option value="Petani">Petani</option>
                        <option value="Pedagang">Pedagang</option>
                        <option value="Wiraswasta">Wiraswasta</option>
                        <option value="Buruh Harian">Buruh Harian</option>
                        <option value="Karyawan Swasta">Karyawan Swasta</option>
                        <option value="PNS">PNS</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      {formData.pekerjaan_istri === 'Lainnya' && (
                        <input
                          type="text"
                          placeholder="Masukkan pekerjaan istri"
                          value={customPekerjaanIstri}
                          onChange={(e) => setCustomPekerjaanIstri(e.target.value)}
                          className="mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-slate-600 mb-1 block">Status Anak</label>
                    <select
                      value={formData.status_anak}
                      onChange={(e) => handleInputChange('status_anak', e.target.value)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Pilih status anak</option>
                      <option value="Tidak ada anak">Tidak ada anak</option>
                      <option value="Belum sekolah">Belum sekolah</option>
                      <option value="TK/PAUD">TK/PAUD</option>
                      <option value="SD">SD</option>
                      <option value="SMP">SMP</option>
                      <option value="SMA/SMK">SMA/SMK</option>
                      <option value="Kuliah">Kuliah</option>
                      <option value="Sudah bekerja">Sudah bekerja</option>
                      <option value="Putus sekolah">Putus sekolah</option>
                    </select>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button 
                      type="button" 
                      onClick={() => navigate('/penerima/profil')}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Batal
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowConfirm(true)} 
                      disabled={saving}
                      className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      </main>

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

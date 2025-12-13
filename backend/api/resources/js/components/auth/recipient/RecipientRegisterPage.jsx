import { useState } from "react";
import recipientIcon from "../../../assets/iconPenerima 1.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function RecipientRegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    no_kk: "",
    nama_kepala: "",
    alamat: "",
    nomor_telepon: "",
    pekerjaan: "",
    penghasilan: "",
    pekerjaan_istri: "",
    status_anak: "",
    password: "",
    password_confirmation: "",
    jumlah_tanggungan: 0,
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [customPekerjaan, setCustomPekerjaan] = useState("");
  const [customPekerjaanIstri, setCustomPekerjaanIstri] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'jumlah_tanggungan' ? parseInt(value) || 0 : value
    }));
    // Clear custom input if user changes selection from "Lainnya"
    if (name === 'pekerjaan' && value !== 'Lainnya') {
      setCustomPekerjaan('');
    }
    if (name === 'pekerjaan_istri' && value !== 'Lainnya') {
      setCustomPekerjaanIstri('');
    }
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setGeneralError("");
    setSuccessMessage("");
    setLoading(true);

    // Prepare data with custom values if "Lainnya" is selected
    const submitData = {
      ...formData,
      pekerjaan: formData.pekerjaan === 'Lainnya' ? customPekerjaan : formData.pekerjaan,
      pekerjaan_istri: formData.pekerjaan_istri === 'Lainnya' ? customPekerjaanIstri : formData.pekerjaan_istri,
    };

    console.log('Submitting registration with data:', submitData);

    try {
      const result = await register(submitData, 'recipient');
      console.log('Registration successful:', result);
      
      // Show success message
      setSuccessMessage("Pendaftaran berhasil! Akun Anda akan diverifikasi oleh admin. Silakan login setelah akun Anda disetujui.");
      setLoading(false);
      
      // Clear form
      setFormData({
        no_kk: "",
        nama_kepala: "",
        alamat: "",
        nomor_telepon: "",
        pekerjaan: "",
        penghasilan: "",
        pekerjaan_istri: "",
        status_anak: "",
        password: "",
        password_confirmation: "",
        jumlah_tanggungan: 0,
      });
      
      // Optional: Auto redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login/penerima');
      }, 3000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setLoading(false);
      
      // Handle validation errors
      if (err.errors) {
        console.log('Validation errors:', err.errors);
        setErrors(err.errors);
      } else if (err.message) {
        console.log('Error message:', err.message);
        setGeneralError(err.message);
      } else {
        console.log('Unknown error');
        setGeneralError("Terjadi kesalahan saat mendaftar. Silakan coba lagi.");
      }
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left side - Green Welcome Panel */}
        <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 p-8 md:p-12 lg:p-16 flex items-center justify-center text-white order-2 lg:order-1">
          <div className="max-w-xl space-y-8">
            {/* Icon and Title */}
            <div className="flex flex-col items-center gap-6">
              <img 
                src={recipientIcon} 
                alt="Recipient Icon" 
                className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain drop-shadow-2xl"
              />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-center">
                Bergabung dan Wujudkan Perubahan Bersama
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-5 text-base md:text-lg leading-relaxed text-center">
              <p className="font-medium">
                Yuk, daftarkan diri Anda untuk mendapatkan informasi bantuan secara transparan dan mudah. Dengan akun ini, Anda bisa memantau status pendaftaran, jadwal penyaluran, serta program bantuan aktif di desa Anda.
              </p>
              <p className="text-sm md:text-base opacity-95">
                Semua dibuat agar bantuan benar-benar sampai kepada yang berhak menerima.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Registration Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center order-1 lg:order-2">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-[#0B2B5E] text-2xl md:text-3xl font-bold mb-8 text-center">
              Buat Akun Penerima Bantuan
            </h1>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Success Message */}
              {successMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <p className="font-semibold">Pendaftaran Berhasil!</p>
                      <p className="mt-1">{successMessage}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* General Error Message */}
              {generalError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {generalError}
                </div>
              )}

              {/* Nama Kepala Keluarga */}
              <div>
                <label htmlFor="nama_kepala" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Kepala Keluarga
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    id="nama_kepala"
                    name="nama_kepala"
                    type="text"
                    placeholder="Masukkan nama kepala keluarga"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm ${
                      errors.nama_kepala ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.nama_kepala}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.nama_kepala && (
                  <p className="mt-1 text-sm text-red-600">{errors.nama_kepala[0]}</p>
                )}
              </div>

              {/* No. KK */}
              <div>
                <label htmlFor="no_kk" className="block text-sm font-semibold text-gray-700 mb-2">
                  No. KK
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <input
                    id="no_kk"
                    name="no_kk"
                    type="text"
                    placeholder="Masukkan No. KK Anda"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm ${
                      errors.no_kk ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.no_kk}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.no_kk && (
                  <p className="mt-1 text-sm text-red-600">{errors.no_kk[0]}</p>
                )}
              </div>

              {/* Nomor Telepon */}
              <div>
                <label htmlFor="nomor_telepon" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor Telepon
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <input
                    id="nomor_telepon"
                    name="nomor_telepon"
                    type="tel"
                    placeholder="Masukkan nomor telepon Anda"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm ${
                      errors.nomor_telepon ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.nomor_telepon}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.nomor_telepon && (
                  <p className="mt-1 text-sm text-red-600">{errors.nomor_telepon[0]}</p>
                )}
              </div>

              {/* Alamat */}
              <div>
                <label htmlFor="alamat" className="block text-sm font-semibold text-gray-700 mb-2">
                  Alamat
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-4 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    id="alamat"
                    name="alamat"
                    type="text"
                    placeholder="Masukkan alamat Anda"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm ${
                      errors.alamat ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.alamat}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.alamat && (
                  <p className="mt-1 text-sm text-red-600">{errors.alamat[0]}</p>
                )}
              </div>

              {/* Jumlah Tanggungan */}
              <div>
                <label htmlFor="jumlah_tanggungan" className="block text-sm font-semibold text-gray-700 mb-2">
                  Jumlah Tanggungan
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <input
                    id="jumlah_tanggungan"
                    name="jumlah_tanggungan"
                    type="number"
                    min="0"
                    placeholder="Jumlah anggota keluarga yang ditanggung"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm ${
                      errors.jumlah_tanggungan ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.jumlah_tanggungan}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.jumlah_tanggungan && (
                  <p className="mt-1 text-sm text-red-600">{errors.jumlah_tanggungan[0]}</p>
                )}
              </div>

              {/* Pekerjaan */}
              <div>
                <label htmlFor="pekerjaan" className="block text-sm font-semibold text-gray-700 mb-2">
                  Pekerjaan
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <select
                    id="pekerjaan"
                    name="pekerjaan"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm appearance-none bg-white ${
                      errors.pekerjaan ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.pekerjaan}
                    onChange={handleChange}
                    required
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
                </div>
                {formData.pekerjaan === 'Lainnya' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Masukkan pekerjaan Anda"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                      value={customPekerjaan}
                      onChange={(e) => setCustomPekerjaan(e.target.value)}
                      required
                    />
                  </div>
                )}
                {errors.pekerjaan && (
                  <p className="mt-1 text-sm text-red-600">{errors.pekerjaan[0]}</p>
                )}
              </div>

              {/* Penghasilan */}
              <div>
                <label htmlFor="penghasilan" className="block text-sm font-semibold text-gray-700 mb-2">
                  Penghasilan
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <select
                    id="penghasilan"
                    name="penghasilan"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm appearance-none bg-white ${
                      errors.penghasilan ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.penghasilan}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Pilih penghasilan</option>
                    <option value="< Rp 500.000">&lt; Rp 500.000</option>
                    <option value="Rp 500.000 - Rp 1.000.000">Rp 500.000 - Rp 1.000.000</option>
                    <option value="Rp 1.000.000 - Rp 2.000.000">Rp 1.000.000 - Rp 2.000.000</option>
                    <option value="Rp 2.000.000 - Rp 3.000.000">Rp 2.000.000 - Rp 3.000.000</option>
                    <option value="> Rp 3.000.000">&gt; Rp 3.000.000</option>
                  </select>
                </div>
                {errors.penghasilan && (
                  <p className="mt-1 text-sm text-red-600">{errors.penghasilan[0]}</p>
                )}
              </div>

              {/* Status Pekerjaan Istri */}
              <div>
                <label htmlFor="pekerjaan_istri" className="block text-sm font-semibold text-gray-700 mb-2">
                  Status Pekerjaan Istri
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <select
                    id="pekerjaan_istri"
                    name="pekerjaan_istri"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm appearance-none bg-white ${
                      errors.pekerjaan_istri ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.pekerjaan_istri}
                    onChange={handleChange}
                    required
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
                </div>
                {formData.pekerjaan_istri === 'Lainnya' && (
                  <div className="mt-2">
                    <input
                      type="text"
                      placeholder="Masukkan pekerjaan istri"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                      value={customPekerjaanIstri}
                      onChange={(e) => setCustomPekerjaanIstri(e.target.value)}
                      required
                    />
                  </div>
                )}
                {errors.pekerjaan_istri && (
                  <p className="mt-1 text-sm text-red-600">{errors.pekerjaan_istri[0]}</p>
                )}
              </div>

              {/* Status Anak */}
              <div>
                <label htmlFor="status_anak" className="block text-sm font-semibold text-gray-700 mb-2">
                  Status Anak
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <select
                    id="status_anak"
                    name="status_anak"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm appearance-none bg-white ${
                      errors.status_anak ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.status_anak}
                    onChange={handleChange}
                    required
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
                {errors.status_anak && (
                  <p className="mt-1 text-sm text-red-600">{errors.status_anak[0]}</p>
                )}
              </div>

              {/* Kata Sandi */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Kata Sandi
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Masukkan Kata Sandi Anda"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm ${
                      errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
                )}
              </div>

              {/* Konfirmasi Kata Sandi */}
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700 mb-2">
                  Konfirmasi Kata Sandi
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    placeholder="Masukkan Ulang Kata Sandi Anda"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm ${
                      errors.password_confirmation ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.password_confirmation && (
                  <p className="mt-1 text-sm text-red-600">{errors.password_confirmation[0]}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 mt-6 ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Mendaftar...' : 'Daftar'}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Sudah punya akun?{" "}
                <a
                  href="#"
                  className="text-[#0B2B5E] font-semibold hover:underline"
                  onClick={(e) => { e.preventDefault(); navigate('/login/penerima'); }}
                >
                  Masuk di sini
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

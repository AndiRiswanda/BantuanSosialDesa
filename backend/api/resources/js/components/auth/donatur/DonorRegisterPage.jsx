import { useState } from "react";
import donorIcon from "../../../assets/iconDonatur 1.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";

export default function DonorRegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    nama_organisasi: "",
    email: "",
    password: "",
    password_confirmation: "",
    nomor_telepon: "",
    alamat: "",
    jenis_instansi: "perorangan",
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

    console.log('Submitting registration with data:', formData);

    try {
      const result = await register(formData, 'donor');
      console.log('Registration successful:', result);
      
      // Show success message
      setSuccessMessage("Pendaftaran berhasil! Silakan login menggunakan email dan password yang telah Anda daftarkan.");
      setLoading(false);
      
      // Clear form
      setFormData({
        nama_organisasi: "",
        email: "",
        password: "",
        password_confirmation: "",
        nomor_telepon: "",
        alamat: "",
        jenis_instansi: "perorangan",
      });
      
      // Optional: Auto redirect to login page after 3 seconds
      setTimeout(() => {
        navigate('/login/donatur');
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
        {/* Left side - Registration Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-[#0B2B5E] text-2xl md:text-3xl font-bold mb-8 text-center">
              Buat Akun Donatur Pemberi Bantuan
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

              {/* Nama Perusahaan/Organisasi */}
              <div>
                <label htmlFor="nama_organisasi" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Perusahaan/Organisasi
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
                    id="nama_organisasi"
                    name="nama_organisasi"
                    type="text"
                    placeholder="Masukkan nama perusahaan/organisasi Anda"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm ${
                      errors.nama_organisasi ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.nama_organisasi}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.nama_organisasi && (
                  <p className="mt-1 text-sm text-red-600">{errors.nama_organisasi[0]}</p>
                )}
              </div>

              {/* Email Perusahaan/Organisasi */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Perusahaan/Organisasi
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Masukkan email perusahaan/organisasi Anda"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm ${
                      errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
                )}
              </div>

              {/* Alamat Perusahaan/Organisasi */}
              <div>
                <label htmlFor="alamat" className="block text-sm font-semibold text-gray-700 mb-2">
                  Alamat Perusahaan/Organisasi
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
                    placeholder="Masukkan alamat perusahaan/organisasi Anda"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm ${
                      errors.alamat ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.alamat}
                    onChange={handleChange}
                  />
                </div>
                {errors.alamat && (
                  <p className="mt-1 text-sm text-red-600">{errors.alamat[0]}</p>
                )}
              </div>

              {/* No. Telepon/WhatsApp */}
              <div>
                <label htmlFor="nomor_telepon" className="block text-sm font-semibold text-gray-700 mb-2">
                  No. Telepon/WhatsApp
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
                    placeholder="Masukkan no. telepon/whatsapp perusahaan/organisasi Anda"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm ${
                      errors.nomor_telepon ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                    value={formData.nomor_telepon}
                    onChange={handleChange}
                  />
                </div>
                {errors.nomor_telepon && (
                  <p className="mt-1 text-sm text-red-600">{errors.nomor_telepon[0]}</p>
                )}
              </div>

              {/* Jenis Instansi */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Jenis Instansi
                </label>
                <div className="flex gap-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="jenis_instansi"
                      value="perorangan"
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      checked={formData.jenis_instansi === "perorangan"}
                      onChange={handleChange}
                    />
                    <span className="ml-2 text-sm text-gray-700">Perorangan</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="jenis_instansi"
                      value="yayasan"
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      checked={formData.jenis_instansi === "yayasan"}
                      onChange={handleChange}
                    />
                    <span className="ml-2 text-sm text-gray-700">Yayasan</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="jenis_instansi"
                      value="perusahaan"
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      checked={formData.jenis_instansi === "perusahaan"}
                      onChange={handleChange}
                    />
                    <span className="ml-2 text-sm text-gray-700">Perusahaan</span>
                  </label>
                </div>
                {errors.jenis_instansi && (
                  <p className="mt-1 text-sm text-red-600">{errors.jenis_instansi[0]}</p>
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
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login/donatur');
                  }}
                >
                  Masuk di sini
                </a>
              </p>
            </form>
          </div>
        </div>

        {/* Right side - Welcome Panel */}
        <div className="bg-gradient-to-br from-green-400 via-green-500 to-green-600 p-8 md:p-12 lg:p-16 flex items-center justify-center text-white">
          <div className="max-w-xl space-y-8">
            {/* Icon and Title */}
            <div className="flex flex-col items-center gap-6">
              <img 
                src={donorIcon} 
                alt="Donor Icon" 
                className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain drop-shadow-2xl"
              />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-center">
                Bergabung dan Wujudkan Perubahan Bersama
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-5 text-base md:text-lg leading-relaxed text-center">
              <p className="font-medium">
                Jadilah bagian dari gerakan kebaikan di desa. Dengan membuat akun, Anda dapat menyalurkan bantuan secara langsung, memantau transparansi penyaluran, dan memastikan setiap donasi benar-benar sampai kepada yang membutuhkan.
              </p>
              <p className="text-sm md:text-base opacity-95">
                Kebaikan Anda hari ini, adalah harapan bagi banyak keluarga esok hari.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

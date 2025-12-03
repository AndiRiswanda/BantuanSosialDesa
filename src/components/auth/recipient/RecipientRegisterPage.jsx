import { useState } from "react";
import { useNavigate } from "react-router-dom";
import recipientIcon from "../../../assets/iconPenerima 1.png";
import api from "../../../utils/api";

export default function RecipientRegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    no_kk: "",
    password: "",
    password_confirmation: "",
    nama_kepala: "",
    alamat: "",
    nomor_telepon: "",
    pekerjaan: "",
    pekerjaan_istri: "",
    status_anak: "",
    jumlah_tanggungan: 0,
    penghasilan: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const response = await api.post("/api/register/recipient", formData);
      
      if (response.data) {
        // Show success message
        alert("Pendaftaran berhasil! Akun Anda telah dibuat dan akan dikelola oleh admin.");
        // Redirect to login page
        navigate("/login/penerima");
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        alert(error.response.data.message);
      } else {
        alert("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left side - Registration Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center max-h-screen overflow-y-auto">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-[#0B2B5E] text-2xl md:text-3xl font-bold mb-8 text-center">
              Daftar Sebagai Penerima Bantuan
            </h1>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Nomor KK */}
              <div>
                <label htmlFor="no_kk" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nomor Kartu Keluarga (KK) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                  <input
                    id="no_kk"
                    name="no_kk"
                    type="text"
                    value={formData.no_kk}
                    onChange={handleChange}
                    placeholder="Masukkan Nomor KK (16 digit)"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                    required
                  />
                </div>
                {errors.no_kk && (
                  <p className="text-red-500 text-xs mt-1">{errors.no_kk[0]}</p>
                )}
              </div>

              {/* Nama Kepala Keluarga */}
              <div>
                <label htmlFor="nama_kepala" className="block text-sm font-semibold text-gray-700 mb-2">
                  Nama Kepala Keluarga <span className="text-red-500">*</span>
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
                    value={formData.nama_kepala}
                    onChange={handleChange}
                    placeholder="Masukkan nama kepala keluarga"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                    required
                  />
                </div>
                {errors.nama_kepala && (
                  <p className="text-red-500 text-xs mt-1">{errors.nama_kepala[0]}</p>
                )}
              </div>

              {/* Alamat */}
              <div>
                <label htmlFor="alamat" className="block text-sm font-semibold text-gray-700 mb-2">
                  Alamat Lengkap
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
                  <textarea
                    id="alamat"
                    name="alamat"
                    value={formData.alamat}
                    onChange={handleChange}
                    placeholder="Masukkan alamat lengkap"
                    rows="3"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm resize-none"
                  />
                </div>
                {errors.alamat && (
                  <p className="text-red-500 text-xs mt-1">{errors.alamat[0]}</p>
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
                    value={formData.nomor_telepon}
                    onChange={handleChange}
                    placeholder="Masukkan nomor telepon/whatsapp"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                  />
                </div>
                {errors.nomor_telepon && (
                  <p className="text-red-500 text-xs mt-1">{errors.nomor_telepon[0]}</p>
                )}
              </div>

              {/* Pekerjaan Kepala Keluarga */}
              <div>
                <label htmlFor="pekerjaan" className="block text-sm font-semibold text-gray-700 mb-2">
                  Pekerjaan Kepala Keluarga
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    id="pekerjaan"
                    name="pekerjaan"
                    type="text"
                    value={formData.pekerjaan}
                    onChange={handleChange}
                    placeholder="Contoh: Petani, Buruh, Pedagang, dll"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                  />
                </div>
                {errors.pekerjaan && (
                  <p className="text-red-500 text-xs mt-1">{errors.pekerjaan[0]}</p>
                )}
              </div>

              {/* Pekerjaan Istri */}
              <div>
                <label htmlFor="pekerjaan_istri" className="block text-sm font-semibold text-gray-700 mb-2">
                  Pekerjaan Istri
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <input
                    id="pekerjaan_istri"
                    name="pekerjaan_istri"
                    type="text"
                    value={formData.pekerjaan_istri}
                    onChange={handleChange}
                    placeholder="Contoh: Ibu Rumah Tangga, Buruh, dll"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                  />
                </div>
                {errors.pekerjaan_istri && (
                  <p className="text-red-500 text-xs mt-1">{errors.pekerjaan_istri[0]}</p>
                )}
              </div>

              {/* Status Anak */}
              <div>
                <label htmlFor="status_anak" className="block text-sm font-semibold text-gray-700 mb-2">
                  Status Anak
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <input
                    id="status_anak"
                    name="status_anak"
                    type="text"
                    value={formData.status_anak}
                    onChange={handleChange}
                    placeholder="Contoh: Sekolah, Belum Sekolah, Bekerja"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                  />
                </div>
                {errors.status_anak && (
                  <p className="text-red-500 text-xs mt-1">{errors.status_anak[0]}</p>
                )}
              </div>

              {/* Jumlah Tanggungan */}
              <div>
                <label htmlFor="jumlah_tanggungan" className="block text-sm font-semibold text-gray-700 mb-2">
                  Jumlah Tanggungan <span className="text-red-500">*</span>
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
                    value={formData.jumlah_tanggungan}
                    onChange={handleChange}
                    placeholder="Masukkan jumlah anggota keluarga yang ditanggung"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                    required
                  />
                </div>
                {errors.jumlah_tanggungan && (
                  <p className="text-red-500 text-xs mt-1">{errors.jumlah_tanggungan[0]}</p>
                )}
              </div>

              {/* Penghasilan */}
              <div>
                <label htmlFor="penghasilan" className="block text-sm font-semibold text-gray-700 mb-2">
                  Penghasilan per Bulan
                </label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <select
                    id="penghasilan"
                    name="penghasilan"
                    value={formData.penghasilan}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm appearance-none"
                  >
                    <option value="">Pilih range penghasilan</option>
                    <option value="< Rp 500.000">{"< Rp 500.000"}</option>
                    <option value="Rp 500.000 - Rp 1.000.000">Rp 500.000 - Rp 1.000.000</option>
                    <option value="Rp 1.000.000 - Rp 2.000.000">Rp 1.000.000 - Rp 2.000.000</option>
                    <option value="Rp 2.000.000 - Rp 3.000.000">Rp 2.000.000 - Rp 3.000.000</option>
                    <option value="> Rp 3.000.000">{"> Rp 3.000.000"}</option>
                  </select>
                </div>
                {errors.penghasilan && (
                  <p className="text-red-500 text-xs mt-1">{errors.penghasilan[0]}</p>
                )}
              </div>

              {/* Kata Sandi */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Kata Sandi <span className="text-red-500">*</span>
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
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Masukkan Kata Sandi (minimal 8 karakter)"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                    required
                  />
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password[0]}</p>
                )}
              </div>

              {/* Konfirmasi Kata Sandi */}
              <div>
                <label htmlFor="password_confirmation" className="block text-sm font-semibold text-gray-700 mb-2">
                  Konfirmasi Kata Sandi <span className="text-red-500">*</span>
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
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    placeholder="Masukkan Ulang Kata Sandi"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                    required
                  />
                </div>
                {errors.password_confirmation && (
                  <p className="text-red-500 text-xs mt-1">{errors.password_confirmation[0]}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 mt-6 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? "Mendaftar..." : "Daftar"}
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Sudah punya akun?{" "}
                <a
                  href="#"
                  className="text-[#0B2B5E] font-semibold hover:underline"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate("/login/penerima");
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
                src={recipientIcon}
                alt="Recipient Icon"
                className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain drop-shadow-2xl"
              />
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-tight text-center">
                Daftar untuk Mendapatkan Bantuan
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-5 text-base md:text-lg leading-relaxed text-center">
              <p className="font-medium">
                Daftarkan diri Anda untuk mendapatkan akses ke berbagai program bantuan sosial yang tersedia. Akun Anda akan dikelola oleh admin desa untuk memastikan bantuan tersalurkan dengan tepat.
              </p>
              <p className="text-sm md:text-base opacity-95">
                Dengan mendaftar, Anda dapat mengajukan bantuan, memantau status pengajuan, dan menerima informasi program bantuan terbaru.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

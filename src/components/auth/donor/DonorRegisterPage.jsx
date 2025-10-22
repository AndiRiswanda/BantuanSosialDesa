import donorIcon from "../../../assets/iconDonatur 1.png";

export default function DonorRegisterPage() {
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Left side - Registration Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-[#0B2B5E] text-2xl md:text-3xl font-bold mb-8 text-center">
              Buat Akun Donatur Pemberi Bantuan
            </h1>

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              {/* Nama Perusahaan/Organisasi */}
              <div>
                <label htmlFor="nama" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    id="nama"
                    type="text"
                    placeholder="Masukkan nama perusahaan/organisasi Anda"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                    required
                  />
                </div>
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
                    type="email"
                    placeholder="Masukkan email perusahaan/organisasi Anda"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                    required
                  />
                </div>
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
                    type="text"
                    placeholder="Masukkan alamat perusahaan/organisasi Anda"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* No. Telepon/WhatsApp */}
              <div>
                <label htmlFor="telepon" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    id="telepon"
                    type="tel"
                    placeholder="Masukkan no. telepon/whatsapp perusahaan/organisasi Anda"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                    required
                  />
                </div>
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
                      name="jenis-instansi"
                      value="individu"
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                      defaultChecked
                    />
                    <span className="ml-2 text-sm text-gray-700">Individu</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="jenis-instansi"
                      value="organisasi"
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Organisasi</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="jenis-instansi"
                      value="perusahaan"
                      className="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">Perusahaan</span>
                  </label>
                </div>
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
                    type="password"
                    placeholder="Masukkan Kata Sandi Anda"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Konfirmasi Kata Sandi */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    id="confirmPassword"
                    type="password"
                    placeholder="Masukkan Ulang Kata Sandi Anda"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 mt-6"
              >
                Daftar
              </button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Sudah punya akun?{" "}
                <a href="#" className="text-[#0B2B5E] font-semibold hover:underline">
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

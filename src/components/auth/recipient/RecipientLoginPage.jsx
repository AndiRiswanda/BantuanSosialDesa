import recipientIcon from "../../../assets/iconPenerima 1.png";
import { useNavigate } from "react-router-dom";

export default function RecipientLoginPage() {
  const navigate = useNavigate();
  return (
    <section className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-0 bg-white rounded-3xl shadow-2xl overflow-hidden">
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
                Masuk ke Akun Penerima Bantuan
              </h2>
            </div>

            {/* Description */}
            <div className="space-y-5 text-base md:text-lg leading-relaxed text-center">
              <p className="font-medium">
                Selamat Datang Kembali di Portal Bantuan Desa
              </p>
              <p className="text-sm md:text-base opacity-95">
                Mari cek status dan jadwal bantuan Anda. Sistem ini dibuat agar semua proses bantuan berjalan transparan, adil, dan mudah diakses untuk seluruh warga desa.
              </p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center order-1 lg:order-2">
          <div className="max-w-md mx-auto w-full">
            <h1 className="text-[#0B2B5E] text-2xl md:text-3xl font-bold mb-8 text-center">
              Login Penerima Bantuan
            </h1>

            <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); navigate('/penerima'); }}>
              {/* No. KK */}
              <div>
                <label htmlFor="noKK" className="block text-sm font-semibold text-gray-700 mb-2">
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
                    id="noKK"
                    type="text"
                    placeholder="Masukkan No. KK Anda"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm"
                    required
                  />
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
                    placeholder="Masukkan kata sandi Anda"
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
                Masuk
              </button>

              {/* Register Link */}
              <p className="text-center text-sm text-gray-600 mt-4">
                Belum punya akun?{" "}
                <a
                  href="#"
                  className="text-[#0B2B5E] font-semibold hover:underline"
                  onClick={(e) => { e.preventDefault(); navigate('/register/penerima'); }}
                >
                  Daftar sekarang
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

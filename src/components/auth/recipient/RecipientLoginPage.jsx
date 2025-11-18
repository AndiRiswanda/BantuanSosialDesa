import { useState } from "react";
import recipientIcon from "../../../assets/iconPenerima 1.png";
import { useNavigate } from "react-router-dom";
import { authAPI, setAuthToken, setUser } from "../../../utils/api";

export default function RecipientLoginPage() {
  const navigate = useNavigate();
  const [noKK, setNoKK] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleChange = (field, value) => {
    if (field === 'noKK') setNoKK(value);
    if (field === 'password') setPassword(value);
    
    // Clear error when user types
    if (errors[field === 'noKK' ? 'no_kk' : field]) {
      setErrors((prev) => ({
        ...prev,
        [field === 'noKK' ? 'no_kk' : field]: "",
      }));
    }
    if (generalError) {
      setGeneralError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError("");

    try {
      const response = await authAPI.login({
        no_kk: noKK,
        password: password,
        role: 'penerima'
      });

      // Save token and user data
      setAuthToken(response.token);
      setUser(response.user);
      
      // Redirect to dashboard
      navigate('/penerima');
    } catch (err) {
      console.error('Login error:', err);
      
      if (err.response) {
        const { status, data } = err.response;
        
        // Handle field-specific errors from Laravel validation
        if (data && data.errors && typeof data.errors === 'object') {
          const errorKeys = Object.keys(data.errors);
          
          if (errorKeys.length > 0) {
            // Transform errors: ensure each error is a string
            const transformedErrors = {};
            errorKeys.forEach(key => {
              const errorValue = data.errors[key];
              transformedErrors[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
            });
            setErrors(transformedErrors);
            setLoading(false);
            return;
          }
        }
        
        // If no field errors, set general error
        if (status === 422) {
          setGeneralError(data.message || "Terjadi kesalahan validasi. Silakan periksa input Anda.");
        } else if (status === 401) {
          setGeneralError("No KK atau password salah. Silakan coba lagi.");
        } else if (status === 500) {
          setGeneralError("Terjadi kesalahan pada server. Silakan coba lagi nanti.");
        } else if (data && data.message) {
          setGeneralError(data.message);
        } else {
          setGeneralError("Terjadi kesalahan saat login. Silakan coba lagi.");
        }
      } else if (err.request) {
        setGeneralError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      } else {
        setGeneralError(err.message || "Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

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

            {/* General Error Message - ONLY show if NO field errors exist */}
            {generalError && Object.keys(errors).length === 0 && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-2">
                <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{generalError}</span>
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
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
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm ${
                      errors.no_kk ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    value={noKK}
                    onChange={(e) => handleChange('noKK', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                {errors.no_kk && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {Array.isArray(errors.no_kk) ? errors.no_kk[0] : errors.no_kk}
                  </p>
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
                    type="password"
                    placeholder="Masukkan kata sandi Anda"
                    className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm ${
                      errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    }`}
                    value={password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 mt-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={loading}
              >
                {loading ? 'Memproses...' : 'Masuk'}
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

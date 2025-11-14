import "./DonorLoginPage.css";
import donorIllustration from "../../../assets/iconDonatur 1.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";

export default function DonorLoginPage() {
  const navigate = useNavigate();
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const result = await login({ email, password }, 'donor');
    
    if (result.success) {
      // Show success modal
      setShowSuccessModal(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/donatur/dashboard");
      }, 2000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="donor-login-root">
      <div className="donor-login-container">
        {/* Left side - Login Form */}
        <div className="donor-login-form">
          <div className="form-card">
            <h1 className="form-title">Login Donatur</h1>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                {error}
              </div>
            )}

            <form className="login-form" onSubmit={onSubmit}>
              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    id="email"
                    type="email"
                    placeholder="Masukkan Email Anda"
                    className="form-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Kata Sandi
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password"
                    type="password"
                    placeholder="Masukkan Kata Sandi Anda"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 w-full disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Masuk"}
              </button>

              {/* Register Link */}
              <p className="register-link">
                Belum punya akun?{" "}
                <a
                  href="#"
                  className="register-anchor"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/register/donatur');
                  }}
                >
                  Daftar sekarang
                </a>
              </p>
            </form>
          </div>
        </div>

        {/* Right side - Welcome Panel */}
        <div className="donor-welcome-panel">
          <div className="welcome-content">
            <div className="welcome-illustration">
            <div>
                <h2 className="welcome-title">Selamat Datang Kembali, Donatur</h2>
                <p className="welcome-subtitle">
                Terima Kasih Telah Menjadi Bagian dari Perubahan
                </p>
            </div>

              <img 
                src={donorIllustration} 
                alt="Ilustrasi donasi dan bantuan sosial" 
                className="illustration-image"
              />
            </div>



            <div className="welcome-description">
              <p>
                Setiap donasi Anda berarti besar bagi masyarakat desa.
                Mari lanjutkan langkah kecil ini untuk menciptakan dampak besar.
              </p>
              <p>
                Silakan login untuk memantau penyaluran bantuan
                dan melihat bagaimana kontribusi Anda membawa
                harapan baru bagi banyak orang.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl transform animate-scale-in">
            <div className="text-center">
              {/* Success Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              {/* Success Message */}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Login Berhasil!
              </h3>
              <p className="text-gray-600 mb-6">
                Selamat datang kembali. Anda akan dialihkan ke dashboard...
              </p>
              
              {/* Loading Spinner */}
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

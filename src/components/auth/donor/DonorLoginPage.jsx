import "./DonorLoginPage.css";
import donorIllustration from "../../../assets/iconDonatur 1.png";
import { useNavigate } from "react-router-dom";

export default function DonorLoginPage() {
  const navigate = useNavigate();
  const onSubmit = (e) => {
    e.preventDefault();
    navigate("/donor");
  };
  return (
    <div className="donor-login-root">
      <div className="donor-login-container">
        {/* Left side - Login Form */}
        <div className="donor-login-form">
          <div className="form-card">
            <h1 className="form-title">Login Donatur</h1>

            <form className="login-form" onSubmit={onSubmit}>
              {/* Username/Email */}
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Username/Email
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    id="username"
                    type="text"
                    placeholder="Masukkan Username/Email Anda"
                    className="form-input"
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
                    required
                  />
                </div>
              </div>

              {/* Confirm Password */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Konfirmasi Kata Sandi
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Masukkan Ulang Kata Sandi Anda"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 w-full"
              >
                Masuk
              </button>

              {/* Register Link */}
              <p className="register-link">
                Belum punya akun?{" "}
                <a href="#" className="register-anchor">
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
    </div>
  );
}

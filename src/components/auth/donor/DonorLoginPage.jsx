import "./DonorLoginPage.css";
import donorIllustration from "../../../assets/iconDonatur 1.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../../../utils/api";

export default function DonorLoginPage() {
  const navigate = useNavigate();
  
  // State management
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState("");

  // Handle input change
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
    if (generalError) {
      setGeneralError("");
    }
  };

  // Handle form submit
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setGeneralError("");

    try {
      const response = await api.post("/api/login/donatur", formData);
      
      // Save token and user data to localStorage
      localStorage.setItem("token", response.token);
      localStorage.setItem("userType", response.type);
      localStorage.setItem("userData", JSON.stringify(response.user));

      // Redirect to donor dashboard
      navigate("/donor");
    } catch (error) {
      console.error("=== LOGIN ERROR DEBUG ===");
      console.error("Full error:", error);
      console.error("Error response:", error.response);
      console.error("Error response data:", error.response?.data);
      console.error("Error response data (stringified):", JSON.stringify(error.response?.data, null, 2));
      console.error("Error response status:", error.response?.status);
      console.error("Has errors object?", error.response?.data?.errors);
      console.error("Errors type:", typeof error.response?.data?.errors);
      console.error("Errors keys:", error.response?.data?.errors ? Object.keys(error.response.data.errors) : 'none');
      console.error("========================");
      
      if (error.response) {
        const { status, data } = error.response;
        
        console.log("Processing error - Status:", status);
        console.log("Processing error - Data:", data);
        
        // ALWAYS try to extract field errors first, regardless of status code
        // Laravel sends ValidationException as 422 with errors object
        if (data && data.errors && typeof data.errors === 'object') {
          const errorKeys = Object.keys(data.errors);
          console.log("✅ Found errors object with keys:", errorKeys);
          
          if (errorKeys.length > 0) {
            console.log("✅ Setting field-specific errors:", data.errors);
            // Transform errors: ensure each error is a string (take first message if array)
            const transformedErrors = {};
            errorKeys.forEach(key => {
              const errorValue = data.errors[key];
              transformedErrors[key] = Array.isArray(errorValue) ? errorValue[0] : errorValue;
            });
            console.log("✅ Transformed errors:", transformedErrors);
            setErrors(transformedErrors);
            // Clear general error since we have specific field errors
            setGeneralError("");
            setLoading(false);
            return; // Exit early, don't set general error
          }
        }
        
        // If no field errors, handle by status code
        if (status === 422) {
          setGeneralError(data.message || "Terjadi kesalahan validasi. Silakan periksa input Anda.");
        } else if (status === 401) {
          setGeneralError("Email atau password salah. Silakan coba lagi.");
        } else if (status === 500) {
          setGeneralError("Terjadi kesalahan pada server. Silakan coba lagi nanti.");
        } else if (data && data.message) {
          setGeneralError(data.message);
        } else {
          setGeneralError("Terjadi kesalahan saat login. Silakan coba lagi.");
        }
      } else if (error.request) {
        setGeneralError("Tidak dapat terhubung ke server. Periksa koneksi internet Anda.");
      } else {
        setGeneralError("Terjadi kesalahan. Silakan coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="donor-login-root">
      <div className="donor-login-container">
        {/* Left side - Login Form */}
        <div className="donor-login-form">
          <div className="form-card">
            <h1 className="form-title">Login Donatur</h1>

            <form className="login-form" onSubmit={onSubmit}>
              {/* General Error Message - ONLY show if NO field errors exist */}
              {generalError && Object.keys(errors).length === 0 && (
                <div className="error-message-box">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{generalError}</span>
                </div>
              )}

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="input-wrapper">
                  <svg className="input-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Masukkan Email Anda"
                    className={`form-input ${errors.email ? "input-error" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.email && (
                  <p className="error-text">
                    {Array.isArray(errors.email) ? errors.email[0] : errors.email}
                  </p>
                )}
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
                    name="password"
                    type="password"
                    placeholder="Masukkan Kata Sandi Anda"
                    className={`form-input ${errors.password ? "input-error" : ""}`}
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                {errors.password && (
                  <p className="error-text">
                    {Array.isArray(errors.password) ? errors.password[0] : errors.password}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 w-full disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  "Masuk"
                )}
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
    </div>
  );
}

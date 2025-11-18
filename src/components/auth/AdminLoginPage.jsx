import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI, setAuthToken, setUser } from "../../utils/api";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [generalError, setGeneralError] = useState("");

  const handleChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    
    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
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
      const response = await authAPI.adminLogin({
        email: email,
        password: password,
      });

      // Save token and user data
      setAuthToken(response.token);
      setUser(response.user);
      
      // Redirect to admin dashboard
      navigate("/admin");
    } catch (err) {
      console.error('Admin login error:', err);
      
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
          setGeneralError("Email atau password salah. Silakan coba lagi.");
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 mx-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#0B2B5E] mb-2">Admin Login</h1>
          <p className="text-gray-600">Masuk ke Dashboard Admin</p>
        </div>

        {/* General Error Message - ONLY show if NO field errors exist */}
        {generalError && Object.keys(errors).length === 0 && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{generalError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <input
                id="email"
                type="email"
                placeholder="Masukkan email admin"
                className={`w-full pl-11 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition-all text-sm ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                value={email}
                onChange={(e) => handleChange('email', e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {Array.isArray(errors.email) ? errors.email[0] : errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
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
                placeholder="Masukkan password"
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
            className="w-full bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>
      </div>
    </div>
  );
}

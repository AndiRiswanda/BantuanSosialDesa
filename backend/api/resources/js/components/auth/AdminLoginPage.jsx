import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    
    const result = await login({ email, password }, 'admin');
    
    if (result.success) {
      // Show success modal
      setShowSuccessModal(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 2000);
    } else {
      setLocalError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Masuk Admin</h1>
        
        {(error || localError) && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error || localError}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            <span className="text-sm font-medium">Email</span>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm font-medium">Password</span>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </label>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>
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

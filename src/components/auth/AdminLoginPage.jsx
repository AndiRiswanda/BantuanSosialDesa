import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now we accept any credentials and navigate to admin dashboard.
    // Replace this with real auth logic when available.
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">Masuk Admin</h1>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2">
            <span className="text-sm font-medium">Username</span>
            <input
              className="mt-1 block w-full rounded-md border-gray-200 shadow-sm focus:border-green-500 focus:ring-1 focus:ring-green-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
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
            />
          </label>

          <button
            type="submit"
            className="w-full bg-green-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-green-700"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}

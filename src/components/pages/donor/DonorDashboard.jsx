import React, { useState, useEffect } from "react";
import NavbarDonor from "../../layout/NavbarDonor";
import { CircleDollarSign, Users, HandHeart, Package } from "lucide-react";
import hero from "../../../assets/lovehand 1.png";
import api from "../../../utils/api";

export default function DonorDashboard() {
  const [dashboardData, setDashboardData] = useState({
    user: null,
    stats: {
      total_programs: 0,
      active_programs: 0,
      total_bantuan_uang: 0,
      total_bantuan_barang: 0,
      total_penerima: 0,
    },
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("=".repeat(50));
      console.log("🔄 [STEP 1] Starting dashboard data fetch...");
      console.log("=".repeat(50));
      
      // Try with /api prefix first
      const endpoint = "/api/donatur/dashboard";
      console.log("📍 Endpoint:", endpoint);
      console.log("🔑 Auth Token:", localStorage.getItem('auth_token') ? 'EXISTS' : 'MISSING');
      
      console.log("⏳ Calling api.get()...");
      const responseData = await api.get(endpoint);
      console.log("✅ api.get() returned successfully!");
      console.log("📦 typeof responseData:", typeof responseData);
      console.log("📦 responseData is null?", responseData === null);
      console.log("📦 responseData is undefined?", responseData === undefined);
      
      console.log("=".repeat(50));
      console.log("✅ [STEP 2] API Response received!");
      console.log("=".repeat(50));
      console.log("📦 Response Type:", typeof responseData);
      console.log("📦 Response Keys:", responseData ? Object.keys(responseData) : "null");
      console.log("📄 Full Response:", JSON.stringify(responseData, null, 2));
      
      if (!responseData) {
        console.error("❌ [ERROR] Response is null or undefined!");
        console.error("⚠️ Setting empty state as fallback");
        setDashboardData({
          user: null,
          stats: {
            total_programs: 0,
            active_programs: 0,
            total_bantuan_uang: 0,
            total_bantuan_barang: 0,
            total_penerima: 0,
          },
        });
        setLoading(false);
        return;
      }
      
      // Extract stats - handle both nested and flat response
      let statsData = responseData.stats || responseData;
      
      console.log("=".repeat(50));
      console.log("📈 [STEP 3] Stats Object Analysis:");
      console.log("=".repeat(50));
      console.log("Stats Source:", responseData.stats ? "responseData.stats" : "responseData");
      console.log("Stats Keys:", Object.keys(statsData));
      console.log("Stats Raw:", JSON.stringify(statsData, null, 2));
      
      // Safely extract and convert values with detailed logging
      const total_bantuan_uang = statsData.total_bantuan_uang ?? 0;
      const total_bantuan_barang = statsData.total_bantuan_barang ?? 0;
      const total_penerima = statsData.total_penerima ?? 0;
      const active_programs = statsData.active_programs ?? 0;
      const total_programs = statsData.total_programs ?? 0;
      
      console.log("🔍 Raw values:");
      console.log("  total_bantuan_uang (raw):", total_bantuan_uang, typeof total_bantuan_uang);
      console.log("  total_bantuan_barang (raw):", total_bantuan_barang, typeof total_bantuan_barang);
      console.log("  total_penerima (raw):", total_penerima, typeof total_penerima);
      console.log("  active_programs (raw):", active_programs, typeof active_programs);
      
      // Convert string values to numbers for proper formatting
      const parsedUang = Number(total_bantuan_uang) || 0;
      const parsedBarang = Number(total_bantuan_barang) || 0;
      const parsedPenerima = Number(total_penerima) || 0;
      const parsedActivePrograms = Number(active_programs) || 0;
      const parsedTotalPrograms = Number(total_programs) || 0;
      
      console.log("🔢 After Number() conversion:");
      console.log("  total_bantuan_uang:", parsedUang, typeof parsedUang);
      console.log("  total_bantuan_barang:", parsedBarang, typeof parsedBarang);
      console.log("  total_penerima:", parsedPenerima, typeof parsedPenerima);
      console.log("  active_programs:", parsedActivePrograms, typeof parsedActivePrograms);
      
      const data = {
        user: responseData.user || statsData.user || null,
        stats: {
          total_programs: parsedTotalPrograms,
          active_programs: parsedActivePrograms,
          total_bantuan_uang: parsedUang,
          total_bantuan_barang: parsedBarang,
          total_penerima: parsedPenerima,
        }
      };
      
      console.log("📦 Final data object to setState:");
      console.log(JSON.stringify(data, null, 2));
      
      console.log("=".repeat(50));
      console.log("✨ [STEP 4] Parsed Data:");
      console.log("=".repeat(50));
      console.log("💰 Total Bantuan Uang (Number):", data.stats.total_bantuan_uang);
      console.log("📦 Total Bantuan Barang (Number):", data.stats.total_bantuan_barang);
      console.log("👥 Total Penerima:", data.stats.total_penerima);
      console.log("📋 Active Programs:", data.stats.active_programs);
      console.log("=".repeat(50));
      
      setDashboardData(data);
      console.log("✅ [SUCCESS] Dashboard data SET to state!");
      console.log("🎯 State that should render:");
      console.log("   - Total Bantuan Uang (number):", data.stats.total_bantuan_uang);
      console.log("   - Total Bantuan Barang (number):", data.stats.total_bantuan_barang);
      console.log("   - Total Penerima:", data.stats.total_penerima);
      console.log("   - Active Programs:", data.stats.active_programs);
      console.log("   - Formatted Uang:", formatCurrency(data.stats.total_bantuan_uang));
      console.log("   - Formatted Barang:", data.stats.total_bantuan_barang.toLocaleString('id-ID'), "Unit");
      
    } catch (error) {
      console.log("=".repeat(50));
      console.error("❌❌❌ [ERROR] Dashboard Fetch Failed!");
      console.log("=".repeat(50));
      console.error("Error Type:", error.name);
      console.error("Error Message:", error.message);
      console.error("Error Stack:", error.stack);
      console.error("Full Error Object:", error);
      
      if (error.response) {
        console.error("Response Status:", error.response.status);
        console.error("Response Data:", error.response.data);
        console.error("Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("Request was made but no response received");
        console.error("Request:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }
      console.log("=".repeat(50));
      
      // Set empty state on error
      setDashboardData({
        user: null,
        stats: {
          total_programs: 0,
          active_programs: 0,
          total_bantuan_uang: 0,
          total_bantuan_barang: 0,
          total_penerima: 0,
        },
      });
    } finally {
      setLoading(false);
      console.log("🏁 [FINAL] Loading state set to false");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Log saat render untuk debugging
  console.log("🎨 RENDERING DonorDashboard:", {
    loading,
    hasData: !!dashboardData,
    hasDashboardStats: !!dashboardData?.stats,
    statsValues: {
      uang: dashboardData?.stats?.total_bantuan_uang,
      barang: dashboardData?.stats?.total_bantuan_barang,
      penerima: dashboardData?.stats?.total_penerima,
      programs: dashboardData?.stats?.active_programs
    },
    formattedUang: dashboardData?.stats?.total_bantuan_uang ? formatCurrency(dashboardData.stats.total_bantuan_uang) : 'Rp0',
    rawDashboardData: dashboardData
  });
  
  console.log("🔍 COMPONENT VERSION CHECK: DonorDashboard v2.0 - FIXED");

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarDonor />

      {/* Hero */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-10 flex items-center gap-6">
          <div className="hidden sm:block">
            <img src={hero} alt="Welcome" className="w-28 h-28 object-contain" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B2B5E]">
              Selamat Datang Kembali,
            </h2>
            <h3 className="text-2xl md:text-3xl font-extrabold text-[#0B2B5E] -mt-1">
              {loading ? "..." : dashboardData.user?.nama_organisasi || "Donatur"}
            </h3>
            <p className="text-sm md:text-base text-slate-700 mt-2 max-w-2xl">
              Terima kasih telah menjadi bagian dari perubahan besar bagi masyarakat desa.
              Setiap bantuan yang Anda salurkan adalah harapan baru bagi mereka yang membutuhkan.
            </p>
          </div>
        </div>
      </section>

      {/* Impact section */}
      <section className="bg-green-200/80">
        <div className="max-w-6xl mx-auto px-4 py-8 md:py-12">
          <h4 className="text-2xl md:text-3xl font-extrabold text-[#0B2B5E] text-center mb-8">
            Dampak Nyata dari Kebaikan Anda <span role="img" aria-label="handshake">🤝</span>
          </h4>
          
          {/* Debug Info - Development Only */}
          {import.meta.env.DEV && (
            <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-400 rounded-lg">
              <div className="text-sm font-bold text-yellow-900 mb-2">🐛 Debug Info:</div>
              <div className="text-xs text-yellow-800 space-y-1">
                <div>Loading: {loading ? 'true' : 'false'}</div>
                <div>Has stats: {dashboardData?.stats ? 'true' : 'false'}</div>
                <div>Raw total_bantuan_uang: {JSON.stringify(dashboardData.stats?.total_bantuan_uang)} (Type: {typeof dashboardData.stats?.total_bantuan_uang})</div>
                <div>Raw total_bantuan_barang: {JSON.stringify(dashboardData.stats?.total_bantuan_barang)} (Type: {typeof dashboardData.stats?.total_bantuan_barang})</div>
                <div>Formatted Uang: {dashboardData.stats?.total_bantuan_uang ? formatCurrency(dashboardData.stats.total_bantuan_uang) : 'N/A'}</div>
                <div>Formatted Barang: {dashboardData.stats?.total_bantuan_barang ? `${dashboardData.stats.total_bantuan_barang.toLocaleString('id-ID')} Unit` : 'N/A'}</div>
              </div>
            </div>
          )}

          {/* TOTAL DONASI - Combined Card with Uang & Barang */}
          <div className="mb-6">
            <div className="bg-white rounded-2xl border-4 border-green-500 px-8 py-8 shadow-xl">
              <div className="text-center mb-6">
                <h5 className="text-2xl font-bold text-[#0B2B5E] mb-2">Total Donasi Anda</h5>
                <p className="text-sm text-slate-600">Donasi dalam bentuk uang dan barang yang telah Anda salurkan</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* DONASI UANG */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-400 p-6 shadow-md">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="bg-green-500 p-3 rounded-full">
                      <CircleDollarSign className="w-7 h-7 text-white" />
                    </div>
                    <h6 className="text-lg font-bold text-gray-700">Donasi Uang</h6>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-extrabold text-green-600">
                      {loading ? "Memuat..." : formatCurrency(dashboardData.stats?.total_bantuan_uang || 0)}
                    </div>
                    <p className="text-xs text-slate-500 mt-2">Total donasi dalam bentuk uang/tunai</p>
                    {!loading && import.meta.env.DEV && (
                      <div className="mt-2 text-xs text-gray-400">
                        Debug: Raw={dashboardData.stats?.total_bantuan_uang ?? 'undefined'} | Type={typeof dashboardData.stats?.total_bantuan_uang}
                      </div>
                    )}
                  </div>
                </div>

                {/* DONASI BARANG */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border-2 border-blue-400 p-6 shadow-md">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="bg-blue-500 p-3 rounded-full">
                      <Package className="w-7 h-7 text-white" />
                    </div>
                    <h6 className="text-lg font-bold text-gray-700">Donasi Barang</h6>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl md:text-5xl font-extrabold text-blue-600">
                      {loading ? "Memuat..." : `${(dashboardData.stats?.total_bantuan_barang || 0).toLocaleString('id-ID')}`}
                    </div>
                    <p className="text-lg font-semibold text-blue-500 mt-1">Unit</p>
                    <p className="text-xs text-slate-500 mt-1">Total donasi dalam bentuk barang/unit</p>
                    {!loading && import.meta.env.DEV && (
                      <div className="mt-2 text-xs text-gray-400">
                        Debug: Raw={dashboardData.stats?.total_bantuan_barang ?? 'undefined'} | Type={typeof dashboardData.stats?.total_bantuan_barang}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Statistik Lainnya */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Penerima Terbantu */}
            <div className="bg-white rounded-xl border-2 border-purple-400 px-6 py-6 shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="w-8 h-8 text-purple-600" />
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-purple-600">
                    {loading ? "..." : (dashboardData.stats?.total_penerima || 0)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Penerima Terbantu</div>
                </div>
              </div>
            </div>

            {/* Program Aktif */}
            <div className="bg-white rounded-xl border-2 border-orange-400 px-6 py-6 shadow-md">
              <div className="flex items-center gap-4">
                <div className="bg-orange-100 p-3 rounded-full">
                  <HandHeart className="w-8 h-8 text-orange-600" />
                </div>
                <div>
                  <div className="text-4xl font-extrabold text-orange-600">
                    {loading ? "..." : (dashboardData.stats?.active_programs || 0)}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">Program Aktif</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 text-center">
          <h5 className="text-2xl md:text-3xl font-extrabold text-[#0B2B5E]">
            Ayo, Lanjutkan Kebaikan Anda
          </h5>
          <p className="text-sm md:text-base text-slate-700 mt-3 max-w-3xl mx-auto">
            Setiap donasi berarti harapan baru bagi masyarakat desa. Teruskan langkah kecil ini untuk
            membantu lebih banyak keluarga, membangun kesejahteraan bersama, dan mewujudkan desa yang
            mandiri dan penuh kepedulian.
          </p>

          <div className="mt-6 flex items-center justify-center gap-4 flex-wrap">
            <button className="px-5 py-2.5 rounded-lg border border-green-600 text-green-700 font-semibold hover:bg-green-50">
              Riwayat Donasi Anda
            </button>
            <button className="px-5 py-2.5 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 shadow">
              Donasi Sekarang
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

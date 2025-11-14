import React, { useState, useEffect } from "react";
import NavbarDonatur from "../../layout/NavbarDonatur";
import { CircleDollarSign, Users, HandHeart, Loader2 } from "lucide-react";
import hero from "../../../assets/lovehand 1.png";
import api from "../../../services/api";

export default function DonorDashboard() {
  const [profileData, setProfileData] = useState(null);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch profile data for welcome message
      const profileResponse = await api.get('/api/donatur/profile');
      console.log('Profile Response:', profileResponse.data);
      setProfileData(profileResponse.data);

      // Fetch dashboard statistics
      const dashboardResponse = await api.get('/api/donatur/dashboard');
      console.log('Dashboard Response:', dashboardResponse.data);
      
      // Dashboard response has stats nested in .stats
      setDashboardStats(dashboardResponse.data.stats || dashboardResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <NavbarDonatur />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
            <p className="text-slate-600">Memuat data dashboard...</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <NavbarDonatur />

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
              {profileData?.nama_organisasi || 'Donatur'}
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
          <h4 className="text-2xl md:text-3xl font-extrabold text-[#0B2B5E] text-center">
            Dampak Nyata dari Kebaikan Anda <span role="img" aria-label="handshake">🤝</span>
          </h4>

          <div className="grid md:grid-cols-3 gap-6 mt-8">
            {/* Card 1 - Total Donasi (Uang + Barang) */}
            <div className="bg-slate-100 rounded-xl border-2 border-[#3B82F6]/50 px-6 py-6 shadow-sm flex flex-col items-center">
              <div className="flex items-center gap-3 text-[#0B2B5E]">
                <CircleDollarSign className="w-6 h-6 text-green-700" />
                <div className="flex flex-col items-center">
                  <div className="text-lg md:text-xl font-bold">
                    {dashboardStats?.total_bantuan_uang ? 
                      `Rp ${parseInt(dashboardStats.total_bantuan_uang).toLocaleString('id-ID')} ` 
                      : 'Rp 0'}
                  </div>
                  {dashboardStats?.total_bantuan_barang > 0 && (
                    <div className="text-sm font-semibold text-green-700 mt-1">
                      + {parseInt(dashboardStats.total_bantuan_barang).toLocaleString('id-ID')} unit 
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-2 text-slate-700">Total Donasi</div>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-100 rounded-xl border-2 border-[#3B82F6]/50 px-6 py-6 shadow-sm flex flex-col items-center">
              <div className="flex items-center gap-3 text-[#0B2B5E]">
                <Users className="w-6 h-6 text-green-700" />
                <div className="text-lg md:text-xl font-bold">
                  {dashboardStats?.total_penerima || 0}
                </div>
              </div>
              <div className="mt-2 text-slate-700">Penerima Terbantu</div>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-100 rounded-xl border-2 border-[#3B82F6]/50 px-6 py-6 shadow-sm flex flex-col items-center">
              <div className="flex items-center gap-3 text-[#0B2B5E]">
                <HandHeart className="w-6 h-6 text-green-700" />
                <div className="text-lg md:text-xl font-bold">
                  {dashboardStats?.total_programs || 0}
                </div>
              </div>
              <div className="mt-2 text-slate-700">Program Didukung</div>
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

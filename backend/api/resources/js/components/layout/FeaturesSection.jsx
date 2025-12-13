import { useState, useEffect } from "react";
import HotlineIcon from "../../assets/iconHotline 1.png"
import ReportIcon from "../../assets/iconReport 1.png"
import UsersIcon from "../../assets/iconUsers 1.png"
import DanaIcon from "../../assets/iconTotalDana 1.png"
import KeluargaIcon from "../../assets/iconKeluarga 1.png"
import FrameIcon from "../../assets/Frame.png"
import { Link } from "react-router-dom";

export default function FeaturesSection() {
  const [stats, setStats] = useState({ total_funds: 0, total_recipients: 0, active_programs: 0 });
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load statistics
      const statsResponse = await fetch('/api/public/statistics');
      const statsData = await statsResponse.json();
      if (statsData.success) {
        setStats(statsData.data);
      }

      // Load active programs
      const programsResponse = await fetch('/api/public/programs/active');
      const programsData = await programsResponse.json();
      if (programsData.success) {
        setPrograms(programsData.data.slice(0, 3)); // Take first 3 programs
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
  };

  return (
    <section className="bg-white text-center py-12 px-6 md:px-20">
      {/* Top 3 Feature Boxes */}
      <div className="grid md:grid-cols-3 gap-10 mb-16">
        {/* Program Bantuan */}
        <div>
          <div className="flex justify-center mb-3">
            <img src={UsersIcon} alt="Program Bantuan" className="w-20 h-20" />
          </div>
          <h3 className="text-[#0B2B5E] font-semibold text-lg">Program Bantuan</h3>
          <p className="text-gray-700 text-sm mt-2 max-w-xs mx-auto">
            Informasi tentang program bantuan yang disalurkan ke masyarakat
          </p>
        </div>

        {/* Laporan Transparansi */}
        <div>
          <div className="flex justify-center mb-3">
            <img src={ReportIcon} alt="Laporan Transparansi" className="w-20 h-20" />
          </div>
          <h3 className="text-[#0B2B5E] font-semibold text-lg">Laporan Transparansi</h3>
          <p className="text-gray-700 text-sm mt-2 max-w-xs mx-auto">
            Laporan keuangan dan pendistribusian bantuan
          </p>
        </div>

        {/* Pengaduan Masyarakat */}
        <div>
          <div className="flex justify-center mb-3">
            <img src={HotlineIcon} alt="Pengaduan Masyarakat" className="w-20 h-20" />
          </div>
          <h3 className="text-[#0B2B5E] font-semibold text-lg">Pengaduan Masyarakat</h3>
          <p className="text-gray-700 text-sm mt-2 max-w-xs mx-auto">
            Informasi kontak pengaduan untuk masyarakat terkait penyaluran bantuan
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-[#B8DEC0] py-10 rounded-md">
        <h2 className="text-[#0B2B5E] text-xl font-semibold mb-10">
          Capaian dan Distribusi Bantuan Sosial
        </h2>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0B2B5E]"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 px-8 md:px-16">
            {/* Total Dana */}
            <div className="bg-white border border-[#0B2B5E] rounded-lg p-6 shadow-sm">
              <div className="flex justify-center mb-3">
                  <img src={DanaIcon} alt="Total Dana" className="w-20 h-20" />
              </div>
              <p className="text-[#0B2B5E] text-lg font-semibold mb-1">
                {formatCurrency(stats.total_funds)}
              </p>
              <p className="text-[#0B2B5E] font-medium">Total Dana</p>
              <p className="text-gray-600 text-sm mt-1">Periode 2025</p>
            </div>

            {/* Penerima Bantuan */}
            <div className="bg-white border border-[#0B2B5E] rounded-lg p-6 shadow-sm">
              <div className="flex justify-center mb-3">
                  <img src={KeluargaIcon} alt="Penerima Bantuan" className="w-20 h-20" />
              </div>
              <p className="text-[#0B2B5E] text-lg font-semibold mb-1">{stats.total_recipients}</p>
              <p className="text-[#0B2B5E] font-medium">Penerima Bantuan</p>
              <p className="text-gray-600 text-sm mt-1">Kepala Keluarga</p>
            </div>

            {/* Program Aktif */}
            <div className="bg-white border border-[#0B2B5E] rounded-lg p-6 shadow-sm">
              <div className="flex justify-center mb-3">
                  <img src={FrameIcon} alt="Program Aktif" className="w-20 h-20" />
              </div>
              <p className="text-[#0B2B5E] text-lg font-semibold mb-1">{stats.active_programs}</p>
              <p className="text-[#0B2B5E] font-medium">Program Aktif</p>
              <p className="text-gray-600 text-sm mt-1">Dalam Penyaluran</p>
            </div>
          </div>
        )}
      </div>
      {/* Jadwal Penyaluran Bantuan Section */}
      <div className="mt-16 bg-[#F9FAFB] py-10 rounded-xl shadow-sm">
        <h2 className="text-[#0B2B5E] text-xl md:text-2xl font-semibold mb-6">
          Program Bantuan Aktif
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 bg-white shadow-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#39B66A] text-white text-left">
                <th className="py-3 px-5 text-sm font-medium">Nama Program</th>
                <th className="py-3 px-5 text-sm font-medium">Deskripsi</th>
                <th className="py-3 px-5 text-sm font-medium">Kategori</th>
                <th className="py-3 px-5 text-sm font-medium">Periode</th>
                <th className="py-3 px-5 text-sm font-medium">Progress</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    Memuat data...
                  </td>
                </tr>
              ) : programs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    Tidak ada program aktif
                  </td>
                </tr>
              ) : (
                programs.map((program) => (
                  <tr key={program.id_program} className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                    <td className="py-4 px-5 font-medium">{program.nama_program}</td>
                    <td className="py-4 px-5">{program.deskripsi || '-'}</td>
                    <td className="py-4 px-5">{program.kategori?.nama_kategori || '-'}</td>
                    <td className="py-4 px-5">
                      {formatDate(program.tanggal_mulai)} - {formatDate(program.tanggal_selesai)}
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-green-600 transition-all"
                            style={{ width: `${program.progress_percentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 min-w-[45px]">
                          {program.progress_percentage}%
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end mx-10">
          <Link to="/penyaluran" className="inline-block bg-green-600 text-white px-5 py-3 rounded-lg font-semibold shadow-sm hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95">
            Lihat Detail Penyaluran Disini...
          </Link>
        </div>
      </div>

    </section>
    
  );
}

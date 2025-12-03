import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import api from "../../utils/api";

export default function PenyaluranPublicPage() {
  const [distributions, setDistributions] = useState([]);
  const [filteredDistributions, setFilteredDistributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadDistributions();
  }, []);

  useEffect(() => {
    filterDistributions();
  }, [searchQuery, distributions]);

  const loadDistributions = async () => {
    try {
      setLoading(true);
      
      // Mock data sesuai gambar - nantinya bisa diganti dengan API call
      const mockData = [
        { id: 1, program: 'Bantuan Sembako Ramadan 2025', penerima: 'Budi Santoso', jumlah: '1 Paket', tanggal: '2025-02-20', lokasi: 'Kantor Desa Sejahtera', status: 'Selesai' },
        { id: 2, program: 'Bantuan Sembako Ramadan 2025', penerima: 'Ahmad Dahlan', jumlah: '1 Paket', tanggal: '2025-02-15', lokasi: 'Kantor Desa Sejahtera', status: 'Selesai' },
        { id: 3, program: 'Bantuan Sembako Ramadan 2025', penerima: 'Siti Aminah', jumlah: '1 Paket', tanggal: '2025-02-15', lokasi: 'Kantor Desa Sejahtera', status: 'Selesai' },
        { id: 4, program: 'Beasiswa Siswa Berprestasi 2025', penerima: 'Ahmad Dahlan', jumlah: 'Rp 500.000', tanggal: '2025-02-01', lokasi: 'Kantor Desa Sejahtera', status: 'Selesai' },
        { id: 5, program: 'Beasiswa Siswa Berprestasi 2025', penerima: 'Siti Aminah', jumlah: 'Rp 500.000', tanggal: '2025-02-01', lokasi: 'Kantor Desa Sejahtera', status: 'Selesai' },
        { id: 6, program: 'Bantuan Korban Banjir 2025', penerima: 'Joko Widodo', jumlah: '1 Paket', tanggal: '2025-01-26', lokasi: 'Posko Banjir RT 03', status: 'Selesai' },
        { id: 7, program: 'Bantuan Korban Banjir 2025', penerima: 'Dewi Lestari', jumlah: '1 Paket', tanggal: '2025-01-26', lokasi: 'Posko Banjir RT 03', status: 'Selesai' },
        { id: 8, program: 'Bantuan Korban Banjir 2025', penerima: 'Agus Salim', jumlah: '1 Paket', tanggal: '2025-01-26', lokasi: 'Posko Banjir RT 04', status: 'Selesai' },
      ];
      
      setDistributions(mockData);
      
      // Alternative: Load from API
      // const response = await api.get('/api/penyaluran/public');
      // if (response.data) {
      //   setDistributions(response.data.data || response.data);
      // }
      
    } catch (err) {
      console.error("Error loading distributions:", err);
      setError(err.message || "Gagal memuat data penyaluran");
    } finally {
      setLoading(false);
    }
  };

  const filterDistributions = () => {
    if (!searchQuery.trim()) {
      setFilteredDistributions(distributions);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = distributions.filter(d => 
      d.program.toLowerCase().includes(query) ||
      d.penerima.toLowerCase().includes(query) ||
      d.lokasi.toLowerCase().includes(query)
    );
    
    setFilteredDistributions(filtered);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-slate-600 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Terjadi Kesalahan</h2>
          <p className="text-slate-600 text-center">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-sky-100 to-blue-50 border-b border-sky-200 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-3 text-center">
            Penyaluran Bantuan ke Warga
          </h1>
          <p className="text-base md:text-lg text-slate-600 text-center max-w-3xl mx-auto">
            Konfirmasi penerima, tandai status penyaluran, dan unggah dokumentasi transparansi.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200">
          {/* Search Box */}
          <div className="p-6 border-b border-slate-200">
            <div className="relative max-w-md">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari program, penerima, atau lokasi"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-emerald-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Program
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Penerima
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Jumlah
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Lokasi
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredDistributions.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      {searchQuery ? 'Tidak ada data yang sesuai dengan pencarian.' : 'Belum ada data penyaluran.'}
                    </td>
                  </tr>
                ) : (
                  filteredDistributions.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-800">{item.program}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-blue-600 font-medium cursor-pointer hover:text-blue-700">
                          {item.penerima}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-semibold text-slate-800">{item.jumlah}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">{formatDate(item.tanggal)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-slate-600">{item.lokasi}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 border border-emerald-200">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

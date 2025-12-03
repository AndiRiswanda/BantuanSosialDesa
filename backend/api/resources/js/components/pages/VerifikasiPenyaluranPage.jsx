/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, Search, Check } from "lucide-react";
import api from "../../utils/api";

export default function VerifikasiPenyaluranPage() {
  const { programId } = useParams();
  const navigate = useNavigate();
  
  const [program, setProgram] = useState(null);
  const [recipients, setRecipients] = useState([]);
  const [filteredRecipients, setFilteredRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedTahap, setSelectedTahap] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [progressData, setProgressData] = useState({ selesai: 0, total: 0 });

  useEffect(() => {
    loadProgramData();
  }, [programId]);

  useEffect(() => {
    filterRecipients();
  }, [selectedTahap, searchQuery, recipients]);

  const loadProgramData = async () => {
    try {
      setLoading(true);
      
      // Load program detail
      const programResponse = await api.get(`/api/programs/${programId}`);
      if (programResponse.data) {
        setProgram(programResponse.data.data || programResponse.data);
      }

      // Load recipients for this program (mock data for now)
      // In real implementation, this should fetch from backend
      const mockRecipients = [
        { id: 1, no_kk: '7310012121204', nama: 'Ahmad Yani', alamat: 'Jl. Melati No. 12, RT 01/02', tahap: 'Tahap 1', penyaluran: 20, status: 'Selesai' },
        { id: 2, no_kk: '3601****5676', nama: 'Siti Aminah', alamat: 'Jl. Mawar No. 8, RT 02/03', tahap: 'Tahap 1', penyaluran: 20, status: 'Selesai' },
        { id: 3, no_kk: '3601****3456', nama: 'Ratna Dewi', alamat: 'Jl. Anggrek No. 4, RT 01/03', tahap: 'Tahap 1', penyaluran: 20, status: 'Selesai' },
        { id: 4, no_kk: '3601****7890', nama: 'Joko Susilo', alamat: 'Jl. Anggrek No. 15, RT 01/02', tahap: 'Tahap 1', penyaluran: 20, status: 'Selesai' },
        { id: 5, no_kk: '3601****5346', nama: 'Siti Nurhayati', alamat: 'Jl. Kemiri 5, RT 03/01', tahap: 'Tahap 1', penyaluran: 20, status: 'Selesai' },
        { id: 6, no_kk: '3601****7434', nama: 'Rina Marina', alamat: 'Jl. Mawar 3, RT 05/01', tahap: 'Tahap 1', penyaluran: 20, status: 'Selesai' },
        { id: 7, no_kk: '3601****9732', nama: 'Nur Aini', alamat: 'Jl. Kebon 9, RT 04/02', tahap: 'Tahap 1', penyaluran: 20, status: 'Selesai' },
        { id: 8, no_kk: '3601****7248', nama: 'Maya Lestari', alamat: 'Jl. Merpati 11, RT 02/01', tahap: 'Tahap 1', penyaluran: 20, status: 'Selesai' },
        { id: 9, no_kk: '3601****1256', nama: 'Fitri Handayani', alamat: 'Jl. Flamboyan 4, RT 03/02', tahap: 'Tahap 1', penyaluran: 20, status: 'Selesai' },
        { id: 10, no_kk: '3601****2523', nama: 'Dewi Paramita', alamat: 'Jl. Pattia 1, RT 04/01', tahap: 'Tahap 1', penyaluran: 20, status: 'Selesai' },
      ];
      
      setRecipients(mockRecipients);
      calculateProgress(mockRecipients);
      
    } catch (err) {
      console.error("Error loading program data:", err);
      setError(err.message || "Gagal memuat data program");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (data) => {
    const selesai = data.filter(r => r.status === 'Selesai').length;
    setProgressData({ selesai, total: data.length });
  };

  const filterRecipients = () => {
    let filtered = [...recipients];
    
    // Filter by tahap
    if (selectedTahap !== 'Semua') {
      filtered = filtered.filter(r => r.tahap === selectedTahap);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => 
        r.nama.toLowerCase().includes(query) ||
        r.no_kk.includes(query) ||
        r.alamat.toLowerCase().includes(query)
      );
    }
    
    setFilteredRecipients(filtered);
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
          <p className="mt-4 text-slate-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md">
          <div className="text-red-600 text-center mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 text-center mb-2">Data Tidak Ditemukan</h2>
          <p className="text-slate-600 text-center mb-6">{error || "Program tidak ditemukan"}</p>
          <button
            onClick={() => navigate('/penyaluran')}
            className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  const progressPercentage = progressData.total > 0 
    ? ((progressData.selesai / progressData.total) * 100).toFixed(0) 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header with Back Button */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-white hover:text-emerald-100 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="font-medium">Verifikasi Penyaluran</span>
          </button>
        </div>
      </div>

      {/* Program Info Section */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="mb-6">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-2 ${
                  program.jenis_bantuan === 'Barang' 
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : program.jenis_bantuan === 'Uang'
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-purple-100 text-purple-700 border border-purple-200'
                }`}>
                  {program.jenis_bantuan || 'Barang'}
                </span>
                <span className="ml-2 inline-block px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200">
                  Tanggal & Tembola
                </span>
              </div>
              {program.status === 'terjadwal' && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                  Terjadwal
                </span>
              )}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2">
              {program.nama_program}
            </h1>
            
            <p className="text-slate-600 mb-4">
              {program.deskripsi || 'Program ini mengajakIbu rumah tangga menanam sayuran organik di pekarangan rumah sebagai sumber tambahan pangan dan penghasilan.'}
            </p>

            {/* Periode Info */}
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Tanggal Dimulai</div>
                  <div className="text-sm font-semibold text-slate-800">{formatDate(program.tanggal_mulai)}</div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">Tanggal Selesai</div>
                  <div className="text-sm font-semibold text-slate-800">{formatDate(program.tanggal_selesai)}</div>
                </div>
              </div>
            </div>

            {/* Jenis Donasi */}
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-slate-700">
                <span className="font-semibold">Jenis Donasi:</span> {program.kategori?.nama_kategori || program.jenis_bantuan || '-'}
              </span>
            </div>
          </div>

          {/* Progress Penyaluran */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-800">Progress Penyaluran</h3>
              <span className="text-2xl font-bold text-emerald-600">{progressPercentage}%</span>
            </div>
            <div className="w-full bg-emerald-200 rounded-full h-3 overflow-hidden mb-2">
              <div 
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="text-xs text-slate-600">
              ({progressData.selesai}/{progressData.total} KK)
            </div>
          </div>
        </div>
      </div>

      {/* Filter and List Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200">
          {/* Filter Section */}
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter Tahap
            </h2>
            
            <div className="flex flex-wrap gap-3 mb-4">
              {['Semua', 'Tahap 1', 'Tahap 2', 'Tahap 3'].map((tahap) => (
                <button
                  key={tahap}
                  onClick={() => setSelectedTahap(tahap)}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedTahap === tahap
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {tahap}
                </button>
              ))}
            </div>

            {/* Search Box */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Nama atau No. KK"
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          {/* Recipients Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-emerald-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">No. KK</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Nama Penerima</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Alamat</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Penyaluran</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredRecipients.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      Tidak ada data penerima yang sesuai dengan filter.
                    </td>
                  </tr>
                ) : (
                  filteredRecipients.map((recipient, index) => (
                    <tr key={recipient.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-700">{index + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800">{recipient.no_kk}</td>
                      <td className="px-6 py-4 text-sm text-slate-800">{recipient.nama}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{recipient.alamat}</td>
                      <td className="px-6 py-4 text-sm text-slate-700">{recipient.tahap}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                          recipient.status === 'Selesai'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-100 text-amber-700 border border-amber-200'
                        }`}>
                          {recipient.status === 'Selesai' && <Check className="w-3 h-3" />}
                          {recipient.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Upload Button */}
          <div className="border-t border-slate-200 p-6 bg-slate-50">
            <button
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload Dokumentasi Penyaluran
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

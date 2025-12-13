/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { adminAPI } from "../../../utils/api";

function Pagination({ currentPage, lastPage, onPageChange }) {
  const pages = [];
  const maxVisible = 5;
  
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(lastPage, startPage + maxVisible - 1);
  
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5 text-slate-600" />
      </button>
      
      {startPage > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm font-medium text-slate-700"
          >
            1
          </button>
          {startPage > 2 && <span className="text-slate-400">...</span>}
        </>
      )}
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            page === currentPage
              ? 'bg-emerald-600 text-white'
              : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      {endPage < lastPage && (
        <>
          {endPage < lastPage - 1 && <span className="text-slate-400">...</span>}
          <button
            onClick={() => onPageChange(lastPage)}
            className="px-3 py-2 rounded-lg border border-slate-300 hover:bg-slate-50 text-sm font-medium text-slate-700"
          >
            {lastPage}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === lastPage}
        className="p-2 rounded-lg border border-slate-300 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5 text-slate-600" />
      </button>
    </div>
  );
}

export default function AdminDistribution() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [programs, setPrograms] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    total: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPrograms(pagination.current_page);
  }, []);

  const loadPrograms = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: page,
        per_page: 10
      };

      if (query.trim()) {
        params.search = query.trim();
      }
      
      const response = await adminAPI.getScheduledPrograms(params);
      console.log("Scheduled Programs data:", response);
      
      if (response.success && response.data) {
        // Check if response has pagination structure
        if (response.data.data && Array.isArray(response.data.data)) {
          // Server-side paginated response
          setPrograms(response.data.data);
          setPagination({
            current_page: response.data.current_page || page,
            last_page: response.data.last_page || 1,
            total: response.data.total || 0
          });
        } else if (Array.isArray(response.data)) {
          // Non-paginated array response
          setPrograms(response.data);
          setPagination({
            current_page: 1,
            last_page: 1,
            total: response.data.length
          });
        } else {
          setPrograms([]);
          setPagination({
            current_page: 1,
            last_page: 1,
            total: 0
          });
        }
      } else {
        setPrograms([]);
        setPagination({
          current_page: 1,
          last_page: 1,
          total: 0
        });
      }
    } catch (err) {
      console.error("Error loading programs:", err);
      setError(err.message || "Gagal memuat data program");
      setPrograms([]);
      setPagination({
        current_page: 1,
        last_page: 1,
        total: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current_page: page }));
    loadPrograms(page);
  };

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (pagination.current_page === 1) {
        loadPrograms(1);
      } else {
        // Reset to page 1 on search
        setPagination(prev => ({ ...prev, current_page: 1 }));
        loadPrograms(1);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [query]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const month = date.toLocaleDateString('id-ID', { month: 'long' });
    const year = date.getFullYear();
    return `${month} ${year}`;
  };

  const formatPeriode = (program) => {
    if (!program.tanggal_mulai || !program.tanggal_selesai) return '-';
    const start = new Date(program.tanggal_mulai);
    const end = new Date(program.tanggal_selesai);
    const startMonth = start.toLocaleDateString('id-ID', { month: 'long' });
    const endMonth = end.toLocaleDateString('id-ID', { month: 'long' });
    const year = end.getFullYear();
    
    if (startMonth === endMonth) {
      return `${startMonth} ${year}`;
    }
    return `${startMonth} - ${endMonth} ${year}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <NavbarAdmin />
      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        <header className="text-center mb-8">
          <h1 className="text-slate-800 font-bold text-3xl mb-2">Penyaluran Bantuan ke Warga</h1>
          <p className="text-base text-slate-600">Konfirmasi penerima, tandai status penyaluran, dan unggah dokumentasi transparansi.</p>
        </header>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <div className="text-red-600">⚠️</div>
            <div>
              <div className="text-red-800 font-semibold">Gagal Memuat Data</div>
              <div className="text-red-700 text-sm">{error}</div>
              <button 
                onClick={loadPrograms}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-slate-600">Memuat data program...</span>
          </div>
        )}

        {!loading && (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-lg border border-slate-200">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-emerald-600 text-white">
                    <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Nama Program</th>
                    <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Deskripsi</th>
                    <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Kategori</th>
                    <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Periode</th>
                    <th className="px-6 py-4 text-left font-bold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {programs.map((program) => (
                    <tr key={program.id_program} className="hover:bg-slate-50 transition-colors">
                      <td className="align-top px-6 py-4 text-slate-800 font-medium">
                        {program.nama_program || '-'}
                      </td>
                      <td className="align-top px-6 py-4 text-slate-600">
                        <div className="max-w-md">
                          {program.deskripsi || '-'}
                        </div>
                      </td>
                      <td className="align-top px-6 py-4 text-slate-700">
                        {program.jenis_bantuan === 'uang' ? 'Uang' : program.jenis_bantuan === 'barang' ? 'Barang' : '-'}
                      </td>
                      <td className="align-top px-6 py-4 whitespace-nowrap text-slate-700">
                        {formatPeriode(program)}
                      </td>
                      <td className="align-top px-6 py-4">
                        <button
                          onClick={() => navigate(`/admin/penyaluran/${program.id_program}/verifikasi`)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 hover:shadow-md transition-all duration-200 active:scale-95 text-xs"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Verifikasi
                        </button>
                      </td>
                    </tr>
                  ))}
                  {programs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        {query ? 'Tidak ada program yang sesuai dengan pencarian.' : 'Belum ada program penyaluran aktif.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination for Desktop */}
            <div className="hidden md:block bg-white rounded-b-xl border-t border-slate-200">
              <Pagination 
                currentPage={pagination.current_page}
                lastPage={pagination.last_page}
                onPageChange={handlePageChange}
              />
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {programs.map((program) => (
                <section 
                  key={program.id_program} 
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
                >
                  <h3 className="text-slate-900 font-semibold mb-2">
                    {program.nama_program || '-'}
                  </h3>
                  <p className="text-sm text-slate-600 mb-2">
                    {program.deskripsi || '-'}
                  </p>
                  <div className="text-sm space-y-1 mb-3">
                    <p className="text-slate-700">
                      <span className="font-medium">Kategori:</span> {program.jenis_bantuan === 'uang' ? 'Uang' : program.jenis_bantuan === 'barang' ? 'Barang' : '-'}
                    </p>
                    <p className="text-slate-700">
                      <span className="font-medium">Periode:</span> {formatPeriode(program)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/admin/penyaluran/${program.id_program}/verifikasi`)}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 hover:shadow-md transition-all duration-200 active:scale-95 text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Verifikasi
                  </button>
                </section>
              ))}
              {programs.length === 0 && (
                <div className="text-center bg-white rounded-xl shadow-sm border border-slate-200 py-12">
                  <p className="text-slate-600 text-sm">
                    {query ? 'Tidak ada program yang sesuai dengan pencarian.' : 'Belum ada program penyaluran aktif.'}
                  </p>
                </div>
              )}
              
              {/* Pagination for Mobile */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200">
                <Pagination 
                  currentPage={pagination.current_page}
                  lastPage={pagination.last_page}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

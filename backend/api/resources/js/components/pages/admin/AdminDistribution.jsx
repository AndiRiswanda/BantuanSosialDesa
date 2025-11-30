import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { Loader2 } from "lucide-react";
import { adminAPI } from "../../../utils/api";

function StatusBadge({ status }) {
  const statusMap = {
    'dijadwalkan': { bg: 'bg-amber-100', text: 'text-amber-800', label: 'Dijadwalkan' },
    'selesai': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Selesai' },
    'dibatalkan': { bg: 'bg-red-100', text: 'text-red-700', label: 'Dibatalkan' },
  };
  
  const style = statusMap[status] || statusMap['dijadwalkan'];
  
  return (
    <span
      className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${style.bg} ${style.text}`}
    >
      {style.label}
    </span>
  );
}

function CategoryChip({ label }) {
  return (
    <span className="inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-semibold border border-slate-300 bg-slate-50 text-slate-700">
      {label}
    </span>
  );
}

export default function AdminDistribution() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (query.trim()) {
        params.search = query.trim();
      }
      
      const response = await adminAPI.getTransaksi(params);
      console.log("Transactions data:", response);
      
      if (response.success && response.data) {
        const data = response.data.data || response.data;
        setTransactions(Array.isArray(data) ? data : []);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error("Error loading transactions:", err);
      setError(err.message || "Gagal memuat data transaksi");
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  // Search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadTransactions();
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [query]);

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatJumlah = (transaction) => {
    const jenisBantuan = transaction.penerima_program?.program?.jenis_bantuan;
    const jumlah = transaction.jumlah_diterima;
    
    if (jenisBantuan === 'barang') {
      // Untuk bantuan barang, tampilkan sebagai jumlah paket/unit (integer saja, tanpa desimal)
      return `${parseInt(jumlah)} Paket`;
    } else {
      // Untuk bantuan uang, tampilkan format rupiah
      return formatCurrency(jumlah);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarAdmin />
      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        <header className="text-center mb-6">
          <h1 className="text-[#0B2B5E] font-semibold text-xl">Penyaluran Bantuan ke Warga</h1>
          <p className="text-xs text-slate-600 mt-1">Konfirmasi penerima, tandai status penyaluran, dan unggah dokumentasi transparansi.</p>
        </header>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
            <div className="text-red-600">⚠️</div>
            <div>
              <div className="text-red-800 font-semibold">Gagal Memuat Data</div>
              <div className="text-red-700 text-sm">{error}</div>
              <button 
                onClick={loadTransactions}
                className="mt-2 text-sm text-red-600 hover:text-red-700 underline"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        )}

        <div className="mb-4 max-w-md">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari program, penerima, atau lokasi"
            className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
          />
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-slate-600">Memuat data transaksi...</span>
          </div>
        )}

        {!loading && (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto bg-white rounded-xl shadow-sm border border-slate-200">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-emerald-700 text-white">
                    <th className="px-4 py-3 text-left">Program</th>
                    <th className="px-4 py-3 text-left">Penerima</th>
                    <th className="px-4 py-3 text-left">Jumlah</th>
                    <th className="px-4 py-3 text-left">Tanggal</th>
                    <th className="px-4 py-3 text-left">Lokasi</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id_transaksi} className="hover:bg-slate-50">
                      <td className="align-top px-4 py-3 text-slate-900 font-medium">
                        {transaction.penerima_program?.program?.nama_program || '-'}
                      </td>
                      <td className="align-top px-4 py-3 text-slate-700">
                        {transaction.penerima_program?.penerima?.nama_kepala || '-'}
                      </td>
                      <td className="align-top px-4 py-3 text-slate-900 font-semibold">
                        {formatJumlah(transaction)}
                      </td>
                      <td className="align-top px-4 py-3 whitespace-nowrap text-slate-900">
                        {formatDate(transaction.tanggal_penyaluran)}
                      </td>
                      <td className="align-top px-4 py-3 text-slate-700 text-xs">
                        {transaction.lokasi_penyaluran || '-'}
                      </td>
                      <td className="align-top px-4 py-3">
                        <button
                          type="button"
                          onClick={() => navigate(`/admin/transaksi/${transaction.id_transaksi}`)}
                          className="focus:outline-none"
                        >
                          <StatusBadge status={transaction.status_penyaluran} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-slate-600">
                        Tidak ada data transaksi penyaluran.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-4">
              {transactions.map((transaction) => (
                <section 
                  key={transaction.id_transaksi} 
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"
                  onClick={() => navigate(`/admin/transaksi/${transaction.id_transaksi}`)}
                >
                  <h3 className="text-slate-900 font-semibold">
                    {transaction.penerima_program?.program?.nama_program || '-'}
                  </h3>
                  <p className="mt-1 text-sm text-slate-700">
                    Penerima: {transaction.penerima_program?.penerima?.nama_kepala || '-'}
                  </p>
                  <div className="mt-2 text-sm">
                    <p className="text-slate-900 font-semibold">
                      {formatJumlah(transaction)}
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {formatDate(transaction.tanggal_penyaluran)} • {transaction.lokasi_penyaluran || '-'}
                    </p>
                  </div>
                  <div className="mt-3">
                    <StatusBadge status={transaction.status_penyaluran} />
                  </div>
                </section>
              ))}
              {transactions.length === 0 && (
                <div className="text-center bg-white rounded-xl shadow-sm border border-slate-200 py-12">
                  <p className="text-slate-600 text-sm">Tidak ada data transaksi penyaluran.</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

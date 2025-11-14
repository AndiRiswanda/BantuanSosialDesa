import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarDonor from "../../layout/NavbarDonor";
import { ArrowLeft, CalendarDays, Layers, Package, BadgeDollarSign, Users, Image as ImageIcon, FileText } from "lucide-react";
import { apiFetch } from "../../../utils/api";

const StatusPill = ({ color = "slate", children }) => {
  const map = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700",
    yellow: "bg-yellow-100 text-yellow-700",
    slate: "bg-slate-100 text-slate-700",
  };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${map[color]}`}>{children}</span>;
};

export default function DonorProgramDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [tab, setTab] = useState("DETAIL"); // DETAIL | SCHEDULE | RECIPIENTS | DOCS
  const [program, setProgram] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [recipients, setRecipients] = useState([]);
  const [documentation, setDocumentation] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProgramDetail = async () => {
      try {
        setLoading(true);
        const response = await apiFetch(`/api/donatur/programs/${id}`);
        
        console.log('API Response:', response);
        console.log('Program:', response.program);
        console.log('Penerima Programs:', response.program?.penerima_programs);
        
        if (response.program) {
          setProgram(response.program);
          
          // Debug: Check first penerima_program
          if (response.program.penerima_programs && response.program.penerima_programs.length > 0) {
            const firstPP = response.program.penerima_programs[0];
            console.log('First PP:', firstPP);
            console.log('First PP.penerima:', firstPP.penerima);
            console.log('First PP.penerima.no_kk:', firstPP.penerima?.no_kk);
            console.log('First PP.penerima.nama_kepala:', firstPP.penerima?.nama_kepala);
          }
          
          // Process schedules from transaksi_penyaluran
          const transactionsByDate = {};
          response.program.penerima_programs?.forEach(pp => {
            pp.transaksi_penyaluran?.forEach(tr => {
              const dateKey = tr.tanggal_penyaluran;
              if (!transactionsByDate[dateKey]) {
                transactionsByDate[dateKey] = {
                  date: dateKey,
                  location: tr.lokasi_penyaluran,
                  times: [],
                  recipients: 0,
                  status: 'selesai'
                };
              }
              transactionsByDate[dateKey].times.push(tr.jam_penyaluran);
              transactionsByDate[dateKey].recipients++;
            });
          });
          
          const scheduleData = Object.values(transactionsByDate).map(schedule => ({
            ...schedule,
            times: [...new Set(schedule.times)].sort()
          }));
          setSchedules(scheduleData);
          
          // Process recipients
          const recipientData = response.program.penerima_programs?.map((pp, index) => {
            console.log(`Processing recipient ${index + 1}:`, {
              no_kk: pp.penerima?.no_kk,
              nama: pp.penerima?.nama_kepala,
              alamat: pp.penerima?.alamat
            });
            
            return {
              no: index + 1,
              no_kk: pp.penerima?.no_kk,
              nama: pp.penerima?.nama_kepala,
              alamat: pp.penerima?.alamat,
              tahap: pp.transaksi_penyaluran?.[0]?.catatan || '-',
              status: pp.transaksi_penyaluran?.length > 0 ? 'selesai' : 'menunggu',
              id_penerima_program: pp.id_penerima_program
            };
          }) || [];
          
          console.log('Recipient Data:', recipientData);
          setRecipients(recipientData);
          
          // Process documentation
          const docs = [];
          response.program.penerima_programs?.forEach(pp => {
            pp.transaksi_penyaluran?.forEach(tr => {
              if (tr.bukti_penyaluran) {
                docs.push({
                  url: tr.bukti_penyaluran,
                  caption: `${tr.lokasi_penyaluran} - ${tr.tanggal_penyaluran}`
                });
              }
            });
          });
          setDocumentation(docs);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching program detail:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchProgramDetail();
    }
  }, [id]);

  // Helper functions
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const formatCurrency = (amount) => {
    if (!amount) return '-';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'aktif':
      case 'selesai':
        return 'green';
      case 'pending':
      case 'menunggu':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case 'aktif': return 'Aktif';
      case 'selesai': return 'Selesai';
      case 'pending': return 'Pending';
      case 'menunggu': return 'Menunggu';
      case 'ditunda': return 'Ditunda';
      default: return status || 'Tidak Diketahui';
    }
  };

  const calculateProgress = () => {
    if (!program) return 0;
    const total = recipients.length;
    const completed = recipients.filter(r => r.status === 'selesai').length;
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <NavbarDonor />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Memuat data program...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-white">
        <NavbarDonor />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <p className="text-red-600">Gagal memuat data program</p>
            <button 
              onClick={() => navigate(-1)}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Kembali
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <NavbarDonor />

      {/* Back header */}
      <div className="bg-[#1976d26c]/30">
        <div className="max-w-6xl mx-auto px-3 py-2 text-sm text-[#0B2B5E] flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 hover:text-green-700">
            <ArrowLeft className="w-4 h-4" />
            <span>Detail Program Bantuan</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-5 md:py-8">
        {/* Top intro card */}
        <div className="rounded-2xl border border-green-200 shadow-sm p-5 md:p-6 bg-white">
          <h2 className="text-xl md:text-2xl font-extrabold text-center text-[#0B2B5E]">
            Detail dan Transparansi Program Bantuan
          </h2>
          <p className="text-xs md:text-sm text-slate-600 text-center mt-2">
            Lihat jadwal penyaluran, penerima manfaat, serta dokumentasi kegiatan untuk memastikan bantuan tersalurkan dengan tepat.
          </p>

          <div className="mt-5">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 className="text-base md:text-lg font-semibold text-[#0B2B5E]">{program.nama_program}</h3>
              <StatusPill color={getStatusColor(program.status)}>{getStatusLabel(program.status)}</StatusPill>
            </div>
            <p className="mt-2 text-sm text-slate-700">
              {program.deskripsi}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold inline-flex items-center gap-1">
                <Package className="w-3.5 h-3.5" /> {program.jenis_bantuan === 'uang' ? 'Uang' : 'Barang'}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-semibold inline-flex items-center gap-1">
                <Layers className="w-3.5 h-3.5" /> {program.kategori?.nama_kategori || 'Kategori'}
              </span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4 rounded-2xl border border-slate-200 p-4 shadow-sm">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-700">
            <span>Progress Penyaluran</span>
            <span>{calculateProgress()}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-2 bg-blue-600 rounded-full" style={{ width: `${calculateProgress()}%` }} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-3">
          {[
            { key: "DETAIL", label: "Detail Program", icon: FileText },
            { key: "SCHEDULE", label: "Jadwal Penyaluran", icon: CalendarDays },
            { key: "RECIPIENTS", label: "Daftar Penerima", icon: Users },
            { key: "DOCS", label: "Dokumentasi", icon: ImageIcon },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold shadow-sm border transition-colors ${
                tab === key
                  ? "bg-green-600 text-white border-green-700 hover:bg-green-700"
                  : "bg-white text-[#0B2B5E] border-slate-200 hover:bg-slate-50"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Tab contents */}
        {tab === "DETAIL" && (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <div className="text-[#0B2B5E] font-semibold flex items-center gap-2">
              <CalendarDays className="w-4 h-4" /> Pelaksanaan Program
            </div>
            <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-600 mb-1">Tanggal Dimulai</div>
                <div className="relative">
                  <input readOnly value={formatDate(program.tanggal_mulai)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"/>
                  <CalendarDays className="w-4 h-4 text-slate-400 absolute right-3 top-3.5"/>
                </div>
              </div>
              <div>
                <div className="text-xs text-slate-600 mb-1">Tanggal Selesai</div>
                <div className="relative">
                  <input readOnly value={formatDate(program.tanggal_selesai)} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm"/>
                  <CalendarDays className="w-4 h-4 text-slate-400 absolute right-3 top-3.5"/>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-slate-100 rounded-lg p-3 flex items-start gap-3">
              <BadgeDollarSign className="w-5 h-5 text-green-700"/>
              <div className="text-sm">
                <div className="font-semibold text-slate-700">Jumlah Donasi</div>
                <div className="text-slate-700">
                  {program.jenis_bantuan === 'uang' 
                    ? formatCurrency(program.jumlah_bantuan)
                    : `${program.jumlah_bantuan} unit barang`
                  }
                </div>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[#0B2B5E] font-semibold text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"/> Kriteria Penerima Donasi
              </div>
              <div className="mt-2 rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-700">
                {program.kriteria_penerima || 'Belum ada kriteria yang ditentukan'}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-[#0B2B5E] font-semibold text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-slate-400 rounded-full"/> Keterangan Penerima Donasi
              </div>
              <div className="mt-2 rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-700">
                {program.keterangan || 'Belum ada keterangan'}
              </div>
            </div>
          </div>
        )}

        {tab === "SCHEDULE" && (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-[#0B2B5E]">
              <CalendarDays className="w-4 h-4"/> Jadwal Penyaluran Bantuan
            </div>
            {schedules.length > 0 ? (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      {["Tanggal","Lokasi Penyerahan","Jam Pengambilan","Status","Penerima"].map((h) => (
                        <th key={h} className="bg-green-200/60 text-[#0B2B5E] font-semibold px-3 py-2 border border-green-300 first:rounded-l-lg last:rounded-r-lg">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {schedules.map((schedule, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-3 py-3 align-top border-l border-slate-200">{formatDate(schedule.date)}</td>
                        <td className="px-3 py-3 align-top">{schedule.location}</td>
                        <td className="px-3 py-3 align-top whitespace-pre-line">
                          {schedule.times.map(time => time.substring(0, 5)).join('\n')}
                        </td>
                        <td className="px-3 py-3 align-top">
                          <StatusPill color="green">Selesai</StatusPill>
                        </td>
                        <td className="px-3 py-3 align-top border-r border-slate-200">{schedule.recipients}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-4 text-center py-8 text-slate-500">
                Belum ada jadwal penyaluran
              </div>
            )}
          </div>
        )}

        {tab === "RECIPIENTS" && (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-[#0B2B5E]">
              <Users className="w-4 h-4"/> Daftar Penerima Bantuan
            </div>
            {recipients.length > 0 ? (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left">
                      {["No","No. KK","Nama Penerima","Alamat","Keterangan","Status"].map((h) => (
                        <th key={h} className="bg-green-200/60 text-[#0B2B5E] font-semibold px-3 py-2 border border-green-300 first:rounded-l-lg last:rounded-r-lg">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recipients.map((r, i) => (
                      <tr key={i} className="border-b last:border-b-0">
                        <td className="px-3 py-3 align-top border-l border-slate-200">{r.no}</td>
                        <td className="px-3 py-3 align-top">{r.no_kk}</td>
                        <td className="px-3 py-3 align-top">{r.nama}</td>
                        <td className="px-3 py-3 align-top">{r.alamat || '-'}</td>
                        <td className="px-3 py-3 align-top">{r.tahap}</td>
                        <td className="px-3 py-3 align-top border-r border-slate-200">
                          <StatusPill color={r.status === 'selesai' ? 'green' : 'yellow'}>
                            {r.status === 'selesai' ? 'Selesai' : 'Menunggu'}
                          </StatusPill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="mt-4 text-center py-8 text-slate-500">
                Belum ada penerima yang terdaftar
              </div>
            )}
          </div>
        )}

        {tab === "DOCS" && (
          <div className="mt-4 rounded-2xl border border-slate-200 p-4 md:p-5 shadow-sm">
            <div className="flex items-center gap-2 font-semibold text-[#0B2B5E]">
              <ImageIcon className="w-4 h-4"/> Dokumentasi
            </div>
            {documentation.length > 0 ? (
              <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
                {documentation.map((doc, i) => (
                  <div key={i} className="group relative">
                    <div className="aspect-square rounded-xl border border-slate-300 bg-slate-100 overflow-hidden">
                      <img 
                        src={doc.url} 
                        alt={doc.caption}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><rect fill="%23e2e8f0" width="100" height="100"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%2394a3b8">No Image</text></svg>';
                        }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-slate-600 text-center">{doc.caption}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 text-center py-8">
                <ImageIcon className="w-14 h-14 text-slate-400 mx-auto mb-2"/>
                <p className="text-slate-500">Belum ada dokumentasi</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

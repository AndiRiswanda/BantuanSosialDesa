const PRIMARY_COLOR = '#1D4ED8';
const ACCENT_COLOR = '#059669'; 

export default function ScheduleCard({ title, description, status, type, progress, target, data }) {
  // Clamp progress to 0-100
  const safeProgress = Math.min(100, Math.max(0, progress || 0));

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300 p-6 sm:p-8 mb-6 border border-gray-100">
      
  {/* Header */}
      <div className="flex justify-between items-start mb-4">
        {/* Title*/}
        <h2 className="text-gray-900 font-extrabold text-2xl leading-tight tracking-tight">{title}</h2>
        
  {/* Tags */}
        <div className="flex flex-col sm:flex-row gap-2">
          {/* Status Tag */}
          <span className="bg-green-50 text-green-700 text-sm font-semibold px-4 py-1 rounded-full whitespace-nowrap">
            {status}
          </span>
          {/* Type Tag */}
          <span className="bg-blue-50 text-blue-700 text-sm font-semibold px-4 py-1 rounded-full whitespace-nowrap">
            {type}
          </span>
        </div>
      </div>

  {/* Description */}
      <p className="text-gray-600 text-base mb-6">{description}</p>
        <div className="flex flex-wrap gap-4 mb-8 border-t pt-6 border-gray-100">
            <button
            className="bg-emerald-600 text-white font-semibold px-8 py-3 rounded-lg shadow-sm hover:bg-emerald-700 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95">
            Cek Status Penerima Bantuan
            </button>
        </div>

  {/* Progress */}
  <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          {/* Label */}
          <p className="text-sm font-medium text-gray-700">
            Progress Penyaluran
          </p>
          {/* Value */}
          <span className="text-sm font-semibold text-gray-900">
            {safeProgress}% <span className="text-gray-500 font-normal">({target})</span>
          </span>
        </div>
        
  {/* Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div
            className={`bg-emerald-600 h-2.5 rounded-full transition-all duration-500 ease-out`}
            style={{ width: `${safeProgress}%` }}
          ></div>
        </div>
        
  {/* Transparency */}
  <div className="flex justify-end">
          <button
            className="bg-gray-50 text-gray-800 font-semibold px-8 py-3 rounded-lg shadow-sm border border-gray-200 hover:bg-white hover:shadow-lg hover:scale-105 hover:border-emerald-300 transition-all duration-300 active:scale-95">
            Lihat Transparansi Bantuan
          </button>
        </div>
      </div>
      
  {/* Actions */}


  {/* Table */}
      <h3 className="text-lg font-bold text-gray-800 mb-4">Detail Penyaluran</h3>
      <div className="overflow-x-auto border border-gray-200 rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            {/* Table header */}
            <tr className="bg-gradient-to-b from-green-600 to-green-300">
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-white">Tanggal</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-white">Lokasi Penyaluran</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-white">Jam Pengambilan</th>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-white">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {/* Rows */}
            {data && data.length > 0 ? (
              data.map((row, i) => (
                <tr key={i} className="hover:bg-blue-50/50 transition-colors">
                  <td className="py-3.5 px-4 text-sm font-medium text-gray-800">
                    {row.tanggal}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-700">
                    {row.lokasi}
                  </td>
                  <td className="py-3.5 px-4 text-sm text-gray-700">
                    {row.jam.split(', ').map((time, index) => (
                      <div key={index}>{time}</div>
                    ))}
                  </td>
                  <td className="py-3.5 px-4">
                    {/* Status Tag */}
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${
                        row.status === "Selesai"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800" // Using 'amber' for 'Proses'
                      }`}
                    >
                      {/* Checkmark */}
                      {row.status === "Selesai" ? '✓ ' : ''}
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              // Empty state
              <tr>
                <td colSpan={4} className="py-6 text-center text-sm text-gray-500">
                  Belum ada data detail penyaluran yang tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

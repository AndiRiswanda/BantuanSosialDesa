import HotlineIcon from "../../assets/iconHotline 1.png"
import ReportIcon from "../../assets/iconReport 1.png"
import UsersIcon from "../../assets/iconUsers 1.png"
import DanaIcon from "../../assets/iconTotalDana 1.png"
import KeluargaIcon from "../../assets/iconKeluarga 1.png"
import FrameIcon from "../../assets/Frame.png"

export default function FeaturesSection() {
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

        <div className="grid md:grid-cols-3 gap-6 px-8 md:px-16">
          {/* Total Dana */}
          <div className="bg-white border border-[#0B2B5E] rounded-lg p-6 shadow-sm">
            <div className="flex justify-center mb-3">
                <img src={DanaIcon} alt="Pengaduan Masyarakat" className="w-20 h-20" />
            </div>
            <p className="text-[#0B2B5E] text-lg font-semibold mb-1">
              Rp. 1.567.000.000,-
            </p>
            <p className="text-[#0B2B5E] font-medium">Total Dana</p>
            <p className="text-gray-600 text-sm mt-1">Periode 2025</p>
          </div>

          {/* Penerima Bantuan */}
          <div className="bg-white border border-[#0B2B5E] rounded-lg p-6 shadow-sm">
            <div className="flex justify-center mb-3">
                <img src={KeluargaIcon} alt="Pengaduan Masyarakat" className="w-20 h-20" />
            </div>
            <p className="text-[#0B2B5E] text-lg font-semibold mb-1">712</p>
            <p className="text-[#0B2B5E] font-medium">Penerima Bantuan</p>
            <p className="text-gray-600 text-sm mt-1">Kepala Keluarga</p>
          </div>

          {/* Program Aktif */}
          <div className="bg-white border border-[#0B2B5E] rounded-lg p-6 shadow-sm">
            <div className="flex justify-center mb-3">
                <img src={FrameIcon} alt="Pengaduan Masyarakat" className="w-20 h-20" />
            </div>
            <p className="text-[#0B2B5E] text-lg font-semibold mb-1">5</p>
            <p className="text-[#0B2B5E] font-medium">Program Aktif</p>
            <p className="text-gray-600 text-sm mt-1">Dalam Penyaluran</p>
          </div>
        </div>
      </div>
      {/* Jadwal Penyaluran Bantuan Section */}
      <div className="mt-16 bg-[#F9FAFB] py-10 rounded-xl shadow-sm">
        <h2 className="text-[#0B2B5E] text-xl md:text-2xl font-semibold mb-6">
          Jadwal Penyaluran Bantuan
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-0 bg-white shadow-sm rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-[#39B66A] text-white text-left">
                <th className="py-3 px-5 text-sm font-medium">Nama Program</th>
                <th className="py-3 px-5 text-sm font-medium">Deskripsi</th>
                <th className="py-3 px-5 text-sm font-medium">Kategori</th>
                <th className="py-3 px-5 text-sm font-medium">Periode</th>
                <th className="py-3 px-5 text-sm font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-gray-800">
              <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                <td className="py-4 px-5 font-medium">Bantuan Langsung Tunai (BLT)</td>
                <td className="py-4 px-5">Bantuan uang tunai untuk warga miskin dari bantuan pemerintah pusat.</td>
                <td className="py-4 px-5">Uang</td>
                <td className="py-4 px-5">Juli - Agustus 2025</td>
                <td className="py-4 px-5 text-green-600 font-semibold">Aktif</td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                <td className="py-4 px-5 font-medium">Bantuan Pendidikan Anak Sekolah (BPAS)</td>
                <td className="py-4 px-5">Dukungan dana pendidikan bagi siswa SD–SMA dari keluarga berpenghasilan rendah.</td>
                <td className="py-4 px-5">Uang</td>
                <td className="py-4 px-5">Juli - Desember 2025</td>
                <td className="py-4 px-5 text-green-600 font-semibold">Aktif</td>
              </tr>
              <tr className="odd:bg-white even:bg-gray-50 hover:bg-gray-100">
                <td className="py-4 px-5 font-medium">Program Pupuk Bersubsidi Petani Kecil</td>
                <td className="py-4 px-5">Distribusi pupuk bersubsidi kepada para petani dan pekebun yang terdaftar.</td>
                <td className="py-4 px-5">Barang</td>
                <td className="py-4 px-5">Oktober - Desember 2025</td>
                <td className="py-4 px-5 text-green-600 font-semibold">Aktif</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold shadow-sm hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95">
            Lihat Detail Jadwal Disini...
          </button>
        </div>
      </div>

    </section>
    
  );
}

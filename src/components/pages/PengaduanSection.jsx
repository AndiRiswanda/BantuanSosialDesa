import HotlineImage from "../../assets/hotline-illustration.png"; 
// replace with your actual image path

export default function PengaduanSection() {
  return (
    <section className="w-full h-full bg-gradient-to-br from-blue-50 to-white px-6 md:px-20 py-16 flex items-center justify-center">
      <div className="w-full max-w-5xl mx-auto">
        <h2 className="text-[#0B2B5E] text-4xl font-bold mb-8 text-center">
          Hotline Pengaduan Ketidaktepatan Bantuan
        </h2>

        <p className="text-gray-700 text-lg mb-16 max-w-4xl mx-auto text-center leading-relaxed">
          Kami membuka jalur khusus bagi masyarakat yang ingin menyampaikan laporan terkait 
          penerimaan bantuan yang tidak tepat sasaran, tidak diterima, atau tidak sesuai data.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-15 mb-1">
          {/* Illustration */}
          <img
            src={HotlineImage}
            alt="Hotline Illustration"
            className="w-64 md:w-80"
          />

          {/* Contact Info */}
          <div className="text-left space-y-6">
            <p className="text-gray-800 text-xl">
              <span className="text-3xl mr-3">📞</span>
              <span className="font-semibold">Admin Desa:</span> 0812-xxxx-xxxx
            </p>
            <p className="text-gray-800 text-xl">
              <span className="font-semibold">Email:</span> &nbsp; desaku@gmail.com
            </p>
            <p className="text-gray-800 text-xl">
              <span className="text-3xl mr-3">📍</span>
              <span className="font-semibold">Alamat Posko:</span> Balai Desa
            </p>
          </div>
        </div>

        <p className="text-gray-600 text-center text-lg">
          Kami menjaga kerahasiaan identitas pelapor dan menindaklanjuti setiap laporan secara bijak.
        </p>
      </div>
    </section>
  );
}

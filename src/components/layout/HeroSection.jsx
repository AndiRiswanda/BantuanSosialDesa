import hero from "../../assets/LandingPageHero.png"

export default function HeroSection() {
  return (
    <section className="bg-white flex flex-col md:flex-row justify-between items-center px-8 md:px-20 py-12">
      {/* Ini text na */}
      <div className="max-w-xl">
        <h1 className="text-[#0B2B5E] text-3xl md:text-4xl font-bold leading-snug mb-4">
          Sistem Informasi <br />
          Transparansi Penyaluran <br />
          Bantuan Sosial Desa
        </h1>
        <p className="text-[#1E1E1E] text-base mb-6">
          Wujudkan penyaluran bantuan sosial yang tepat sasaran,
          transparan, dan akuntable melalui platform ini.
        </p>
        <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95">
          Donasi Sekarang
        </button>
      </div>

      {/* Ini hero na sodara */}
      <div className="mt-10 md:mt-0 md:ml-10">
        <img
          src={hero}
          alt="Transparansi Illustration"
          className="w-[550px] md:w-[580px]"
        />
      </div>
    </section>
  );
}

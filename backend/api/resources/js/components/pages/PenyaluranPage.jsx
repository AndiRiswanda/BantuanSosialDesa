import { useRef } from "react";
import ScheduleCard from "../card/ScheduleCard";

export default function PenyaluranPage() {
  const trackRef = useRef(null);

  const scrollBySlide = (direction = 1) => {
    const track = trackRef.current;
    if (!track) return;
    const firstSlide = track.querySelector('[data-slide="true"]');
    const gap = parseFloat(getComputedStyle(track).gap || "0");
    const slideWidth = firstSlide
      ? firstSlide.getBoundingClientRect().width + gap
      : track.clientWidth * 0.9;
    track.scrollBy({ left: direction * slideWidth, behavior: "smooth" });
  };
  const schedules = [
    {
      title: "Bantuan Langsung Tunai (BLT)",
      description:
        "Bantuan uang tunai untuk warga miskin dari bantuan pemerintah pusat.",
      status: "Aktif",
      type: "Uang",
      progress: 67,
      target: "100/150 KK",
      data: [
        { tanggal: "3 Juli 2025", lokasi: "Kantor Desa", jam: "08:00 - 11:00, 14:00 - 16:00", status: "Selesai" },
        { tanggal: "3 Agustus 2025", lokasi: "Kantor Desa", jam: "08:00 - 11:00, 14:00 - 16:00", status: "Selesai" },
        { tanggal: "3 September 2025", lokasi: "Kantor Desa", jam: "08:00 - 11:00, 14:00 - 16:00", status: "Selesai" },
        { tanggal: "3 Oktober 2025", lokasi: "Kantor Desa", jam: "08:00 - 11:00, 14:00 - 16:00", status: "Selesai" },
        { tanggal: "3 November 2025", lokasi: "Kantor Desa", jam: "08:00 - 11:00, 14:00 - 16:00", status: "Terjadwal" },
        { tanggal: "3 Desember 2025", lokasi: "Kantor Desa", jam: "08:00 - 11:00, 14:00 - 16:00", status: "Terjadwal" },
      ],
    },
    {
      title: "Bantuan Pendidikan Anak Sekolah (BPAS)",
      description:
        "Dukungan dana pendidikan bagi siswa SD-SMA berprestasi dan berpenghasilan rendah.",
      status: "Aktif",
      type: "Uang",
      progress: 59,
      target: "89/150 KK",
      data: [
        { tanggal: "5 Juli 2025", lokasi: "Kantor Desa", jam: "08:00 - 11:00, 14:00 - 16:00", status: "Selesai" },
        { tanggal: "5 Agustus 2025", lokasi: "Kantor Desa", jam: "08:00 - 11:00, 14:00 - 16:00", status: "Selesai" },
        { tanggal: "5 September 2025", lokasi: "Kantor Desa", jam: "08:00 - 11:00, 14:00 - 16:00", status: "Terjadwal" },
      ],
    },
    {
      title: "Program Pupuk Bersubsidi Petani Kecil",
      description:
        "Distribusi pupuk bersubsidi kepada petani dan pekebun yang terdaftar.",
      status: "Aktif",
      type: "Barang",
      progress: 50,
      target: "80/160 KK",
      data: [
        { tanggal: "7 Juli 2025", lokasi: "Kantor Desa", jam: "08:00 - 11:00, 14:00 - 16:00", status: "Selesai" },
        { tanggal: "7 Agustus 2025", lokasi: "Kantor Desa", jam: "08:00 - 11:00, 14:00 - 16:00", status: "Terjadwal" },
      ],
    },
  ];

  return (
    <div className="bg-[#E6EFFA] min-h-screen px-6 md:px-20 py-10 overflow-x-hidden">
      <div className="text-center mb-8">
        <div className="inline-block bg-white shadow-md border border-blue-200 px-8 py-3 rounded-lg">
          <h1 className="text-[#0B2B5E] font-semibold text-xl md:text-2xl">
            Detail Jadwal Penyaluran <br />
            <span className="text-green-700">Program Bantuan Desa</span>
          </h1>
        </div>
      </div>

      <div className="relative" role="region" aria-label="Carousel Jadwal Penyaluran">
        {/* Prev Button */}
        <button
          type="button"
          aria-label="Sebelumnya"
          onClick={() => scrollBySlide(-1)}
          className="hidden sm:flex group items-center justify-center absolute left-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border border-slate-200 bg-white/90 shadow cursor-pointer transition-all duration-200 ease-out hover:bg-white hover:shadow-lg hover:border-green-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          {/* Left chevron (inline SVG to avoid new deps) */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-slate-700 transition-colors duration-200 group-hover:text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Track */}
        <div
          ref={trackRef}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") scrollBySlide(-1);
            if (e.key === "ArrowRight") scrollBySlide(1);
          }}
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory scroll-pl-4 md:scroll-pl-6 outline-none"
          style={{ touchAction: "pan-x", WebkitOverflowScrolling: "touch" }}
          aria-label="Daftar kartu jadwal, geser untuk melihat lainnya"
        >
          {schedules.map((item, i) => (
            <div
              key={i}
              data-slide="true"
              className="snap-center shrink-0 min-w-[72%] sm:min-w-[80%] md:min-w-[50%] lg:min-w-[40%] xl:min-w-[33%] 2xl:min-w-[28%]"
            >
              <ScheduleCard {...item} />
            </div>
          ))}
        </div>

        {/* Next Button */}
        <button
          type="button"
          aria-label="Berikutnya"
          onClick={() => scrollBySlide(1)}
          className="hidden sm:flex group items-center justify-center absolute right-2 top-1/2 -translate-y-1/2 z-10 h-10 w-10 rounded-full border border-slate-200 bg-white/90 shadow cursor-pointer transition-all duration-200 ease-out hover:bg-white hover:shadow-lg hover:border-green-300 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
        >
          {/* Right chevron */}
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-slate-700 transition-colors duration-200 group-hover:text-green-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}

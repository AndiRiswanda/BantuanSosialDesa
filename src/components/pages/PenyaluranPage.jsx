import ScheduleCard from "../card/ScheduleCard";

export default function PenyaluranPage() {
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
    <div className="bg-[#E6EFFA] min-h-screen px-6 md:px-20 py-10">
      <div className="text-center mb-8">
        <div className="inline-block bg-white shadow-md border border-blue-200 px-8 py-3 rounded-lg">
          <h1 className="text-[#0B2B5E] font-semibold text-xl">
            Detail Jadwal Penyaluran <br />
            <span className="text-green-700">Program Bantuan Desa</span>
          </h1>
        </div>
      </div>

      {schedules.map((item, i) => (
        <ScheduleCard key={i} {...item} />
      ))}
    </div>
  );
}

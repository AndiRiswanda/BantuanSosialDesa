import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import NavbarRecipient from "../../layout/NavbarRecipient";
import { BadgeCheck, Hourglass, AlertTriangle } from "lucide-react";

function Pill({ className = "", children }) {
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${className}`}>
      {children}
    </span>
  );
}

export default function RecipientApplicationStatus() {
  const navigate = useNavigate();
  const { status } = useParams(); // expected: "registered" | "pending" | "rejected"

  // Normalize and guard
  const s = (status || "pending").toLowerCase();

  const goPrograms = () => navigate("/penerima/program");
  const goApply = () => navigate("/penerima/pengajuan");

  const Section = ({ icon, title, subtitle, badge, description, action }) => (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="shrink-0 hidden sm:block text-2xl" aria-hidden>🤝</div>
          <div>
            <h1 className="text-[#0B2B5E] font-semibold text-lg sm:text-xl flex items-center gap-2">{icon}{title}</h1>
            {subtitle && <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-3xl">{subtitle}</p>}
          </div>
        </div>
        {badge}
      </div>

      {description && (
        <p className="mt-5 text-sm text-slate-800 leading-relaxed">{description}</p>
      )}

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </section>
  );

  let content = null;

  if (s === "registered") {
    content = (
      <Section
        icon={<BadgeCheck className="w-5 h-5 text-emerald-600" />}
        title="Anda Sudah Terdaftar sebagai Penerima Bantuan"
        subtitle={(
          <>
            Terima kasih telah menjadi bagian dari program bantuan desa. Data Anda sudah tercatat dan diverifikasi oleh admin dan memenuhi kriteria penerima bantuan. Kondisi ekonomi keluarga memerlukan bantuan. Anda dapat melihat informasi program dan jadwal penyaluran bantuan melalui halaman Beranda.
          </>
        )}
        badge={(
          <Pill className="bg-emerald-100 text-emerald-800 border border-emerald-200">Anda Terdaftar Untuk Dapat Menerima Bantuan</Pill>
        )}
        action={(
          <button onClick={goPrograms} className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2 text-white font-semibold shadow hover:bg-emerald-700">Lihat Program Bantuan Saya</button>
        )}
      />
    );
  } else if (s === "rejected") {
    content = (
      <Section
        icon={<AlertTriangle className="w-5 h-5 text-amber-600" />}
        title="Pengajuan Anda Belum Dapat Disetujui"
        subtitle={(
          <>
            Mohon maaf, berdasarkan hasil verifikasi, Anda belum memenuhi kriteria penerima program bantuan pada periode ini. Anda dapat memperbarui data atau mengajukan kembali pada periode berikutnya.
          </>
        )}
        badge={(
          <Pill className="bg-rose-100 text-rose-700 border border-rose-200">Ditolak</Pill>
        )}
        description={"Mohon maaf, pengajuan Anda tidak dapat disetujui."}
        action={(
          <button onClick={goApply} className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2 text-white font-semibold shadow hover:bg-emerald-700">Pengajuan Kembali</button>
        )}
      />
    );
  } else {
    // default pending
    content = (
      <Section
        icon={<Hourglass className="w-5 h-5 text-amber-600" />}
        title="Pengajuan Anda Sedang Diverifikasi"
        subtitle={(
          <>
            Terima kasih telah mengajukan permohonan bantuan. Data Anda sedang dalam proses verifikasi oleh admin desa. Mohon tunggu keputusan lebih lanjut.
          </>
        )}
        badge={(
          <Pill className="bg-amber-100 text-amber-800 border border-amber-200">Pending</Pill>
        )}
        description={"Pengajuan sedang dalam proses verifikasi. Mohon menunggu maksimal 4×24 jam."}
        action={(
          <button onClick={() => window.open("#", "_self")} className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-5 py-2 text-white font-semibold shadow hover:bg-emerald-700">Narahubung Admin Desa</button>
        )}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarRecipient />
      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        <div className="max-w-5xl mx-auto space-y-4">
          {content}
        </div>
      </main>
    </div>
  );
}

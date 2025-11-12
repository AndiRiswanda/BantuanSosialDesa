import React from "react";
import NavbarAdmin from "../../layout/NavbarAdmin";
import heroIcon from "../../../assets/Icon.png";
import { Users2, HandCoins, ClipboardList, CheckCircle2, Clock4 } from "lucide-react";

function StatCard({ icon: Icon, label, value, accent = "emerald" }) {
  const accentMap = {
    emerald: "text-emerald-700 border-emerald-200",
    blue: "text-blue-700 border-blue-200",
    violet: "text-violet-700 border-violet-200",
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
      <div className={`w-10 h-10 rounded-lg bg-slate-50 border ${accentMap[accent]} flex items-center justify-center mb-2`}>
        <Icon className={`w-5 h-5 ${accentMap[accent].split(" ")[0]}`} />
      </div>
      <div className="text-slate-800 text-lg font-bold">{value}</div>
      <div className="text-slate-600 text-sm">{label}</div>
    </div>
  );
}

function AttentionCard({ title, count, buttonLabel }) {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-full border border-amber-300 bg-white flex items-center justify-center">
          <Clock4 className="w-5 h-5 text-amber-600" />
        </div>
        <div>
          <div className="text-slate-800 font-semibold text-sm">{title}</div>
          <div className="text-slate-600 text-sm">{count} pengajuan menunggu verifikasi</div>
        </div>
      </div>
      <button className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700">
        {buttonLabel}
      </button>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarAdmin />

      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        {/* Welcome */}
        <section className="bg-white/90 border border-blue-200 rounded-xl shadow-sm p-4 sm:p-6 mb-6">
          <div className="flex items-start gap-3">
            <img src={heroIcon} alt="Logo" className="w-10 h-10" />
            <div>
              <h1 className="text-[#0B2B5E] font-semibold text-lg sm:text-2xl">Selamat Datang, Admin</h1>
              <p className="text-sm text-slate-700">Pantau seluruh aktivitas bantuan desa di sini.</p>
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="rounded-xl bg-green-100/70 border border-green-300 p-4 sm:p-6 mb-6">
          <h2 className="text-center text-[#0B2B5E] font-semibold mb-4">Ringkasan Singkat Sistem</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
              <div className="flex items-center gap-2 text-slate-800 font-semibold mb-2">
                <HandCoins className="w-5 h-5 text-emerald-700" /> Total Donasi
              </div>
              <div className="text-[#0B2B5E] font-extrabold text-lg">Rp. 1.567.000.000,-</div>
            </div>
            <StatCard icon={ClipboardList} label="Total Program" value="10" accent="blue" />
            <StatCard icon={Users2} label="Total Donatur" value="4" accent="emerald" />
            <StatCard icon={Users2} label="Total Penerima" value="712" accent="violet" />
          </div>
        </section>

        {/* Attention */}
        <section>
          <h3 className="text-center text-[#0B2B5E] font-semibold mb-4">Perlu Diperhatikan</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <AttentionCard title="Donasi Masuk" count={2} buttonLabel="Verifikasi Program Donasi" />
            <AttentionCard title="Pengajuan Penerimaan" count={1} buttonLabel="Verifikasi Pengajuan Penerimaan" />
          </div>
        </section>
      </main>
    </div>
  );
}

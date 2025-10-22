import React from "react";
import NavbarDonor from "../../layout/NavbarDonor";

export default function DonorNewDonation() {
  return (
    <div className="min-h-screen bg-white">
      <NavbarDonor />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-extrabold text-[#0B2B5E] mb-2">Buat Donasi Baru</h2>
        <p className="text-sm text-slate-600 mb-6">Halaman ini akan berisi formulir untuk membuat donasi baru. (Placeholder)</p>
        <div className="rounded-xl border border-slate-200 p-6 bg-white shadow-sm">
          <p className="text-slate-700">Form pembuatan donasi akan ditambahkan di sini.</p>
        </div>
      </div>
    </div>
  );
}

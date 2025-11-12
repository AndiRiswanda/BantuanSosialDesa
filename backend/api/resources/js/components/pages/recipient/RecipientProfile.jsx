import React, { useMemo, useState } from "react";
import NavbarRecipient from "../../layout/NavbarRecipient";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, FileDown, FileText, Image as ImageIcon, LogOut, Receipt, ShieldCheck, UserCircle2 } from "lucide-react";

function Section({ title, children }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-slate-200">
      <header className="px-4 sm:px-5 py-3 border-b border-slate-200">
        <h3 className="text-[#0B2B5E] font-semibold">{title}</h3>
      </header>
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}

function Field({ label, value }) {
  return (
    <div className="space-y-1">
      <div className="text-xs text-slate-600">{label}</div>
      <div className="rounded-md bg-slate-100/70 border border-slate-200 px-3 py-2 text-sm text-slate-800">{value}</div>
    </div>
  );
}

function Pill({ className = "", children }) {
  return <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${className}`}>{children}</span>;
}

function SidebarItem({ active, icon: Icon, children, onClick }) {
  return (
    <button onClick={onClick} className={`w-full inline-flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-semibold ${active ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-[#0B2B5E] border-slate-300 hover:bg-slate-50"}`}>
      {Icon && <Icon className="w-4 h-4" />} {children}
    </button>
  );
}

function Modal({ open, onClose, title, children, primary, onPrimary }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="p-5 sm:p-6">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-[#0B2B5E] font-semibold mb-1">{title}</h4>
              <div className="text-sm text-slate-700">{children}</div>
            </div>
            <button onClick={onClose} className="ml-2 text-slate-500 hover:text-slate-700">✕</button>
          </div>
          <div className="mt-5 flex gap-3 justify-end">
            <button onClick={onClose} className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 font-medium hover:bg-slate-50">Batal</button>
            <button onClick={onPrimary} className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700">Keluar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RecipientProfile() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("data"); // data | bantuan | dokumen
  const [showLogout, setShowLogout] = useState(false);

  const profile = useMemo(
    () => ({
      name: "Ahmad Yani",
      kk: "3601****5678",
      registered: true,
      tanggungan: 3,
      receivedCount: 2,
      pekerjaan: "Petani",
      statusAnak: "Anak Sekolah",
      statusPekerjaanIstri: "Ibu Rumah Tangga",
      alamat: "Jl. Melati No. 12, RT 01/RW 02",
      penghasilan: "Rp 1.000.000,-  -  Rp 2.000.000,-",
      telp: "085555****0",
      jumlahTanggungan: 2,
      documents: [
        { id: "kk", title: "Foto Kartu Keluarga", fileName: "KK_AhmadYani_3601****5678.png", url: "https://placehold.co/900x500?text=KK" },
        { id: "rumah", title: "Foto Rumah", fileName: "FotoRumah_AhmadYani_3601****5678.pdf", url: "https://placehold.co/900x500?text=RUMAH" },
      ],
      programs: [
        {
          id: 1,
          title: "Pemberdayaan Ibu Rumah Tangga melalui Kebun Sayur",
          donor: "Yayasan Peduli Negeri",
          status: "Terjadwal",
          type: "Barang",
          start: "1 Oktober 2025",
          end: "30 Desember 2025",
          goods: "Barang (bibit, polybag, pupuk organik)",
          schedule: { tanggal: "3 November 2025", lokasi: "Kantor Desa", jam: ["08:00 - 11:00", "14:00 - 16:00"], ket: "Tahap 2", status: "Terjadwal" },
        },
        {
          id: 2,
          title: "Bantuan Langsung Tunai (BLT)",
          donor: "Kementerian Sosial",
          status: "Selesai",
          type: "Uang",
          start: "1 Juli 2025",
          end: "30 Agustus 2025",
          goods: "Rp. 150.000.000,- (seratus lima puluh juta rupiah)",
          schedule: { tanggal: "3 Agustus 2025", lokasi: "Kantor Desa", jam: ["08:00 - 11:00"], ket: "Tahap 1", status: "Selesai" },
        },
      ],
    }),
    []
  );

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarRecipient />

      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[260px,1fr] gap-4">
          {/* Sidebar */}
          <aside className="space-y-3 self-start">
            <SidebarItem active={tab === "data"} onClick={() => setTab("data")} icon={UserCircle2}>Data Profil</SidebarItem>
            <SidebarItem active={tab === "bantuan"} onClick={() => setTab("bantuan")} icon={Receipt}>Bantuan Diterima</SidebarItem>
            <SidebarItem active={tab === "dokumen"} onClick={() => setTab("dokumen")} icon={FileText}>Dokumen</SidebarItem>
            <SidebarItem active={false} onClick={() => setShowLogout(true)} icon={LogOut}>Keluar</SidebarItem>
          </aside>

          {/* Main content */}
          <div className="space-y-4">
            {/* Header card */}
            <section className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl shadow-sm text-white p-4 sm:p-6 relative overflow-hidden">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-white/90 text-emerald-700 flex items-center justify-center text-xl font-bold">AY</div>
                  <div>
                    <h1 className="text-xl font-bold leading-tight">{profile.name}</h1>
                    <p className="text-sm opacity-95">Kepala Keluarga</p>
                    <p className="text-sm opacity-95">No. KK : {profile.kk}</p>
                    <div className="mt-2">
                      {profile.registered && (
                        <Pill className="bg-white/90 text-emerald-800">
                          <ShieldCheck className="w-4 h-4" /> Anda Terdaftar Untuk Dapat Menerima Bantuan
                        </Pill>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="rounded-md bg-black/10 px-3 py-1 text-xs">{profile.tanggungan} Tanggungan</div>
                  <div className="rounded-md bg-black/10 px-3 py-1 text-xs">{profile.receivedCount} Bantuan Diterima</div>
                </div>
              </div>
            </section>

            {tab === "data" && (
              <div className="space-y-4">
                <Section title="Data Keluarga">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="No. Kartu Keluarga" value={profile.kk} />
                    <Field label="Nama Kepala Keluarga" value={profile.name} />
                    <Field label="Pekerjaan" value={profile.pekerjaan} />
                    <Field label="Status Anak" value={profile.statusAnak} />
                    <Field label="Status Pekerjaan Istri" value={profile.statusPekerjaanIstri} />
                  </div>
                </Section>

                <Section title="Informasi Lainnya">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Field label="Alamat Lengkap" value={profile.alamat} />
                    <Field label="Penghasilan" value={profile.penghasilan} />
                    <Field label="No. Telepon/WhatsApp" value={profile.telp} />
                    <Field label="Jumlah Tanggungan" value={String(profile.jumlahTanggungan)} />
                  </div>
                </Section>

                <section className="rounded-xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <h4 className="text-[#0B2B5E] font-semibold">Pemberitahuan Perubahan Data Penerima Bantuan</h4>
                      <p className="text-sm text-slate-800 mt-1">Apabila terdapat perubahan pada data diri Anda (seperti alamat, status keluarga, pekerjaan, atau kondisi ekonomi), silakan segera <span className="font-semibold">menghubungi admin desa melalui kontak di bawah ini</span>.</p>
                      <div className="mt-2 text-sm text-slate-700 space-y-0.5">
                        <div>☎ Admin Desa: 0812-xxxx-xxxx</div>
                        <div>Email : desaku@gmail.com</div>
                      </div>
                      <p className="text-sm text-slate-700 mt-2">atau datang langsung ke Kantor Desa Sejahtera untuk proses pembaruan data.</p>
                    </div>
                  </div>
                </section>
              </div>
            )}

            {tab === "bantuan" && (
              <div className="space-y-4">
                {profile.programs.map((p) => (
                  <section key={p.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-slate-900 font-semibold">{p.title}</h3>
                        <p className="text-xs text-slate-600">Donatur: {p.donor}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Pill className="bg-slate-100 text-slate-700">{p.start}</Pill>
                          <Pill className="bg-slate-100 text-slate-700">{p.end}</Pill>
                          <Pill className="bg-blue-50 text-blue-700 border border-blue-200">{p.type}</Pill>
                        </div>
                      </div>
                      <Pill className={`${p.status === "Selesai" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-amber-100 text-amber-800 border border-amber-200"}`}>{p.status}</Pill>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">Jumlah Donasi<br />{p.goods}</div>

                    <div className="rounded-xl border border-emerald-200 bg-emerald-50">
                      <div className="px-3 sm:px-4 py-2 border-b border-emerald-200 text-sm font-semibold text-slate-800 flex items-center gap-2">
                        <CalendarIcon /> Jadwal Pengambilan Bantuan Anda - <span className="font-normal">Jangan Lupa Datang Sesuai Pembagian Waktu Anda</span>
                      </div>
                      <div className="p-3 sm:p-4 overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="bg-emerald-100 text-slate-800">
                              <th className="px-3 py-2 text-left rounded-l-lg">Tanggal</th>
                              <th className="px-3 py-2 text-left">Lokasi Penyebaran</th>
                              <th className="px-3 py-2 text-left">Jam Pengambilan</th>
                              <th className="px-3 py-2 text-left">Keterangan</th>
                              <th className="px-3 py-2 text-left rounded-r-lg">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="border-b last:border-0">
                              <td className="px-3 py-2 whitespace-nowrap">{p.schedule.tanggal}</td>
                              <td className="px-3 py-2 whitespace-nowrap">{p.schedule.lokasi}</td>
                              <td className="px-3 py-2">
                                <div className="flex flex-col">
                                  {p.schedule.jam.map((j, idx) => (
                                    <span key={idx}>{j}</span>
                                  ))}
                                </div>
                              </td>
                              <td className="px-3 py-2 whitespace-nowrap">{p.schedule.ket}</td>
                              <td className="px-3 py-2 whitespace-nowrap">{p.schedule.status}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button onClick={() => navigate(`/penerima/program/${p.id}`)} className="px-4 py-2 rounded-md border border-slate-300 bg-white text-slate-800 font-medium hover:bg-slate-50">Detail Program</button>
                    </div>
                  </section>
                ))}
              </div>
            )}

            {tab === "dokumen" && (
              <div className="space-y-4">
                {profile.documents.map((d) => (
                  <section key={d.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-5 space-y-3">
                    <div className="aspect-[16/6] rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-slate-400" />
                    </div>
                    <div>
                      <h4 className="text-slate-900 font-semibold">{d.title}</h4>
                      <p className="text-xs text-slate-600">{d.fileName}</p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a href={d.url} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-white font-semibold hover:bg-violet-700">
                        <ImageIcon className="w-4 h-4" /> Lihat Dokumen
                      </a>
                      <a href={d.url} download className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700">
                        <FileDown className="w-4 h-4" /> Unduh Dokumen
                      </a>
                    </div>
                  </section>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Logout modal */}
      <Modal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        title="Konfirmasi Keluar Akun"
        onPrimary={() => {
          setShowLogout(false);
          navigate("/login/penerima");
        }}
      >
        Apakah Anda yakin ingin keluar dari akun ini? Semua sesi aktif akan ditutup dan Anda harus login kembali untuk mengakses sistem.
      </Modal>
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="16" y1="2" x2="16" y2="6"></line>
      <line x1="8" y1="2" x2="8" y2="6"></line>
      <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
  );
}

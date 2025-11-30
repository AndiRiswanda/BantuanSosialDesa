import React, { useMemo, useState } from "react";
import NavbarAdmin from "../../layout/NavbarAdmin";
import { Check, Eye, Mail, MoreVertical, Search, ThumbsDown, ThumbsUp, UserX, ShieldCheck, Edit, Lock, Unlock, Trash2, X, AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Segmented = ({ value, onChange }) => {
  const items = [
    { key: "pengajuan", label: "Pengajuan Penerima Baru" },
    { key: "donatur", label: "Kelola Akun Donatur" },
    { key: "penerima", label: "Kelola Akun Penerima" },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {items.map((it) => (
        <button
          key={it.key}
          onClick={() => onChange(it.key)}
          className={`flex items-center justify-center rounded-lg border px-4 py-2 text-sm font-semibold transition ${
            value === it.key ? "bg-emerald-600 text-white border-emerald-600" : "bg-white text-emerald-700 border-emerald-300 hover:border-emerald-500"
          }`}
          type="button"
        >
          {it.label}
        </button>
      ))}
    </div>
  );
};

const applicantSamples = [
  {
    id: 1,
    name: "Siti Nurhaliza",
    nik: "32024567890123",
    address: "Jl. Kenanga No. 15 RT 002, Kelurahan Mawar",
    tag: "Baru Nikah",
    phone: "081234567890",
    job: "Buruh Harian",
    dependents: 4,
    income: "Rp 1.000.000,-  -  Rp 2.000.000,- /bulan",
    reason: "Penghasilan tidak mencukupi untuk kebutuhan keluarga dengan 4 anak",
    docs: ["Kartu Keluarga", "Foto Rumah"],
  },
  {
    id: 2,
    name: "Ahmad Fauzi",
    nik: "320345678921088",
    address: "Jl. Melati No. 8, RT 004/02",
    tag: "Tulang pK",
    phone: "082345678901",
    job: "Tukang Ojek",
    dependents: 2,
    income: "Rp 500.000,-  -  Rp 1.000.000,- /bulan",
    reason: "Anak yatim piatu, tinggal bersama nenek yang sudah lansia",
    docs: ["Kartu Keluarga", "Foto Rumah"],
  },
  {
    id: 3,
    name: "Dewi Lestari",
    nik: "320456789012345",
    address: "Jl. Dahlia No. 22, RT 004/02",
    tag: "Tidak bekerja (Lansia)",
    phone: "083456789012",
    job: "Tidak bekerja (Lansia)",
    dependents: 1,
    income: "< Rp 500.000,-",
    reason: "Lansia tanpa penghasilan, hidup sendiri tanpa keluarga",
    docs: ["Kartu Keluarga", "Foto Rumah"],
  },
];

export default function AdminVerificationDashboard() {
  const navigate = useNavigate();
  const [active, setActive] = useState("pengajuan");
  const [openDetail, setOpenDetail] = useState({});
  const [query, setQuery] = useState("");
  const [donors, setDonors] = useState(() => Array.from({ length: 10 }).map((_, i) => ({
    id: i + 1,
    name: `Yayasan Peduli Negeri ${i + 1}`,
    type: "Organisasi",
    address: `Jl. Melati No. ${10 + i}, RT 01/02`,
    email: `donatur${i + 1}@mail.com`,
  })));
  const [recipients, setRecipients] = useState(() => Array.from({ length: 8 }).map((_, i) => ({
    id: i + 1,
    name: `Warga ${i + 1}`,
    nik: `3174-45${i}00${i}`,
    address: `Jl. Mawar No. ${i + 10}, RT 01/03`,
    phone: `08${i}2345678${i}`,
  })));
  const [confirmDelete, setConfirmDelete] = useState(null); // {entity:'donor'|'recipient', id, label}

  const filteredApplicants = useMemo(() => {
    const q = query.trim().toLowerCase();
    return applicantSamples.filter(
      (a) => !q || a.name.toLowerCase().includes(q) || a.nik.includes(q) || a.address.toLowerCase().includes(q)
    );
  }, [query]);

  const donorsFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return donors.filter((d) => !q || d.name.toLowerCase().includes(q) || d.email.toLowerCase().includes(q) || d.address.toLowerCase().includes(q));
  }, [donors, query]);

  const recipientsFiltered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipients.filter((r) => !q || r.name.toLowerCase().includes(q) || r.nik.includes(q) || r.address.toLowerCase().includes(q));
  }, [recipients, query]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <NavbarAdmin />
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-4">
          <h1 className="text-lg font-semibold text-slate-800">Verifikasi & Manajemen Akun</h1>
          <p className="text-sm text-slate-600">Kelola pengajuan penerima baru, akun donatur, dan akun penerima bantuan.</p>
        </div>

        <Segmented value={active} onChange={setActive} />

        <div className="mt-4">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={active === "donatur" ? "Cari nama donatur atau email" : "Cari Nama Penerima atau Program"}
              className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {active === "pengajuan" && (
          <section className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <span role="img" aria-label="sparkles">✨</span>
              <h2 className="text-sm font-semibold">Verifikasi Pengajuan Penerima Baru</h2>
            </div>
            <div className="space-y-4">
              {filteredApplicants.length === 0 ? (
                <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5" />
                  <div>Tidak ada hasil yang cocok untuk pencarian Anda.</div>
                </div>
              ) : (
                filteredApplicants.map((a) => {
                const open = !!openDetail[a.id];
                return (
                  <div key={a.id} className="rounded-xl border border-slate-200 bg-white shadow-sm">
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-slate-800">{a.name}</h3>
                          <p className="text-xs text-slate-600">NIK: {a.nik}</p>
                          <p className="mt-1 text-xs text-slate-600">Alamat: {a.address}</p>
                          <div className="mt-2 inline-flex items-center gap-2">
                            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">{a.tag}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 border border-amber-200">Pending</span>
                          <button type="button" className="text-slate-500 hover:text-slate-700">
                            <MoreVertical className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="mt-3">
                        <button
                          type="button"
                          onClick={() => setOpenDetail((m) => ({ ...m, [a.id]: !m[a.id] }))}
                          className="inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                          {open ? "Sembunyikan Detail" : "Lihat Detail Lengkap"}
                        </button>
                      </div>

                      {open && (
                        <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-3">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-slate-500">Pekerjaan</p>
                                <p className="font-medium">{a.job}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Jumlah Tanggungan</p>
                                <p className="font-medium">{a.dependents} orang</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Alasan Pengajuan</p>
                                <input readOnly className="mt-1 w-full rounded border border-slate-300 bg-white px-2 py-1 text-xs" value={a.reason} />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div>
                                <p className="text-xs text-slate-500">Penghasilan</p>
                                <p className="font-medium">{a.income}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">No. Telepon / WhatsApp</p>
                                <p className="font-medium">{a.phone}</p>
                              </div>
                              <div>
                                <p className="text-xs text-slate-500">Dokumen Lampiran</p>
                                <div className="mt-1 space-y-1">
                                  {a.docs.map((d) => (
                                    <button key={d} type="button" className="flex w-full items-center justify-between rounded border border-slate-300 bg-white px-2 py-1 text-xs hover:bg-slate-50">
                                      <span>{d}</span>
                                      <Eye className="w-4 h-4 text-slate-500" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-3 flex items-center gap-3">
                        <button className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
                          <ThumbsUp className="w-4 h-4" /> Setujui
                        </button>
                        <button className="inline-flex items-center gap-2 rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">
                          <ThumbsDown className="w-4 h-4" /> Tidak
                        </button>
                      </div>
                    </div>
                  </div>
                );
                })
              )}
            </div>
          </section>
        )}

        {active === "donatur" && (
          <section className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <span role="img" aria-label="donor">🧑‍💼</span>
              <h2 className="text-sm font-semibold">Kelola Data Donatur</h2>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100">
                  <tr className="text-left text-slate-700">
                    <th className="px-3 py-2">Nama Donatur</th>
                    <th className="px-3 py-2">Jenis</th>
                    <th className="px-3 py-2">Alamat</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Aksi</th>
                  </tr>
                </thead>
                {donorsFiltered.length === 0 ? (
                  <tbody>
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-sm text-rose-700">
                        <div className="inline-flex items-center gap-3 justify-center">
                          <AlertTriangle className="w-5 h-5" />
                          Tidak ada donatur yang cocok dengan pencarian Anda.
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody className="divide-y divide-slate-200">
                    {donorsFiltered.map((d) => (
                      <tr key={d.id}>
                        <td className="px-3 py-2">
                          <button type="button" onClick={() => navigate(`/admin/verifikasi/donatur/${d.id}`)} className="text-left text-emerald-700 hover:underline">{d.name}</button>
                        </td>
                        <td className="px-3 py-2">{d.type}</td>
                        <td className="px-3 py-2">{d.address}</td>
                        <td className="px-3 py-2">{d.email}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <button className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700" title="Verifikasi"><ShieldCheck className="w-4 h-4"/></button>
                            <button className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700" title="Kirim Email"><Mail className="w-4 h-4"/></button>
                            <button onClick={() => navigate(`/admin/verifikasi/donatur/${d.id}/edit`)} className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700" title="Ubah"><Edit className="w-4 h-4"/></button>
                            <button className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-700" title="Blokir"><Lock className="w-4 h-4"/></button>
                            <button className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-700" title="Buka Blokir"><Unlock className="w-4 h-4"/></button>
                            <button onClick={() => setConfirmDelete({ entity: 'donor', id: d.id, label: d.name })} className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-700" title="Hapus Akun"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </section>
        )}

        {active === "penerima" && (
          <section className="mt-5">
            <div className="mb-2 flex items-center gap-2">
              <span role="img" aria-label="recipient">👨‍👩‍👧‍👦</span>
              <h2 className="text-sm font-semibold">Kelola Akun Penerima</h2>
            </div>
            <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
              <table className="min-w-full text-sm">
                <thead className="bg-slate-100">
                  <tr className="text-left text-slate-700">
                    <th className="px-3 py-2">Nama</th>
                    <th className="px-3 py-2">NIK</th>
                    <th className="px-3 py-2">Alamat</th>
                    <th className="px-3 py-2">No. HP</th>
                    <th className="px-3 py-2">Aksi</th>
                  </tr>
                </thead>
                {recipientsFiltered.length === 0 ? (
                  <tbody>
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-sm text-rose-700">
                        <div className="inline-flex items-center gap-3 justify-center">
                          <AlertTriangle className="w-5 h-5" />
                          Tidak ada penerima yang cocok dengan pencarian Anda.
                        </div>
                      </td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody className="divide-y divide-slate-200">
                    {recipientsFiltered.map((r) => (
                      <tr key={r.id}>
                        <td className="px-3 py-2">
                          <button type="button" onClick={() => navigate(`/admin/verifikasi/penerima/${r.id}`)} className="text-left text-emerald-700 hover:underline">{r.name}</button>
                        </td>
                        <td className="px-3 py-2">{r.nik}</td>
                        <td className="px-3 py-2">{r.address}</td>
                        <td className="px-3 py-2">{r.phone}</td>
                        <td className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <button className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700" title="Aktifkan"><Check className="w-4 h-4"/></button>
                            <button className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-rose-100 text-rose-700" title="Nonaktifkan"><UserX className="w-4 h-4"/></button>
                            <button className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-blue-700" title="Kirim Email"><Mail className="w-4 h-4"/></button>
                            <button onClick={() => navigate(`/admin/verifikasi/penerima/${r.id}/edit`)} className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-amber-100 text-amber-700" title="Ubah"><Edit className="w-4 h-4"/></button>
                            <button onClick={() => setConfirmDelete({ entity: 'recipient', id: r.id, label: r.name })} className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-700" title="Hapus Akun"><Trash2 className="w-4 h-4"/></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </section>
        )}
        {/* Confirm Delete Modal */}
        {confirmDelete && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4" role="dialog" aria-modal="true">
            <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"><AlertTriangle className="w-4 h-4 text-amber-500"/> Konfirmasi Penghapusan Akun</div>
                <button onClick={() => setConfirmDelete(null)} className="text-slate-500 hover:text-slate-700" aria-label="Tutup"><X className="w-5 h-5"/></button>
              </div>
              <div className="px-4 py-3 text-sm text-slate-700 space-y-3">
                <p>Apakah Anda yakin ingin menghapus akun ini? Tindakan ini akan menghapus seluruh data terkait pengguna dan tidak dapat dibatalkan.</p>
                <p>Pastikan Anda telah meninjau data pengguna ini dengan benar sebelum melanjutkan.</p>
                <div className="rounded-md bg-slate-50 border border-slate-200 px-3 py-2 text-xs text-slate-600">Akun: <span className="font-medium text-slate-800">{confirmDelete.label}</span></div>
              </div>
              <div className="flex justify-end gap-2 border-t px-4 py-3">
                <button onClick={() => setConfirmDelete(null)} className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Batalkan</button>
                <button onClick={() => {
                  if (confirmDelete.entity === 'donor') setDonors((arr) => arr.filter((d) => d.id !== confirmDelete.id));
                  if (confirmDelete.entity === 'recipient') setRecipients((arr) => arr.filter((r) => r.id !== confirmDelete.id));
                  setConfirmDelete(null);
                }} className="rounded-md bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">Ya, Hapus</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

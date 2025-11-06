import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarRecipient from "../../layout/NavbarRecipient";
import { AlertTriangle, FileText, Upload, X, BadgeCheck } from "lucide-react";

function Field({ label, hint, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-slate-800">{label}</label>
      {hint && <p className="text-[11px] text-slate-500">{hint}</p>}
      {children}
    </div>
  );
}

function Input(props) {
  return (
    <input
      {...props}
      className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500 ${
        props.className || ""
      }`}
    />
  );
}

function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className={`w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 ${
        props.className || ""
      }`}
    >
      {children}
    </select>
  );
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

function UploadDrop({ label, onSelect }) {
  const fileRef = useRef(null);
  return (
    <div>
      <p className="text-sm font-semibold text-slate-800 mb-2">{label}</p>
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
      >
        <Upload className="w-4 h-4" /> Upload Foto Kartu Keluarga
      </button>
      <input
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        ref={fileRef}
        onChange={(e) => onSelect?.(e.target.files?.[0] || null)}
      />
    </div>
  );
}

export default function RecipientApplication() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadTarget, setUploadTarget] = useState("KK");
  const [kkFile, setKkFile] = useState(null);
  const [houseFile, setHouseFile] = useState(null);
  const [kkNumber, setKkNumber] = useState("");
  const [kkError, setKkError] = useState("");

  const openUpload = (target) => {
    setUploadTarget(target);
    setShowUpload(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#E6EFFA]">
      <NavbarRecipient />

      <main className="flex-1 px-4 sm:px-6 lg:px-20 py-6 lg:py-10">
        <div className="max-w-5xl mx-auto">
          {/* Form header */}
          <div className="bg-white/90 border border-green-200 rounded-xl shadow-sm p-4 sm:p-6 mb-6">
            <h1 className="text-[#0B2B5E] font-semibold text-lg sm:text-2xl flex items-center gap-2">
              <span role="img" aria-label="form">📝</span>
              Form Pengajuan Penerima Bantuan
            </h1>
            <p className="mt-2 text-sm text-slate-700">Lengkapi data diri Anda dengan benar</p>

            {/* Alert */}
            <div className="mt-4 rounded-lg border border-rose-200 bg-rose-50 p-3 sm:p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 mt-0.5" />
                <div>
                  <p className="font-semibold text-rose-700">Perhatian!</p>
                  <ul className="list-disc pl-5 text-sm text-rose-700 space-y-1 mt-1">
                    <li>Pastikan data sesuai dengan KTP</li>
                    <li>Proses verifikasi maksimal 4×24 jam</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Form card */}
          <form className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6 space-y-5">
            <Field label="Nama Lengkap Kepala Keluarga" hint="Ket: Masukkan nama lengkap kepala keluarga sesuai KTP dan Kartu Keluarga (KK)">
              <Input placeholder="contoh: 'Ahmad Yani'" />
            </Field>

            <Field label="No. Kartu Keluarga (KK)" hint="Ket: Masukkan 16 digit nomor Kartu Keluarga (KK)">
              <>
                <Input
                  placeholder="contoh: '73160612214100001'"
                  value={kkNumber}
                  onChange={(e) => { setKkNumber(e.target.value); setKkError(''); }}
                />
                {kkError && <div className="text-sm text-red-600 mt-1">{kkError}</div>}
              </>
            </Field>

            <Field label="Alamat" hint="Ket: Masukkan alamat lengkap (jalan, RT/RW)">
              <Input placeholder="contoh: 'Jl. Kenanga No. 5, RT 03/04'" />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="No. Telepon/WhatsApp" hint="Ket: Masukkan nomor yang aktif untuk dihubungi">
                <Input placeholder="contoh: '085********'" />
              </Field>
              <Field label="Pekerjaan" hint="Ket: Masukkan pekerjaan kepala keluarga">
                <Input placeholder="contoh: 'Petani'" />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Penghasilan" hint="Ket: Pilih sesuai rentang penghasilan per bulan">
                <Select defaultValue="">
                  <option value="" disabled>
                    &lt; Rp 500.000,-
                  </option>
                  <option>&lt; Rp 500.000,-</option>
                  <option>Rp 500.000,- - Rp 1.000.000,-</option>
                  <option>Rp 1.000.000,- - Rp 2.000.000,-</option>
                  <option>Rp 2.000.000,- - Rp 3.000.000,-</option>
                  <option>&gt; Rp 3.000.000,-</option>
                </Select>
              </Field>
              <Field label="Jumlah Tanggungan" hint="Ket: Masukkan jumlah tanggungan kepala keluarga">
                <Input placeholder="contoh: '1'" />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field label="Status Pekerjaan Istri" hint="Ket: Pilih sesuai status pekerjaan istri">
                <Select defaultValue="">
                  <option value="" disabled>
                    -- Pilih Status Pekerjaan Istri --
                  </option>
                  <option>Ibu Rumah Tangga</option>
                  <option>Berpenghasilan &amp; Bekerja</option>
                  <option>Belum Menikah</option>
                  <option>Kepala Keluarga</option>
                </Select>
              </Field>
              <Field label="Status Anak" hint="Ket: Pilih sesuai status anak Anda">
                <Select defaultValue="">
                  <option value="" disabled>
                    -- Pilih Status Anak --
                  </option>
                  <option>Belum Punya Anak</option>
                  <option>Punya Bayi (0-2 tahun) atau Balita</option>
                  <option>Anak Sekolah</option>
                  <option>Anak Bekerja</option>
                  <option>Anak Tidak Bekerja</option>
                </Select>
              </Field>
            </div>

            {/* Uploads */}
            <div>
              <p className="text-sm font-semibold text-slate-800 mb-2">Upload Kelengkapan Berkas</p>
              <p className="text-[11px] text-slate-500 mb-3">Ket: Format file yang didukung PNG, JPG, PDF. Berikan nomor KK pada setiap nama file.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-800 mb-1">Kartu Keluarga (KK)</p>
                  <p className="text-[11px] text-slate-500 mb-3">contoh nama file: KK_AhmadYani_NoKK.png</p>
                  <button
                    type="button"
                    onClick={() => openUpload("KK")}
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
                  >
                    <Upload className="w-4 h-4" /> {kkFile ? "Ganti File" : "Upload Foto Kartu Keluarga"}
                  </button>
                  {kkFile && <p className="mt-2 text-xs text-slate-600">Terpilih: {kkFile.name}</p>}
                </div>
                <div className="rounded-lg border border-slate-200 p-3">
                  <p className="text-sm font-medium text-slate-800 mb-1">Foto Rumah</p>
                  <p className="text-[11px] text-slate-500 mb-3">contoh nama file: FotoRumah_AhmadYani_NoKK.pdf</p>
                  <button
                    type="button"
                    onClick={() => openUpload("RUMAH")}
                    className="inline-flex items-center gap-2 rounded-lg border border-emerald-600 bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-700"
                  >
                    <Upload className="w-4 h-4" /> {houseFile ? "Ganti File" : "Upload Foto Rumah"}
                  </button>
                  {houseFile && <p className="mt-2 text-xs text-slate-600">Terpilih: {houseFile.name}</p>}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  // validate KK number: should have exactly 16 digits (ignore non-digits)
                  const digits = (kkNumber || "").replace(/\D/g, "");
                  if (digits.length !== 16) {
                    setKkError("No. KK harus terdiri dari 16 digit");
                    return;
                  }
                  setKkError("");
                  setShowConfirm(true);
                }}
                className="mx-auto block rounded-lg bg-emerald-600 px-6 py-2.5 text-white font-semibold shadow hover:bg-emerald-700"
              >
                Ajukan Penerimaan Bantuan
              </button>
            </div>
          </form>
        </div>
      </main>

      {/* Upload Modal */}
      <Modal open={showUpload} onClose={() => setShowUpload(false)}>
        <div className="flex items-center gap-2 text-slate-800 font-semibold mb-4">
          <FileText className="w-5 h-5" /> Upload Dokumen {uploadTarget === "KK" ? "KK" : "Rumah"}
        </div>
        <UploadZone
          onSelect={(file) => {
            if (uploadTarget === "KK") setKkFile(file);
            else setHouseFile(file);
          }}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setShowUpload(false)}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700"
          >
            Simpan File
          </button>
        </div>
      </Modal>

      {/* Confirm Modal */}
      <Modal open={showConfirm} onClose={() => setShowConfirm(false)}>
        <h3 className="text-[#0B2B5E] font-semibold text-lg mb-3">Konfirmasi Pengajuan Penerimaan Bantuan</h3>
        <p className="text-sm text-slate-700 leading-relaxed">
          Apakah Anda yakin semua data yang Anda isi sudah benar dan lengkap? Data yang diajukan akan diverifikasi oleh admin desa, dan perubahan tidak dapat dilakukan setelah dikirim. Pastikan dokumen yang Anda unggah (foto rumah dan KK) sudah sesuai.
        </p>
        <div className="mt-5 flex flex-col sm:flex-row gap-3 justify-end">
          <button
            onClick={() => setShowConfirm(false)}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-slate-800 font-medium hover:bg-slate-50"
          >
            Periksa Kembali
          </button>
          <button
            onClick={() => {
              setShowConfirm(false);
              navigate("/penerima/pengajuan/status/pending");
            }}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-white font-semibold hover:bg-emerald-700"
          >
            Ya, Saya Yakin
          </button>
        </div>
      </Modal>
    </div>
  );
}

// Simple drop area used in Upload Modal
function UploadZone({ onSelect }) {
  const inputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  return (
    <div>
      <div
        className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-6 text-center cursor-pointer hover:border-emerald-400"
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="mx-auto h-8 w-8 text-slate-500" />
        <p className="mt-2 text-sm text-slate-700">Klik untuk pilih file</p>
        <p className="text-xs text-slate-500">atau drag & drop file di sini</p>
      </div>
      {fileName && <p className="mt-2 text-xs text-slate-600">Terpilih: {fileName}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          setFileName(f ? f.name : "");
          onSelect?.(f || null);
        }}
      />
    </div>
  );
}

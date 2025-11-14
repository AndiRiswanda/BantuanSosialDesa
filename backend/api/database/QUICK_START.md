# 🎯 QUICK START GUIDE - Database Seeding

## ⚡ Cara Cepat (Menggunakan phpMyAdmin)

### STEP 1: Reset Database
1. Buka phpMyAdmin: `http://localhost/phpmyadmin`
2. Pilih database `bantuan_sosial_desa`
3. Klik tab **SQL**
4. Buka file `reset_database.sql` → Copy semua isi → Paste → Klik **Go**

### STEP 2: Seed Data
1. Masih di tab **SQL** phpMyAdmin
2. Buka file `seed_dummy_complete.sql` → Copy semua isi → Paste → Klik **Go**
3. Tunggu hingga selesai (beberapa detik)

---

## ✅ TEST LOGIN

### 🔐 ADMIN
- URL: `http://localhost:8000/admin/login`
- Email: `admin@desa.id`
- Password: `admin123`

### 💰 DONATUR
- URL: `http://localhost:8000/login/donor`
- Email: `yayasan@peduli.id`
- Password: `donatur123`

**Email Donatur Lainnya:**
- `csr@majusejahtera.co.id`
- `masjid@alikhlas.id`
- `admin@komunitasberbagi.org`
- `budi.santoso@email.com`

### 👨‍👩‍👧‍👦 PENERIMA
- URL: `http://localhost:8000/login/recipient`
- No. KK: `3601012501250001`
- Password: `penerima123`

**No. KK Penerima Lainnya:**
- `3601012501250002` (Siti Aminah)
- `3601012501250003` (Budi Santoso)
- `3601012501250004` (Ratna Dewi)
- `3601012501250005` (Joko Widodo)
- `3601012501250006` (Dewi Lestari)
- `3601012501250007` (Agus Salim)
- `3601012501250008` (Nur Halimah)

---

## 📊 DATA YANG AKAN DI-SEED

| Tabel                | Jumlah Data | Keterangan                               |
|---------------------|-------------|------------------------------------------|
| user_admin          | 2           | Admin dan Kepala Desa                    |
| kategori_bantuan    | 5           | 5 kategori berbeda                       |
| donatur             | 5           | Yayasan (3), Perusahaan (1), Perorangan (1) |
| penerima            | 10          | 8 disetujui, 2 pending                   |
| program_bantuan     | 10          | 9 aktif, 1 selesai                       |
| penerima_program    | 56          | Assignment penerima ke program           |
| transaksi_penyaluran| 13          | Transaksi yang sudah selesai             |

**⚠️ CATATAN PENTING:**
- Semua kolom sudah disesuaikan dengan schema database!
- Jenis instansi donatur: hanya 'perusahaan', 'yayasan', 'perorangan'
- Penerima program menggunakan 'status_penerimaan' (menunggu/selesai/batal)
- Transaksi lengkap dengan jam, jumlah, dan metode penyaluran

---

## 🎨 CONTOH DATA PROGRAM

1. **Bantuan Sembako Ramadan 2025** (Yayasan Peduli Desa)
   - Jenis: Barang (150 paket)
   - Status: Aktif
   - 8 penerima sudah diassign

2. **Beasiswa Siswa Berprestasi 2025** (Yayasan Peduli Desa)
   - Jenis: Uang (Rp 50.000.000)
   - Status: Aktif
   - 6 penerima sudah diassign

3. **Bantuan Korban Banjir 2025** (Komunitas Berbagi)
   - Jenis: Barang (300 paket)
   - Status: **Selesai** (completed program)
   - 8 penerima, semua transaksi selesai

---

## 🛠️ FILES YANG TERSEDIA

```
backend/api/database/
├── reset_database.sql              # Reset database & truncate
├── seed_dummy_complete.sql         # Data dummy lengkap dengan password BENAR
├── generate_password_hash.php      # Script generate hash (jika perlu)
└── README_SEEDER.md               # Dokumentasi lengkap
```

---

## ⚠️ TROUBLESHOOTING

### Error: "Unknown column 'kriteria_penerima'"
**Solusi:**
```sql
ALTER TABLE `program_bantuan`
ADD COLUMN `kriteria_penerima` TEXT NULL AFTER `jumlah_bantuan`,
ADD COLUMN `keterangan` TEXT NULL AFTER `kriteria_penerima`;
```

### Error: "Foreign key constraint fails"
**Solusi:** Jalankan `reset_database.sql` terlebih dahulu sebelum seed

### Password tidak bisa login
**Solusi:** Pastikan menggunakan file `seed_dummy_complete.sql` yang sudah di-update dengan hash yang benar

---

## 📱 TESTING FEATURES SETELAH SEED

### Test Donor Dashboard:
1. Login sebagai donatur: `yayasan@peduli.id` / `donatur123`
2. Dashboard akan menampilkan:
   - Total program yang dibuat (2 program dari Yayasan)
   - Total penerima (14 assignments dari 2 program)
   - Card program dengan data real

### Test Program Detail:
1. Login sebagai donatur
2. Klik salah satu program (misal: "Bantuan Sembako Ramadan 2025")
3. Akan tampil:
   - ✅ Nama program, deskripsi
   - ✅ Kategori: "Pangan & Sembako"
   - ✅ Status: "Aktif" (badge biru)
   - ✅ Jenis: "Barang" dengan jumlah "150"
   - ✅ Tanggal: formatted dengan baik
   - ✅ Progress bar dengan statistik
   - ✅ Kriteria Penerima: "Keluarga prasejahtera dengan..."
   - ✅ Keterangan: "Program ini menargetkan 150 paket..."
   - ✅ Tab Recipients: List 8 penerima dengan data lengkap

### Test New Donation Form:
1. Login sebagai donatur
2. Buat donasi baru
3. Isi semua field termasuk **Kriteria Penerima** dan **Keterangan Penerima**
4. Submit
5. Check di database bahwa field `kriteria_penerima` dan `keterangan` terisi

---

## 🎉 SELESAI!

Setelah seeding, Anda memiliki:
- ✅ 2 akun admin
- ✅ 5 akun donatur siap pakai
- ✅ 10 akun penerima (8 approved)
- ✅ 10 program bantuan dengan data lengkap
- ✅ 56 assignments (penerima-program)
- ✅ 13 transaksi selesai
- ✅ Semua password sudah benar (admin123, donatur123, penerima123)

**Ready for demo/presentation! 🚀**

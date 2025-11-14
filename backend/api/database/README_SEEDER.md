# Panduan Reset Database dan Seeding Data Dummy

## 📋 Deskripsi
File-file ini digunakan untuk me-reset database dan mengisi ulang dengan data dummy yang lengkap untuk keperluan testing dan presentasi.

## 🗂️ File yang Tersedia

### 1. `reset_database.sql`
File untuk menghapus semua data di database dan me-reset auto increment.

### 2. `seed_dummy_complete.sql`
File seeder lengkap dengan data dummy yang realistis.

---

## 🚀 Cara Penggunaan

### Metode 1: Menggunakan phpMyAdmin
1. Buka phpMyAdmin di browser: `http://localhost/phpmyadmin`
2. Pilih database `bantuan_sosial_desa`
3. Klik tab **SQL**
4. **STEP 1 - RESET:**
   - Buka file `reset_database.sql` dengan text editor
   - Copy seluruh isi file
   - Paste ke textarea SQL di phpMyAdmin
   - Klik tombol **Go/Kirim**
   - Tunggu hingga muncul pesan sukses
5. **STEP 2 - SEEDING:**
   - Buka file `seed_dummy_complete.sql` dengan text editor
   - Copy seluruh isi file
   - Paste ke textarea SQL di phpMyAdmin
   - Klik tombol **Go/Kirim**
   - Tunggu hingga selesai (mungkin butuh waktu beberapa detik)

### Metode 2: Menggunakan Command Line (MySQL CLI)
```bash
# Masuk ke direktori database
cd backend/api/database

# STEP 1 - Reset database
mysql -u root -p bantuan_sosial_desa < reset_database.sql

# STEP 2 - Seeding data
mysql -u root -p bantuan_sosial_desa < seed_dummy_complete.sql
```

> **Note:** Ganti `root` dengan username MySQL Anda jika berbeda, dan masukkan password ketika diminta.

### Metode 3: Menggunakan Laravel Artisan (Alternative)
Jika ingin membuat Laravel Seeder:
```bash
cd backend/api

# Generate seeder class
php artisan make:seeder DatabaseSeeder

# Edit file database/seeders/DatabaseSeeder.php
# Lalu jalankan:
php artisan db:seed
```

---

## 📊 Data Dummy yang Disediakan

### 👤 User Admin (2 akun)
| Username      | Email                 | Password   | Role              |
|---------------|----------------------|------------|-------------------|
| admin         | admin@desa.id        | admin123   | Administrator     |
| kepala_desa   | kepaladesa@desa.id   | admin123   | Kepala Desa       |

### 💰 Donatur (5 akun)
| Nama Organisasi            | Email                          | Password    | Jenis Instansi      |
|---------------------------|--------------------------------|-------------|---------------------|
| Yayasan Peduli Desa       | yayasan@peduli.id              | donatur123  | Yayasan             |
| PT Maju Sejahtera         | csr@majusejahtera.co.id        | donatur123  | Perusahaan          |
| Masjid Al-Ikhlas          | masjid@alikhlas.id             | donatur123  | Lembaga Keagamaan   |
| Komunitas Berbagi         | admin@komunitasberbagi.org     | donatur123  | Komunitas           |
| Donatur Individu          | budi.santoso@email.com         | donatur123  | Individu            |

### 👨‍👩‍👧‍👦 Penerima (10 akun)
| No. KK           | Nama            | Password     | Penghasilan         | Status      |
|------------------|-----------------|--------------|---------------------|-------------|
| 3601012501250001 | Ahmad Dahlan    | penerima123  | < 500.000           | Disetujui   |
| 3601012501250002 | Siti Aminah     | penerima123  | 500K - 1JT          | Disetujui   |
| 3601012501250003 | Budi Santoso    | penerima123  | 500K - 1JT          | Disetujui   |
| 3601012501250004 | Ratna Dewi      | penerima123  | < 500.000           | Disetujui   |
| 3601012501250005 | Joko Widodo     | penerima123  | 500K - 1JT          | Disetujui   |
| 3601012501250006 | Dewi Lestari    | penerima123  | < 500.000           | Disetujui   |
| 3601012501250007 | Agus Salim      | penerima123  | 500K - 1JT          | Disetujui   |
| 3601012501250008 | Nur Halimah     | penerima123  | < 500.000           | Disetujui   |
| 3601012501250009 | Rina Susanti    | penerima123  | 1JT - 2JT           | Pending     |
| 3601012501250010 | Hendra Wijaya   | penerima123  | 1JT - 2JT           | Pending     |

### 📦 Kategori Bantuan (5 kategori)
- Pangan & Sembako (Barang)
- Pendidikan (Uang)
- Kesehatan (Uang)
- Bencana Alam (Barang)
- Perumahan (Uang)

### 🎯 Program Bantuan (10 program)
1. **Bantuan Sembako Ramadan 2025** (Yayasan Peduli Desa) - Aktif
2. **Beasiswa Siswa Berprestasi 2025** (Yayasan Peduli Desa) - Aktif
3. **Bantuan Biaya Kesehatan Lansia** (PT Maju Sejahtera) - Aktif
4. **Paket Makanan Bergizi untuk Balita** (PT Maju Sejahtera) - Aktif
5. **Bantuan Pangan Ramadan** (Masjid Al-Ikhlas) - Aktif
6. **Beasiswa Tahfidz Quran** (Masjid Al-Ikhlas) - Aktif
7. **Renovasi Rumah Tidak Layak Huni** (Komunitas Berbagi) - Aktif
8. **Bantuan Korban Banjir 2025** (Komunitas Berbagi) - **Selesai**
9. **Bantuan Laptop untuk Siswa** (Donatur Individu) - Aktif
10. **Berbagi Takjil Ramadan** (Donatur Individu) - Aktif

### 📈 Statistik Data
- **Total Admin:** 2 akun
- **Total Kategori:** 5 kategori
- **Total Donatur:** 5 organisasi/individu (semua disetujui)
- **Total Penerima:** 10 keluarga (8 disetujui, 2 pending)
- **Total Program:** 10 program (9 aktif, 1 selesai)
- **Total Penerima Program (Assignment):** 56 assignments
- **Total Transaksi Penyaluran:** 13 transaksi (semua selesai)

---

## ⚠️ PENTING!

### Sebelum Menjalankan:
1. **BACKUP** database Anda terlebih dahulu jika ada data penting
2. Pastikan koneksi database sudah benar di file `.env`
3. Pastikan tabel sudah memiliki kolom `kriteria_penerima` dan `keterangan` di tabel `program_bantuan`

### Password Hash Information:
Semua password sudah di-hash menggunakan **bcrypt** dengan salt yang sama untuk testing:
- Hash: `$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi`
- Original: `password` (untuk Laravel default)

Password yang bisa digunakan untuk login:
- **Admin:** `admin123`
- **Donatur:** `donatur123`
- **Penerima:** `penerima123`

> ⚠️ **CATATAN:** Password hash yang disediakan adalah hash untuk kata `password`. Jika Anda ingin password sesuai (admin123, donatur123, penerima123), Anda perlu generate hash baru menggunakan Laravel:

```php
// Jalankan di Tinker
php artisan tinker

// Generate hash
bcrypt('admin123')
bcrypt('donatur123')
bcrypt('penerima123')
```

Atau gunakan password `password` untuk login sementara.

---

## 🧪 Testing Setelah Seeding

### Test Login Admin:
- URL: `http://localhost:8000/admin/login`
- Email: `admin@desa.id`
- Password: `password` (atau `admin123` jika sudah generate hash baru)

### Test Login Donatur:
- URL: `http://localhost:8000/login/donor`
- Email: `yayasan@peduli.id`
- Password: `password` (atau `donatur123` jika sudah generate hash baru)

### Test Login Penerima:
- URL: `http://localhost:8000/login/recipient`
- No. KK: `3601012501250001`
- Password: `password` (atau `penerima123` jika sudah generate hash baru)

### Test API Endpoint:
```bash
# Get program list
curl http://localhost:8000/api/donatur/programs

# Get program detail
curl http://localhost:8000/api/donatur/programs/1
```

---

## 🔧 Troubleshooting

### Error: "Foreign key constraint fails"
**Solusi:** Pastikan menjalankan `reset_database.sql` terlebih dahulu sebelum `seed_dummy_complete.sql`

### Error: "Unknown column 'kriteria_penerima'"
**Solusi:** Jalankan migration atau SQL berikut:
```sql
ALTER TABLE `program_bantuan`
ADD COLUMN `kriteria_penerima` TEXT NULL AFTER `jumlah_bantuan`,
ADD COLUMN `keterangan` TEXT NULL AFTER `kriteria_penerima`;
```

### Error: "Duplicate entry"
**Solusi:** Reset database lagi dengan `reset_database.sql`

### Data tidak tampil di frontend
**Solusi:** 
1. Cek koneksi API di browser console
2. Pastikan Laravel server running: `php artisan serve`
3. Pastikan Vite running: `npm run dev`
4. Cek CORS settings di `config/cors.php`

---

## 📞 Support
Jika ada masalah, cek:
1. Laravel log: `backend/api/storage/logs/laravel.log`
2. Browser console (F12)
3. Network tab di DevTools

---

**Created:** 2025-01-XX  
**Last Updated:** 2025-01-XX  
**Version:** 1.0

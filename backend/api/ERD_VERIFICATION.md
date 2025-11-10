# Verifikasi Backend Laravel dengan ERD

## ✅ Status: SESUAI DENGAN ERD

Backend Laravel telah disesuaikan 100% dengan desain ERD yang diberikan.

---

## 📊 Struktur Database (Sesuai ERD)

### 1. **Tabel: penerima**
```
✅ SESUAI ERD
- id_penerima : INT (PK) AUTO_INCREMENT
- no_kk : VARCHAR(20) UNIQUE
- password : VARCHAR(255)
- nama_kepala : VARCHAR(100)
- alamat : TEXT
- nomor_telepon : VARCHAR(15)
- pekerjaan : VARCHAR(100)
- pekerjaan_istri : ENUM('ibu rumah tangga', 'bekerja & berpenghasilan', 'belum menikah', 'kepala keluarga')
- status_anak : ENUM('belum punya', 'bayi', 'sekolah', 'bekerja', 'tidak bekerja')
- jumlah_tanggungan : INT
- penghasilan : ENUM('< 500.000', '500.000 - 1.000.000', '1.000.001 - 2.000.000', '2.000.001 - 3.000.000', '> 3.000.000')
- status_verifikasi : ENUM('pending', 'disetujui', 'ditolak')
- created_at : TIMESTAMP
- updated_at : TIMESTAMP
```
📄 File: `database/migrations/2025_10_29_000003_create_penerima_table.php`
🔧 Model: `app/Models/Penerima.php`

---

### 2. **Tabel: dokumen_verifikasi**
```
✅ SESUAI ERD
- id_dokumen : INT (PK) AUTO_INCREMENT
- id_penerima : INT (FK → penerima.id_penerima)
- jenis_dokumen : VARCHAR(50)
- nama_file : VARCHAR(255)
- path_file : VARCHAR(500)
- ukuran_file : INT
- tanggal_upload : TIMESTAMP

Relasi: Penerima (1) — (M) Dokumen_Verifikasi
```
📄 File: `database/migrations/2025_10_29_000004_create_dokumen_verifikasi_table.php`
🔧 Model: `app/Models/DokumenVerifikasi.php`

---

### 3. **Tabel: donatur**
```
✅ SESUAI ERD
- id_donatur : INT (PK) AUTO_INCREMENT
- nama_organisasi : VARCHAR(100)
- email : VARCHAR(100) UNIQUE
- password : VARCHAR(255)
- alamat : TEXT
- nomor_telepon : VARCHAR(15)
- jenis_instansi : ENUM('perusahaan', 'yayasan', 'perorangan')
- status : ENUM('aktif', 'nonaktif')
- created_at : TIMESTAMP
- updated_at : TIMESTAMP
```
📄 File: `database/migrations/2025_10_29_000002_create_donatur_table.php`
🔧 Model: `app/Models/Donatur.php`

---

### 4. **Tabel: kategori_bantuan**
```
✅ SESUAI ERD
- id_kategori : INT (PK) AUTO_INCREMENT
- nama_kategori : VARCHAR(100) UNIQUE
- deskripsi : TEXT
- jenis_bantuan : ENUM('uang', 'barang')
- status : ENUM('aktif', 'nonaktif')
- created_at : TIMESTAMP
```
📄 File: `database/migrations/2025_10_29_000005_create_kategori_bantuan_table.php`
🔧 Model: `app/Models/KategoriBantuan.php`

---

### 5. **Tabel: program_bantuan**
```
✅ SESUAI ERD
- id_program : INT (PK) AUTO_INCREMENT
- id_kategori : INT (FK → kategori_bantuan.id_kategori)
- id_donatur : INT (FK → donatur.id_donatur)
- nama_program : VARCHAR(150)
- deskripsi : TEXT
- tanggal_mulai : DATE
- tanggal_selesai : DATE
- jenis_bantuan : ENUM('uang', 'barang')
- jumlah_bantuan : DECIMAL(15,2)
- status : ENUM('aktif', 'selesai', 'ditunda')
- created_at : TIMESTAMP
- updated_at : TIMESTAMP

Relasi:
- Donatur (1) — (M) Program_Bantuan
- Kategori_Bantuan (1) — (M) Program_Bantuan
```
📄 File: `database/migrations/2025_10_29_000006_create_program_bantuan_table.php`
🔧 Model: `app/Models/ProgramBantuan.php`

---

### 6. **Tabel: user_admin**
```
✅ SESUAI ERD
- id_admin : INT (PK) AUTO_INCREMENT
- username : VARCHAR(50) UNIQUE
- email : VARCHAR(100) UNIQUE
- password : VARCHAR(255)
- full_name : VARCHAR(100)
- nomor_telepon : VARCHAR(15)
- role : ENUM('admin')
- status : ENUM('active', 'inactive')
- created_at : TIMESTAMP
- updated_at : TIMESTAMP
```
📄 File: `database/migrations/2025_10_29_000001_create_user_admin_table.php`
🔧 Model: `app/Models/UserAdmin.php`

---

### 7. **Tabel: penerima_program**
```
✅ SESUAI ERD
- id_penerima_program : INT (PK) AUTO_INCREMENT
- id_program : INT (FK → program_bantuan.id_program)
- id_penerima : INT (FK → penerima.id_penerima)
- tanggal_penetapan : DATE
- status_penerimaan : ENUM('menunggu', 'selesai', 'batal')
- created_by : INT (FK → user_admin.id_admin)
- created_at : TIMESTAMP

Relasi:
- User_Admin (1) — (M) Penerima_Program
- Penerima (1) — (M) Penerima_Program
- Program_Bantuan (1) — (M) Penerima_Program
```
📄 File: `database/migrations/2025_10_29_000008_create_penerima_program_table.php`
🔧 Model: `app/Models/PenerimaProgram.php`

---

### 8. **Tabel: transaksi_penyaluran**
```
✅ SESUAI ERD
- id_transaksi : INT (PK) AUTO_INCREMENT
- id_penerima_program : INT (FK → penerima_program.id_penerima_program)
- tanggal_penyaluran : DATE
- jam_penyaluran : TIME
- lokasi_penyaluran : VARCHAR(200)
- jumlah_diterima : DECIMAL(12,2)
- metode_penyaluran : ENUM('transfer', 'barang')
- bukti_penyaluran : VARCHAR(255)
- catatan : TEXT
- created_at : TIMESTAMP

Relasi: Penerima_Program (1) — (M) Transaksi_Penyaluran
```
📄 File: `database/migrations/2025_10_29_000010_create_transaksi_penyaluran_table.php`
🔧 Model: `app/Models/TransaksiPenyaluran.php`

---

### 9. **Tabel: laporan_transparansi**
```
✅ SESUAI ERD
- id_laporan : INT (PK) AUTO_INCREMENT
- id_program : INT (FK → program_bantuan.id_program)
- judul_laporan : VARCHAR(200)
- isi_laporan : TEXT
- dokumentasi : TEXT
- tanggal_publikasi : DATE
- created_by : INT (FK → user_admin.id_admin)
- created_at : TIMESTAMP

Relasi:
- User_Admin (1) — (M) Laporan_Transparansi
- Program_Bantuan (1) — (M) Laporan_Transparansi
```
📄 File: `database/migrations/2025_10_29_000012_create_laporan_transparansi_table.php`
🔧 Model: `app/Models/LaporanTransparansi.php`

---

### 10. **Tabel: kriteria_penerima**
```
✅ SESUAI ERD
- id_kriteria : INT (PK) AUTO_INCREMENT
- id_program : INT (FK → program_bantuan.id_program)
- nama_kriteria : VARCHAR(100)
- deskripsi : TEXT
- nilai_minimum : DECIMAL(10,2)
- nilai_maksimum : DECIMAL(10,2)

Relasi: Program_Bantuan (1) — (M) Kriteria_Penerima
```
📄 File: `database/migrations/2025_10_29_000007_create_kriteria_penerima_table.php`
🔧 Model: `app/Models/KriteriaPenerima.php`

---

## 🗑️ Yang Sudah Dihapus (Tidak Ada di ERD)

1. ❌ **Tabel pengaduan** - Migration dihapus
2. ❌ **Model Pengaduan** - File dihapus
3. ❌ **PengaduanController** - File dihapus
4. ❌ **Routes pengaduan** - Dihapus dari routes/api.php

---

## 📁 Struktur File Backend

```
backend/api/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AdminController.php ✅
│   │   │   ├── AuthController.php ✅
│   │   │   ├── DonorController.php ✅
│   │   │   ├── ProgramController.php ✅
│   │   │   └── RecipientController.php ✅
│   │   └── Middleware/
│   │       └── AdminMiddleware.php ✅
│   └── Models/
│       ├── Donatur.php ✅
│       ├── DokumenVerifikasi.php ✅
│       ├── KategoriBantuan.php ✅
│       ├── KriteriaPenerima.php ✅
│       ├── LaporanTransparansi.php ✅
│       ├── Penerima.php ✅
│       ├── PenerimaProgram.php ✅
│       ├── ProgramBantuan.php ✅
│       ├── TransaksiPenyaluran.php ✅
│       └── UserAdmin.php ✅
├── database/
│   ├── migrations/ (10 tabel sesuai ERD) ✅
│   └── seeders/
│       └── DatabaseSeeder.php ✅
├── routes/
│   └── api.php ✅
└── config/
    ├── auth.php ✅
    └── cors.php ✅
```

---

## 🔐 Authentication Setup

### Guards yang Dikonfigurasi:
1. **donatur** - untuk login Donor
2. **penerima** - untuk login Penerima/Recipient
3. **admin** - untuk login Admin

Semua menggunakan Laravel Sanctum untuk token-based authentication.

---

## 🎯 API Endpoints Summary

### Public Routes:
- `POST /api/login/donor` - Login donatur
- `POST /api/login/recipient` - Login penerima
- `POST /api/register/donor` - Registrasi donatur
- `POST /api/register/recipient` - Registrasi penerima
- `POST /api/admin/login` - Login admin
- `GET /api/programs` - List program publik
- `GET /api/programs/{id}` - Detail program

### Donor Routes (Protected):
- `GET /api/donor/dashboard` - Dashboard donatur
- `GET /api/donor/programs` - Program milik donatur
- `POST /api/donor/programs` - Buat program baru
- `PUT /api/donor/programs/{id}` - Update program
- `GET /api/donor/profile` - Profile donatur
- `PUT /api/donor/profile` - Update profile

### Recipient Routes (Protected):
- `GET /api/recipient/dashboard` - Dashboard penerima
- `GET /api/recipient/programs` - List program tersedia
- `POST /api/recipient/programs/{id}/apply` - Daftar program
- `GET /api/recipient/applications` - Riwayat aplikasi
- `POST /api/recipient/documents` - Upload dokumen
- `GET /api/recipient/profile` - Profile penerima
- `PUT /api/recipient/profile` - Update profile

### Admin Routes (Protected + Admin Middleware):
- `GET /api/admin/dashboard` - Dashboard admin
- `GET /api/admin/programs` - Kelola program
- `GET /api/admin/donors` - Kelola donatur
- `GET /api/admin/recipients` - Kelola penerima
- `GET /api/admin/verifications/*` - Verifikasi
- `GET /api/admin/penerima-program` - Kelola penerima program
- `GET /api/admin/transaksi` - Kelola transaksi penyaluran
- `GET /api/admin/reports` - Laporan transparansi
- `GET /api/admin/categories` - Kelola kategori

---

## 🗃️ Sample Data (Database Seeder)

### Admin:
- Username: `admin`
- Email: `admin@example.com`
- Password: `admin123`

### Donatur (2 donors):
- **Donor 1**: Yayasan Peduli A | `donor1@example.com` | `donor123`
- **Donor 2**: PT Donasi Bersama | `donor2@example.com` | `donor123`

### Kategori (2 categories):
- Sembako (barang)
- Beasiswa (uang)

### Program (2 programs):
- Sembako untuk Lansia (100 unit)
- Beasiswa Anak Berprestasi (50 unit)

### Penerima (2 recipients):
- **KK 3201010101010001**: Budi Santoso | `recipient123`
- **KK 3201010101010002**: Siti Aminah | `recipient123`

---

## ✅ Checklist Kesesuaian ERD

- [x] Tabel penerima - Sesuai 100%
- [x] Tabel dokumen_verifikasi - Sesuai 100%
- [x] Tabel donatur - Sesuai 100%
- [x] Tabel kategori_bantuan - Sesuai 100%
- [x] Tabel program_bantuan - Sesuai 100%
- [x] Tabel user_admin - Sesuai 100%
- [x] Tabel penerima_program - Sesuai 100%
- [x] Tabel transaksi_penyaluran - Sesuai 100%
- [x] Tabel laporan_transparansi - Sesuai 100%
- [x] Tabel kriteria_penerima - Sesuai 100%
- [x] Semua relasi foreign key - Configured
- [x] Semua enum values - Sesuai
- [x] Semua tipe data - Sesuai
- [x] Primary keys - Auto increment configured
- [x] Timestamps - Configured

---

## 🚀 Cara Menjalankan

1. **Pastikan MySQL sudah running** (via Laragon)

2. **Jalankan Migration & Seeder:**
```bash
cd backend/api
php artisan migrate:fresh --seed
```

3. **Start Laravel Server:**
```bash
php artisan serve
```

4. **Test API dengan Postman/Thunder Client:**
```
POST http://localhost:8000/api/admin/login
Body: {
  "email": "admin@example.com",
  "password": "admin123"
}
```

---

## 📚 Dokumentasi Lengkap

Lihat file: `BACKEND_API_DOCUMENTATION.md` untuk dokumentasi detail semua endpoint.

---

**✅ Backend Laravel 100% Sesuai dengan ERD yang Diberikan!**

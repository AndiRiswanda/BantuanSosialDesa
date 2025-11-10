# Backend API Documentation - Bantuan Sosial Desa

## ✅ Status Implementasi Backend

### Models (Completed ✅)
Semua models sudah dibuat dan siap digunakan:
- ✅ **Donatur** - Model untuk donor/donatur
- ✅ **Penerima** - Model untuk penerima bantuan
- ✅ **ProgramBantuan** - Model untuk program bantuan
- ✅ **PenerimaProgram** - Model untuk relasi penerima dengan program
- ✅ **TransaksiPenyaluran** - Model untuk transaksi penyaluran
- ✅ **KategoriBantuan** - Model untuk kategori bantuan
- ✅ **DokumenVerifikasi** - Model untuk dokumen verifikasi penerima
- ✅ **KriteriaPenerima** - Model untuk kriteria penerima
- ✅ **LaporanTransparansi** - Model untuk laporan transparansi
- ✅ **Pengaduan** - Model untuk pengaduan masyarakat
- ✅ **UserAdmin** - Model untuk admin (sudah support authentication)

### Controllers (90% Complete)
- ✅ **AuthController** - Login & Register (Donor, Recipient, Admin)
- ✅ **DonorController** - Dashboard, Programs, Profile
- ✅ **RecipientController** - Dashboard, Applications, Documents
- ✅ **ProgramController** - Public API untuk programs
- ✅ **PengaduanController** - Submit pengaduan
- ⚠️ **AdminController** - Perlu dilengkapi secara manual

### API Routes (Completed ✅)
Semua routes sudah didefinisikan di `routes/api.php`

---

## 🔐 Authentication

### Login Donor
**POST** `/api/login/donor`

Request Body:
```json
{
  "email": "donor@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "user": {
    "id_donatur": 1,
    "nama_organisasi": "Yayasan ABC",
    "email": "donor@example.com",
    ...
  },
  "token": "1|xxxxxxx",
  "type": "donor"
}
```

### Login Recipient (Penerima)
**POST** `/api/login/recipient`

Request Body:
```json
{
  "no_kk": "1234567890123456",
  "password": "password123"
}
```

### Register Donor
**POST** `/api/register/donor`

Request Body:
```json
{
  "nama_organisasi": "Yayasan ABC",
  "email": "donor@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "nomor_telepon": "081234567890",
  "alamat": "Jl. Contoh No. 123",
  "jenis_instansi": "yayasan"
}
```

Jenis Instansi Options: `perusahaan`, `yayasan`, `perorangan`

### Register Recipient
**POST** `/api/register/recipient`

Request Body:
```json
{
  "no_kk": "1234567890123456",
  "password": "password123",
  "password_confirmation": "password123",
  "nama_kepala": "Budi Santoso",
  "nomor_telepon": "081234567890",
  "alamat": "Jl. Desa No. 123",
  "pekerjaan": "Petani",
  "pekerjaan_istri": "ibu rumah tangga",
  "status_anak": "sekolah",
  "jumlah_tanggungan": 4,
  "penghasilan": "< 500.000"
}
```

Pekerjaan Istri Options: `ibu rumah tangga`, `bekerja & berpenghasilan`, `belum menikah`, `kepala keluarga`

Status Anak Options: `belum punya`, `bayi`, `sekolah`, `bekerja`, `tidak bekerja`

Penghasilan Options: `< 500.000`, `500.000 - 1.000.000`, `1.000.001 - 2.000.000`, `2.000.001 - 3.000.000`, `> 3.000.000`

### Admin Login
**POST** `/api/admin/login`

Request Body:
```json
{
  "email": "admin@example.com",
  "password": "admin123"
}
```

### Logout
**POST** `/api/logout`
Headers: `Authorization: Bearer {token}`

---

## 👨‍💼 Donor API

### Dashboard
**GET** `/api/donor/dashboard`
Headers: `Authorization: Bearer {token}`

Response:
```json
{
  "user": {...},
  "stats": {
    "total_programs": 5,
    "active_programs": 3,
    "total_bantuan": 50000000
  },
  "recent_programs": [...]
}
```

### Get All Programs (Donor's own)
**GET** `/api/donor/programs`
Headers: `Authorization: Bearer {token}`

### Get Program Detail
**GET** `/api/donor/programs/{id}`

### Create Program
**POST** `/api/donor/programs`
Headers: `Authorization: Bearer {token}`

Request Body:
```json
{
  "id_kategori": 1,
  "nama_program": "Bantuan Sembako Ramadan",
  "deskripsi": "Program bantuan sembako untuk bulan Ramadan",
  "tanggal_mulai": "2025-03-01",
  "tanggal_selesai": "2025-03-31",
  "jenis_bantuan": "barang",
  "jumlah_bantuan": 10000000
}
```

Jenis Bantuan Options: `uang`, `barang`

### Update Program
**PUT** `/api/donor/programs/{id}`

### Get Profile
**GET** `/api/donor/profile`

### Update Profile
**PUT** `/api/donor/profile`

---

## 👨‍👩‍👧‍👦 Recipient API

### Dashboard
**GET** `/api/recipient/dashboard`
Headers: `Authorization: Bearer {token}`

### Get Available Programs
**GET** `/api/recipient/programs`

### Get Program Detail
**GET** `/api/recipient/programs/{id}`

### Apply to Program
**POST** `/api/recipient/programs/{id}/apply`
Headers: `Authorization: Bearer {token}`

Note: Penerima harus sudah diverifikasi (status_verifikasi = 'disetujui') sebelum bisa apply program

### Get My Applications
**GET** `/api/recipient/applications`

### Get Profile
**GET** `/api/recipient/profile`

### Update Profile
**PUT** `/api/recipient/profile`

### Upload Document
**POST** `/api/recipient/documents`
Headers: `Authorization: Bearer {token}`, `Content-Type: multipart/form-data`

Request Body (Form Data):
```
jenis_dokumen: "KTP" (atau "KK", "Surat Keterangan", etc.)
file: [binary file]
```

---

## 🏛️ Public API

### Get All Active Programs
**GET** `/api/programs`

Response (Paginated):
```json
{
  "data": [
    {
      "id_program": 1,
      "nama_program": "Bantuan Sembako",
      "kategori": {...},
      "donatur": {...},
      ...
    }
  ],
  "links": {...},
  "meta": {...}
}
```

### Get Program Detail
**GET** `/api/programs/{id}`

### Submit Pengaduan
**POST** `/api/pengaduan`

Request Body:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "081234567890",
  "subject": "Keluhan Program",
  "message": "Isi pesan pengaduan..."
}
```

---

## 👨‍💼 Admin API (Perlu Implementasi)

Admin Controller sudah dibuat structurenya di `app/Http/Controllers/AdminController.php`, namun perlu dilengkapi implementasinya. Berikut endpoint yang tersedia:

### Dashboard Statistics
**GET** `/api/admin/dashboard`

### Program Management
- **GET** `/api/admin/programs` - List all programs
- **POST** `/api/admin/programs` - Create program
- **PUT** `/api/admin/programs/{id}` - Update program
- **DELETE** `/api/admin/programs/{id}` - Delete program

### Penerima Program Management
- **GET** `/api/admin/penerima-program` - List penerima programs
- **POST** `/api/admin/penerima-program` - Assign penerima to program
- **PUT** `/api/admin/penerima-program/{id}` - Update status

### Transaksi Penyaluran
- **GET** `/api/admin/transaksi` - List transactions
- **POST** `/api/admin/transaksi` - Create transaction
- **PUT** `/api/admin/transaksi/{id}` - Update transaction

### Donor Verification
- **GET** `/api/admin/verifications/donors` - Pending donors
- **PUT** `/api/admin/verifications/donors/{id}` - Verify donor

### Recipient Verification
- **GET** `/api/admin/verifications/recipients` - Pending recipients
- **PUT** `/api/admin/verifications/recipients/{id}` - Verify recipient

### Donor Management
- **GET** `/api/admin/donors` - List all donors
- **GET** `/api/admin/donors/{id}` - Donor detail
- **PUT** `/api/admin/donors/{id}` - Update donor

### Recipient Management
- **GET** `/api/admin/recipients` - List all recipients
- **GET** `/api/admin/recipients/{id}` - Recipient detail
- **PUT** `/api/admin/recipients/{id}` - Update recipient

### Category Management
- **GET** `/api/admin/categories` - List categories
- **POST** `/api/admin/categories` - Create category
- **PUT** `/api/admin/categories/{id}` - Update category

### Report Management
- **GET** `/api/admin/reports` - List reports
- **POST** `/api/admin/reports` - Create report

### Pengaduan Management
- **GET** `/api/admin/pengaduan` - List all pengaduan
- **PUT** `/api/admin/pengaduan/{id}` - Update status

### Admin Profile
- **GET** `/api/admin/profile` - Get profile
- **PUT** `/api/admin/profile` - Update profile

---

## 📊 Database Structure

### Table: donatur
- id_donatur (PK)
- nama_organisasi
- email (unique)
- password
- alamat
- nomor_telepon
- jenis_instansi (enum)
- status (enum: aktif/nonaktif)
- created_at, updated_at

### Table: penerima
- id_penerima (PK)
- no_kk (unique)
- password
- nama_kepala
- alamat
- nomor_telepon
- pekerjaan
- pekerjaan_istri (enum)
- status_anak (enum)
- jumlah_tanggungan
- penghasilan (enum)
- status_verifikasi (enum: pending/disetujui/ditolak)
- created_at, updated_at

### Table: program_bantuan
- id_program (PK)
- id_kategori (FK)
- id_donatur (FK)
- nama_program
- deskripsi
- tanggal_mulai
- tanggal_selesai
- jenis_bantuan (enum: uang/barang)
- jumlah_bantuan
- status (enum: aktif/selesai/ditunda)
- created_at, updated_at

### Table: penerima_program
- id_penerima_program (PK)
- id_program (FK)
- id_penerima (FK)
- tanggal_penetapan
- status_penerimaan (enum: menunggu/selesai/batal)
- created_by (FK to user_admin)
- created_at

### Table: transaksi_penyaluran
- id_transaksi (PK)
- id_penerima_program (FK)
- tanggal_penyaluran
- jam_penyaluran
- lokasi_penyaluran
- jumlah_diterima
- metode_penyaluran (enum: transfer/barang)
- bukti_penyaluran
- catatan
- created_at

### Table: kategori_bantuan
- id_kategori (PK)
- nama_kategori (unique)
- deskripsi
- jenis_bantuan (enum: uang/barang)
- status (enum: aktif/nonaktif)
- created_at

### Table: dokumen_verifikasi
- id_dokumen (PK)
- id_penerima (FK)
- jenis_dokumen
- nama_file
- path_file
- ukuran_file
- tanggal_upload

### Table: pengaduan
- id (PK)
- name
- email
- phone
- subject
- message
- status (enum: pending/processed/resolved)
- created_at, updated_at

---

## 🔨 Next Steps

### 1. Implementasi AdminController
File `AdminController.php` sudah dibuat skeleton-nya. Anda bisa copy implementasi dari file backup atau implement ulang sesuai kebutuhan spesifik.

### 2. Testing API
Gunakan Postman atau Thunder Client untuk test semua endpoints yang sudah dibuat.

### 3. Seeder untuk Data Dummy
Buat seeder untuk testing:
```bash
php artisan make:seeder AdminSeeder
php artisan make:seeder KategoriBantuanSeeder
```

Contoh AdminSeeder:
```php
UserAdmin::create([
    'username' => 'admin',
    'email' => 'admin@admin.com',
    'password' => Hash::make('admin123'),
    'full_name' => 'Super Admin',
    'role' => 'admin',
    'status' => 'active'
]);
```

### 4. File Upload Configuration
Configure storage untuk upload dokumen:
```bash
php artisan storage:link
```

Tambahkan disk configuration di `config/filesystems.php` jika perlu.

---

## 📝 Notes

1. **Authentication**: Gunakan Laravel Sanctum untuk semua protected routes
2. **CORS**: Sudah dikonfigurasi untuk menerima request dari `localhost:5173`
3. **Validation**: Semua input sudah divalidasi di controller
4. **Relationships**: Semua models sudah punya relationships yang benar
5. **Pagination**: List endpoints menggunakan pagination untuk performa

---

## 🚀 How to Run

1. **Start Laravel Backend**:
   ```bash
   cd backend/api
   php artisan serve
   ```
   Backend akan berjalan di: `http://localhost:8000`

2. **Start React Frontend**:
   ```bash
   npm run dev
   ```
   Frontend akan berjalan di: `http://localhost:5173`

3. **Test API**:
   - Gunakan Postman/Thunder Client
   - Atau langsung test dari frontend React

---

**Backend Development Status: 90% Complete** ✅

Yang perlu dilengkapi:
- AdminController implementation (copy dari backup atau implement manual)
- Seeder untuk data dummy
- Testing semua endpoints

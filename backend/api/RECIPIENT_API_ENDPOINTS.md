# API Endpoints untuk Penerima Bantuan

Dokumentasi lengkap endpoint API untuk halaman penerima dengan data real dari database.

## Base URL
```
http://localhost:8000/api/recipient
```

## Authentication
Semua endpoint memerlukan:
- Header: `Authorization: Bearer {token}`
- Middleware: `role:penerima`

## Endpoints

### 1. Dashboard
**GET** `/api/recipient/dashboard`

Menampilkan dashboard penerima dengan statistik dan program terbaru.

**Response:**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Ahmad Dahlan",
    "no_kk": "3601012501250001",
    "status_verifikasi": "disetujui",
    "alamat": "Jl. Melati No. 1, RT 01/RW 01",
    "nomor_telepon": "081234567890"
  },
  "stats": {
    "total_programs": 5,
    "approved_programs": 3,
    "pending_programs": 1,
    "completed_programs": 4,
    "status_verifikasi": "disetujui"
  },
  "recent_programs": [
    {
      "id": 1,
      "title": "Bantuan Sembako Ramadan 2025",
      "donor": "Yayasan Peduli Desa",
      "status": "disetujui",
      "type": "Barang",
      "start": "01 Jan 2025",
      "end": "31 Mar 2025",
      "goods": "Paket sembako lengkap",
      "progress": 75,
      "latest_transaction": {
        "date": "15 Jan 2025",
        "time": "09:00",
        "location": "Kantor Desa",
        "amount": 500000
      }
    }
  ]
}
```

---

### 2. Daftar Program
**GET** `/api/recipient/programs`

Menampilkan semua program aktif dengan filter dan pagination.

**Query Parameters:**
- `jenis` (optional): Filter jenis bantuan (`uang` | `barang`)
- `kategori` (optional): Filter ID kategori
- `search` (optional): Cari berdasarkan nama program
- `per_page` (optional, default: 10): Jumlah data per halaman

**Example Request:**
```
GET /api/recipient/programs?jenis=uang&search=sembako&per_page=15
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Bantuan Sembako Ramadan 2025",
      "description": "Program bantuan sembako untuk keluarga kurang mampu",
      "donor": "Yayasan Peduli Desa",
      "donor_type": "Yayasan",
      "category": "Pangan & Sembako",
      "status": "Aktif",
      "type": "Barang",
      "start": "01 Jan 2025",
      "end": "31 Mar 2025",
      "goods": "Paket sembako: beras 10kg, minyak 2L, gula 1kg",
      "criteria": "Keluarga dengan penghasilan < Rp 1.500.000",
      "progress": 60,
      "progress_note": "6/10 penerima",
      "received": true,
      "total_recipients": 10,
      "completed_recipients": 6
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 15,
    "total": 45
  }
}
```

---

### 3. Detail Program
**GET** `/api/recipient/programs/{id}`

Menampilkan detail lengkap program termasuk kriteria dan jadwal penyaluran.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Bantuan Sembako Ramadan 2025",
    "description": "Program bantuan sembako untuk keluarga kurang mampu",
    "donor": {
      "name": "Yayasan Peduli Desa",
      "type": "Yayasan",
      "email": "yayasan@peduli.id",
      "phone": "021123456"
    },
    "category": {
      "id": 1,
      "name": "Pangan & Sembako",
      "description": "Bantuan kebutuhan pangan"
    },
    "status": "Aktif",
    "type": "Barang",
    "start_date": "01 Jan 2025",
    "end_date": "31 Mar 2025",
    "goods_info": "Paket sembako lengkap",
    "criteria": "Keluarga dengan penghasilan < Rp 1.500.000",
    "keterangan": "Penyaluran dilakukan setiap bulan",
    "progress": 60,
    "statistics": {
      "total_recipients": 10,
      "completed_recipients": 6,
      "progress_percentage": 60
    },
    "my_application": {
      "id": 123,
      "status": "disetujui",
      "tanggal_penetapan": "10 Jan 2025",
      "total_received": 1500000,
      "transaction_count": 3
    },
    "schedule": [
      {
        "id": 1,
        "tanggal": "15 Jan 2025",
        "jam": "09:00 - 12:00",
        "lokasi": "Kantor Desa",
        "jumlah_diterima": 500000,
        "metode": "Tunai",
        "status": "Selesai",
        "catatan": "Penyaluran tahap 1"
      }
    ],
    "can_apply": false
  }
}
```

---

### 4. Daftar Aplikasi/Riwayat
**GET** `/api/recipient/applications`

Menampilkan riwayat aplikasi penerima ke berbagai program.

**Query Parameters:**
- `status` (optional): Filter status (`menunggu` | `disetujui` | `ditolak` | `selesai`)
- `per_page` (optional, default: 10): Jumlah data per halaman

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "program_id": 1,
      "program_title": "Bantuan Sembako Ramadan 2025",
      "program_description": "Program bantuan sembako",
      "donor": "Yayasan Peduli Desa",
      "category": "Pangan & Sembako",
      "status": "disetujui",
      "type": "Barang",
      "start_date": "01 Jan 2025",
      "end_date": "31 Mar 2025",
      "tanggal_penetapan": "10 Jan 2025",
      "goods": "Paket sembako lengkap",
      "total_received": 1500000,
      "total_received_formatted": "Rp 1.500.000",
      "transaction_count": 3,
      "progress": 75,
      "latest_transaction": {
        "date": "15 Jan 2025",
        "time": "09:00",
        "location": "Kantor Desa",
        "amount": 500000,
        "amount_formatted": "Rp 500.000"
      },
      "created_by": "admin"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 2,
    "per_page": 10,
    "total": 15
  }
}
```

---

### 5. Profile Lengkap
**GET** `/api/recipient/profile`

Menampilkan profil penerima lengkap dengan dokumen dan program yang diikuti.

**Response:**
```json
{
  "success": true,
  "profile": {
    "id": 1,
    "no_kk": "3601012501250001",
    "nama_kepala": "Ahmad Dahlan",
    "alamat": "Jl. Melati No. 1, RT 01/RW 01",
    "nomor_telepon": "081234567890",
    "pekerjaan": "Petani",
    "pekerjaan_istri": "Ibu Rumah Tangga",
    "status_anak": "Sekolah",
    "jumlah_tanggungan": 3,
    "penghasilan": "< Rp 1.000.000",
    "status_verifikasi": "disetujui",
    "created_at": "01 Jan 2025"
  },
  "program_stats": {
    "total": 5,
    "disetujui": 3,
    "menunggu": 1,
    "selesai": 1,
    "ditolak": 0
  },
  "programs": [
    {
      "id": 123,
      "program_id": 1,
      "title": "Bantuan Sembako Ramadan 2025",
      "donor": "Yayasan Peduli Desa",
      "category": "Pangan & Sembako",
      "status": "disetujui",
      "type": "Barang",
      "start_date": "01 Jan 2025",
      "end_date": "31 Mar 2025",
      "tanggal_penetapan": "10 Jan 2025",
      "total_received": 1500000,
      "total_received_formatted": "Rp 1.500.000",
      "transaction_count": 3
    }
  ],
  "documents": [
    {
      "id": 1,
      "jenis_dokumen": "KK",
      "nama_file": "kk_3601012501250001.pdf",
      "path_file": "dokumen_verifikasi/kk_3601012501250001.pdf",
      "url": "http://localhost:8000/storage/dokumen_verifikasi/kk_3601012501250001.pdf",
      "ukuran_file": 204800,
      "ukuran_file_formatted": "200.00 KB",
      "uploaded_at": "01 Jan 2025 10:30"
    }
  ]
}
```

---

### 6. Update Profile
**PUT** `/api/recipient/profile`

Mengupdate data profil penerima.

**Request Body:**
```json
{
  "nama_kepala": "Ahmad Dahlan",
  "nomor_telepon": "081234567890",
  "alamat": "Jl. Melati No. 1, RT 01/RW 01",
  "pekerjaan": "Petani",
  "pekerjaan_istri": "Ibu Rumah Tangga",
  "status_anak": "Sekolah",
  "jumlah_tanggungan": 3,
  "penghasilan": "< Rp 1.000.000"
}
```

**Response:**
```json
{
  "id": 1,
  "no_kk": "3601012501250001",
  "nama_kepala": "Ahmad Dahlan",
  "alamat": "Jl. Melati No. 1, RT 01/RW 01",
  "nomor_telepon": "081234567890",
  "pekerjaan": "Petani",
  "pekerjaan_istri": "Ibu Rumah Tangga",
  "status_anak": "Sekolah",
  "jumlah_tanggungan": 3,
  "penghasilan": "< Rp 1.000.000",
  "status_verifikasi": "disetujui"
}
```

---

### 7. Daftar Program (Apply)
**POST** `/api/recipient/programs/{id}/apply`

Mendaftar ke program bantuan.

**Response Success:**
```json
{
  "success": true,
  "message": "Pengajuan berhasil dikirim. Mohon tunggu verifikasi admin.",
  "data": {
    "id": 124,
    "id_program": 2,
    "id_penerima": 1,
    "status_penerimaan": "menunggu",
    "tanggal_penetapan": "17 Nov 2025",
    "program": {
      "id": 2,
      "nama_program": "Beasiswa Siswa Berprestasi 2025"
    }
  }
}
```

**Response Error (Already Applied):**
```json
{
  "success": false,
  "message": "Anda sudah mendaftar program ini",
  "application_status": "menunggu"
}
```

**Response Error (Not Verified):**
```json
{
  "success": false,
  "message": "Anda harus diverifikasi terlebih dahulu sebelum mendaftar program"
}
```

---

### 8. Jadwal Penyaluran (Semua)
**GET** `/api/recipient/schedules`

Menampilkan semua jadwal penyaluran untuk penerima.

**Query Parameters:**
- `per_page` (optional, default: 20): Jumlah data per halaman

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "program_id": 1,
      "program_title": "Bantuan Sembako Ramadan 2025",
      "donor": "Yayasan Peduli Desa",
      "category": "Pangan & Sembako",
      "type": "Barang",
      "tanggal": "15 Jan 2025",
      "tanggal_raw": "2025-01-15",
      "jam": "09:00 - 12:00",
      "lokasi": "Kantor Desa",
      "jumlah_diterima": 500000,
      "jumlah_diterima_formatted": "Rp 500.000",
      "metode": "Tunai",
      "catatan": "Penyaluran tahap 1",
      "status": "Selesai",
      "bukti_penyaluran": null,
      "created_at": "15 Jan 2025 09:30"
    }
  ],
  "pagination": {
    "current_page": 1,
    "last_page": 2,
    "per_page": 20,
    "total": 35
  }
}
```

---

### 9. Jadwal Penyaluran (Per Program)
**GET** `/api/recipient/programs/{id}/schedules`

Menampilkan jadwal penyaluran untuk program tertentu.

**Response:**
```json
{
  "success": true,
  "program_id": 1,
  "data": [
    {
      "id": 1,
      "tanggal": "15 Jan 2025",
      "tanggal_raw": "2025-01-15",
      "jam": "09:00 - 12:00",
      "lokasi": "Kantor Desa",
      "jumlah_diterima": 500000,
      "jumlah_diterima_formatted": "Rp 500.000",
      "metode": "Tunai",
      "catatan": "Penyaluran tahap 1",
      "status": "Selesai",
      "bukti_penyaluran": null
    },
    {
      "id": 2,
      "tanggal": "15 Feb 2025",
      "tanggal_raw": "2025-02-15",
      "jam": "09:00 - 12:00",
      "lokasi": "Kantor Desa",
      "jumlah_diterima": 500000,
      "jumlah_diterima_formatted": "Rp 500.000",
      "metode": "Tunai",
      "catatan": "Penyaluran tahap 2",
      "status": "Selesai",
      "bukti_penyaluran": null
    }
  ]
}
```

**Response Error (Not Recipient):**
```json
{
  "success": false,
  "message": "Anda bukan penerima program ini"
}
```

---

### 10. Upload Dokumen
**POST** `/api/recipient/documents`

Upload dokumen verifikasi.

**Request Body (multipart/form-data):**
- `jenis_dokumen`: string (required) - Jenis dokumen (KK, KTP, dll)
- `file`: file (required, max 5MB) - File dokumen

**Response:**
```json
{
  "id": 1,
  "id_penerima": 1,
  "jenis_dokumen": "KK",
  "nama_file": "1700123456_kk.pdf",
  "path_file": "dokumen_verifikasi/1700123456_kk.pdf",
  "ukuran_file": 204800,
  "created_at": "2025-01-01T10:30:00.000000Z"
}
```

---

## Status Values

### Status Verifikasi Penerima
- `pending`: Menunggu verifikasi
- `disetujui`: Sudah disetujui
- `ditolak`: Ditolak

### Status Penerimaan Program
- `menunggu`: Menunggu persetujuan admin
- `disetujui`: Disetujui admin
- `ditolak`: Ditolak
- `selesai`: Penyaluran selesai

### Status Program
- `aktif`: Program masih berjalan
- `selesai`: Program sudah selesai

### Jenis Bantuan
- `uang`: Bantuan tunai
- `barang`: Bantuan barang

---

## Kredensial Testing

Gunakan kredensial berikut untuk testing:

**Penerima 1:**
- No. KK: `3601012501250001`
- Password: `penerima123`
- Nama: Ahmad Dahlan
- Status: Disetujui

**Penerima 2:**
- No. KK: `3601012501250002`
- Password: `penerima123`
- Nama: Siti Aminah
- Status: Disetujui

**Login Endpoint:**
```
POST /api/login/recipient
Body: {
  "no_kk": "3601012501250001",
  "password": "penerima123"
}
```

---

## Notes

1. Semua endpoint memerlukan authentication token dari login
2. Data yang ditampilkan adalah data real dari database dummy
3. Pagination tersedia untuk endpoint yang menampilkan list
4. Filter dan search tersedia untuk optimasi pencarian
5. Response selalu dalam format JSON dengan struktur konsisten

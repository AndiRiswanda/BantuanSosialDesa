# 🔄 CHANGELOG - Perbaikan Schema vs Seed Data

## Tanggal: 13 November 2025

### ❌ Masalah yang Ditemukan:

#### 1. Tabel `donatur`
**Schema database:**
- `jenis_instansi` ENUM('perusahaan', 'yayasan', 'perorangan')
- `status` ENUM('aktif', 'nonaktif')
- **TIDAK ADA** kolom `status_verifikasi`

**Seed data lama (SALAH):**
- ❌ Menggunakan: 'individu', 'komunitas', 'lembaga keagamaan'
- ❌ Menggunakan kolom `status_verifikasi` yang tidak ada

**✅ SUDAH DIPERBAIKI:**
```sql
-- Sekarang menggunakan hanya: 'perusahaan', 'yayasan', 'perorangan'
-- Masjid & Komunitas diganti menjadi 'yayasan'
-- Individu menjadi 'perorangan'
-- Menggunakan kolom 'status' bukan 'status_verifikasi'
```

#### 2. Tabel `penerima_program`
**Schema database:**
- `tanggal_penetapan` DATE NOT NULL
- `status_penerimaan` ENUM('menunggu', 'selesai', 'batal')
- `created_by` INT UNSIGNED NOT NULL (foreign key ke user_admin)

**Seed data lama (SALAH):**
- ❌ Menggunakan kolom `status_seleksi` yang tidak ada
- ❌ Tidak ada kolom `tanggal_penetapan`
- ❌ Tidak ada kolom `created_by`

**✅ SUDAH DIPERBAIKI:**
```sql
-- Sekarang menggunakan kolom yang benar:
INSERT INTO `penerima_program` 
  (`id_program`, `id_penerima`, `tanggal_penetapan`, `status_penerimaan`, `created_by`)
VALUES
  (1, 1, '2025-02-10', 'menunggu', 1);
  -- created_by = 1 (admin pertama)
```

#### 3. Tabel `transaksi_penyaluran`
**Schema database:**
- `tanggal_penyaluran` DATE NOT NULL
- `jam_penyaluran` TIME NOT NULL
- `jumlah_diterima` DECIMAL(12,2) NOT NULL
- `metode_penyaluran` ENUM('transfer', 'barang')
- **TIDAK ADA** kolom `status_penyaluran`

**Seed data lama (SALAH):**
- ❌ Menggunakan kolom `status_penyaluran` yang tidak ada
- ❌ Tidak ada kolom `jam_penyaluran`
- ❌ Tidak ada kolom `jumlah_diterima`
- ❌ Tidak ada kolom `metode_penyaluran`

**✅ SUDAH DIPERBAIKI:**
```sql
-- Sekarang lengkap:
INSERT INTO `transaksi_penyaluran` 
  (`id_penerima_program`, `tanggal_penyaluran`, `jam_penyaluran`, 
   `lokasi_penyaluran`, `jumlah_diterima`, `metode_penyaluran`, `catatan`)
VALUES
  (1, '2025-02-15', '09:00:00', 'Kantor Desa', 1.00, 'barang', 'Catatan...');
```

---

## ✅ File yang Sudah Diperbaiki:

### `seed_dummy_complete.sql`
- ✅ Tabel `donatur`: jenis_instansi sesuai ENUM schema
- ✅ Tabel `donatur`: menggunakan kolom `status` bukan `status_verifikasi`
- ✅ Tabel `penerima_program`: kolom lengkap (tanggal_penetapan, status_penerimaan, created_by)
- ✅ Tabel `transaksi_penyaluran`: kolom lengkap (jam, jumlah, metode)

---

## 🎯 Cara Menggunakan File yang Sudah Diperbaiki:

### 1. Reset Database
```bash
# Via phpMyAdmin atau MySQL CLI:
mysql -u root -p bantuan_sosial_desa < reset_database.sql
```

### 2. Seed Data Baru (SUDAH BENAR)
```bash
mysql -u root -p bantuan_sosial_desa < seed_dummy_complete.sql
```

---

## 📊 Data yang Di-seed (SUDAH SESUAI SCHEMA):

| Tabel                | Jumlah | Status          |
|---------------------|--------|-----------------|
| user_admin          | 2      | ✅ Sesuai       |
| kategori_bantuan    | 5      | ✅ Sesuai       |
| donatur             | 5      | ✅ DIPERBAIKI   |
| penerima            | 10     | ✅ Sesuai       |
| program_bantuan     | 10     | ✅ Sesuai       |
| penerima_program    | 56     | ✅ DIPERBAIKI   |
| transaksi_penyaluran| 13     | ✅ DIPERBAIKI   |

---

## ⚠️ PENTING - Perubahan Data:

### Jenis Instansi Donatur (Disesuaikan):
| No | Nama Organisasi              | Jenis Lama            | Jenis Baru (✅) |
|----|-----------------------------|-----------------------|-----------------|
| 1  | Yayasan Peduli Desa         | yayasan               | yayasan         |
| 2  | PT Maju Sejahtera           | perusahaan            | perusahaan      |
| 3  | Masjid Al-Ikhlas            | ~~lembaga keagamaan~~ | **yayasan**     |
| 4  | Komunitas Berbagi           | ~~komunitas~~         | **yayasan**     |
| 5  | Donatur Individu            | ~~individu~~          | **perorangan**  |

### Status Penerima Program (Disesuaikan):
- Lama: `status_seleksi` dengan nilai 'disetujui'
- Baru: `status_penerimaan` dengan nilai:
  - **'menunggu'** untuk program aktif
  - **'selesai'** untuk program yang sudah selesai (Program 8: Bantuan Banjir)

---

## 🧪 Testing Setelah Seed:

Semua tetap berfungsi normal! Kredensial login sama:

### Login Donatur:
- Email: `yayasan@peduli.id`
- Password: `donatur123`
- ✅ Data program akan tampil normal
- ✅ Jenis instansi tampil sebagai "yayasan"

### Dashboard & API:
- ✅ GET /api/donatur/programs → Berhasil
- ✅ GET /api/donatur/programs/1 → Detail lengkap
- ✅ Recipients list → Tampil dengan status yang benar

---

## 📝 Catatan Developer:

1. **Jangan gunakan file `seed.mysql.sql` lama** - sudah tidak sesuai schema
2. **Gunakan `seed_dummy_complete.sql`** - sudah diperbaiki sesuai schema
3. **Model Eloquent mungkin perlu update** jika ada relasi ke kolom yang berubah
4. **Frontend mungkin perlu update** jika menampilkan `status_verifikasi` donatur (harus diganti `status`)

---

## ✅ Status: **SELESAI & SIAP DIGUNAKAN**

File seed data sudah 100% sesuai dengan schema database!

# Update Status Verifikasi Penerima

## Perubahan yang Dilakukan

### Masalah
Sebelumnya, ketika penerima baru mendaftar (register), mereka langsung muncul di halaman admin "Pengajuan Penerima Baru" dengan status `pending` meskipun belum mengisi form pengajuan bantuan.

### Solusi
Menambahkan status baru `belum_mengajukan` yang menjadi default status untuk penerima baru yang baru saja register. Status akan berubah menjadi `pending` hanya setelah mereka mengisi dan submit form pengajuan bantuan.

## Status Verifikasi Penerima

1. **belum_mengajukan** (default)
   - Status awal ketika penerima baru register
   - Belum muncul di halaman admin "Pengajuan Penerima Baru"
   - Penerima dapat login tapi belum bisa akses program

2. **pending**
   - Status setelah penerima mengisi dan submit form pengajuan bantuan
   - Muncul di halaman admin untuk diverifikasi
   - Menunggu approval dari admin

3. **disetujui**
   - Status setelah admin menyetujui pengajuan
   - Penerima dapat melihat dan mendaftar ke program bantuan
   - Dapat ditambahkan ke program oleh admin

4. **ditolak**
   - Status jika admin menolak pengajuan
   - Penerima tidak dapat akses program

## File yang Diubah

1. **Migration**
   - `database/migrations/2025_10_29_000003_create_penerima_table.php`
     - Update enum untuk menambahkan 'belum_mengajukan'
     - Ubah default status dari 'pending' ke 'belum_mengajukan'
   
   - `database/migrations/2025_12_03_000001_add_belum_mengajukan_status_to_penerima.php` (BARU)
     - Migration untuk update database yang sudah ada
     - Update data lama yang statusnya pending tapi belum lengkap

2. **Controllers**
   - `app/Http/Controllers/RecipientController.php`
     - `submitApplication()`: Set status ke 'pending' saat form disubmit
     - `applyProgram()`: Cek status 'disetujui' bukan 'terverifikasi'
   
   - `app/Http/Controllers/AdminController.php`
     - `pendingRecipients()`: Tetap query status 'pending' (tidak perlu ubah)
     - `updateRecipient()`: Update validasi untuk terima 'belum_mengajukan'
     - `assignPenerimaToProgram()`: Cek status 'disetujui' bukan 'terverifikasi'
     - `dashboard()`: Hitung recipient dengan status 'disetujui'
     - `analytics()`: Hitung verified recipient dengan status 'disetujui'

3. **SQL Script** (opsional, jika ingin manual)
   - `database/update_status_verifikasi.sql`
     - Script SQL untuk update database secara manual

## Cara Menjalankan Migration

```bash
cd backend/api
php artisan migrate
```

Migration akan otomatis:
1. Menambahkan status 'belum_mengajukan' ke enum
2. Mengubah default status menjadi 'belum_mengajukan'
3. Update data penerima yang statusnya 'pending' tapi belum lengkap menjadi 'belum_mengajukan'

## Testing

### Test Case 1: Penerima Baru Register
1. Register akun penerima baru
2. ✅ Status harus 'belum_mengajukan'
3. ✅ Tidak muncul di admin "Pengajuan Penerima Baru"

### Test Case 2: Submit Form Pengajuan
1. Login sebagai penerima
2. Isi form pengajuan bantuan
3. Submit form
4. ✅ Status berubah menjadi 'pending'
5. ✅ Muncul di admin "Pengajuan Penerima Baru"

### Test Case 3: Admin Approve
1. Admin buka "Pengajuan Penerima Baru"
2. ✅ Hanya muncul penerima dengan status 'pending'
3. Admin approve pengajuan
4. ✅ Status berubah menjadi 'disetujui'
5. ✅ Penerima dapat akses program bantuan

## Catatan Penting

- **Backward Compatibility**: Data lama otomatis diupdate oleh migration
- **API Response**: Pastikan frontend handle status 'belum_mengajukan' dengan benar
- **Validasi**: Semua validasi sudah diupdate untuk include 'belum_mengajukan'

## Rollback (jika diperlukan)

Jika perlu rollback perubahan:

```bash
php artisan migrate:rollback
```

Ini akan:
1. Mengembalikan enum ke status lama
2. Update semua 'belum_mengajukan' kembali ke 'pending'

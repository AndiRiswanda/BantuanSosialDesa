-- Script untuk mengupdate status_verifikasi enum dan data yang sudah ada
-- Jalankan script ini di database Anda

-- Step 1: Update kolom status_verifikasi untuk menambahkan value baru 'belum_mengajukan'
ALTER TABLE `penerima` 
MODIFY COLUMN `status_verifikasi` 
ENUM('belum_mengajukan', 'pending', 'disetujui', 'ditolak') 
DEFAULT 'belum_mengajukan';

-- Step 2: Update data yang sudah ada
-- Jika ada penerima dengan status 'pending' yang belum mengisi data lengkap,
-- ubah ke 'belum_mengajukan'
-- Penerima dianggap sudah mengisi form jika memiliki data pekerjaan dan penghasilan
UPDATE `penerima` 
SET `status_verifikasi` = 'belum_mengajukan'
WHERE `status_verifikasi` = 'pending' 
AND (`pekerjaan` IS NULL OR `penghasilan` IS NULL);

-- Step 3: Penerima yang sudah lengkap tetap pending
-- (Tidak perlu query karena sudah pending)

-- Step 4 (OPSIONAL): Jika ada status 'terverifikasi', ubah menjadi 'disetujui'
-- UPDATE `penerima` 
-- SET `status_verifikasi` = 'disetujui'
-- WHERE `status_verifikasi` = 'terverifikasi';

-- Verifikasi hasil update
SELECT status_verifikasi, COUNT(*) as jumlah 
FROM penerima 
GROUP BY status_verifikasi;

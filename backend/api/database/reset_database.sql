-- Script untuk Reset Database Bantuan Sosial Desa
-- HATI-HATI: Script ini akan menghapus SEMUA data di database

USE `bantuan_sosial_desa`;

-- Disable foreign key checks untuk menghindari constraint error
SET FOREIGN_KEY_CHECKS = 0;

-- Truncate semua tabel (menghapus data tapi mempertahankan struktur)
TRUNCATE TABLE `transaksi_penyaluran`;
TRUNCATE TABLE `penerima_program`;
TRUNCATE TABLE `kriteria_penerima`;
TRUNCATE TABLE `program_bantuan`;
TRUNCATE TABLE `laporan_transparansi`;
TRUNCATE TABLE `dokumen_verifikasi`;
TRUNCATE TABLE `penerima`;
TRUNCATE TABLE `donatur`;
TRUNCATE TABLE `kategori_bantuan`;
TRUNCATE TABLE `user_admin`;

-- Enable kembali foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Reset auto increment ke 1 untuk semua tabel
ALTER TABLE `user_admin` AUTO_INCREMENT = 1;
ALTER TABLE `kategori_bantuan` AUTO_INCREMENT = 1;
ALTER TABLE `donatur` AUTO_INCREMENT = 1;
ALTER TABLE `penerima` AUTO_INCREMENT = 1;
ALTER TABLE `program_bantuan` AUTO_INCREMENT = 1;
ALTER TABLE `kriteria_penerima` AUTO_INCREMENT = 1;
ALTER TABLE `penerima_program` AUTO_INCREMENT = 1;
ALTER TABLE `transaksi_penyaluran` AUTO_INCREMENT = 1;
ALTER TABLE `dokumen_verifikasi` AUTO_INCREMENT = 1;
ALTER TABLE `laporan_transparansi` AUTO_INCREMENT = 1;

-- Konfirmasi
SELECT 'Database berhasil direset! Semua data telah dihapus.' AS Status;

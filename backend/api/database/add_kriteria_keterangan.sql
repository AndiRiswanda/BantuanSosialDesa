-- Tambahkan kolom kriteria_penerima dan keterangan ke tabel program_bantuan

ALTER TABLE `program_bantuan`
ADD COLUMN `kriteria_penerima` TEXT NULL AFTER `jumlah_bantuan`,
ADD COLUMN `keterangan` TEXT NULL AFTER `kriteria_penerima`;

-- Minimal seed data for Bantuan Sosial Desa (adjust as needed)
USE `bantuan_sosial_desa`;

-- Admin
INSERT INTO `user_admin` (`username`, `email`, `password`, `full_name`, `status`)
VALUES ('admin', 'admin@example.com', '$2y$10$HASHING', 'Administrator', 'active');

-- Donatur
INSERT INTO `donatur` (`nama_organisasi`, `email`, `password`, `alamat`, `nomor_telepon`, `jenis_instansi`, `status`)
VALUES ('Yayasan Contoh', 'donatur@example.com', '$2y$10$HASHING', 'Jl. Mawar No.1', '081234567890', 'yayasan', 'aktif');

-- Kategori Bantuan
INSERT INTO `kategori_bantuan` (`nama_kategori`, `deskripsi`, `jenis_bantuan`, `status`)
VALUES ('Bantuan Pendidikan', 'Diperuntukkan bagi siswa dari keluarga kurang mampu', 'uang', 'aktif');

-- Penerima
INSERT INTO `penerima` (`no_kk`, `password`, `nama_kepala`, `alamat`, `nomor_telepon`, `pekerjaan`, `pekerjaan_istri`, `status_anak`, `jumlah_tanggungan`, `penghasilan`, `status_verifikasi`)
VALUES ('3174-1234-5678-9012', '$2y$10$HASHING', 'Bapak Ahmad', 'RT 01 RW 02, Desa Sejahtera', '081298765432', 'Buruh Harian', 'ibu rumah tangga', 'sekolah', 3, '500.000 - 1.000.000', 'pending');

-- Program Bantuan (refer to kategori & donatur)
INSERT INTO `program_bantuan` (`id_kategori`, `id_donatur`, `nama_program`, `deskripsi`, `tanggal_mulai`, `tanggal_selesai`, `jenis_bantuan`, `jumlah_bantuan`, `status`)
SELECT k.id_kategori, d.id_donatur,
       'Beasiswa Siswa Berprestasi',
       'Bantuan biaya pendidikan bagi siswa berprestasi dari keluarga kurang mampu',
       DATE(NOW()), NULL, 'uang', 10000000.00, 'aktif'
FROM `kategori_bantuan` k, `donatur` d
LIMIT 1;

-- Kriteria Penerima (linked to the inserted program)
INSERT INTO `kriteria_penerima` (`id_program`, `nama_kriteria`, `deskripsi`, `nilai_minimum`, `nilai_maksimum`)
SELECT p.id_program, 'Pendapatan Bulanan', 'Penghasilan keluarga per bulan', 0.00, 2000000.00
FROM `program_bantuan` p
ORDER BY p.id_program DESC
LIMIT 1;

-- Penerima Program (assign the penerima to the latest program, created_by admin)
INSERT INTO `penerima_program` (`id_program`, `id_penerima`, `tanggal_penetapan`, `status_penerimaan`, `created_by`)
SELECT p.id_program, r.id_penerima, DATE(NOW()), 'menunggu', a.id_admin
FROM `program_bantuan` p
JOIN `penerima` r ON 1=1
JOIN `user_admin` a ON 1=1
ORDER BY p.id_program DESC, r.id_penerima DESC, a.id_admin DESC
LIMIT 1;

-- Transaksi Penyaluran (example record tied to the assignment)
INSERT INTO `transaksi_penyaluran` (`id_penerima_program`, `tanggal_penyaluran`, `jam_penyaluran`, `lokasi_penyaluran`, `jumlah_diterima`, `metode_penyaluran`, `bukti_penyaluran`, `catatan`)
SELECT pp.id_penerima_program, DATE(NOW()), TIME(NOW()), 'Kantor Desa Sejahtera', 500000.00, 'transfer', NULL, 'Penyaluran tahap 1'
FROM `penerima_program` pp
ORDER BY pp.id_penerima_program DESC
LIMIT 1;

-- Dokumen Verifikasi (linked to penerima)
INSERT INTO `dokumen_verifikasi` (`id_penerima`, `jenis_dokumen`, `nama_file`, `path_file`, `ukuran_file`)
SELECT r.id_penerima, 'KTP', 'ktp_ahmad.pdf', '/uploads/ktp/ktp_ahmad.pdf', 123456
FROM `penerima` r
ORDER BY r.id_penerima DESC
LIMIT 1;

-- Laporan Transparansi (linked to program & admin)
INSERT INTO `laporan_transparansi` (`id_program`, `judul_laporan`, `isi_laporan`, `dokumentasi`, `tanggal_publikasi`, `created_by`)
SELECT p.id_program,
       'Laporan Tahap 1',
       'Penyaluran tahap pertama telah dilakukan dengan jumlah penerima awal.',
       'Foto dokumentasi tersimpan pada sistem file',
       DATE(NOW()), a.id_admin
FROM `program_bantuan` p, `user_admin` a
ORDER BY p.id_program DESC, a.id_admin DESC
LIMIT 1;

-- Notes:
-- Replace the placeholder bcrypt hashes ($2y$...REPLACE_ME...) with real password hashes before using in production.
-- You can generate bcrypt using your backend or tooling.



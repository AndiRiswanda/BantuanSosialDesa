-- Seed Data Dummy untuk Bantuan Sosial Desa
-- Jalankan setelah truncate atau fresh migration

USE `bantuan_sosial_desa`;

-- ================================================
-- 1. ADMIN
-- ================================================
-- Password: admin123
INSERT INTO `user_admin` (`username`, `email`, `password`, `full_name`, `status`) VALUES
('admin', 'admin@desa.id', '$2y$10$F0z9cr2B4S5UZhaZF20KnOfn0QL5qOx1YpMvgUjc1VXvvV5md9DRy', 'Administrator Desa', 'active'),
('kepala_desa', 'kepaladesa@desa.id', '$2y$10$F0z9cr2B4S5UZhaZF20KnOfn0QL5qOx1YpMvgUjc1VXvvV5md9DRy', 'Kepala Desa Sejahtera', 'active');

-- ================================================
-- 2. KATEGORI BANTUAN
-- ================================================
INSERT INTO `kategori_bantuan` (`nama_kategori`, `deskripsi`, `jenis_bantuan`, `status`) VALUES
('Pangan & Sembako', 'Bantuan bahan makanan pokok untuk kebutuhan sehari-hari', 'barang', 'aktif'),
('Pendidikan', 'Bantuan biaya pendidikan untuk siswa kurang mampu', 'uang', 'aktif'),
('Kesehatan', 'Bantuan biaya pengobatan dan alat kesehatan', 'uang', 'aktif'),
('Bencana Alam', 'Bantuan untuk korban bencana alam', 'barang', 'aktif'),
('Perumahan', 'Bantuan renovasi atau pembangunan rumah layak huni', 'uang', 'aktif');

-- ================================================
-- 3. DONATUR
-- ================================================
-- Password: donatur123
-- CATATAN: jenis_instansi hanya: 'perusahaan', 'yayasan', 'perorangan'
INSERT INTO `donatur` (`nama_organisasi`, `email`, `password`, `alamat`, `nomor_telepon`, `jenis_instansi`, `status`) VALUES
('Yayasan Peduli Desa', 'yayasan@peduli.id', '$2y$10$3/RL4UjOIF06cxHoMOaKRuq7CimTXIHgKr/2FjdQ/PKbEcr2vdXEC', 'Jl. Raya Desa No. 123, Jakarta Selatan', '021-12345678', 'yayasan', 'aktif'),
('PT Maju Sejahtera', 'csr@majusejahtera.co.id', '$2y$10$3/RL4UjOIF06cxHoMOaKRuq7CimTXIHgKr/2FjdQ/PKbEcr2vdXEC', 'Jl. Industri No. 45, Tangerang', '021-87654321', 'perusahaan', 'aktif'),
('Masjid Al-Ikhlas', 'masjid@alikhlas.id', '$2y$10$3/RL4UjOIF06cxHoMOaKRuq7CimTXIHgKr/2FjdQ/PKbEcr2vdXEC', 'Jl. Masjid Raya No. 10, Depok', '021-55556666', 'yayasan', 'aktif'),
('Komunitas Berbagi', 'admin@komunitasberbagi.org', '$2y$10$3/RL4UjOIF06cxHoMOaKRuq7CimTXIHgKr/2FjdQ/PKbEcr2vdXEC', 'Jl. Kemanusiaan No. 77, Bogor', '0251-123456', 'yayasan', 'aktif'),
('Donatur Individu - Budi Santoso', 'budi.santoso@email.com', '$2y$10$3/RL4UjOIF06cxHoMOaKRuq7CimTXIHgKr/2FjdQ/PKbEcr2vdXEC', 'Jl. Harmoni No. 88, Bekasi', '0812-3456-7890', 'perorangan', 'aktif');

-- ================================================
-- 4. PENERIMA
-- ================================================
-- Password: penerima123
INSERT INTO `penerima` (`no_kk`, `password`, `nama_kepala`, `alamat`, `nomor_telepon`, `pekerjaan`, `pekerjaan_istri`, `status_anak`, `jumlah_tanggungan`, `penghasilan`, `status_verifikasi`) VALUES
('3601012501250001', '$2y$10$LbmeDR/SLXNmFo/ORt8oc.l5P417dcR77uByu116Yev.dV81ARsjG', 'Ahmad Dahlan', 'Jl. Melati No. 12, RT 01/02, Desa Sejahtera', '0812-1111-2222', 'Buruh Harian', 'ibu rumah tangga', 'sekolah', 4, '< 500.000', 'disetujui'),
('3601012501250002', '$2y$10$LbmeDR/SLXNmFo/ORt8oc.l5P417dcR77uByu116Yev.dV81ARsjG', 'Siti Aminah', 'Jl. Mawar No. 8, RT 02/03, Desa Sejahtera', '0813-2222-3333', 'Pedagang Kecil', 'bekerja & berpenghasilan', 'sekolah', 3, '500.000 - 1.000.000', 'disetujui'),
('3601012501250003', '$2y$10$LbmeDR/SLXNmFo/ORt8oc.l5P417dcR77uByu116Yev.dV81ARsjG', 'Budi Santoso', 'Jl. Kenanga No. 5, RT 03/03, Desa Sejahtera', '0814-3333-4444', 'Tukang Bangunan', 'ibu rumah tangga', 'sekolah', 5, '500.000 - 1.000.000', 'disetujui'),
('3601012501250004', '$2y$10$LbmeDR/SLXNmFo/ORt8oc.l5P417dcR77uByu116Yev.dV81ARsjG', 'Ratna Dewi', 'Jl. Anggrek No. 15, RT 01/02, Desa Sejahtera', '0815-4444-5555', 'Penjahit', 'kepala keluarga', 'sekolah', 2, '< 500.000', 'disetujui'),
('3601012501250005', '$2y$10$LbmeDR/SLXNmFo/ORt8oc.l5P417dcR77uByu116Yev.dV81ARsjG', 'Joko Widodo', 'Jl. Flamboyan No. 20, RT 04/01, Desa Sejahtera', '0816-5555-6666', 'Petani', 'ibu rumah tangga', 'bayi', 3, '500.000 - 1.000.000', 'disetujui'),
('3601012501250006', '$2y$10$LbmeDR/SLXNmFo/ORt8oc.l5P417dcR77uByu116Yev.dV81ARsjG', 'Dewi Lestari', 'Jl. Dahlia No. 7, RT 02/01, Desa Sejahtera', '0817-6666-7777', 'Tukang Cuci', 'kepala keluarga', 'tidak bekerja', 4, '< 500.000', 'disetujui'),
('3601012501250007', '$2y$10$LbmeDR/SLXNmFo/ORt8oc.l5P417dcR77uByu116Yev.dV81ARsjG', 'Agus Salim', 'Jl. Bougenville No. 33, RT 05/02, Desa Sejahtera', '0818-7777-8888', 'Supir Angkot', 'ibu rumah tangga', 'sekolah', 3, '500.000 - 1.000.000', 'disetujui'),
('3601012501250008', '$2y$10$LbmeDR/SLXNmFo/ORt8oc.l5P417dcR77uByu116Yev.dV81ARsjG', 'Nur Halimah', 'Jl. Sakura No. 18, RT 03/02, Desa Sejahtera', '0819-8888-9999', 'Pedagang Sayur', 'kepala keluarga', 'sekolah', 2, '< 500.000', 'disetujui'),
('3601012501250009', '$2y$10$LbmeDR/SLXNmFo/ORt8oc.l5P417dcR77uByu116Yev.dV81ARsjG', 'Rina Susanti', 'Jl. Teratai No. 9, RT 01/03, Desa Sejahtera', '0811-9999-0000', 'Buruh Pabrik', 'ibu rumah tangga', 'sekolah', 4, '1.000.001 - 2.000.000', 'pending'),
('3601012501250010', '$2y$10$LbmeDR/SLXNmFo/ORt8oc.l5P417dcR77uByu116Yev.dV81ARsjG', 'Hendra Wijaya', 'Jl. Tulip No. 25, RT 04/02, Desa Sejahtera', '0812-0000-1111', 'Ojek Online', 'bekerja & berpenghasilan', 'sekolah', 3, '1.000.001 - 2.000.000', 'pending');

-- ================================================
-- 5. PROGRAM BANTUAN
-- ================================================
INSERT INTO `program_bantuan` (`id_kategori`, `id_donatur`, `nama_program`, `deskripsi`, `tanggal_mulai`, `tanggal_selesai`, `jenis_bantuan`, `jumlah_bantuan`, `kriteria_penerima`, `keterangan`, `status`) VALUES
-- Program dari Yayasan Peduli Desa (id_donatur = 1)
(1, 1, 'Bantuan Sembako Ramadan 2025', 'Program bantuan paket sembako untuk keluarga prasejahtera menyambut bulan Ramadan 2025. Setiap paket berisi beras 10kg, minyak goreng 2L, gula 2kg, dan kebutuhan pokok lainnya.', '2025-02-01', '2025-03-31', 'barang', 150, 'Keluarga prasejahtera dengan penghasilan kurang dari Rp 1.000.000 per bulan dan memiliki tanggungan minimal 3 orang', 'Program ini menargetkan 150 paket sembako untuk disalurkan kepada keluarga kurang mampu di wilayah Desa Sejahtera. Penyaluran dilakukan secara bertahap di Kantor Desa.', 'aktif'),

(2, 1, 'Beasiswa Siswa Berprestasi 2025', 'Bantuan biaya pendidikan untuk siswa SD-SMA yang berprestasi namun berasal dari keluarga kurang mampu. Bantuan berupa uang tunai untuk biaya sekolah selama 1 tahun.', '2025-01-15', '2025-12-31', 'uang', 50000000, 'Siswa aktif SD/SMP/SMA dengan rapor rata-rata minimal 8.0 dan keluarga berpenghasilan kurang dari Rp 1.500.000 per bulan', 'Bantuan akan disalurkan dalam 2 tahap: semester 1 dan semester 2. Total 50 siswa akan menerima bantuan dengan nominal Rp 1.000.000 per siswa per tahun.', 'aktif'),

-- Program dari PT Maju Sejahtera (id_donatur = 2)
(3, 2, 'Bantuan Biaya Kesehatan Lansia', 'Program CSR untuk membantu biaya pengobatan dan pemeriksaan kesehatan rutin bagi lansia di Desa Sejahtera yang berasal dari keluarga kurang mampu.', '2025-01-01', '2025-06-30', 'uang', 30000000, 'Lansia berusia 60 tahun ke atas, memiliki penyakit kronis, dan berasal dari keluarga dengan penghasilan kurang dari Rp 1.000.000', 'Program ini akan membantu 30 lansia dengan bantuan maksimal Rp 1.000.000 per orang untuk biaya pengobatan, pembelian obat, dan pemeriksaan kesehatan.', 'aktif'),

(1, 2, 'Paket Makanan Bergizi untuk Balita', 'Program pemberian paket makanan bergizi untuk balita dari keluarga kurang mampu guna mencegah stunting dan gizi buruk.', '2025-02-15', '2025-08-15', 'barang', 200, 'Keluarga dengan balita usia 0-5 tahun dan penghasilan keluarga kurang dari Rp 1.000.000 per bulan', 'Setiap bulan selama 6 bulan, keluarga akan menerima paket berisi susu formula, bubur bayi, vitamin, dan makanan bergizi lainnya. Target 200 paket per bulan.', 'aktif'),

-- Program dari Masjid Al-Ikhlas (id_donatur = 3)
(1, 3, 'Bantuan Pangan Ramadan', 'Bantuan sembako dan zakat fitrah untuk keluarga kurang mampu di lingkungan masjid dan sekitarnya.', '2025-03-01', '2025-04-15', 'barang', 100, 'Keluarga muslim yang terdaftar sebagai mustahik (penerima zakat) dengan penghasilan kurang dari Rp 1.000.000', 'Program ini merupakan tradisi tahunan Masjid Al-Ikhlas. Setiap paket berisi beras 10kg, kurma 1kg, minyak 2L, dan uang tunai Rp 200.000.', 'aktif'),

(2, 3, 'Beasiswa Tahfidz Quran', 'Bantuan biaya pendidikan untuk anak-anak yang menghafal Al-Quran di TPQ dan Pesantren.', '2025-01-10', '2025-12-20', 'uang', 20000000, 'Anak usia 7-17 tahun yang aktif menghafal Al-Quran minimal 5 juz dan berasal dari keluarga kurang mampu', 'Bantuan diberikan kepada 20 santri dengan nominal Rp 1.000.000 per tahun untuk biaya pendidikan, buku, dan perlengkapan belajar.', 'aktif'),

-- Program dari Komunitas Berbagi (id_donatur = 4)
(5, 4, 'Renovasi Rumah Tidak Layak Huni', 'Program gotong royong renovasi rumah untuk keluarga yang tinggal di rumah tidak layak huni.', '2025-03-01', '2025-10-31', 'uang', 100000000, 'Keluarga dengan rumah kategori tidak layak huni (RTLH), memiliki sertifikat tanah, dan penghasilan kurang dari Rp 1.500.000', 'Program ini akan merenovasi 10 rumah dengan dana maksimal Rp 10.000.000 per unit. Renovasi mencakup atap, lantai, dinding, dan sanitasi dasar.', 'aktif'),

(4, 4, 'Bantuan Korban Banjir 2025', 'Bantuan darurat untuk korban banjir berupa paket sembako, pakaian, selimut, dan peralatan dapur.', '2025-01-20', '2025-02-28', 'barang', 300, 'Keluarga yang terdampak banjir dengan rumah terendam minimal 50cm dan kehilangan harta benda', 'Bantuan diberikan segera setelah banjir surut. Setiap keluarga mendapat 1 paket darurat berisi kebutuhan pokok untuk 1 minggu.', 'selesai'),

-- Program dari Donatur Individu (id_donatur = 5)
(2, 5, 'Bantuan Laptop untuk Siswa', 'Donasi laptop bekas layak pakai untuk siswa SMP-SMA yang membutuhkan untuk pembelajaran online.', '2025-01-05', '2025-03-31', 'barang', 15, 'Siswa SMP/SMA yang tidak memiliki laptop/komputer, memiliki prestasi akademik baik, dan keluarga tidak mampu membeli', 'Program ini akan memberikan 15 unit laptop bekas yang masih berfungsi dengan baik kepada siswa yang membutuhkan untuk mendukung pembelajaran jarak jauh.', 'aktif'),

(1, 5, 'Berbagi Takjil Ramadan', 'Program berbagi takjil gratis setiap sore di bulan Ramadan untuk masyarakat yang berpuasa.', '2025-03-10', '2025-04-10', 'barang', 1000, 'Terbuka untuk semua masyarakat yang berpuasa, prioritas untuk keluarga kurang mampu dan pekerja serabutan', 'Setiap sore selama bulan Ramadan akan dibagikan takjil gratis (gorengan, kolak, dll) di 5 titik strategis desa. Target 1000 porsi takjil.', 'aktif');

-- ================================================
-- 6. PENERIMA PROGRAM (Assignment)
-- ================================================
-- CATATAN: Schema memerlukan: tanggal_penetapan, status_penerimaan (bukan status_seleksi), created_by (admin)
-- created_by = 1 (admin pertama)
INSERT INTO `penerima_program` (`id_program`, `id_penerima`, `tanggal_penetapan`, `status_penerimaan`, `created_by`) VALUES
-- Program 1: Bantuan Sembako Ramadan 2025 - 8 penerima disetujui
(1, 1, '2025-02-10', 'menunggu', 1), (1, 2, '2025-02-10', 'menunggu', 1), (1, 3, '2025-02-10', 'menunggu', 1), (1, 4, '2025-02-10', 'menunggu', 1),
(1, 5, '2025-02-10', 'menunggu', 1), (1, 6, '2025-02-10', 'menunggu', 1), (1, 7, '2025-02-10', 'menunggu', 1), (1, 8, '2025-02-10', 'menunggu', 1),

-- Program 2: Beasiswa Siswa Berprestasi 2025 - 6 penerima
(2, 1, '2025-01-20', 'menunggu', 1), (2, 2, '2025-01-20', 'menunggu', 1), (2, 3, '2025-01-20', 'menunggu', 1), 
(2, 4, '2025-01-20', 'menunggu', 1), (2, 5, '2025-01-20', 'menunggu', 1), (2, 7, '2025-01-20', 'menunggu', 1),

-- Program 3: Bantuan Biaya Kesehatan Lansia - 4 penerima
(3, 1, '2025-01-10', 'menunggu', 1), (3, 4, '2025-01-10', 'menunggu', 1), (3, 6, '2025-01-10', 'menunggu', 1), (3, 8, '2025-01-10', 'menunggu', 1),

-- Program 4: Paket Makanan Bergizi untuk Balita - 5 penerima
(4, 1, '2025-02-20', 'menunggu', 1), (4, 3, '2025-02-20', 'menunggu', 1), (4, 5, '2025-02-20', 'menunggu', 1), 
(4, 6, '2025-02-20', 'menunggu', 1), (4, 8, '2025-02-20', 'menunggu', 1),

-- Program 5: Bantuan Pangan Ramadan - 7 penerima
(5, 1, '2025-03-05', 'menunggu', 1), (5, 2, '2025-03-05', 'menunggu', 1), (5, 3, '2025-03-05', 'menunggu', 1), (5, 4, '2025-03-05', 'menunggu', 1),
(5, 6, '2025-03-05', 'menunggu', 1), (5, 7, '2025-03-05', 'menunggu', 1), (5, 8, '2025-03-05', 'menunggu', 1),

-- Program 6: Beasiswa Tahfidz Quran - 4 penerima
(6, 2, '2025-01-15', 'menunggu', 1), (6, 3, '2025-01-15', 'menunggu', 1), (6, 5, '2025-01-15', 'menunggu', 1), (6, 7, '2025-01-15', 'menunggu', 1),

-- Program 7: Renovasi Rumah Tidak Layak Huni - 3 penerima
(7, 1, '2025-03-10', 'menunggu', 1), (7, 4, '2025-03-10', 'menunggu', 1), (7, 6, '2025-03-10', 'menunggu', 1),

-- Program 8: Bantuan Korban Banjir 2025 - 8 penerima (program selesai)
(8, 1, '2025-01-22', 'selesai', 1), (8, 2, '2025-01-22', 'selesai', 1), (8, 3, '2025-01-22', 'selesai', 1), (8, 4, '2025-01-22', 'selesai', 1),
(8, 5, '2025-01-22', 'selesai', 1), (8, 6, '2025-01-22', 'selesai', 1), (8, 7, '2025-01-22', 'selesai', 1), (8, 8, '2025-01-22', 'selesai', 1),

-- Program 9: Bantuan Laptop untuk Siswa - 5 penerima
(9, 2, '2025-01-08', 'menunggu', 1), (9, 3, '2025-01-08', 'menunggu', 1), (9, 5, '2025-01-08', 'menunggu', 1), 
(9, 7, '2025-01-08', 'menunggu', 1), (9, 8, '2025-01-08', 'menunggu', 1),

-- Program 10: Berbagi Takjil Ramadan - 6 penerima
(10, 1, '2025-03-12', 'menunggu', 1), (10, 2, '2025-03-12', 'menunggu', 1), (10, 4, '2025-03-12', 'menunggu', 1),
(10, 6, '2025-03-12', 'menunggu', 1), (10, 7, '2025-03-12', 'menunggu', 1), (10, 8, '2025-03-12', 'menunggu', 1);

-- ================================================
-- 7. TRANSAKSI PENYALURAN
-- ================================================
-- CATATAN: Schema memerlukan: tanggal_penyaluran, jam_penyaluran, jumlah_diterima, metode_penyaluran (transfer/barang)
INSERT INTO `transaksi_penyaluran` (`id_penerima_program`, `tanggal_penyaluran`, `jam_penyaluran`, `lokasi_penyaluran`, `jumlah_diterima`, `metode_penyaluran`, `catatan`) VALUES
-- Penyaluran untuk Program 1 (Sembako Ramadan) - 3 sudah selesai
(1, '2025-02-15', '09:00:00', 'Kantor Desa Sejahtera', 1.00, 'barang', 'Penyaluran Tahap 1 - 1 paket sembako'),
(2, '2025-02-15', '09:15:00', 'Kantor Desa Sejahtera', 1.00, 'barang', 'Penyaluran Tahap 1 - 1 paket sembako'),
(3, '2025-02-20', '10:00:00', 'Kantor Desa Sejahtera', 1.00, 'barang', 'Penyaluran Tahap 1 - 1 paket sembako'),

-- Penyaluran untuk Program 2 (Beasiswa) - 2 sudah selesai
(9, '2025-02-01', '14:00:00', 'Kantor Desa Sejahtera', 500000.00, 'transfer', 'Transfer beasiswa semester 1 - Rp 500.000'),
(10, '2025-02-01', '14:30:00', 'Kantor Desa Sejahtera', 500000.00, 'transfer', 'Transfer beasiswa semester 1 - Rp 500.000'),

-- Penyaluran untuk Program 8 (Bantuan Banjir - SELESAI) - Semua sudah tersalurkan
(32, '2025-01-25', '08:00:00', 'Posko Banjir RT 01', 1.00, 'barang', 'Bantuan darurat paket sembako dan pakaian'),
(33, '2025-01-25', '08:30:00', 'Posko Banjir RT 01', 1.00, 'barang', 'Bantuan darurat paket sembako dan pakaian'),
(34, '2025-01-25', '09:00:00', 'Posko Banjir RT 02', 1.00, 'barang', 'Bantuan darurat paket sembako dan pakaian'),
(35, '2025-01-25', '09:30:00', 'Posko Banjir RT 02', 1.00, 'barang', 'Bantuan darurat paket sembako dan pakaian'),
(36, '2025-01-26', '08:00:00', 'Posko Banjir RT 03', 1.00, 'barang', 'Bantuan darurat paket sembako dan pakaian'),
(37, '2025-01-26', '08:30:00', 'Posko Banjir RT 03', 1.00, 'barang', 'Bantuan darurat paket sembako dan pakaian'),
(38, '2025-01-26', '09:00:00', 'Posko Banjir RT 04', 1.00, 'barang', 'Bantuan darurat paket sembako dan pakaian'),
(39, '2025-01-26', '09:30:00', 'Posko Banjir RT 04', 1.00, 'barang', 'Bantuan darurat paket sembako dan pakaian');

-- ================================================
-- SUMMARY STATISTIK
-- ================================================
-- Total Admin: 2
-- Total Kategori: 5
-- Total Donatur: 5
-- Total Penerima: 10 (8 disetujui, 2 pending)
-- Total Program: 10 (9 aktif, 1 selesai)
-- Total Assignment: 56
-- Total Transaksi: 13 (13 selesai)

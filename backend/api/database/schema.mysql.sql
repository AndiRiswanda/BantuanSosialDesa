-- MySQL schema for Bantuan Sosial Desa
-- Engine: InnoDB, Charset: utf8mb4
-- MySQL 8.0+ recommended

-- Safety: create database and switch
CREATE DATABASE IF NOT EXISTS `bantuan_sosial_desa`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `bantuan_sosial_desa`;

-- Re-runnable: drop tables in dependency order (children first)
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `transaksi_penyaluran`;
DROP TABLE IF EXISTS `laporan_transparansi`;
DROP TABLE IF EXISTS `kriteria_penerima`;
DROP TABLE IF EXISTS `penerima_program`;
DROP TABLE IF EXISTS `program_bantuan`;
DROP TABLE IF EXISTS `kategori_bantuan`;
DROP TABLE IF EXISTS `dokumen_verifikasi`;
DROP TABLE IF EXISTS `penerima`;
DROP TABLE IF EXISTS `donatur`;
DROP TABLE IF EXISTS `user_admin`;
SET FOREIGN_KEY_CHECKS = 1;

-- Tabel: penerima
CREATE TABLE `penerima` (
  `id_penerima` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `no_kk` VARCHAR(20) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `nama_kepala` VARCHAR(100) NOT NULL,
  `alamat` TEXT NULL,
  `nomor_telepon` VARCHAR(15) NULL,
  `pekerjaan` VARCHAR(100) NULL,
  `pekerjaan_istri` ENUM('ibu rumah tangga', 'bekerja & berpenghasilan', 'belum menikah', 'kepala keluarga') NULL,
  `status_anak` ENUM('belum punya', 'bayi', 'sekolah', 'bekerja', 'tidak bekerja') NULL,
  `jumlah_tanggungan` INT NULL DEFAULT 0,
  `penghasilan` ENUM('< 500.000', '500.000 - 1.000.000', '1.000.001 - 2.000.000', '2.000.001 - 3.000.000', '> 3.000.000') NULL,
  `status_verifikasi` ENUM('pending', 'disetujui', 'ditolak') NOT NULL DEFAULT 'pending',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_penerima`),
  UNIQUE KEY `uk_penerima_no_kk` (`no_kk`),
  KEY `idx_penerima_status_verifikasi` (`status_verifikasi`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: dokumen_verifikasi (uploads) - child of penerima
CREATE TABLE `dokumen_verifikasi` (
  `id_dokumen` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_penerima` INT UNSIGNED NOT NULL,
  `jenis_dokumen` VARCHAR(50) NOT NULL,
  `nama_file` VARCHAR(255) NOT NULL,
  `path_file` VARCHAR(500) NOT NULL,
  `ukuran_file` INT NULL,
  `tanggal_upload` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_dokumen`),
  KEY `idx_dokumen_id_penerima` (`id_penerima`),
  CONSTRAINT `fk_dokumen_penerima`
    FOREIGN KEY (`id_penerima`) REFERENCES `penerima`(`id_penerima`)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: donatur
CREATE TABLE `donatur` (
  `id_donatur` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama_organisasi` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `alamat` TEXT NULL,
  `nomor_telepon` VARCHAR(15) NULL,
  `jenis_instansi` ENUM('perusahaan', 'yayasan', 'perorangan') NOT NULL,
  `status` ENUM('aktif', 'nonaktif') NOT NULL DEFAULT 'aktif',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_donatur`),
  UNIQUE KEY `uk_donatur_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: kategori_bantuan
CREATE TABLE `kategori_bantuan` (
  `id_kategori` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nama_kategori` VARCHAR(100) NOT NULL,
  `deskripsi` TEXT NULL,
  `jenis_bantuan` ENUM('uang', 'barang') NOT NULL,
  `status` ENUM('aktif', 'nonaktif') NOT NULL DEFAULT 'aktif',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_kategori`),
  UNIQUE KEY `uk_kategori_nama` (`nama_kategori`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: program_bantuan (child of kategori_bantuan, donatur)
CREATE TABLE `program_bantuan` (
  `id_program` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_kategori` INT UNSIGNED NOT NULL,
  `id_donatur` INT UNSIGNED NOT NULL,
  `nama_program` VARCHAR(150) NOT NULL,
  `deskripsi` TEXT NULL,
  `tanggal_mulai` DATE NOT NULL,
  `tanggal_selesai` DATE NULL,
  `jenis_bantuan` ENUM('uang', 'barang') NOT NULL,
  `jumlah_bantuan` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
  `kriteria_penerima` TEXT NULL,
  `keterangan` TEXT NULL,
  `status` ENUM('aktif', 'selesai', 'ditunda') NOT NULL DEFAULT 'aktif',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_program`),
  KEY `idx_program_id_kategori` (`id_kategori`),
  KEY `idx_program_id_donatur` (`id_donatur`),
  CONSTRAINT `fk_program_kategori`
    FOREIGN KEY (`id_kategori`) REFERENCES `kategori_bantuan`(`id_kategori`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_program_donatur`
    FOREIGN KEY (`id_donatur`) REFERENCES `donatur`(`id_donatur`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `chk_program_tanggal`
    CHECK (`tanggal_selesai` IS NULL OR `tanggal_selesai` >= `tanggal_mulai`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: user_admin
CREATE TABLE `user_admin` (
  `id_admin` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(50) NOT NULL,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(100) NULL,
  `nomor_telepon` VARCHAR(15) NULL,
  `role` ENUM('admin') NOT NULL DEFAULT 'admin',
  `status` ENUM('active', 'inactive') NOT NULL DEFAULT 'active',
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_admin`),
  UNIQUE KEY `uk_admin_username` (`username`),
  UNIQUE KEY `uk_admin_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: penerima_program (bridge Program_Bantuan x Penerima) + audit created_by (Admin)
CREATE TABLE `penerima_program` (
  `id_penerima_program` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_program` INT UNSIGNED NOT NULL,
  `id_penerima` INT UNSIGNED NOT NULL,
  `tanggal_penetapan` DATE NOT NULL,
  `status_penerimaan` ENUM('menunggu', 'selesai', 'batal') NOT NULL DEFAULT 'menunggu',
  `created_by` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_penerima_program`),
  UNIQUE KEY `uk_penerima_program_unique` (`id_program`, `id_penerima`),
  KEY `idx_pp_id_program` (`id_program`),
  KEY `idx_pp_id_penerima` (`id_penerima`),
  KEY `idx_pp_created_by` (`created_by`),
  CONSTRAINT `fk_pp_program`
    FOREIGN KEY (`id_program`) REFERENCES `program_bantuan`(`id_program`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_pp_penerima`
    FOREIGN KEY (`id_penerima`) REFERENCES `penerima`(`id_penerima`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_pp_admin`
    FOREIGN KEY (`created_by`) REFERENCES `user_admin`(`id_admin`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: transaksi_penyaluran (child of penerima_program)
CREATE TABLE `transaksi_penyaluran` (
  `id_transaksi` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_penerima_program` INT UNSIGNED NOT NULL,
  `tanggal_penyaluran` DATE NOT NULL,
  `jam_penyaluran` TIME NOT NULL,
  `lokasi_penyaluran` VARCHAR(200) NULL,
  `jumlah_diterima` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `metode_penyaluran` ENUM('transfer', 'barang') NOT NULL,
  `bukti_penyaluran` VARCHAR(255) NULL,
  `catatan` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_transaksi`),
  KEY `idx_transaksi_id_pp` (`id_penerima_program`),
  KEY `idx_transaksi_tanggal` (`tanggal_penyaluran`),
  CONSTRAINT `fk_transaksi_pp`
    FOREIGN KEY (`id_penerima_program`) REFERENCES `penerima_program`(`id_penerima_program`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: laporan_transparansi (child of program_bantuan, user_admin)
CREATE TABLE `laporan_transparansi` (
  `id_laporan` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_program` INT UNSIGNED NOT NULL,
  `judul_laporan` VARCHAR(200) NOT NULL,
  `isi_laporan` TEXT NULL,
  `dokumentasi` TEXT NULL,
  `tanggal_publikasi` DATE NOT NULL,
  `created_by` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_laporan`),
  KEY `idx_laporan_id_program` (`id_program`),
  KEY `idx_laporan_created_by` (`created_by`),
  CONSTRAINT `fk_laporan_program`
    FOREIGN KEY (`id_program`) REFERENCES `program_bantuan`(`id_program`)
    ON UPDATE CASCADE ON DELETE RESTRICT,
  CONSTRAINT `fk_laporan_admin`
    FOREIGN KEY (`created_by`) REFERENCES `user_admin`(`id_admin`)
    ON UPDATE CASCADE ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel: kriteria_penerima (child of program_bantuan)
CREATE TABLE `kriteria_penerima` (
  `id_kriteria` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `id_program` INT UNSIGNED NOT NULL,
  `nama_kriteria` VARCHAR(100) NOT NULL,
  `deskripsi` TEXT NULL,
  `nilai_minimum` DECIMAL(10,2) NULL,
  `nilai_maksimum` DECIMAL(10,2) NULL,
  PRIMARY KEY (`id_kriteria`),
  KEY `idx_kriteria_id_program` (`id_program`),
  CONSTRAINT `fk_kriteria_program`
    FOREIGN KEY (`id_program`) REFERENCES `program_bantuan`(`id_program`)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT `chk_kriteria_range`
    CHECK (`nilai_minimum` IS NULL OR `nilai_maksimum` IS NULL OR `nilai_minimum` <= `nilai_maksimum`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notes:
-- 1) Uniqueness enforced for: penerima.no_kk, donatur.email, user_admin.username, user_admin.email, kategori_bantuan.nama_kategori.
-- 2) Delete behaviors: documents cascade with penerima; most other children restrict deletes to preserve audit history.
--    Adjust to CASCADE if you prefer automatic cleanup on parent deletion.
-- 3) CHECK constraints require MySQL 8.0.16+ to be enforced.
-- 4) Consider additional indexes based on query patterns (e.g., status fields, created_at ranges).

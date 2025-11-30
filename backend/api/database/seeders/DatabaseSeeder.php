<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;

class DatabaseSeeder extends Seeder
{
    /**
     * Helper untuk insert data sekaligus mengisi created_at & updated_at otomatis.
     */
    private function insertData(string $table, array $data)
    {
        $now = now();
        $dataWithTimestamps = array_map(function ($row) use ($now) {
            return array_merge($row, [
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }, $data);

        DB::table($table)->insert($dataWithTimestamps);
    }

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        Schema::disableForeignKeyConstraints();

        // Kosongkan tabel
        DB::table('transaksi_penyaluran')->truncate();
        DB::table('penerima_program')->truncate();
        DB::table('program_bantuan')->truncate();
        DB::table('penerima')->truncate();
        DB::table('donatur')->truncate();
        DB::table('kategori_bantuan')->truncate();
        DB::table('user_admin')->truncate();

        // ================================================
        // 1. ADMIN
        // ================================================
        $this->insertData('user_admin', [
            [
                'id_admin' => 1,
                'username' => 'admin',
                'email' => 'admin@desa.id',
                'password' => Hash::make('admin123'),
                'full_name' => 'Administrator Desa',
                'nomor_telepon' => '0812-3456-7890',
                'role' => 'admin',
                'status' => 'active',
            ],
            [
                'id_admin' => 2,
                'username' => 'kepala_desa',
                'email' => 'kepaladesa@desa.id',
                'password' => Hash::make('admin123'),
                'full_name' => 'Kepala Desa Sejahtera',
                'nomor_telepon' => '0813-9876-5432',
                'role' => 'admin',
                'status' => 'active',
            ],
        ]);

        // ================================================
        // 2. KATEGORI BANTUAN
        // ================================================
        $this->insertData('kategori_bantuan', [
            ['id_kategori' => 1, 'nama_kategori' => 'Pangan & Sembako', 'deskripsi' => 'Bantuan bahan makanan pokok untuk kebutuhan sehari-hari', 'jenis_bantuan' => 'barang', 'status' => 'aktif'],
            ['id_kategori' => 2, 'nama_kategori' => 'Pendidikan', 'deskripsi' => 'Bantuan biaya pendidikan untuk siswa kurang mampu', 'jenis_bantuan' => 'uang', 'status' => 'aktif'],
            ['id_kategori' => 3, 'nama_kategori' => 'Kesehatan', 'deskripsi' => 'Bantuan biaya pengobatan dan alat kesehatan', 'jenis_bantuan' => 'uang', 'status' => 'aktif'],
            ['id_kategori' => 4, 'nama_kategori' => 'Bencana Alam', 'deskripsi' => 'Bantuan untuk korban bencana alam', 'jenis_bantuan' => 'barang', 'status' => 'aktif'],
            ['id_kategori' => 5, 'nama_kategori' => 'Perumahan', 'deskripsi' => 'Bantuan renovasi atau pembangunan rumah layak huni', 'jenis_bantuan' => 'uang', 'status' => 'aktif'],
        ]);

        // ================================================
        // 3. DONATUR
        // ================================================
        $passwordDonatur = Hash::make('donatur123');
        $this->insertData('donatur', [
            [
                'id_donatur' => 1,
                'nama_organisasi' => 'Yayasan Peduli Desa',
                'email' => 'yayasan@peduli.id',
                'password' => $passwordDonatur,
                'alamat' => 'Jl. Raya Desa No. 123, Jakarta Selatan',
                'nomor_telepon' => '021-12345678',
                'jenis_instansi' => 'yayasan',
                'status' => 'aktif',
            ],
            [
                'id_donatur' => 2,
                'nama_organisasi' => 'PT Maju Sejahtera',
                'email' => 'csr@majusejahtera.co.id',
                'password' => $passwordDonatur,
                'alamat' => 'Jl. Industri No. 45, Tangerang',
                'nomor_telepon' => '021-87654321',
                'jenis_instansi' => 'perusahaan',
                'status' => 'aktif',
            ],
            [
                'id_donatur' => 3,
                'nama_organisasi' => 'Masjid Al-Ikhlas',
                'email' => 'masjid@alikhlas.id',
                'password' => $passwordDonatur,
                'alamat' => 'Jl. Masjid Raya No. 10, Depok',
                'nomor_telepon' => '021-55556666',
                'jenis_instansi' => 'yayasan',
                'status' => 'aktif',
            ],
            [
                'id_donatur' => 4,
                'nama_organisasi' => 'Komunitas Berbagi',
                'email' => 'admin@komunitasberbagi.org',
                'password' => $passwordDonatur,
                'alamat' => 'Jl. Kemanusiaan No. 77, Bogor',
                'nomor_telepon' => '0251-123456',
                'jenis_instansi' => 'yayasan',
                'status' => 'aktif',
            ],
            [
                'id_donatur' => 5,
                'nama_organisasi' => 'Donatur Individu - Budi Santoso',
                'email' => 'budi.santoso@email.com',
                'password' => $passwordDonatur,
                'alamat' => 'Jl. Harmoni No. 88, Bekasi',
                'nomor_telepon' => '0812-3456-7890',
                'jenis_instansi' => 'perorangan',
                'status' => 'aktif',
            ],
        ]);

        // ================================================
        // 4. PENERIMA
        // ================================================
        $passwordPenerima = Hash::make('penerima123');
        $this->insertData('penerima', [
            [
                'id_penerima' => 1,
                'no_kk' => '3601012501250001',
                'password' => $passwordPenerima,
                'nama_kepala' => 'Ahmad Dahlan',
                'alamat' => 'Jl. Melati No. 12, RT 01/02, Desa Sejahtera',
                'nomor_telepon' => '0812-1111-2222',
                'pekerjaan' => 'Buruh Harian',
                'pekerjaan_istri' => 'Ibu Rumah Tangga (IRT)',
                'status_anak' => 'SD',
                'jumlah_tanggungan' => 4,
                'penghasilan' => '< Rp 500.000', 
                'status_verifikasi' => 'disetujui',
            ],
            [
                'id_penerima' => 2,
                'no_kk' => '3601012501250002',
                'password' => $passwordPenerima,
                'nama_kepala' => 'Siti Aminah',
                'alamat' => 'Jl. Mawar No. 8, RT 02/03, Desa Sejahtera',
                'nomor_telepon' => '0813-2222-3333',
                'pekerjaan' => 'Pedagang',
                'pekerjaan_istri' => 'Pedagang',
                'status_anak' => 'SMP',
                'jumlah_tanggungan' => 3,
                'penghasilan' => 'Rp 500.000 - Rp 1.000.000',
                'status_verifikasi' => 'disetujui',
            ],
            [
                'id_penerima' => 3,
                'no_kk' => '3601012501250003',
                'password' => $passwordPenerima,
                'nama_kepala' => 'Budi Santoso',
                'alamat' => 'Jl. Kenanga No. 5, RT 03/03, Desa Sejahtera',
                'nomor_telepon' => '0814-3333-4444',
                'pekerjaan' => 'Buruh Harian',
                'pekerjaan_istri' => 'Ibu Rumah Tangga (IRT)',
                'status_anak' => 'SD',
                'jumlah_tanggungan' => 5,
                'penghasilan' => 'Rp 500.000 - Rp 1.000.000',
                'status_verifikasi' => 'disetujui',
            ],
            [
                'id_penerima' => 4,
                'no_kk' => '3601012501250004',
                'password' => $passwordPenerima,
                'nama_kepala' => 'Ratna Dewi',
                'alamat' => 'Jl. Anggrek No. 15, RT 01/02, Desa Sejahtera',
                'nomor_telepon' => '0815-4444-5555',
                'pekerjaan' => 'Wiraswasta',
                'pekerjaan_istri' => 'Tidak bekerja',
                'status_anak' => 'SMA/SMK',
                'jumlah_tanggungan' => 2,
                'penghasilan' => '< Rp 500.000',
                'status_verifikasi' => 'disetujui',
            ],
            [
                'id_penerima' => 5,
                'no_kk' => '3601012501250005',
                'password' => $passwordPenerima,
                'nama_kepala' => 'Joko Widodo',
                'alamat' => 'Jl. Flamboyan No. 20, RT 04/01, Desa Sejahtera',
                'nomor_telepon' => '0816-5555-6666',
                'pekerjaan' => 'Petani',
                'pekerjaan_istri' => 'Ibu Rumah Tangga (IRT)',
                'status_anak' => 'Belum sekolah',
                'jumlah_tanggungan' => 3,
                'penghasilan' => 'Rp 500.000 - Rp 1.000.000',
                'status_verifikasi' => 'disetujui',
            ],
            [
                'id_penerima' => 6,
                'no_kk' => '3601012501250006',
                'password' => $passwordPenerima,
                'nama_kepala' => 'Dewi Lestari',
                'alamat' => 'Jl. Dahlia No. 7, RT 02/01, Desa Sejahtera',
                'nomor_telepon' => '0817-6666-7777',
                'pekerjaan' => 'Buruh Harian',
                'pekerjaan_istri' => 'Tidak bekerja',
                'status_anak' => 'Putus sekolah',
                'jumlah_tanggungan' => 4,
                'penghasilan' => '< Rp 500.000',
                'status_verifikasi' => 'disetujui',
            ],
            [
                'id_penerima' => 7,
                'no_kk' => '3601012501250007',
                'password' => $passwordPenerima,
                'nama_kepala' => 'Agus Salim',
                'alamat' => 'Jl. Bougenville No. 33, RT 05/02, Desa Sejahtera',
                'nomor_telepon' => '0818-7777-8888',
                'pekerjaan' => 'Karyawan Swasta',
                'pekerjaan_istri' => 'Ibu Rumah Tangga (IRT)',
                'status_anak' => 'SD',
                'jumlah_tanggungan' => 3,
                'penghasilan' => 'Rp 500.000 - Rp 1.000.000',
                'status_verifikasi' => 'disetujui',
            ],
            [
                'id_penerima' => 8,
                'no_kk' => '3601012501250008',
                'password' => $passwordPenerima,
                'nama_kepala' => 'Nur Halimah',
                'alamat' => 'Jl. Sakura No. 18, RT 03/02, Desa Sejahtera',
                'nomor_telepon' => '0819-8888-9999',
                'pekerjaan' => 'Pedagang',
                'pekerjaan_istri' => 'Tidak bekerja',
                'status_anak' => 'SMP',
                'jumlah_tanggungan' => 2,
                'penghasilan' => '< Rp 500.000',
                'status_verifikasi' => 'disetujui',
            ],
            [
                'id_penerima' => 9,
                'no_kk' => '3601012501250009',
                'password' => $passwordPenerima,
                'nama_kepala' => 'Rina Susanti',
                'alamat' => 'Jl. Teratai No. 9, RT 01/03, Desa Sejahtera',
                'nomor_telepon' => '0811-9999-0000',
                'pekerjaan' => 'Buruh Harian',
                'pekerjaan_istri' => 'Ibu Rumah Tangga (IRT)',
                'status_anak' => 'SD',
                'jumlah_tanggungan' => 4,
                'penghasilan' => 'Rp 1.000.000 - Rp 2.000.000',
                'status_verifikasi' => 'pending',
            ],
            [
                'id_penerima' => 10,
                'no_kk' => '3601012501250010',
                'password' => $passwordPenerima,
                'nama_kepala' => 'Hendra Wijaya',
                'alamat' => 'Jl. Tulip No. 25, RT 04/02, Desa Sejahtera',
                'nomor_telepon' => '0812-0000-1111',
                'pekerjaan' => 'Wiraswasta',
                'pekerjaan_istri' => 'Pedagang',
                'status_anak' => 'SMA/SMK',
                'jumlah_tanggungan' => 3,
                'penghasilan' => 'Rp 1.000.000 - Rp 2.000.000',
                'status_verifikasi' => 'pending',
            ],
        ]);

        // ================================================
        // 5. PROGRAM BANTUAN
        // ================================================
        $this->insertData('program_bantuan', [
            // Yayasan Peduli Desa
            [
                'id_program' => 1,
                'id_kategori' => 1,
                'id_donatur' => 1,
                'nama_program' => 'Bantuan Sembako Ramadan 2025',
                'deskripsi' => 'Program bantuan paket sembako untuk keluarga prasejahtera menyambut bulan Ramadan 2025.',
                'tanggal_mulai' => '2025-02-01',
                'tanggal_selesai' => '2025-03-31',
                'jenis_bantuan' => 'barang',
                'jumlah_bantuan' => 150,
                'kriteria_penerima' => 'Keluarga prasejahtera.',
                'keterangan' => 'Target 150 paket.',
                'status' => 'aktif',
                'bukti_transfer' => null
            ],
            [
                'id_program' => 2,
                'id_kategori' => 2,
                'id_donatur' => 1,
                'nama_program' => 'Beasiswa Siswa Berprestasi 2025',
                'deskripsi' => 'Bantuan biaya pendidikan untuk siswa SD-SMA.',
                'tanggal_mulai' => '2025-01-15',
                'tanggal_selesai' => '2025-12-31',
                'jenis_bantuan' => 'uang',
                'jumlah_bantuan' => 50000000,
                'kriteria_penerima' => 'Siswa aktif SD/SMP/SMA.',
                'keterangan' => 'Total 50 siswa.',
                'status' => 'aktif',
                'bukti_transfer' => null
            ],
            // PT Maju Sejahtera
            [
                'id_program' => 3,
                'id_kategori' => 3,
                'id_donatur' => 2,
                'nama_program' => 'Bantuan Biaya Kesehatan Lansia',
                'deskripsi' => 'Program CSR untuk lansia.',
                'tanggal_mulai' => '2025-01-01',
                'tanggal_selesai' => '2025-06-30',
                'jenis_bantuan' => 'uang',
                'jumlah_bantuan' => 30000000,
                'kriteria_penerima' => 'Lansia berusia 60 tahun ke atas.',
                'keterangan' => 'Target 30 lansia.',
                'status' => 'aktif',
                'bukti_transfer' => null
            ],
            [
                'id_program' => 4,
                'id_kategori' => 1,
                'id_donatur' => 2,
                'nama_program' => 'Paket Makanan Bergizi untuk Balita',
                'deskripsi' => 'Cegah stunting.',
                'tanggal_mulai' => '2025-02-15',
                'tanggal_selesai' => '2025-08-15',
                'jenis_bantuan' => 'barang',
                'jumlah_bantuan' => 200,
                'kriteria_penerima' => 'Keluarga dengan balita.',
                'keterangan' => 'Target 200 paket.',
                'status' => 'aktif',
                'bukti_transfer' => null
            ],
            // Masjid Al-Ikhlas
            [
                'id_program' => 5,
                'id_kategori' => 1,
                'id_donatur' => 3,
                'nama_program' => 'Bantuan Pangan Ramadan',
                'deskripsi' => 'Sembako dan zakat.',
                'tanggal_mulai' => '2025-03-01',
                'tanggal_selesai' => '2025-04-15',
                'jenis_bantuan' => 'barang',
                'jumlah_bantuan' => 100,
                'kriteria_penerima' => 'Mustahik.',
                'keterangan' => 'Tradisi tahunan.',
                'status' => 'aktif',
                'bukti_transfer' => null
            ],
            [
                'id_program' => 6,
                'id_kategori' => 2,
                'id_donatur' => 3,
                'nama_program' => 'Beasiswa Tahfidz Quran',
                'deskripsi' => 'Untuk penghafal Al-Quran.',
                'tanggal_mulai' => '2025-01-10',
                'tanggal_selesai' => '2025-12-20',
                'jenis_bantuan' => 'uang',
                'jumlah_bantuan' => 20000000,
                'kriteria_penerima' => 'Anak 7-17 tahun.',
                'keterangan' => 'Target 20 santri.',
                'status' => 'aktif',
                'bukti_transfer' => null
            ],
            // Komunitas Berbagi
            [
                'id_program' => 7,
                'id_kategori' => 5,
                'id_donatur' => 4,
                'nama_program' => 'Renovasi Rumah Tidak Layak Huni',
                'deskripsi' => 'Renovasi RTLH.',
                'tanggal_mulai' => '2025-03-01',
                'tanggal_selesai' => '2025-10-31',
                'jenis_bantuan' => 'uang',
                'jumlah_bantuan' => 100000000,
                'kriteria_penerima' => 'Rumah RTLH.',
                'keterangan' => 'Target 10 rumah.',
                'status' => 'aktif',
                'bukti_transfer' => null
            ],
            [
                'id_program' => 8,
                'id_kategori' => 4,
                'id_donatur' => 4,
                'nama_program' => 'Bantuan Korban Banjir 2025',
                'deskripsi' => 'Darurat banjir.',
                'tanggal_mulai' => '2025-01-20',
                'tanggal_selesai' => '2025-02-28',
                'jenis_bantuan' => 'barang',
                'jumlah_bantuan' => 300,
                'kriteria_penerima' => 'Terdampak banjir.',
                'keterangan' => 'Selesai.',
                'status' => 'selesai',
                'bukti_transfer' => null
            ],
            // Donatur Individu
            [
                'id_program' => 9,
                'id_kategori' => 2,
                'id_donatur' => 5,
                'nama_program' => 'Bantuan Laptop untuk Siswa',
                'deskripsi' => 'Laptop bekas layak pakai.',
                'tanggal_mulai' => '2025-01-05',
                'tanggal_selesai' => '2025-03-31',
                'jenis_bantuan' => 'barang',
                'jumlah_bantuan' => 15,
                'kriteria_penerima' => 'Siswa SMP/SMA.',
                'keterangan' => 'Target 15 unit.',
                'status' => 'aktif',
                'bukti_transfer' => null
            ],
            [
                'id_program' => 10,
                'id_kategori' => 1,
                'id_donatur' => 5,
                'nama_program' => 'Berbagi Takjil Ramadan',
                'deskripsi' => 'Takjil gratis.',
                'tanggal_mulai' => '2025-03-10',
                'tanggal_selesai' => '2025-04-10',
                'jenis_bantuan' => 'barang',
                'jumlah_bantuan' => 1000,
                'kriteria_penerima' => 'Masyarakat umum.',
                'keterangan' => 'Target 1000 porsi.',
                'status' => 'aktif',
                'bukti_transfer' => null
            ],
            // PENDING Programs
            [
                'id_program' => 11,
                'id_kategori' => 1,
                'id_donatur' => 1,
                'nama_program' => 'Bantuan Sembako Hari Raya 2026',
                'deskripsi' => 'Persiapan tahun depan.',
                'tanggal_mulai' => '2026-03-15',
                'tanggal_selesai' => '2026-04-30',
                'jenis_bantuan' => 'barang',
                'jumlah_bantuan' => 200,
                'kriteria_penerima' => 'Prasejahtera.',
                'keterangan' => 'Menunggu.',
                'status' => 'pending',
                'bukti_transfer' => null
            ],
            [
                'id_program' => 12,
                'id_kategori' => 2,
                'id_donatur' => 2,
                'nama_program' => 'Beasiswa Kuliah Tahun 2025',
                'deskripsi' => 'Biaya kuliah.',
                'tanggal_mulai' => '2025-08-01',
                'tanggal_selesai' => '2026-06-30',
                'jenis_bantuan' => 'uang',
                'jumlah_bantuan' => 100000000,
                'kriteria_penerima' => 'Lulusan SMA.',
                'keterangan' => 'Menunggu.',
                'status' => 'pending',
                'bukti_transfer' => '/storage/bukti_transfer/sample.jpg'
            ],
            [
                'id_program' => 13,
                'id_kategori' => 3,
                'id_donatur' => 3,
                'nama_program' => 'Program Pengobatan Gratis',
                'deskripsi' => 'Kesehatan gratis.',
                'tanggal_mulai' => '2025-06-01',
                'tanggal_selesai' => '2025-12-31',
                'jenis_bantuan' => 'uang',
                'jumlah_bantuan' => 50000000,
                'kriteria_penerima' => 'KIS.',
                'keterangan' => 'Menunggu.',
                'status' => 'pending',
                'bukti_transfer' => null
            ],
        ]);

        // ================================================
        // 6. PENERIMA PROGRAM (Assignment)
        // ================================================
        $this->insertData('penerima_program', [
            // Program 1: Bantuan Sembako Ramadan 2025
            ['id_penerima_program' => 1, 'id_program' => 1, 'id_penerima' => 1, 'tanggal_penetapan' => '2025-02-10', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 2, 'id_program' => 1, 'id_penerima' => 2, 'tanggal_penetapan' => '2025-02-10', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 3, 'id_program' => 1, 'id_penerima' => 3, 'tanggal_penetapan' => '2025-02-10', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 4, 'id_program' => 1, 'id_penerima' => 4, 'tanggal_penetapan' => '2025-02-10', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 5, 'id_program' => 1, 'id_penerima' => 5, 'tanggal_penetapan' => '2025-02-10', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 6, 'id_program' => 1, 'id_penerima' => 6, 'tanggal_penetapan' => '2025-02-10', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 7, 'id_program' => 1, 'id_penerima' => 7, 'tanggal_penetapan' => '2025-02-10', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 8, 'id_program' => 1, 'id_penerima' => 8, 'tanggal_penetapan' => '2025-02-10', 'status_penerimaan' => 'menunggu', 'created_by' => 1],

            // Program 2: Beasiswa Siswa Berprestasi 2025
            ['id_penerima_program' => 9, 'id_program' => 2, 'id_penerima' => 1, 'tanggal_penetapan' => '2025-01-20', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 10, 'id_program' => 2, 'id_penerima' => 2, 'tanggal_penetapan' => '2025-01-20', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 11, 'id_program' => 2, 'id_penerima' => 3, 'tanggal_penetapan' => '2025-01-20', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 12, 'id_program' => 2, 'id_penerima' => 4, 'tanggal_penetapan' => '2025-01-20', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 13, 'id_program' => 2, 'id_penerima' => 5, 'tanggal_penetapan' => '2025-01-20', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 14, 'id_program' => 2, 'id_penerima' => 7, 'tanggal_penetapan' => '2025-01-20', 'status_penerimaan' => 'menunggu', 'created_by' => 1],

            // Program 3: Bantuan Biaya Kesehatan Lansia
            ['id_penerima_program' => 15, 'id_program' => 3, 'id_penerima' => 1, 'tanggal_penetapan' => '2025-01-10', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 16, 'id_program' => 3, 'id_penerima' => 4, 'tanggal_penetapan' => '2025-01-10', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 17, 'id_program' => 3, 'id_penerima' => 6, 'tanggal_penetapan' => '2025-01-10', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 18, 'id_program' => 3, 'id_penerima' => 8, 'tanggal_penetapan' => '2025-01-10', 'status_penerimaan' => 'menunggu', 'created_by' => 1],

            // Program 4: Paket Makanan Bergizi untuk Balita
            ['id_penerima_program' => 19, 'id_program' => 4, 'id_penerima' => 1, 'tanggal_penetapan' => '2025-02-20', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 20, 'id_program' => 4, 'id_penerima' => 3, 'tanggal_penetapan' => '2025-02-20', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 21, 'id_program' => 4, 'id_penerima' => 5, 'tanggal_penetapan' => '2025-02-20', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 22, 'id_program' => 4, 'id_penerima' => 6, 'tanggal_penetapan' => '2025-02-20', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 23, 'id_program' => 4, 'id_penerima' => 8, 'tanggal_penetapan' => '2025-02-20', 'status_penerimaan' => 'menunggu', 'created_by' => 1],

            // Program 5: Bantuan Pangan Ramadan
            ['id_penerima_program' => 24, 'id_program' => 5, 'id_penerima' => 1, 'tanggal_penetapan' => '2025-03-05', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 25, 'id_program' => 5, 'id_penerima' => 2, 'tanggal_penetapan' => '2025-03-05', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 26, 'id_program' => 5, 'id_penerima' => 3, 'tanggal_penetapan' => '2025-03-05', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 27, 'id_program' => 5, 'id_penerima' => 4, 'tanggal_penetapan' => '2025-03-05', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 28, 'id_program' => 5, 'id_penerima' => 6, 'tanggal_penetapan' => '2025-03-05', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 29, 'id_program' => 5, 'id_penerima' => 7, 'tanggal_penetapan' => '2025-03-05', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 30, 'id_program' => 5, 'id_penerima' => 8, 'tanggal_penetapan' => '2025-03-05', 'status_penerimaan' => 'menunggu', 'created_by' => 1],

            // Program 6: Beasiswa Tahfidz Quran
            ['id_penerima_program' => 31, 'id_program' => 6, 'id_penerima' => 2, 'tanggal_penetapan' => '2025-01-15', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 32, 'id_program' => 6, 'id_penerima' => 3, 'tanggal_penetapan' => '2025-01-15', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 33, 'id_program' => 6, 'id_penerima' => 5, 'tanggal_penetapan' => '2025-01-15', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 34, 'id_program' => 6, 'id_penerima' => 7, 'tanggal_penetapan' => '2025-01-15', 'status_penerimaan' => 'menunggu', 'created_by' => 1],

            // Program 7: Renovasi Rumah Tidak Layak Huni
            ['id_penerima_program' => 35, 'id_program' => 7, 'id_penerima' => 1, 'tanggal_penetapan' => '2025-03-10', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 36, 'id_program' => 7, 'id_penerima' => 4, 'tanggal_penetapan' => '2025-03-10', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 37, 'id_program' => 7, 'id_penerima' => 6, 'tanggal_penetapan' => '2025-03-10', 'status_penerimaan' => 'menunggu', 'created_by' => 1],

            // Program 8: Bantuan Korban Banjir 2025 (Status: Selesai)
            ['id_penerima_program' => 38, 'id_program' => 8, 'id_penerima' => 1, 'tanggal_penetapan' => '2025-01-22', 'status_penerimaan' => 'selesai', 'created_by' => 1],
            ['id_penerima_program' => 39, 'id_program' => 8, 'id_penerima' => 2, 'tanggal_penetapan' => '2025-01-22', 'status_penerimaan' => 'selesai', 'created_by' => 1],
            ['id_penerima_program' => 40, 'id_program' => 8, 'id_penerima' => 3, 'tanggal_penetapan' => '2025-01-22', 'status_penerimaan' => 'selesai', 'created_by' => 1],
            ['id_penerima_program' => 41, 'id_program' => 8, 'id_penerima' => 4, 'tanggal_penetapan' => '2025-01-22', 'status_penerimaan' => 'selesai', 'created_by' => 1],
            ['id_penerima_program' => 42, 'id_program' => 8, 'id_penerima' => 5, 'tanggal_penetapan' => '2025-01-22', 'status_penerimaan' => 'selesai', 'created_by' => 1],
            ['id_penerima_program' => 43, 'id_program' => 8, 'id_penerima' => 6, 'tanggal_penetapan' => '2025-01-22', 'status_penerimaan' => 'selesai', 'created_by' => 1],
            ['id_penerima_program' => 44, 'id_program' => 8, 'id_penerima' => 7, 'tanggal_penetapan' => '2025-01-22', 'status_penerimaan' => 'selesai', 'created_by' => 1],
            ['id_penerima_program' => 45, 'id_program' => 8, 'id_penerima' => 8, 'tanggal_penetapan' => '2025-01-22', 'status_penerimaan' => 'selesai', 'created_by' => 1],

            // Program 9: Bantuan Laptop untuk Siswa
            ['id_penerima_program' => 46, 'id_program' => 9, 'id_penerima' => 2, 'tanggal_penetapan' => '2025-01-08', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 47, 'id_program' => 9, 'id_penerima' => 3, 'tanggal_penetapan' => '2025-01-08', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 48, 'id_program' => 9, 'id_penerima' => 5, 'tanggal_penetapan' => '2025-01-08', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 49, 'id_program' => 9, 'id_penerima' => 7, 'tanggal_penetapan' => '2025-01-08', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 50, 'id_program' => 9, 'id_penerima' => 8, 'tanggal_penetapan' => '2025-01-08', 'status_penerimaan' => 'menunggu', 'created_by' => 1],

            // Program 10: Berbagi Takjil Ramadan
            ['id_penerima_program' => 51, 'id_program' => 10, 'id_penerima' => 1, 'tanggal_penetapan' => '2025-03-12', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 52, 'id_program' => 10, 'id_penerima' => 2, 'tanggal_penetapan' => '2025-03-12', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 53, 'id_program' => 10, 'id_penerima' => 4, 'tanggal_penetapan' => '2025-03-12', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 54, 'id_program' => 10, 'id_penerima' => 6, 'tanggal_penetapan' => '2025-03-12', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 55, 'id_program' => 10, 'id_penerima' => 7, 'tanggal_penetapan' => '2025-03-12', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
            ['id_penerima_program' => 56, 'id_program' => 10, 'id_penerima' => 8, 'tanggal_penetapan' => '2025-03-12', 'status_penerimaan' => 'menunggu', 'created_by' => 1],
        ]);

        // ================================================
        // 7. TRANSAKSI PENYALURAN
        // ================================================
        $this->insertData('transaksi_penyaluran', [
            // Penyaluran untuk Program 1 (Sembako Ramadan)
            [
                'id_transaksi' => 1,
                'id_penerima_program' => 1,
                'tanggal_penyaluran' => '2025-02-15',
                'jam_penyaluran' => '09:00:00',
                'lokasi_penyaluran' => 'Kantor Desa Sejahtera',
                'jumlah_diterima' => 1.00,
                'metode_penyaluran' => 'barang',
                'status_penyaluran' => 'selesai',
                'catatan' => 'Penyaluran Tahap 1 - 1 paket sembako',
            ],
            [
                'id_transaksi' => 2,
                'id_penerima_program' => 2,
                'tanggal_penyaluran' => '2025-02-15',
                'jam_penyaluran' => '09:15:00',
                'lokasi_penyaluran' => 'Kantor Desa Sejahtera',
                'jumlah_diterima' => 1.00,
                'metode_penyaluran' => 'barang',
                'status_penyaluran' => 'selesai',
                'catatan' => 'Penyaluran Tahap 1 - 1 paket sembako',
            ],
            [
                'id_transaksi' => 3,
                'id_penerima_program' => 3,
                'tanggal_penyaluran' => '2025-02-20',
                'jam_penyaluran' => '10:00:00',
                'lokasi_penyaluran' => 'Kantor Desa Sejahtera',
                'jumlah_diterima' => 1.00,
                'metode_penyaluran' => 'barang',
                'status_penyaluran' => 'selesai',
                'catatan' => 'Penyaluran Tahap 1 - 1 paket sembako',
            ],

            // Penyaluran untuk Program 2 (Beasiswa)
            [
                'id_transaksi' => 4,
                'id_penerima_program' => 9,
                'tanggal_penyaluran' => '2025-02-01',
                'jam_penyaluran' => '14:00:00',
                'lokasi_penyaluran' => 'Kantor Desa Sejahtera',
                'jumlah_diterima' => 500000.00,
                'metode_penyaluran' => 'transfer',
                'status_penyaluran' => 'selesai',
                'catatan' => 'Transfer beasiswa semester 1 - Rp 500.000',
            ],
            [
                'id_transaksi' => 5,
                'id_penerima_program' => 10,
                'tanggal_penyaluran' => '2025-02-01',
                'jam_penyaluran' => '14:30:00',
                'lokasi_penyaluran' => 'Kantor Desa Sejahtera',
                'jumlah_diterima' => 500000.00,
                'metode_penyaluran' => 'transfer',
                'status_penyaluran' => 'selesai',
                'catatan' => 'Transfer beasiswa semester 1 - Rp 500.000',
            ],

            // Penyaluran untuk Program 8 (Bantuan Banjir - SELESAI)
            [
                'id_transaksi' => 6,
                'id_penerima_program' => 38,
                'tanggal_penyaluran' => '2025-01-25',
                'jam_penyaluran' => '08:00:00',
                'lokasi_penyaluran' => 'Posko Banjir RT 01',
                'jumlah_diterima' => 1.00,
                'metode_penyaluran' => 'barang',
                'status_penyaluran' => 'selesai',
                'catatan' => 'Bantuan darurat paket sembako dan pakaian',
            ],
            [
                'id_transaksi' => 7,
                'id_penerima_program' => 39,
                'tanggal_penyaluran' => '2025-01-25',
                'jam_penyaluran' => '08:30:00',
                'lokasi_penyaluran' => 'Posko Banjir RT 01',
                'jumlah_diterima' => 1.00,
                'metode_penyaluran' => 'barang',
                'status_penyaluran' => 'selesai',
                'catatan' => 'Bantuan darurat paket sembako dan pakaian',
            ],
            [
                'id_transaksi' => 8,
                'id_penerima_program' => 40,
                'tanggal_penyaluran' => '2025-01-25',
                'jam_penyaluran' => '09:00:00',
                'lokasi_penyaluran' => 'Posko Banjir RT 02',
                'jumlah_diterima' => 1.00,
                'metode_penyaluran' => 'barang',
                'status_penyaluran' => 'selesai',
                'catatan' => 'Bantuan darurat paket sembako dan pakaian',
            ],
            [
                'id_transaksi' => 9,
                'id_penerima_program' => 41,
                'tanggal_penyaluran' => '2025-01-25',
                'jam_penyaluran' => '09:30:00',
                'lokasi_penyaluran' => 'Posko Banjir RT 02',
                'jumlah_diterima' => 1.00,
                'metode_penyaluran' => 'barang',
                'status_penyaluran' => 'selesai',
                'catatan' => 'Bantuan darurat paket sembako dan pakaian',
            ],
            [
                'id_transaksi' => 10,
                'id_penerima_program' => 42,
                'tanggal_penyaluran' => '2025-01-26',
                'jam_penyaluran' => '08:00:00',
                'lokasi_penyaluran' => 'Posko Banjir RT 03',
                'jumlah_diterima' => 1.00,
                'metode_penyaluran' => 'barang',
                'status_penyaluran' => 'selesai',
                'catatan' => 'Bantuan darurat paket sembako dan pakaian',
            ],
            [
                'id_transaksi' => 11,
                'id_penerima_program' => 43,
                'tanggal_penyaluran' => '2025-01-26',
                'jam_penyaluran' => '08:30:00',
                'lokasi_penyaluran' => 'Posko Banjir RT 03',
                'jumlah_diterima' => 1.00,
                'metode_penyaluran' => 'barang',
                'status_penyaluran' => 'selesai',
                'catatan' => 'Bantuan darurat paket sembako dan pakaian',
            ],
            [
                'id_transaksi' => 12,
                'id_penerima_program' => 44,
                'tanggal_penyaluran' => '2025-01-26',
                'jam_penyaluran' => '09:00:00',
                'lokasi_penyaluran' => 'Posko Banjir RT 04',
                'jumlah_diterima' => 1.00,
                'metode_penyaluran' => 'barang',
                'status_penyaluran' => 'selesai',
                'catatan' => 'Bantuan darurat paket sembako dan pakaian',
            ],
            [
                'id_transaksi' => 13,
                'id_penerima_program' => 45,
                'tanggal_penyaluran' => '2025-01-26',
                'jam_penyaluran' => '09:30:00',
                'lokasi_penyaluran' => 'Posko Banjir RT 04',
                'jumlah_diterima' => 1.00,
                'metode_penyaluran' => 'barang',
                'status_penyaluran' => 'selesai',
                'catatan' => 'Bantuan darurat paket sembako dan pakaian',
            ],
        ]);

        Schema::enableForeignKeyConstraints();
    }
}
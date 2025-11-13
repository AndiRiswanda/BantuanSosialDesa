<?php

namespace Database\Seeders;

use App\Models\Donatur;
use App\Models\KategoriBantuan;
use App\Models\Penerima;
use App\Models\PenerimaProgram;
use App\Models\ProgramBantuan;
use App\Models\UserAdmin;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create an admin account
        $admin = UserAdmin::create([
            'username' => 'admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin123'),
            'full_name' => 'System Admin',
            'nomor_telepon' => '081234567890',
            'role' => 'admin',
            'status' => 'active',
        ]);

        // Create some donors (donatur)
        $donor1 = Donatur::create([
            'nama_organisasi' => 'Yayasan Peduli A',
            'email' => 'donor1@example.com',
            'password' => Hash::make('donor123'),
            'alamat' => 'Jl. Mawar 1',
            'nomor_telepon' => '081100000001',
            'jenis_instansi' => 'yayasan',
            'status' => 'aktif',
        ]);

        $donor2 = Donatur::create([
            'nama_organisasi' => 'PT Donasi Bersama',
            'email' => 'donor2@example.com',
            'password' => Hash::make('donor123'),
            'alamat' => 'Jl. Melati 2',
            'nomor_telepon' => '081100000002',
            'jenis_instansi' => 'perusahaan',
            'status' => 'aktif',
        ]);

        // Categories
        $kat1 = KategoriBantuan::create([
            'nama_kategori' => 'Sembako',
            'deskripsi' => 'Bantuan sembilan bahan pokok',
            'jenis_bantuan' => 'barang',
            'status' => 'aktif',
        ]);
        
        $kat2 = KategoriBantuan::create([
            'nama_kategori' => 'Beasiswa',
            'deskripsi' => 'Bantuan biaya pendidikan',
            'jenis_bantuan' => 'uang',
            'status' => 'aktif',
        ]);

        // Programs
        $program1 = ProgramBantuan::create([
            'id_kategori' => $kat1->id_kategori,
            'id_donatur' => $donor1->id_donatur,
            'nama_program' => 'Sembako untuk Lansia',
            'deskripsi' => 'Pembagian paket sembako untuk warga lanjut usia',
            'tanggal_mulai' => now()->toDateString(),
            'tanggal_selesai' => now()->addWeeks(4)->toDateString(),
            'jenis_bantuan' => 'barang',
            'jumlah_bantuan' => 100,
            'status' => 'aktif',
        ]);

        $program2 = ProgramBantuan::create([
            'id_kategori' => $kat2->id_kategori,
            'id_donatur' => $donor2->id_donatur,
            'nama_program' => 'Beasiswa Anak Berprestasi',
            'deskripsi' => 'Beasiswa pendidikan untuk anak berprestasi',
            'tanggal_mulai' => now()->toDateString(),
            'tanggal_selesai' => now()->addMonths(2)->toDateString(),
            'jenis_bantuan' => 'uang',
            'jumlah_bantuan' => 50,
            'status' => 'aktif',
        ]);

        // Recipients
        $p1 = Penerima::create([
            'no_kk' => '3201010101010001',
            'password' => Hash::make('penerima123'),
            'nama_kepala' => 'Budi Santoso',
            'alamat' => 'Dusun 1 RT 01 RW 01',
            'nomor_telepon' => '081300000001',
            'pekerjaan' => 'Petani',
            'pekerjaan_istri' => 'ibu rumah tangga',
            'status_anak' => 'sekolah',
            'jumlah_tanggungan' => 3,
            'penghasilan' => '1.000.001 - 2.000.000',
            'status_verifikasi' => 'pending',
        ]);

        $p2 = Penerima::create([
            'no_kk' => '3201010101010002',
            'password' => Hash::make('penerima1234'),
            'nama_kepala' => 'Siti Aminah',
            'alamat' => 'Dusun 2 RT 02 RW 01',
            'nomor_telepon' => '081300000002',
            'pekerjaan' => 'Buruh',
            'pekerjaan_istri' => 'bekerja & berpenghasilan',
            'status_anak' => 'bayi',
            'jumlah_tanggungan' => 2,
            'penghasilan' => '500.000 - 1.000.000',
            'status_verifikasi' => 'pending',
        ]);

        // Assign penerima to programs (pending)
        PenerimaProgram::create([
            'id_program' => $program1->id_program,
            'id_penerima' => $p1->id_penerima,
            'tanggal_penetapan' => now()->toDateString(),
            'status_penerimaan' => 'menunggu',
            'created_by' => $admin->id_admin,
        ]);

        PenerimaProgram::create([
            'id_program' => $program2->id_program,
            'id_penerima' => $p2->id_penerima,
            'tanggal_penetapan' => now()->toDateString(),
            'status_penerimaan' => 'menunggu',
            'created_by' => $admin->id_admin,
        ]);
    }
}

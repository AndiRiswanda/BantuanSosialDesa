<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('penerima', function (Blueprint $table) {
            $table->id('id_penerima');
            $table->string('no_kk', 20)->unique();
            $table->string('password');
            $table->string('nama_kepala', 100);
            $table->text('alamat')->nullable();
            $table->string('nomor_telepon', 15)->nullable();
            $table->string('pekerjaan', 100)->nullable();
            $table->enum('pekerjaan_istri', ['ibu rumah tangga', 'bekerja & berpenghasilan', 'belum menikah', 'kepala keluarga'])->nullable();
            $table->enum('status_anak', ['belum punya', 'bayi', 'sekolah', 'bekerja', 'tidak bekerja'])->nullable();
            $table->integer('jumlah_tanggungan')->default(0);
            $table->enum('penghasilan', ['< 500.000', '500.000 - 1.000.000', '1.000.001 - 2.000.000', '2.000.001 - 3.000.000', '> 3.000.000'])->nullable();
            $table->enum('status_verifikasi', ['pending', 'disetujui', 'ditolak'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penerima');
    }
};

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
            $table->string('pekerjaan_istri', 100)->nullable();
            $table->string('status_anak', 50)->nullable();
            $table->integer('jumlah_tanggungan')->default(0);
            $table->enum('penghasilan', ['< Rp 500.000', 'Rp 500.000 - Rp 1.000.000', 'Rp 1.000.000 - Rp 2.000.000', 'Rp 2.000.000 - Rp 3.000.000', '> Rp 3.000.000'])->nullable();
            $table->enum('status_verifikasi', ['belum_mengajukan', 'pending', 'disetujui', 'ditolak'])->default('belum_mengajukan');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penerima');
    }
};

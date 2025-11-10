<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('transaksi_penyaluran', function (Blueprint $table) {
            $table->id('id_transaksi');
            $table->unsignedBigInteger('id_penerima_program');
            $table->unsignedBigInteger('id_jadwal')->nullable();
            $table->date('tanggal_penyaluran');
            $table->time('jam_penyaluran');
            $table->string('lokasi_penyaluran', 200)->nullable();
            $table->decimal('jumlah_diterima', 12, 2)->default(0);
            $table->enum('metode_penyaluran', ['transfer', 'barang']);
            $table->string('bukti_penyaluran', 255)->nullable();
            $table->text('catatan')->nullable();
            $table->enum('status_verifikasi', ['menunggu', 'diterima', 'ditolak'])->default('menunggu');
            $table->unsignedBigInteger('verified_by')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->string('alasan_penolakan', 255)->nullable();
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('id_penerima_program')->references('id_penerima_program')->on('penerima_program')
                  ->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_jadwal')->references('id_jadwal')->on('jadwal_penyaluran')
                  ->onUpdate('cascade')->onDelete('set null');
            $table->foreign('verified_by')->references('id_admin')->on('user_admin')
                  ->onUpdate('cascade')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi_penyaluran');
    }
};

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('donasi', function (Blueprint $table) {
            $table->id('id_donasi');
            $table->unsignedBigInteger('id_donatur');
            $table->unsignedBigInteger('id_program');
            $table->decimal('nominal', 15, 2);
            $table->enum('metode_pembayaran', ['transfer', 'tunai'])->default('transfer');
            $table->enum('status', ['menunggu', 'diterima', 'ditolak', 'dibatalkan'])->default('menunggu');
            $table->string('bukti_pembayaran', 500)->nullable();
            $table->string('catatan', 255)->nullable();
            $table->timestamp('tanggal_donasi')->useCurrent();
            $table->unsignedBigInteger('verified_by')->nullable();
            $table->timestamp('verified_at')->nullable();

            $table->foreign('id_donatur')->references('id_donatur')->on('donatur')
                  ->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_program')->references('id_program')->on('program_bantuan')
                  ->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('verified_by')->references('id_admin')->on('user_admin')
                  ->onUpdate('cascade')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donasi');
    }
};

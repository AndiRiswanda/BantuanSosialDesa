<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('jadwal_penyaluran', function (Blueprint $table) {
            $table->id('id_jadwal');
            $table->unsignedBigInteger('id_program');
            $table->date('tanggal');
            $table->time('jam_mulai');
            $table->time('jam_selesai')->nullable();
            $table->string('lokasi', 200);
            $table->text('deskripsi')->nullable();
            $table->enum('status', ['dijadwalkan', 'selesai', 'dibatalkan'])->default('dijadwalkan');
            $table->unsignedBigInteger('created_by');
            $table->timestamp('created_at')->useCurrent();

            $table->foreign('id_program')->references('id_program')->on('program_bantuan')
                  ->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('created_by')->references('id_admin')->on('user_admin')
                  ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwal_penyaluran');
    }
};

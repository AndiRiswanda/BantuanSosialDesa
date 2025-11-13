<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('laporan_transparansi', function (Blueprint $table) {
            $table->id('id_laporan');
            $table->unsignedBigInteger('id_program');
            $table->string('judul_laporan', 200);
            $table->text('isi_laporan')->nullable();
            $table->text('dokumentasi')->nullable();
            $table->date('tanggal_publikasi');
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
        Schema::dropIfExists('laporan_transparansi');
    }
};

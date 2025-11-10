<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dokumen_verifikasi', function (Blueprint $table) {
            $table->id('id_dokumen');
            $table->unsignedBigInteger('id_penerima');
            $table->string('jenis_dokumen', 50);
            $table->string('nama_file', 255);
            $table->string('path_file', 500);
            $table->integer('ukuran_file')->nullable();
            $table->timestamp('tanggal_upload')->useCurrent();

            $table->foreign('id_penerima')->references('id_penerima')->on('penerima')
                  ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dokumen_verifikasi');
    }
};

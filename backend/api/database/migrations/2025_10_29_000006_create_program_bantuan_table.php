<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('program_bantuan', function (Blueprint $table) {
            $table->id('id_program');
            $table->unsignedBigInteger('id_kategori');
            $table->unsignedBigInteger('id_donatur');
            $table->string('nama_program', 150);
            $table->text('deskripsi')->nullable();
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai')->nullable();
            $table->enum('jenis_bantuan', ['uang', 'barang']);
            $table->decimal('jumlah_bantuan', 15, 2)->default(0);
            $table->enum('status', ['aktif', 'selesai', 'ditunda'])->default('aktif');
            $table->timestamps();

            $table->foreign('id_kategori')->references('id_kategori')->on('kategori_bantuan')
                  ->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_donatur')->references('id_donatur')->on('donatur')
                  ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('program_bantuan');
    }
};

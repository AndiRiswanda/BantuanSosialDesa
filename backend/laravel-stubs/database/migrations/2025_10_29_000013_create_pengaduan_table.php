<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('pengaduan', function (Blueprint $table) {
            $table->id('id_pengaduan');
            $table->unsignedBigInteger('id_penerima')->nullable();
            $table->unsignedBigInteger('id_donatur')->nullable();
            $table->string('judul', 150);
            $table->text('isi');
            $table->enum('status', ['baru', 'diproses', 'selesai'])->default('baru');
            $table->string('lampiran', 500)->nullable();
            $table->timestamps();

            $table->foreign('id_penerima')->references('id_penerima')->on('penerima')
                  ->onUpdate('cascade')->onDelete('set null');
            $table->foreign('id_donatur')->references('id_donatur')->on('donatur')
                  ->onUpdate('cascade')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pengaduan');
    }
};

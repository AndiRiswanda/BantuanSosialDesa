<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('kriteria_penerima', function (Blueprint $table) {
            $table->id('id_kriteria');
            $table->unsignedBigInteger('id_program');
            $table->string('nama_kriteria', 100);
            $table->text('deskripsi')->nullable();
            $table->decimal('nilai_minimum', 10, 2)->nullable();
            $table->decimal('nilai_maksimum', 10, 2)->nullable();

            $table->foreign('id_program')->references('id_program')->on('program_bantuan')
                  ->onUpdate('cascade')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('kriteria_penerima');
    }
};

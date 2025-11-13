<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('penerima_program', function (Blueprint $table) {
            $table->id('id_penerima_program');
            $table->unsignedBigInteger('id_program');
            $table->unsignedBigInteger('id_penerima');
            $table->date('tanggal_penetapan');
            $table->enum('status_penerimaan', ['menunggu', 'selesai', 'batal'])->default('menunggu');
            $table->unsignedBigInteger('created_by');
            $table->timestamp('created_at')->useCurrent();

            $table->unique(['id_program', 'id_penerima'], 'uk_penerima_program_unique');
            $table->foreign('id_program')->references('id_program')->on('program_bantuan')
                  ->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('id_penerima')->references('id_penerima')->on('penerima')
                  ->onUpdate('cascade')->onDelete('restrict');
            $table->foreign('created_by')->references('id_admin')->on('user_admin')
                  ->onUpdate('cascade')->onDelete('restrict');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('penerima_program');
    }
};

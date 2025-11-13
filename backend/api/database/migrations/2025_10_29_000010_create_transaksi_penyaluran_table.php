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
        $table->date('tanggal_penyaluran');
        $table->time('jam_penyaluran');
        $table->string('lokasi_penyaluran', 200);
        $table->decimal('jumlah_diterima', 12, 2);
        $table->enum('metode_penyaluran', ['transfer', 'barang']);
        $table->string('bukti_penyaluran', 255)->nullable();
        $table->text('catatan')->nullable();
        $table->timestamp('created_at')->useCurrent();

        $table->foreign('id_penerima_program')->references('id_penerima_program')->on('penerima_program')
            ->onUpdate('cascade')->onDelete('restrict');
      });
    }

    public function down(): void
    {
        Schema::dropIfExists('transaksi_penyaluran');
    }
};

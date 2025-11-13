<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('donatur', function (Blueprint $table) {
            $table->id('id_donatur');
            $table->string('nama_organisasi', 100);
            $table->string('email', 100)->unique();
            $table->string('password');
            $table->text('alamat')->nullable();
            $table->string('nomor_telepon', 15)->nullable();
            $table->enum('jenis_instansi', ['perusahaan', 'yayasan', 'perorangan']);
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('donatur');
    }
};

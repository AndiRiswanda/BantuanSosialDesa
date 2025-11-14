<?php

/**
 * Script untuk membuat data donatur test
 * 
 * Cara pakai:
 * cd backend/api
 * php create-test-donatur.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Donatur;
use Illuminate\Support\Facades\Hash;

try {
    echo "=== Membuat Data Donatur Test ===\n\n";
    
    // Check if donatur already exists
    $existing = Donatur::where('email', 'donor@test.com')->first();
    
    if ($existing) {
        echo "❌ Email donor@test.com sudah terdaftar.\n";
        echo "Data yang ada:\n";
        echo "- ID: {$existing->id}\n";
        echo "- Nama: {$existing->nama_organisasi}\n";
        echo "- Email: {$existing->email}\n";
        echo "- Status: {$existing->status}\n\n";
        echo "Gunakan kredensial ini untuk login:\n";
        echo "Email: donor@test.com\n";
        echo "Password: password123\n\n";
        exit(0);
    }
    
    // Create new donatur
    $donatur = Donatur::create([
        'nama_organisasi' => 'Test Donatur',
        'email' => 'donor@test.com',
        'password' => Hash::make('password123'),
        'nomor_telepon' => '081234567890',
        'alamat' => 'Jl. Test No. 123, Jakarta',
        'jenis_instansi' => 'perorangan',
        'status' => 'aktif',
    ]);
    
    echo "✅ Berhasil membuat donatur test!\n\n";
    echo "Detail Donatur:\n";
    echo "- ID: {$donatur->id}\n";
    echo "- Nama: {$donatur->nama_organisasi}\n";
    echo "- Email: {$donatur->email}\n";
    echo "- Telepon: {$donatur->nomor_telepon}\n";
    echo "- Jenis: {$donatur->jenis_instansi}\n";
    echo "- Status: {$donatur->status}\n\n";
    
    echo "=================================\n";
    echo "Gunakan kredensial ini untuk login:\n";
    echo "Email: donor@test.com\n";
    echo "Password: password123\n";
    echo "=================================\n\n";
    
} catch (\Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString() . "\n";
    exit(1);
}

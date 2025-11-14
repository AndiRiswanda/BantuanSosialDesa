<?php
/**
 * Script untuk Generate Password Hash
 * 
 * Script ini digunakan untuk membuat hash password menggunakan bcrypt
 * yang kompatibel dengan Laravel Hash facade
 * 
 * Cara menggunakan:
 * 1. Buka terminal/command prompt
 * 2. Jalankan: php backend/api/database/generate_password_hash.php
 * 3. Copy hash yang dihasilkan ke file seed SQL Anda
 */

echo "===========================================\n";
echo "   Password Hash Generator untuk Seeder\n";
echo "===========================================\n\n";

// Daftar password yang perlu di-hash
$passwords = [
    'admin123'     => 'Untuk user admin',
    'donatur123'   => 'Untuk user donatur',
    'penerima123'  => 'Untuk user penerima',
    'password'     => 'Password default Laravel',
];

echo "Generated Hashes:\n";
echo str_repeat("-", 100) . "\n\n";

foreach ($passwords as $password => $description) {
    $hash = password_hash($password, PASSWORD_BCRYPT);
    
    echo "Password: {$password}\n";
    echo "Description: {$description}\n";
    echo "Hash: {$hash}\n";
    echo str_repeat("-", 100) . "\n\n";
}

echo "\n===========================================\n";
echo "   CARA MENGGUNAKAN HASH INI\n";
echo "===========================================\n\n";

echo "1. Copy hash yang sesuai dari output di atas\n";
echo "2. Buka file seed SQL Anda (seed_dummy_complete.sql)\n";
echo "3. Replace password hash yang lama dengan yang baru\n";
echo "4. Simpan file dan jalankan seeder\n\n";

echo "CONTOH PENGGUNAAN DI SQL:\n";
echo "INSERT INTO `user_admin` (`username`, `email`, `password`) VALUES\n";
echo "('admin', 'admin@desa.id', '" . password_hash('admin123', PASSWORD_BCRYPT) . "');\n\n";

echo "===========================================\n";
echo "   TESTING LOGIN\n";
echo "===========================================\n\n";

echo "Setelah seeding, gunakan kredensial berikut:\n\n";
echo "ADMIN:\n";
echo "  - Email: admin@desa.id\n";
echo "  - Password: admin123\n\n";

echo "DONATUR:\n";
echo "  - Email: yayasan@peduli.id\n";
echo "  - Password: donatur123\n\n";

echo "PENERIMA:\n";
echo "  - No. KK: 3601012501250001\n";
echo "  - Password: penerima123\n\n";

echo "===========================================\n";
echo "   Script selesai!\n";
echo "===========================================\n";

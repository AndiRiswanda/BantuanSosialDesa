-- Query untuk mengecek data keterangan yang ada
SELECT 
    id_program,
    nama_program,
    kriteria_penerima,
    keterangan
FROM program_bantuan
ORDER BY id_program DESC
LIMIT 10;

-- Update program tertentu (ganti id_program sesuai kebutuhan)
UPDATE program_bantuan
SET keterangan = 'Program bantuan ini bertujuan untuk membantu meringankan beban ekonomi keluarga kurang mampu di wilayah desa. Penyaluran dilakukan secara bertahap dengan memperhatikan keadilan dan transparansi.'
WHERE id_program = 1; -- Ganti dengan ID program yang Anda lihat

-- Atau update semua program yang keterangan-nya masih NULL
UPDATE program_bantuan
SET keterangan = CASE 
    WHEN jenis_bantuan = 'uang' THEN 'Bantuan tunai ini diberikan langsung kepada keluarga penerima untuk membantu memenuhi kebutuhan sehari-hari.'
    WHEN jenis_bantuan = 'barang' THEN 'Bantuan barang berupa paket sembako atau kebutuhan pokok lainnya yang diserahkan langsung kepada penerima.'
    ELSE 'Program bantuan sosial untuk membantu meringankan beban keluarga kurang mampu.'
END
WHERE keterangan IS NULL OR keterangan = '';

-- Verifikasi hasil update
SELECT 
    id_program,
    nama_program,
    jenis_bantuan,
    kriteria_penerima,
    keterangan
FROM program_bantuan
ORDER BY updated_at DESC;

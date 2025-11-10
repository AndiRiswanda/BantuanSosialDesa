<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DokumenVerifikasi extends Model
{
    use HasFactory;

    protected $table = 'dokumen_verifikasi';
    protected $primaryKey = 'id_dokumen';
    public $timestamps = false;

    protected $fillable = [
        'id_penerima',
        'jenis_dokumen',
        'nama_file',
        'path_file',
        'ukuran_file',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_upload' => 'datetime',
            'ukuran_file' => 'integer',
        ];
    }

    // Relationships
    public function penerima()
    {
        return $this->belongsTo(Penerima::class, 'id_penerima', 'id_penerima');
    }
}

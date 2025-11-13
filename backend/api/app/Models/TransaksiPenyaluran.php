<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TransaksiPenyaluran extends Model
{
    use HasFactory;

    protected $table = 'transaksi_penyaluran';
    protected $primaryKey = 'id_transaksi';
    public $timestamps = false;

    protected $fillable = [
        'id_penerima_program',
        'tanggal_penyaluran',
        'jam_penyaluran',
        'lokasi_penyaluran',
        'jumlah_diterima',
        'metode_penyaluran',
        'bukti_penyaluran',
        'catatan',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_penyaluran' => 'date',
            'jumlah_diterima' => 'decimal:2',
            'created_at' => 'datetime',
        ];
    }

    // Relationships
    public function penerimaProgram()
    {
        return $this->belongsTo(PenerimaProgram::class, 'id_penerima_program', 'id_penerima_program');
    }
}

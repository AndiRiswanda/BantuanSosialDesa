<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LaporanTransparansi extends Model
{
    use HasFactory;

    protected $table = 'laporan_transparansi';
    protected $primaryKey = 'id_laporan';
    public $timestamps = false;

    protected $fillable = [
        'id_program',
        'judul_laporan',
        'isi_laporan',
        'dokumentasi',
        'tanggal_publikasi',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_publikasi' => 'date',
            'created_at' => 'datetime',
        ];
    }

    // Relationships
    public function program()
    {
        return $this->belongsTo(ProgramBantuan::class, 'id_program', 'id_program');
    }

    public function admin()
    {
        return $this->belongsTo(UserAdmin::class, 'created_by', 'id_admin');
    }
}

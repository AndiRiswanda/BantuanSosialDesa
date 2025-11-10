<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LaporanTransparansi extends Model
{
    use HasFactory;

    protected $table = 'laporan_transparansi';
    protected $primaryKey = 'id_laporan';
    public $timestamps = false; // created_at only

    protected $fillable = [
        'id_program','judul_laporan','isi_laporan','dokumentasi','tanggal_publikasi','created_by','created_at'
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(ProgramBantuan::class, 'id_program', 'id_program');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(UserAdmin::class, 'created_by', 'id_admin');
    }
}

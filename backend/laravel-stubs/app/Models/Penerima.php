<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Penerima extends Model
{
    use HasFactory;

    protected $table = 'penerima';
    protected $primaryKey = 'id_penerima';

    protected $fillable = [
        'no_kk','password','nama_kepala','alamat','nomor_telepon','pekerjaan',
        'pekerjaan_istri','status_anak','jumlah_tanggungan','penghasilan','status_verifikasi'
    ];

    protected $hidden = ['password'];

    public function dokumen(): HasMany
    {
        return $this->hasMany(DokumenVerifikasi::class, 'id_penerima', 'id_penerima');
    }

    public function programBantuan(): BelongsToMany
    {
        return $this->belongsToMany(ProgramBantuan::class, 'penerima_program', 'id_penerima', 'id_program')
            ->withPivot(['id_penerima_program','tanggal_penetapan','status_penerimaan','created_by','created_at']);
    }

    public function pengaduan(): HasMany
    {
        return $this->hasMany(Pengaduan::class, 'id_penerima', 'id_penerima');
    }
}

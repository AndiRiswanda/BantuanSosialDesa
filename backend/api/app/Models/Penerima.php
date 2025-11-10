<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Penerima extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'penerima';
    protected $primaryKey = 'id_penerima';
    public $timestamps = true;

    protected $fillable = [
        'no_kk',
        'password',
        'nama_kepala',
        'alamat',
        'nomor_telepon',
        'pekerjaan',
        'pekerjaan_istri',
        'status_anak',
        'jumlah_tanggungan',
        'penghasilan',
        'status_verifikasi',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
            'jumlah_tanggungan' => 'integer',
        ];
    }

    // Relationships
    public function penerimaPrograms()
    {
        return $this->hasMany(PenerimaProgram::class, 'id_penerima', 'id_penerima');
    }

    public function dokumenVerifikasi()
    {
        return $this->hasMany(DokumenVerifikasi::class, 'id_penerima', 'id_penerima');
    }
}

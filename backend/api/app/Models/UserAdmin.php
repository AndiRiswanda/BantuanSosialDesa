<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class UserAdmin extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'user_admin';
    protected $primaryKey = 'id_admin';
    public $timestamps = true;

    protected $fillable = [
        'username','email','password','full_name','nomor_telepon','role','status'
    ];

    protected $hidden = ['password'];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    public function penerimaPrograms(): HasMany
    {
        return $this->hasMany(PenerimaProgram::class, 'created_by', 'id_admin');
    }

    public function jadwalDibuat(): HasMany
    {
        return $this->hasMany(JadwalPenyaluran::class, 'created_by', 'id_admin');
    }

    public function transaksiDiverifikasi(): HasMany
    {
        return $this->hasMany(TransaksiPenyaluran::class, 'verified_by', 'id_admin');
    }

    public function donasiDiverifikasi(): HasMany
    {
        return $this->hasMany(Donasi::class, 'verified_by', 'id_admin');
    }

    public function laporanDibuat(): HasMany
    {
        return $this->hasMany(LaporanTransparansi::class, 'created_by', 'id_admin');
    }
}

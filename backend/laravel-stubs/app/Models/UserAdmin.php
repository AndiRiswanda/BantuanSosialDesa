<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class UserAdmin extends Model
{
    use HasFactory;

    protected $table = 'user_admin';
    protected $primaryKey = 'id_admin';
    public $timestamps = true;

    protected $fillable = [
        'username','email','password','full_name','nomor_telepon','role','status'
    ];

    protected $hidden = ['password'];

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

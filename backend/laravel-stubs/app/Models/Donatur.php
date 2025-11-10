<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Donatur extends Model
{
    use HasFactory;

    protected $table = 'donatur';
    protected $primaryKey = 'id_donatur';

    protected $fillable = [
        'nama_organisasi','email','password','alamat','nomor_telepon','jenis_instansi','status'
    ];

    protected $hidden = ['password'];

    public function programs(): HasMany
    {
        return $this->hasMany(ProgramBantuan::class, 'id_donatur', 'id_donatur');
    }

    public function donasi(): HasMany
    {
        return $this->hasMany(Donasi::class, 'id_donatur', 'id_donatur');
    }

    public function pengaduan(): HasMany
    {
        return $this->hasMany(Pengaduan::class, 'id_donatur', 'id_donatur');
    }
}

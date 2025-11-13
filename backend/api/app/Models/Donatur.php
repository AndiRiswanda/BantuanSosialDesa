<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Donatur extends Authenticatable
{
    use HasFactory, Notifiable, HasApiTokens;

    protected $table = 'donatur';
    protected $primaryKey = 'id_donatur';
    public $timestamps = true;

    protected $fillable = [
        'nama_organisasi',
        'email',
        'password',
        'alamat',
        'nomor_telepon',
        'jenis_instansi',
        'status',
    ];

    protected $hidden = [
        'password',
    ];

    protected function casts(): array
    {
        return [
            'password' => 'hashed',
        ];
    }

    // Relationships
    public function programBantuan()
    {
        return $this->hasMany(ProgramBantuan::class, 'id_donatur', 'id_donatur');
    }
}

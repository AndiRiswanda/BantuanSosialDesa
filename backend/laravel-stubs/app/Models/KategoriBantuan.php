<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KategoriBantuan extends Model
{
    use HasFactory;

    protected $table = 'kategori_bantuan';
    protected $primaryKey = 'id_kategori';
    public $timestamps = false; // only created_at

    protected $fillable = [
        'nama_kategori','deskripsi','jenis_bantuan','status','created_at'
    ];

    public function programs(): HasMany
    {
        return $this->hasMany(ProgramBantuan::class, 'id_kategori', 'id_kategori');
    }
}

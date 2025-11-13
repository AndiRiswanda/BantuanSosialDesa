<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KategoriBantuan extends Model
{
    use HasFactory;

    protected $table = 'kategori_bantuan';
    protected $primaryKey = 'id_kategori';
    public $timestamps = false;

    protected $fillable = [
        'nama_kategori',
        'deskripsi',
        'jenis_bantuan',
        'status',
    ];

    // Relationships
    public function programBantuan()
    {
        return $this->hasMany(ProgramBantuan::class, 'id_kategori', 'id_kategori');
    }
}

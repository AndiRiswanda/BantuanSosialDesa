<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class KriteriaPenerima extends Model
{
    use HasFactory;

    protected $table = 'kriteria_penerima';
    protected $primaryKey = 'id_kriteria';
    public $timestamps = false;

    protected $fillable = [
        'id_program',
        'nama_kriteria',
        'deskripsi',
        'nilai_minimum',
        'nilai_maksimum',
    ];

    protected function casts(): array
    {
        return [
            'nilai_minimum' => 'decimal:2',
            'nilai_maksimum' => 'decimal:2',
        ];
    }

    // Relationships
    public function program()
    {
        return $this->belongsTo(ProgramBantuan::class, 'id_program', 'id_program');
    }
}

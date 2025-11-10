<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class KriteriaPenerima extends Model
{
    use HasFactory;

    protected $table = 'kriteria_penerima';
    protected $primaryKey = 'id_kriteria';
    public $timestamps = false;

    protected $fillable = [
        'id_program','nama_kriteria','deskripsi','nilai_minimum','nilai_maksimum'
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(ProgramBantuan::class, 'id_program', 'id_program');
    }
}

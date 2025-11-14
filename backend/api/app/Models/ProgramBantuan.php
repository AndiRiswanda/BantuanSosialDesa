<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProgramBantuan extends Model
{
    use HasFactory;

    protected $table = 'program_bantuan';
    protected $primaryKey = 'id_program';
    public $timestamps = true;

    protected $fillable = [
        'id_kategori',
        'id_donatur',
        'nama_program',
        'deskripsi',
        'tanggal_mulai',
        'tanggal_selesai',
        'jenis_bantuan',
        'jumlah_bantuan',
        'kriteria_penerima',
        'keterangan',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'tanggal_mulai' => 'date',
            'tanggal_selesai' => 'date',
            'jumlah_bantuan' => 'decimal:2',
        ];
    }

    // Relationships
    public function kategori()
    {
        return $this->belongsTo(KategoriBantuan::class, 'id_kategori', 'id_kategori');
    }

    public function donatur()
    {
        return $this->belongsTo(Donatur::class, 'id_donatur', 'id_donatur');
    }

    public function penerimaPrograms()
    {
        return $this->hasMany(PenerimaProgram::class, 'id_program', 'id_program');
    }

    public function kriteriaProgram()
    {
        return $this->hasMany(KriteriaPenerima::class, 'id_program', 'id_program');
    }
}

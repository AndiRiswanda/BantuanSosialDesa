<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProgramBantuan extends Model
{
    use HasFactory;

    protected $table = 'program_bantuan';
    protected $primaryKey = 'id_program';

    protected $fillable = [
        'id_kategori','id_donatur','nama_program','deskripsi','tanggal_mulai','tanggal_selesai',
        'jenis_bantuan','jumlah_bantuan','status'
    ];

    public function kategori(): BelongsTo
    {
        return $this->belongsTo(KategoriBantuan::class, 'id_kategori', 'id_kategori');
    }

    public function donatur(): BelongsTo
    {
        return $this->belongsTo(Donatur::class, 'id_donatur', 'id_donatur');
    }

    public function kriteria(): HasMany
    {
        return $this->hasMany(KriteriaPenerima::class, 'id_program', 'id_program');
    }

    public function penerimaPrograms(): HasMany
    {
        return $this->hasMany(PenerimaProgram::class, 'id_program', 'id_program');
    }

    public function penerima(): BelongsToMany
    {
        return $this->belongsToMany(Penerima::class, 'penerima_program', 'id_program', 'id_penerima')
            ->withPivot(['id_penerima_program','tanggal_penetapan','status_penerimaan','created_by','created_at']);
    }

    public function jadwal(): HasMany
    {
        return $this->hasMany(JadwalPenyaluran::class, 'id_program', 'id_program');
    }

    public function donasi(): HasMany
    {
        return $this->hasMany(Donasi::class, 'id_program', 'id_program');
    }

    public function laporan(): HasMany
    {
        return $this->hasMany(LaporanTransparansi::class, 'id_program', 'id_program');
    }
}

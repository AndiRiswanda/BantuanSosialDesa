<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JadwalPenyaluran extends Model
{
    use HasFactory;

    protected $table = 'jadwal_penyaluran';
    protected $primaryKey = 'id_jadwal';
    public $timestamps = false; // created_at only

    protected $fillable = [
        'id_program','tanggal','jam_mulai','jam_selesai','lokasi','deskripsi','status','created_by','created_at'
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(ProgramBantuan::class, 'id_program', 'id_program');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(UserAdmin::class, 'created_by', 'id_admin');
    }

    public function transaksi(): HasMany
    {
        return $this->hasMany(TransaksiPenyaluran::class, 'id_jadwal', 'id_jadwal');
    }
}

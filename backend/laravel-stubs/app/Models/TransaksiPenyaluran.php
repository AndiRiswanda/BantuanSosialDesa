<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransaksiPenyaluran extends Model
{
    use HasFactory;

    protected $table = 'transaksi_penyaluran';
    protected $primaryKey = 'id_transaksi';
    public $timestamps = false; // created_at only

    protected $fillable = [
        'id_penerima_program','id_jadwal','tanggal_penyaluran','jam_penyaluran','lokasi_penyaluran',
        'jumlah_diterima','metode_penyaluran','bukti_penyaluran','catatan',
        'status_verifikasi','verified_by','verified_at','alasan_penolakan','created_at'
    ];

    public function penerimaProgram(): BelongsTo
    {
        return $this->belongsTo(PenerimaProgram::class, 'id_penerima_program', 'id_penerima_program');
    }

    public function jadwal(): BelongsTo
    {
        return $this->belongsTo(JadwalPenyaluran::class, 'id_jadwal', 'id_jadwal');
    }

    public function adminVerifikator(): BelongsTo
    {
        return $this->belongsTo(UserAdmin::class, 'verified_by', 'id_admin');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Donasi extends Model
{
    use HasFactory;

    protected $table = 'donasi';
    protected $primaryKey = 'id_donasi';
    public $timestamps = false; // tanggal_donasi + verified_at handled manually

    protected $fillable = [
        'id_donatur','id_program','nominal','metode_pembayaran','status','bukti_pembayaran',
        'catatan','tanggal_donasi','verified_by','verified_at'
    ];

    public function donatur(): BelongsTo
    {
        return $this->belongsTo(Donatur::class, 'id_donatur', 'id_donatur');
    }

    public function program(): BelongsTo
    {
        return $this->belongsTo(ProgramBantuan::class, 'id_program', 'id_program');
    }

    public function adminVerifikator(): BelongsTo
    {
        return $this->belongsTo(UserAdmin::class, 'verified_by', 'id_admin');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PenerimaProgram extends Model
{
    use HasFactory;

    protected $table = 'penerima_program';
    protected $primaryKey = 'id_penerima_program';
    public $timestamps = false; // created_at only stored

    protected $fillable = [
        'id_program','id_penerima','tanggal_penetapan','status_penerimaan','created_by','created_at'
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(ProgramBantuan::class, 'id_program', 'id_program');
    }

    public function penerima(): BelongsTo
    {
        return $this->belongsTo(Penerima::class, 'id_penerima', 'id_penerima');
    }

    public function admin(): BelongsTo
    {
        return $this->belongsTo(UserAdmin::class, 'created_by', 'id_admin');
    }

    public function transaksi(): HasMany
    {
        return $this->hasMany(TransaksiPenyaluran::class, 'id_penerima_program', 'id_penerima_program');
    }
}

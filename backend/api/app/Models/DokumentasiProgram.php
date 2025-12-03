<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DokumentasiProgram extends Model
{
    protected $table = 'dokumentasi_program';
    protected $primaryKey = 'id_dokumentasi';

    protected $fillable = [
        'id_program',
        'judul',
        'deskripsi',
        'file_path',
        'file_name',
        'file_type',
        'file_size',
        'tanggal_upload',
        'uploaded_by',
    ];

    protected $casts = [
        'tanggal_upload' => 'date',
        'file_size' => 'integer',
    ];

    public function program(): BelongsTo
    {
        return $this->belongsTo(ProgramBantuan::class, 'id_program', 'id_program');
    }

    public function uploader(): BelongsTo
    {
        return $this->belongsTo(UserAdmin::class, 'uploaded_by', 'id_admin');
    }
}

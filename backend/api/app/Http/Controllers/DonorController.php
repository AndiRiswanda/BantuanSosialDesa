<?php

namespace App\Http\Controllers;

use App\Models\ProgramBantuan;
use App\Models\KategoriBantuan;
use Illuminate\Http\Request;

class DonorController extends Controller
{
    public function dashboard(Request $request)
    {
        $donatur = $request->user();
        
        // Get donor statistics
        $totalPrograms = $donatur->programBantuan()->count();
        $activePrograms = $donatur->programBantuan()->where('status', 'aktif')->count();
        $totalBantuan = $donatur->programBantuan()->sum('jumlah_bantuan');
        
        return response()->json([
            'user' => $donatur,
            'stats' => [
                'total_programs' => $totalPrograms,
                'active_programs' => $activePrograms,
                'total_bantuan' => $totalBantuan,
            ],
            'recent_programs' => $donatur->programBantuan()
                ->with('kategori')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }

    public function programs(Request $request)
    {
        $donatur = $request->user();
        
        $programs = $donatur->programBantuan()
            ->with('kategori')
            ->latest()
            ->paginate(10);
            
        return response()->json($programs);
    }

    public function programDetail($id)
    {
        $program = ProgramBantuan::with([
            'kategori', 
            'donatur', 
            'penerimaPrograms' => function($query) {
                $query->with(['penerima', 'transaksiPenyaluran']);
            }
        ])->findOrFail($id);
        
        // Calculate statistics
        $totalPenerima = $program->penerimaPrograms->count();
        $penerimaDisetujui = $program->penerimaPrograms->where('status_seleksi', 'disetujui')->count();
        
        // Count tersalurkan (with transaksi and status selesai)
        $totalTersalurkan = $program->penerimaPrograms->filter(function($pp) {
            return $pp->transaksiPenyaluran && 
                   $pp->transaksiPenyaluran->where('status_penyaluran', 'selesai')->count() > 0;
        })->count();
        
        return response()->json([
            'program' => $program,
            'statistics' => [
                'total_penerima' => $totalPenerima,
                'penerima_disetujui' => $penerimaDisetujui,
                'total_tersalurkan' => $totalTersalurkan,
            ]
        ]);
    }

    public function createProgram(Request $request)
    {
        $donatur = $request->user();
        
        $request->validate([
            'id_kategori' => 'required|exists:kategori_bantuan,id_kategori',
            'nama_program' => 'required|string|max:150',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date|after:tanggal_mulai',
            'jenis_bantuan' => 'required|in:uang,barang',
            'jumlah_bantuan' => 'required|numeric|min:0',
        ], [
            'id_kategori.required' => 'Kategori bantuan harus dipilih.',
            'id_kategori.exists' => 'Kategori bantuan tidak valid.',
            'nama_program.required' => 'Nama program harus diisi.',
            'nama_program.max' => 'Nama program maksimal 150 karakter.',
            'tanggal_mulai.required' => 'Tanggal mulai harus diisi.',
            'tanggal_mulai.date' => 'Format tanggal mulai tidak valid.',
            'tanggal_selesai.date' => 'Format tanggal selesai tidak valid.',
            'tanggal_selesai.after' => 'Tanggal selesai harus setelah tanggal mulai.',
            'jenis_bantuan.required' => 'Jenis bantuan harus dipilih.',
            'jenis_bantuan.in' => 'Jenis bantuan harus uang atau barang.',
            'jumlah_bantuan.required' => 'Jumlah bantuan harus diisi.',
            'jumlah_bantuan.numeric' => 'Jumlah bantuan harus berupa angka.',
            'jumlah_bantuan.min' => 'Jumlah bantuan tidak boleh negatif.',
        ]);

        $program = $donatur->programBantuan()->create([
            'id_kategori' => $request->id_kategori,
            'nama_program' => $request->nama_program,
            'deskripsi' => $request->deskripsi,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'jenis_bantuan' => $request->jenis_bantuan,
            'jumlah_bantuan' => $request->jumlah_bantuan,
            'status' => 'aktif',
        ]);

        return response()->json([
            'message' => 'Program bantuan berhasil dibuat.',
            'program' => $program->load('kategori')
        ], 201);
    }

    public function updateProgram(Request $request, $id)
    {
        $donatur = $request->user();
        $program = $donatur->programBantuan()->findOrFail($id);
        
        $request->validate([
            'nama_program' => 'string|max:150',
            'deskripsi' => 'nullable|string',
            'tanggal_selesai' => 'nullable|date',
            'jumlah_bantuan' => 'numeric|min:0',
            'status' => 'in:aktif,selesai,ditunda',
        ], [
            'nama_program.max' => 'Nama program maksimal 150 karakter.',
            'tanggal_selesai.date' => 'Format tanggal selesai tidak valid.',
            'jumlah_bantuan.numeric' => 'Jumlah bantuan harus berupa angka.',
            'jumlah_bantuan.min' => 'Jumlah bantuan tidak boleh negatif.',
            'status.in' => 'Status harus salah satu dari: aktif, selesai, ditunda.',
        ]);

        $program->update($request->all());

        return response()->json([
            'message' => 'Program bantuan berhasil diperbarui.',
            'program' => $program->load('kategori')
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $donatur = $request->user();
        
        $request->validate([
            'nama_organisasi' => 'string|max:100',
            'nomor_telepon' => 'nullable|string|max:15',
            'alamat' => 'nullable|string',
        ], [
            'nama_organisasi.max' => 'Nama organisasi maksimal 100 karakter.',
            'nomor_telepon.max' => 'Nomor telepon maksimal 15 karakter.',
        ]);

        $donatur->update($request->only(['nama_organisasi', 'nomor_telepon', 'alamat']));

        return response()->json([
            'message' => 'Profil berhasil diperbarui.',
            'user' => $donatur
        ]);
    }

    public function deleteProgram(Request $request, $id)
    {
        $donatur = $request->user();
        $program = $donatur->programBantuan()->findOrFail($id);
        
        // Check if program has recipients
        if ($program->penerimaPrograms()->count() > 0) {
            return response()->json([
                'message' => 'Program tidak dapat dihapus karena sudah memiliki penerima bantuan.',
                'error' => 'Program memiliki ' . $program->penerimaPrograms()->count() . ' penerima.'
            ], 400);
        }
        
        $programName = $program->nama_program;
        $program->delete();
        
        return response()->json([
            'message' => "Program '$programName' berhasil dihapus."
        ]);
    }

    public function categories()
    {
        $categories = KategoriBantuan::all();
        return response()->json($categories);
    }

    public function programRecipients(Request $request, $id)
    {
        $donatur = $request->user();
        $program = $donatur->programBantuan()->findOrFail($id);
        
        $recipients = $program->penerimaPrograms()
            ->with(['penerima', 'transaksiPenyaluran'])
            ->get();
            
        // Group by status
        $grouped = [
            'pending' => $recipients->where('status_seleksi', 'pending'),
            'disetujui' => $recipients->where('status_seleksi', 'disetujui'),
            'ditolak' => $recipients->where('status_seleksi', 'ditolak'),
        ];
        
        return response()->json([
            'program' => $program->only(['id_program', 'nama_program']),
            'recipients' => $recipients,
            'grouped' => $grouped,
            'summary' => [
                'total' => $recipients->count(),
                'pending' => $grouped['pending']->count(),
                'disetujui' => $grouped['disetujui']->count(),
                'ditolak' => $grouped['ditolak']->count(),
            ]
        ]);
    }
}

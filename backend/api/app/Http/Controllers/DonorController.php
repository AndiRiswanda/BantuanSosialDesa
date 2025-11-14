<?php

namespace App\Http\Controllers;

use App\Models\ProgramBantuan;
use App\Models\KategoriBantuan;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DonorController extends Controller
{
    public function dashboard(Request $request)
    {
        $donatur = $request->user();
        
        // Get donor statistics
        $totalPrograms = $donatur->programBantuan()->count();
        $activePrograms = $donatur->programBantuan()->where('status', 'aktif')->count();
        
        // Separate statistics for 'uang' and 'barang'
        $totalBantuanUang = $donatur->programBantuan()
            ->where('jenis_bantuan', 'uang')
            ->sum('jumlah_bantuan');
            
        $totalBantuanBarang = $donatur->programBantuan()
            ->where('jenis_bantuan', 'barang')
            ->sum('jumlah_bantuan');
        
        // Count total recipients across all programs
        $totalPenerima = DB::table('penerima_program')
            ->join('program_bantuan', 'penerima_program.id_program', '=', 'program_bantuan.id_program')
            ->where('program_bantuan.id_donatur', $donatur->id_donatur)
            ->distinct('penerima_program.id_penerima')
            ->count('penerima_program.id_penerima');
        
        return response()->json([
            'user' => $donatur,
            'stats' => [
                'total_programs' => $totalPrograms,
                'active_programs' => $activePrograms,
                'total_bantuan_uang' => $totalBantuanUang,
                'total_bantuan_barang' => $totalBantuanBarang,
                'total_penerima' => $totalPenerima,
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
            'penerimaPrograms.penerima',
            'penerimaPrograms.transaksiPenyaluran'
        ])->findOrFail($id);
        
        // Calculate statistics
        $totalPenerima = $program->penerimaPrograms->count();
        $penerimaDisetujui = $program->penerimaPrograms->where('status_penerimaan', 'selesai')->count();
        
        // Count tersalurkan (with transaksi)
        $totalTersalurkan = $program->penerimaPrograms->filter(function($pp) {
            return $pp->transaksiPenyaluran && $pp->transaksiPenyaluran->count() > 0;
        })->count();
        
        // Format response data untuk memastikan semua field terkirim
        $programData = $program->toArray();
        
        // Pastikan penerima_programs terisi dengan benar
        if (isset($programData['penerima_programs'])) {
            foreach ($programData['penerima_programs'] as &$pp) {
                // Pastikan data penerima ada
                if (isset($pp['penerima'])) {
                    // Tidak ada yang perlu diubah, data sudah benar
                } else {
                    // Jika tidak ada, set ke null
                    $pp['penerima'] = null;
                }
            }
        }
        
        return response()->json([
            'program' => $programData,
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
            'kriteria_penerima' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'keterangan_penerima' => 'nullable|string', // Accept both field names
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

        // Map keterangan_penerima to keterangan for backward compatibility
        $keterangan = $request->keterangan ?? $request->keterangan_penerima;

        $program = $donatur->programBantuan()->create([
            'id_kategori' => $request->id_kategori,
            'nama_program' => $request->nama_program,
            'deskripsi' => $request->deskripsi,
            'tanggal_mulai' => $request->tanggal_mulai,
            'tanggal_selesai' => $request->tanggal_selesai,
            'jenis_bantuan' => $request->jenis_bantuan,
            'jumlah_bantuan' => $request->jumlah_bantuan,
            'kriteria_penerima' => $request->kriteria_penerima,
            'keterangan' => $keterangan, // Use the mapped value
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
        $user = $request->user();
        \Log::info('Profile Request', [
            'user' => $user,
            'user_type' => get_class($user),
            'user_id' => $user ? $user->getKey() : null,
        ]);
        
        return response()->json($user);
    }

    public function updateProfile(Request $request)
    {
        try {
            $donatur = $request->user();
            
            // Log incoming request
            \Log::info('Update Profile Request', [
                'donor_id' => $donatur->id_donatur,
                'request_data' => $request->all(),
            ]);
            
            // Validate input
            $validated = $request->validate([
                'nama_organisasi' => 'required|string|max:100',
                'email' => 'required|email|unique:donatur,email,' . $donatur->id_donatur . ',id_donatur|max:100',
                'alamat' => 'nullable|string|max:255',
                'nomor_telepon' => 'nullable|string|max:15',
                'jenis_instansi' => 'required|in:perusahaan,yayasan,perorangan',
            ], [
                'nama_organisasi.required' => 'Nama organisasi wajib diisi.',
                'nama_organisasi.max' => 'Nama organisasi maksimal 100 karakter.',
                'email.required' => 'Email wajib diisi.',
                'email.email' => 'Format email tidak valid.',
                'email.unique' => 'Email sudah digunakan oleh donatur lain.',
                'email.max' => 'Email maksimal 100 karakter.',
                'alamat.max' => 'Alamat maksimal 255 karakter.',
                'nomor_telepon.max' => 'Nomor telepon maksimal 15 karakter.',
                'jenis_instansi.required' => 'Jenis instansi wajib dipilih.',
                'jenis_instansi.in' => 'Jenis instansi harus perusahaan, yayasan, atau perorangan.',
            ]);

            // Update profile
            $donatur->update([
                'nama_organisasi' => $validated['nama_organisasi'],
                'email' => $validated['email'],
                'alamat' => $validated['alamat'] ?? $donatur->alamat,
                'nomor_telepon' => $validated['nomor_telepon'] ?? $donatur->nomor_telepon,
                'jenis_instansi' => $validated['jenis_instansi'],
            ]);

            // Log successful update
            \Log::info('Donor Profile Updated Successfully', [
                'donor_id' => $donatur->id_donatur,
                'updated_fields' => array_keys($validated),
            ]);

            // Get fresh data from database
            $freshData = $donatur->fresh();

            return response()->json([
                'message' => 'Profil berhasil diperbarui.',
                'data' => $freshData
            ], 200);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            // Log validation errors
            \Log::warning('Profile Update Validation Failed', [
                'errors' => $e->errors(),
            ]);
            throw $e; // Re-throw to return 422 response
            
        } catch (\Exception $e) {
            // Log unexpected errors
            \Log::error('Profile Update Failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return response()->json([
                'message' => 'Terjadi kesalahan saat memperbarui profil.',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal Server Error'
            ], 500);
        }
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
            
        // Group by status_penerimaan (not status_seleksi)
        $grouped = [
            'menunggu' => $recipients->where('status_penerimaan', 'menunggu'),
            'selesai' => $recipients->where('status_penerimaan', 'selesai'),
            'batal' => $recipients->where('status_penerimaan', 'batal'),
        ];
        
        return response()->json([
            'program' => $program->only(['id_program', 'nama_program']),
            'recipients' => $recipients,
            'grouped' => $grouped,
            'summary' => [
                'total' => $recipients->count(),
                'menunggu' => $grouped['menunggu']->count(),
                'selesai' => $grouped['selesai']->count(),
                'batal' => $grouped['batal']->count(),
            ]
        ]);
    }
}

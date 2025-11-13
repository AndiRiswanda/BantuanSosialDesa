<?php

namespace App\Http\Controllers;

use App\Models\ProgramBantuan;
use App\Models\PenerimaProgram;
use App\Models\DokumenVerifikasi;
use Illuminate\Http\Request;

class RecipientController extends Controller
{
    public function dashboard(Request $request)
    {
        $penerima = $request->user();
        
        // Get recipient statistics
        $totalApplications = $penerima->penerimaPrograms()->count();
        $approvedApplications = $penerima->penerimaPrograms()
            ->where('status_penerimaan', 'selesai')->count();
        $pendingApplications = $penerima->penerimaPrograms()
            ->where('status_penerimaan', 'menunggu')->count();
        
        return response()->json([
            'user' => $penerima,
            'stats' => [
                'total_applications' => $totalApplications,
                'approved_applications' => $approvedApplications,
                'pending_applications' => $pendingApplications,
                'status_verifikasi' => $penerima->status_verifikasi,
            ],
            'recent_applications' => $penerima->penerimaPrograms()
                ->with('program.kategori')
                ->latest()
                ->take(5)
                ->get(),
        ]);
    }

    public function programs()
    {
        $programs = ProgramBantuan::where('status', 'aktif')
            ->with('kategori', 'donatur')
            ->latest()
            ->get();
            
        return response()->json($programs);
    }

    public function programDetail($id)
    {
        $program = ProgramBantuan::with(['kategori', 'donatur', 'kriteriaProgram'])
            ->findOrFail($id);
        
        return response()->json($program);
    }

    public function applyProgram(Request $request, $id)
    {
        $penerima = $request->user();
        
        // Check if user is verified
        if ($penerima->status_verifikasi !== 'disetujui') {
            return response()->json([
                'message' => 'Anda harus diverifikasi terlebih dahulu sebelum mendaftar program'
            ], 403);
        }
        
        // Check if already applied
        $existingApplication = PenerimaProgram::where('id_program', $id)
            ->where('id_penerima', $penerima->id_penerima)
            ->first();
            
        if ($existingApplication) {
            return response()->json([
                'message' => 'Anda sudah mendaftar program ini'
            ], 400);
        }
        
        $program = ProgramBantuan::findOrFail($id);
        
        // Note: In real implementation, admin should approve this
        // For now, we'll create with 'menunggu' status
        $application = PenerimaProgram::create([
            'id_program' => $id,
            'id_penerima' => $penerima->id_penerima,
            'tanggal_penetapan' => now(),
            'status_penerimaan' => 'menunggu',
            'created_by' => 1, // Default admin, should be updated when admin approves
        ]);

        return response()->json($application->load('program'), 201);
    }

    public function applications(Request $request)
    {
        $penerima = $request->user();
        
        $applications = $penerima->penerimaPrograms()
            ->with(['program.kategori', 'program.donatur'])
            ->latest()
            ->paginate(10);
            
        return response()->json($applications);
    }

    public function profile(Request $request)
    {
        $penerima = $request->user();
        $penerima->load('dokumenVerifikasi');
        
        return response()->json($penerima);
    }

    public function updateProfile(Request $request)
    {
        $penerima = $request->user();
        
        $request->validate([
            'nama_kepala' => 'string|max:100',
            'nomor_telepon' => 'nullable|string|max:15',
            'alamat' => 'nullable|string',
            'pekerjaan' => 'nullable|string|max:100',
            'jumlah_tanggungan' => 'integer|min:0',
        ]);

        $penerima->update($request->only([
            'nama_kepala',
            'nomor_telepon',
            'alamat',
            'pekerjaan',
            'pekerjaan_istri',
            'status_anak',
            'jumlah_tanggungan',
            'penghasilan'
        ]));

        return response()->json($penerima);
    }

    public function uploadDocument(Request $request)
    {
        $penerima = $request->user();
        
        $request->validate([
            'jenis_dokumen' => 'required|string|max:50',
            'file' => 'required|file|max:5120', // 5MB max
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('dokumen_verifikasi', $filename, 'public');

        $dokumen = DokumenVerifikasi::create([
            'id_penerima' => $penerima->id_penerima,
            'jenis_dokumen' => $request->jenis_dokumen,
            'nama_file' => $filename,
            'path_file' => $path,
            'ukuran_file' => $file->getSize(),
        ]);

        return response()->json($dokumen, 201);
    }
}

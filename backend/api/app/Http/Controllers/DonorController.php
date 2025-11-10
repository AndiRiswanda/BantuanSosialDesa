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
        $program = ProgramBantuan::with(['kategori', 'donatur', 'penerimaPrograms.penerima'])
            ->findOrFail($id);
        
        return response()->json($program);
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

        return response()->json($program->load('kategori'), 201);
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
        ]);

        $program->update($request->all());

        return response()->json($program->load('kategori'));
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
        ]);

        $donatur->update($request->only(['nama_organisasi', 'nomor_telepon', 'alamat']));

        return response()->json($donatur);
    }
}

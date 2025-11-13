<?php

namespace App\Http\Controllers;

use App\Models\ProgramBantuan;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    public function index()
    {
        $programs = ProgramBantuan::where('status', 'aktif')
            ->with(['kategori', 'donatur'])
            ->latest()
            ->paginate(12);
            
        return response()->json($programs);
    }

    public function show($id)
    {
        $program = ProgramBantuan::with(['kategori', 'donatur', 'kriteriaProgram'])
            ->findOrFail($id);
            
        return response()->json($program);
    }
}

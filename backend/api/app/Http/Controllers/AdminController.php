<?php

namespace App\Http\Controllers;

use App\Models\Donatur;
use App\Models\Penerima;
use App\Models\ProgramBantuan;
use App\Models\PenerimaProgram;
use App\Models\TransaksiPenyaluran;
use App\Models\KategoriBantuan;
use App\Models\LaporanTransparansi;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    // Copy implementation lengkap dari dokumentasi
    // atau implement sesuai kebutuhan spesifik Anda
    
    public function dashboard()
    {
        $stats = [
            'total_donors' => Donatur::where('status', 'aktif')->count(),
            'total_recipients' => Penerima::count(),
            'total_programs' => ProgramBantuan::count(),
            'active_programs' => ProgramBantuan::where('status', 'aktif')->count(),
            'total_bantuan' => ProgramBantuan::sum('jumlah_bantuan'),
            'pending_verifications' => Penerima::where('status_verifikasi', 'pending')->count(),
        ];

        return response()->json($stats);
    }

    public function programs()
    {
        $programs = ProgramBantuan::with(['kategori', 'donatur'])->latest()->paginate(10);
        return response()->json($programs);
    }

    public function createProgram(Request $request)
    {
        $request->validate([
            'id_kategori' => 'required|exists:kategori_bantuan,id_kategori',
            'id_donatur' => 'required|exists:donatur,id_donatur',
            'nama_program' => 'required|string|max:150',
            'deskripsi' => 'nullable|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date|after:tanggal_mulai',
            'jenis_bantuan' => 'required|in:uang,barang',
            'jumlah_bantuan' => 'required|numeric|min:0',
        ]);

        $program = ProgramBantuan::create($request->all());
        return response()->json($program->load(['kategori', 'donatur']), 201);
    }

    public function updateProgram(Request $request, $id)
    {
        $program = ProgramBantuan::findOrFail($id);
        $program->update($request->all());
        return response()->json($program->load(['kategori', 'donatur']));
    }

    public function deleteProgram($id)
    {
        $program = ProgramBantuan::findOrFail($id);
        if ($program->penerimaPrograms()->count() > 0) {
            return response()->json(['message' => 'Cannot delete program with existing recipients'], 400);
        }
        $program->delete();
        return response()->json(['message' => 'Program deleted successfully']);
    }

    public function pendingDonors()
    {
        $donors = Donatur::where('status', 'nonaktif')->latest()->get();
        return response()->json($donors);
    }

    public function verifyDonor(Request $request, $id)
    {
        $donor = Donatur::findOrFail($id);
        $request->validate(['status' => 'required|in:aktif,nonaktif']);
        $donor->update(['status' => $request->status]);
        return response()->json($donor);
    }

    public function pendingRecipients()
    {
        $recipients = Penerima::where('status_verifikasi', 'pending')->with('dokumenVerifikasi')->latest()->get();
        return response()->json($recipients);
    }

    public function verifyRecipient(Request $request, $id)
    {
        $recipient = Penerima::findOrFail($id);
        $request->validate(['status_verifikasi' => 'required|in:disetujui,ditolak']);
        $recipient->update(['status_verifikasi' => $request->status_verifikasi]);
        return response()->json($recipient);
    }

    public function donors()
    {
        $donors = Donatur::with('programBantuan')->paginate(10);
        return response()->json($donors);
    }

    public function donorDetail($id)
    {
        $donor = Donatur::with(['programBantuan.kategori'])->findOrFail($id);
        return response()->json($donor);
    }

    public function updateDonor(Request $request, $id)
    {
        $donor = Donatur::findOrFail($id);
        $donor->update($request->all());
        return response()->json($donor);
    }

    public function recipients()
    {
        $recipients = Penerima::with('penerimaPrograms')->paginate(10);
        return response()->json($recipients);
    }

    public function recipientDetail($id)
    {
        $recipient = Penerima::with(['penerimaPrograms.program', 'dokumenVerifikasi'])->findOrFail($id);
        return response()->json($recipient);
    }

    public function updateRecipient(Request $request, $id)
    {
        $recipient = Penerima::findOrFail($id);
        $recipient->update($request->all());
        return response()->json($recipient);
    }

    public function categories()
    {
        return response()->json(KategoriBantuan::all());
    }

    public function createCategory(Request $request)
    {
        $request->validate([
            'nama_kategori' => 'required|string|max:100|unique:kategori_bantuan',
            'deskripsi' => 'nullable|string',
            'jenis_bantuan' => 'required|in:uang,barang',
            'status' => 'required|in:aktif,nonaktif',
        ]);
        $category = KategoriBantuan::create($request->all());
        return response()->json($category, 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = KategoriBantuan::findOrFail($id);
        $category->update($request->all());
        return response()->json($category);
    }

    public function penerimaPrograms(Request $request)
    {
        $query = PenerimaProgram::with(['program', 'penerima', 'admin']);
        if ($request->has('status')) $query->where('status_penerimaan', $request->status);
        if ($request->has('id_program')) $query->where('id_program', $request->id_program);
        return response()->json($query->latest()->paginate(10));
    }

    public function assignPenerimaToProgram(Request $request)
    {
        $request->validate([
            'id_program' => 'required|exists:program_bantuan,id_program',
            'id_penerima' => 'required|exists:penerima,id_penerima',
            'tanggal_penetapan' => 'required|date',
        ]);

        $existing = PenerimaProgram::where('id_program', $request->id_program)
            ->where('id_penerima', $request->id_penerima)->first();
        if ($existing) {
            return response()->json(['message' => 'Penerima sudah terdaftar di program ini'], 400);
        }

        $penerimaProgram = PenerimaProgram::create([
            ...$request->all(),
            'status_penerimaan' => 'menunggu',
            'created_by' => $request->user()->id_admin,
        ]);
        return response()->json($penerimaProgram->load(['program', 'penerima']), 201);
    }

    public function updatePenerimaProgram(Request $request, $id)
    {
        $penerimaProgram = PenerimaProgram::findOrFail($id);
        $request->validate(['status_penerimaan' => 'required|in:menunggu,selesai,batal']);
        $penerimaProgram->update($request->only('status_penerimaan'));
        return response()->json($penerimaProgram->load(['program', 'penerima']));
    }

    public function transaksi(Request $request)
    {
        $query = TransaksiPenyaluran::with(['penerimaProgram.program', 'penerimaProgram.penerima']);
        if ($request->has('id_program')) {
            $query->whereHas('penerimaProgram', function($q) use ($request) {
                $q->where('id_program', $request->id_program);
            });
        }
        return response()->json($query->latest('tanggal_penyaluran')->paginate(10));
    }

    public function createTransaksi(Request $request)
    {
        $request->validate([
            'id_penerima_program' => 'required|exists:penerima_program,id_penerima_program',
            'tanggal_penyaluran' => 'required|date',
            'jam_penyaluran' => 'required',
            'lokasi_penyaluran' => 'required|string|max:200',
            'jumlah_diterima' => 'required|numeric|min:0',
            'metode_penyaluran' => 'required|in:transfer,barang',
        ]);

        $transaksi = TransaksiPenyaluran::create($request->all());
        PenerimaProgram::find($request->id_penerima_program)->update(['status_penerimaan' => 'selesai']);
        return response()->json($transaksi->load('penerimaProgram'), 201);
    }

    public function updateTransaksi(Request $request, $id)
    {
        $transaksi = TransaksiPenyaluran::findOrFail($id);
        $transaksi->update($request->all());
        return response()->json($transaksi->load('penerimaProgram'));
    }

    public function reports()
    {
        $reports = LaporanTransparansi::with(['program', 'admin'])
            ->latest('tanggal_publikasi')->paginate(10);
        return response()->json($reports);
    }

    public function createReport(Request $request)
    {
        $request->validate([
            'id_program' => 'required|exists:program_bantuan,id_program',
            'judul_laporan' => 'required|string|max:200',
            'tanggal_publikasi' => 'required|date',
        ]);
        $report = LaporanTransparansi::create([
            ...$request->all(), 
            'created_by' => $request->user()->id_admin
        ]);
        return response()->json($report->load(['program', 'admin']), 201);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfile(Request $request)
    {
        $admin = $request->user();
        $admin->update($request->only(['full_name', 'nomor_telepon']));
        return response()->json($admin);
    }
}

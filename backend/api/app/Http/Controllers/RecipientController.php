<?php

namespace App\Http\Controllers;

use App\Models\ProgramBantuan;
use App\Models\PenerimaProgram;
use App\Models\DokumenVerifikasi;
use App\Models\TransaksiPenyaluran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class RecipientController extends Controller
{
    public function dashboard(Request $request)
    {
        $penerima = $request->user();
        
        // Get recipient statistics
        $totalPrograms = $penerima->penerimaPrograms()->count();
        $approvedPrograms = $penerima->penerimaPrograms()
            ->where('status_penerimaan', 'menunggu')->count();
        $pendingPrograms = 0;
        $completedPrograms = $penerima->penerimaPrograms()
            ->where('status_penerimaan', 'selesai')->count();
        
        // Get recent programs
        $recentPrograms = $penerima->penerimaPrograms()
            ->with([
                'program.kategori',
                'program.donatur',
                'transaksiPenyaluran' => function($query) {
                    $query->orderBy('tanggal_penyaluran', 'desc')->limit(1);
                }
            ])
            ->orderBy('tanggal_penetapan', 'desc')
            ->limit(5)
            ->get()
            ->map(function($pp) {
                $program = $pp->program;
                $latestTransaction = $pp->transaksiPenyaluran->first();
                
                $totalReceived = $pp->transaksiPenyaluran->sum('jumlah_diterima');
                $progress = $program->jumlah_bantuan > 0 
                    ? min(100, round(($totalReceived / $program->jumlah_bantuan) * 100))
                    : 0;
                
                return [
                    'id' => $program->id_program,
                    'title' => $program->nama_program,
                    'donor' => $program->donatur->nama_organisasi ?? $program->donatur->nama_lengkap ?? 'N/A',
                    'status' => $pp->status_penerimaan,
                    'type' => ucfirst($program->jenis_bantuan),
                    'start' => $program->tanggal_mulai->format('d M Y'),
                    'end' => $program->tanggal_selesai->format('d M Y'),
                    'amount' => $program->jenis_bantuan === 'uang' 
                        ? 'Rp ' . number_format($program->jumlah_bantuan, 0, ',', '.')
                        : null,
                    'goods' => $program->jenis_bantuan === 'barang' 
                        ? $program->keterangan 
                        : null,
                    'progress' => $progress,
                    'latest_transaction' => $latestTransaction ? [
                        'date' => $latestTransaction->tanggal_penyaluran->format('d M Y'),
                        'time' => $latestTransaction->jam_penyaluran,
                        'location' => $latestTransaction->lokasi_penyaluran,
                        'amount' => $latestTransaction->jumlah_diterima,
                    ] : null,
                ];
            });
        
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $penerima->id_penerima,
                'name' => $penerima->nama_kepala,
                'no_kk' => $penerima->no_kk,
                'status_verifikasi' => $penerima->status_verifikasi,
                'alamat' => $penerima->alamat,
                'nomor_telepon' => $penerima->nomor_telepon,
            ],
            'stats' => [
                'total_programs' => $totalPrograms,
                'approved_programs' => $approvedPrograms,
                'pending_programs' => $pendingPrograms,
                'completed_programs' => $completedPrograms,
                'status_verifikasi' => $penerima->status_verifikasi,
            ],
            'recent_programs' => $recentPrograms,
        ]);
    }

    public function programs(Request $request)
    {
        $query = ProgramBantuan::where('status', 'aktif')
            ->with(['kategori', 'donatur']);

        if ($request->has('kategori') && $request->kategori != '') {
            $query->where('id_kategori', $request->kategori);
        }

        if ($request->has('jenis') && $request->jenis != '') {
            $query->where('jenis_bantuan', $request->jenis);
        }

        if ($request->has('search') && $request->search != '') {
            $query->where('nama_program', 'like', '%' . $request->search . '%');
        }

        $penerima = $request->user();
        
        $programs = $query->orderBy('tanggal_mulai', 'desc')->get()->map(function($program) use ($penerima) {
            // Check if recipient received this program
            $received = $penerima->penerimaPrograms()
                ->where('id_program', $program->id_program)
                ->where('status_penerimaan', 'selesai')
                ->exists();
            
            // Calculate progress
            $totalPenerima = $program->penerimaPrograms()->count();
            $selesai = $program->penerimaPrograms()->where('status_penerimaan', 'selesai')->count();
            $progress = $totalPenerima > 0 ? round(($selesai / $totalPenerima) * 100) : 0;
            
            return [
                'id' => $program->id_program,
                'title' => $program->nama_program,
                'donor' => $program->donatur->nama_organisasi ?? $program->donatur->nama_lengkap ?? 'N/A',
                'category' => $program->kategori->nama_kategori ?? 'N/A',
                'type' => ucfirst($program->jenis_bantuan),
                'start' => $program->tanggal_mulai->format('d M Y'),
                'end' => $program->tanggal_selesai->format('d M Y'),
                'amount' => $program->jenis_bantuan === 'uang' 
                    ? 'Rp ' . number_format($program->jumlah_bantuan, 0, ',', '.')
                    : null,
                'goods' => $program->jenis_bantuan === 'barang' 
                    ? $program->jumlah_bantuan . ' paket'
                    : null,
                'description' => $program->keterangan,
                'status' => ucfirst($program->status),
                'progress' => $progress,
                'progress_note' => "$selesai dari $totalPenerima penerima",
                'received' => $received,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $programs,
        ]);
    }

    public function programDetail(Request $request, $id)
    {
        $program = ProgramBantuan::with(['kategori', 'donatur', 'penerimaPrograms.penerima'])
            ->findOrFail($id);

        $penerima = $request->user();
        $hasApplied = $penerima->penerimaPrograms()
            ->where('id_program', $id)
            ->exists();

        return response()->json([
            'success' => true,
            'program' => [
                'id' => $program->id_program,
                'title' => $program->nama_program,
                'donor' => $program->donatur->nama_organisasi ?? $program->donatur->nama_lengkap ?? 'N/A',
                'category' => $program->kategori->nama_kategori ?? 'N/A',
                'type' => $program->jenis_bantuan,
                'start' => $program->tanggal_mulai->format('d M Y'),
                'end' => $program->tanggal_selesai->format('d M Y'),
                'amount' => $program->jenis_bantuan === 'uang' 
                    ? 'Rp ' . number_format($program->jumlah_bantuan, 0, ',', '.')
                    : null,
                'description' => $program->keterangan,
                'status' => $program->status,
                'has_applied' => $hasApplied,
            ],
        ]);
    }

    public function applyProgram(Request $request, $id)
    {
        $penerima = $request->user();
        $program = ProgramBantuan::findOrFail($id);

        if ($penerima->status_verifikasi !== 'terverifikasi') {
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda belum terverifikasi. Silakan hubungi admin.',
            ], 403);
        }

        $existing = PenerimaProgram::where('id_penerima', $penerima->id_penerima)
            ->where('id_program', $id)
            ->first();

        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Anda sudah terdaftar dalam program ini.',
            ], 400);
        }

        PenerimaProgram::create([
            'id_penerima' => $penerima->id_penerima,
            'id_program' => $id,
            'tanggal_penetapan' => now(),
            'status_penerimaan' => 'menunggu',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Berhasil mendaftar program bantuan.',
        ], 201);
    }

    public function applications(Request $request)
    {
        $penerima = $request->user();
        
        $applications = $penerima->penerimaPrograms()
            ->with('program.donatur')
            ->orderBy('tanggal_penetapan', 'desc')
            ->get()
            ->map(function($pp) {
                return [
                    'id' => $pp->id_penerima_program,
                    'program' => [
                        'id' => $pp->program->id_program,
                        'title' => $pp->program->nama_program,
                        'donor' => $pp->program->donatur->nama_organisasi ?? $pp->program->donatur->nama_lengkap ?? 'N/A',
                    ],
                    'status' => $pp->status_penerimaan,
                    'date' => $pp->tanggal_penetapan->format('d M Y'),
                ];
            });

        return response()->json([
            'success' => true,
            'applications' => $applications,
        ]);
    }

    public function profile(Request $request)
    {
        $penerima = $request->user();

        return response()->json([
            'success' => true,
            'profile' => [
                'id_penerima' => $penerima->id_penerima,
                'no_kk' => $penerima->no_kk,
                'nama_kepala' => $penerima->nama_kepala,
                'alamat' => $penerima->alamat,
                'nomor_telepon' => $penerima->nomor_telepon,
                'pekerjaan' => $penerima->pekerjaan,
                'penghasilan' => $penerima->penghasilan,
                'jumlah_tanggungan' => $penerima->jumlah_tanggungan,
                'pekerjaan_istri' => $penerima->pekerjaan_istri,
                'status_anak' => $penerima->status_anak,
                'status_verifikasi' => $penerima->status_verifikasi,
                'created_at' => $penerima->created_at,
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $penerima = $request->user();
        
        $request->validate([
            'nama_kepala' => 'string|max:100',
            'nomor_telepon' => 'nullable|string|max:15',
            'alamat' => 'nullable|string',
            'pekerjaan' => 'nullable|string|max:100',
            'pekerjaan_istri' => 'nullable|string|max:100',
            'status_anak' => 'nullable|string|max:100',
            'penghasilan' => 'nullable|string|max:100',
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

        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui',
            'profile' => $penerima,
        ]);
    }

    public function uploadDocument(Request $request)
    {
        $penerima = $request->user();

        $request->validate([
            'jenis_dokumen' => 'required|in:ktp,kk,surat_keterangan,lainnya',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        $file = $request->file('file');
        $filename = time() . '_' . $file->getClientOriginalName();
        $path = $file->storeAs('documents', $filename, 'public');

        $dokumen = DokumenVerifikasi::create([
            'id_penerima' => $penerima->id_penerima,
            'jenis_dokumen' => $request->jenis_dokumen,
            'nama_file' => $filename,
            'path_file' => $path,
            'status_verifikasi' => 'pending',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Dokumen berhasil diunggah',
            'document' => $dokumen,
        ], 201);
    }

    public function schedules(Request $request)
    {
        $penerima = $request->user();

        $schedules = TransaksiPenyaluran::whereHas('penerimaProgram', function($query) use ($penerima) {
                $query->where('id_penerima', $penerima->id_penerima);
            })
            ->with('penerimaProgram.program')
            ->orderBy('tanggal_penyaluran', 'desc')
            ->get()
            ->map(function($transaksi) {
                return [
                    'id' => $transaksi->id_transaksi,
                    'program' => $transaksi->penerimaProgram->program->nama_program,
                    'date' => $transaksi->tanggal_penyaluran->format('d M Y'),
                    'time' => $transaksi->jam_penyaluran,
                    'location' => $transaksi->lokasi_penyaluran,
                    'amount' => $transaksi->jumlah_diterima,
                    'status' => $transaksi->status_penyaluran,
                ];
            });

        return response()->json([
            'success' => true,
            'schedules' => $schedules,
        ]);
    }

    public function programSchedules(Request $request, $id)
    {
        $penerima = $request->user();

        $penerimaProgram = PenerimaProgram::where('id_penerima', $penerima->id_penerima)
            ->where('id_program', $id)
            ->firstOrFail();

        $schedules = TransaksiPenyaluran::where('id_penerima_program', $penerimaProgram->id_penerima_program)
            ->orderBy('tanggal_penyaluran', 'desc')
            ->get()
            ->map(function($transaksi) {
                return [
                    'id' => $transaksi->id_transaksi,
                    'date' => $transaksi->tanggal_penyaluran->format('d M Y'),
                    'time' => $transaksi->jam_penyaluran,
                    'location' => $transaksi->lokasi_penyaluran,
                    'amount' => $transaksi->jumlah_diterima,
                    'status' => $transaksi->status_penyaluran,
                ];
            });

        return response()->json([
            'success' => true,
            'schedules' => $schedules,
        ]);
    }
}

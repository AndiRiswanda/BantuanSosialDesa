<?php

namespace App\Http\Controllers;

use App\Models\Donatur;
use App\Models\Penerima;
use Illuminate\Http\Request;
use App\Models\ProgramBantuan;
use App\Models\KategoriBantuan;
use App\Models\PenerimaProgram;
use App\Models\DokumentasiProgram;
use Illuminate\Support\Facades\DB;
use App\Models\LaporanTransparansi;
use App\Models\TransaksiPenyaluran;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    public function dashboard()
    {
        // Statistics
        $stats = [
            'total_donors' => Donatur::where('status', 'aktif')->count(),
            'total_recipients' => Penerima::where('status_verifikasi', 'disetujui')->count(),
            'total_programs' => ProgramBantuan::count(),
            'active_programs' => ProgramBantuan::where('status', 'aktif')->count(),
            'pending_programs' => ProgramBantuan::where('status', 'pending')->count(),
            'total_bantuan_uang' => ProgramBantuan::where('jenis_bantuan', 'uang')->sum('jumlah_bantuan'),
            'total_bantuan_barang' => ProgramBantuan::where('jenis_bantuan', 'barang')->sum('jumlah_bantuan'),
            'pending_donor_verifications' => Donatur::where('status', 'nonaktif')->count(),
            'pending_recipient_verifications' => Penerima::where('status_verifikasi', 'pending')->count(),
            'completed_distributions' => TransaksiPenyaluran::where('status_penyaluran', 'selesai')->count(),
            'pending_distributions' => TransaksiPenyaluran::where('status_penyaluran', 'dijadwalkan')->count(),
        ];

        // Recent activities
        $recentPrograms = ProgramBantuan::with(['kategori', 'donatur'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function($program) {
                return [
                    'id' => $program->id_program,
                    'nama_program' => $program->nama_program,
                    'donatur' => $program->donatur->nama_organisasi ?? $program->donatur->nama_lengkap,
                    'kategori' => $program->kategori->nama_kategori,
                    'jenis_bantuan' => $program->jenis_bantuan,
                    'jumlah_bantuan' => $program->jumlah_bantuan,
                    'status' => $program->status,
                    'tanggal_mulai' => $program->tanggal_mulai->format('d M Y'),
                ];
            });

        $recentTransactions = TransaksiPenyaluran::with(['penerimaProgram.program', 'penerimaProgram.penerima'])
            ->latest('tanggal_penyaluran')
            ->limit(5)
            ->get()
            ->map(function($transaksi) {
                return [
                    'id' => $transaksi->id_transaksi,
                    'program' => $transaksi->penerimaProgram->program->nama_program,
                    'penerima' => $transaksi->penerimaProgram->penerima->nama_kepala,
                    'jumlah' => $transaksi->jumlah_diterima,
                    'tanggal' => $transaksi->tanggal_penyaluran->format('d M Y'),
                    'status' => $transaksi->status_penyaluran,
                ];
            });

        // Program distribution by category
        $programByCategory = KategoriBantuan::withCount('programBantuan')
            ->having('program_bantuan_count', '>', 0)
            ->get()
            ->map(function($kategori) {
                return [
                    'kategori' => $kategori->nama_kategori,
                    'jumlah' => $kategori->program_bantuan_count,
                ];
            });

        // Distribusi tre
        $monthlyTrend = TransaksiPenyaluran::select(
                DB::raw('DATE_FORMAT(tanggal_penyaluran, "%Y-%m") as bulan'),
                DB::raw('COUNT(*) as jumlah'),
                DB::raw('SUM(jumlah_diterima) as total')
            )
            ->where('tanggal_penyaluran', '>=', now()->subMonths(6))
            ->groupBy('bulan')
            ->orderBy('bulan')
            ->get();

        return response()->json([
            'success' => true,
            'stats' => $stats,
            'recent_programs' => $recentPrograms,
            'recent_transactions' => $recentTransactions,
            'program_by_category' => $programByCategory,
            'monthly_trend' => $monthlyTrend,
        ]);
    }

    public function programs(Request $request)
    {
        $query = ProgramBantuan::with(['kategori', 'donatur']);

        // Filter by status
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        // Filter by category
        if ($request->has('id_kategori') && $request->id_kategori != '') {
            $query->where('id_kategori', $request->id_kategori);
        }

        // Filter by jenis bantuan
        if ($request->has('jenis_bantuan') && $request->jenis_bantuan != '') {
            $query->where('jenis_bantuan', $request->jenis_bantuan);
        }

        // Search
        if ($request->has('search') && $request->search != '') {
            $query->where('nama_program', 'like', '%' . $request->search . '%');
        }

        // Sorting - default by updated_at to show recently changed/completed programs first
        $sortField = $request->get('sort_by', 'updated_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $programs = $query->paginate($request->get('per_page', 10));

        // Add statistics for each program
        $programs->getCollection()->transform(function($program) {
            // Load penerimaPrograms with transaksiPenyaluran relationship
            $program->load('penerimaPrograms.transaksiPenyaluran');
            
            $totalPenerima = $program->penerimaPrograms->count();
            
            // Count tersalurkan based on transactions with status 'selesai' (verified by admin)
            $tersalurkan = $program->penerimaPrograms->filter(function($pp) {
                return $pp->transaksiPenyaluran && 
                       $pp->transaksiPenyaluran->where('status_penyaluran', 'selesai')->count() > 0;
            })->count();
            
            $belumTersalurkan = $totalPenerima - $tersalurkan;
            
            $totalDisalurkan = TransaksiPenyaluran::whereHas('penerimaProgram', function($q) use ($program) {
                $q->where('id_program', $program->id_program);
            })->where('status_penyaluran', 'selesai')->sum('jumlah_diterima');

            $program->statistics = [
                'total_penerima' => $totalPenerima,
                'total_tersalurkan' => $tersalurkan,
                'total_belum_tersalurkan' => $belumTersalurkan,
                'total_disalurkan' => $totalDisalurkan,
                'persentase_selesai' => $totalPenerima > 0 ? round(($tersalurkan / $totalPenerima) * 100, 2) : 0,
            ];

            return $program;
        });

        return response()->json([
            'success' => true,
            'data' => $programs,
        ]);
    }

    public function createProgram(Request $request)
    {
        $validated = $request->validate([
            'id_kategori' => 'required|exists:kategori_bantuan,id_kategori',
            'id_donatur' => 'required|exists:donatur,id_donatur',
            'nama_program' => 'required|string|max:150',
            'deskripsi' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'jenis_bantuan' => 'required|in:uang,barang',
            'jumlah_bantuan' => 'required|numeric|min:0',
            'status' => 'required|in:pending,aktif,selesai,ditunda',
        ]);

        // Validate that donor is verified
        $donatur = Donatur::findOrFail($request->id_donatur);
        if ($donatur->status !== 'aktif') {
            return response()->json([
                'success' => false,
                'message' => 'Donatur belum terverifikasi',
            ], 422);
        }

        $program = ProgramBantuan::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Program berhasil dibuat',
            'data' => $program->load(['kategori', 'donatur']),
        ], 201);
    }

    public function updateProgram(Request $request, $id)
    {
        $program = ProgramBantuan::findOrFail($id);
        
        $validated = $request->validate([
            'id_kategori' => 'sometimes|exists:kategori_bantuan,id_kategori',
            'id_donatur' => 'sometimes|exists:donatur,id_donatur',
            'nama_program' => 'sometimes|string|max:150',
            'deskripsi' => 'nullable|string',
            'keterangan' => 'nullable|string',
            'tanggal_mulai' => 'sometimes|date',
            'tanggal_selesai' => 'nullable|date|after_or_equal:tanggal_mulai',
            'jenis_bantuan' => 'sometimes|in:uang,barang',
            'jumlah_bantuan' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|in:pending,aktif,selesai,ditunda',
        ]);

        $program->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Program berhasil diperbarui',
            'data' => $program->load(['kategori', 'donatur']),
        ]);
    }

    public function deleteProgram($id)
    {
        $program = ProgramBantuan::findOrFail($id);
        
        // Check if program has recipients
        $totalPenerima = $program->penerimaPrograms()->count();
        if ($totalPenerima > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Program tidak dapat dihapus karena sudah memiliki penerima',
            ], 400);
        }

        // Check if program has transactions
        $hasTransactions = TransaksiPenyaluran::whereHas('penerimaProgram', function($q) use ($id) {
            $q->where('id_program', $id);
        })->exists();

        if ($hasTransactions) {
            return response()->json([
                'success' => false,
                'message' => 'Program tidak dapat dihapus karena sudah memiliki transaksi',
            ], 400);
        }

        $program->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Program berhasil dihapus',
        ]);
    }

    public function pendingPrograms(Request $request)
    {
        $query = ProgramBantuan::with(['kategori', 'donatur'])
            ->where('status', 'pending');

        // Search
        if ($request->has('search') && $request->search != '') {
            $query->where('nama_program', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $sortField = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $programs = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'message' => 'Daftar program menunggu persetujuan',
            'data' => $programs,
        ]);
    }

    public function approveProgram($id)
    {
        $program = ProgramBantuan::with(['kategori', 'donatur'])->findOrFail($id);
        
        if ($program->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Program tidak dalam status pending',
            ], 400);
        }

        $program->update(['status' => 'aktif']);
        
        return response()->json([
            'success' => true,
            'message' => 'Program berhasil disetujui dan sekarang aktif',
            'data' => $program->fresh(['kategori', 'donatur']),
        ]);
    }

    public function rejectProgram(Request $request, $id)
    {
        $program = ProgramBantuan::with(['kategori', 'donatur'])->findOrFail($id);
        
        if ($program->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Program tidak dalam status pending',
            ], 400);
        }

        $validated = $request->validate([
            'alasan_penolakan' => 'required|string|max:500',
        ]);

        // Update status to ditolak with rejection reason
        $program->update([
            'status' => 'ditolak',
            'alasan_penolakan' => $validated['alasan_penolakan'],
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Program berhasil ditolak',
            'data' => $program->fresh(['kategori', 'donatur']),
        ]);
    }

    public function rejectedPrograms(Request $request)
    {
        $query = ProgramBantuan::with(['kategori', 'donatur'])
            ->where('status', 'ditolak');

        // Search
        if ($request->has('search') && $request->search != '') {
            $query->where('nama_program', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $sortField = $request->get('sort_by', 'updated_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $programs = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'message' => 'Daftar program yang ditolak',
            'data' => $programs,
        ]);
    }

    public function completedPrograms(Request $request)
    {
        $query = ProgramBantuan::with(['kategori', 'donatur'])
            ->where('status', 'aktif')
            ->whereHas('penerimaPrograms', function($q) {
                // Only include programs that have recipients
                $q->whereNotNull('id_penerima');
            });

        // Filter only programs where all recipients are verified (100% progress)
        $query->whereRaw('(
            SELECT COUNT(*) 
            FROM penerima_program pp 
            WHERE pp.id_program = program_bantuan.id_program
        ) = (
            SELECT COUNT(DISTINCT tp.id_penerima_program) 
            FROM transaksi_penyaluran tp
            JOIN penerima_program pp2 ON tp.id_penerima_program = pp2.id_penerima_program
            WHERE pp2.id_program = program_bantuan.id_program 
            AND tp.status_penyaluran = "selesai"
        )');

        // Search
        if ($request->has('search') && $request->search != '') {
            $query->where('nama_program', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $sortField = $request->get('sort_by', 'updated_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $programs = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'message' => 'Daftar program yang sudah selesai',
            'data' => $programs,
        ]);
    }

    public function scheduledPrograms(Request $request)
    {
        $query = ProgramBantuan::with(['kategori', 'donatur'])
            ->where('status', 'aktif')
            ->whereHas('penerimaPrograms', function($q) {
                // Only include programs that have recipients
                $q->whereNotNull('id_penerima');
            });

        // Filter only programs where NOT all recipients are verified (progress < 100%)
        $query->whereRaw('(
            SELECT COUNT(*) 
            FROM penerima_program pp 
            WHERE pp.id_program = program_bantuan.id_program
        ) > (
            SELECT COUNT(DISTINCT tp.id_penerima_program) 
            FROM transaksi_penyaluran tp
            JOIN penerima_program pp2 ON tp.id_penerima_program = pp2.id_penerima_program
            WHERE pp2.id_program = program_bantuan.id_program 
            AND tp.status_penyaluran = "selesai"
        )');

        // Search
        if ($request->has('search') && $request->search != '') {
            $query->where('nama_program', 'like', '%' . $request->search . '%');
        }

        // Sorting
        $sortField = $request->get('sort_by', 'updated_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortField, $sortOrder);

        $programs = $query->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'message' => 'Daftar program terjadwal yang belum selesai',
            'data' => $programs,
        ]);
    }

    public function programDetail($id)
    {
        $program = ProgramBantuan::with([
            'kategori', 
            'donatur', 
            'penerimaPrograms.penerima',
            'penerimaPrograms.transaksiPenyaluran'
        ])->findOrFail($id);
        
        // Add statistics - count based on verified transactions (status_penyaluran = 'selesai')
        $totalPenerima = $program->penerimaPrograms->count();
        
        // Count tersalurkan based on transactions with status 'selesai' (verified by admin)
        $totalTersalurkan = $program->penerimaPrograms->filter(function($pp) {
            return $pp->transaksiPenyaluran && $pp->transaksiPenyaluran->where('status_penyaluran', 'selesai')->count() > 0;
        })->count();
        
        $totalBelumTersalurkan = $totalPenerima - $totalTersalurkan;
        
        $totalDisalurkan = TransaksiPenyaluran::whereHas('penerimaProgram', function($q) use ($program) {
            $q->where('id_program', $program->id_program);
        })->sum('jumlah_diterima');

        $program->statistics = [
            'total_penerima' => $totalPenerima,
            'total_tersalurkan' => $totalTersalurkan,
            'total_belum_tersalurkan' => $totalBelumTersalurkan,
            'penerima_menunggu' => $totalBelumTersalurkan, // Alias for backward compatibility
            'penerima_selesai' => $totalTersalurkan, // Alias for backward compatibility
            'total_disalurkan' => $totalDisalurkan,
            'persentase_selesai' => $totalPenerima > 0 ? round(($totalTersalurkan / $totalPenerima) * 100, 2) : 0,
        ];
        
        // Add recipients alias for easier access
        $program->recipients = $program->penerimaPrograms;

        // Get schedules with automatic status calculation
        $allTransactions = TransaksiPenyaluran::whereHas('penerimaProgram', function($q) use ($id) {
            $q->where('id_program', $id);
        })
        ->orderBy('tanggal_penyaluran')
        ->orderBy('jam_penyaluran')
        ->get()
        ->groupBy(function($item) {
            return $item->tanggal_penyaluran->format('Y-m-d') . '|' . $item->jam_penyaluran . '|' . $item->lokasi_penyaluran . '|' . $item->catatan;
        });

        $schedules = $allTransactions->map(function($group) {
            $first = $group->first();
            
            // Check if all recipients in this schedule have completed
            $allCompleted = $group->every(function($transaction) {
                return $transaction->status_penyaluran === 'selesai';
            });
            
            // Check if schedule date has passed
            $scheduleDatetime = \Carbon\Carbon::parse($first->tanggal_penyaluran->format('Y-m-d') . ' ' . $first->jam_penyaluran);
            $isPast = $scheduleDatetime->isPast();
            
            // Status is 'selesai' if all recipients completed OR date has passed
            $scheduleStatus = ($allCompleted || $isPast) ? 'selesai' : 'dijadwalkan';
            
            return [
                'id' => $first->id_transaksi,
                'tanggal_penyaluran' => $first->tanggal_penyaluran->format('Y-m-d'),
                'jam_penyaluran' => $first->jam_penyaluran,
                'lokasi_penyaluran' => $first->lokasi_penyaluran,
                'catatan' => $first->catatan,
                'status' => $scheduleStatus,
                'jumlah_penerima' => $group->count(),
            ];
        })->values();

        // Get dokumentasi
        $dokumentasi = DokumentasiProgram::where('id_program', $id)
            ->latest()
            ->get()
            ->map(function($doc) {
                return [
                    'id' => $doc->id_dokumentasi,
                    'judul' => $doc->judul,
                    'deskripsi' => $doc->deskripsi,
                    'file_name' => $doc->file_name,
                    'file_path' => asset('storage/' . $doc->file_path),
                    'file_type' => $doc->file_type,
                    'file_size' => $doc->file_size,
                    'tanggal_upload' => $doc->tanggal_upload->format('d M Y'),
                    'uploaded_by' => 'Admin',
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $program,
            'schedules' => $schedules,
            'dokumentasi' => $dokumentasi,
        ]);
    }

    public function pendingDonors(Request $request)
    {
        $query = Donatur::where('status', 'nonaktif');

        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('nama_lengkap', 'like', '%' . $request->search . '%')
                  ->orWhere('nama_organisasi', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%');
            });
        }

        $donors = $query->latest()->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $donors,
        ]);
    }

    public function verifyDonor(Request $request, $id)
    {
        $donor = Donatur::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:aktif,nonaktif',
            'catatan' => 'nullable|string',
        ]);

        $donor->update([
            'status' => $validated['status'],
        ]);

        return response()->json([
            'success' => true,
            'message' => $validated['status'] === 'aktif' 
                ? 'Donatur berhasil diverifikasi' 
                : 'Verifikasi donatur ditolak',
            'data' => $donor,
        ]);
    }

    public function pendingRecipients(Request $request)
    {
        $query = Penerima::where('status_verifikasi', 'pending')
            ->with('dokumenVerifikasi');

        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('nama_kepala', 'like', '%' . $request->search . '%')
                  ->orWhere('no_kk', 'like', '%' . $request->search . '%');
            });
        }

        $recipients = $query->latest()->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $recipients,
        ]);
    }

    public function verifyRecipient(Request $request, $id)
    {
        $recipient = Penerima::findOrFail($id);
        
        $validated = $request->validate([
            'status_verifikasi' => 'required|in:disetujui,ditolak',
            'catatan' => 'nullable|string',
        ]);

        $recipient->update([
            'status_verifikasi' => $validated['status_verifikasi'],
        ]);

        return response()->json([
            'success' => true,
            'message' => $validated['status_verifikasi'] === 'disetujui' 
                ? 'Penerima berhasil diverifikasi' 
                : 'Verifikasi penerima ditolak',
            'data' => $recipient,
        ]);
    }

    public function allVerifications(Request $request)
    {
        $pendingDonors = Donatur::where('status', 'nonaktif')
            ->latest()
            ->get();
        
        $pendingRecipients = Penerima::where('status_verifikasi', 'pending')
            ->with('dokumenVerifikasi')
            ->latest()
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'pending_donors' => $pendingDonors,
                'pending_recipients' => $pendingRecipients,
                'total_pending' => $pendingDonors->count() + $pendingRecipients->count(),
            ],
        ]);
    }

    public function donors(Request $request)
    {
        $query = Donatur::with('programBantuan');

        // Filter by status
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        // Search
        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('nama_organisasi', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('nomor_telepon', 'like', '%' . $request->search . '%');
            });
        }

        // Order by latest first
        $query->latest('id_donatur');

        $donors = $query->paginate($request->get('per_page', 10));

        // Add statistics
        $donors->getCollection()->transform(function($donor) {
            $donor->total_programs = $donor->programBantuan->count();
            $donor->active_programs = $donor->programBantuan->where('status', 'aktif')->count();
            $donor->total_contribution = $donor->programBantuan->sum('jumlah_bantuan');
            return $donor;
        });

        return response()->json([
            'success' => true,
            'data' => $donors,
        ]);
    }

    public function donorDetail($id)
    {
        // Load donor with programs, exclude rejected programs
        $donor = Donatur::with(['programBantuan' => function ($query) {
            $query->where('status', '!=', 'ditolak');
        }, 'programBantuan.kategori'])->findOrFail($id);
        
        // Add verified and completed recipient count to each program based on transaksi_penyaluran
        $donor->programBantuan->each(function ($program) {
            // Count recipients who have transactions with status 'selesai' (verified by admin)
            $program->penerima_tersalurkan = TransaksiPenyaluran::whereHas('penerimaProgram', function($q) use ($program) {
                $q->where('id_program', $program->id_program);
            })
            ->where('status_penyaluran', 'selesai')
            ->distinct('id_penerima_program')
            ->count('id_penerima_program');
            
            // Total penerima in this program
            $program->total_penerima = PenerimaProgram::where('id_program', $program->id_program)->count();
        });
        
        // Add statistics (only count verified recipients with completed distributions)
        $programIds = $donor->programBantuan->pluck('id_program');
        $donor->statistics = [
            'total_programs' => $donor->programBantuan->count(),
            'active_programs' => $donor->programBantuan->where('status', 'aktif')->count(),
            'total_contribution' => $donor->programBantuan->sum('jumlah_bantuan'),
            'total_recipients' => TransaksiPenyaluran::whereHas('penerimaProgram', function($q) use ($programIds) {
                $q->whereIn('id_program', $programIds);
            })
            ->where('status_penyaluran', 'selesai')
            ->distinct('id_penerima_program')
            ->count('id_penerima_program'),
        ];

        return response()->json([
            'success' => true,
            'data' => $donor,
        ]);
    }

    public function updateDonor(Request $request, $id)
    {
        $donor = Donatur::findOrFail($id);
        
        $validated = $request->validate([
            'nama_lengkap' => 'sometimes|string|max:100',
            'nama_organisasi' => 'nullable|string|max:150',
            'email' => 'sometimes|email|max:100',
            'alamat' => 'nullable|string',
            'nomor_telepon' => 'nullable|string|max:15',
            'status' => 'sometimes|in:aktif,nonaktif',
        ]);

        $donor->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Data donatur berhasil diperbarui',
            'data' => $donor,
        ]);
    }

    public function deleteDonor($id)
    {
        $donor = Donatur::findOrFail($id);
        
        // Check if donor has active programs
        $activePrograms = $donor->programBantuan()->where('status', 'aktif')->count();
        if ($activePrograms > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus donatur yang memiliki program aktif',
            ], 400);
        }

        $donor->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Donatur berhasil dihapus',
        ]);
    }

    public function recipients(Request $request)
    {
        $query = Penerima::with('penerimaPrograms.program');

        // Filter by verification status
        if ($request->has('status_verifikasi') && $request->status_verifikasi != '') {
            $query->where('status_verifikasi', $request->status_verifikasi);
        }

        // Search
        if ($request->has('search') && $request->search != '') {
            $query->where(function($q) use ($request) {
                $q->where('nama_kepala', 'like', '%' . $request->search . '%')
                  ->orWhere('no_kk', 'like', '%' . $request->search . '%')
                  ->orWhere('nomor_telepon', 'like', '%' . $request->search . '%');
            });
        }

        // Order by latest first
        $query->latest('id_penerima');

        $recipients = $query->paginate($request->get('per_page', 10));

        // Add statistics
        $recipients->getCollection()->transform(function($recipient) {
            $recipient->total_programs = $recipient->penerimaPrograms->count();
            $recipient->completed_programs = $recipient->penerimaPrograms->where('status_penerimaan', 'selesai')->count();
            $recipient->total_received = TransaksiPenyaluran::whereHas('penerimaProgram', function($q) use ($recipient) {
                $q->where('id_penerima', $recipient->id_penerima);
            })->sum('jumlah_diterima');
            return $recipient;
        });

        return response()->json([
            'success' => true,
            'data' => $recipients,
        ]);
    }

    public function recipientDetail($id)
    {
        $recipient = Penerima::with(['penerimaPrograms.program', 'dokumenVerifikasi'])
            ->findOrFail($id);
        
        // Add detailed statistics
        $recipient->statistics = [
            'total_programs' => $recipient->penerimaPrograms->count(),
            'active_programs' => $recipient->penerimaPrograms->where('status_penerimaan', 'menunggu')->count(),
            'completed_programs' => $recipient->penerimaPrograms->where('status_penerimaan', 'selesai')->count(),
            'total_received' => TransaksiPenyaluran::whereHas('penerimaProgram', function($q) use ($recipient) {
                $q->where('id_penerima', $recipient->id_penerima);
            })->sum('jumlah_diterima'),
        ];

        return response()->json([
            'success' => true,
            'data' => $recipient,
        ]);
    }

    public function updateRecipient(Request $request, $id)
    {
        $recipient = Penerima::findOrFail($id);
        
        $validated = $request->validate([
            'nama_kepala' => 'sometimes|string|max:100',
            'no_kk' => 'sometimes|string|digits:16',
            'alamat' => 'nullable|string',
            'nomor_telepon' => 'nullable|string|max:15',
            'pekerjaan' => 'nullable|string|max:100',
            'penghasilan' => 'nullable|string|max:100',
            'jumlah_tanggungan' => 'sometimes|integer|min:0',
            'pekerjaan_istri' => 'nullable|string|max:100',
            'status_anak' => 'nullable|string|max:100',
            'status_verifikasi' => 'sometimes|in:belum_mengajukan,pending,disetujui,ditolak',
        ]);

        $recipient->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Data penerima berhasil diperbarui',
            'data' => $recipient,
        ]);
    }

    public function deleteRecipient($id)
    {
        $recipient = Penerima::findOrFail($id);
        
        // Check if recipient has active programs
        $activePrograms = $recipient->penerimaPrograms()
            ->where('status_penerimaan', 'menunggu')
            ->count();
            
        if ($activePrograms > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus penerima yang masih memiliki program aktif',
            ], 400);
        }

        $recipient->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Penerima berhasil dihapus',
        ]);
    }

    public function categories(Request $request)
    {
        $query = KategoriBantuan::withCount('programBantuan');

        // Filter by status
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }

        // Filter by jenis bantuan
        if ($request->has('jenis_bantuan') && $request->jenis_bantuan != '') {
            $query->where('jenis_bantuan', $request->jenis_bantuan);
        }

        // Search
        if ($request->has('search') && $request->search != '') {
            $query->where('nama_kategori', 'like', '%' . $request->search . '%');
        }

        $categories = $query->get();

        return response()->json([
            'success' => true,
            'data' => $categories,
        ]);
    }

    public function createCategory(Request $request)
    {
        $validated = $request->validate([
            'nama_kategori' => 'required|string|max:100|unique:kategori_bantuan',
            'deskripsi' => 'nullable|string',
            'jenis_bantuan' => 'required|in:uang,barang',
            'status' => 'required|in:aktif,nonaktif',
        ]);
        
        $category = KategoriBantuan::create($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dibuat',
            'data' => $category,
        ], 201);
    }

    public function updateCategory(Request $request, $id)
    {
        $category = KategoriBantuan::findOrFail($id);
        
        $validated = $request->validate([
            'nama_kategori' => 'sometimes|string|max:100|unique:kategori_bantuan,nama_kategori,' . $id . ',id_kategori',
            'deskripsi' => 'nullable|string',
            'jenis_bantuan' => 'sometimes|in:uang,barang',
            'status' => 'sometimes|in:aktif,nonaktif',
        ]);
        
        $category->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil diperbarui',
            'data' => $category,
        ]);
    }

    public function deleteCategory($id)
    {
        $category = KategoriBantuan::findOrFail($id);
        
        // Check if category has programs
        if ($category->programBantuan()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Kategori tidak dapat dihapus karena sudah memiliki program',
            ], 400);
        }

        $category->delete();
        
        return response()->json([
            'success' => true,
            'message' => 'Kategori berhasil dihapus',
        ]);
    }

    public function penerimaPrograms(Request $request)
    {
        $query = PenerimaProgram::with(['program', 'penerima', 'admin']);
        
        // Filter by status
        if ($request->has('status') && $request->status != '') {
            $query->where('status_penerimaan', $request->status);
        }
        
        // Filter by program
        if ($request->has('id_program') && $request->id_program != '') {
            $query->where('id_program', $request->id_program);
        }

        // Filter by penerima
        if ($request->has('id_penerima') && $request->id_penerima != '') {
            $query->where('id_penerima', $request->id_penerima);
        }

        // Search
        if ($request->has('search') && $request->search != '') {
            $query->whereHas('penerima', function($q) use ($request) {
                $q->where('nama_kepala', 'like', '%' . $request->search . '%')
                  ->orWhere('no_kk', 'like', '%' . $request->search . '%');
            });
        }

        $penerimaPrograms = $query->latest()->paginate($request->get('per_page', 10));

        // Add transaction info
        $penerimaPrograms->getCollection()->transform(function($pp) {
            $pp->total_received = $pp->transaksiPenyaluran->sum('jumlah_diterima');
            $pp->transaction_count = $pp->transaksiPenyaluran->count();
            $pp->latest_transaction = $pp->transaksiPenyaluran->sortByDesc('tanggal_penyaluran')->first();
            return $pp;
        });

        return response()->json([
            'success' => true,
            'data' => $penerimaPrograms,
        ]);
    }

    public function assignPenerimaToProgram(Request $request)
    {
        $validated = $request->validate([
            'id_program' => 'required|exists:program_bantuan,id_program',
            'id_penerima' => 'required|exists:penerima,id_penerima',
            'tanggal_penetapan' => 'required|date',
            'status_penerimaan' => 'sometimes|in:menunggu,selesai,batal',
        ]);

        // Check if penerima is verified
        $penerima = Penerima::findOrFail($request->id_penerima);
        if ($penerima->status_verifikasi !== 'disetujui') {
            return response()->json([
                'success' => false,
                'message' => 'Penerima belum disetujui',
            ], 422);
        }

        // Check if already assigned
        $existing = PenerimaProgram::where('id_program', $request->id_program)
            ->where('id_penerima', $request->id_penerima)
            ->first();
            
        if ($existing) {
            return response()->json([
                'success' => false,
                'message' => 'Penerima sudah terdaftar di program ini',
            ], 400);
        }

        $penerimaProgram = PenerimaProgram::create([
            'id_program' => $validated['id_program'],
            'id_penerima' => $validated['id_penerima'],
            'tanggal_penetapan' => $validated['tanggal_penetapan'],
            'status_penerimaan' => $validated['status_penerimaan'] ?? 'menunggu',
            'created_by' => $request->user()->id_admin,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Penerima berhasil ditambahkan ke program',
            'data' => $penerimaProgram->load(['program', 'penerima']),
        ], 201);
    }

    public function updatePenerimaProgram(Request $request, $id)
    {
        $penerimaProgram = PenerimaProgram::findOrFail($id);
        
        $validated = $request->validate([
            'status_penerimaan' => 'required|in:menunggu,selesai,batal',
            'catatan' => 'nullable|string',
        ]);
        
        $penerimaProgram->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Status penerimaan berhasil diperbarui',
            'data' => $penerimaProgram->load(['program', 'penerima']),
        ]);
    }

    public function deletePenerimaProgram($id)
    {
        $penerimaProgram = PenerimaProgram::findOrFail($id);

        // Check if has transactions
        if ($penerimaProgram->transaksiPenyaluran()->count() > 0) {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus karena sudah ada transaksi penyaluran',
            ], 400);
        }

        $penerimaProgram->delete();

        return response()->json([
            'success' => true,
            'message' => 'Penerima program berhasil dihapus',
        ]);
    }

    public function transaksi(Request $request)
    {
        $query = TransaksiPenyaluran::with(['penerimaProgram.program', 'penerimaProgram.penerima']);
        
        // Filter by program
        if ($request->has('id_program') && $request->id_program != '') {
            $query->whereHas('penerimaProgram', function($q) use ($request) {
                $q->where('id_program', $request->id_program);
            });
        }

        // Filter by status
        if ($request->has('status') && $request->status != '') {
            $query->where('status_penyaluran', $request->status);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->start_date != '') {
            $query->where('tanggal_penyaluran', '>=', $request->start_date);
        }
        if ($request->has('end_date') && $request->end_date != '') {
            $query->where('tanggal_penyaluran', '<=', $request->end_date);
        }

        // Search
        if ($request->has('search') && $request->search != '') {
            $query->whereHas('penerimaProgram.penerima', function($q) use ($request) {
                $q->where('nama_kepala', 'like', '%' . $request->search . '%')
                  ->orWhere('no_kk', 'like', '%' . $request->search . '%');
            });
        }

        $transaksi = $query->latest('tanggal_penyaluran')->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $transaksi,
        ]);
    }

    public function createTransaksi(Request $request)
    {
        $validated = $request->validate([
            'id_penerima_program' => 'required|exists:penerima_program,id_penerima_program',
            'tanggal_penyaluran' => 'required|date',
            'jam_penyaluran' => 'required',
            'lokasi_penyaluran' => 'required|string|max:200',
            'jumlah_diterima' => 'required|numeric|min:0',
            'metode_penyaluran' => 'required|in:transfer,tunai,barang',
            'status_penyaluran' => 'sometimes|in:dijadwalkan,selesai,dibatalkan',
            'keterangan' => 'nullable|string',
        ]);

        // Validate penerima program exists and is in correct status
        $penerimaProgram = PenerimaProgram::findOrFail($request->id_penerima_program);
        
        if ($penerimaProgram->status_penerimaan === 'batal') {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat membuat transaksi untuk penerima program yang dibatalkan',
            ], 422);
        }

        // Validate total amount doesn't exceed program amount
        $program = $penerimaProgram->program;
        $totalReceived = $penerimaProgram->transaksiPenyaluran->sum('jumlah_diterima');
        
        if (($totalReceived + $request->jumlah_diterima) > $program->jumlah_bantuan) {
            return response()->json([
                'success' => false,
                'message' => 'Total jumlah yang diterima melebihi jumlah bantuan program',
            ], 422);
        }

        $transaksi = TransaksiPenyaluran::create([
            ...$validated,
            'status_penyaluran' => $validated['status_penyaluran'] ?? 'dijadwalkan',
        ]);

        // Update penerima program status if transaction is completed
        if ($transaksi->status_penyaluran === 'selesai') {
            $penerimaProgram->update(['status_penerimaan' => 'selesai']);
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dibuat',
            'data' => $transaksi->load('penerimaProgram.program', 'penerimaProgram.penerima'),
        ], 201);
    }

    public function updateTransaksi(Request $request, $id)
    {
        $transaksi = TransaksiPenyaluran::findOrFail($id);
        
        $validated = $request->validate([
            'tanggal_penyaluran' => 'sometimes|date',
            'jam_penyaluran' => 'sometimes',
            'lokasi_penyaluran' => 'sometimes|string|max:200',
            'jumlah_diterima' => 'sometimes|numeric|min:0',
            'metode_penyaluran' => 'sometimes|in:transfer,tunai,barang',
            'status_penyaluran' => 'sometimes|in:dijadwalkan,selesai,dibatalkan',
            'keterangan' => 'nullable|string',
        ]);

        $transaksi->update($validated);

        // Update penerima program status based on transaction status
        if (isset($validated['status_penyaluran'])) {
            $penerimaProgram = $transaksi->penerimaProgram;
            
            if ($validated['status_penyaluran'] === 'selesai') {
                $penerimaProgram->update(['status_penerimaan' => 'selesai']);
            } elseif ($validated['status_penyaluran'] === 'dijadwalkan') {
                $penerimaProgram->update(['status_penerimaan' => 'menunggu']);
            } elseif ($validated['status_penyaluran'] === 'dibatalkan') {
                $penerimaProgram->update(['status_penerimaan' => 'batal']);
            }
        }

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil diperbarui',
            'data' => $transaksi->load('penerimaProgram'),
        ]);
    }

    public function deleteTransaksi($id)
    {
        $transaksi = TransaksiPenyaluran::findOrFail($id);

        // Only allow deletion of scheduled transactions
        if ($transaksi->status_penyaluran === 'selesai') {
            return response()->json([
                'success' => false,
                'message' => 'Tidak dapat menghapus transaksi yang sudah selesai',
            ], 400);
        }

        $transaksi->delete();

        return response()->json([
            'success' => true,
            'message' => 'Transaksi berhasil dihapus',
        ]);
    }

    public function transaksiDetail($id)
    {
        $transaksi = TransaksiPenyaluran::with([
            'penerimaProgram.program.kategori',
            'penerimaProgram.program.donatur',
            'penerimaProgram.penerima'
        ])->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $transaksi,
        ]);
    }

    public function reports(Request $request)
    {
        $query = LaporanTransparansi::with(['program', 'admin']);

        // Filter by program
        if ($request->has('id_program') && $request->id_program != '') {
            $query->where('id_program', $request->id_program);
        }

        // Filter by date range
        if ($request->has('start_date') && $request->start_date != '') {
            $query->where('tanggal_publikasi', '>=', $request->start_date);
        }
        if ($request->has('end_date') && $request->end_date != '') {
            $query->where('tanggal_publikasi', '<=', $request->end_date);
        }

        // Search
        if ($request->has('search') && $request->search != '') {
            $query->where('judul_laporan', 'like', '%' . $request->search . '%');
        }

        $reports = $query->latest('tanggal_publikasi')->paginate($request->get('per_page', 10));

        return response()->json([
            'success' => true,
            'data' => $reports,
        ]);
    }

    public function createReport(Request $request)
    {
        $validated = $request->validate([
            'id_program' => 'required|exists:program_bantuan,id_program',
            'judul_laporan' => 'required|string|max:200',
            'isi_laporan' => 'required|string',
            'tanggal_publikasi' => 'required|date',
        ]);
        
        $report = LaporanTransparansi::create([
            ...$validated, 
            'created_by' => $request->user()->id_admin
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Laporan berhasil dibuat',
            'data' => $report->load(['program', 'admin']),
        ], 201);
    }

    public function updateReport(Request $request, $id)
    {
        $report = LaporanTransparansi::findOrFail($id);

        $validated = $request->validate([
            'id_program' => 'sometimes|exists:program_bantuan,id_program',
            'judul_laporan' => 'sometimes|string|max:200',
            'isi_laporan' => 'sometimes|string',
            'tanggal_publikasi' => 'sometimes|date',
        ]);

        $report->update($validated);

        return response()->json([
            'success' => true,
            'message' => 'Laporan berhasil diperbarui',
            'data' => $report->load(['program', 'admin']),
        ]);
    }

    public function deleteReport($id)
    {
        $report = LaporanTransparansi::findOrFail($id);
        $report->delete();

        return response()->json([
            'success' => true,
            'message' => 'Laporan berhasil dihapus',
        ]);
    }

    public function profile(Request $request)
    {
        $admin = $request->user();
        
        return response()->json([
            'success' => true,
            'data' => [
                'id_admin' => $admin->id_admin,
                'username' => $admin->username,
                'full_name' => $admin->full_name,
                'nomor_telepon' => $admin->nomor_telepon,
                'created_at' => $admin->created_at,
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $admin = $request->user();
        
        $validated = $request->validate([
            'full_name' => 'sometimes|string|max:100',
            'nomor_telepon' => 'nullable|string|max:15',
        ]);

        $admin->update($validated);
        
        return response()->json([
            'success' => true,
            'message' => 'Profil berhasil diperbarui',
            'data' => $admin,
        ]);
    }

    public function changePassword(Request $request)
    {
        $admin = $request->user();

        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        // Verify current password
        if (!Hash::check($validated['current_password'], $admin->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Password saat ini tidak sesuai'],
            ]);
        }

        $admin->update([
            'password' => Hash::make($validated['new_password']),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password berhasil diubah',
        ]);
    }

    // Analytics & Statistics
    public function analytics(Request $request)
    {
        $startDate = $request->get('start_date', now()->subMonths(6)->startOfMonth());
        $endDate = $request->get('end_date', now()->endOfMonth());

        // Program statistics
        $programStats = [
            'total' => ProgramBantuan::whereBetween('tanggal_mulai', [$startDate, $endDate])->count(),
            'aktif' => ProgramBantuan::where('status', 'aktif')->count(),
            'pending' => ProgramBantuan::where('status', 'pending')->count(),
            'by_category' => ProgramBantuan::select('id_kategori', DB::raw('count(*) as total'))
                ->whereBetween('tanggal_mulai', [$startDate, $endDate])
                ->groupBy('id_kategori')
                ->with('kategori')
                ->get(),
            'by_type' => ProgramBantuan::select('jenis_bantuan', DB::raw('count(*) as total'), DB::raw('sum(jumlah_bantuan) as jumlah'))
                ->whereBetween('tanggal_mulai', [$startDate, $endDate])
                ->groupBy('jenis_bantuan')
                ->get(),
        ];

        // Distribution statistics
        $distributionStats = [
            'total_transactions' => TransaksiPenyaluran::whereBetween('tanggal_penyaluran', [$startDate, $endDate])->count(),
            'total_amount' => TransaksiPenyaluran::whereBetween('tanggal_penyaluran', [$startDate, $endDate])->sum('jumlah_diterima'),
            'by_status' => TransaksiPenyaluran::select('status_penyaluran', DB::raw('count(*) as total'))
                ->whereBetween('tanggal_penyaluran', [$startDate, $endDate])
                ->groupBy('status_penyaluran')
                ->get(),
            'monthly_trend' => TransaksiPenyaluran::select(
                    DB::raw('DATE_FORMAT(tanggal_penyaluran, "%Y-%m") as bulan'),
                    DB::raw('count(*) as jumlah'),
                    DB::raw('sum(jumlah_diterima) as total')
                )
                ->whereBetween('tanggal_penyaluran', [$startDate, $endDate])
                ->groupBy('bulan')
                ->orderBy('bulan')
                ->get(),
        ];

        // Recipient statistics
        $recipientStats = [
            'total' => Penerima::count(),
            'verified' => Penerima::where('status_verifikasi', 'disetujui')->count(),
            'pending' => Penerima::where('status_verifikasi', 'pending')->count(),
            'active' => PenerimaProgram::distinct('id_penerima')->count(),
        ];

        // Donor statistics
        $donorStats = [
            'total' => Donatur::count(),
            'active' => Donatur::where('status', 'aktif')->count(),
            'top_donors' => Donatur::withCount('programBantuan')
                ->where('status', 'aktif')
                ->orderBy('program_bantuan_count', 'desc')
                ->limit(5)
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'period' => [
                'start' => $startDate,
                'end' => $endDate,
            ],
            'programs' => $programStats,
            'distributions' => $distributionStats,
            'recipients' => $recipientStats,
            'donors' => $donorStats,
        ]);
    }

    // Schedule Management Methods
    public function saveScheduleAndActivateProgram(Request $request, $id)
    {
        try {
            Log::info('=== SAVING SCHEDULE ===');
            Log::info('Program ID: ' . $id);
            Log::info('Request data: ', $request->all());
            Log::info('User: ', ['id' => $request->user()->id_admin, 'username' => $request->user()->username]);
            
            $program = ProgramBantuan::findOrFail($id);
            Log::info('Program found: ' . $program->nama_program);
            
            $validated = $request->validate([
                'meta' => 'required|array',
                'meta.startDate' => 'required|date',
                'meta.endDate' => 'required|date|after_or_equal:meta.startDate',
                'meta.criteria' => 'nullable|string',
                'meta.description' => 'nullable|string',
                'meta.donationValue' => 'nullable|string',
                'stages' => 'required|array|min:1',
                'stages.*.date' => 'required|date',
                'stages.*.time' => 'required|string',
                'stages.*.location' => 'required|string|max:200',
                'stages.*.note' => 'nullable|string',
                'stages.*.recipients' => 'required|array|min:1',
                'stages.*.recipients.*' => 'required|integer|exists:penerima,id_penerima',
            ]);
            
            Log::info('Validation passed');

            DB::beginTransaction();
            Log::info('Transaction started');

            // Update program metadata
            $program->update([
                'tanggal_mulai' => $validated['meta']['startDate'],
                'tanggal_selesai' => $validated['meta']['endDate'],
                'deskripsi' => $validated['meta']['description'],
                'keterangan' => $validated['meta']['criteria'],
                'status' => 'aktif', // Activate the program
            ]);
            Log::info('Program updated to aktif status');

            // Create penerima_program records and schedule transactions
            $stageCount = 0;
            $recipientCount = 0;
            foreach ($validated['stages'] as $stageIndex => $stage) {
                $stageCount++;
                $stageNumber = $stageIndex + 1; // Tahap 1, 2, 3, etc.
                Log::info('Processing stage ' . $stageNumber . ': ' . $stage['date'] . ' ' . $stage['time']);
                
                // Format catatan dengan prefix "Tahap X: "
                $catatan = $stage['note'] 
                    ? "Tahap {$stageNumber}: " . $stage['note'] 
                    : "Tahap {$stageNumber}";
                
                foreach ($stage['recipients'] as $recipientId) {
                    $recipientCount++;
                    Log::info('Processing recipient ' . $recipientId);
                    
                    // Create penerima_program record if not exists
                    $penerimaProgram = PenerimaProgram::firstOrCreate([
                        'id_program' => $program->id_program,
                        'id_penerima' => $recipientId,
                    ], [
                        'status_penerimaan' => 'menunggu',
                        'tanggal_penetapan' => now(),
                        'created_by' => $request->user()->id_admin,
                    ]);
                    
                    Log::info('PenerimaProgram created/found: ' . $penerimaProgram->id_penerima_program);

                    // Create transaction schedule
                    $transaction = TransaksiPenyaluran::create([
                        'id_penerima_program' => $penerimaProgram->id_penerima_program,
                        'tanggal_penyaluran' => $stage['date'],
                        'jam_penyaluran' => $stage['time'],
                        'lokasi_penyaluran' => $stage['location'],
                        'jumlah_diterima' => $program->jenis_bantuan === 'uang' ? 
                            ($program->jumlah_bantuan / $this->getTotalRecipientsCount($validated['stages'])) : 1,
                        'metode_penyaluran' => $program->jenis_bantuan === 'uang' ? 'transfer' : 'barang',
                        'status_penyaluran' => 'dijadwalkan',
                        'catatan' => $catatan,
                    ]);
                    
                    Log::info('Transaction created: ' . $transaction->id_transaksi);
                }
            }

            Log::info('All stages and recipients processed. Stages: ' . $stageCount . ', Recipients: ' . $recipientCount);
            DB::commit();
            Log::info('Transaction committed successfully');

            return response()->json([
                'success' => true,
                'message' => 'Jadwal berhasil disimpan dan program diaktifkan',
                'data' => $program->load(['kategori', 'donatur']),
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollback();
            Log::error('Validation failed: ', $e->errors());
            
            return response()->json([
                'success' => false,
                'message' => 'Validasi gagal',
                'errors' => $e->errors(),
            ], 422);
            
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error saving schedule: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Gagal menyimpan jadwal: ' . $e->getMessage(),
                'error' => $e->getMessage(),
                'trace' => config('app.debug') ? $e->getTraceAsString() : null,
            ], 500);
        }
    }

    public function getSchedules(Request $request, $id)
    {
        $program = ProgramBantuan::findOrFail($id);
        
        $schedules = TransaksiPenyaluran::with([
                'penerimaProgram.penerima:id_penerima,nama_kepala,no_kk,alamat,jumlah_tanggungan',
                'penerimaProgram.program:id_program,nama_program'
            ])
            ->whereHas('penerimaProgram', function($query) use ($id) {
                $query->where('id_program', $id);
            })
            ->orderBy('tanggal_penyaluran', 'asc')
            ->orderBy('jam_penyaluran', 'asc')
            ->get()
            ->groupBy(function($transaction) {
                return $transaction->tanggal_penyaluran->format('Y-m-d') . '-' . 
                       $transaction->jam_penyaluran . '-' . 
                       $transaction->lokasi_penyaluran . '-' . 
                       ($transaction->catatan ?? '');
            })
            ->map(function($group, $key) {
                $first = $group->first();
                $keyParts = explode('-', $key);
                
                // Calculate status based on:
                // 1. All recipients are completed (status = 'selesai')
                // 2. OR date has passed (compared to current date/time)
                $allCompleted = $group->every(function($transaction) {
                    return $transaction->status_penyaluran === 'selesai';
                });
                
                // Check if schedule date has passed
                $scheduleDatetime = \Carbon\Carbon::parse($first->tanggal_penyaluran->format('Y-m-d') . ' ' . $first->jam_penyaluran);
                $isPast = $scheduleDatetime->isPast();
                
                // Status is "selesai" if all recipients completed OR date has passed
                $scheduleStatus = ($allCompleted || $isPast) ? 'selesai' : 'dijadwalkan';
                
                return [
                    'date' => $first->tanggal_penyaluran->format('Y-m-d'),
                    'time' => $first->jam_penyaluran,
                    'location' => $first->lokasi_penyaluran,
                    'note' => $first->catatan,
                    'status' => $scheduleStatus,
                    'recipients' => $group->map(function($transaction) {
                        return [
                            'id' => $transaction->penerimaProgram->penerima->id_penerima,
                            'name' => $transaction->penerimaProgram->penerima->nama_kepala,
                            'kk' => $transaction->penerimaProgram->penerima->no_kk,
                            'address' => $transaction->penerimaProgram->penerima->alamat,
                            'dependents' => $transaction->penerimaProgram->penerima->jumlah_tanggungan,
                            'amount' => $transaction->jumlah_diterima,
                            'status' => $transaction->status_penyaluran,
                            'transaction_id' => $transaction->id_transaksi,
                        ];
                    })->values(),
                    'total_recipients' => $group->count(),
                    'total_amount' => $group->sum('jumlah_diterima'),
                ];
            })
            ->values();

        return response()->json([
            'success' => true,
            'program' => [
                'id' => $program->id_program,
                'name' => $program->nama_program,
                'type' => $program->jenis_bantuan,
                'amount' => $program->jumlah_bantuan,
                'status' => $program->status,
                'start_date' => $program->tanggal_mulai,
                'end_date' => $program->tanggal_selesai,
                'description' => $program->deskripsi,
                'criteria' => $program->keterangan,
            ],
            'schedules' => $schedules,
        ]);
    }

    private function getTotalRecipientsCount($stages)
    {
        $totalRecipients = 0;
        foreach ($stages as $stage) {
            $totalRecipients += count($stage['recipients']);
        }
        return max($totalRecipients, 1); // Avoid division by zero
    }

    public function getAvailableRecipients(Request $request)
    {
        $query = Penerima::where('status_verifikasi', 'disetujui');

        // Filter by search query
        if ($request->has('search') && $request->search != '') {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('nama_kepala', 'like', '%' . $search . '%')
                  ->orWhere('no_kk', 'like', '%' . $search . '%')
                  ->orWhere('alamat', 'like', '%' . $search . '%');
            });
        }

        // Filter by income tier
        if ($request->has('income_tier') && is_array($request->income_tier) && count($request->income_tier) > 0) {
            $query->whereIn('penghasilan', $request->income_tier);
        }

        // Filter by minimum dependents
        if ($request->has('min_dependents') && $request->min_dependents != '') {
            $query->where('jumlah_tanggungan', '>=', $request->min_dependents);
        }

        $recipients = $query->get()->map(function($penerima) {
            return [
                'id' => $penerima->id_penerima,
                'name' => $penerima->nama_kepala,
                'kk' => $penerima->no_kk,
                'address' => $penerima->alamat,
                'dependents' => $penerima->jumlah_tanggungan,
                'income' => $penerima->penghasilan,
                'job' => $penerima->pekerjaan,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $recipients,
        ]);
    }

    // Upload dokumentasi program
    public function uploadDokumentasi(Request $request)
    {
        $request->validate([
            'id_program' => 'required|exists:program_bantuan,id_program',
            'judul' => 'required|string|max:200',
            'deskripsi' => 'nullable|string',
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf,doc,docx|max:10240', // Max 10MB
        ]);

        try {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('dokumentasi_program', $fileName, 'public');

            $dokumentasi = DokumentasiProgram::create([
                'id_program' => $request->id_program,
                'judul' => $request->judul,
                'deskripsi' => $request->deskripsi,
                'file_path' => $filePath,
                'file_name' => $fileName,
                'file_type' => $file->getClientMimeType(),
                'file_size' => $file->getSize(),
                'tanggal_upload' => now(),
                'uploaded_by' => $request->user()->id_admin,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Dokumentasi berhasil diupload',
                'data' => $dokumentasi,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal mengupload dokumentasi: ' . $e->getMessage(),
            ], 500);
        }
    }

    // Get dokumentasi by program
    public function getDokumentasiProgram($id_program)
    {
        try {
            $dokumentasi = DokumentasiProgram::where('id_program', $id_program)
                ->latest()
                ->get()
                ->map(function($doc) {
                    return [
                        'id' => $doc->id_dokumentasi,
                        'judul' => $doc->judul,
                        'deskripsi' => $doc->deskripsi,
                        'file_name' => $doc->file_name,
                        'file_path' => asset('storage/' . $doc->file_path),
                        'file_type' => $doc->file_type,
                        'file_size' => $doc->file_size,
                        'tanggal_upload' => $doc->tanggal_upload->format('d M Y'),
                        'uploaded_by' => 'Admin',
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $dokumentasi,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat dokumentasi: ' . $e->getMessage(),
                'data' => [],
            ]);
        }
    }

    // Delete dokumentasi
    public function deleteDokumentasi($id)
    {
        try {
            $dokumentasi = DokumentasiProgram::findOrFail($id);
            
            // Delete file from storage
            if (Storage::disk('public')->exists($dokumentasi->file_path)) {
                Storage::disk('public')->delete($dokumentasi->file_path);
            }

            $dokumentasi->delete();

            return response()->json([
                'success' => true,
                'message' => 'Dokumentasi berhasil dihapus',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal menghapus dokumentasi: ' . $e->getMessage(),
            ], 500);
        }
    }
}


<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ProgramBantuan;
use App\Models\PenerimaProgram;
use App\Models\DokumenVerifikasi;
use Illuminate\Support\Facades\DB;
use App\Models\TransaksiPenyaluran;
use Illuminate\Support\Facades\Log;
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
        
        // Check if user needs to fill application form
        $needsApplication = $penerima->status_verifikasi === 'belum_mengajukan';
        
        return response()->json([
            'success' => true,
            'needs_application' => $needsApplication,
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
            ->with([
                'kategori', 
                'donatur',
                'penerimaPrograms.transaksiPenyaluran'
            ]);

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
            
            // Calculate progress based on verified transactions (status_penyaluran = 'selesai')
            $totalPenerima = $program->penerimaPrograms->count();
            
            // Count tersalurkan based on transactions with status 'selesai' (verified by admin)
            $tersalurkan = $program->penerimaPrograms->filter(function($pp) {
                return $pp->transaksiPenyaluran && $pp->transaksiPenyaluran->where('status_penyaluran', 'selesai')->count() > 0;
            })->count();
            
            $progress = $totalPenerima > 0 ? round(($tersalurkan / $totalPenerima) * 100) : 0;
            
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
                'progress_note' => "$tersalurkan dari $totalPenerima penerima",
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
        $program = ProgramBantuan::with([
            'kategori', 
            'donatur', 
            'penerimaPrograms.penerima',
            'penerimaPrograms.transaksiPenyaluran'
        ])->findOrFail($id);

        $penerima = $request->user();
        $hasApplied = $penerima->penerimaPrograms()
            ->where('id_program', $id)
            ->exists();

        // Get statistics - count based on verified transactions (status_penyaluran = 'selesai')
        $totalPenerima = $program->penerimaPrograms->count();
        
        // Count tersalurkan based on transactions with status 'selesai' (verified by admin)
        $totalTersalurkan = $program->penerimaPrograms->filter(function($pp) {
            return $pp->transaksiPenyaluran && $pp->transaksiPenyaluran->where('status_penyaluran', 'selesai')->count() > 0;
        })->count();
        
        $totalBelumTersalurkan = $totalPenerima - $totalTersalurkan;
        
        // Get schedules - get unique schedules for this program based on date, time, and location
        // Group by date, time, location to calculate status properly
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
                'tanggal_penyaluran' => $first->tanggal_penyaluran,
                'waktu_penyaluran' => $first->jam_penyaluran,
                'lokasi_penyaluran' => $first->lokasi_penyaluran,
                'keterangan' => $first->catatan,
                'status_penyaluran' => $scheduleStatus,
            ];
        })->values(); // Re-index array

        // Get recipients
        $recipients = $program->penerimaPrograms->map(function($pp) {
            return [
                'id' => $pp->id_penerima_program,
                'nama' => $pp->penerima->nama_kepala,
                'nama_lengkap' => $pp->penerima->nama_kepala,
                'no_kk' => $pp->penerima->no_kk,
                'kk' => $pp->penerima->no_kk,
                'alamat' => $pp->penerima->alamat,
                'status' => $pp->status_penerimaan,
                'status_penerimaan' => $pp->status_penerimaan,
                'transaksi_penyaluran' => $pp->transaksiPenyaluran,
            ];
        });

        return response()->json([
            'success' => true,
            'data' => [
                'id_program' => $program->id_program,
                'nama_program' => $program->nama_program,
                'deskripsi' => $program->deskripsi,
                'jenis_bantuan' => $program->jenis_bantuan,
                'jumlah_bantuan' => $program->jumlah_bantuan,
                'deskripsi_bantuan' => $program->keterangan,
                'kriteria_penerima' => $program->keterangan,
                'keterangan_tambahan' => $program->deskripsi,
                'tanggal_mulai' => $program->tanggal_mulai,
                'tanggal_selesai' => $program->tanggal_selesai,
                'status' => $program->status,
                'has_applied' => $hasApplied,
                'kategori' => [
                    'id_kategori' => $program->kategori->id_kategori ?? null,
                    'nama_kategori' => $program->kategori->nama_kategori ?? 'N/A',
                ],
                'donatur' => [
                    'id_donatur' => $program->donatur->id_donatur ?? null,
                    'nama' => $program->donatur->nama_organisasi ?? $program->donatur->nama_lengkap ?? 'N/A',
                ],
                'statistics' => [
                    'total_penerima' => $totalPenerima,
                    'total_tersalurkan' => $totalTersalurkan,
                    'total_belum_tersalurkan' => $totalBelumTersalurkan,
                    'penerima_selesai' => $totalTersalurkan, // Alias for backward compatibility
                ],
                'schedules' => $schedules,
                'recipients' => $recipients,
                'images' => [], // Add image handling if needed
            ],
        ]);
    }

    public function applyProgram(Request $request, $id)
    {
        $penerima = $request->user();
        $program = ProgramBantuan::findOrFail($id);

        if ($penerima->status_verifikasi !== 'disetujui') {
            return response()->json([
                'success' => false,
                'message' => 'Akun Anda belum disetujui. Silakan hubungi admin.',
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
        
        // Check if user needs to fill application form
        $needsApplication = $penerima->status_verifikasi === 'belum_mengajukan';

        // Get programs that penerima has been assigned to
        $programs = $penerima->penerimaPrograms()
            ->with(['program.donatur', 'program.kategori'])
            ->orderBy('tanggal_penetapan', 'desc')
            ->get()
            ->map(function($pp) {
                $program = $pp->program;
                return [
                    'id' => $pp->id_penerima_program,
                    'program_id' => $program->id_program,
                    'title' => $program->nama_program,
                    'donor' => $program->donatur->nama_organisasi ?? $program->donatur->nama_lengkap ?? 'N/A',
                    'category' => $program->kategori->nama_kategori ?? 'N/A',
                    'status' => $pp->status_penerimaan,
                    'date' => $pp->tanggal_penetapan ? $pp->tanggal_penetapan->format('d M Y') : 'N/A',
                ];
            });

        // Get documents (if application was submitted)
        $documents = [];
        if (!$needsApplication) {
            $dokumenKK = $penerima->dokumenVerifikasi()
                ->where('jenis_dokumen', 'Kartu Keluarga')
                ->orderBy('tanggal_upload', 'desc')
                ->first();
            
            $dokumenRumah = $penerima->dokumenVerifikasi()
                ->where('jenis_dokumen', 'Foto Rumah')
                ->orderBy('tanggal_upload', 'desc')
                ->first();
            
            if ($dokumenKK) {
                $documents[] = [
                    'id' => 'kk_' . $dokumenKK->id_dokumen,
                    'jenis_dokumen' => 'Foto Kartu Keluarga',
                    'nama_file' => $dokumenKK->nama_file,
                    'file_path' => $dokumenKK->path_file,
                ];
            }
            
            if ($dokumenRumah) {
                $documents[] = [
                    'id' => 'house_' . $dokumenRumah->id_dokumen,
                    'jenis_dokumen' => 'Foto Rumah',
                    'nama_file' => $dokumenRumah->nama_file,
                    'file_path' => $dokumenRumah->path_file,
                ];
            }
        }

        return response()->json([
            'success' => true,
            'needs_application' => $needsApplication,
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
            'programs' => $programs,
            'documents' => $documents,
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

    public function submitApplication(Request $request)
    {
        $penerima = $request->user();
        
        // Log incoming data for debugging
        Log::info('Submit Application Request', [
            'all_data' => $request->all(),
            'files' => $request->allFiles(),
        ]);
        
        // Validate input
        $validated = $request->validate([
            'nama_kepala' => 'required|string|max:100',
            'no_kk' => 'required|string|max:20',
            'alamat' => 'required|string',
            'nomor_telepon' => 'required|string|max:15',
            'pekerjaan' => 'required|string|max:100',
            'pekerjaan_istri' => 'nullable|string|max:100',
            'penghasilan' => 'required|string',
            'jumlah_tanggungan' => 'required|numeric|min:0',
            'status_anak' => 'required|string|max:100',
            'kk_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
            'house_file' => 'nullable|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);

        // Update penerima data and set status to pending (akan muncul di admin)
        $penerima->update([
            'nama_kepala' => $validated['nama_kepala'],
            'no_kk' => $validated['no_kk'],
            'alamat' => $validated['alamat'],
            'nomor_telepon' => $validated['nomor_telepon'],
            'pekerjaan' => $validated['pekerjaan'],
            'pekerjaan_istri' => $validated['pekerjaan_istri'] ?? null,
            'penghasilan' => $validated['penghasilan'],
            'jumlah_tanggungan' => (int) $validated['jumlah_tanggungan'],
            'status_anak' => $validated['status_anak'],
            'status_verifikasi' => 'pending', // Set ke pending agar muncul di admin
        ]);

        // Handle file uploads if provided
        if ($request->hasFile('kk_file')) {
            $kkFile = $request->file('kk_file');
            $kkPath = $kkFile->store('dokumen_verifikasi', 'public');
            
            $penerima->dokumenVerifikasi()->create([
                'jenis_dokumen' => 'Kartu Keluarga',
                'nama_file' => $kkFile->getClientOriginalName(),
                'path_file' => $kkPath,
                'ukuran_file' => $kkFile->getSize(),
            ]);
        }

        if ($request->hasFile('house_file')) {
            $houseFile = $request->file('house_file');
            $housePath = $houseFile->store('dokumen_verifikasi', 'public');
            
            $penerima->dokumenVerifikasi()->create([
                'jenis_dokumen' => 'Foto Rumah',
                'nama_file' => $houseFile->getClientOriginalName(),
                'path_file' => $housePath,
                'ukuran_file' => $houseFile->getSize(),
            ]);
        }

        return response()->json([
            'success' => true,
            'message' => 'Pengajuan berhasil dikirim. Silakan menunggu verifikasi dari admin.',
            'data' => $penerima,
        ], 201);
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

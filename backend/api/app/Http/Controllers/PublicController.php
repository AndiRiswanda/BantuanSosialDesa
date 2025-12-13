<?php

namespace App\Http\Controllers;

use App\Models\ProgramBantuan;
use App\Models\PenerimaProgram;
use App\Models\TransaksiPenyaluran;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class PublicController extends Controller
{
    /**
     * Get active programs for public view (beranda)
     */
    public function activePrograms()
    {
        try {
            $programs = ProgramBantuan::with(['kategori', 'donatur'])
                ->where('status', 'aktif')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($program) {
                    // Calculate statistics
                    $totalPenerima = PenerimaProgram::where('id_program', $program->id_program)->count();
                    
                    // Count completed recipients based on 'selesai' status in transaksi_penyaluran
                    $completedRecipients = PenerimaProgram::where('id_program', $program->id_program)
                        ->whereHas('transaksiPenyaluran', function ($query) {
                            $query->where('status_penyaluran', 'selesai');
                        })
                        ->distinct()
                        ->count('id_penerima_program');

                    $progressPercentage = $totalPenerima > 0 
                        ? round(($completedRecipients / $totalPenerima) * 100) 
                        : 0;

                    return [
                        'id_program' => $program->id_program,
                        'nama_program' => $program->nama_program,
                        'deskripsi' => $program->deskripsi,
                        'jenis_bantuan' => $program->jenis_bantuan,
                        'jumlah_bantuan' => $program->jumlah_bantuan,
                        'tanggal_mulai' => $program->tanggal_mulai,
                        'tanggal_selesai' => $program->tanggal_selesai,
                        'status' => $program->status,
                        'kategori' => $program->kategori,
                        'donatur' => $program->donatur ? [
                            'nama_donatur' => $program->donatur->nama_donatur,
                            'jenis_donatur' => $program->donatur->jenis_donatur,
                        ] : null,
                        'jumlah_penerima' => $totalPenerima,
                        'completed_recipients' => $completedRecipients,
                        'progress_percentage' => $progressPercentage,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $programs,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat program aktif',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get programs with schedules for public view (penyaluran page)
     */
    public function programsWithSchedules()
    {
        try {
            $programs = ProgramBantuan::with(['kategori', 'donatur'])
                ->where('status', 'aktif')
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($program) {
                    // Calculate statistics
                    $totalPenerima = PenerimaProgram::where('id_program', $program->id_program)->count();
                    
                    // Count completed recipients based on 'selesai' status in transaksi_penyaluran
                    $completedRecipients = PenerimaProgram::where('id_program', $program->id_program)
                        ->whereHas('transaksiPenyaluran', function ($query) {
                            $query->where('status_penyaluran', 'selesai');
                        })
                        ->distinct()
                        ->count('id_penerima_program');

                    $progressPercentage = $totalPenerima > 0 
                        ? round(($completedRecipients / $totalPenerima) * 100) 
                        : 0;

                    // Get schedules (transaksi penyaluran) for this program
                    $schedules = TransaksiPenyaluran::select(
                            'transaksi_penyaluran.id_transaksi',
                            'transaksi_penyaluran.tanggal_penyaluran as tanggal',
                            'transaksi_penyaluran.lokasi_penyaluran as lokasi',
                            DB::raw("TIME_FORMAT(transaksi_penyaluran.jam_penyaluran, '%H:%i') as jam_mulai"),
                            DB::raw("TIME_FORMAT(DATE_ADD(transaksi_penyaluran.jam_penyaluran, INTERVAL 3 HOUR), '%H:%i') as jam_selesai"),
                            'transaksi_penyaluran.status_penyaluran as status'
                        )
                        ->join('penerima_program', 'transaksi_penyaluran.id_penerima_program', '=', 'penerima_program.id_penerima_program')
                        ->where('penerima_program.id_program', $program->id_program)
                        ->groupBy(
                            'transaksi_penyaluran.id_transaksi',
                            'transaksi_penyaluran.tanggal_penyaluran',
                            'transaksi_penyaluran.lokasi_penyaluran',
                            'transaksi_penyaluran.jam_penyaluran',
                            'transaksi_penyaluran.status_penyaluran'
                        )
                        ->orderBy('transaksi_penyaluran.tanggal_penyaluran', 'asc')
                        ->get();

                    return [
                        'id_program' => $program->id_program,
                        'nama_program' => $program->nama_program,
                        'deskripsi' => $program->deskripsi,
                        'jenis_bantuan' => $program->jenis_bantuan,
                        'jumlah_bantuan' => $program->jumlah_bantuan,
                        'tanggal_mulai' => $program->tanggal_mulai,
                        'tanggal_selesai' => $program->tanggal_selesai,
                        'status' => $program->status,
                        'kategori' => $program->kategori,
                        'jumlah_penerima' => $totalPenerima,
                        'completed_recipients' => $completedRecipients,
                        'progress_percentage' => $progressPercentage,
                        'schedules' => $schedules,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $programs,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat program dengan jadwal',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get completed distributions for public transparency
     */
    public function completedDistributions()
    {
        try {
            $distributions = TransaksiPenyaluran::with([
                'penerimaProgram.penerima',
                'penerimaProgram.program'
            ])
            ->where('status_penyaluran', 'selesai')
            ->orderBy('tanggal_penyaluran', 'desc')
            ->limit(100)
            ->get()
            ->map(function ($transaksi) {
                return [
                    'id_transaksi' => $transaksi->id_transaksi,
                    'program' => $transaksi->penerimaProgram->program->nama_program ?? '-',
                    'penerima' => $transaksi->penerimaProgram->penerima->nama_kepala ?? '-',
                    'jumlah' => $transaksi->penerimaProgram->program->jenis_bantuan === 'uang'
                        ? 'Rp ' . number_format($transaksi->jumlah_diterima, 0, ',', '.')
                        : $transaksi->jumlah_diterima . ' Paket',
                    'tanggal' => $transaksi->tanggal_penyaluran,
                    'lokasi' => $transaksi->lokasi_penyaluran,
                    'status' => $transaksi->status_penyaluran,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $distributions,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat data penyaluran',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get statistics for public dashboard
     */
    public function statistics()
    {
        try {
            $totalPrograms = ProgramBantuan::where('status', 'aktif')->count();
            $totalRecipients = PenerimaProgram::whereHas('program', function ($query) {
                $query->where('status', 'aktif');
            })->distinct('id_penerima')->count();
            
            $totalDistributed = TransaksiPenyaluran::where('status_penyaluran', 'selesai')->count();
            
            $totalFunds = ProgramBantuan::where('status', 'aktif')
                ->where('jenis_bantuan', 'uang')
                ->sum('jumlah_bantuan');

            return response()->json([
                'success' => true,
                'data' => [
                    'total_programs' => $totalPrograms,
                    'total_recipients' => $totalRecipients,
                    'total_distributed' => $totalDistributed,
                    'total_funds' => $totalFunds,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gagal memuat statistik',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}

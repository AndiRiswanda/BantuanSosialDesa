<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DonorController;
use App\Http\Controllers\RecipientController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\ProgramController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public Routes
Route::post('/login/donatur', [AuthController::class, 'loginDonor']);
Route::post('/login/recipient', [AuthController::class, 'loginRecipient']);
Route::post('/register/donatur', [AuthController::class, 'registerDonor']);
Route::post('/register/recipient', [AuthController::class, 'registerRecipient']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

// Public API routes
Route::get('/programs', [ProgramController::class, 'index']);
Route::get('/programs/{id}', [ProgramController::class, 'show']);

// Protected routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Informasi User
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Donatur Routes
    Route::prefix('donatur')->middleware('role:donatur')->group(function () {
        Route::get('/dashboard', [DonorController::class, 'dashboard']);
        Route::get('/categories', [DonorController::class, 'categories']);
        Route::get('/programs', [DonorController::class, 'programs']);
        Route::get('/programs/{id}', [DonorController::class, 'programDetail']);
        Route::get('/programs/{id}/recipients', [DonorController::class, 'programRecipients']);
        Route::post('/programs', [DonorController::class, 'createProgram']);
        Route::put('/programs/{id}', [DonorController::class, 'updateProgram']);
        Route::delete('/programs/{id}', [DonorController::class, 'deleteProgram']);
        Route::post('/programs/{id}/upload-proof', [DonorController::class, 'uploadProof']);
        Route::get('/profile', [DonorController::class, 'profile']);
        Route::put('/profile', [DonorController::class, 'updateProfile']);
        // Jadwal Penyaluran untuk Donatur
        Route::get('/programs/{id}/schedules', [DonorController::class, 'programSchedules']);
    });
    
    // Penerima Routes
    Route::prefix('recipient')->middleware('role:penerima')->group(function () {
        Route::get('/dashboard', [RecipientController::class, 'dashboard']);
        Route::get('/programs', [RecipientController::class, 'programs']);
        Route::get('/programs/{id}', [RecipientController::class, 'programDetail']);
        Route::post('/programs/{id}/apply', [RecipientController::class, 'applyProgram']);
        Route::get('/applications', [RecipientController::class, 'applications']);
        Route::get('/profile', [RecipientController::class, 'profile']);
        Route::put('/profile', [RecipientController::class, 'updateProfile']);
        Route::post('/documents', [RecipientController::class, 'uploadDocument']);
        
        // Jadwal Penyaluran
        Route::get('/schedules', [RecipientController::class, 'schedules']);
        Route::get('/programs/{id}/schedules', [RecipientController::class, 'programSchedules']);
    });
    
    // Admin Routes
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        
        // Manajemen Program
        Route::get('/programs', [AdminController::class, 'programs']);
        Route::get('/programs/pending/list', [AdminController::class, 'pendingPrograms']); // Harus sebelum /programs/{id}
        Route::post('/programs/{id}/approve', [AdminController::class, 'approveProgram']);
        Route::post('/programs/{id}/reject', [AdminController::class, 'rejectProgram']);
        Route::get('/programs/{id}', [AdminController::class, 'programDetail']);
        Route::post('/programs', [AdminController::class, 'createProgram']);
        Route::put('/programs/{id}', [AdminController::class, 'updateProgram']);
        Route::delete('/programs/{id}', [AdminController::class, 'deleteProgram']);
        
        // Penerima Program
        Route::get('/penerima-program', [AdminController::class, 'penerimaPrograms']);
        Route::post('/penerima-program', [AdminController::class, 'assignPenerimaToProgram']);
        Route::put('/penerima-program/{id}', [AdminController::class, 'updatePenerimaProgram']);
        Route::delete('/penerima-program/{id}', [AdminController::class, 'deletePenerimaProgram']);
        
        // Transaksi Penyaluran
        Route::get('/transaksi', [AdminController::class, 'transaksi']);
        Route::get('/transaksi/{id}', [AdminController::class, 'transaksiDetail']);
        Route::post('/transaksi', [AdminController::class, 'createTransaksi']);
        Route::put('/transaksi/{id}', [AdminController::class, 'updateTransaksi']);
        Route::delete('/transaksi/{id}', [AdminController::class, 'deleteTransaksi']);
        
        // Manajemen Verifikasi
        Route::get('/verifications', [AdminController::class, 'allVerifications']);
        Route::get('/verifications/donatur', [AdminController::class, 'pendingDonors']);
        Route::put('/verifications/donatur/{id}', [AdminController::class, 'verifyDonor']);
        Route::get('/verifications/recipients', [AdminController::class, 'pendingRecipients']);
        Route::put('/verifications/recipients/{id}', [AdminController::class, 'verifyRecipient']);
        
        // Manajemen Donatur
        Route::get('/donatur', [AdminController::class, 'donors']);
        Route::get('/donatur/{id}', [AdminController::class, 'donorDetail']);
        Route::put('/donatur/{id}', [AdminController::class, 'updateDonor']);
        Route::delete('/donatur/{id}', [AdminController::class, 'deleteDonor']);
        
        // Manajemen Penerima
        Route::get('/recipients', [AdminController::class, 'recipients']);
        Route::get('/recipients/{id}', [AdminController::class, 'recipientDetail']);
        Route::put('/recipients/{id}', [AdminController::class, 'updateRecipient']);
        Route::delete('/recipients/{id}', [AdminController::class, 'deleteRecipient']);
        
        // Kategori Bantuan
        Route::get('/categories', [AdminController::class, 'categories']);
        Route::post('/categories', [AdminController::class, 'createCategory']);
        Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
        Route::delete('/categories/{id}', [AdminController::class, 'deleteCategory']);
        
        // Laporan Transparansi
        Route::get('/reports', [AdminController::class, 'reports']);
        Route::post('/reports', [AdminController::class, 'createReport']);
        Route::put('/reports/{id}', [AdminController::class, 'updateReport']);
        Route::delete('/reports/{id}', [AdminController::class, 'deleteReport']);
        
        // Analytics
        Route::get('/analytics', [AdminController::class, 'analytics']);
        
        // Profil Admin
        Route::get('/profile', [AdminController::class, 'profile']);
        Route::put('/profile', [AdminController::class, 'updateProfile']);
        Route::post('/change-password', [AdminController::class, 'changePassword']);
    });
});

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

// Public routes
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
    
    // User info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    // Donatur routes
    Route::prefix('donatur')->middleware('role:donatur')->group(function () {
        Route::get('/dashboard', [DonorController::class, 'dashboard']);
        Route::get('/categories', [DonorController::class, 'categories']);
        Route::get('/programs', [DonorController::class, 'programs']);
        Route::get('/programs/{id}', [DonorController::class, 'programDetail']);
        Route::get('/programs/{id}/recipients', [DonorController::class, 'programRecipients']);
        Route::post('/programs', [DonorController::class, 'createProgram']);
        Route::put('/programs/{id}', [DonorController::class, 'updateProgram']);
        Route::delete('/programs/{id}', [DonorController::class, 'deleteProgram']);
        Route::get('/profile', [DonorController::class, 'profile']);
        Route::put('/profile', [DonorController::class, 'updateProfile']);
    });
    
    // Recipient routes (Penerima)
    Route::prefix('recipient')->middleware('role:penerima')->group(function () {
        Route::get('/dashboard', [RecipientController::class, 'dashboard']);
        Route::get('/programs', [RecipientController::class, 'programs']);
        Route::get('/programs/{id}', [RecipientController::class, 'programDetail']);
        Route::post('/programs/{id}/apply', [RecipientController::class, 'applyProgram']);
        Route::get('/applications', [RecipientController::class, 'applications']);
        Route::get('/profile', [RecipientController::class, 'profile']);
        Route::put('/profile', [RecipientController::class, 'updateProfile']);
        Route::post('/documents', [RecipientController::class, 'uploadDocument']);
    });
    
    // Admin routes
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/dashboard', [AdminController::class, 'dashboard']);
        
        // Programs management
        Route::get('/programs', [AdminController::class, 'programs']);
        Route::post('/programs', [AdminController::class, 'createProgram']);
        Route::put('/programs/{id}', [AdminController::class, 'updateProgram']);
        Route::delete('/programs/{id}', [AdminController::class, 'deleteProgram']);
        
        // Penerima Program (Recipients in Programs)
        Route::get('/penerima-program', [AdminController::class, 'penerimaPrograms']);
        Route::post('/penerima-program', [AdminController::class, 'assignPenerimaToProgram']);
        Route::put('/penerima-program/{id}', [AdminController::class, 'updatePenerimaProgram']);
        
        // Transaksi Penyaluran (Distribution Transactions)
        Route::get('/transaksi', [AdminController::class, 'transaksi']);
        Route::post('/transaksi', [AdminController::class, 'createTransaksi']);
        Route::put('/transaksi/{id}', [AdminController::class, 'updateTransaksi']);
        
        // Verification management
        Route::get('/verifications/donatur', [AdminController::class, 'pendingDonors']);
        Route::put('/verifications/donatur/{id}', [AdminController::class, 'verifyDonor']);
        Route::get('/verifications/recipients', [AdminController::class, 'pendingRecipients']);
        Route::put('/verifications/recipients/{id}', [AdminController::class, 'verifyRecipient']);
        
        // Donatur management
        Route::get('/donatur', [AdminController::class, 'donors']);
        Route::get('/donatur/{id}', [AdminController::class, 'donorDetail']);
        Route::put('/donatur/{id}', [AdminController::class, 'updateDonor']);
        
        // Recipient management
        Route::get('/recipients', [AdminController::class, 'recipients']);
        Route::get('/recipients/{id}', [AdminController::class, 'recipientDetail']);
        Route::put('/recipients/{id}', [AdminController::class, 'updateRecipient']);
        
        // Kategori Bantuan
        Route::get('/categories', [AdminController::class, 'categories']);
        Route::post('/categories', [AdminController::class, 'createCategory']);
        Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
        
        // Laporan Transparansi
        Route::post('/categories', [AdminController::class, 'createCategory']);
        Route::put('/categories/{id}', [AdminController::class, 'updateCategory']);
        
        // Admin profile
        Route::get('/profile', [AdminController::class, 'profile']);
        Route::put('/profile', [AdminController::class, 'updateProfile']);
    });
});

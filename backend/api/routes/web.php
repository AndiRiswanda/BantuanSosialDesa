<?php

use Illuminate\Support\Facades\Route;

// Serve React app untuk semua routes non-API
Route::get('/{any}', function () {
    return view('app');
})->where('any', '.*');

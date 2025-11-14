<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureUserRole::class,
        ]);
        
        $middleware->statefulApi();
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->render(function (Throwable $e, $request) {
            if ($request->is('api/*')) {
                if ($e instanceof \Illuminate\Validation\ValidationException) {
                    return response()->json([
                        'message' => 'Data yang dikirim tidak valid.',
                        'errors' => $e->errors(),
                    ], 422);
                }
                
                if ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                    return response()->json([
                        'message' => 'Endpoint tidak ditemukan.'
                    ], 404);
                }
                
                if ($e instanceof \Illuminate\Auth\AuthenticationException) {
                    return response()->json([
                        'message' => 'Anda belum login atau token tidak valid.'
                    ], 401);
                }
                
                // For other exceptions in production
                if (config('app.debug')) {
                    return response()->json([
                        'message' => $e->getMessage(),
                        'file' => $e->getFile(),
                        'line' => $e->getLine(),
                        'trace' => $e->getTraceAsString(),
                    ], 500);
                }
                
                return response()->json([
                    'message' => 'Terjadi kesalahan pada server.'
                ], 500);
            }
        });
    })->create();

<?php

use App\Http\Controllers\Api\BackupController;
use App\Http\Controllers\Api\LogController;
use App\Http\Controllers\Api\PointController;
use App\Http\Controllers\Api\ScheduleController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\UserController;

Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/me', [UserController::class, 'me']);

    Route::middleware('admin')->group(function () {
        Route::post('/schedules', [ScheduleController::class, 'store']);
        Route::put('/schedules/{schedule}', [ScheduleController::class, 'update']);
        Route::delete('/schedules/{schedule}', [ScheduleController::class, 'destroy']);
    });

    Route::get('/schedules', [ScheduleController::class, 'index']);
    Route::get('/schedules/{schedule}', [ScheduleController::class, 'show']);

    Route::middleware('admin')->group(function () {
        Route::get('/logs', [LogController::class, 'index']);
        Route::post('/logs', [LogController::class, 'store']);
        Route::post('/logs/bulk-import', [LogController::class, 'bulkImport']);
        Route::get('/logs/export', [LogController::class, 'export']);
        Route::post('/logs/delete-all', [LogController::class, 'deleteAll']);
        Route::delete('/logs/{log}', [LogController::class, 'destroy']);
    });

    Route::get('/logs/search-ncs', [LogController::class, 'searchNcs']);

    Route::middleware('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index']);
        Route::get('/users/{user}', [UserController::class, 'show']);
        Route::post('/users/bulk-import', [UserController::class, 'bulkImport']);
        Route::post('/users', [UserController::class, 'store']);
        Route::put('/users/{user}', [UserController::class, 'update']);
        Route::delete('/users/{user}', [UserController::class, 'destroy']);
    });

    Route::get('/points/leaderboard', [PointController::class, 'leaderboard']);
    Route::get('/points/user/{ncs}', [PointController::class, 'userDetail']);

    Route::middleware('admin')->group(function () {
        Route::post('/points/recalculate', [PointController::class, 'recalculateAll']);
    });

    Route::middleware('superadmin')->group(function () {
        Route::get('/backup/all', [BackupController::class, 'downloadBackup']);
        Route::get('/stats/overview', [BackupController::class, 'statsOverview']);
    });
});

<?php

use App\Http\Controllers\Api\LogController;
use Illuminate\Support\Facades\Route;

Route::get('/logs/export', [LogController::class, 'export']);
Route::post('/logs/{id}/restore', [LogController::class, 'restore']);
Route::delete('/logs', [LogController::class, 'deleteAll']);

Route::apiResource('logs', LogController::class);
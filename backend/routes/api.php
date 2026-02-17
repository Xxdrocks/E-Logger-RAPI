<?php

use App\Http\Controllers\Api\LogController;
use Illuminate\Support\Facades\Route;


Route::get('/logs/export', [LogController::class, 'export']);
Route::get('/logs/search-ncs', [LogController::class, 'searchNcs']);
Route::post('/logs/{id}/restore', [LogController::class, 'restore']);
Route::delete('/logs', [LogController::class, 'deleteAll']);

Route::apiResource('logs', LogController::class);

Route::get('/operators', [LogController::class, 'indexOperators']);
Route::post('/operators', [LogController::class, 'storeOperator']);
Route::put('/operators/{id}', [LogController::class, 'updateOperator']);
Route::delete('/operators/{id}', [LogController::class, 'destroyOperator']);
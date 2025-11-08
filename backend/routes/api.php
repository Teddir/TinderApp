<?php

use App\Http\Controllers\Api\PersonController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::prefix('people')->group(function () {
    Route::get('/', [PersonController::class, 'index']);
    Route::get('/liked', [PersonController::class, 'liked']);
    Route::get('/summary', [PersonController::class, 'summary']);
    Route::post('/{person}/like', [PersonController::class, 'like']);
    Route::post('/{person}/dislike', [PersonController::class, 'dislike']);
});

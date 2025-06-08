<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\UserController;
use App\Http\Controllers\ListController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])
    ->prefix('admin')
    ->group(function () {

Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::resource('list', ListController::class);
        Route::resource('task', TaskController::class);
        Route::resource('users', UserController::class);
    });


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';

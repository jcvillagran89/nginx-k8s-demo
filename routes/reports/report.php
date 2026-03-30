<?php

use App\Http\Controllers\ReportController;

Route::get('/reports', [ReportController::class, 'index'])->name('reports.index');
Route::get('/reports/{id}/preview', [ReportController::class, 'preview'])->name('reports.preview');
Route::post('/reports/{id}/send', [ReportController::class, 'send'])->name('reports.send');

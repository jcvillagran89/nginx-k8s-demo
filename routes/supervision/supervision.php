<?php

use App\Http\Controllers\SupervisionController;

Route::get('/supervision', [SupervisionController::class, 'index'])->name('supervision.index');
Route::post('/supervision/send/{test}', [SupervisionController::class, 'sendTestToCommittee'])->name('supervision.send');
Route::get('/supervision/show/{test}', [SupervisionController::class, 'showTest'])->name('supervision.show');
Route::post('/supervision/reject', [SupervisionController::class, 'rejectTest'])->name('supervision.reject');
Route::post('/supervision/approve', [SupervisionController::class, 'approveTest'])->name('supervision.approve');
Route::post('/supervision/reject-request', [SupervisionController::class, 'rejectTestRequest'])->name('supervision.reject.request');
Route::post('/supervision/approve-request', [SupervisionController::class, 'approveTestRequest'])->name('supervision.approve.request');
Route::post('supervision/image/select', [SupervisionController::class, 'selectImage']);
Route::post('supervision/return/', [SupervisionController::class, 'returnTest']);

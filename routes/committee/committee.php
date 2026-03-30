<?php

use App\Http\Controllers\CommitteeController;

Route::get('/committee', [CommitteeController::class, 'index'])->name('committee.index');
Route::get('/committee/detail/{committee}', [CommitteeController::class, 'detail'])->name('committee.detail');
Route::post('/committee/approve/{committee}', [CommitteeController::class, 'approveTestRequest'])->name('committee.approve');
Route::post('/committee/reject/{committee}', [CommitteeController::class, 'rejectTestRequest'])->name('committee.reject');
Route::post('/committee/re-entry/{committee}', [CommitteeController::class, 'reEntryTestRequest'])->name('committee.re-entry');

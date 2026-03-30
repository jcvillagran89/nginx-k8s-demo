<?php

use App\Http\Controllers\TestResultController;

Route::get('/test-results', [TestResultController::class, 'getTest'])->name('test-results');
Route::get('/test-results/detail/{test}', [TestResultController::class, 'getTestDetail'])
    ->name('test-results.detail');
Route::get('/test-results/start/{test}/{section}', [TestResultController::class, 'startSection'])
    ->name('test-results.section.start');
Route::get('/test-results/images/{image}', [TestResultController::class, 'showImage'])
    ->name('test-results.images.show');
Route::post('/test-results/{test}/{section}', [TestResultController::class, 'updateSection'])
    ->name('test-results.section.update');
Route::post('/test-results/{test}/section/finish',[TestResultController::class, 'finishSection']
    )->name('test-results.section.finish');
Route::put('test-results/{id}/submit-review', [TestResultController::class, 'submitReview'])
    ->name('test-results.review');

<?php

use App\Http\Controllers\ExternalTestController;
use App\Http\Controllers\InternalTestController;
use App\Http\Controllers\TestImportController;
use App\Http\Controllers\TestRequestController;

Route::get('/test', [TestRequestController::class, 'getTestRequest'])->name('test.request.index');
Route::get('/test/create', [TestRequestController::class, 'createTestRequest'])->name('test.request.create');
Route::get('/test/show/{test}', [TestRequestController::class, 'showTestRequest'])->name('test.request.show');
Route::get('/test/edit/{test}', [TestRequestController::class, 'editTestRequest'])->name('test.request.edit');
Route::put('/test/update/{test}', [TestRequestController::class, 'updateTestRequest'])->name('test.request.update');
Route::post('/test/send/{test}', [TestRequestController::class, 'sendTestRequest'])->name('test.request.send');
Route::post('/test', [TestRequestController::class, 'storeTestRequest'])->name('test.request.store');

Route::get('/external-tests', [ExternalTestController::class, 'index'])->name('external-tests.index');
Route::post('/external-tests/upload', [TestImportController::class, 'upload'])->name('external-tests.upload');
Route::get('/external-tests/export', [TestImportController::class, 'export'])->name('external-tests.export');

Route::get('/internal-tests', [InternalTestController::class, 'index'])->name('internal-tests.index');
Route::post('/internal-tests/upload', [InternalTestController::class, 'upload'])->name('internal-tests.upload');
Route::get('/internal-tests/export', [InternalTestController::class, 'export'])->name('internal-tests.export');

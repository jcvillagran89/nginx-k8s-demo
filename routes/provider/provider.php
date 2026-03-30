<?php
use App\Http\Controllers\ProviderController;


Route::get('/providers', [ProviderController::class, 'getProviders'])->name('providers.all');
Route::post('/providers', [ProviderController::class, 'store'])->name('providers.store');
Route::put('/providers/{provider}', [ProviderController::class, 'update'])->name('providers.update');
Route::delete('/providers/{provider}', [ProviderController::class, 'destroy'])->name('providers.destroy');

<?php

use App\Http\Controllers\CatalogueController;
use App\Http\Controllers\StyleImageController;

Route::get('/items/{number}', [CatalogueController::class, 'showItem'])->name('items.show');
Route::get('/styles/{number}/image', [StyleImageController::class, 'show'])->name('styles.image');

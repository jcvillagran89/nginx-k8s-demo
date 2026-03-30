<?php
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\PermissionController;
use App\Http\Controllers\HealthcheckController;
use Spatie\Permission\Models\Permission as SpatiePermission;

/******************** Users ********************/
Route::get('/admin/users', [UserController::class, 'getUsers'])->name('admin.users');
Route::post('/admin/users', [UserController::class, 'store'])->name('admin.users.store');
Route::put('/admin/users/{user}', [UserController::class, 'update'])->name('admin.users.update');
Route::delete('/admin/users/{user}', [UserController::class, 'destroy'])->name('admin.users.destroy');
Route::post('/admin/users/{user}/password-reset', [UserController::class, 'resetPassword'])->name('admin.users.password.reset');
/******************** Roles ********************/
Route::get('/admin/roles', [RoleController::class, 'getRoles'])->name('admin.roles');
Route::post('/admin/roles', [RoleController::class, 'store'])->name('admin.roles.store');
Route::put('/admin/roles/{role}', [RoleController::class, 'update'])->name('admin.roles.update');
Route::delete('/admin/roles/{role}', [RoleController::class, 'destroy'])->name('admin.roles.destroy');
Route::post('/admin/roles/{role}/permissions/sync', [RoleController::class, 'syncPermissions'])->name('admin.roles.permissions.sync');
/******************** Permissions ********************/
Route::get('/admin/permissions', [PermissionController::class, 'getPermissions'])->name('admin.permissions');
Route::post('/admin/permissions', [PermissionController::class, 'store'])->name('admin.permissions.store');
Route::put('/admin/permissions/{permission}', [PermissionController::class, 'update'])->name('admin.permissions.update');
Route::delete('/admin/permissions/{permission}', [PermissionController::class, 'destroy'])->name('admin.permissions.destroy');

/******************** Healthchecks ********************/
Route::get('/admin/healthchecks', [HealthcheckController::class, 'index'])->name('admin.healthchecks');
Route::get('/admin/healthchecks/status', [HealthcheckController::class, 'status'])->name('admin.healthchecks.status');
Route::post('/admin/healthchecks/commands/run', [HealthcheckController::class, 'runCommand'])->name('admin.healthchecks.run');
Route::post('/admin/healthchecks/jobs/import-layout', [HealthcheckController::class, 'runImportLayoutJob'])->name('admin.healthchecks.jobs.import-layout');

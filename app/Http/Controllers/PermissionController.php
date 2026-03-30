<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Services\PermissionService;
use Inertia\Inertia;
use App\Http\Requests\StorePermissionRequest;
use App\Http\Requests\UpdatePermissionRequest;
use Spatie\Permission\Models\Permission;

class PermissionController extends Controller
{
    protected $sPermission;

    public function __construct()
    {
        $this->sPermission = new PermissionService();
    }

    public function getPermissions(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        $search  = $request->input('q');

        $permissions = $this->sPermission->getPaginated($perPage, $search);

        return Inertia::render('admin/permissions/index', [
            'permissions' => $permissions,
            'filters' => [
                'q' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(StorePermissionRequest $request)
    {
        $data = $request->validated();
        $this->sPermission->createPermission($data);
        return back()->with('success', 'Permiso creado correctamente.');
    }

    public function update(UpdatePermissionRequest $request, Permission $permission)
    {
        $this->sPermission->updatePermission($permission, $request->validated());
        return back()->with('success', 'Permiso actualizado correctamente.');
    }

    public function destroy(Permission $permission)
    {
        $this->sPermission->deletePermission($permission);
        return back()->with('success', 'Permiso eliminado correctamente.');
    }
}

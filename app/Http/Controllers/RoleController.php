<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Services\RoleService;
use App\Http\Services\PermissionService;
use Inertia\Inertia;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Role as RoleModel;

class RoleController extends Controller
{
    protected $sRole;

    public function __construct()
    {
        $this->sRole = new RoleService();
        $this->sPermission = new PermissionService();
    }

    public function getRoles(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        $search  = $request->input('q');

        $roles = $this->sRole->getPaginated($perPage, $search);
        $permissions = $this->sPermission->getAll();

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
            'permissions' => $permissions,
            'filters' => [
                'q' => $search,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function store(StoreRoleRequest $request)
    {
        $this->sRole->createRole($request->validated());
        return back()->with('success', 'Rol creado correctamente.');
    }

    public function update(UpdateRoleRequest $request, RoleModel $role)
    {
        $this->sRole->updateRole($role, $request->validated());
        return back()->with('success', 'Rol actualizado correctamente.');
    }

    public function destroy(RoleModel $role)
    {
        $this->sRole->deleteRole($role);
        return back()->with('success', 'Rol eliminado correctamente.');
    }

    public function syncPermissions(Request $request, RoleModel $role)
    {
        $data = $request->validate([
            'permissions'   => ['nullable', 'array'],
            'permissions.*' => [
                'string',
                Rule::exists('permissions', 'name'),
            ],
        ]);

        $this->sRole->syncPermissions($role, $data['permissions'] ?? []);

        return back()->with('success', 'Permisos del rol actualizados.');
    }
}

<?php

namespace App\Http\Services;

use Illuminate\Support\Collection;
use Spatie\Permission\Models\Role;

class RoleService
{
    protected $mRole;

    public function __construct()
    {
        $this->mRole = new Role();
    }

    public function getAll(): Collection
    {
        return $this->mRole->newQuery()
            ->orderBy('name')
            ->get();
    }

    public function getPaginated(int $perPage = 10, ?string $search = null)
    {
        $q = $this->mRole->newQuery()->with('permissions:id,name');

        if ($search) {
            $q->where(function ($qq) use ($search) {
                $qq->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return $q->orderBy('name')
            ->paginate($perPage)
            ->withQueryString()
            ->through(function (Role $role) {
                return [
                    'id'               => $role->id,
                    'name'             => $role->name,
                    'description'      => $role->description,
                    'permission_names' => $role->permissions->pluck('name')->values()->all(),
                ];
            });
    }

    public function createRole(array $data)
    {
        return $this->mRole->create([
            'name'        => $data['name'],
            'description' => $data['description'] ?? null,
            'guard_name'  => 'web',
        ]);
    }

    public function updateRole(Role $role, array $data)
    {
        $role->update([
            'name'        => $data['name'],
            'description' => $data['description'] ?? null,
        ]);

        return $role->refresh();
    }

    public function deleteRole(Role $role)
    {
        if ($role->name === 'superadmin') {
            abort(422, 'No se puede eliminar el rol superadmin.');
        }
        $role->delete();
    }

    public function syncPermissions(Role $role, array $permissionNames): void
    {
        $role->syncPermissions($permissionNames);
    }
}

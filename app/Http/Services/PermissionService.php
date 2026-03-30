<?php

namespace App\Http\Services;

use Illuminate\Support\Collection;
use Spatie\Permission\Models\Permission;

class PermissionService
{
    protected $mPermission;

    public function __construct()
    {
        $this->mPermission = new Permission();
    }

    public function getAll(): Collection
    {
        return $this->mPermission->newQuery()
            ->orderBy('name')
            ->get();
    }

    public function getPaginated(int $perPage = 10, ?string $search = null)
    {
        $q = $this->mPermission->newQuery();
        if ($search) {
            $q->where(function ($qq) use ($search) {
                $qq->where('name', 'like', "%{$search}%")
                   ->orWhere('description', 'like', "%{$search}%");
            });
        }
        return $q->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function createPermission(array $data)
    {
        return $this->mPermission->create([
            'name'        => $data['name'],
            'description' => $data['description'] ?? null,
            'guard_name'  => 'web',
        ]);
    }

    public function updatePermission(Permission $permission, array $data)
    {
        $permission->update([
            'name'        => $data['name'],
            'description' => $data['description'] ?? null,
        ]);

        return $permission->refresh();
    }

    public function deletePermission(Permission $permission): void
    {
        $permission->delete();
    }

}

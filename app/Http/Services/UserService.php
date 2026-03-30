<?php

namespace App\Http\Services;

use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserService
{
    protected $mUser;

    public function __construct()
    {
        $this->mUser = new User();
    }

    public function getUsers(int $perPage = 10, ?string $search = null)
    {
        return User::query()
            ->with(['roles:id,name', 'permissions:id,name'])
            ->when($search, function ($q) use ($search) {
                $q->where(function ($qq) use ($search) {
                    $qq->where('name', 'like', "%{$search}%")
                        ->orWhere('email', 'like', "%{$search}%");
                });
            })
            ->paginate($perPage)
            ->through(function (User $user) {
                return [
                    'id'          => $user->id,
                    'name'        => $user->name,
                    'email'       => $user->email,
                    'role'        => $user->roles->first()->name ?? null,
                    'permissions' => $user->permissions->pluck('name')->values()->all(),
                ];
            });
    }

    public function createUser(array $data)
    {
        $user = $this->mUser->create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => bcrypt($data['password']),
        ]);

        $roleName = $data['role'] ?? null;

        if (!$roleName && isset($data['role_id'])) {
            $roleName = optional(Role::find($data['role_id']))->name;
        }
        if ($roleName) {
            $user->syncRoles([$roleName]);
        }

        $user->syncPermissions($data['permissions'] ?? []);
        return $user;
    }

    public function updateUser(User $user, array $data): User
    {
        return DB::transaction(function () use ($user, $data) {
            $payload = [
                'name'  => $data['name'],
                'email' => $data['email'],
            ];
            if (!empty($data['password'])) {
                $payload['password'] = Hash::make($data['password']);
            }
            $user->update($payload);
            $roleName = $data['role'] ?? null;

            if (!$roleName && isset($data['role_id'])) {
                $roleName = optional(Role::find($data['role_id']))->name;
            }
            if ($roleName) {
                $user->syncRoles([$roleName]);
            }

            $user->syncPermissions($data['permissions'] ?? []);
            return $user->refresh();
        });
    }

    public function softDeleteUser(User $user): void
    {
        DB::transaction(function () use ($user) {
            $user->delete();
        });
    }

    public function resetPasswordAndNotify(User $user): void
    {
        DB::transaction(function () use ($user) {
            $plain = $this->generatePassword(8);
            $user->update([
                'password' => Hash::make($plain),
            ]);
            // TODO::Enviar correo con la nueva contraseña
        });
    }

    protected function generatePassword(int $length = 8): string
    {
        $chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$-_=+';
        return collect(range(1, $length))
            ->map(fn() => $chars[random_int(0, strlen($chars) - 1)])
            ->implode('');
    }
}

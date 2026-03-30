<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Services\UserService;
use App\Http\Services\RoleService;
use Spatie\Permission\Models\Permission;
use Inertia\Inertia;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Models\User;

class UserController extends Controller
{
    protected $sUser;
    protected $sRole;

    public function __construct()
    {
        $this->sUser = new UserService();
        $this->sRole = new RoleService();
    }

    public function getUsers(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        $search  = $request->input('q');

        $users = $this->sUser->getUsers($perPage, $search);
        $roles = $this->sRole->getAll();
        $permissions = Permission::orderBy('name')->get(['id', 'name']);

        return Inertia::render('admin/users/index', [
            'users'       => $users,
            'roles'       => $roles,
            'permissions' => $permissions,
            'filters'     => [
                'q'        => $search,
                'per_page' => $perPage,
            ],
        ]);
    }
    public function store(StoreUserRequest $request)
    {
        $data = $request->validated();
        $user = $this->sUser->createUser($data);
        // TODO::crear email de bienvenida
        return back()->with('success', 'Usuario creado');
    }

    public function update(UpdateUserRequest $request, User $user)
    {
        $data = $request->validated();
        $this->sUser->updateUser($user, $data);
        return back()->with('success', 'Usuario actualizado correctamente.');
    }

    public function destroy(User $user)
    {
        $this->sUser->softDeleteUser($user);
        return back()->with('success', 'Usuario eliminado correctamente.');
    }

    public function resetPassword(User $user)
    {
        $this->sUser->resetPasswordAndNotify($user);
        return back()->with('success', 'Contraseña actualizada y enviada por correo.');
    }
}

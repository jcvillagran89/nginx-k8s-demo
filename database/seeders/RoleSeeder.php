<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Role;
use App\Models\User;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app(\Spatie\Permission\PermissionRegistrar::class)->forgetCachedPermissions();

        Schema::disableForeignKeyConstraints();

        if (Schema::hasTable('role_has_permissions')) {
            DB::table('role_has_permissions')->delete();
        }
        if (Schema::hasTable('model_has_roles')) {
            DB::table('model_has_roles')->delete();
        }

        if (Schema::hasTable('roles')) {
            DB::table('roles')->delete();
        }
        if (Schema::hasTable('permissions')) {
            DB::table('permissions')->delete();
        }

        Schema::enableForeignKeyConstraints();

        $roles = ['superadmin', 'admin', 'lab_technician'];
        foreach ($roles as $role) {
            Role::create(['name' => $role]);
        }

        $user = User::find(1);
        if ($user) {
            $user->assignRole('superadmin');
            $this->command->info('Rol superadmin asignado al usuario #1.');
        } else {
            $this->command->warn('No se encontró un usuario con ID 1, no se asignó el rol.');
        }
    }
}

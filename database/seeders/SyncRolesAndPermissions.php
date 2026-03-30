<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class SyncRolesAndPermissions extends Seeder
{
    public function run(): void
    {

        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        Permission::query()->delete();

        $menuPermissions = [

            'view admin',
            'view users',
            'view roles',
            'view permissions',
            'view healthchecks',

            'view test',
            'view test-results',
            'view supervision',
            'view committee',
            'view external-test',
            'view internal-test',
            'view reports',

            'view catalogue',
            'view providers',

        ];

        $crudPermissions = [

            'tests.index',
            'tests.create',
            'tests.update',
            'tests.delete',

            'terminologies.index',
            'terminologies.create',
            'terminologies.update',
            'terminologies.delete',

            'test-types.index',
            'test-types.create',
            'test-types.update',
            'test-types.delete',

            'test-requests.index',
            'test-requests.create',
            'test-requests.update',
            'test-requests.delete',

            'test-results.index',
            'test-results.create',
            'test-results.update',
            'test-results.delete',

            'Full Access'

        ];


        $allPermissions = array_merge($menuPermissions, $crudPermissions);

        foreach ($allPermissions as $permission) {

            Permission::create([
                'name' => $permission,
                'guard_name' => 'web'
            ]);

        }

        $superadmin = Role::firstOrCreate(['name' => 'superadmin']);
        $admin = Role::firstOrCreate(['name' => 'admin']);
        $labTechnician = Role::firstOrCreate(['name' => 'lab_technician']);

        $superadmin->syncPermissions(Permission::all());

        $adminPermissions = Permission::whereNotIn('name', [
            'view admin',
            'view catalogue',
            'view providers',

        ])->get();

        $admin->syncPermissions($adminPermissions);

        $labTechnician->syncPermissions([

            'view test-results'

        ]);

        app()[PermissionRegistrar::class]->forgetCachedPermissions();
    }
}
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class PermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Limpiar cache de permisos de Spatie
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        $entities = [
            'tests',
            'terminologies',
            'test-types',
            'test-requests',
            'test-results',
        ];

        $actions = ['index', 'create', 'update', 'delete'];

        foreach ($entities as $entity) {
            foreach ($actions as $action) {
                Permission::firstOrCreate(
                    [
                        'name'       => "{$entity}.{$action}",
                        'guard_name' => 'web',
                    ]
                );
            }
        }

        Permission::firstOrCreate(
            [
                'name'       => "Full Access",
                'guard_name' => 'web',
            ]
        );
    }
}

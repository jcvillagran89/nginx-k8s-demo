<?php

return [

    [
        'key' => 'admin',
        'label' => 'Admin',
        'icon' => 'tabler:settings-check',
        'permission' => 'view admin',
        'children' => [

            [
                'key' => 'users',
                'label' => 'Usuarios',
                'url' => '/admin/users',
                'permission' => 'view users'
            ],

            [
                'key' => 'roles',
                'label' => 'Roles',
                'url' => '/admin/roles',
                'permission' => 'view roles'
            ],

            [
                'key' => 'permissions',
                'label' => 'Permisos',
                'url' => '/admin/permissions',
                'permission' => 'view permissions'
            ],

            [
                'key' => 'healthchecks',
                'label' => 'Healthchecks',
                'url' => '/admin/healthchecks',
                'permission' => 'view healthchecks'
            ],
        ],
    ],

    [
        'key' => 'dashboard',
        'label' => 'Dashboard',
        'icon' => 'tabler:dashboard',
        'url' => '/',
    ],

    [
        'key' => 'test',
        'label' => 'Solicitudes de analisis',
        'icon' => 'tabler:file-text',
        'url' => '/test',
        'permission' => 'view test'
    ],

    [
        'key' => 'results',
        'label' => 'Análisis de Muestras',
        'icon' => 'tabler:microscope',
        'url' => '/test-results',
        'permission' => 'view test-results'
    ],

    [
        'key' => 'supervision',
        'label' => 'Supervisión de Muestras',
        'icon' => 'tabler:test-pipe',
        'url' => '/supervision',
        'permission' => 'view supervision'
    ],

    [
        'key' => 'committee',
        'label' => 'Comité de Análisis',
        'icon' => 'tabler:users-minus',
        'url' => '/committee',
        'permission' => 'view committee'
    ],

    [
        'key' => 'tests',
        'label' => 'Análisis externos',
        'icon' => 'tabler:flask',
        'url' => '/external-tests',
        'permission' => 'view external-test'
    ],

    [
        'key' => 'internal-tests',
        'label' => 'Histórico interno',
        'icon' => 'tabler:history',
        'url' => '/internal-tests',
        'permission' => 'view internal-test'
    ],

    [
        'key' => 'reports',
        'label' => 'Informes',
        'icon' => 'tabler:file-analytics',
        'url' => '/reports',
        'permission' => 'view reports'
    ],

    [
        'key' => 'catalogue',
        'label' => 'Catálogos',
        'icon' => 'tabler:address-book',
        'permission' => 'view catalogue',
        'children' => [

            [
                'key' => 'providers',
                'label' => 'Proveedores',
                'url' => '/providers',
                'permission' => 'view providers'
            ],

        ],
    ],

];
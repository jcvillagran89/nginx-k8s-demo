<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@user.com',
            'password' => Hash::make('password'),
        ]);

        $this->call([
            RoleSeeder::class,
            TestTypesSeeder::class,
            TerminologiesSeeder::class,
            PermissionSeeder::class,
            SyncRolesAndPermissions::class
        ]);
    }
}

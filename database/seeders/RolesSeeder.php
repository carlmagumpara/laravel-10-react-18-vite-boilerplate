<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'name' => 'Admin',
                'slug' => 'admin',
            ],
            [
                'name' => 'Client',
                'slug' => 'client',
            ],
        ];

        for ($i = 0; $i < count($data); $i++) {
            Role::create($data[$i]);
        }
    }
}

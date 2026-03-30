<?php

namespace Database\Seeders;

use App\Models\TestType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TestTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $sequenceName = 'TEST_TYPES_ID_SEQ';

        // 1. Vaciar tabla
        DB::statement('DELETE FROM test_types');

        // 2. Borrar la secuencia si existe
        try {
            DB::statement("DROP SEQUENCE {$sequenceName}");
        } catch (\Exception $e) {
            // La secuencia no existe, continuar
        }

        // 3. Crear secuencia desde 1
        DB::statement("
            CREATE SEQUENCE {$sequenceName}
            START WITH 1
            INCREMENT BY 1
            NOMAXVALUE
        ");

        // 4. Registros a insertar
        $types = [
            ['name_es' => 'APARIENCIA', 'name_en' => 'ISO-15487', 'description' => 'Evaluación de Apariencia en prendas de vestir y otros productos textiles después del lavado y secado doméstico'],
            ['name_es' => 'ESTABILIDAD EN PRENDA', 'name_en' => 'AATCC150', 'description' => 'Determinación de los cambios dimensionales en Prenda, despues del lavado doméstico'],
            ['name_es' => 'ESTABILIDAD EN TELA', 'name_en' => 'AATCC135', 'description' => 'Determinación de los cambios dimensionales en Tela, despues del lavado doméstico'],
            ['name_es' => 'TORSION', 'name_en' => 'AATCC179', 'description' => 'Determinación de torsión en telas despues de lavado doméstico'],
            ['name_es' => 'TORSION 207', 'name_en' => 'AATCC207', 'description' => 'Determinación de torsión en Prendas despues de lavado doméstico'],
            ['name_es' => 'PESO', 'name_en' => 'ASTM D3776', 'description' => 'Determinación de masa por unidad de área en los diferentes tipos de tela'],
            ['name_es' => 'PILLING', 'name_en' => 'ASTM D3512', 'description' => 'Determinación de la Resistencia al Pilling en la superficie de los textiles, en equipo Random Tumble'],
            ['name_es' => 'FROTE', 'name_en' => 'AATCC8', 'description' => 'Evaluación de solidez de color al frote seco y húmedo'],
            ['name_es' => 'VALOR PH', 'name_en' => 'AATCC81', 'description' => 'Determinación del valor ph'],
            ['name_es' => 'RASGADO', 'name_en' => 'ASTMD2261', 'description' => 'Resistencia al desgarre de tejidos textiles mediante el procedimiento de lengüeta'],
            ['name_es' => 'TRACCION', 'name_en' => 'ASTMD5034', 'description' => 'Resistencia a la rotura y alargamiento de tejidos textiles'],
            ['name_es' => 'DENSIDAD', 'name_en' => 'ASTMD3774', 'description' => 'Determinación de conteo del número de hilos   longitudinal y transversal'],
            ['name_es' => 'SOLIDEZ', 'name_en' => 'AATCC61', 'description' => 'Determinación de solidez del color al lavado'],
        ];

        // 5. Insertar datos
        foreach ($types as $t) {
            TestType::create([
                'name_es' => $t['name_es'],
                'name_en' => $t['name_en'],
                'description' => $t['description'],
            ]);
        }
    }
}

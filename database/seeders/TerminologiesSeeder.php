<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Str;
use App\Models\TestType;
use App\Models\Terminology;

class TerminologiesSeeder extends Seeder
{
    public function run(): void
    {
        $map = [
            // 👕 APPEARANCE
            'APARIENCIA' => [
                ['es' => 'Humedad relativa (%)', 'en' => 'Relative Humidity (%)'],
                ['es' => 'Temperatura (ºC)', 'en' => 'Temperature (ºC)'],
                ['es' => 'Tolerancia', 'en' => 'Tolerance'],
                ['es' => 'Antes de lavar Cambio de color Tela Principal Grado', 'en' => 'Before washing Color change Main fabric Grade'],
                ['es' => 'Después de Lavar Cambio de color Tela Principal Grado', 'en' => 'After washing Color change Main fabric Grade'],
                ['es' => 'Antes de Lavar Cambio de color en Bies/Cardigan Grado', 'en' => 'Before washing Color change on Bias/Cardigan Grade'],
                ['es' => 'Después de Lavar Cambio de color en Bies/Cardigan Grado', 'en' => 'After washing Color change on Bias/Cardigan Grade'],
                ['es' => 'Manchas', 'en' => 'Stains'],
                ['es' => 'Cambio de color en Estampado', 'en' => 'Color change in Print'],
                ['es' => 'Cambios en estampado', 'en' => 'Changes in Print'],
                ['es' => 'Transferencia de color', 'en' => 'Color transfer'],
                ['es' => 'Antes de Lavar Pilling', 'en' => 'Before washing Pilling'],
                ['es' => 'Después de lavar Pilling Grado', 'en' => 'After washing Pilling Grade'],
                ['es' => 'Suavidad', 'en' => 'Softness'],
                ['es' => 'Rompimiento de la costura', 'en' => 'Seam breakage'],
                ['es' => 'Daños y solturas de Componentes', 'en' => 'Component damage or looseness'],
                ['es' => 'Desprendimiento de Componentes', 'en' => 'Component detachment'],
                ['es' => 'Legibilidad de la etiqueta', 'en' => 'Label readability'],
                ['es' => 'Observaciones', 'en' => 'Observations'],
                ['es' => 'Otros', 'en' => 'Others'],
                ['es' => 'Tolerancia Cambio de', 'en' => 'Tolerance Color Change'],
                ['es' => 'Tolerancia en Manchas', 'en' => 'Tolerance in Stains'],
                ['es' => 'Tolerancia en Cambios en el Estampado', 'en' => 'Tolerance in Print Changes'],
                ['es' => 'Tolerancia en Pilling', 'en' => 'Tolerance in Pilling'],
                ['es' => 'Tolerancia en Suavidad', 'en' => 'Tolerance in Softness'],
                ['es' => 'Tolerancia en Rompimiento de Costura', 'en' => 'Tolerance in Seam Breakage'],
                ['es' => 'Tolerancia Daños y Componentes', 'en' => 'Tolerance in Component Damage'],
                ['es' => 'Tolerancia Componentes y desprendimiento', 'en' => 'Tolerance in Component Detachment'],
                ['es' => 'Tolerancia en Etiqueta', 'en' => 'Tolerance in Label'],
                ['es' => 'Tolerancia Otros', 'en' => 'Tolerance Others'],
            ],

            // 🧪 AATCC150
            'AATCC150' => [
                ['es' => 'Tipo de layout', 'en' => 'Layout type'],
                ['es' => 'Humedad relativa (%)', 'en' => 'Relative Humidity (%)'],
                ['es' => 'Temperatura (°C)', 'en' => 'Temperature (°C)'],
                ['es' => 'Tolerancias', 'en' => 'Tolerances'],
                ['es' => 'Número de lavados', 'en' => 'Number of washes'],
                ['es' => 'Número de especímenes', 'en' => 'Number of specimens'],
            ],

            // 📏 AATCC135
            'AATCC135' => [
                ['es' => 'Tipo de layout', 'en' => 'Layout type'],
                ['es' => 'Humedad relativa (%)', 'en' => 'Relative Humidity (%)'],
                ['es' => 'Temperatura a (°C)', 'en' => 'Temperature (°C)'],
                ['es' => 'Unidades de medida', 'en' => 'Measurement units'],
                ['es' => 'Número de lavados', 'en' => 'Number of washes'],
                ['es' => 'Número de especímenes', 'en' => 'Number of specimens'],
                ['es' => 'Tolerancia Anchos', 'en' => 'Width tolerance'],
                ['es' => 'Tolerancia Largos', 'en' => 'Length tolerance'],
                ['es' => 'Promedio Largo', 'en' => 'Average length'],
                ['es' => 'Promedio Ancho', 'en' => 'Average width'],
            ],

            // 🧵 AATCC179 - TORCION
            'AATCC179' => [
                ['es' => 'Humedad relativa (%)', 'en' => 'Relative Humidity (%)'],
                ['es' => 'Temperatura (°C)', 'en' => 'Temperature (°C)'],
                ['es' => 'Tolerancias', 'en' => 'Tolerances'],
                ['es' => 'Número de especímenes', 'en' => 'Number of specimens'],
                ['es' => 'Torsión promedio', 'en' => 'Average torsion'],
                ['es' => 'Notas', 'en' => 'Notes']
            ],

            // 🧵 AATCC207 - TORCION 207
            'AATCC207' => [
                ['es' => 'Humedad relativa (%)', 'en' => 'Relative Humidity (%)'],
                ['es' => 'Temperatura (°C)', 'en' => 'Temperature (°C)'],
                ['es' => 'Tolerancias', 'en' => 'Tolerances'],
                ['es' => 'Unidades', 'en' => 'Unit'],
                ['es' => 'Largo Izq', 'en' => 'Left width'],
                ['es' => 'Ancho Izq', 'en' => 'Left length'],
                ['es' => 'Torsión Izq %', 'en' => 'Left twist %'],
                ['es' => 'Largo Der', 'en' => 'Right width'],
                ['es' => 'Ancho Der', 'en' => 'Right length'],
                ['es' => 'Torsión Der %', 'en' => 'Right twist %'],
            ],

            // ⚖️ ASTM D3776
            'ASTM D3776' => [
                ['es' => 'Humedad Relativa (%)', 'en' => 'Relative Humidity (%)'],
                ['es' => 'Temperatura (°C)', 'en' => 'Temperature (°C)'],
                ['es' => 'Tolerancias', 'en' => 'Tolerances'],
                ['es' => 'Unidad de peso', 'en' => 'Weight unit'],
                ['es' => 'Tipo de tejido', 'en' => 'Type of fabric'],
            ],

            // 🧶 ASTM D3512
            'ASTM D3512' => [
                ['es' => 'Tolerancia', 'en' => 'Tolerance'],
                ['es' => 'Acondicionamiento Temperatura ºC', 'en' => 'Conditioning Temperature °C'],
                ['es' => 'Acondicionamiento Humedad Relativa %', 'en' => 'Conditioning Relative Humidity %'],
                ['es' => 'Pilling inicial', 'en' => 'Initial Pilling'],
                ['es' => 'Pilling Promedio', 'en' => 'Average Pilling'],
                ['es' => 'Espécimen 1  (Grado)', 'en' => 'Specimen 1 (Grade)'],
                ['es' => 'Espécimen 2  (Grado)', 'en' => 'Specimen 2 (Grade)'],
                ['es' => 'Espécimen 3  (Grado)', 'en' => 'Specimen 3 (Grade)'],
                ['es' => 'Observaciones', 'en' => 'Observations'],
            ],

            // 💧 AATCC8
            'AATCC8' => [
                ['es' => 'Acondicionamiento en Temperatura ºC', 'en' => 'Conditioning Temperature °C'],
                ['es' => 'Acondicionamiento en Humedad relativa %', 'en' => 'Conditioning Relative Humidity %'],
                ['es' => 'Prueba de frote en', 'en' => 'Friction Test'],
                ['es' => 'Tela Principal - Seco Grado', 'en' => 'Main fabric - Dry (Grade)'],
                ['es' => 'Tela Principal - Húmedo Grado', 'en' => 'Main fabric - Wet (Grade)'],
                ['es' => 'Tela Principal - Tolerancia', 'en' => 'Main fabric - Tolerance'],
                ['es' => 'Tela Principal - Pickup', 'en' => 'Main fabric - Pickup'],
                ['es' => 'Tela Principal - Observaciones', 'en' => 'Main fabric - Observations'],
                ['es' => 'Tela Secundaria - Seco Grado', 'en' => 'Secondary fabric - Dry (Grade)'],
                ['es' => 'Tela Secundaria - Húmedo Grado', 'en' => 'Secondary fabric - Wet (Grade)'],
                ['es' => 'Tela Secundaria - Tolerancia', 'en' => 'Secondary fabric - Tolerance'],
                ['es' => 'Tela Secundaria - Pickup', 'en' => 'Secondary fabric - Pickup'],
                ['es' => 'Tela Secundaria - Observaciones', 'en' => 'Secondary fabric - Observations'],
                ['es' => 'Estampado y/o Bordado - Seco Grado', 'en' => 'Print/Embroidery - Dry (Grade)'],
                ['es' => 'Estampado y/o Bordado - Húmedo Grado', 'en' => 'Print/Embroidery - Wet (Grade)'],
                ['es' => 'Estampado y/o Bordado - Tolerancia', 'en' => 'Print/Embroidery - Tolerance'],
                ['es' => 'Estampado y/o Bordado - Pickup', 'en' => 'Print/Embroidery - Pickup'],
                ['es' => 'Estampado y/o Bordado - Observaciones', 'en' => 'Print/Embroidery - Observations'],
                ['es' => 'Seco Grado - 1', 'en' => 'Dry (Grade) - 1'],
                ['es' => 'Húmedo Grado - 1', 'en' => 'Wet (Grade) - 1'],
                ['es' => 'Seco Grado - 2', 'en' => 'Dry (Grade) - 2'],
                ['es' => 'Húmedo Grado - 2', 'en' => 'Wet (Grade) - 2'],
                ['es' => 'Pickup Tela principal', 'en' => 'Pickup Main fabric'],
                ['es' => 'Pickup de Estampado y/o Bordado', 'en' => 'Pickup of Print and/or Embroidery'],
            ],

            // ⚗️ AATCC81
            'AATCC81' => [
                ['es' => 'Tolerancia Mínimo', 'en' => 'Minimum Tolerance'],
                ['es' => 'Tolerancia Máxima', 'en' => 'Maximum Tolerance'],
                ['es' => 'Peso analizado', 'en' => 'Analyzed weight'],
                ['es' => 'Valor pH', 'en' => 'pH Value'],
            ],

            // 🪡 ASTM D2261 RASGADO
            'ASTMD2261' => [
                ['es' => 'Humedad relativa (%)', 'en' => 'Relative Humidity (%)'],
                ['es' => 'Temperatura (°C)', 'en' => 'Temperature (°C)'],
                ['es' => 'Tolerancias', 'en' => 'Tolerances'],

                // ✅ nuevo: para el select 1..5
                ['es' => 'Número de especímenes', 'en' => 'Number of specimens'],

                // ✅ tolerancias por dirección
                ['es' => 'Tolerancia Urdimbre', 'en' => 'Warp Tolerance'],
                ['es' => 'Tolerancia Trama', 'en' => 'Weft Tolerance'],

                // ✅ promedios (se guardan pero los calcula el sistema)
                ['es' => 'Promedio (Urdimbre)', 'en' => 'Average (Warp)'],
                ['es' => 'Promedio (Trama)', 'en' => 'Average (Weft)'],

                ['es' => 'Notas', 'en' => 'Notes'],
            ],

            // 🧰 ASTM D5034 TRACCION
            'ASTMD5034' => [
                ['es' => 'Humedad relativa (%)', 'en' => 'Relative Humidity (%)'],
                ['es' => 'Temperatura (°C)', 'en' => 'Temperature (°C)'],
                ['es' => 'Número de especímenes', 'en' => 'Number of specimens'],
                ['es' => 'Unidades', 'en' => 'Unit'],
                ['es' => 'Tolerancia Urdimbre', 'en' => 'Warp Tolerance'],
                ['es' => 'Tolerancia Trama', 'en' => 'Weft Tolerance'],
                ['es' => 'Promedio Urdimbre', 'en' => 'Average Warp'],
                ['es' => 'Promedio Trama', 'en' => 'Average Weft'],
            ],

            // 🧼 AATCC61
            'AATCC61' => [
                ['es' => 'Tolerancia', 'en' => 'Tolerance'],
                ['es' => 'Acondicionamiento Temperatura ºC', 'en' => 'Conditioning Temperature °C'],
                ['es' => 'Acondicionamiento Humedad Relativa %', 'en' => 'Conditioning Relative Humidity %'],
                ['es' => 'Transferencia de color (Acetato)', 'en' => 'Color transfer (Acetate)'],
                ['es' => 'Transferencia de color (Algodon)', 'en' => 'Color transfer (Cotton)'],
                ['es' => 'Transferencia de color (Poliamida)', 'en' => 'Color transfer (Polyamide)'],
                ['es' => 'Transferencia de color (Poliester)', 'en' => 'Color transfer (Polyester)'],
                ['es' => 'Transferencia de color (Acrilico)', 'en' => 'Color transfer (Acrylic)'],
                ['es' => 'Transferencia de color (Lana)', 'en' => 'Color transfer (Lane)'],
                ['es' => 'Observaciones', 'en' => 'Observations'],
            ],

            // ⚙️ DENSIDAD
            'DENSIDAD' => [
                ['es' => 'Tolerancia', 'en' => 'Tolerance'],
                ['es' => 'Acondicionamiento Temperatura ºC', 'en' => 'Conditioning Temperature °C'],
                ['es' => 'Acondicionamiento Humedad Relativa %', 'en' => 'Conditioning Relative Humidity %'],
                ['es' => 'No. Hilos urd/columnas (en 1in)', 'en' => 'No. Warp threads/columns (in 1in)'],
                ['es' => 'No. Hilos trama/mallas (en 1in)', 'en' => 'No. Weft threads/meshes (in 1in)'],
                ['es' => 'Observaciones', 'en' => 'Observations'],
                ['es' => 'Tipo de tejido', 'en' => 'Type of fabric'],
            ],
        ];

        // ✅ ASTM D5034: campos por espécimen (1..5) Urdimbre/Trama/Observaciones
        $astmD5034SpecimenFields = [];
        for ($specimen = 1; $specimen <= 5; $specimen++) {
            $astmD5034SpecimenFields[] = [
                'es' => "Espécimen {$specimen} Urdimbre (lb/f)",
                'en' => "Specimen {$specimen} Warp (lb/f)",
            ];

            $astmD5034SpecimenFields[] = [
                'es' => "Espécimen {$specimen} Trama (lb/f)",
                'en' => "Specimen {$specimen} Weft (lb/f)",
            ];

            $astmD5034SpecimenFields[] = [
                'es' => "Espécimen {$specimen} Observaciones",
                'en' => "Specimen {$specimen} Notes",
            ];
        }

        if (isset($map['ASTMD5034']) && is_array($map['ASTMD5034'])) {
            $map['ASTMD5034'] = array_merge($map['ASTMD5034'], $astmD5034SpecimenFields);
        }

        // ✅ ASTM D2261: campos por espécimen (1..5) para Urdimbre y Trama
        $astmD2261SpecimenFields = [];
        for ($specimen = 1; $specimen <= 5; $specimen++) {
            $astmD2261SpecimenFields[] = [
                'es' => "Espécimen {$specimen} Urdimbre (lb/f)",
                'en' => "Specimen {$specimen} Warp (lb/f)",
            ];

            $astmD2261SpecimenFields[] = [
                'es' => "Espécimen {$specimen} Trama (lb/f)",
                'en' => "Specimen {$specimen} Weft (lb/f)",
            ];
        }

        if (isset($map['ASTMD2261']) && is_array($map['ASTMD2261'])) {
            $map['ASTMD2261'] = array_merge($map['ASTMD2261'], $astmD2261SpecimenFields);
        }

        // 🧵 AATCC179 - TORCION (campos por espécimen 1..5)
        $aatcc179SpecimenFields = [];
        for ($specimen = 1; $specimen <= 5; $specimen++) {
            $aatcc179SpecimenFields[] = [
                'es' => "Espécimen {$specimen} Unidades",
                'en' => "Specimen {$specimen} Unit",
            ];
            $aatcc179SpecimenFields[] = [
                'es' => "Espécimen {$specimen} Valor AC",
                'en' => "Specimen {$specimen} Value AC",
            ];
            $aatcc179SpecimenFields[] = [
                'es' => "Espécimen {$specimen} Valor BD",
                'en' => "Specimen {$specimen} Value BD",
            ];
            $aatcc179SpecimenFields[] = [
                'es' => "Espécimen {$specimen} Torsión %",
                'en' => "Specimen {$specimen} Twist %",
            ];
        }

        if (isset($map['AATCC179']) && is_array($map['AATCC179'])) {
            $map['AATCC179'] = array_merge($map['AATCC179'], $aatcc179SpecimenFields);
        }

        $aatcc135SpecimenFields = [];
        for ($specimen = 1; $specimen <= 3; $specimen++) {
            foreach (['Largo', 'Ancho'] as $dimension) {
                for ($index = 1; $index <= 3; $index++) {
                    $aatcc135SpecimenFields[] = [
                        'es' => "Espécimen {$specimen} {$dimension} {$index} (A)",
                        'en' => "Specimen {$specimen} {$dimension} {$index} (A)",
                    ];
                    for ($wash = 1; $wash <= 5; $wash++) {
                        $aatcc135SpecimenFields[] = [
                            'es' => "Espécimen {$specimen} {$dimension} {$index} (B{$wash})",
                            'en' => "Specimen {$specimen} {$dimension} {$index} (B{$wash})",
                        ];
                    }
                }
            }
        }

        if (isset($map['AATCC135']) && is_array($map['AATCC135'])) {
            $map['AATCC135'] = array_merge($map['AATCC135'], $aatcc135SpecimenFields);
        }

        $aatcc150SpecimenFields = [];
        for ($specimen = 1; $specimen <= 3; $specimen++) {
            foreach (['Largo', 'Ancho'] as $dimension) {
                for ($index = 1; $index <= 3; $index++) {
                    $aatcc150SpecimenFields[] = [
                        'es' => "Espécimen {$specimen} {$dimension} {$index} Descripción",
                        'en' => "Specimen {$specimen} {$dimension} {$index} Description",
                    ];
                    $aatcc150SpecimenFields[] = [
                        'es' => "Espécimen {$specimen} {$dimension} {$index} Unidad",
                        'en' => "Specimen {$specimen} {$dimension} {$index} Unit",
                    ];
                    $aatcc150SpecimenFields[] = [
                        'es' => "Espécimen {$specimen} {$dimension} {$index} (A)",
                        'en' => "Specimen {$specimen} {$dimension} {$index} (A)",
                    ];
                    for ($wash = 1; $wash <= 5; $wash++) {
                        $aatcc150SpecimenFields[] = [
                            'es' => "Espécimen {$specimen} {$dimension} {$index} (B{$wash})",
                            'en' => "Specimen {$specimen} {$dimension} {$index} (B{$wash})",
                        ];
                    }
                }
            }
        }

        if (isset($map['AATCC150']) && is_array($map['AATCC150'])) {
            $map['AATCC150'] = array_merge($map['AATCC150'], $aatcc150SpecimenFields);
        }

        $astm3776SpecimenFields = [];
        for ($specimen = 1; $specimen <= 5; $specimen++) {
            $astm3776SpecimenFields[] = [
                'es' => "Espécimen {$specimen}",
                'en' => "Specimen {$specimen}",
            ];
        }

        if (isset($map['ASTM D3776']) && is_array($map['ASTM D3776'])) {
            $map['ASTM D3776'] = array_merge($map['ASTM D3776'], $astm3776SpecimenFields);
        }

        $prunableTestNames = array_keys($map);

        foreach ($map as $testName => $fields) {
            $testType = TestType::where('name_es', $testName)
                ->orWhere('name_en', $testName)
                ->first();

            if (!$testType) {
                $this->command->warn("⚠️ TestType '{$testName}' no encontrado, se omite.");
                continue;
            }

            $slugs = [];

            foreach ($fields as $field) {
                $slug = Str::slug($field['es'], '_');
                $slugs[] = $slug;

                Terminology::updateOrCreate(
                    [
                        'name' => $slug,
                        'test_type_id' => $testType->id,
                    ],
                    [
                        'display_name_es' => $field['es'],
                        'display_name_en' => $field['en'],
                    ]
                );
            }

            if (in_array($testName, $prunableTestNames, true)) {
                $uniqueSlugs = array_values(array_unique($slugs));
                Terminology::where('test_type_id', $testType->id)
                    ->whereNotIn('name', $uniqueSlugs)
                    ->delete();
            }
        }

        $this->command->info('✅ Terminologies seeded successfully!');
    }
}

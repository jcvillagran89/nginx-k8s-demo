<?php

use App\Models\Terminology;
use App\Models\TestResult;
use App\Models\TestType;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;
use App\Console\Commands\SyncProvidersEmailsCommand;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('sharepoint:import-styles')->daily();
Schedule::call(function () {
    cache()->put('healthchecks_schedule_last_run_at', now()->toIso8601String(), now()->addDays(2));
})->everyMinute()->name('healthchecks-heartbeat');

$backfillSectionFields = function (
    $command,
    string $testTypeNameEn,
    string $testTypeNameEs,
    string $errorPrefix,
    bool $dryRun
) {
    $testType = TestType::query()
        ->where('name_en', $testTypeNameEn)
        ->orWhere('name_es', $testTypeNameEs)
        ->first();

    if (!$testType) {
        $command->error("No se encontró el TestType {$errorPrefix}.");
        return 1;
    }

    $terminologies = Terminology::query()
        ->where('test_type_id', $testType->id)
        ->get();

    if ($terminologies->isEmpty()) {
        $command->error("No hay terminologías registradas para {$errorPrefix}.");
        return 1;
    }

    $sectionKey = $testType->name_es ?? $testType->name_en;
    $allowedIds = [];
    foreach ($terminologies as $term) {
        $allowedIds[(string) $term->id] = true;
    }

    $updated = 0;
    $scanned = 0;
    $addedFields = 0;
    $removedFields = 0;

    TestResult::query()
        ->select(['id', 'content'])
        ->orderBy('id')
        ->chunkById(200, function ($results) use (
            $terminologies,
            $allowedIds,
            $sectionKey,
            $dryRun,
            &$updated,
            &$scanned,
            &$addedFields,
            &$removedFields
        ) {
            foreach ($results as $result) {
                $scanned++;
                $content = $result->content;

                if (!is_array($content) || !isset($content[$sectionKey]) || !is_array($content[$sectionKey])) {
                    continue;
                }

                $section = $content[$sectionKey];
                $changed = false;

                foreach ($terminologies as $term) {
                    $key = (string) $term->id;
                    if (array_key_exists($key, $section) || array_key_exists($term->id, $section)) {
                        continue;
                    }

                    $section[$term->id] = [
                        'label' => $term->name,
                        'display_name' => $term->display_name_es,
                        'value' => null,
                    ];
                    $changed = true;
                    $addedFields++;
                }

                foreach ($section as $key => $value) {
                    $keyString = (string) $key;
                    if (!ctype_digit($keyString)) {
                        continue;
                    }
                    if (!isset($allowedIds[$keyString])) {
                        unset($section[$key]);
                        $changed = true;
                        $removedFields++;
                    }
                }

                if ($changed) {
                    $content[$sectionKey] = $section;
                    if (!$dryRun) {
                        $result->content = $content;
                        $result->save();
                    }
                    $updated++;
                }
            }
        });

    $suffix = $dryRun ? ' (dry-run)' : '';
    $command->info("TestResults escaneados: {$scanned}{$suffix}");
    $command->info("TestResults actualizados: {$updated}{$suffix}");
    $command->info("Campos agregados: {$addedFields}{$suffix}");
    $command->info("Campos removidos: {$removedFields}{$suffix}");

    return 0;
};

$pruneSectionFields = function (
    string $commandName,
    string $testTypeNameEn,
    string $testTypeNameEs,
    string $purpose,
    string $errorPrefix
) {
    Artisan::command("{$commandName} {--dry-run}", function () use (
        $testTypeNameEn,
        $testTypeNameEs,
        $purpose,
        $errorPrefix
    ) {
        $testType = TestType::query()
            ->where('name_en', $testTypeNameEn)
            ->orWhere('name_es', $testTypeNameEs)
            ->first();

        if (!$testType) {
            $this->error("No se encontró el TestType {$errorPrefix}.");
            return 1;
        }

        $terminologies = Terminology::query()
            ->where('test_type_id', $testType->id)
            ->get();

        if ($terminologies->isEmpty()) {
            $this->error("No hay terminologías registradas para {$errorPrefix}.");
            return 1;
        }

        $allowedIds = [];
        foreach ($terminologies as $term) {
            $allowedIds[(string) $term->id] = true;
        }

        $sectionKey = $testType->name_es ?? $testType->name_en;
        $dryRun = (bool) $this->option('dry-run');

        $updated = 0;
        $scanned = 0;
        $removed = 0;

        TestResult::query()
            ->select(['id', 'content'])
            ->orderBy('id')
            ->chunkById(200, function ($results) use (
                $allowedIds,
                $sectionKey,
                $dryRun,
                &$updated,
                &$scanned,
                &$removed
            ) {
                foreach ($results as $result) {
                    $scanned++;
                    $content = $result->content;

                    if (!is_array($content) || !isset($content[$sectionKey]) || !is_array($content[$sectionKey])) {
                        continue;
                    }

                    $section = $content[$sectionKey];
                    $changed = false;

                    foreach ($section as $key => $value) {
                        $keyString = (string) $key;
                        if (!ctype_digit($keyString)) {
                            continue;
                        }
                        if (!isset($allowedIds[$keyString])) {
                            unset($section[$key]);
                            $changed = true;
                            $removed++;
                        }
                    }

                    if ($changed) {
                        $content[$sectionKey] = $section;
                        if (!$dryRun) {
                            $result->content = $content;
                            $result->save();
                        }
                        $updated++;
                    }
                }
            });

        $suffix = $dryRun ? ' (dry-run)' : '';
        $this->info("TestResults escaneados: {$scanned}{$suffix}");
        $this->info("TestResults actualizados: {$updated}{$suffix}");
        $this->info("Campos removidos: {$removed}{$suffix}");

        return 0;
    })->purpose($purpose);
};

Artisan::command('prune:test-results {--tests= : Lista separada por comas (o "all")} {--dry-run}', function () {
    $requested = (string) ($this->option('tests') ?? '');
    $dryRun = (bool) $this->option('dry-run');

    $map = [
        'iso-15487' => ['ISO-15487', 'APARIENCIA', 'ISO-15487 / APARIENCIA'],
        'iso15487' => ['ISO-15487', 'APARIENCIA', 'ISO-15487 / APARIENCIA'],
        'apariencia' => ['ISO-15487', 'APARIENCIA', 'ISO-15487 / APARIENCIA'],
        'aatcc61' => ['AATCC61', 'SOLIDEZ', 'AATCC61 / SOLIDEZ'],
        'lavado' => ['AATCC61', 'SOLIDEZ', 'AATCC61 / SOLIDEZ'],
        'solidez' => ['AATCC61', 'SOLIDEZ', 'AATCC61 / SOLIDEZ'],
        'aatcc8' => ['AATCC8', 'FROTE', 'AATCC8 / FROTE'],
        'frote' => ['AATCC8', 'FROTE', 'AATCC8 / FROTE'],
        'astmd3512' => ['ASTM D3512', 'PILLING', 'ASTM D3512 / PILLING'],
        'd3512' => ['ASTM D3512', 'PILLING', 'ASTM D3512 / PILLING'],
        'pilling' => ['ASTM D3512', 'PILLING', 'ASTM D3512 / PILLING'],
        'astmd2261' => ['ASTMD2261', 'RASGADO', 'ASTMD2261 / RASGADO'],
        'd2261' => ['ASTMD2261', 'RASGADO', 'ASTMD2261 / RASGADO'],
        'rasgado' => ['ASTMD2261', 'RASGADO', 'ASTMD2261 / RASGADO'],
        'astmd5034' => ['ASTMD5034', 'TRACCION', 'ASTMD5034 / TRACCION'],
        'd5034' => ['ASTMD5034', 'TRACCION', 'ASTMD5034 / TRACCION'],
        'traccion' => ['ASTMD5034', 'TRACCION', 'ASTMD5034 / TRACCION'],
        'aatcc179' => ['AATCC179', 'TORSION', 'AATCC179 / TORSION'],
        'torsion' => ['AATCC179', 'TORSION', 'AATCC179 / TORSION'],
        'aatcc207' => ['AATCC207', 'TORSION 207', 'AATCC207 / TORSION 207'],
        'torsion-207' => ['AATCC207', 'TORSION 207', 'AATCC207 / TORSION 207'],
        'torsion207' => ['AATCC207', 'TORSION 207', 'AATCC207 / TORSION 207'],
        'aatcc135' => ['AATCC135', 'ESTABILIDAD EN TELA', 'AATCC135 / ESTABILIDAD EN TELA'],
        'tela' => ['AATCC135', 'ESTABILIDAD EN TELA', 'AATCC135 / ESTABILIDAD EN TELA'],
        'estabilidad-en-tela' => ['AATCC135', 'ESTABILIDAD EN TELA', 'AATCC135 / ESTABILIDAD EN TELA'],
        'aatcc150' => ['AATCC150', 'ESTABILIDAD EN PRENDA', 'AATCC150 / ESTABILIDAD EN PRENDA'],
        'prenda' => ['AATCC150', 'ESTABILIDAD EN PRENDA', 'AATCC150 / ESTABILIDAD EN PRENDA'],
        'estabilidad-en-prenda' => ['AATCC150', 'ESTABILIDAD EN PRENDA', 'AATCC150 / ESTABILIDAD EN PRENDA'],
        'astm3776' => ['ASTM D3776', 'PESO', 'ASTM D3776 / PESO'],
        'peso' => ['ASTM D3776', 'PESO', 'ASTM D3776 / PESO'],
        'aatcc81' => ['AATCC81', 'VALOR PH', 'AATCC81 / VALOR PH'],
        'valor-ph' => ['AATCC81', 'VALOR PH', 'AATCC81 / VALOR PH'],
        'valorph' => ['AATCC81', 'VALOR PH', 'AATCC81 / VALOR PH'],
        'ph' => ['AATCC81', 'VALOR PH', 'AATCC81 / VALOR PH'],
        'astmd3774' => ['ASTMD3774', 'DENSIDAD', 'ASTMD3774 / DENSIDAD'],
        'd3774' => ['ASTMD3774', 'DENSIDAD', 'ASTMD3774 / DENSIDAD'],
        'densidad' => ['ASTMD3774', 'DENSIDAD', 'ASTMD3774 / DENSIDAD'],
    ];

    $defaultTests = ['apariencia', 'aatcc61', 'aatcc8', 'astmd3512', 'astmd2261', 'astmd5034', 'aatcc179', 'aatcc207', 'aatcc135', 'aatcc150', 'astm3776', 'aatcc81', 'astmd3774'];
    $tokens = array_values(array_filter(array_map('trim', explode(',', strtolower($requested)))));
    $selected = $tokens ?: $defaultTests;

    if (count($selected) === 1 && $selected[0] === 'all') {
        $selected = $defaultTests;
    }

    $errors = 0;

    foreach ($selected as $token) {
        if (!isset($map[$token])) {
            $this->error("Prueba no reconocida: {$token}");
            $errors++;
            continue;
        }

        [$nameEn, $nameEs, $label] = $map[$token];
        $this->info("Prune: {$label}");

        $testType = TestType::query()
            ->where('name_en', $nameEn)
            ->orWhere('name_es', $nameEs)
            ->first();

        if (!$testType) {
            $this->error("No se encontró el TestType {$label}.");
            $errors++;
            continue;
        }

        $terminologies = Terminology::query()
            ->where('test_type_id', $testType->id)
            ->get();

        if ($terminologies->isEmpty()) {
            $this->error("No hay terminologías registradas para {$label}.");
            $errors++;
            continue;
        }

        $allowedIds = [];
        foreach ($terminologies as $term) {
            $allowedIds[(string) $term->id] = true;
        }

        $sectionKey = $testType->name_es ?? $testType->name_en;

        $updated = 0;
        $scanned = 0;
        $removed = 0;

        TestResult::query()
            ->select(['id', 'content'])
            ->orderBy('id')
            ->chunkById(200, function ($results) use (
                $allowedIds,
                $sectionKey,
                $dryRun,
                &$updated,
                &$scanned,
                &$removed
            ) {
                foreach ($results as $result) {
                    $scanned++;
                    $content = $result->content;

                    if (!is_array($content) || !isset($content[$sectionKey]) || !is_array($content[$sectionKey])) {
                        continue;
                    }

                    $section = $content[$sectionKey];
                    $changed = false;

                    foreach ($section as $key => $value) {
                        $keyString = (string) $key;
                        if (!ctype_digit($keyString)) {
                            continue;
                        }
                        if (!isset($allowedIds[$keyString])) {
                            unset($section[$key]);
                            $changed = true;
                            $removed++;
                        }
                    }

                    if ($changed) {
                        $content[$sectionKey] = $section;
                        if (!$dryRun) {
                            $result->content = $content;
                            $result->save();
                        }
                        $updated++;
                    }
                }
            });

        $suffix = $dryRun ? ' (dry-run)' : '';
        $this->info("TestResults escaneados: {$scanned}{$suffix}");
        $this->info("TestResults actualizados: {$updated}{$suffix}");
        $this->info("Campos removidos: {$removed}{$suffix}");
    }

    return $errors > 0 ? 1 : 0;
})->purpose('Prune para pruebas seleccionadas');

Artisan::command('backfill:test-results {--tests= : Lista separada por comas (o "all")} {--dry-run}', function () use ($backfillSectionFields) {
    $requested = (string) ($this->option('tests') ?? '');
    $dryRun = (bool) $this->option('dry-run');

    $map = [
        'iso-15487' => ['ISO-15487', 'APARIENCIA', 'ISO-15487 / APARIENCIA'],
        'iso15487' => ['ISO-15487', 'APARIENCIA', 'ISO-15487 / APARIENCIA'],
        'apariencia' => ['ISO-15487', 'APARIENCIA', 'ISO-15487 / APARIENCIA'],
        'aatcc61' => ['AATCC61', 'SOLIDEZ', 'AATCC61 / SOLIDEZ'],
        'lavado' => ['AATCC61', 'SOLIDEZ', 'AATCC61 / SOLIDEZ'],
        'solidez' => ['AATCC61', 'SOLIDEZ', 'AATCC61 / SOLIDEZ'],
        'aatcc8' => ['AATCC8', 'FROTE', 'AATCC8 / FROTE'],
        'frote' => ['AATCC8', 'FROTE', 'AATCC8 / FROTE'],
        'astmd3512' => ['ASTM D3512', 'PILLING', 'ASTM D3512 / PILLING'],
        'd3512' => ['ASTM D3512', 'PILLING', 'ASTM D3512 / PILLING'],
        'pilling' => ['ASTM D3512', 'PILLING', 'ASTM D3512 / PILLING'],
        'astmd2261' => ['ASTMD2261', 'RASGADO', 'ASTMD2261 / RASGADO'],
        'd2261' => ['ASTMD2261', 'RASGADO', 'ASTMD2261 / RASGADO'],
        'rasgado' => ['ASTMD2261', 'RASGADO', 'ASTMD2261 / RASGADO'],
        'astmd5034' => ['ASTMD5034', 'TRACCION', 'ASTMD5034 / TRACCION'],
        'd5034' => ['ASTMD5034', 'TRACCION', 'ASTMD5034 / TRACCION'],
        'traccion' => ['ASTMD5034', 'TRACCION', 'ASTMD5034 / TRACCION'],
        'aatcc179' => ['AATCC179', 'TORSION', 'AATCC179 / TORSION'],
        'torsion' => ['AATCC179', 'TORSION', 'AATCC179 / TORSION'],
        'aatcc207' => ['AATCC207', 'TORSION 207', 'AATCC207 / TORSION 207'],
        'torsion-207' => ['AATCC207', 'TORSION 207', 'AATCC207 / TORSION 207'],
        'torsion207' => ['AATCC207', 'TORSION 207', 'AATCC207 / TORSION 207'],
        'aatcc135' => ['AATCC135', 'ESTABILIDAD EN TELA', 'AATCC135 / ESTABILIDAD EN TELA'],
        'tela' => ['AATCC135', 'ESTABILIDAD EN TELA', 'AATCC135 / ESTABILIDAD EN TELA'],
        'estabilidad-en-tela' => ['AATCC135', 'ESTABILIDAD EN TELA', 'AATCC135 / ESTABILIDAD EN TELA'],
        'aatcc150' => ['AATCC150', 'ESTABILIDAD EN PRENDA', 'AATCC150 / ESTABILIDAD EN PRENDA'],
        'prenda' => ['AATCC150', 'ESTABILIDAD EN PRENDA', 'AATCC150 / ESTABILIDAD EN PRENDA'],
        'estabilidad-en-prenda' => ['AATCC150', 'ESTABILIDAD EN PRENDA', 'AATCC150 / ESTABILIDAD EN PRENDA'],
        'astm3776' => ['ASTM D3776', 'PESO', 'ASTM D3776 / PESO'],
        'peso' => ['ASTM D3776', 'PESO', 'ASTM D3776 / PESO'],
        'aatcc81' => ['AATCC81', 'VALOR PH', 'AATCC81 / VALOR PH'],
        'valor-ph' => ['AATCC81', 'VALOR PH', 'AATCC81 / VALOR PH'],
        'valorph' => ['AATCC81', 'VALOR PH', 'AATCC81 / VALOR PH'],
        'ph' => ['AATCC81', 'VALOR PH', 'AATCC81 / VALOR PH'],
        'astmd3774' => ['ASTMD3774', 'DENSIDAD', 'ASTMD3774 / DENSIDAD'],
        'd3774' => ['ASTMD3774', 'DENSIDAD', 'ASTMD3774 / DENSIDAD'],
        'densidad' => ['ASTMD3774', 'DENSIDAD', 'ASTMD3774 / DENSIDAD'],
    ];

    $defaultTests = ['apariencia', 'aatcc61', 'aatcc8', 'astmd3512', 'astmd2261', 'astmd5034', 'aatcc179', 'aatcc207', 'aatcc135', 'aatcc150', 'astm3776', 'aatcc81', 'astmd3774'];
    $tokens = array_values(array_filter(array_map('trim', explode(',', strtolower($requested)))));
    $selected = $tokens ?: $defaultTests;

    if (count($selected) === 1 && $selected[0] === 'all') {
        $selected = $defaultTests;
    }

    $errors = 0;

    foreach ($selected as $token) {
        if (!isset($map[$token])) {
            $this->error("Prueba no reconocida: {$token}");
            $errors++;
            continue;
        }

        [$nameEn, $nameEs, $label] = $map[$token];
        $this->info("Backfill: {$label}");
        $result = $backfillSectionFields($this, $nameEn, $nameEs, $label, $dryRun);
        if ($result !== 0) {
            $errors++;
        }
    }

    return $errors > 0 ? 1 : 0;
})->purpose('Backfill para pruebas seleccionadas');

Artisan::command('providers:sync-emails {path}', function ($path) {
    $this->call(SyncProvidersEmailsCommand::class, [
        'path' => $path,
    ]);
});

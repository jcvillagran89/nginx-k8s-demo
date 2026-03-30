<?php

namespace App\Jobs;

use App\Http\Services\TestImportService;
use App\Models\RecentActivity;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ImportStylesFromLayout implements ShouldQueue
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $timeout = 1200;

    public function __construct(
        private readonly string $storedPath,
        private readonly int $userId,
        private readonly ?string $originalName = null
    ) {}

    public function handle(TestImportService $service): void
    {
        try {
            $absolutePath = Storage::path($this->storedPath);
            $results = $service->importStylesFromLayout($absolutePath);

            RecentActivity::create([
                'user_id' => $this->userId,
                'title' => 'Importación de pruebas externas finalizada',
                'description' => sprintf(
                    'Archivo %s. Styles creados: %d. Styles actualizados: %d. Tests creados: %d. Omitidos: %d.',
                    $this->originalName ?? $this->storedPath,
                    $results['styles_created'] ?? 0,
                    $results['styles_updated'] ?? 0,
                    $results['tests_created'] ?? 0,
                    $results['skipped'] ?? 0
                ),
                'type' => 'success',
                'icon' => RecentActivity::ICONS['success'],
            ]);
        } catch (\Throwable $e) {
            Log::error('Error al importar styles desde layout.', [
                'path' => $this->storedPath,
                'error' => $e->getMessage(),
            ]);

            throw $e;
        }
    }

    public function failed(\Throwable $e): void
    {
        RecentActivity::create([
            'user_id' => $this->userId,
            'title' => 'Falló la importación de pruebas externas',
            'description' => sprintf(
                'Archivo de importacion fallido',
            ),
            'type' => 'danger',
            'icon' => RecentActivity::ICONS['danger'],
        ]);
    }
}

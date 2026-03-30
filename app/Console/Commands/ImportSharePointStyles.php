<?php

namespace App\Console\Commands;

use App\Http\Services\SharePointStyleImportService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ImportSharePointStyles extends Command
{
    protected $signature = 'sharepoint:import-styles';
    protected $description = 'Importa estilos desde Excel en SharePoint.';

    public function handle(SharePointStyleImportService $service): int
    {
        $shareLink = config('services.microsoft.share_link');
        if (! $shareLink) {
            $this->error('MICROSOFT_SHARE_LINK no está configurado.');
            return self::FAILURE;
        }

        try {
            $stats = $service->importFromShareLink($shareLink);
        } catch (\Throwable $e) {
            $this->error($e->getMessage());
            return self::FAILURE;
        }

        $this->info('Importación completada.');
        $this->table(
            ['Métrica', 'Valor'],
            [
                ['Hojas encontradas', $stats['sheets_total']],
                ['Hojas procesadas', $stats['sheets_processed']],
                ['Filas leídas', $stats['rows_read']],
                ['Filas actualizadas', $stats['rows_updated']],
                ['Filas omitidas', $stats['rows_skipped']],
                ['Estilos no encontrados', $stats['styles_missing']],
            ]
        );

        if (! empty($stats['styles_missing_numbers'])) {
            Log::warning('Estilos no encontrados en SharePoint import.', [
                'style_numbers' => $stats['styles_missing_numbers'],
            ]);
        }

        return self::SUCCESS;
    }
}

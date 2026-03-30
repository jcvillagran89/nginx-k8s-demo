<?php

namespace App\Console\Commands;

use App\Models\Provider;
use Illuminate\Console\Command;
use Maatwebsite\Excel\Facades\Excel;

class SyncProvidersEmailsCommand extends Command
{
    protected $signature = 'providers:sync-emails 
                            {path : Ruta del archivo Excel dentro de storage/app}';

    protected $description = 'Sincroniza proveedores con sus correos electrónicos desde un Excel';

    public function handle(): int
    {
        // $path = storage_path('app/' . $this->argument('path'));
        $path = resource_path('/' . $this->argument('path'));
        if (!file_exists($path)) {
            $this->error('❌ El archivo no existe: ' . $path);
            return Command::FAILURE;
        }

        $this->info('📄 Leyendo archivo: ' . $path);

        $rows = Excel::toArray([], $path)[0];

        if (count($rows) <= 1) {
            $this->warn('⚠️ El archivo no contiene datos.');
            return Command::SUCCESS;
        }

        // Quitar encabezados
        unset($rows[0]);

        $providersEmails = [];

        foreach ($rows as $row) {
            $providerName = trim($row[0] ?? '');
            $email = strtolower(trim($row[1] ?? ''));

            if (!$providerName || !$email) {
                continue;
            }

            $providersEmails[$providerName][] = $email;
        }

        $updated = 0;
        $notFound = 0;

        foreach ($providersEmails as $providerName => $emails) {
            $normalizedExcelName = $this->normalize($providerName);

            $provider = Provider::all()->first(function ($p) use ($normalizedExcelName) {
                return $this->normalize($p->name) === $normalizedExcelName;
            });
            if (!$provider) {
                $this->warn("⚠️ Proveedor no encontrado: {$providerName}");
                $notFound++;
                continue;
            }

            $provider->update([
                'emails' => array_values(array_unique($emails)),
            ]);

            $updated++;
        }

        $this->info('✅ Sincronización completada');
        $this->line("✔ Proveedores actualizados: {$updated}");
        $this->line("❌ Proveedores no encontrados: {$notFound}");

        return Command::SUCCESS;
    }

    private function normalize(string $value): string
    {
        $value = strtolower($value);
        $value = trim($value);

        $value = iconv('UTF-8', 'ASCII//TRANSLIT', $value);

        $value = preg_replace('/[^a-z0-9 ]/', '', $value);

        $value = preg_replace('/\s+/', ' ', $value);

        return $value;
    }
}
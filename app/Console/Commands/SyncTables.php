<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class SyncTables extends Command
{
    protected $signature = 'sync:tables
                            {table? : Nombre lógico de la tabla (orders, customers, etc.)}
                            {--all : Ejecutar todas las sincronizaciones configuradas}
                            {--from-id= : ID mínimo a partir del cual sincronizar}
                            {--limit= : Número máximo de registros a procesar}
                            {--chunk=1000 : Tamaño de chunk}
                            {--dry-run : No escribe en Oracle, solo simula}';

    protected $description = 'Sincroniza tablas de MariaDB a Oracle usando servicios de DbSync';

    public function handle()
    {
        $fromId = $this->option('from-id') ? (int) $this->option('from-id') : null;
        $limit  = $this->option('limit') ? (int) $this->option('limit') : null;
        $chunk  = (int) $this->option('chunk');
        $dryRun = (bool) $this->option('dry-run');

        $config = config('dbsync', []);

        if ($this->option('all')) {
            foreach ($config as $name => $serviceClass) {
                $this->runOne($name, $serviceClass, $fromId, $limit, $chunk, $dryRun);
            }
            return 0;
        }

        $table = $this->argument('table');

        if (!$table) {
            $this->error('Debes especificar una tabla o usar --all');
            $this->line('Ejemplos:');
            $this->line('  php artisan sync:tables styles');
            $this->line('  php artisan sync:tables --all');
            return 1;
        }

        if (!isset($config[$table])) {
            $this->error("No hay configuración de dbsync para [{$table}]");
            $this->line('Tablas disponibles: ' . implode(', ', array_keys($config)));
            return 1;
        }

        $this->runOne($table, $config[$table], $fromId, $limit, $chunk, $dryRun);

        return 0;
    }

    protected function runOne(string $name, string $serviceClass, ?int $fromId, ?int $limit, int $chunk, bool $dryRun): void
    {
        $this->info(str_repeat('=', 60));
        $this->info("Sincronizando [{$name}] ({$serviceClass})");
        if ($dryRun) {
            $this->warn("DRY RUN ACTIVADO para [{$name}]");
        }

        $service = app($serviceClass);

        $service
            ->setFromId($fromId)
            ->setLimit($limit)
            ->setChunkSize($chunk)
            ->setDryRun($dryRun)
            ->run();

        $this->info("Sync [{$name}] finalizado.");
    }
}

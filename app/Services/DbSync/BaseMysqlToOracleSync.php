<?php

namespace App\Services\DbSync;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

abstract class BaseMysqlToOracleSync
{
    protected string $sourceConnection = 'mysql';
    protected string $targetConnection = 'oracle';

    protected int $chunkSize = 1000;
    protected ?int $fromId = null;
    protected ?int $limit = null;
    protected bool $dryRun = false;

    public function setFromId(?int $fromId): self
    {
        $this->fromId = $fromId;
        return $this;
    }

    public function setLimit(?int $limit): self
    {
        $this->limit = $limit;
        return $this;
    }

    public function setChunkSize(int $chunkSize): self
    {
        $this->chunkSize = $chunkSize;
        return $this;
    }

    public function setDryRun(bool $dryRun): self
    {
        $this->dryRun = $dryRun;
        return $this;
    }

    /**
     * Query base
     */
    abstract protected function sourceQuery();

    /**
     * Transformar fila de MariaDB a arreglo para Oracle.
     */
    abstract protected function transformRow($row): array;

    /**
     * Insertar / actualizar batch en Oracle.
     * Por defecto hace upsert por ID y actualiza el resto de columnas.
     */
    protected function upsertBatch(array $rows): void
    {
        if (empty($rows)) {
            return;
        }

        $uniqueBy = $this->upsertUniqueBy();
        $updateColumns = $this->upsertUpdateColumns($rows, $uniqueBy);

        if (empty($updateColumns)) {
            $this->targetDb()->table($this->targetTable)->insert($rows);
            return;
        }

        $this->targetDb()->table($this->targetTable)->upsert($rows, $uniqueBy, $updateColumns);
    }

    /**
     * Columnas únicas para el upsert en Oracle.
     */
    protected function upsertUniqueBy(): array
    {
        return ['ID'];
    }

    /**
     * Determina las columnas a actualizar en el upsert (todas excepto las únicas).
     */
    protected function upsertUpdateColumns(array $rows, array $uniqueBy): array
    {
        $firstRow = $rows[0] ?? [];

        return array_values(array_filter(
            array_keys($firstRow),
            fn ($column) => ! in_array($column, $uniqueBy, true)
        ));
    }

    public function run(): void
    {
        $q = $this->sourceQuery();

        if ($this->fromId) {
            $q->where('id', '>=', $this->fromId);
        }

        $total = $q->count();
        Log::channel('single')->info("DBSync: total rows to sync: {$total}");

        $processed = 0;

        $q->orderBy('id')
            ->chunkById($this->chunkSize, function ($rows) use (&$processed, $total) {

                if ($this->limit && $processed >= $this->limit) {
                    return false;
                }

                $batch = [];
                foreach ($rows as $row) {
                    if ($this->limit && $processed >= $this->limit) {
                        break;
                    }

                    $batch[] = $this->transformRow($row);
                    $processed++;
                }

                if (empty($batch)) {
                    return false;
                }

                if ($this->dryRun) {
                    Log::channel('single')->info("DBSync [DRY-RUN]: would sync batch of " . count($batch) . " rows.");
                    return true;
                }

                try {
                    $this->upsertBatch($batch);
                    Log::channel('single')->info("DBSync: synced batch of " . count($batch) . " rows ({$processed}/{$total}).");
                } catch (\Throwable $e) {
                    Log::channel('single')->error("DBSync: error syncing batch: " . $e->getMessage(), [
                        'exception' => $e,
                    ]);
                }

                return true;
            }, 'id');
    }

    protected function sourceDb()
    {
        return DB::connection($this->sourceConnection);
    }

    protected function targetDb()
    {
        return DB::connection($this->targetConnection);
    }
}

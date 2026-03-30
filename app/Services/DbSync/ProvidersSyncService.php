<?php

namespace App\Services\DbSync;

class ProvidersSyncService extends BaseMysqlToOracleSync
{
    protected string $targetTable = 'PROVIDERS';

    protected function sourceQuery()
    {
        return $this->sourceDb()->table('product_providers');
    }

    protected function transformRow($row): array
    {
        return [
            'ID'           => (int)$row->id,
            'NAME'  => (string)$row->jdaName,
            'NUMBER' => (int)$row->jdaId,
            'CREATED_AT'   => $row->created_at,
            'UPDATED_AT'   => $row->updated_at,
        ];
    }
}

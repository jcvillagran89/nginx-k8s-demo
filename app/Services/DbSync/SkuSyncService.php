<?php

namespace App\Services\DbSync;

class SkuSyncService extends BaseMysqlToOracleSync
{
    protected string $targetTable = 'SKUS';

    protected function sourceQuery()
    {
        return $this->sourceDb()->table('variations');
    }

    protected function transformRow($row): array
    {
        return [
            'ID'           => (int)$row->id,
            'NUMBER'  => (string)$row->sku,
            'NAME' => (int)$row->name,
            'STYLE_ID'   => $row->style_id,
            'CREATED_AT'   => $row->created_at,
            'UPDATED_AT'   => $row->updated_at,
        ];
    }
}

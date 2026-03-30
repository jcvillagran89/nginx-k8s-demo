<?php

namespace App\Services\DbSync;

class DivisionsSyncService extends BaseMysqlToOracleSync
{
    protected string $targetTable = 'DIVISIONS';

    protected function sourceQuery()
    {
        return $this->sourceDb()->table('divisions');
    }

    protected function transformRow($row): array
    {
        return [
            'ID'           => (int)$row->id,
            'NAME'  => (string)$row->jda_name,
            'NUMBER' => (int)$row->id,
            'CREATED_AT'   => $row->created_at,
            'UPDATED_AT'   => $row->updated_at,
        ];
    }
}

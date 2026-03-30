<?php

namespace App\Services\DbSync;

class DepartmentsSyncService extends BaseMysqlToOracleSync
{
    protected string $targetTable = 'DEPARTMENTS';

    protected function sourceQuery()
    {
        return $this->sourceDb()->table('departments');
    }

    protected function transformRow($row): array
    {
        return [
            'ID'           => (int)$row->id,
            'NUMBER' => (int)$row->jda_id,
            'DESCRIPTION'  => (string)$row->name,
            'DIVISION_ID'  => (string)$row->division_id,
            'CREATED_AT'   => $row->created_at,
            'UPDATED_AT'   => $row->updated_at,
        ];
    }
}

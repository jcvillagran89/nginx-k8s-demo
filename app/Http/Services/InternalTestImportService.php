<?php

namespace App\Http\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use ZipArchive;

class InternalTestImportService
{
    private const SHEET_NAME = 'Hoja1';
    private const CHUNK_SIZE = 500;

    private const REQUIRED_HEADERS = [
        'CODIGO',
        'FECHA',
        'ESTILO',
    ];

    private const COLUMN_MAPPING = [
        'PROV' => 'prov',
        'DIVISION' => 'division',
        'MES' => 'mes',
        'SKU' => 'sku',
        '# CODIGO' => 'codigo_num',
        'CODIGO' => 'codigo',
        'FECHA' => 'fecha',
        'HORA' => 'hora',
        'FECHA TERMINO PRUEBAS' => 'fecha_termino_pruebas',
        'FECHA DE ENVIO DE REPORTE' => 'fecha_envio_reporte',
        'ANALISTA' => 'analista',
        'DEPARTAMENTO' => 'departamento',
        'CONFECCIONISTA' => 'confeccionista',
        'ESTILO' => 'style_number',
        'DESCRIPCION' => 'descripcion',
        'IMP ETIQ' => 'imp_etiq',
        'SOLICITANTE' => 'solicitante',
        'COMENTARIOS' => 'comentarios',
        'ESTATUS LAB CCP' => 'estatus_lab_ccp',
        'CLASIFICACION RECHAZO' => 'clasificacion_rechazo',
        'MOTIVO RECH LAB' => 'motivo_rech_lab',
        'MOTIVO RECH LAB2' => 'motivo_rech_lab2',
        'FECHA COMITE' => 'fecha_comite',
        'ESTATUS COMITE' => 'estatus_comite',
        'SEGUIMIENTO COMITE CALIDAD' => 'seguimiento_comite_calidad',
        'LIBERACION COMPRAS' => 'liberacion_compras',
        'FECHA LIB COMPRAS' => 'fecha_lib_compras',
        'STATUS FINAL' => 'status_final',
        '3 C DIMEN' => 'c_dimen_3',
        '2 TORSION' => 'torsion_2',
        '5 APARIENCIA' => 'apariencia_5',
        '1 PESO' => 'peso_1',
        '9 FROTE' => 'frote_9',
        '4 PILLING' => 'pilling_4',
        '6 RASGADO' => 'rasgado_6',
        '7 TRACCION' => 'traccion_7',
        '8 LAVADO ACELERADO' => 'lavado_acelerado_8',
        '10 DENSIDAD' => 'densidad_10',
        '11 MICROSCOPIO' => 'microscopio_11',
        'TIPO DE LAVADO' => 'tipo_de_lavado',
        'TEMPERATURA DE LAVADO' => 'temperatura_de_lavado',
        'TIPO DE SECADO' => 'tipo_de_secado',
        'PLANCHADO' => 'planchado',
        'OC' => 'oc',
        'NO. REPORTE' => 'no_reporte',
        'REINGRESO' => 'reingreso',
        'ESTATUS DE CALIDAD' => 'estatus_de_calidad',
        'ESTATUS DE COMPRAS' => 'estatus_de_compras',
        'MOTIVO DE RECHAZO' => 'motivo_de_rechazo',
        'PROV TELA' => 'prov_tela',
        'COMPOSICION' => 'composicion',
        'RECIBO CEDIS' => 'recibo_cedis',
        'PRIORIDAD' => 'prioridad',
        'FASE' => 'fase',
        'PESO (G/M2)' => 'peso_g_m2',
    ];

    private const INTERNAL_TEST_COLUMNS = [
        'prov',
        'division',
        'mes',
        'sku',
        'codigo_num',
        'codigo',
        'fecha',
        'hora',
        'fecha_termino_pruebas',
        'fecha_envio_reporte',
        'analista',
        'departamento',
        'confeccionista',
        'style_number',
        'descripcion',
        'imp_etiq',
        'solicitante',
        'comentarios',
        'estatus_lab_ccp',
        'clasificacion_rechazo',
        'motivo_rech_lab',
        'motivo_rech_lab2',
        'fecha_comite',
        'estatus_comite',
        'seguimiento_comite_calidad',
        'liberacion_compras',
        'fecha_lib_compras',
        'status_final',
        'c_dimen_3',
        'torsion_2',
        'apariencia_5',
        'peso_1',
        'frote_9',
        'pilling_4',
        'rasgado_6',
        'traccion_7',
        'lavado_acelerado_8',
        'densidad_10',
        'microscopio_11',
        'tipo_de_lavado',
        'temperatura_de_lavado',
        'tipo_de_secado',
        'planchado',
        'oc',
        'no_reporte',
        'reingreso',
        'estatus_de_calidad',
        'estatus_de_compras',
        'motivo_de_rechazo',
        'prov_tela',
        'composicion',
        'recibo_cedis',
        'prioridad',
        'fase',
        'peso_g_m2',
        'created_at',
        'updated_at',
    ];

    private const DATE_COLUMNS = [
        'fecha',
        'fecha_termino_pruebas',
        'fecha_envio_reporte',
        'fecha_comite',
        'fecha_lib_compras',
        'recibo_cedis',
    ];

    public function getLayoutColumns(): array
    {
        return InternalTestLayout::HEADERS;
    }

    public function storeUpload(UploadedFile $file): string
    {
        $filename = 'internal-tests-layout-' . Str::uuid() . '.' . $file->getClientOriginalExtension();
        return $file->storeAs('imports', $filename);
    }

    public function importInternalTestsFromLayout(string $filePath): array
    {
        $rows = $this->readXlsxRows($filePath, self::SHEET_NAME);
        $headerRowNumber = null;
        $headerMap = [];

        foreach ($rows as $rowNumber => $row) {
            $candidateMap = $this->buildHeaderMap($row);
            if (! $candidateMap) {
                continue;
            }

            if ($this->hasRequiredHeaders($candidateMap, $this->getRequiredHeaders())) {
                $headerRowNumber = (int) $rowNumber;
                $headerMap = $candidateMap;
                break;
            }
        }

        if (! $headerRowNumber) {
            throw new \RuntimeException('No se encontró la fila de encabezados en el archivo.');
        }

        $columnMap = $this->getColumnHeaderMap();
        $testsCreated = 0;
        $skipped = 0;
        $buffer = [];

        foreach ($rows as $rowNumber => $row) {
            if ($rowNumber <= $headerRowNumber) {
                continue;
            }

            $testData = [];
            foreach ($columnMap as $headerKey => $column) {
                $cellColumn = $headerMap[$headerKey] ?? null;
                $value = $this->getValue($row, $cellColumn);
                if (in_array($column, self::DATE_COLUMNS, true)) {
                    $value = $this->parseDateValue($value);
                } elseif ($column === 'hora') {
                    $value = $this->parseTimeValue($value);
                }
                $testData[$column] = $value;
            }

            $hasData = false;
            foreach ($testData as $value) {
                if ($value !== null && $value !== '') {
                    $hasData = true;
                    break;
                }
            }

            if (! $hasData) {
                $skipped++;
                continue;
            }

            $buffer[] = $testData;

            if (count($buffer) >= self::CHUNK_SIZE) {
                $this->flushInsertBatch($buffer, $testsCreated);
                $buffer = [];
            }
        }

        if ($buffer) {
            $this->flushInsertBatch($buffer, $testsCreated);
        }

        return [
            'tests_created' => $testsCreated,
            'skipped' => $skipped,
        ];
    }

    private function getRequiredHeaders(): array
    {
        return array_map([$this, 'normalizeHeader'], self::REQUIRED_HEADERS);
    }

    private function getColumnHeaderMap(): array
    {
        $map = [];
        foreach (self::COLUMN_MAPPING as $header => $column) {
            $map[$this->normalizeHeader($header)] = $column;
        }
        return $map;
    }

    private function buildHeaderMap(array $headerRow): array
    {
        $map = [];
        foreach ($headerRow as $column => $value) {
            $normalized = $this->normalizeHeader((string) $value);
            if ($normalized !== '') {
                $map[$normalized] = $column;
            }
        }

        return $map;
    }

    private function hasRequiredHeaders(array $headerMap, array $requiredHeaders): bool
    {
        foreach ($requiredHeaders as $header) {
            if (! array_key_exists($header, $headerMap)) {
                return false;
            }
        }

        return true;
    }

    private function normalizeHeader(string $header): string
    {
        $header = trim($header);
        $header = Str::ascii($header);
        $header = mb_strtoupper($header, 'UTF-8');
        $header = preg_replace('/\s+/', ' ', $header);

        return $header ?? '';
    }

    private function getValue(array $row, ?string $column): ?string
    {
        if (! $column || ! array_key_exists($column, $row)) {
            return null;
        }

        $value = trim((string) $row[$column]);
        $value = str_replace('_x000D_', "\n", $value);
        $value = preg_replace('/\s+/', ' ', $value);

        return $value !== '' ? $value : null;
    }

    private function parseDateValue(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        if (is_numeric($value)) {
            try {
                $serial = (float) $value;
                if ($serial < 1) {
                    return null;
                }
                $days = (int) floor($serial);
                return Carbon::create(1899, 12, 30)->addDays($days)->format('Y-m-d');
            } catch (\Throwable $e) {
                return null;
            }
        }

        try {
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Throwable $e) {
            return null;
        }
    }

    private function parseTimeValue(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        if (is_numeric($value)) {
            $serial = (float) $value;
            $fraction = $serial - floor($serial);
            if ($fraction < 0) {
                $fraction = 0;
            }
            $seconds = (int) round($fraction * 86400);
            $hours = (int) floor($seconds / 3600);
            $minutes = (int) floor(($seconds % 3600) / 60);

            if ($hours === 0 && $minutes === 0 && $fraction === 0.0) {
                return null;
            }

            return sprintf('%02d:%02d', $hours % 24, $minutes);
        }

        try {
            return Carbon::parse($value)->format('H:i');
        } catch (\Throwable $e) {
            return $value;
        }
    }

    private function flushInsertBatch(array $buffer, int &$testsCreated): void
    {
        if (! $buffer) {
            return;
        }

        $now = now();
        $rows = [];

        foreach ($buffer as $data) {
            $row = array_merge($data, [
                'created_at' => $now,
                'updated_at' => $now,
            ]);

            foreach (self::INTERNAL_TEST_COLUMNS as $column) {
                if (! array_key_exists($column, $row)) {
                    $row[$column] = null;
                }
            }

            $rows[] = array_intersect_key($row, array_flip(self::INTERNAL_TEST_COLUMNS));
        }

        foreach (array_chunk($rows, self::CHUNK_SIZE) as $chunk) {
            DB::table('internal_tests')->insert($chunk);
            $testsCreated += count($chunk);
        }
    }

    private function readXlsxRows(string $filePath, string $sheetName): array
    {
        $zip = new ZipArchive();
        if ($zip->open($filePath) !== true) {
            throw new \RuntimeException('No se pudo abrir el archivo Excel.');
        }

        $sharedStrings = $this->readSharedStrings($zip);
        $sheetPath = $this->resolveSheetPath($zip, $sheetName);
        $sheetXml = $zip->getFromName($sheetPath);
        if ($sheetXml === false) {
            $zip->close();
            throw new \RuntimeException('No se encontró la hoja principal en el archivo Excel.');
        }

        $rows = [];
        $sheet = simplexml_load_string($sheetXml);
        if (! $sheet) {
            $zip->close();
            return $rows;
        }

        $namespaces = $sheet->getNamespaces(true);
        $ns = $namespaces[''] ?? null;
        $sheetRoot = $ns ? $sheet->children($ns) : $sheet;

        if (! isset($sheetRoot->sheetData->row)) {
            $zip->close();
            return $rows;
        }

        foreach ($sheetRoot->sheetData->row as $row) {
            $rowAttributes = $row->attributes();
            $rowIndex = (int) ($rowAttributes['r'] ?? 0);
            $rows[$rowIndex] = [];

            $rowCells = $ns ? $row->children($ns) : $row;
            foreach ($rowCells->c as $cell) {
                $cellAttributes = $cell->attributes();
                $cellRef = (string) ($cellAttributes['r'] ?? '');
                if (! preg_match('/^([A-Z]+)\d+$/', $cellRef, $matches)) {
                    continue;
                }
                $column = $matches[1];
                $cellType = (string) ($cellAttributes['t'] ?? '');
                $value = '';

                if ($cellType === 's') {
                    $cellNode = $ns ? $cell->children($ns) : $cell;
                    $index = (int) $cellNode->v;
                    $value = $sharedStrings[$index] ?? '';
                } elseif ($cellType === 'inlineStr') {
                    $value = $this->readInlineString($cell);
                } else {
                    $cellNode = $ns ? $cell->children($ns) : $cell;
                    $value = (string) $cellNode->v;
                }

                $rows[$rowIndex][$column] = $value;
            }
        }

        $zip->close();

        return $rows;
    }

    private function resolveSheetPath(ZipArchive $zip, string $sheetName): string
    {
        $defaultPath = 'xl/worksheets/sheet1.xml';
        $workbookXml = $zip->getFromName('xl/workbook.xml');
        if ($workbookXml === false) {
            return $defaultPath;
        }

        $workbook = simplexml_load_string($workbookXml);
        if (! $workbook) {
            return $defaultPath;
        }

        $namespaces = $workbook->getNamespaces(true);
        $ns = $namespaces[''] ?? null;
        $workbookRoot = $ns ? $workbook->children($ns) : $workbook;
        if (! isset($workbookRoot->sheets->sheet)) {
            return $defaultPath;
        }

        $sheetRelId = null;
        $rNs = $namespaces['r'] ?? null;
        foreach ($workbookRoot->sheets->sheet as $sheet) {
            $attrs = $sheet->attributes();
            $name = (string) ($attrs['name'] ?? '');
            if (mb_strtoupper($name, 'UTF-8') !== mb_strtoupper($sheetName, 'UTF-8')) {
                continue;
            }
            if ($rNs) {
                $relAttrs = $sheet->attributes($rNs);
                $sheetRelId = (string) ($relAttrs['id'] ?? '');
            }
            break;
        }

        if (! $sheetRelId) {
            return $defaultPath;
        }

        $relsXml = $zip->getFromName('xl/_rels/workbook.xml.rels');
        if ($relsXml === false) {
            return $defaultPath;
        }

        $rels = simplexml_load_string($relsXml);
        if (! $rels) {
            return $defaultPath;
        }

        foreach ($rels->Relationship as $rel) {
            $attrs = $rel->attributes();
            if ((string) ($attrs['Id'] ?? '') !== $sheetRelId) {
                continue;
            }
            $target = (string) ($attrs['Target'] ?? '');
            if ($target === '') {
                return $defaultPath;
            }

            $target = ltrim($target, '/');
            return 'xl/' . $target;
        }

        return $defaultPath;
    }

    private function readSharedStrings(ZipArchive $zip): array
    {
        $sharedXml = $zip->getFromName('xl/sharedStrings.xml');
        if ($sharedXml === false) {
            return [];
        }

        $sharedStrings = [];
        $xml = simplexml_load_string($sharedXml);
        if (! $xml) {
            return $sharedStrings;
        }

        $namespaces = $xml->getNamespaces(true);
        $ns = $namespaces[''] ?? null;
        $items = $ns ? $xml->children($ns)->si : ($xml->si ?? []);

        foreach ($items as $si) {
            $textParts = [];
            if ($ns) {
                $siNode = $si->children($ns);
                if (isset($siNode->t)) {
                    foreach ($siNode->t as $run) {
                        $textParts[] = (string) $run;
                    }
                }
                if (isset($siNode->r)) {
                    foreach ($siNode->r as $run) {
                        $runNode = $run->children($ns);
                        if (isset($runNode->t)) {
                            $textParts[] = (string) $runNode->t;
                        }
                    }
                }
            } else {
                foreach ($si->t as $run) {
                    $textParts[] = (string) $run;
                }
            }

            $sharedStrings[] = implode('', $textParts);
        }

        return $sharedStrings;
    }

    private function readInlineString(\SimpleXMLElement $cell): string
    {
        if (! isset($cell->is)) {
            return '';
        }

        $textParts = [];
        if (isset($cell->is->t)) {
            foreach ($cell->is->t as $run) {
                $textParts[] = (string) $run;
            }
        } elseif (isset($cell->is->r)) {
            foreach ($cell->is->r as $run) {
                if (isset($run->t)) {
                    $textParts[] = (string) $run->t;
                }
            }
        }

        return implode('', $textParts);
    }
}

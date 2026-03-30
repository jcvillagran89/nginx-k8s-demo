<?php

namespace App\Http\Services;

use App\Models\Style;
use ZipArchive;

class SharePointStyleImportService
{
    private const HEADER_STYLE = [
        'ESTILO',
        'ESTILO GARCIA',
    ];

    private const HEADER_ORDER_ID = [
        'OC',
    ];

    private const HEADER_MAP = [
        'PROV TELA' => 'cloth_provider',
        'PROVEEDOR TELA' => 'cloth_provider',
        'NOMBRE TELA' => 'cloth_name',
        'NOMBRE GENERICO' => 'generic_name',
        'NOMBRE COMERCIAL' => 'comercial_name',
        'ESTILO CHINA' => 'china_style',
        'CHINA STYLE' => 'china_style',
        'LAB' => 'laboratory',
        'LABORATORIO' => 'laboratory',
        'FECHA ENTREGA LABORATORIO' => 'laboratory_delivery_date',
        'FECHA ENTREGA LAB' => 'laboratory_delivery_date',
        'FECHA ENTREGA A LABORATORIO' => 'laboratory_delivery_date',
    ];

    public function __construct(private MicrosoftGraphService $graph)
    {
    }

    public function importFromShareLink(string $shareLink): array
    {
        $filePath = $this->graph->downloadShareFile($shareLink);

        return $this->importFromFile($filePath);
    }

    public function importFromFile(string $filePath): array
    {
        $sheets = $this->readAllSheets($filePath);
        $stats = [
            'sheets_total' => count($sheets),
            'sheets_processed' => 0,
            'rows_read' => 0,
            'rows_updated' => 0,
            'rows_skipped' => 0,
            'styles_missing' => 0,
            'styles_missing_numbers' => [],
        ];

        foreach ($sheets as $sheetName => $rows) {
            $headerData = $this->findHeader($rows);
            if (! $headerData || ! $headerData['order_id']) {
                $stats['rows_skipped'] += count($rows);
                continue;
            }

            $stats['sheets_processed']++;
            $headerRow = $headerData['row'];
            $stats['rows_read'] += max(count($rows) - $headerRow, 0);

            foreach ($rows as $rowIndex => $row) {
                if ($rowIndex <= $headerRow) {
                    continue;
                }

                $styleCell = $this->normalizeCell($row[$headerData['style']] ?? null);
                $orderIdRaw = $this->normalizeCell($row[$headerData['order_id']] ?? null);

                if (! $styleCell) {
                    $stats['rows_skipped']++;
                    continue;
                }

                $styleNumbers = $this->extractStyleNumbers($styleCell);
                if (! $styleNumbers) {
                    $stats['rows_skipped']++;
                    continue;
                }

                $updateData = [];

                $orderId = $orderIdRaw && ctype_digit($orderIdRaw) ? (int) $orderIdRaw : null;
                if ($orderId) {
                    $updateData['order_id'] = $orderId;
                }

                foreach ($headerData['mapped'] as $field => $column) {
                    $value = $this->normalizeCell($row[$column] ?? null);
                    if ($value !== null && $value !== '') {
                        $updateData[$field] = $value;
                    }
                }

                if (! $updateData) {
                    $stats['rows_skipped']++;
                    continue;
                }

                foreach ($styleNumbers as $styleNumber) {
                    $updated = Style::where('number', $styleNumber)->update($updateData);
                    if ($updated) {
                        $stats['rows_updated']++;
                    } else {
                        $stats['styles_missing']++;
                        $stats['styles_missing_numbers'][] = $styleNumber;
                    }
                }
            }
        }

        if (! empty($stats['styles_missing_numbers'])) {
            $stats['styles_missing_numbers'] = array_values(array_unique($stats['styles_missing_numbers']));
        }

        return $stats;
    }

    private function findHeader(array $rows): ?array
    {
        foreach ($rows as $rowIndex => $row) {
            $map = [];
            foreach ($row as $column => $value) {
                $normalized = $this->normalizeHeader($value);
                if ($normalized !== '') {
                    $map[$normalized] = $column;
                }
            }

            if (! $map) {
                continue;
            }

            $styleColumn = null;
            foreach (self::HEADER_STYLE as $header) {
                if (isset($map[$header])) {
                    $styleColumn = $map[$header];
                    break;
                }
            }

            $orderColumn = null;
            foreach (self::HEADER_ORDER_ID as $header) {
                if (isset($map[$header])) {
                    $orderColumn = $map[$header];
                    break;
                }
            }

            if ($styleColumn && $orderColumn) {
                return [
                    'row' => (int) $rowIndex,
                    'style' => $styleColumn,
                    'order_id' => $orderColumn,
                    'mapped' => $this->mapOptionalColumns($map),
                ];
            }
        }

        return null;
    }

    private function mapOptionalColumns(array $headerMap): array
    {
        $mapped = [];
        foreach (self::HEADER_MAP as $header => $field) {
            if (isset($headerMap[$header])) {
                $mapped[$field] = $headerMap[$header];
            }
        }

        return $mapped;
    }

    private function normalizeHeader($value): string
    {
        $value = $this->normalizeCell($value);
        if ($value === null) {
            return '';
        }

        $value = preg_replace('/\s+/', ' ', $value);
        $value = trim($value);

        $ascii = iconv('UTF-8', 'ASCII//TRANSLIT', $value);
        if ($ascii !== false) {
            $value = $ascii;
        }

        return strtoupper($value);
    }

    private function normalizeCell($value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim((string) $value);
        if ($value === '') {
            return null;
        }

        return $value;
    }

    private function extractStyleNumbers(string $value): array
    {
        $matches = [];
        preg_match_all('/\d+/', $value, $matches);

        if (! empty($matches[0])) {
            return array_values(array_unique($matches[0]));
        }

        $fallback = trim($value);
        if ($fallback === '') {
            return [];
        }

        return [$fallback];
    }

    private function readAllSheets(string $filePath): array
    {
        $zip = new ZipArchive();
        if ($zip->open($filePath) !== true) {
            throw new \RuntimeException('No se pudo abrir el archivo Excel.');
        }

        $sharedStrings = $this->readSharedStrings($zip);
        $sheetDefinitions = $this->resolveSheetDefinitions($zip);
        $sheets = [];

        foreach ($sheetDefinitions as $definition) {
            $sheetXml = $zip->getFromName($definition['path']);
            if ($sheetXml === false) {
                continue;
            }

            $sheets[$definition['name']] = $this->readSheetRows($sheetXml, $sharedStrings);
        }

        $zip->close();

        return $sheets;
    }

    private function resolveSheetDefinitions(ZipArchive $zip): array
    {
        $workbookXml = $zip->getFromName('xl/workbook.xml');
        if ($workbookXml === false) {
            return [
                ['name' => 'Sheet1', 'path' => 'xl/worksheets/sheet1.xml'],
            ];
        }

        $workbook = simplexml_load_string($workbookXml);
        if (! $workbook) {
            return [
                ['name' => 'Sheet1', 'path' => 'xl/worksheets/sheet1.xml'],
            ];
        }

        $relationships = $this->readWorkbookRelationships($zip);

        $namespaces = $workbook->getNamespaces(true);
        $ns = $namespaces[''] ?? null;
        $rNs = $namespaces['r'] ?? null;
        $root = $ns ? $workbook->children($ns) : $workbook;
        if (! isset($root->sheets->sheet)) {
            return [
                ['name' => 'Sheet1', 'path' => 'xl/worksheets/sheet1.xml'],
            ];
        }

        $definitions = [];
        foreach ($root->sheets->sheet as $index => $sheet) {
            $attrs = $sheet->attributes();
            $sheetName = (string) ($attrs['name'] ?? ('Sheet' . ($index + 1)));
            $relId = null;
            if ($rNs) {
                $relAttrs = $sheet->attributes($rNs);
                $relId = (string) ($relAttrs['id'] ?? '');
            }

            $target = $relId && isset($relationships[$relId])
                ? 'xl/' . ltrim($relationships[$relId], '/')
                : 'xl/worksheets/sheet' . ($index + 1) . '.xml';

            $definitions[] = [
                'name' => $sheetName,
                'path' => $target,
            ];
        }

        return $definitions;
    }

    private function readWorkbookRelationships(ZipArchive $zip): array
    {
        $relsXml = $zip->getFromName('xl/_rels/workbook.xml.rels');
        if ($relsXml === false) {
            return [];
        }

        $rels = simplexml_load_string($relsXml);
        if (! $rels) {
            return [];
        }

        $relationships = [];
        foreach ($rels->Relationship as $relation) {
            $attrs = $relation->attributes();
            $id = (string) ($attrs['Id'] ?? '');
            $target = (string) ($attrs['Target'] ?? '');
            if ($id && $target) {
                $relationships[$id] = $target;
            }
        }

        return $relationships;
    }

    private function readSheetRows(string $sheetXml, array $sharedStrings): array
    {
        $rows = [];
        $sheet = simplexml_load_string($sheetXml);
        if (! $sheet) {
            return $rows;
        }

        $namespaces = $sheet->getNamespaces(true);
        $ns = $namespaces[''] ?? null;
        $sheetRoot = $ns ? $sheet->children($ns) : $sheet;

        if (! isset($sheetRoot->sheetData->row)) {
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
                if (! preg_match('/^([A-Z]+)\\d+$/', $cellRef, $matches)) {
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

        return $rows;
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

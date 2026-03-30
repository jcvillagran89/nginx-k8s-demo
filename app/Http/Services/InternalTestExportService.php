<?php

namespace App\Http\Services;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use ZipArchive;

class InternalTestExportService
{
    private const EXPORT_COLUMNS = [
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
    ];

    public function exportInternalTests(array $filters = []): string
    {
        $exportDir = storage_path('app/exports');
        if (! is_dir($exportDir)) {
            mkdir($exportDir, 0755, true);
        }

        $sheetPath = $exportDir . '/internal_tests_sheet_' . Str::uuid() . '.xml';
        $xlsxPath = $exportDir . '/internal_tests_' . Str::uuid() . '.xlsx';
        $columnWidths = $this->calculateColumnWidths($filters);

        $sheetHandle = fopen($sheetPath, 'wb');
        if (! $sheetHandle) {
            throw new \RuntimeException('No se pudo crear el archivo temporal del Excel.');
        }

        fwrite($sheetHandle, $this->buildWorksheetOpenXml($columnWidths));

        $rowIndex = 1;
        $this->writeSheetRow($sheetHandle, $rowIndex, InternalTestLayout::HEADERS, 1);

        $rows = $this->buildInternalTestsExportQuery($filters)->cursor();
        foreach ($rows as $row) {
            $rowIndex++;
            $this->writeSheetRow($sheetHandle, $rowIndex, $this->mapInternalTestRow($row), 2);
        }

        fwrite($sheetHandle, '</sheetData></worksheet>');
        fclose($sheetHandle);

        $zip = new ZipArchive();
        if ($zip->open($xlsxPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) !== true) {
            @unlink($sheetPath);
            throw new \RuntimeException('No se pudo crear el archivo Excel.');
        }

        $zip->addFromString('[Content_Types].xml', $this->buildContentTypesXml());
        $zip->addFromString('_rels/.rels', $this->buildRelsXml());
        $zip->addFromString('xl/workbook.xml', $this->buildWorkbookXml());
        $zip->addFromString('xl/_rels/workbook.xml.rels', $this->buildWorkbookRelsXml());
        $zip->addFromString('xl/styles.xml', $this->buildStylesXml());
        $zip->addFile($sheetPath, 'xl/worksheets/sheet1.xml');
        $zip->close();

        @unlink($sheetPath);

        return $xlsxPath;
    }

    private function buildInternalTestsExportQuery(array $filters = [])
    {
        $query = DB::table('internal_tests')->select(self::EXPORT_COLUMNS);

        $this->applyFilters($query, $filters);

        return $query
            ->orderByDesc('fecha')
            ->orderByDesc('id');
    }

    private function mapInternalTestRow(object $row): array
    {
        $values = [];
        foreach (self::EXPORT_COLUMNS as $column) {
            $values[] = $row->{$column} ?? null;
        }

        return $values;
    }

    private function applyFilters($query, array $filters): void
    {
        $dateRange = $filters['date_range'] ?? null;
        $styleNumber = $filters['style_number'] ?? null;
        $department = $filters['department'] ?? null;
        $statusFinal = $filters['status_final'] ?? null;
        $codigo = $filters['codigo'] ?? null;

        if ($styleNumber !== null && $styleNumber !== '') {
            $value = mb_strtolower($styleNumber);
            $query->whereRaw('LOWER(style_number) LIKE ?', ["%{$value}%"]);
        }

        if ($department !== null && $department !== '') {
            $value = mb_strtolower($department);
            $query->whereRaw('LOWER(departamento) LIKE ?', ["%{$value}%"]);
        }

        if ($statusFinal !== null && $statusFinal !== '') {
            $value = mb_strtolower($statusFinal);
            $query->whereRaw('LOWER(status_final) LIKE ?', ["%{$value}%"]);
        }

        if ($codigo !== null && $codigo !== '') {
            $query->where(function ($q) use ($codigo) {
                $q->where('codigo', 'like', "%{$codigo}%")
                    ->orWhere('codigo_num', 'like', "%{$codigo}%");
            });
        }

        if ($dateRange !== null && $dateRange !== '') {
            $parts = explode(' a ', $dateRange);

            try {
                if (count($parts) === 2) {
                    $from = Carbon::createFromFormat('d/m/Y', trim($parts[0]))->startOfDay();
                    $to = Carbon::createFromFormat('d/m/Y', trim($parts[1]))->endOfDay();
                    $query->whereBetween('fecha', [$from, $to]);
                } else {
                    $single = Carbon::createFromFormat('d/m/Y', trim($dateRange))->startOfDay();
                    $query->whereDate('fecha', $single);
                }
            } catch (\Throwable $e) {
            }
        }
    }

    private function writeSheetRow($handle, int $rowIndex, array $values, int $styleIndex): void
    {
        $rowXml = '<row r="' . $rowIndex . '">';

        foreach ($values as $index => $value) {
            $cellValue = $this->normalizeCellValue($value);
            $preserveSpace = (bool) preg_match('/^\s|\s$/', $cellValue);
            $safeValue = htmlspecialchars($cellValue, ENT_XML1 | ENT_COMPAT, 'UTF-8');
            $column = $this->columnIndexToLetters($index + 1);
            $cellRef = $column . $rowIndex;

            $rowXml .= '<c r="' . $cellRef . '" s="' . $styleIndex . '" t="inlineStr"><is><t';
            if ($preserveSpace) {
                $rowXml .= ' xml:space="preserve"';
            }
            $rowXml .= '>' . $safeValue . '</t></is></c>';
        }

        $rowXml .= '</row>';
        fwrite($handle, $rowXml);
    }

    private function normalizeCellValue($value): string
    {
        if ($value === null) {
            return '';
        }

        if (is_bool($value)) {
            return $value ? '1' : '0';
        }

        return (string) $value;
    }

    private function columnIndexToLetters(int $index): string
    {
        $letters = '';

        while ($index > 0) {
            $index--;
            $letters = chr(65 + ($index % 26)) . $letters;
            $index = intdiv($index, 26);
        }

        return $letters;
    }

    private function calculateColumnWidths(array $filters = []): array
    {
        $columnCount = count(InternalTestLayout::HEADERS);
        $maxLengths = [];
        for ($i = 0; $i < $columnCount; $i++) {
            $maxLengths[$i] = mb_strlen((string) InternalTestLayout::HEADERS[$i], 'UTF-8');
        }

        $rows = $this->buildInternalTestsExportQuery($filters)->cursor();
        foreach ($rows as $row) {
            $values = $this->mapInternalTestRow($row);
            foreach ($values as $index => $value) {
                $length = mb_strlen($this->normalizeCellValue($value), 'UTF-8');
                if ($length > $maxLengths[$index]) {
                    $maxLengths[$index] = $length;
                }
            }
        }

        $widths = [];
        foreach ($maxLengths as $index => $length) {
            $width = max(10, min($length + 2, 40));
            $widths[$index] = $width;
        }

        return $widths;
    }

    private function buildWorksheetOpenXml(array $columnWidths): string
    {
        $colsXml = '<cols>';
        foreach ($columnWidths as $index => $width) {
            $colIndex = $index + 1;
            $colsXml .= '<col min="' . $colIndex . '" max="' . $colIndex . '" width="' . $width . '" customWidth="1"/>';
        }
        $colsXml .= '</cols>';

        return '<?xml version="1.0" encoding="UTF-8"?>' .
            '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' .
            '<sheetViews><sheetView tabSelected="1" workbookViewId="0">' .
            '<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>' .
            '</sheetView></sheetViews>' .
            $colsXml .
            '<sheetData>';
    }

    private function buildContentTypesXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8"?>' .
            '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' .
            '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' .
            '<Default Extension="xml" ContentType="application/xml"/>' .
            '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' .
            '<Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' .
            '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' .
            '</Types>';
    }

    private function buildRelsXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8"?>' .
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' .
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>' .
            '</Relationships>';
    }

    private function buildWorkbookXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8"?>' .
            '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' .
            'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' .
            '<sheets><sheet name="Historico interno" sheetId="1" r:id="rId1"/></sheets></workbook>';
    }

    private function buildWorkbookRelsXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8"?>' .
            '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' .
            '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>' .
            '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>' .
            '</Relationships>';
    }

    private function buildStylesXml(): string
    {
        return '<?xml version="1.0" encoding="UTF-8"?>' .
            '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' .
            '<fonts count="2">' .
            '<font><sz val="11"/><color theme="1"/><name val="Calibri"/></font>' .
            '<font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font>' .
            '</fonts>' .
            '<fills count="3">' .
            '<fill><patternFill patternType="none"/></fill>' .
            '<fill><patternFill patternType="gray125"/></fill>' .
            '<fill><patternFill patternType="solid"><fgColor rgb="FF00B050"/><bgColor rgb="FF00B050"/></patternFill></fill>' .
            '</fills>' .
            '<borders count="2">' .
            '<border><left/><right/><top/><bottom/><diagonal/></border>' .
            '<border><left style="thin"><color rgb="FFB0B0B0"/></left>' .
            '<right style="thin"><color rgb="FFB0B0B0"/></right>' .
            '<top style="thin"><color rgb="FFB0B0B0"/></top>' .
            '<bottom style="thin"><color rgb="FFB0B0B0"/></bottom><diagonal/></border>' .
            '</borders>' .
            '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>' .
            '<cellXfs count="3">' .
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' .
            '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1"/>' .
            '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1"/>' .
            '</cellXfs>' .
            '</styleSheet>';
    }
}

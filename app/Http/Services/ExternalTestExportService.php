<?php

namespace App\Http\Services;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use ZipArchive;

class ExternalTestExportService
{
    public function exportExternalTestsLayoutA(array $filters = []): string
    {
        $exportDir = storage_path('app/exports');
        if (! is_dir($exportDir)) {
            mkdir($exportDir, 0755, true);
        }

        $sheetPath = $exportDir . '/external_tests_sheet_' . Str::uuid() . '.xml';
        $xlsxPath = $exportDir . '/external_tests_' . Str::uuid() . '.xlsx';
        $columnWidths = $this->calculateLayoutAColumnWidths($filters);

        $sheetHandle = fopen($sheetPath, 'wb');
        if (! $sheetHandle) {
            throw new \RuntimeException('No se pudo crear el archivo temporal del Excel.');
        }

        fwrite($sheetHandle, $this->buildWorksheetOpenXml($columnWidths));

        $rowIndex = 1;
        $this->writeSheetRow($sheetHandle, $rowIndex, ExternalTestLayout::LAYOUT_A_HEADERS, 1);

        $rows = $this->buildExternalTestsExportQuery($filters)->cursor();

        foreach ($rows as $row) {
            $rowIndex++;
            $this->writeSheetRow($sheetHandle, $rowIndex, $this->mapExternalTestToLayoutA($row), 2);
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

    private function buildExternalTestsExportQuery(array $filters = [])
    {
        $query = DB::table('external_tests as et')
            ->leftJoin('styles as s', 's.id', '=', 'et.style_id')
            ->leftJoin('providers as p', 'p.id', '=', 's.provider_id')
            ->leftJoin('divisions as v', 'v.id', '=', 's.division_id')
            ->leftJoin('departments as d', 'd.id', '=', 's.department_id')
            ->select([
                'et.reported_at',
                'et.lab',
                'et.rejected_1',
                'et.rejected_2',
                'et.rejected_3',
                'et.rejected_4',
                'et.rejected_5',
                'et.rejected_6',
                'et.weigth',
                'et.composition',
                'et.status',
                'et.status_purchases',
                'et.released_at',
                'et.reprocesses',
                'et.action_taken',
                'et.cloth_provider',
                'et.generic_name',
                'et.comercial_name',
                'et.provider',
                'et.division',
                'et.department',
                'et.style_number',
                's.number as style_number_fallback',
                's.order_id',
                'p.number as provider_number',
                'p.name as provider_name',
                'v.number as division_number',
                'v.description as division_description',
                'd.number as department_number',
                'd.description as department_description',
            ]);

        $this->applyFilters($query, $filters);

        return $query
            ->orderBy('et.reported_at')
            ->orderBy('et.id');
    }

    private function mapExternalTestToLayoutA(object $row): array
    {
        [$year, $month, $day] = $this->formatDateParts($row->reported_at ?? null);

        $provider = $row->provider ?? $row->provider_number ?? $row->provider_name ?? null;
        $division = $row->division ?? $row->division_number ?? $row->division_description ?? null;
        $department = $row->department ?? $row->department_number ?? $row->department_description ?? null;
        $status = $row->status ?? null;
        $statusPurchases = $row->status_purchases ?? null;
        $styleNumber = $row->style_number ?? $row->style_number_fallback ?? null;

        return [
            $year,
            $month,
            $day,
            $provider,
            $division,
            $department,
            $row->lab ?? null,
            $row->rejected_1 ?? null,
            $row->rejected_2 ?? null,
            $row->rejected_3 ?? null,
            $row->rejected_4 ?? null,
            $row->rejected_5 ?? null,
            $row->rejected_6 ?? null,
            $row->weigth ?? null,
            $row->composition ?? null,
            $status,
            $statusPurchases,
            $row->released_at ?? null,
            $row->reprocesses ?? null,
            $row->action_taken ?? null,
            $row->cloth_provider ?? null,
            $row->generic_name ?? null,
            $row->comercial_name ?? null,
            $row->order_id ?? null,
            $styleNumber,
        ];
    }

    private function formatDateParts(?string $date): array
    {
        if (! $date) {
            return ['', '', ''];
        }

        try {
            $parsed = Carbon::parse($date);
        } catch (\Throwable $e) {
            return ['', '', ''];
        }

        $monthNames = [
            1 => 'ENERO',
            2 => 'FEBRERO',
            3 => 'MARZO',
            4 => 'ABRIL',
            5 => 'MAYO',
            6 => 'JUNIO',
            7 => 'JULIO',
            8 => 'AGOSTO',
            9 => 'SEPTIEMBRE',
            10 => 'OCTUBRE',
            11 => 'NOVIEMBRE',
            12 => 'DICIEMBRE',
        ];

        return [
            (string) $parsed->year,
            $monthNames[$parsed->month] ?? (string) $parsed->month,
            (string) $parsed->day,
        ];
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

    private function calculateLayoutAColumnWidths(array $filters = []): array
    {
        $columnCount = count(ExternalTestLayout::LAYOUT_A_HEADERS);
        $maxLengths = [];
        for ($i = 0; $i < $columnCount; $i++) {
            $maxLengths[$i] = mb_strlen((string) ExternalTestLayout::LAYOUT_A_HEADERS[$i], 'UTF-8');
        }

        $rows = $this->buildExternalTestsExportQuery($filters)->cursor();
        foreach ($rows as $row) {
            $values = $this->mapExternalTestToLayoutA($row);
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

        $compositionIndex = array_search('COMPOSICION', ExternalTestLayout::LAYOUT_A_HEADERS, true);
        if ($compositionIndex !== false) {
            $widths[$compositionIndex] = 60;
        }

        return $widths;
    }

    private function applyFilters($query, array $filters): void
    {
        $lab = $filters['lab'] ?? null;
        $dateRange = $filters['date_range'] ?? null;
        $status = $filters['status'] ?? null;
        $clothProvider = $filters['cloth_provider'] ?? null;
        $styleNumber = $filters['style_number'] ?? null;
        $miscellaneous = $filters['miscellaneous'] ?? null;

        if ($lab !== null && $lab !== '') {
            $labValue = mb_strtolower($lab);
            $query->whereRaw('LOWER(et.lab) LIKE ?', ["%{$labValue}%"]);
        }

        if ($dateRange !== null && $dateRange !== '') {
            $parts = explode(' a ', $dateRange);

            try {
                if (count($parts) === 2) {
                    $from = Carbon::createFromFormat('d/m/Y', trim($parts[0]))->startOfDay();
                    $to = Carbon::createFromFormat('d/m/Y', trim($parts[1]))->endOfDay();
                    $query->whereBetween('et.reported_at', [$from, $to]);
                } else {
                    $single = Carbon::createFromFormat('d/m/Y', trim($dateRange))->startOfDay();
                    $query->whereDate('et.reported_at', $single);
                }
            } catch (\Throwable $e) {
            }
        }

        if ($status !== null && $status !== '') {
            $statusValue = mb_strtolower($status);
            $query->whereRaw('LOWER(et.status) LIKE ?', ["%{$statusValue}%"]);
        }

        if ($clothProvider !== null && $clothProvider !== '') {
            $clothValue = mb_strtolower($clothProvider);
            $query->where(function ($q) use ($clothValue) {
                $q->whereRaw('LOWER(et.cloth_provider) LIKE ?', ["%{$clothValue}%"])
                    ->orWhereRaw('LOWER(et.provider) LIKE ?', ["%{$clothValue}%"]);
            });
        }

        if ($styleNumber !== null && $styleNumber !== '') {
            $query->where('et.style_number', 'like', "%{$styleNumber}%");
        }

        if ($miscellaneous !== null && $miscellaneous !== '') {
            $miscValue = mb_strtolower($miscellaneous);
            $query->where(function ($q) use ($miscValue) {
                $q->whereRaw('LOWER(et.action_taken) LIKE ?', ["%{$miscValue}%"])
                    ->orWhereRaw('LOWER(et.rejected_1) LIKE ?', ["%{$miscValue}%"])
                    ->orWhereRaw('LOWER(et.rejected_2) LIKE ?', ["%{$miscValue}%"])
                    ->orWhereRaw('LOWER(et.rejected_3) LIKE ?', ["%{$miscValue}%"])
                    ->orWhereRaw('LOWER(et.rejected_4) LIKE ?', ["%{$miscValue}%"])
                    ->orWhereRaw('LOWER(et.rejected_5) LIKE ?', ["%{$miscValue}%"])
                    ->orWhereRaw('LOWER(et.rejected_6) LIKE ?', ["%{$miscValue}%"]);
            });
        }
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
            '<sheets><sheet name="External Tests" sheetId="1" r:id="rId1"/></sheets></workbook>';
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

<?php

namespace App\Http\Services;

use App\Models\Department;
use App\Models\Division;
use App\Models\Provider;
use App\Models\Style;
use Illuminate\Support\Carbon;
use Illuminate\Http\UploadedFile;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use ZipArchive;

class TestImportService
{
    private const FAIL_TEST_ITEM_TRANSLATIONS = [
        'APPEARANCE AFTER WASH' => 'Apariencia después del lavado',
        'BURST STRENGTH' => 'Resistencia al reventamiento',
        'BURSTING STRENGTH' => 'Resistencia al reventamiento',
        'BURST STRENGTH (ASTM D3786)' => 'Resistencia al reventamiento (ASTM D3786)',
        'BREAKING STRENGTH AND ELONGATION OF TEXTILE FABRICS (GRAB TEST) (ASTM D5034)'
        => 'Resistencia a la rotura y elongación de telas (Grab Test) (ASTM D5034)',
        'COLOR CHANGE' => 'Cambio de color',
        'COLOR FASTNESS TO STORAGE' => 'Solidez del color al almacenamiento',
        'COLOR FASTNESS TO STORAGE (AATCC 163)' => 'Solidez del color al almacenamiento (AATCC 163)',
        'COLOR FASTNESS TO WASHING' => 'Solidez del color al lavado',
        'COLOR FASTNESS TO WASHING (AATCC 61)' => 'Solidez del color al lavado (AATCC 61)',
        'COLORFASTNESS TO CROCKING' => 'Solidez del color al frote',
        'COLORFASTNESS TO CROCKING (AATCC 8)' => 'Solidez del color al frote (AATCC 8)',
        'COLORFASTNESS TO DRY CLEANING' => 'Solidez del color al lavado en seco',
        'COLORFASTNESS TO LIGHT' => 'Solidez del color a la luz',
        'COLORFASTNESS TO PERSPIRATION' => 'Solidez del color a la transpiración',
        'COLORFASTNESS TO RUBBING' => 'Solidez del color al frote',
        'COLORFASTNESS TO WASHING' => 'Solidez del color al lavado',
        'DIMENSIONAL CHANGES AFTER WASHING' => 'Cambios dimensionales después del lavado',
        'DIMENSIONAL CHANGES AFTER WASHING (AATCC 135)'
        => 'Cambios dimensionales después del lavado (AATCC 135)',
        'DIMENSIONAL CHANGE AFTER WASHING' => 'Cambio dimensional después del lavado',
        'DIMENSIONAL STABILITY' => 'Estabilidad dimensional',
        'FIBER ANALYSIS (2 FIBRAS) - (AATCC 20/20A-VISUAL)'
        => 'Análisis de fibras (2 fibras) - (AATCC 20/20A-Visual)',
        'PH VALUE' => 'Valor de pH',
        'PILLING' => 'Pilling',
        'PILLING RESISTANCE' => 'Resistencia al pilling',
        'PILLING RESISTANCE (ASTM D3512)' => 'Resistencia al pilling (ASTM D3512)',
        'SEAM SLIPPAGE' => 'Deslizamiento de costura',
        'SEAM STRENGTH' => 'Resistencia de costura',
        'SHRINKAGE' => 'Encogimiento',
        'SKEWNESS AFTER WASH (AATCC 179)' => 'Desviación después del lavado (AATCC 179)',
        'SNAGGING' => 'Enganche',
        'SPIRALITY' => 'Espiralidad',
        'STRETCH AND RECOVERY (ASTM D 3107)' => 'Estiramiento y recuperación (ASTM D 3107)',
        'TEAR STRENGTH (ASTM D1424)' => 'Resistencia al desgarre (ASTM D1424)',
        'TEAR STRENGTH' => 'Resistencia al desgarre',
        'TENSILE STRENGTH' => 'Resistencia a la tracción',
        'WEIGHT PER UNIT AREA - ASTM D3776' => 'Peso por unidad de área - ASTM D3776',
    ];

    private const STYLE_UPSERT_COLUMNS = [
        'number',
        'provider_id',
        'division_id',
        'department_id',
        'order_id',
        'updated_at',
        'created_at',
    ];

    private const EXTERNAL_TEST_COLUMNS = [
        'style_id',
        'style_number',
        'report_number',
        'reported_at',
        'lab',
        'color',
        'provider',
        'division',
        'department',
        'rejected_1',
        'rejected_2',
        'rejected_3',
        'rejected_4',
        'rejected_5',
        'rejected_6',
        'weigth',
        'composition',
        'status',
        'status_purchases',
        'released_at',
        'reprocesses',
        'action_taken',
        'cloth_provider',
        'generic_name',
        'comercial_name',
        'updated_at',
        'created_at',
    ];

    private const COMPOSITION_MAX_LENGTH = 500;

    private const EXTERNAL_DEDUP_COLUMNS = [
        'style_number',
        'report_number',
        'reported_at',
        'cloth_provider',
        'status',
        'status_purchases',
        'action_taken',
        'rejected_1',
        'rejected_2',
        'rejected_3',
        'rejected_4',
        'rejected_5',
        'rejected_6',
    ];

    private const CHUNK_SIZE = 500;
    private const SHEET_NAME = 'BASE INF';

    private array $providerByNumber = [];
    private array $providerByName = [];
    private array $divisionByNumber = [];
    private array $divisionByName = [];
    private array $departmentByNumber = [];
    private array $departmentByName = [];

    public function getLayoutColumns(): array
    {
        return [
            'Layout A: AÑO, MES, DIA, PROV, DIVISION, DPTO, LAB, RECH GRAL, RECH 1-5, PESO, COMPOSICION, ESTILO,',
            'Estatus Calidad, Estatus Compras, Liberación compras, REPROCESO/REINGRESO,',
            'Acciones/Seguimiento Compras, PROV TELA, NOMBRE GENERICO, NOMBRE COMERCIAL, OC.',
            'Layout B: FECHA DE EMISIÓN DEL REPORTE, Report No., Overall Result, Vendor Name,',
            'Fail Test Item List, ESTILO, Style No., Colour, Fiber Content, Department, Number of samples,',
            'Date Of Entry, FECHA DE SALIDA RESULTADOS, Weight, NOMBRE GENÉRICO, TIPO DE PRODUCTO, Tipo de tejido',
        ];
    }

    public function storeUpload(UploadedFile $file): string
    {
        $filename = 'tests-layout-' . Str::uuid() . '.' . $file->getClientOriginalExtension();
        $storedPath = $file->storeAs('imports', $filename);

        return $storedPath;
    }

    public function importStylesFromLayout(string $filePath): array
    {
        $rows = $this->readXlsxRows($filePath);
        $this->loadLookupMaps();
        $headerRowNumber = null;
        $headerMap = [];
        $hasLayoutA = false;
        $hasLayoutB = false;

        foreach ($rows as $rowNumber => $row) {
            $candidateMap = $this->buildHeaderMap($row);
            if (! $candidateMap) {
                continue;
            }

            $layoutA = $this->hasRequiredHeaders($candidateMap, ExternalTestLayout::LAYOUT_A_HEADERS);
            $layoutB = $this->hasRequiredHeaders($candidateMap, ExternalTestLayout::LAYOUT_B_HEADERS);

            if ($layoutA || $layoutB) {
                $headerRowNumber = (int) $rowNumber;
                $headerMap = $candidateMap;
                $hasLayoutA = $layoutA;
                $hasLayoutB = $layoutB;
                break;
            }
        }

        if (! $headerRowNumber) {
            throw new \RuntimeException('No se encontró la fila de encabezados en el archivo.');
        }

        if (! $hasLayoutA && ! $hasLayoutB) {
            throw new \RuntimeException('El archivo no contiene un layout válido (A-X o Y-AO).');
        }

        $stylesCreated = 0;
        $stylesUpdated = 0;
        $testsCreated = 0;
        $skipped = 0;
        $styleBuffer = [];
        $externalTestsBuffer = [];

        foreach ($rows as $rowNumber => $row) {
            if ($rowNumber <= $headerRowNumber) {
                continue;
            }

            $styleNumber = $this->extractStyleNumber($row, $headerMap);
            if (!$styleNumber) {
                $skipped++;
                continue;
            }

            $styleData = [];
            $externalTestData = [];
            if ($hasLayoutA) {
                $styleData = array_merge($styleData, $this->mapStyleFromLayoutA($row, $headerMap));
                $externalTestData = array_merge($externalTestData, $this->mapExternalTestFromLayoutA($row, $headerMap));
            }
            if ($hasLayoutB) {
                $styleData = array_merge($styleData, $this->mapStyleFromLayoutB($row, $headerMap));
                $externalTestData = array_merge($externalTestData, $this->mapExternalTestFromLayoutB($row, $headerMap));
            }

            $styleData = $this->filterEmptyValues($styleData);
            $externalTestData = $this->filterEmptyValues($externalTestData);

            if (! $styleData && ! $externalTestData) {
                $skipped++;
                continue;
            }

            $styleBuffer[$styleNumber] = array_merge(
                $styleBuffer[$styleNumber] ?? [],
                $styleData,
                ['number' => $styleNumber]
            );

            if ($externalTestData) {
                $externalTestsBuffer[] = [
                    'style_number' => $styleNumber,
                    'data' => $externalTestData,
                ];
            }

            if (
                count($styleBuffer) >= self::CHUNK_SIZE ||
                count($externalTestsBuffer) >= self::CHUNK_SIZE
            ) {
                $this->flushUpsertBatch(
                    $styleBuffer,
                    $externalTestsBuffer,
                    $stylesCreated,
                    $stylesUpdated,
                    $testsCreated
                );
                $styleBuffer = [];
                $externalTestsBuffer = [];
            }
        }

        if ($styleBuffer || $externalTestsBuffer) {
            $this->flushUpsertBatch(
                $styleBuffer,
                $externalTestsBuffer,
                $stylesCreated,
                $stylesUpdated,
                $testsCreated
            );
        }

        return [
            'styles_created' => $stylesCreated,
            'styles_updated' => $stylesUpdated,
            'tests_created' => $testsCreated,
            'skipped' => $skipped,
        ];
    }

    private function mapStyleFromLayoutA(array $row, array $headerMap): array
    {
        $providerId = $this->resolveProviderId($this->getValue($row, $headerMap['PROV'] ?? null));
        $divisionId = $this->resolveDivisionId($this->getValue($row, $headerMap['DIVISION'] ?? null));
        $departmentId = $this->resolveDepartmentId($this->getValue($row, $headerMap['DPTO'] ?? null));

        $orderIdValue = $this->getValue($row, $headerMap['OC'] ?? null);
        $orderId = is_numeric($orderIdValue) ? (int) $orderIdValue : null;

        return [
            'provider_id' => $providerId,
            'division_id' => $divisionId,
            'department_id' => $departmentId,
            'order_id' => $orderId,
        ];
    }

    private function mapExternalTestFromLayoutA(array $row, array $headerMap): array
    {
        $year = $this->getValue($row, $headerMap['ANO'] ?? null);
        $month = $this->getValue($row, $headerMap['MES'] ?? null);
        $day = $this->getValue($row, $headerMap['DIA'] ?? null);
        $provider = $this->getValue($row, $headerMap['PROV'] ?? null);
        $division = $this->getValue($row, $headerMap['DIVISION'] ?? null);
        $department = $this->getValue($row, $headerMap['DPTO'] ?? null);

        $statusQuality = $this->getValue($row, $headerMap['ESTATUS CALIDAD'] ?? null);
        $statusPurchases = $this->getValue($row, $headerMap['ESTATUS COMPRAS'] ?? null);

        $releasedAt = $this->parseDateValue($this->getValue($row, $headerMap['LIBERACION COMPRAS'] ?? null));
        $composition = $this->trimToLength(
            $this->getValue($row, $headerMap['COMPOSICION'] ?? null),
            self::COMPOSITION_MAX_LENGTH
        );

        return [
            'reported_at' => $this->parseDateFromParts($year, $month, $day),
            'lab' => $this->getValue($row, $headerMap['LAB'] ?? null),
            'provider' => $provider,
            'division' => $division,
            'department' => $department,
            'rejected_1' => $this->getValue($row, $headerMap['RECH GRAL'] ?? null),
            'rejected_2' => $this->getValue($row, $headerMap['RECH 1'] ?? null),
            'rejected_3' => $this->getValue($row, $headerMap['RECH 2'] ?? null),
            'rejected_4' => $this->getValue($row, $headerMap['RECH 3'] ?? null),
            'rejected_5' => $this->getValue($row, $headerMap['RECH 4'] ?? null),
            'rejected_6' => $this->getValue($row, $headerMap['RECH 5'] ?? null),
            'weigth' => $this->getValue($row, $headerMap['PESO'] ?? null),
            'composition' => $composition,
            'status' => $statusQuality,
            'status_purchases' => $statusPurchases,
            'released_at' => $releasedAt,
            'reprocesses' => $this->getValue($row, $headerMap['REPROCESO/REINGRESO'] ?? null),
            'action_taken' => $this->getValue($row, $headerMap['ACCIONES/SEGUIMIENTO COMPRAS'] ?? null),
            'cloth_provider' => $this->getValue($row, $headerMap['PROV TELA'] ?? null),
            'generic_name' => $this->getValue($row, $headerMap['NOMBRE GENERICO'] ?? null),
            'comercial_name' => $this->getValue($row, $headerMap['NOMBRE COMERCIAL'] ?? null),
        ];
    }

    private function mapStyleFromLayoutB(array $row, array $headerMap): array
    {
        return [
            'provider_id' => $this->resolveProviderId($this->getValue($row, $headerMap['VENDOR NAME'] ?? null)),
            'department_id' => $this->resolveDepartmentId($this->getValue($row, $headerMap['DEPARTMENT'] ?? null)),
        ];
    }

    private function mapExternalTestFromLayoutB(array $row, array $headerMap): array
    {
        $reportDate = $this->getValue($row, $headerMap['FECHA DE EMISION DEL REPORTE'] ?? null);
        $entryDate = $this->getValue($row, $headerMap['DATE OF ENTRY'] ?? null);
        $provider = $this->getValue($row, $headerMap['VENDOR NAME'] ?? null);
        $department = $this->getValue($row, $headerMap['DEPARTMENT'] ?? null);
        $reportNumber = $this->getValue($row, $headerMap['REPORT NO.'] ?? null);
        $lab = $this->resolveLabFromReportNumber($reportNumber);
        $composition = $this->trimToLength(
            $this->getValue($row, $headerMap['FIBER CONTENT'] ?? null),
            self::COMPOSITION_MAX_LENGTH
        );
        $failTestItems = $this->parseFailTestItemList(
            $this->getValue($row, $headerMap['FAIL TEST ITEM LIST'] ?? null)
        );

        return [
            'report_number' => $reportNumber,
            'reported_at' => $this->parseDateValue($reportDate) ?? $this->parseDateValue($entryDate),
            'lab' => $lab,
            'status' => $this->getValue($row, $headerMap['OVERALL RESULT'] ?? null),
            'provider' => $provider,
            'department' => $department,
            'rejected_1' => $failTestItems[0] ?? null,
            'rejected_2' => $failTestItems[1] ?? null,
            'rejected_3' => $failTestItems[2] ?? null,
            'rejected_4' => $failTestItems[3] ?? null,
            'rejected_5' => $failTestItems[4] ?? null,
            'rejected_6' => $failTestItems[5] ?? null,
            'composition' => $composition,
            'released_at' => null,
            'weigth' => $this->getValue($row, $headerMap['WEIGHT'] ?? null),
            'generic_name' => $this->getValue($row, $headerMap['NOMBRE GENERICO'] ?? null),
            'color' => $this->getValue($row, $headerMap['COLOUR'] ?? null),
        ];
    }

    private function extractStyleNumber(array $row, array $headerMap): ?string
    {
        $styleNumber = $this->getValue($row, $headerMap['ESTILO'] ?? null);
        if (! $styleNumber) {
            $styleNumber = $this->getValue($row, $headerMap['STYLE NO.'] ?? null);
        }
        if (! $styleNumber) {
            $styleNumber = $this->getValue($row, $headerMap['OC'] ?? null);
        }

        if (! $styleNumber) {
            return null;
        }

        $styleNumber = preg_split('/[;\\n\\r]+/', $styleNumber)[0] ?? $styleNumber;
        $styleNumber = trim($styleNumber);

        return $styleNumber !== '' ? $styleNumber : null;
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
        $header = preg_replace('/\\s+/', ' ', $header);

        return $header ?? '';
    }

    private function getValue(array $row, ?string $column): ?string
    {
        if (! $column || ! array_key_exists($column, $row)) {
            return null;
        }

        $value = trim((string) $row[$column]);
        $value = str_replace('_x000D_', "\n", $value);
        $value = preg_replace('/\\s+/', ' ', $value);

        return $value !== '' ? $value : null;
    }

    private function translateFailTestItemList(?string $value): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim($value);
        if ($value === '') {
            return null;
        }

        $parts = preg_split('/([,;\\n\\/]+|\\s&\\s)/', $value, -1, PREG_SPLIT_DELIM_CAPTURE);
        if (! $parts) {
            return $value;
        }

        $translated = [];
        foreach ($parts as $part) {
            if (preg_match('/^([,;\\n\\/]+|\\s&\\s)$/', $part)) {
                $translated[] = $part;
                continue;
            }

            $translated[] = $this->translateFailTestItemToken($part);
        }

        return implode('', $translated);
    }

    private function parseFailTestItemList(?string $value): array
    {
        $translated = $this->translateFailTestItemList($value);
        if ($translated === null) {
            return [];
        }

        $parts = preg_split('/[;,|]+/', $translated) ?: [];
        $parts = array_map('trim', $parts);
        $parts = array_values(array_filter($parts, fn($part) => $part !== ''));

        return $parts;
    }

    private function translateFailTestItemToken(string $value): string
    {
        $normalized = $this->normalizeFailTestItemToken($value);
        if ($normalized === '') {
            return $value;
        }

        return self::FAIL_TEST_ITEM_TRANSLATIONS[$normalized] ?? $value;
    }

    private function normalizeFailTestItemToken(string $value): string
    {
        $value = trim($value);
        if ($value === '') {
            return '';
        }

        $value = Str::ascii($value);
        $value = mb_strtoupper($value, 'UTF-8');
        $value = preg_replace('/\\s+/', ' ', $value);

        return $value ?? '';
    }

    private function resolveLabFromReportNumber(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        $normalized = trim($value);
        if ($normalized === '') {
            return null;
        }

        if (stripos($normalized, 'MEX') === 0) {
            return 'INTERTEK';
        }

        if (stripos($normalized, 'AG') === 0) {
            return 'INTERLAB';
        }

        if (stripos($normalized, 'CCP') === 0) {
            return 'TTSA';
        }

        return null;
    }

    private function parseDateFromParts(?string $year, ?string $month, ?string $day): ?string
    {
        if (! $year || ! $month || ! $day) {
            return null;
        }

        $monthMap = [
            'ENERO' => 1,
            'FEBRERO' => 2,
            'MARZO' => 3,
            'ABRIL' => 4,
            'MAYO' => 5,
            'JUNIO' => 6,
            'JULIO' => 7,
            'AGOSTO' => 8,
            'SEPTIEMBRE' => 9,
            'SETIEMBRE' => 9,
            'OCTUBRE' => 10,
            'NOVIEMBRE' => 11,
            'DICIEMBRE' => 12,
        ];

        $monthNormalized = mb_strtoupper(Str::ascii($month), 'UTF-8');
        $monthNumber = $monthMap[$monthNormalized] ?? null;
        if (! $monthNumber || ! is_numeric($year) || ! is_numeric($day)) {
            return null;
        }

        try {
            return Carbon::create((int) $year, $monthNumber, (int) $day)->format('Y-m-d');
        } catch (\Throwable $e) {
            return null;
        }
    }

    private function parseDateValue(?string $value): ?string
    {
        if (! $value) {
            return null;
        }

        if (is_numeric($value)) {
            try {
                return Carbon::create(1899, 12, 30)->addDays((int) $value)->format('Y-m-d');
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

    private function resolveProviderId(?string $value): ?int
    {
        if (! $value) {
            return null;
        }

        $normalized = $this->normalizeLookupKey($value);
        if ($normalized === '') {
            return null;
        }

        return $this->providerByNumber[$normalized]
            ?? $this->providerByName[$normalized]
            ?? null;
    }

    private function resolveDivisionId(?string $value): ?int
    {
        if (! $value) {
            return null;
        }

        $number = $this->extractLeadingNumber($value);
        if ($number) {
            $normalizedNumber = $this->normalizeLookupKey($number);
            if ($normalizedNumber !== '' && isset($this->divisionByNumber[$normalizedNumber])) {
                return $this->divisionByNumber[$normalizedNumber];
            }
        }

        $normalized = $this->normalizeLookupKey($value);
        if ($normalized === '') {
            return null;
        }

        return $this->divisionByName[$normalized] ?? null;
    }

    private function resolveDepartmentId(?string $value): ?int
    {
        if (! $value) {
            return null;
        }

        $number = $this->extractLeadingNumber($value);
        if ($number) {
            $normalizedNumber = $this->normalizeLookupKey($number);
            if ($normalizedNumber !== '' && isset($this->departmentByNumber[$normalizedNumber])) {
                return $this->departmentByNumber[$normalizedNumber];
            }
        }

        $normalized = $this->normalizeLookupKey($value);
        if ($normalized === '') {
            return null;
        }

        return $this->departmentByName[$normalized] ?? null;
    }

    private function extractLeadingNumber(string $value): ?string
    {
        if (preg_match('/^\\s*(\\d+)/', $value, $matches)) {
            return $matches[1];
        }

        return null;
    }

    private function filterEmptyValues(array $data): array
    {
        return array_filter($data, function ($value) {
            return $value !== null && $value !== '';
        });
    }

    private function trimToLength(?string $value, int $maxLength): ?string
    {
        if ($value === null) {
            return null;
        }

        $value = trim($value);
        if ($value === '') {
            return null;
        }

        if (mb_strlen($value, 'UTF-8') <= $maxLength) {
            return $value;
        }

        return mb_substr($value, 0, $maxLength, 'UTF-8');
    }

    private function loadLookupMaps(): void
    {
        if ($this->providerByNumber || $this->providerByName) {
            return;
        }

        Provider::select('id', 'number', 'name')
            ->get()
            ->each(function ($provider) {
                $numberKey = $this->normalizeLookupKey((string) $provider->number);
                if ($numberKey !== '') {
                    $this->providerByNumber[$numberKey] = (int) $provider->id;
                }
                $nameKey = $this->normalizeLookupKey((string) $provider->name);
                if ($nameKey !== '') {
                    $this->providerByName[$nameKey] = (int) $provider->id;
                }
            });

        Division::select('id', 'number', 'description')
            ->get()
            ->each(function ($division) {
                $numberKey = $this->normalizeLookupKey((string) $division->number);
                if ($numberKey !== '') {
                    $this->divisionByNumber[$numberKey] = (int) $division->id;
                }
                $nameKey = $this->normalizeLookupKey((string) $division->description);
                if ($nameKey !== '') {
                    $this->divisionByName[$nameKey] = (int) $division->id;
                }
            });

        Department::select('id', 'number', 'description')
            ->get()
            ->each(function ($department) {
                $numberKey = $this->normalizeLookupKey((string) $department->number);
                if ($numberKey !== '') {
                    $this->departmentByNumber[$numberKey] = (int) $department->id;
                }
                $nameKey = $this->normalizeLookupKey((string) $department->description);
                if ($nameKey !== '') {
                    $this->departmentByName[$nameKey] = (int) $department->id;
                }
            });
    }

    private function normalizeLookupKey(string $value): string
    {
        $value = trim($value);
        if ($value === '') {
            return '';
        }

        $value = Str::ascii($value);
        $value = mb_strtolower($value, 'UTF-8');
        $value = preg_replace('/\\s+/', ' ', $value);

        return $value ?? '';
    }

    private function flushUpsertBatch(
        array $styleBuffer,
        array $externalTestsBuffer,
        int &$stylesCreated,
        int &$stylesUpdated,
        int &$testsCreated
    ): void {
        $styleRows = array_values($styleBuffer);
        $externalRows = $externalTestsBuffer;

        if (! $styleRows && ! $externalRows) {
            return;
        }

        $numbers = array_unique(array_merge(
            array_column($styleRows, 'number'),
            array_map(fn($row) => $row['style_number'], $externalRows)
        ));

        if (! $numbers) {
            return;
        }

        $existingNumbers = DB::table('styles')
            ->whereIn('number', $numbers)
            ->pluck('number')
            ->all();

        $existingNumbers = array_flip($existingNumbers);
        $newStyleRows = [];
        $now = now();

        foreach ($styleRows as $row) {
            if (isset($existingNumbers[$row['number']])) {
                continue;
            }

            $row['created_at'] = $row['created_at'] ?? $now;
            $row['updated_at'] = $row['updated_at'] ?? $now;

            foreach (self::STYLE_UPSERT_COLUMNS as $column) {
                if (! array_key_exists($column, $row)) {
                    $row[$column] = null;
                }
            }

            $newStyleRows[] = array_intersect_key(
                $row,
                array_flip(self::STYLE_UPSERT_COLUMNS)
            );
        }

        if ($newStyleRows) {
            $this->insertStylesWithOracleSequenceRetry($newStyleRows);
            $stylesCreated += count($newStyleRows);
        }

        $stylesUpdated += 0;

        $styleIdMap = DB::table('styles')
            ->select('id', 'number')
            ->whereIn('number', $numbers)
            ->get()
            ->keyBy('number');

        if ($externalRows) {
            $externalInsertRows = [];
            $dedupSignatures = $this->loadExternalTestSignatures($externalRows);
            foreach ($externalRows as $item) {
                $styleId = $styleIdMap[$item['style_number']]->id ?? null;
                if (! $styleId) {
                    continue;
                }

                $row = array_merge($item['data'], [
                    'style_id' => $styleId,
                    'style_number' => $item['style_number'],
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);

                foreach (self::EXTERNAL_TEST_COLUMNS as $column) {
                    if (! array_key_exists($column, $row)) {
                        $row[$column] = null;
                    }
                }

                $row = array_intersect_key(
                    $row,
                    array_flip(self::EXTERNAL_TEST_COLUMNS)
                );

                $signature = $this->buildExternalTestSignature($row);
                if (isset($dedupSignatures[$signature])) {
                    continue;
                }

                $dedupSignatures[$signature] = true;
                $externalInsertRows[] = $row;
            }

            foreach (array_chunk($externalInsertRows, self::CHUNK_SIZE) as $chunk) {
                DB::table('external_tests')->insert($chunk);
                $testsCreated += count($chunk);
            }
        }
    }

    private function readXlsxRows(string $filePath): array
    {
        $zip = new ZipArchive();
        if ($zip->open($filePath) !== true) {
            throw new \RuntimeException('No se pudo abrir el archivo Excel.');
        }

        $sharedStrings = $this->readSharedStrings($zip);
        $sheetPath = $this->resolveSheetPath($zip, self::SHEET_NAME);
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

        $zip->close();

        return $rows;
    }

    private function insertStylesWithOracleSequenceRetry(array $rows): void
    {
        try {
            DB::table('styles')->insert($rows);
        } catch (QueryException $e) {
            if (! $this->shouldRetryStylesInsertForOracleSequence($e)) {
                throw $e;
            }

            $this->syncOracleSequenceToTableMax('STYLES_ID_SEQ', 'styles', 'id');
            DB::table('styles')->insert($rows);
        }
    }

    private function shouldRetryStylesInsertForOracleSequence(QueryException $e): bool
    {
        $connection = DB::connection();
        if ($connection->getDriverName() !== 'oracle') {
            return false;
        }

        $message = $e->getMessage();

        return str_contains($message, 'ORA-00001')
            && str_contains(mb_strtoupper($message, 'UTF-8'), 'STYLES_ID_PK');
    }

    private function syncOracleSequenceToTableMax(string $sequenceName, string $table, string $idColumn): void
    {
        if (DB::connection()->getDriverName() !== 'oracle') {
            return;
        }

        $maxId = (int) (DB::table($table)->max($idColumn) ?? 0);
        $nextVal = $this->oracleSequenceNextVal($sequenceName);
        $targetNextVal = $maxId + 1;

        if ($nextVal >= $targetNextVal) {
            return;
        }

        $increment = $targetNextVal - $nextVal;
        DB::statement("ALTER SEQUENCE {$sequenceName} INCREMENT BY {$increment}");
        $this->oracleSequenceNextVal($sequenceName);
        DB::statement("ALTER SEQUENCE {$sequenceName} INCREMENT BY 1");
    }

    private function oracleSequenceNextVal(string $sequenceName): int
    {
        $row = DB::selectOne("SELECT {$sequenceName}.NEXTVAL AS NEXTVAL FROM dual");
        if (! $row) {
            throw new \RuntimeException("No se pudo obtener NEXTVAL de la secuencia {$sequenceName}.");
        }

        $values = array_values((array) $row);

        return (int) ($values[0] ?? 0);
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

    private function loadExternalTestSignatures(array $externalRows): array
    {
        if (! $externalRows) {
            return [];
        }

        $styleNumbers = [];
        $reportedAtValues = [];
        $hasNullReportedAt = false;

        foreach ($externalRows as $item) {
            $styleNumber = $item['style_number'] ?? null;
            if (! $styleNumber) {
                continue;
            }
            $styleNumbers[$styleNumber] = true;

            $reportedAt = $item['data']['reported_at'] ?? null;
            if ($reportedAt) {
                $reportedAtValues[$reportedAt] = true;
            } else {
                $hasNullReportedAt = true;
            }
        }

        $styleNumbers = array_keys($styleNumbers);
        if (! $styleNumbers) {
            return [];
        }

        $query = DB::table('external_tests')
            ->select(self::EXTERNAL_DEDUP_COLUMNS)
            ->whereIn('style_number', $styleNumbers);

        $reportedAtValues = array_keys($reportedAtValues);
        if ($reportedAtValues || $hasNullReportedAt) {
            $query->where(function ($q) use ($reportedAtValues, $hasNullReportedAt) {
                if ($reportedAtValues) {
                    $q->whereIn('reported_at', $reportedAtValues);
                }
                if ($hasNullReportedAt) {
                    $q->orWhereNull('reported_at');
                }
            });
        }

        $existing = $query->get();
        $signatures = [];
        foreach ($existing as $row) {
            $rowArray = array_change_key_case((array) $row, CASE_LOWER);
            $signatures[$this->buildExternalTestSignature($rowArray)] = true;
        }

        return $signatures;
    }

    private function buildExternalTestSignature(array $row): string
    {
        $payload = [];
        foreach (self::EXTERNAL_DEDUP_COLUMNS as $column) {
            $value = $row[$column] ?? null;
            if (is_string($value)) {
                $value = trim($value);
                $value = preg_replace('/\\s+/', ' ', $value);
                $value = $value === '' ? null : $value;
            }
            if ($column === 'reported_at') {
                $value = $this->normalizeReportedAtForSignature($value);
            }
            $payload[$column] = $value;
        }

        return md5(json_encode($payload));
    }

    private function normalizeReportedAtForSignature($value): ?string
    {
        if ($value instanceof \DateTimeInterface) {
            return $value->format('Y-m-d');
        }

        if (! $value) {
            return null;
        }

        $value = trim((string) $value);
        if ($value === '') {
            return null;
        }

        $parsed = $this->parseDateValue($value);
        if ($parsed) {
            return $parsed;
        }

        try {
            return Carbon::parse($value)->format('Y-m-d');
        } catch (\Throwable $e) {
            return $value;
        }
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

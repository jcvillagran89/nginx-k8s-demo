<?php

namespace App\Http\Services;

use App\Http\Controllers\MicrosoftAuthController;
use App\Models\Test;
use App\Models\TestRequest;
use App\Models\TestType;
use Carbon\Carbon;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\View;

class ReportService
{

    protected $mTestRequest;
    protected $mTest;
    protected $mTestType;

    public function __construct()
    {
        $this->mTestRequest = new TestRequest();
        $this->mTest = new Test();
        $this->mTestType = new TestType();
    }

    public function getAllTest(
        int $perPage = 10,
        ?string $search = null,
        $status = null,
        ?string $dateRange = null
    ) {
        $query = $this->mTestRequest
            ->with(['analyst','test', 'test.results', 'style', 'style.provider', 'style.department']);

        if ($search) {
            $query->where(function ($qq) use ($search) {
                $qq->where('number', 'like', "%{$search}%")
                    ->orWhere('item', 'like', "%{$search}%")
                    ->orWhereHas('style', function ($s) use ($search) {
                        $s->where('number', 'like', "%{$search}%")
                            ->orWhere('description', 'like', "%{$search}%");
                    })
                    ->orWhereHas('style.provider', function ($p) use ($search) {
                        $p->where('name', 'like', "%{$search}%")
                            ->orWhere('number', 'like', "%{$search}%");
                    });
            });
        }

        if ($status !== null && $status !== '' && (int) $status !== 6) {
            $query->where('status', (int) $status);
        } else {
            $query->whereIn('status',
                [
                    $this->mTestRequest::STATUS['APPROVED'],
                    $this->mTestRequest::STATUS['REJECTED'],
                    $this->mTestRequest::STATUS['APPROVED_COMMITTEE'],
                    $this->mTestRequest::STATUS['REJECTED_COMMITTEE'],
                ]
            );
        }

        if ($dateRange) {
            $parts = explode(' a ', $dateRange);

            if (count($parts) === 2) {
                [$fromStr, $toStr] = $parts;

                try {
                    $from = Carbon::createFromFormat('d/m/Y', trim($fromStr))->startOfDay();
                    $to   = Carbon::createFromFormat('d/m/Y', trim($toStr))->endOfDay();
                    $query->whereBetween('created_at', [$from, $to]);
                } catch (\Throwable $e) {
                    // \Log::warning('Rango de fechas inválido en getAllTestRequest', [
                    //     'dateRange' => $dateRange,
                    //     'error' => $e->getMessage(),
                    // ]);
                }
            }
        }

        return $query->orderByDesc('id')
            ->paginate($perPage)
            ->through(function ($item) {
                $content = $item->test[0]->results[0]->content ?? [];

                $total = 0;
                $done = 0;

                foreach ($content as $key => $block) {
                    if (!is_array($block)) {
                        continue;
                    }

                    if (array_key_exists('status', $block)) {
                        $total++;
                        if ($block['status'] == 2) {
                            $done++;
                        }
                    }
                }

                $item->completed_tests = $done;
                $item->total_tests = $total;

                return $item;
            })
            ->withQueryString();
    }

    public function getStats()
    {
        $total = $this->mTestRequest->whereIn('status', [$this->mTestRequest::STATUS['APPROVED'], $this->mTestRequest::STATUS['REJECTED']])->count();
        $inProgress = $this->mTestRequest->where('status', $this->mTestRequest::STATUS['IN_PROGRESS'])->count();
        $pendingReview = $this->mTestRequest->where('status', $this->mTestRequest::STATUS['PENDING_REVIEW'])->count();
        $approved = $this->mTestRequest->where('status', $this->mTestRequest::STATUS['APPROVED'])->count();
        $rejected = $this->mTestRequest->where('status', $this->mTestRequest::STATUS['REJECTED'])->count();

        return [
            'total' => $total,
            'in_progress' => $inProgress,
            'pending_review' => $pendingReview,
            'approved' => $approved,
            'rejected' => $rejected,
        ];
    }

    public function preview($id, $request)
    {
        $data = $this->generateReportPdf($id);

        $pdf = Pdf::loadView('reports.textile', [
            'testRequest' => $data['testRequest'],
            'reportTests' => $data['reportTests'],
            'evaluation'  => $data['evaluation'],
        ])->setPaper('letter');

        if ($request->boolean('download')) {
            return $pdf->download("Reporte_{$data['testRequest']->number}.pdf");
        }

        return $pdf->stream("Reporte_{$data['testRequest']->number}.pdf");
    }

    public function sendToProvider($id)
    {
        $data = $this->generateReportPdf($id);

        $testRequest = $data['testRequest'];

        $providerEmails = $testRequest->style->provider->emails ?? [];

        if (!is_array($providerEmails) || empty($providerEmails)) {
            throw new \Exception('El proveedor no tiene correos registrados');
        }

        $providerEmails = collect($providerEmails)
            ->filter(fn($email) => filter_var($email, FILTER_VALIDATE_EMAIL))
            ->values()
            ->toArray();

        if (empty($providerEmails)) {
            throw new \Exception('No hay correos válidos para enviar el reporte');
        }

        $pdf = Pdf::loadView('reports.textile', [
            'testRequest' => $data['testRequest'],
            'reportTests' => $data['reportTests'],
            'evaluation'  => $data['evaluation'],
        ])->setPaper('letter');

        $fileName = 'Informe_Resultados_' . $testRequest->number . '.pdf';
        $path = storage_path('app/reports/' . $fileName);

        if (!file_exists(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        $pdf->save($path);

        try {

            $graph = new MicrosoftAuthController();

            $htmlBody = View::make('emails.test-report-mail', [
                'testRequest' => $testRequest
            ])->render();

            $graph->sendMail(
                $providerEmails,
                'Informe de Resultados – Orden ' . $testRequest->number,
                $htmlBody,
                $path
            );

            $testRequest->report_sent = true;
            $testRequest->save();

        } finally {

            if (file_exists($path)) {
                unlink($path);
            }
        }

        return true;
    }


    private function generateReportPdf($id)
    {
            $excludedLabels = [
            'humedad_relativa',
            'temperatura_oc',
            'acondicionamiento_humedad_relativa',
            'temperatura_a_c',
            'temperatura_c',
            'acondicionamiento_en_temperatura_oc',
            'acondicionamiento_temperatura_oc',

        ];

        $testRequest = $this->mTestRequest::with([
            'user',
            'reviewer',
            'test',
            'test.results.images',
            'style.provider',
            'style.department',
            'style.externalTests'
        ])->findOrFail($id);

        $evaluation = [
            'accepted'    => false,
            'rejected'    => false,
            'informative' => false,
        ];

        if ((int)$testRequest->is_informative === 1) {
            $evaluation['informative'] = true;
        }

        if ((int)$testRequest->status === 4 || (int)$testRequest->status === 7) {
            $evaluation['accepted'] = true;
        }

        if ((int)$testRequest->status === 5 || (int)$testRequest->status === 8) {
            $evaluation['rejected'] = true;
        }

        $reportTests = [];

        foreach ($testRequest->test as $test) {
            foreach ($test->results as $result) {

                $content = $result->content ?? [];

                foreach ($content as $testName => $testData) {
                
                    $testType = $this->mTestType->where('name_es', $testName)->first();
                    
                    if (!is_array($testData)) {
                        continue;
                    }

                    $fields = [];

                    foreach ($testData as $field) {

                        if (!is_array($field)) continue;

                        // FILTRAR LABELS EXCLUIDOS
                        if (
                            isset($field['label']) &&
                            in_array($field['label'], $excludedLabels)
                        ) {
                            continue;
                        }

                        if (!isset($field['display_name'])) continue;
                        if (!isset($field['value'])) continue;
                        if (is_string($field['value']) && trim($field['value']) === '') continue;

                        $displayName = $field['display_name'];
                        $resultValue = $field['value'];

                        // FILTRO ESPECIAL PARA PILLING / ASTM D3512
                        if (
                            stripos($testName, 'pilling') !== false ||
                            stripos($testName, 'astm d3512') !== false
                        ) {

                            $allowed = [
                                'pilling promedio',
                                'tolerancia'
                            ];

                            $normalizedName = strtolower(trim($displayName));

                            $match = false;

                            foreach ($allowed as $allow) {
                                if (str_contains($normalizedName, $allow)) {
                                    $match = true;
                                    break;
                                }
                            }

                            if (!$match) {
                                continue;
                            }
                        }

                        // FILTRO ESPECIAL PARA PILLING / ASTM D3512
                        if (
                            stripos($testName, 'pilling') !== false ||
                            stripos($testName, 'astm d3512') !== false
                        ) {

                            $allowed = [
                                'pilling promedio',
                                'tolerancia'
                            ];

                            $normalizedName = strtolower(trim($displayName));

                            $match = false;

                            foreach ($allowed as $allow) {
                                if (str_contains($normalizedName, $allow)) {
                                    $match = true;
                                    break;
                                }
                            }

                            if (!$match) {
                                continue;
                            }
                        }


                        // FILTRO ESPECIAL PARA ESTABILIDAD EN TELA / AATCC135
                        if (
                            stripos($testName, 'estabilidad en tela') !== false ||
                            stripos($testName, 'aatcc135') !== false
                        ) {

                            $excludedAATCC = [
                                'tipo de layout',
                                'numero de lavados',
                                'número de lavados',
                                'unidades de medida'
                            ];

                            $normalizedName = strtolower(trim($displayName));

                            foreach ($excludedAATCC as $exclude) {
                                if (str_contains($normalizedName, $exclude)) {
                                    continue 2;
                                }
                            }
                        }

                        // FILTRO ESPECIAL PARA TORSIÓN 207 / AATCC207
                        if (
                            stripos($testName, 'torsion 207') !== false ||
                            stripos($testName, 'torsión 207') !== false ||
                            stripos($testName, 'aatcc207') !== false
                        ) {

                            $allowed207 = [
                                'torsión izq',
                                'torsion izq',
                                'torsión der',
                                'torsion der',
                                'tolerancia'
                            ];

                            $normalizedName = strtolower(trim($displayName));

                            $match = false;

                            foreach ($allowed207 as $allow) {
                                if (str_contains($normalizedName, $allow)) {
                                    $match = true;
                                    break;
                                }
                            }

                            if (!$match) {
                                continue;
                            }
                        }

                        // FILTRO ESPECIAL PARA TORSIÓN / AATCC179
                        if (
                            stripos($testName, 'torsion') !== false ||
                            stripos($testName, 'torsión 179') !== false ||
                            stripos($testName, 'aatcc179') !== false
                        ) {

                            $excluded179 = [
                                'unidades'
                            ];

                            $normalizedName = strtolower(trim($displayName));

                            foreach ($excluded179 as $exclude) {
                                if (str_contains($normalizedName, $exclude)) {
                                    continue 2;
                                }
                            }
                        }

                        // FILTRO ESPECIAL PARA FROTE / AATCC8
                        if (
                            stripos($testName, 'aatcc8') !== false ||
                            stripos($testName, 'frote') !== false
                        ) {

                            $excludedAATCC8 = [
                                'acondicionamiento en temperatura',
                                'pickup tela principal',
                                'prueba de frote en'
                            ];

                            $normalizedName = strtolower(trim($displayName));

                            foreach ($excludedAATCC8 as $exclude) {
                                if (str_contains($normalizedName, $exclude)) {
                                    continue 2;
                                }
                            }
                        }

                        // FILTRO ESPECIAL PARA TRACCIÓN / ASTM D5034
                        if (
                            stripos($testName, 'traccion') !== false ||
                            stripos($testName, 'tracción') !== false ||
                            stripos($testName, 'astmd5034') !== false
                        ) {

                            $excluded5034 = [
                                'numero de especimen',
                                'numero de especimenes',
                                'número de especímenes',
                                'número de especimen',
                                'unidades'
                            ];

                            $normalizedName = strtolower(trim($displayName));

                            foreach ($excluded5034 as $exclude) {
                                if (str_contains($normalizedName, $exclude)) {
                                    continue 2;
                                }
                            }
                        }

                        // FILTRO ESPECIAL PARA PESO / ASTM D3776
                        if (
                            stripos($testName, 'peso') !== false ||
                            stripos($testName, 'astm d3776') !== false ||
                            stripos($testName, 'astmd3776') !== false
                        ) {

                            $excluded3776 = [
                                'unidad de peso'
                            ];

                            $normalizedName = strtolower(trim($displayName));

                            foreach ($excluded3776 as $exclude) {
                                if (str_contains($normalizedName, $exclude)) {
                                    continue 2;
                                }
                            }
                        }

                        // FILTRO ESPECIAL PARA ESTABILIDAD EN PRENDA / AATCC150
                        if (
                            stripos($testName, 'estabilidad en prenda') !== false ||
                            stripos($testName, 'aatcc150') !== false
                        ) {

                            $excluded150 = [
                                'tipo de layout',
                                'numero de lavados',
                                'número de lavados',
                                'unidad'
                            ];

                            $normalizedName = strtolower(trim($displayName));

                            foreach ($excluded150 as $exclude) {
                                if (str_contains($normalizedName, $exclude)) {
                                    continue 2;
                                }
                            }
                        }

                        // quitar grado

                        if (stripos($displayName, 'grado') !== false) {

                        $displayName = trim(str_ireplace('grado', '', $displayName));

                        $resultValue = trim($resultValue . ' Grado');
                        }

                        $parameterValue = '';

                        if (stripos($displayName, 'tolerancia') !== false) {
                            $parameterValue = $resultValue;
                            $resultValue = '';
                        }

                        $fields[] = [
                        'description'  => $testType->description,
                        'method'       => $testType->name_en,
                        'display_name' => $displayName,
                        'result'       => $resultValue,
                        'parameter'    => $parameterValue ?? '',
                        ];

                    }

                    $images = [];

                    if (!empty($testData['img'])) {
                        foreach ($testData['img'] as $imgRef) {

                            if (
                                !isset($imgRef['is_selected']) ||
                                (int) $imgRef['is_selected'] !== 1
                            ) {
                                continue;
                            }

                            $imageModel = $result->images
                                ->where('id', $imgRef['id'])
                                ->first();

                            if ($imageModel && $imageModel->image) {
                                $images[] = 'data:image/jpeg;base64,' .
                                    base64_encode($imageModel->image);
                            }
                        }
                    }

                    $reportTests[] = [
                        'name'        => $testName,
                        'fields'      => $fields,
                        'approved'    => $testData['approved'] ?? null,
                        'status'      => $testData['status'] ?? null,
                        'reviewed_by' => $testData['reviewed_by'] ?? 'S/D',
                        'images'      => $images,
                    ];
                }
            }
        }
        
        return [
        'testRequest' => $testRequest,
        'reportTests' => $reportTests,
        'evaluation' => $evaluation
        ];

    }

}

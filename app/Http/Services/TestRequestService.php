<?php

namespace App\Http\Services;

use App\Events\TestRequestAssigned;
use App\Models\Style;
use App\Models\Terminology;
use App\Models\Test;
use App\Models\TestRequest;
use App\Models\TestResult;
use App\Models\TestType;
use Carbon\Carbon;
use Illuminate\Broadcasting\BroadcastException;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Intervention\Image\Laravel\Facades\Image;

class TestRequestService
{

    protected $mTestRequest;
    protected $mTest;
    protected $mTestResult;
    protected $mTestType;
    protected $mTerminology;
    protected $mStyle;

    protected $sRecentActivity;

    public function __construct()
    {
        $this->mTestRequest = new TestRequest();
        $this->mTest = new Test();
        $this->mTestResult = new TestResult();
        $this->mTestType = new TestType();
        $this->mTerminology = new Terminology();
        $this->mStyle = new Style();
        $this->sRecentActivity = new RecentActivityService();
    }

    public function getAllTestRequest(
        int $perPage = 10,
        ?string $search = null,
        $status = null,
        ?string $dateRange = null
    ) {
        $query = $this->mTestRequest
            ->with(['test', 'test.results', 'style', 'style.provider', 'style.department', 'technician']);

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

        if ($status !== null && $status !== '' && (int) $status !== $this->mTestRequest::STATUS['ALL']) {
            $query->where('status', (int) $status);
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
            ->withQueryString();
    }
    public function showTestRequest($id)
    {
        return $this->mTestRequest::with([
            'test',
            'test.results',
            'style',
            'style.provider',
            'style.department',
            'style.externalTests',
            'style.internalTests',
        ])->findOrFail($id);
    }

    public function storeTest(array $data)
    {
        DB::beginTransaction();
        try {
            $washType = $data['wash_type'] ?? null;
            if (is_string($washType) && trim($washType) === '') {
                $washType = null;
            }
            $testRequest = $this->mTestRequest->create([
                'user_id' => auth()->user()->id,
                'style_id' => $data['style_id'] ?? null,
                'item' =>  $data['item'],
                'status' => $this->mTestRequest::STATUS['CREATED'],
                'number' => $this->generateTestNumber(),
                'notes' => $data['notes'],
                'is_development' => $data['is_development'] ?? 0,
                'is_informative' => $data['is_informative'] ?? 0,
                'wash_type' => $washType,
            ]);
            $imageBlob = null;
            if (isset($data['new_image'])) {
                $file = $data['new_image'];
                $image = Image::read($file->getRealPath());
                $image->scaleDown(1600);
                $encoded = $image->encodeByMediaType('image/jpeg', 70);
                $imageBlob = (string) $encoded;
            }

            $test = $this->mTest->create([
                'test_request_id' => $testRequest->id,
            ]);

            $content = [];

            foreach ($data['test_type_ids'] as $testTypeId) {
                $testType = $this->mTestType::find($testTypeId);
                if (!$testType) continue;

                $terminologies = $this->mTerminology::where('test_type_id', $testTypeId)->get();

                $groupKey = $testType->name_es ?? $testType->name;
                $content[$groupKey] = [];

                foreach ($terminologies as $term) {
                    $content[$groupKey][$term->id] = [
                        'label' => $term->name,
                        'display_name' => $term->display_name_es,
                        'value' => null,
                    ];
                }

                $content[$groupKey]['img'] = [];
                $content[$groupKey]['status'] = 0;
                $content[$groupKey]['user_id'] = null;
                $content[$groupKey]['approved'] = null;
                $content[$groupKey]['status_review'] = 0;
            }

            $testResult = $this->mTestResult->create([
                'test_id' => $test->id,
                'content' => $content,
            ]);

            if ($imageBlob) {
                $now = now();
                $imageId = DB::table('images')->insertLob([
                    'test_result_id' => $testResult->id,
                    'test_type'      => 'test_request',
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ], [
                    'image' => $imageBlob,
                ], 'id');

                $testRequest->image_id = $imageId;
                $testRequest->save();
            }

            DB::commit();

            $this->sRecentActivity->registerActivity(
                "Nueva solicitud creada",
                "El usuario creó una nueva solicitud de pruebas",
                "success"
            );

            return $testRequest;
        } catch (\Throwable $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Error al crear la solicitud: ' . $e->getMessage(),
            ]);
        }
    }

    public function updateTest(int $id, array $data)
    {
        DB::beginTransaction();

        try {
            $testRequest = $this->mTestRequest
                ->with(['test.results'])
                ->findOrFail($id);
            $washType = $data['wash_type'] ?? null;
            if (is_string($washType) && trim($washType) === '') {
                $washType = null;
            }
            $imageBlob = null;
            if (isset($data['new_image'])) {
                $file = $data['new_image'];
                $image = Image::read($file->getRealPath());
                $image->scaleDown(1600);
                $encoded = $image->encodeByMediaType('image/jpeg', 70);
                $imageBlob = (string) $encoded;
            }

            $testRequest->update([
                'style_id' => $data['style_id'] ?? 0,
                'item'     => $data['item'],
                'notes'    => $data['notes'] ?? null,
                'is_informative' => $data['is_informative'] ?? 0,
                'is_development' => $data['is_development'] ?? 0,
                'wash_type' => $washType,
            ]);

            $test = $testRequest->test()->first();

            if (!$test) {
                $test = $this->mTest->create([
                    'test_request_id' => $testRequest->id,
                ]);
            }

            $existingResult = $test->results()->first();
            $existingContent = $existingResult?->content ?? [];

            $content = [];

            $testTypeIds = $data['test_type_ids'] ?? [];

            foreach ($testTypeIds as $testTypeId) {
                $testType = $this->mTestType::find($testTypeId);
                if (!$testType) {
                    continue;
                }

                $terminologies = $this->mTerminology::where('test_type_id', $testTypeId)->get();

                $groupKey = $testType->name_es ?? $testType->name;
                $content[$groupKey] = [];

                foreach ($terminologies as $term) {
                    $oldValue = $existingContent[$groupKey][$term->id]['value'] ?? null;

                    $content[$groupKey][$term->id] = [
                        'label'        => $term->name,
                        'display_name' => $term->display_name_es,
                        'value'        => $oldValue,
                    ];
                }

                $content[$groupKey]['img'] = $existingContent[$groupKey]['img'] ?? [];
            }

            if ($existingResult) {
                $existingResult->update([
                    'content' => $content,
                ]);
                $testResult = $existingResult;
            } else {
                $testResult = $this->mTestResult->create([
                    'test_id' => $test->id,
                    'content' => $content,
                ]);
            }

            if ($imageBlob) {
                if ($testRequest->image_id) {
                    DB::table('images')->where('id', $testRequest->image_id)->delete();
                }

                $now = now();
                $imageId = DB::table('images')->insertLob([
                    'test_result_id' => $testResult->id,
                    'test_type'      => 'test_request',
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ], [
                    'image' => $imageBlob,
                ], 'id');

                $testRequest->image_id = $imageId;
                $testRequest->save();
            }

            DB::commit();

            $this->sRecentActivity->registerActivity(
                "Solicitud actualizada",
                "El usuario actualizó la solicitud de pruebas #{$testRequest->number}",
                "primary"
            );

            return $testRequest->fresh([
                'test.results',
                'style',
                'style.provider',
                'style.department',
                'style.externalTests',
            ]);
        } catch (\Throwable $e) {
            DB::rollBack();
            throw ValidationException::withMessages([
                'error' => 'Error al actualizar la solicitud: ' . $e->getMessage(),
            ]);
        }
    }

    public function generateTestNumber()
    {
        $max = $this->mTestRequest
            ->selectRaw('COUNT(*) as count')
            ->whereRaw('EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM SYSDATE)')
            ->first();
        return 'CCP0' . date('Y') . '' . date('m') . '' . ($max->count + 1);
    }

    public function getTestRequestStats()
    {
        $now = now();

        // Conteo actual
        $total = $this->mTestRequest->count();
        $inProgress = $this->mTestRequest->where('status', $this->mTestRequest::STATUS['IN_PROGRESS'])->count();
        $pendingReview = $this->mTestRequest->where('status', $this->mTestRequest::STATUS['PENDING_REVIEW'])->count();
        $approved = $this->mTestRequest->where('status', $this->mTestRequest::STATUS['APPROVED'])->count();
        $rejected = $this->mTestRequest->where('status', $this->mTestRequest::STATUS['REJECTED'])->count();

        // Mes pasado
        $lastMonth = $now->copy()->subMonth();

        $totalLastMonth = $this->mTestRequest
            ->whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->count();

        $finishedLastMonth = $this->mTestRequest
            ->where('status', 1)
            ->whereMonth('created_at', $lastMonth->month)
            ->whereYear('created_at', $lastMonth->year)
            ->count();

        // Semana pasada (para pendientes)
        $pendingLastWeek = $this->mTestRequest
            ->where('status', 0)
            ->whereBetween('created_at', [
                $now->copy()->subWeek()->startOfWeek(),
                $now->copy()->subWeek()->endOfWeek()
            ])
            ->count();

        return [
            'total' => $total,
            'in_progress' => $inProgress,
            'pending_review' => $pendingReview,
            'approved' => $approved,
            'rejected' => $rejected,

            // Variaciones
            'total_variation' => $this->variationCalc($totalLastMonth, $total),
            'in_progress_variation' => $this->variationCalc($pendingLastWeek, $inProgress),
            'pending_review_variation' => $this->variationCalc($totalLastMonth, $pendingReview),
            'approved_variation' => $this->variationCalc($finishedLastMonth, $approved),
            'rejected_variation' => $this->variationCalc($finishedLastMonth, $rejected),
        ];
    }

    private function variationCalc($prev, $current)
    {
        if ($prev == 0) return 0;
        return round((($current - $prev) / $prev) * 100, 1);
    }

    public function sendTest($id, $assignated_to)
    {
        $test = $this->mTestRequest->findOrFail($id);
        $test->status = $this->mTestRequest::STATUS['IN_PROGRESS'];
        $test->assignated_to = $assignated_to;
        $test->save();
        $test->loadMissing(['technician', 'test']);

        try {
            event(new TestRequestAssigned(
                test: $test,
                message: sprintf('Solicitud #%s asignada', $test->number ?? $test->id),
                userId: $assignated_to ? (int) $assignated_to : null,
            ));
        } catch (BroadcastException $e) {
        }
    }
}

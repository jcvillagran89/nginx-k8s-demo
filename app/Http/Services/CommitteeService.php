<?php

namespace App\Http\Services;

use App\Models\TestRequest;
use Illuminate\Support\Facades\DB;
use App\Models\Test;
use Illuminate\Validation\ValidationException;
use App\Models\TestResult;
use App\Models\TestType;
use App\Models\Terminology;

class CommitteeService
{
    protected $mTestRequest;
    protected $mTest;
    protected $mTestResult;
    protected $mTestType;
    protected $mTerminology;

    public function __construct()
    {
        $this->mTestRequest = new TestRequest();
        $this->mTest = new Test();
        $this->mTestResult = new TestResult();
        $this->mTestType = new TestType();
        $this->mTerminology = new Terminology();
    }

    public function getAllTestRequest(int $perPage = 10,? string $search = null) 
    {
        $query = $this->mTestRequest
            ->where('in_committee', 1)
            ->whereIn('status', [TestRequest::STATUS['REJECTED'], TestRequest::STATUS['APPROVED_COMMITTEE'], TestRequest::STATUS['REJECTED_COMMITTEE'], TestRequest::STATUS['RE-ENTRY']])
            ->with([
                'test',
                'test.results',
                'style',
                'style.provider',
                'style.department',
                'reviewer:id,name'
            ]);

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

        return $query->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function getTestRequestStats()
    {
        // Conteo actual
        $total = $this->mTestRequest->where('in_committee', 1)->count();
        $totalPending = $this->mTestRequest->where('in_committee', 1)->where('status', TestRequest::STATUS['REJECTED'])->count();
        $totalApproved = $this->mTestRequest->where('in_committee', 1)->where('status', TestRequest::STATUS['APPROVED_COMMITTEE'])->count();
        $rejected = $this->mTestRequest->where('in_committee', 1)->whereIn('status', [$this->mTestRequest::STATUS['REJECTED_COMMITTEE'], TestRequest::STATUS['RE-ENTRY']])->count();
        
        return [
            'total' => $total,
            'pending_review' => $totalPending,
            'approved' => $totalApproved,
            'rejected' => $rejected,
        ];
    }

    public function getTestRequestDetail($id)
    {
        return $this->mTestRequest->where('id', $id)
            ->with(['test', 'test.results', 'style', 'style.provider', 'style.department'])
            ->first();
    }

    public function approveTestRequest($id, $request)
    {
        $testRequest = $this->mTestRequest->findOrFail($id);
        $testRequest->status = $this->mTestRequest::STATUS['APPROVED_COMMITTEE'];
        $testRequest->comment_committee = $request->comment;
        $testRequest->save();
    }

    public function rejectTestRequest($id, $request)
    {
        $testRequest = $this->mTestRequest->findOrFail($id);
        $testRequest->status = $this->mTestRequest::STATUS['REJECTED_COMMITTEE'];
        $testRequest->comment_committee = $request->comment;
        $testRequest->save();
    }

    public function reEntryTestRequest($id, $request)
    {
        DB::beginTransaction();
        try {
            $original = $this->mTestRequest
                ->with(['test.results'])
                ->findOrFail($id);
            $original->status = $this->mTestRequest::STATUS['RE-ENTRY'];
            $original->is_re_entry = 0;
            $original->save();

            $sectionNames = $this->getLastContentSections($original);

            $newContent = $this->buildEmptyContentFromSections($sectionNames);

            $newTestRequest = $this->mTestRequest->create([
                'user_id'         => auth()->id(),
                'style_id'        => $original->style_id,
                'item'            => $original->item,
                'status'          => $this->mTestRequest::STATUS['CREATED'],
                'number'          => $this->generateTestNumber(),
                'notes'           => $original->notes,
                'is_development'  => $original->is_development ?? 0,
                'is_informative'  => $original->is_informative ?? 0,
                'wash_type'       => $original->wash_type,
                'assignated_to'   => $original->assignated_to,
                'in_committee'    => 0,
                'is_re_entry'     => 1
            ]);

            if (!empty($original->image_id)) {
                $newTestRequest->image_id = $original->image_id;
            }

            $newTestRequest->save();

            $newTest = $this->mTest->create([
                'test_request_id' => $newTestRequest->id,
                'started_at'      => null,
                'finished_at'     => null,
            ]);

            $this->mTestResult->create([
                'test_id' => $newTest->id,
                'content' => $newContent,
            ]);

            DB::commit();

            return $newTestRequest->load([
                'test.results',
                'style',
                'style.provider',
                'style.department',
            ]);

        } catch (\Throwable $e) {
            DB::rollBack();

            throw ValidationException::withMessages([
                'error' => 'Error en reingreso: ' . $e->getMessage(),
            ]);
        }
    }

    private function getLastContentSections($testRequest): array
    {
        $tests = $testRequest->test ?? collect();
        $lastTest = $tests->sortByDesc('id')->first();

        $results = $lastTest?->results ?? collect();
        $lastResult = $results->sortByDesc('id')->first();

        $content = $lastResult?->content ?? [];

        if (!is_array($content)) return [];

        return array_keys($content);
    }

    private function buildEmptyContentFromSections(array $sectionNames): array
    {
        $content = [];

        foreach ($sectionNames as $sectionName) {

            $testType = $this->mTestType
                ->where('name_es', $sectionName)
                ->orWhere('name_en', $sectionName)
                ->first();

            if (!$testType) {
                continue;
            }

            $terminologies = $this->mTerminology
                ->where('test_type_id', $testType->id)
                ->get();

            $groupKey = $testType->name_es ?? $testType->name_en;

            $content[$groupKey] = [];

            foreach ($terminologies as $term) {
                $content[$groupKey][$term->id] = [
                    'label'        => $term->name,
                    'display_name' => $term->display_name_es,
                    'value'        => null,
                ];
            }

            $content[$groupKey]['img'] = [];
            $content[$groupKey]['status'] = 0;
            $content[$groupKey]['user_id'] = null;
            $content[$groupKey]['approved'] = null;
        }

        return $content;
    }


    public function generateTestNumber()
    {
        $max = $this->mTestRequest
            ->selectRaw('COUNT(*) as count')
            ->whereRaw('EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM SYSDATE)')
            ->first();
        return 'CCP0' . date('Y') . '' . date('m') . '' . ($max->count + 1);
    }
}

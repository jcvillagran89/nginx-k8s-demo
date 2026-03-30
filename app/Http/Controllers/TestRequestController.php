<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTestRequest;
use App\Http\Services\TestRequestService;
use App\Http\Services\TestTypeService;
use App\Http\Services\UserService;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestRequestController extends Controller
{
    protected $sTestRequest;
    protected $sTestTypes;

    protected $sUsers;

    public function __construct()
    {
        $this->sTestRequest = new TestRequestService();
        $this->sTestTypes = new TestTypeService();
        $this->sUsers = new UserService();
    }

    public function getTestRequest(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        $status = $request->input('status', null);
        $search  = $request->input('q');
        $dateRange = $request->input('date_range');
        $analysts = User::all();
        $stats = $this->sTestRequest->getTestRequestStats();
        $testRequests = $this->sTestRequest->getAllTestRequest(
            $perPage,
            $search,
            $status,
            $dateRange,
        );
        return Inertia::render('test/index', [
            'test_requests' => $testRequests,
            'stats'         => $stats,
            'analysts'      => $analysts,
            'filters'       => [
                'q'          => $search,
                'status'     => $status,
                'per_page'   => $perPage,
                'date_range' => $dateRange,
            ],
        ]);
    }

    public function createTestRequest()
    {
        $testTypes = $this->sTestTypes->getTestTypes();
        return Inertia::render('test/create', [
            'test_types' => $testTypes,
        ]);
    }

    public function editTestRequest($id)
    {
        $testTypes = $this->sTestTypes->getTestTypes();
        $test = $this->sTestRequest->showTestRequest($id);
        return Inertia::render('test/edit', [
            'test_types' => $testTypes,
            'test_request' => $test
        ]);
    }

    public function showTestRequest($id)
    {
        $test = $this->sTestRequest->showTestRequest($id);
        return Inertia::render('test/show', [
            'testRequest' => $test,
        ]);
    }

    public function storeTestRequest(StoreTestRequest $request)
    {
        $data = $request->validated();
        $this->sTestRequest->storeTest($data);
        return redirect()->route('test.request.index')->with('success', 'Solicitud creada correctamente.');
    }

    public function updateTestRequest($id, StoreTestRequest $request)
    {
        $data = $request->validated();
        $this->sTestRequest->updateTest($id, $data);
        return redirect()->route('test.request.index')->with('success', 'Solicitud modificada correctamente.');
    }

    public function sendTestRequest(Request $request, $id)
    {
        $this->sTestRequest->sendTest($id, $request->assignated_to);
        return redirect()->route('test.request.index')->with('success', 'Solicitud enviada correctamente.');
    }
}

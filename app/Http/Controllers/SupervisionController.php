<?php

namespace App\Http\Controllers;

use App\Http\Services\SupervisionService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SupervisionController
{
    protected $sSupervision;

    public function __construct()
    {
        $this->sSupervision = new SupervisionService();
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        $status = $request->input('status', null);
        $search  = $request->input('q');
        $dateRange = $request->input('date_range');
        $stats = $this->sSupervision->getStats();
        $testRequests = $this->sSupervision->getAllTest(
            $perPage,
            $search,
            $status,
            $dateRange,
        );
        return Inertia::render('supervision/index', [
            'tests' => $testRequests,
            'stats'         => $stats,
            'filters'       => [
                'q'          => $search,
                'status'     => $status,
                'per_page'   => $perPage,
                'date_range' => $dateRange,
            ],
        ]);
    }

    public function sendTestToCommittee($id)
    {
        $this->sSupervision->sendToCommittee($id);
        return redirect()->route('supervision.index')
            ->with('success', 'Solicitud enviada a comité correctamente.');
    }

    public function showTest($id)
    {
        $test = $this->sSupervision->getTestById($id);
        return Inertia::render('supervision/show', [
            'testRequest' => $test
        ]);
    }

    public function rejectTest(Request $request)
    {

        $this->sSupervision->rejectTest($request);
        return redirect()->route('supervision.show', $request->test_id)
            ->with('success', 'Test rechazado');
    }

    public function approveTest(Request $request)
    {
        $this->sSupervision->approveTest($request);

        return redirect()->route('supervision.show', $request->test_id)
            ->with('success', 'Test aprobado correctamente.');
    }

    public function rejectTestRequest(Request $request)
    {
        $this->sSupervision->rejectTestRequest($request);
        return redirect()->route('supervision.index')
            ->with('success', 'Solicitud de muestra rechazado');
    }

    public function approveTestRequest(Request $request)
    {
        $this->sSupervision->approveTestRequest($request);

        return redirect()->route('supervision.index')
            ->with('success', 'Solicitud de muestra aprobada correctamente.');
    }

    public function selectImage(Request $request)
    {
        $this->sSupervision->selectImage($request);

        return redirect()->route('supervision.show', $request->test_id)
            ->with('success', 'Informacion guardada correctamente.');
    }

    public function returnTest(Request $request)
    {
        $this->sSupervision->returnTest($request->test_request_id);

        return redirect()->route('supervision.index')
            ->with('success', 'Test regresado correctamente.');
    }
}

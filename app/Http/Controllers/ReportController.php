<?php

namespace App\Http\Controllers;
use App\Http\Services\ReportService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReportController
{

    protected $sReport;

    public function __construct()
    {
        $this->sReport = new ReportService();
    }

    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        $status = $request->input('status', null);
        $search  = $request->input('q');
        $dateRange = $request->input('date_range');
        $stats = $this->sReport->getStats();
        $testRequests = $this->sReport->getAllTest(
            $perPage,
            $search,
            $status,
            $dateRange,
        );
        return Inertia::render('reports/index', [
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

    public function preview($id, Request $request)
    {
        return $this->sReport->preview($id, $request);
    }

    public function send($id)
    {
        $this->sReport->sendToProvider($id);
        return back()->with('success', 'Reporte enviado');
    }

}

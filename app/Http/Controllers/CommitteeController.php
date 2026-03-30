<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Services\CommitteeService;

class CommitteeController extends Controller
{
    protected $sCommittee;

    public function __construct()
    {
        $this->sCommittee = new CommitteeService();
    }

    /**
     * Display the committee index page.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        $search  = $request->input('q');
        $stats = $this->sCommittee->getTestRequestStats();
        $testResults = $this->sCommittee->getAllTestRequest(
            $perPage,
            $search
        );
        return Inertia::render('committee/index', [
            'testResults' => $testResults,
            'stats'         => $stats,
            'filters'       => [
                'q'          => $search,
                'per_page'   => $perPage
            ]
        ]);
    }

    public function detail($committee)
    {
        $testResult = $this->sCommittee->getTestRequestDetail($committee);
        return Inertia::render('committee/detail', [
            'testResult' => $testResult,
        ]);
    }

    public function approveTestRequest(Request $request, $committee)
    {
        $this->sCommittee->approveTestRequest($committee, $request);
        return back()->with('success', 'Solicitud aprobada');
    }
    
    public function rejectTestRequest(Request $request, $committee)
    {
        $this->sCommittee->rejectTestRequest($committee, $request);
        return back()->with('success', 'Solicitud rechazada');
    }

    public function reEntryTestRequest(Request $request, $committee)
    {
        $this->sCommittee->reEntryTestRequest($committee, $request);
        return back()->with('success', 'Solicitud en reingreso');
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Services\ExternalTestService;
use App\Http\Services\TestImportService;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Inertia\Inertia;

class ExternalTestController extends Controller
{
    protected ExternalTestService $sExternalTest;
    protected TestImportService $sTestImport;

    public function __construct()
    {
        $this->sExternalTest = new ExternalTestService();
        $this->sTestImport = new TestImportService();
    }

    public function index(Request $request)
    {
        $dateRange = $request->input('date_range');
        if (! $request->has('date_range')) {
            $from = Carbon::now()->subDays(6)->startOfDay();
            $to = Carbon::now()->endOfDay();
            $dateRange = $from->format('d/m/Y') . ' a ' . $to->format('d/m/Y');
            $request->merge(['date_range' => $dateRange]);
        }

        $externalTests = $this->sExternalTest->getExternalTests($request);

        return Inertia::render('tests/index', [
            'layoutColumns' => $this->sTestImport->getLayoutColumns(),
            'externalTests' => $externalTests,
            'filters' => [
                'lab' => $request->input('lab'),
                'date_range' => $dateRange,
                'status' => $request->input('status'),
                'cloth_provider' => $request->input('cloth_provider'),
                'style_number' => $request->input('style_number'),
                'miscellaneous' => $request->input('miscellaneous'),
                'per_page' => $request->input('per_page', 100),
            ],
        ]);
    }
}

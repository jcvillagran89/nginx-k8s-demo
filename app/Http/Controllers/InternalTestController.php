<?php

namespace App\Http\Controllers;

use App\Http\Services\InternalTestExportService;
use App\Http\Services\InternalTestImportService;
use App\Http\Services\InternalTestService;
use App\Jobs\ImportInternalTestsFromLayout;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InternalTestController extends Controller
{
    protected InternalTestService $sInternalTest;
    protected InternalTestImportService $sInternalImport;
    protected InternalTestExportService $sInternalExport;

    public function __construct()
    {
        $this->sInternalTest = new InternalTestService();
        $this->sInternalImport = new InternalTestImportService();
        $this->sInternalExport = new InternalTestExportService();
    }

    public function index(Request $request)
    {
        $internalTests = $this->sInternalTest->getInternalTests($request);

        return Inertia::render('internal-tests/index', [
            'layoutColumns' => $this->sInternalImport->getLayoutColumns(),
            'internalTests' => $internalTests,
            'filters' => [
                'codigo' => $request->input('codigo'),
                'date_range' => $request->input('date_range'),
                'style_number' => $request->input('style_number'),
                'department' => $request->input('department'),
                'status_final' => $request->input('status_final'),
                'per_page' => $request->input('per_page', 100),
            ],
        ]);
    }

    public function upload(Request $request)
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls,xlsm'],
        ]);

        $storedPath = $this->sInternalImport->storeUpload($validated['file']);
        ImportInternalTestsFromLayout::dispatch(
            $storedPath,
            (int) auth()->id(),
            $validated['file']->getClientOriginalName()
        );

        return redirect()->route('internal-tests.index')
            ->with('success', 'Archivo en cola para procesar. Te avisaremos al finalizar.');
    }

    public function export(Request $request)
    {
        $filters = $request->only([
            'codigo',
            'date_range',
            'style_number',
            'department',
            'status_final',
        ]);

        $filePath = $this->sInternalExport->exportInternalTests($filters);
        $fileName = 'internal-tests-' . now()->format('Ymd_His') . '.xlsx';

        return response()
            ->download($filePath, $fileName, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])
            ->deleteFileAfterSend(true);
    }
}

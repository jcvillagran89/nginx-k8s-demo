<?php

namespace App\Http\Controllers;

use App\Http\Services\ExternalTestExportService;
use App\Http\Services\TestImportService;
use App\Jobs\ImportStylesFromLayout;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TestImportController extends Controller
{
    protected TestImportService $sTestImport;
    protected ExternalTestExportService $sTestExport;

    public function __construct()
    {
        $this->sTestImport = new TestImportService();
        $this->sTestExport = new ExternalTestExportService();
    }

    public function index()
    {
        return Inertia::render('tests/index', [
            'layoutColumns' => $this->sTestImport->getLayoutColumns(),
        ]);
    }

    public function upload(Request $request)
    {
        $validated = $request->validate([
            'file' => ['required', 'file', 'mimes:xlsx,xls'],
        ]);

        $storedPath = $this->sTestImport->storeUpload($validated['file']);
        ImportStylesFromLayout::dispatch(
            $storedPath,
            (int) auth()->id(),
            $validated['file']->getClientOriginalName()
        );

        return redirect()->route('external-tests.index')
            ->with('success', 'Archivo en cola para procesar. Te avisaremos al finalizar.');
    }

    public function export(Request $request)
    {
        $filters = $request->only([
            'lab',
            'date_range',
            'status',
            'cloth_provider',
            'style_number',
            'miscellaneous',
        ]);

        $filePath = $this->sTestExport->exportExternalTestsLayoutA($filters);
        $fileName = 'external-tests-layout-a-' . now()->format('Ymd_His') . '.xlsx';

        return response()
            ->download($filePath, $fileName, [
                'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            ])
            ->deleteFileAfterSend(true);
    }
}

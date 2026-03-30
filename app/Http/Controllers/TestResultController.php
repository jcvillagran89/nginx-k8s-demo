<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Services\TestResultService;
use App\Models\Test;
use Illuminate\Support\Facades\DB;
use Intervention\Image\Laravel\Facades\Image;

class TestResultController extends Controller
{
    protected $sTestResult;

    public function __construct()
    {
        $this->sTestResult = new TestResultService();
    }
    /**
     * Obtener todos los test para analisis
     */
    public function getTest(Request $request)
    {
        $testResults = $this->sTestResult->getAllTest($request);
        $stats       = $this->sTestResult->getStats();

        return Inertia::render('test-results/index', [
            'testResults' => $testResults,
            'stats'       => $stats,
            'filters'     => $request->only('q', 'per_page', 'status', 'date_range'),
        ]);
    }

    /**
     * Obtener detalle de un test para analisis
     */
    public function getTestDetail($test)
    {
        $testResult = $this->sTestResult->getTestDetail($test);

        return Inertia::render('test-results/detail', [
            'testResult' => $testResult
        ]);
    }

    public function startSection(int $testId, string $section)
    {
        $testResult = $this->sTestResult->startSection($testId, $section);
        $result     = $testResult->results->first();
        $content    = $result?->content ?? [];
        $sectionData = $content[$section] ?? [];

        $sectionImages = DB::table('images')
            ->select('id', 'created_at')
            ->where('test_result_id', $testId)
            ->where('test_type', $section)
            ->orderBy('id')
            ->get()
            ->map(function ($image) {
                return [
                    'id'          => $image->id,
                    'url'         => route('test-results.images.show', ['image' => $image->id]),
                    'uploaded_at' => $image->created_at
                        ? \Illuminate\Support\Carbon::parse($image->created_at)->toISOString()
                        : null,
                ];
            })
            ->all();

        $sectionData['img'] = $sectionImages;

        return Inertia::render('test-results/section-form', [
            'test' => [
                'id'           => $testResult->id,
                'number'       => $testResult->testRequest->number,
                'item'         => $testResult->testRequest->item,
                'notes'        => $testResult->testRequest->notes,
                'wash_type'    => $testResult->testRequest->wash_type,
                'requested_by' => $testResult->testRequest->user->name,
            ],
            'sectionName' => $section,
            'sectionData' => $sectionData,
        ]);
    }

    public function updateSection(Request $request, $testId, $sectionKey)
    {
        $validated = $request->validate([
            'fields'   => ['required', 'array'],
            'fields.*' => ['nullable', 'string'],
            'images'   => ['sometimes', 'array'],
            'images.*' => ['file', 'image', 'max:5120'],
            'deleted_images' => ['sometimes', 'array'],
            'deleted_images.*' => ['string'],
        ]);

        $newImages = [];
        $deletedImageIds = $validated['deleted_images'] ?? [];

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $file) {
                $image = Image::read($file->getRealPath());
                $image->scaleDown(1600);
                $encoded = $image->encodeByMediaType('image/jpeg', 70);

                $now = now();
                $imageId = DB::table('images')->insertLob([
                    'test_result_id' => (int) $testId,
                    'test_type'      => (string) $sectionKey,
                    'created_at'     => $now,
                    'updated_at'     => $now,
                ], [
                    'image' => (string) $encoded,
                ], 'id');

                $newImages[] = [
                    'id'          => $imageId,
                    'uploaded_at' => $now->toISOString(),
                ];
            }
        }

        $this->sTestResult->updateSection(
            (int) $testId,
            (string) $sectionKey,
            $validated['fields'],
            $newImages,
            $deletedImageIds
        );

        return redirect()
            ->route('test-results.detail', ['test' => $testId])
            ->with('success', 'Se guardaron los datos de la sección.');
    }

    public function finishInitial(Request $request, Test $test)
    {
        $this->sTestResult->finishInitialSection($test);

        return redirect()
            ->route('test-results.detail', ['test' => $test->id])
            ->with('success', 'Datos iniciales marcados como completados.');
    }

    public function finishSection(Request $request, int $test)
    {
        $section = $request->input('section');

        $this->sTestResult->finishSection($test, $section);

        return redirect()
            ->route('test-results.detail', ['test' => $test])
            ->with('success', "La sección {$section} se marcó como terminada.");
    }

    public function submitReview(int $id)
    {
        $this->sTestResult->submitReview($id);
        return back()->with('success', 'Enviado a revisión');
    }

    public function showImage(int $imageId)
    {
        $image = DB::table('images')
            ->select('image')
            ->where('id', $imageId)
            ->first();

        if (! $image || ! $image->image) {
            abort(404);
        }

        return response($image->image, 200, [
            'Content-Type' => 'image/jpeg',
            'Cache-Control' => 'public, max-age=604800',
        ]);
    }
}

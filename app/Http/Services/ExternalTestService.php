<?php

namespace App\Http\Services;

use App\Models\ExternalTest;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ExternalTestService
{
    public function getExternalTests(Request $request)
    {
        $perPage = (int) $request->input('per_page', 100);
        $lab = $request->input('lab');
        $dateRange = $request->input('date_range');
        $status = $request->input('status');
        $clothProvider = $request->input('cloth_provider');
        $styleNumber = $request->input('style_number');
        $miscellaneous = $request->input('miscellaneous');

        $query = ExternalTest::query()
            ->leftJoin('styles', 'styles.id', '=', 'external_tests.style_id')
            ->select('external_tests.*', 'styles.order_id as order_id');

        if ($lab !== null && $lab !== '') {
            $labValue = mb_strtolower($lab);
            $query->whereRaw('LOWER(external_tests.lab) LIKE ?', ["%{$labValue}%"]);
        }

        if ($dateRange !== null && $dateRange !== '') {
            $parts = explode(' a ', $dateRange);

            try {
                if (count($parts) === 2) {
                    $from = Carbon::createFromFormat('d/m/Y', trim($parts[0]))->startOfDay();
                    $to = Carbon::createFromFormat('d/m/Y', trim($parts[1]))->endOfDay();
                    $query->whereBetween('reported_at', [$from, $to]);
                } else {
                    $single = Carbon::createFromFormat('d/m/Y', trim($dateRange))->startOfDay();
                    $query->whereDate('reported_at', $single);
                }
            } catch (\Throwable $e) {
            }
        }

        if ($status !== null && $status !== '') {
            $statusValue = mb_strtolower($status);
            $query->whereRaw('LOWER(external_tests.status) LIKE ?', ["%{$statusValue}%"]);
        }

        if ($clothProvider !== null && $clothProvider !== '') {
            $clothValue = mb_strtolower($clothProvider);
            $query->where(function ($q) use ($clothValue) {
                $q->whereRaw('LOWER(external_tests.cloth_provider) LIKE ?', ["%{$clothValue}%"])
                    ->orWhereRaw('LOWER(external_tests.provider) LIKE ?', ["%{$clothValue}%"]);
            });
        }

        if ($styleNumber !== null && $styleNumber !== '') {
            $query->where('style_number', 'like', "%{$styleNumber}%");
        }

        if ($miscellaneous !== null && $miscellaneous !== '') {
            $miscValue = mb_strtolower($miscellaneous);
            $query->where(function ($q) use ($miscValue) {
                $q->whereRaw('LOWER(external_tests.action_taken) LIKE ?', ["%{$miscValue}%"])
                    ->orWhereRaw('LOWER(external_tests.rejected_1) LIKE ?', ["%{$miscValue}%"])
                    ->orWhereRaw('LOWER(external_tests.rejected_2) LIKE ?', ["%{$miscValue}%"])
                    ->orWhereRaw('LOWER(external_tests.rejected_3) LIKE ?', ["%{$miscValue}%"])
                    ->orWhereRaw('LOWER(external_tests.rejected_4) LIKE ?', ["%{$miscValue}%"])
                    ->orWhereRaw('LOWER(external_tests.rejected_5) LIKE ?', ["%{$miscValue}%"])
                    ->orWhereRaw('LOWER(external_tests.rejected_6) LIKE ?', ["%{$miscValue}%"]);
            });
        }

        return $query
            ->orderByDesc('external_tests.reported_at')
            ->orderByDesc('external_tests.id')
            ->paginate($perPage)
            ->withQueryString();
    }
}

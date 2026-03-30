<?php

namespace App\Http\Services;

use App\Models\InternalTest;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class InternalTestService
{
    public function getInternalTests(Request $request)
    {
        $perPage = (int) $request->input('per_page', 100);
        $dateRange = $request->input('date_range');
        $styleNumber = $request->input('style_number');
        $department = $request->input('department');
        $statusFinal = $request->input('status_final');
        $codigo = $request->input('codigo');

        $query = InternalTest::query();

        if ($styleNumber !== null && $styleNumber !== '') {
            $value = mb_strtolower($styleNumber);
            $query->whereRaw('LOWER(style_number) LIKE ?', ["%{$value}%"]);
        }

        if ($department !== null && $department !== '') {
            $value = mb_strtolower($department);
            $query->whereRaw('LOWER(departamento) LIKE ?', ["%{$value}%"]);
        }

        if ($statusFinal !== null && $statusFinal !== '') {
            $value = mb_strtolower($statusFinal);
            $query->whereRaw('LOWER(status_final) LIKE ?', ["%{$value}%"]);
        }

        if ($codigo !== null && $codigo !== '') {
            $query->where(function ($q) use ($codigo) {
                $q->where('codigo', 'like', "%{$codigo}%")
                    ->orWhere('codigo_num', 'like', "%{$codigo}%");
            });
        }

        if ($dateRange !== null && $dateRange !== '') {
            $parts = explode(' a ', $dateRange);

            try {
                if (count($parts) === 2) {
                    $from = Carbon::createFromFormat('d/m/Y', trim($parts[0]))->startOfDay();
                    $to = Carbon::createFromFormat('d/m/Y', trim($parts[1]))->endOfDay();
                    $query->whereBetween('fecha', [$from, $to]);
                } else {
                    $single = Carbon::createFromFormat('d/m/Y', trim($dateRange))->startOfDay();
                    $query->whereDate('fecha', $single);
                }
            } catch (\Throwable $e) {
            }
        }

        return $query
            ->orderByDesc('fecha')
            ->orderByDesc('id')
            ->paginate($perPage)
            ->withQueryString();
    }
}

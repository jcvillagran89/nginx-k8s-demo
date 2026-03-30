<?php

namespace App\Http\Services;

use App\Models\Sku;
use App\Models\Division;
use App\Models\Department;
use App\Models\Provider;
use App\Models\Style;

class CatalogueService
{
    // ======================
    // SKUS
    // ======================

    public function findSkuByNumber(string $number)
    {
        $number = trim($number);

        $sku = Sku::where('NUMBER', $number)
            ->with(['style', 'style.department', 'style.provider', 'style.externalTests', 'style.internalTests'])
            ->first();

        if ($sku) {
            return $sku;
        }

        $normalizedNumber = $this->normalizeNumericIdentifier($number);
        if ($normalizedNumber === $number) {
            return null;
        }

        return Sku::where('NUMBER', $normalizedNumber)
            ->with(['style', 'style.department', 'style.provider', 'style.externalTests', 'style.internalTests'])
            ->first();
    }

    // ======================
    // STYLES
    // ======================

    public function findStyleByNumber(string $number): ?Style
    {
        $number = trim($number);

        $style = Style::where('NUMBER', $number)
            ->with(['department', 'provider', 'externalTests', 'internalTests'])
            ->first();

        if ($style) {
            return $style;
        }

        $normalizedNumber = $this->normalizeNumericIdentifier($number);
        if ($normalizedNumber === $number) {
            return null;
        }

        return Style::where('NUMBER', $normalizedNumber)
            ->with(['department', 'provider', 'externalTests', 'internalTests'])
            ->first();
    }

    private function normalizeNumericIdentifier(string $value): string
    {
        if (!preg_match('/^\d+$/', $value)) {
            return $value;
        }

        $normalized = ltrim($value, '0');

        return $normalized === '' ? '0' : $normalized;
    }

    // ======================
    // DIVISIONS
    // ======================

    public function allDivisions()
    {
        return Division::orderBy('NAME')->get(['ID', 'CODE', 'NAME']);
    }

    public function findDivisionByCode(string $code): ?Division
    {
        return Division::where('CODE', $code)->first();
    }

    // ======================
    // DEPARTMENTS
    // ======================

    public function allDepartments()
    {
        return Department::orderBy('NAME')->get(['ID', 'CODE', 'NAME', 'DIVISION_ID']);
    }

    public function findDepartmentByCode(string $code): ?Department
    {
        return Department::where('CODE', $code)->first();
    }

    // ======================
    // PROVIDERS
    // ======================

    public function allProviders()
    {
        return Provider::orderBy('NAME')->get(['ID', 'CODE', 'NAME']);
    }

    public function findProviderByCode(string $code): ?Provider
    {
        return Provider::where('CODE', $code)->first();
    }
}

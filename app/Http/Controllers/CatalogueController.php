<?php

namespace App\Http\Controllers;

use App\Http\Services\CatalogueService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogueController extends Controller
{
    protected CatalogueService $catalogues;

    public function __construct(CatalogueService $catalogues)
    {
        $this->catalogues = $catalogues;
    }

    // ======================
    // SKUS
    // ======================

    public function showItem(string $number)
    {
        $sku = $this->catalogues->findSkuByNumber($number);

        if (!$sku) {
            $style = $this->catalogues->findStyleByNumber($number);
            if (!$style) {
                return response()->json([
                    'message' => 'SKU no encontrado',
                ], 404);
            }
            return response()->json($style);
        }

        return response()->json($sku);
    }
}

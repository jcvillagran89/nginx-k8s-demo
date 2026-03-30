<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProviderRequest;
use App\Http\Requests\UpdateProviderRequest;
use App\Http\Services\ProviderService;
use App\Models\Provider;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProviderController extends Controller
{
    protected $sProvider;

    public function __construct()
    {
        $this->sProvider = new ProviderService();
    }

    public function getProviders(Request $request)
    {
        $perPage = (int) $request->input('per_page', 10);
        $search  = $request->input('q');
        $providers = $this->sProvider->getProviders($perPage, $search);
        return Inertia::render('providers/index', [
            'providers' => $providers,
            'filters' => [
                'q' => $search,
                'per_page' => $perPage
            ]
        ]);
    }

    public function store(StoreProviderRequest $request)
    {
        $data = $request->validated();
        $this->sProvider->createProvider($data);
        return back()->with('success', 'Proveedor creado');
    }

    public function update(UpdateProviderRequest $request, Provider $provider)
    {
        $data = $request->validated();
        $this->sProvider->updateProvider($provider, $data);
        return back()->with('success', 'Proveedor actualizado correctamente');
    }

    public function destroy(Provider $provider)
    {
        $this->sProvider->softDeleteProvider($provider);
        return back()->with('success', 'Proveedor eliminado correctamente');
    }
}

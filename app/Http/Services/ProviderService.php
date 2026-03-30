<?php

namespace App\Http\Services;

use App\Models\Provider;
use Illuminate\Support\Facades\DB;

class ProviderService
{
    protected $mProvider;

    public function __construct()
    {
        $this->mProvider = new Provider();
    }

    public function getProviders(int $perPage = 10, ?string $search = null)
    {
        $q = $this->mProvider->query();

        if ($search) {

            $search = strtolower(trim($search));

            $q->where(function ($qq) use ($search) {

                $qq->whereRaw('LOWER(TRIM(name)) LIKE ?', ["%{$search}%"])
                ->orWhere('number', 'like', "%{$search}%");

            });
        }
        return $q->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }

    public function createProvider(array $data)
    {
        return DB::transaction(function () use ($data) {

            $nextId = DB::table('PROVIDERS')->max('ID') + 1;

            return DB::table('PROVIDERS')->insert([
                'ID' => $nextId,
                'NAME' => $data['name'],
                'NUMBER' => $data['number'],
                'EMAILS' => json_encode($data['emails'] ?? []),
                'CREATED_AT' => now(),
                'UPDATED_AT' => now(),
            ]);
        });
    }

    public function updateProvider(Provider $provider, array $data): Provider
    {
        return DB::transaction(function () use ($provider, $data) {
            $payload = [
                'name'  => $data['name'],
                'number' => $data['number'],
                'emails' => $data['emails'] ?? [],
            ];
            $provider->update($payload);
            return $provider->refresh();
        });
    }

    public function softDeleteProvider(Provider $provider): void
    {
        DB::transaction(function () use ($provider) {
            $provider->delete();
        });
    }
}

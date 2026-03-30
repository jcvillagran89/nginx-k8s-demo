<?php

namespace App\Http\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MicrosoftGraphService
{
    public function getAccessToken(): string
    {
        $tenantId = config('services.microsoft.tenant_id');
        $clientId = config('services.microsoft.client_id');
        $clientSecret = config('services.microsoft.client_secret');
        $refreshToken = config('services.microsoft.refresh_token');

        if (! $tenantId || ! $clientId || ! $clientSecret || ! $refreshToken) {
            throw new \RuntimeException('Microsoft OAuth configuration is incomplete.');
        }

        $response = Http::asForm()->post("https://login.microsoftonline.com/{$tenantId}/oauth2/v2.0/token", [
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken,
            'scope' => 'offline_access Files.Read Sites.Read.All',
        ]);

        if (! $response->ok()) {
            $details = $response->json();
            if (($details['error'] ?? null) === 'invalid_grant') {
                throw new \RuntimeException('Refresh token inválido o expirado. Requiere reautenticación.');
            }

            throw new \RuntimeException('No se pudo obtener el access token de Microsoft.');
        }

        $token = $response->json('access_token');
        if (! $token) {
            throw new \RuntimeException('Microsoft no devolvió access token.');
        }

        return $token;
    }

    public function getDriveItemFromShareLink(string $shareLink): array
    {
        $accessToken = $this->getAccessToken();
        $shareId = $this->encodeShareLink($shareLink);

        $response = Http::withToken($accessToken)
            ->get("https://graph.microsoft.com/v1.0/shares/{$shareId}/driveItem");

        if (! $response->ok()) {
            throw new \RuntimeException('No se pudo acceder al archivo en SharePoint.');
        }

        return $response->json();
    }

    public function downloadShareFile(string $shareLink): string
    {
        $accessToken = $this->getAccessToken();
        $shareId = $this->encodeShareLink($shareLink);

        $response = Http::withToken($accessToken)
            ->get("https://graph.microsoft.com/v1.0/shares/{$shareId}/driveItem/content");

        if (! $response->ok()) {
            throw new \RuntimeException('No se pudo descargar el archivo desde SharePoint.');
        }

        $filename = 'sharepoint-import-' . Str::uuid() . '.xlsx';
        $stored = Storage::disk('local')->put("imports/{$filename}", $response->body());

        if (! $stored) {
            throw new \RuntimeException('No se pudo guardar el archivo descargado.');
        }

        return Storage::disk('local')->path("imports/{$filename}");
    }

    private function encodeShareLink(string $shareLink): string
    {
        $encoded = base64_encode($shareLink);
        $encoded = rtrim($encoded, '=');
        $encoded = strtr($encoded, '+/', '-_');

        return 'u!' . $encoded;
    }
}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class MicrosoftAuthController extends Controller
{
    public function checkShareAccess()
    {
        $tenantId = config('services.microsoft.tenant_id');
        $clientId = config('services.microsoft.client_id');
        $clientSecret = config('services.microsoft.client_secret');
        $refreshToken = config('services.microsoft.refresh_token');
        $shareLink = config('services.microsoft.share_link');

        if (!$tenantId || !$clientId || !$clientSecret || !$refreshToken || !$shareLink) {
            return response()->json([
                'error' => 'missing_config',
                'message' => 'Microsoft OAuth configuration is incomplete.',
            ], 500);
        }

        $tokenResponse = Http::asForm()->post("https://login.microsoftonline.com/{$tenantId}/oauth2/v2.0/token", [
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'grant_type' => 'refresh_token',
            'refresh_token' => $refreshToken,
            'scope' => 'offline_access Files.Read Sites.Read.All',
        ]);

        if (!$tokenResponse->ok()) {
            return response()->json([
                'error' => 'token_exchange_failed',
                'details' => $tokenResponse->json(),
            ], $tokenResponse->status());
        }

        $accessToken = $tokenResponse->json('access_token');
        if (!$accessToken) {
            return response()->json([
                'error' => 'missing_access_token',
                'message' => 'Access token not returned by Microsoft.',
            ], 500);
        }

        $shareId = $this->encodeShareLink($shareLink);

        $fileResponse = Http::withToken($accessToken)
            ->get("https://graph.microsoft.com/v1.0/shares/{$shareId}/driveItem");

        if (!$fileResponse->ok()) {
            return response()->json([
                'error' => 'share_access_denied',
                'details' => $fileResponse->json(),
            ], $fileResponse->status());
        }

        $item = $fileResponse->json();

        return response()->json([
            'has_access' => true,
            'name' => $item['name'] ?? null,
            'size' => $item['size'] ?? null,
            'last_modified' => $item['lastModifiedDateTime'] ?? null,
        ]);
    }

    public function callback(Request $request)
    {
        $error = $request->query('error');
        $code = $request->query('code');

        if ($error) {
            return response()->json([
                'error' => $error,
                'error_description' => $request->query('error_description'),
            ], 400);
        }

        if (!$code) {
            return response()->json([
                'error' => 'missing_code',
                'message' => 'No authorization code was provided.',
            ], 400);
        }

        $tenantId = config('services.microsoft.tenant_id');
        $clientId = config('services.microsoft.client_id');
        $clientSecret = config('services.microsoft.client_secret');
        $redirectUri = config('services.microsoft.redirect');

        if (!$tenantId || !$clientId || !$clientSecret || !$redirectUri) {
            return response()->json([
                'error' => 'missing_config',
                'message' => 'Microsoft OAuth configuration is incomplete.',
            ], 500);
        }

        $response = Http::asForm()->post("https://login.microsoftonline.com/{$tenantId}/oauth2/v2.0/token", [
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'grant_type' => 'authorization_code',
            'code' => $code,
            'redirect_uri' => $redirectUri,
            'scope' => 'offline_access Files.Read Sites.Read.All',
        ]);

        if (!$response->ok()) {
            return response()->json([
                'error' => 'token_exchange_failed',
                'details' => $response->json(),
            ], $response->status());
        }

        $payload = $response->json();

        return response()->json([
            'refresh_token' => $payload['refresh_token'] ?? null,
            'expires_in' => $payload['expires_in'] ?? null,
            'token_type' => $payload['token_type'] ?? null,
        ]);
    }

    private function encodeShareLink(string $shareLink): string
    {
        $encoded = base64_encode($shareLink);
        $encoded = rtrim($encoded, '=');
        $encoded = strtr($encoded, '+/', '-_');

        return 'u!' . $encoded;
    }

    public function getAccessToken(): string
    {
        $tenantId = config('services.microsoft-mail.tenant_id');
        $clientId = config('services.microsoft-mail.client_id');
        $clientSecret = config('services.microsoft-mail.client_secret');

        if (! $tenantId || ! $clientId || ! $clientSecret) {
            throw new \RuntimeException('Microsoft OAuth configuration is incomplete.');
        }

        $response = Http::asForm()->post("https://login.microsoftonline.com/{$tenantId}/oauth2/v2.0/token", [
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'grant_type' => 'client_credentials',
            'scope' => 'https://graph.microsoft.com/.default',
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

    public function sendMail($toEmails, $subject, $htmlBody, $filePath)
    {
        $accessToken = $this->getAccessToken();

        $attachments = [];

        if ($filePath && file_exists($filePath)) {
            $attachments[] = [
                "@odata.type" => "#microsoft.graph.fileAttachment",
                "name" => basename($filePath),
                "contentType" => "application/pdf",
                "contentBytes" => base64_encode(file_get_contents($filePath))
            ];
        }

        $logoPath = public_path('logo-ccp-full.png');
        $attachments[] = [
            "@odata.type" => "#microsoft.graph.fileAttachment",
            "name" => "logo.png",
            "contentType" => "image/png",
            "contentId" => "logo",
            "isInline" => true,
            "contentBytes" => base64_encode(file_get_contents($logoPath))
        ];

        $recipients = collect($toEmails)->map(function ($email) {
            return [
                "emailAddress" => [
                    "address" => $email
                ]
            ];
        })->toArray();

        $body = [
            "message" => [
                "subject" => $subject,
                "body" => [
                    "contentType" => "HTML",
                    "content" => $htmlBody
                ],
                "toRecipients" => $recipients,
                "attachments" => $attachments
            ]
        ];

        $sender = config('services.microsoft-mail.mail_from');

        $response = Http::withToken($accessToken)
            ->post("https://graph.microsoft.com/v1.0/users/{$sender}/sendMail", $body);

        if (!$response->successful()) {
            throw new \Exception("Error enviando correo: ".$response->body());
        }

        return true;
    }
}

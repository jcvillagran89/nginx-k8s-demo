<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class StyleImageController extends Controller
{
    public function show(string $number)
    {
        $baseUrl = config('services.style_images.base_url');
        if (! $baseUrl) {
            abort(404);
        }

        $response = Http::timeout(5)
            ->accept('image/*')
            ->get($baseUrl, ['estilo' => $number]);

        if (! $response->ok()) {
            abort(404);
        }

        $contentType = $response->header('Content-Type') ?: 'image/jpeg';
        if (! Str::startsWith($contentType, 'image/')) {
            abort(415);
        }

        return response($response->body(), 200, [
            'Content-Type' => $contentType,
            'Cache-Control' => 'public, max-age=86400',
        ]);
    }
}

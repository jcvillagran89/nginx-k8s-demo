<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class MapsController extends Controller
{
    public function vector()
    {
        return Inertia::render('maps/vector/index');
    }

    public function leaflet()
    {
        return Inertia::render('maps/leaflet/index');
    }
}

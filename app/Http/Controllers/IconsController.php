<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class IconsController extends Controller
{
    public function tabler()
    {
        return Inertia::render('icons/tabler/index');
    }

    public function solar()
    {
        return Inertia::render('icons/solar/index');
    }
}

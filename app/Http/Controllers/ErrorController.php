<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ErrorController extends Controller
{
    public function error400()
    {
        return Inertia::render('errors/400/index');
    }

    public function error401()
    {
        return Inertia::render('errors/401/index');
    }

    public function error403()
    {
        return Inertia::render('errors/403/index');
    }

    public function error404()
    {
        return Inertia::render('errors/404/index');
    }

    public function error404Alt()
    {
        return Inertia::render('errors/404-alt/index');
    }

    public function error408()
    {
        return Inertia::render('errors/408/index');
    }

    public function error500()
    {
        return Inertia::render('errors/500/index');
    }

    public function error501()
    {
        return Inertia::render('errors/501/index');
    }

    public function error502()
    {
        return Inertia::render('errors/502/index');
    }

    public function error503()
    {
        return Inertia::render('errors/503/index');
    }
}

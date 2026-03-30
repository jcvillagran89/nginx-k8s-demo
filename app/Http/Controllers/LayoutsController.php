<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class LayoutsController extends Controller
{

    public function horizontal()
    {
        return Inertia::render('layouts/horizontal/index');
    }

    public function compact()
    {
        return Inertia::render('layouts/compact/index');
    }

    public function detached()
    {
        return Inertia::render('layouts/detached/index');
    }

    public function full()
    {
        return Inertia::render('layouts/full/index');
    }

    public function fullscreen()
    {
        return Inertia::render('layouts/fullscreen/index');
    }

    public function hoverMenu()
    {
        return Inertia::render('layouts/hover-menu/index');
    }

    public function iconView()
    {
        return Inertia::render('layouts/icon-view/index');
    }

    public function dark()
    {
        return Inertia::render('layouts/dark/index');
    }

}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ExtendedUIController extends Controller
{
    public function dragula()
    {
        return Inertia::render('extended/dragula/index');
    }

    public function sweetalerts()
    {
        return Inertia::render('extended/sweet-alert/index');
    }

    public function ratings()
    {
        return Inertia::render('extended/ratings/index');
    }

    public function scrollbar()
    {
        return Inertia::render('extended/scrollbar/index');
    }

}

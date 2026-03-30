<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class TablesController extends Controller
{
    public function basic()
    {
        return Inertia::render('tables/basic/index');
    }

    public function gridjs()
    {
        return Inertia::render('tables/gridjs/index');
    }
}

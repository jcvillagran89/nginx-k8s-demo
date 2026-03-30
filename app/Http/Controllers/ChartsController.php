<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ChartsController extends Controller
{
    public function area()
    {
        return Inertia::render('charts/area/index');
    }

    public function bar()
    {
        return Inertia::render('charts/bar/index');
    }

    public function bubble()
    {
        return Inertia::render('charts/bubble/index');
    }

    public function candlestick()
    {
        return Inertia::render('charts/candlestick/index');
    }

    public function column()
    {
        return Inertia::render('charts/column/index');
    }

    public function heatmap()
    {
        return Inertia::render('charts/heatmap/index');
    }

    public function line()
    {
        return Inertia::render('charts/line/index');
    }

    public function mixed()
    {
        return Inertia::render('charts/mixed/index');
    }

    public function timeline()
    {
        return Inertia::render('charts/timeline/index');
    }

    public function boxplot()
    {
        return Inertia::render('charts/boxplot/index');
    }

    public function treemap()
    {
        return Inertia::render('charts/treemap/index');
    }

    public function pie()
    {
        return Inertia::render('charts/pie/index');
    }

    public function radar()
    {
        return Inertia::render('charts/radar/index');
    }

    public function radialbar()
    {
        return Inertia::render('charts/radialbar/index');
    }

    public function scatter()
    {
        return Inertia::render('charts/scatter/index');
    }

    public function polar()
    {
        return Inertia::render('charts/polar/index');
    }

    public function sparklines()
    {
        return Inertia::render('charts/sparklines/index');
    }

}

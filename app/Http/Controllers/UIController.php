<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class UIController extends Controller
{
    public function accordions()
    {
        return Inertia::render('ui/accordions/index');
    }

    public function alerts()
    {
        return Inertia::render('ui/alerts/index');
    }

    public function avatars()
    {
        return Inertia::render('ui/avatars/index');
    }

    public function badges()
    {
        return Inertia::render('ui/badges/index');
    }

    public function breadcrumb()
    {
        return Inertia::render('ui/breadcrumb/index');
    }

    public function buttons()
    {
        return Inertia::render('ui/buttons/index');
    }

    public function cards()
    {
        return Inertia::render('ui/cards/index');
    }

    public function carousel()
    {
        return Inertia::render('ui/carousel/index');
    }

    public function collapse()
    {
        return Inertia::render('ui/collapse/index');
    }

    public function dropdowns()
    {
        return Inertia::render('ui/dropdowns/index');
    }

    public function ratios()
    {
        return Inertia::render('ui/ratio/index');
    }

    public function grid()
    {
        return Inertia::render('ui/grid/index');
    }

    public function links()
    {
        return Inertia::render('ui/links/index');
    }

    public function listGroup()
    {
        return Inertia::render('ui/list-group/index');
    }

    public function modals()
    {
        return Inertia::render('ui/modals/index');
    }

    public function notifications()
    {
        return Inertia::render('ui/notifications/index');
    }

    public function offcanvas()
    {
        return Inertia::render('ui/offcanvas/index');
    }

    public function placeholders()
    {
        return Inertia::render('ui/placeholders/index');
    }

    public function pagination()
    {
        return Inertia::render('ui/pagination/index');
    }

    public function popovers()
    {
        return Inertia::render('ui/popovers/index');
    }

    public function progress()
    {
        return Inertia::render('ui/progress/index');
    }

    public function spinners()
    {
        return Inertia::render('ui/spinners/index');
    }

    public function tabs()
    {
        return Inertia::render('ui/tabs/index');
    }

    public function tooltips()
    {
        return Inertia::render('ui/tooltips/index');
    }

    public function typography()
    {
        return Inertia::render('ui/typography/index');
    }

    public function utilities()
    {
        return Inertia::render('ui/utilities/index');
    }

}

<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PagesController extends Controller
{
    public function emailActivation()
    {
        return Inertia::render('pages/email-templates/activation/index');
    }

    public function emailBasic()
    {
        return Inertia::render('pages/email-templates/basic/index');
    }

    public function emailInvoice()
    {
        return Inertia::render('pages/email-templates/invoice/index');
    }

    public function faq()
    {
        return Inertia::render('pages/faq/index');
    }

    public function pricing1()
    {
        return Inertia::render('pages/pricing/pricing-1/index');
    }

    public function pricing2()
    {
        return Inertia::render('pages/pricing/pricing-2/index');
    }

    public function comingSoon()
    {
        return Inertia::render('pages/coming-soon/index');
    }

    public function maintenance()
    {
        return Inertia::render('pages/maintenance/index');
    }

    public function starter()
    {
        return Inertia::render('pages/starter/index');
    }

    public function termsConditions()
    {
        return Inertia::render('pages/terms-conditions/index');
    }

    public function timeline()
    {
        return Inertia::render('pages/timeline/index');
    }
}

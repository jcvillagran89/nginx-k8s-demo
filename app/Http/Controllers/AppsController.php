<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class AppsController extends Controller
{
    public function calendar()
    {
        return Inertia::render('apps/calendar/index');
    }

    public function chat()
    {
        return Inertia::render('apps/chat/index');
    }

    public function email()
    {
        return Inertia::render('apps/email/index');
    }

    public function fileManager()
    {
        return Inertia::render('apps/file-manager/index');
    }
}

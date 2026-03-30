<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class InvoiceController extends Controller
{
    public function invoice()
    {
        return Inertia::render('invoices/index');
    }

    public function invoiceAdd()
    {
        return Inertia::render('invoices/create-invoice/index');
    }

    public function invoiceDetails()
    {
        return Inertia::render('invoices/view-invoice/index');
    }
}

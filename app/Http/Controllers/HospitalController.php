<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class HospitalController extends Controller
{
    public function appointments()
    {
        return Inertia::render('hospital/appointments/index');
    }

    public function contacts()
    {
        return Inertia::render('hospital/contacts/index');
    }

    public function departments()
    {
        return Inertia::render('hospital/departments/index');
    }

    public function doctors()
    {
        return Inertia::render('hospital/doctors/index');
    }

    public function doctorsAdd()
    {
        return Inertia::render('hospital/add-doctors/index');
    }

    public function doctorsDetails()
    {
        return Inertia::render('hospital/doctors-details/index');
    }

    public function patients()
    {
        return Inertia::render('hospital/patients/index');
    }

    public function patientsAdd()
    {
        return Inertia::render('hospital/add-patients/index');
    }

    public function patientsDetails()
    {
        return Inertia::render('hospital/patients-details/index');
    }

    public function payments()
    {
        return Inertia::render('hospital/payments/index');
    }

    public function reviews()
    {
        return Inertia::render('hospital/reviews/index');
    }

    public function staffs()
    {
        return Inertia::render('hospital/staffs/index');
    }
}

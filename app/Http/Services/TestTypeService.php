<?php

namespace App\Http\Services;

use App\Models\TestType;

class TestTypeService
{
    protected $mTestType;

    public function __construct()
    {
        $this->mTestType = new TestType();
    }

    public function getTestTypes()
    {
        return $this->mTestType->all();
    }
}

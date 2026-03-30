<?php

use App\Services\DbSync\DepartmentsSyncService;
use App\Services\DbSync\DivisionsSyncService;
use App\Services\DbSync\StylesSyncService;
use App\Services\DbSync\ProvidersSyncService;
use App\Services\DbSync\SkuSyncService;

return [
    'styles' => StylesSyncService::class,
    'providers' => ProvidersSyncService::class,
    'departments' => DepartmentsSyncService::class,
    'skus' => SkuSyncService::class,
    'divisions' => DivisionsSyncService::class
];

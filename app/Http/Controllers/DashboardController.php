<?php

namespace App\Http\Controllers;

use App\Http\Services\DashboardService;
use App\Http\Services\RecentActivityService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected DashboardService $dashboard;
    protected RecentActivityService $recentActivityService;

    public function __construct()
    {
        $this->dashboard = new DashboardService();
        $this->recentActivityService = new RecentActivityService();
    }
    public function clinic()
    {
        return Inertia::render('dashboard/clinic/index');
    }

    public function wallet()
    {
        return Inertia::render('dashboard/wallet/index');
    }

    public function sales()
    {
        return Inertia::render('dashboard/sales/index');
    }

    public function index()
    {
        return Inertia::render('admin/dashboard/index', [
            'cards' => $this->dashboard->getCardStats(),
            'barChart' => $this->dashboard->getBarChartData(),
            'lineChart' => $this->dashboard->getMonthlyTestsSummary(),
            'recentActivities' => $this->recentActivityService->getRecentActivities()
        ]);
    }
}

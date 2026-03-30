<?php

namespace App\Http\Services;

use App\Models\TestRequest;
use App\Models\TestResult;
use App\Models\TestType;
use App\Models\User;
use Carbon\Carbon;

class DashboardService
{
    protected $mTestRequest;
    protected $mUser;
    protected $mTestType;
    protected $mTestResult;
    protected $mCarbon;

    public function __construct()
    {
        $this->mTestRequest = new TestRequest();
        $this->mUser = new User();
        $this->mTestType = new TestType();
        $this->mTestResult = new TestResult();
        $this->mCarbon = new Carbon();
    }

    public function getCardStats()
    {
        $now = $this->mCarbon::now();
        $weekStart = $now->copy()->startOfWeek();
        $weekEnd = $now->copy()->endOfWeek();
        $monthStart = $now->copy()->startOfMonth();
        $monthEnd = $now->copy()->endOfMonth();

        return [
            'total_tests' => $this->mTestRequest::count(),
            'tests_this_week' => $this->mTestRequest::whereBetween(
                'created_at',
                [$weekStart, $weekEnd]
            )->count(),
            'tests_this_month' => $this->mTestRequest::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
            'total_users' => $this->mUser::count(),
            'new_users_this_month' => $this->mUser::whereBetween('created_at', [$monthStart, $monthEnd])->count(),
            'users_verified' => $this->mUser::whereNotNull('email_verified_at')->count(),
            'tests_in_progress' => $this->mTestRequest::where('status', $this->mTestRequest::STATUS['IN_PROGRESS'])->count(),
            'tests_pending_review' => $this->mTestRequest::where('status', $this->mTestRequest::STATUS['PENDING_REVIEW'])->count(),
            'tests_approved' => $this->mTestRequest::where('status', $this->mTestRequest::STATUS['APPROVED'])->count(),
            'tests_rejected' => $this->mTestRequest::where('status', $this->mTestRequest::STATUS['REJECTED'])->count(),
            'tests_in_committee' => $this->mTestRequest::where('in_committee', 1)->count(),
            'tests_reentry' => $this->mTestRequest::where('status', $this->mTestRequest::STATUS['RE-ENTRY'])->count(),
            'tests_in_committee_this_month' => $this->mTestRequest::whereBetween('updated_at', [$monthStart, $monthEnd])
                ->where('in_committee', 1)
                ->count(),
            'tests_reentry_this_month' => $this->mTestRequest::whereBetween('updated_at', [$monthStart, $monthEnd])
                ->where('status', $this->mTestRequest::STATUS['RE-ENTRY'])
                ->count(),
            'tests_approved_this_month' => $this->mTestRequest::whereBetween('updated_at', [$monthStart, $monthEnd])
                ->where('status', $this->mTestRequest::STATUS['APPROVED'])
                ->count(),
            'tests_rejected_this_month' => $this->mTestRequest::whereBetween('updated_at', [$monthStart, $monthEnd])
                ->where('status', $this->mTestRequest::STATUS['REJECTED'])
                ->count(),
            'tests_in_progress_this_week' => $this->mTestRequest::whereBetween('created_at', [$weekStart, $weekEnd])
                ->where('status', $this->mTestRequest::STATUS['IN_PROGRESS'])
                ->count(),
            'tests_pending_review_this_week' => $this->mTestRequest::whereBetween('created_at', [$weekStart, $weekEnd])
                ->where('status', $this->mTestRequest::STATUS['PENDING_REVIEW'])
                ->count(),
        ];
    }

    public function getBarChartData()
    {
        $now = $this->mCarbon::now();
        $firstCreated = $this->mTestRequest::orderBy('created_at')->value('created_at');
        $lastCreated = $this->mTestRequest::orderByDesc('created_at')->value('created_at');

        $startYear = $firstCreated ? $this->mCarbon::parse($firstCreated)->year : $now->year;
        $endYear = $lastCreated ? $this->mCarbon::parse($lastCreated)->year : $now->year;

        $years = range($startYear, $endYear);
        sort($years);

        $monthNames = collect(range(1, 12))->map(function ($m) {
            return ucfirst(strtolower(
                $this->mCarbon::create()->month($m)->locale('es')->translatedFormat('F')
            ));
        })->toArray();

        $yearly = [];
        $monthly = [];

        foreach ($years as $year) {
            $monthlyTotals = $this->mTestRequest::selectRaw('EXTRACT(MONTH FROM created_at) as month, COUNT(*) as count')
                ->whereYear('created_at', $year)
                ->groupByRaw('EXTRACT(MONTH FROM created_at)')
                ->get()
                ->keyBy('month');

            $monthlyStatus = $this->mTestRequest::selectRaw('EXTRACT(MONTH FROM created_at) as month, status, COUNT(*) as count')
                ->whereYear('created_at', $year)
                ->whereIn('status', [1, 2, 3])
                ->groupByRaw('EXTRACT(MONTH FROM created_at), status')
                ->get();

            $statusByMonth = [];
            foreach ($monthlyStatus as $row) {
                $statusByMonth[(int) $row->month][(int) $row->status] = (int) $row->count;
            }

            $yearly[$year] = [];
            foreach (range(1, 12) as $month) {
                $yearly[$year][] = [
                    'month' => $monthNames[$month - 1],
                    'total' => (int) ($monthlyTotals[$month]->count ?? 0),
                    'pending' => (int) ($statusByMonth[$month][1] ?? 0),
                    'completed' => (int) ($statusByMonth[$month][2] ?? 0),
                    'cancelled' => (int) ($statusByMonth[$month][3] ?? 0),
                ];
            }

            $monthly[$year] = [];
            foreach (range(1, 12) as $month) {
                $daysInMonth = $this->mCarbon::create($year, $month, 1)->daysInMonth;

                $dailyTotals = $this->mTestRequest::selectRaw('EXTRACT(DAY FROM updated_at) as day, COUNT(*) as count')
                    ->whereYear('updated_at', $year)
                    ->whereMonth('updated_at', $month)
                    ->groupByRaw('EXTRACT(DAY FROM updated_at)')
                    ->get()
                    ->keyBy('day');

                $dailyStatus = $this->mTestRequest::selectRaw('EXTRACT(DAY FROM updated_at) as day, status, COUNT(*) as count')
                    ->whereYear('updated_at', $year)
                    ->whereMonth('updated_at', $month)
                    ->whereIn('status', [1, 2, 3])
                    ->groupByRaw('EXTRACT(DAY FROM updated_at), status')
                    ->get();

                $statusByDay = [];
                foreach ($dailyStatus as $row) {
                    $statusByDay[(int) $row->day][(int) $row->status] = (int) $row->count;
                }

                $dailyRows = [];
                foreach (range(1, $daysInMonth) as $day) {
                    $dailyRows[] = [
                        'day' => $day,
                        'total' => (int) ($dailyTotals[$day]->count ?? 0),
                        'pending' => (int) ($statusByDay[$day][1] ?? 0),
                        'completed' => (int) ($statusByDay[$day][2] ?? 0),
                        'cancelled' => (int) ($statusByDay[$day][3] ?? 0),
                    ];
                }

                $monthly[$year][$month] = $dailyRows;
            }
        }

        return [
            'years' => $years,
            'yearly' => $yearly,
            'monthly' => $monthly,
        ];
    }


    public function getMonthlyTestsSummary()
    {
        $testTypes = $this->mTestType::pluck('id', 'name_es')->toArray();

        $months = collect(range(1, 12))->map(function ($m) use ($testTypes) {

            $monthName = ucfirst(strtolower(
                $this->mCarbon::create(null, $m)->locale('es')->translatedFormat('F')
            ));

            return [
                'month' => $monthName,
                'tests' => collect($testTypes)->mapWithKeys(fn ($id, $name) => [$name => 0])->toArray()
            ];
        })->toArray();

        $results = $this->mTestResult::whereYear('created_at', now()->year)->get();

        foreach ($results as $result) {

            $content = $result->content;
            if (!is_array($content)) continue;

            $monthIndex = $this->mCarbon::parse($result->created_at)->month - 1;

            foreach ($content as $testTypeName => $items) {

                if (!isset($testTypes[$testTypeName])) continue;

                $months[$monthIndex]['tests'][$testTypeName] += 1;
            }
        }

        return $months;
    }


}

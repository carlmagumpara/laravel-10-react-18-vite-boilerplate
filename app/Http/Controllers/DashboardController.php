<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\{ User };
use App\Traits\ChartData;
use Carbon\Carbon;

class DashboardController extends Controller
{
    use ChartData;

    public function index(Request $request)
    {
        return [
            'counts' => [],
            'chart' => $this->adminChartData(8),
        ];
    }
}

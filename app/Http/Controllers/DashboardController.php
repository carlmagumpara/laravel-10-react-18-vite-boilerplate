<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\{ User, Appointment, Service, Stylist };
use App\Traits\ChartData;
use Carbon\Carbon;

class DashboardController extends Controller
{
    use ChartData;

    public function index(Request $request)
    {
        return [
            'counts' => [
                'clients' => User::clients()->count(),
                'appointments' => Appointment::count(),
                'services' => Service::count(),
                'stylists' => Stylist::count(),
            ],
            'chart' => $this->adminChartData(8, $request->chart_type),
        ];
    }
}

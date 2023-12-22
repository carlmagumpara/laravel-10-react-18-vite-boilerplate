<?php

namespace App\Traits;

use Carbon\CarbonPeriod;
use Carbon\Carbon;
use App\Models\{ User, Service };

trait ChartData
{
    public function generateData($dates, $model, $conditions = [], $type)
    {
        $data = [];

        foreach ($dates as $value) {
            if ($type === 'by_month') {
                $data[] = $model->whereBetween('created_at', [Carbon::parse($value)->startOfMonth(), Carbon::parse($value)->endOfMonth()])->where($conditions)->count();
            }
            if ($type === 'by_week') {
                $data[] = $model->whereBetween('created_at', [Carbon::parse($value)->startOfDay(), Carbon::parse($value)->endOfDay()])->where($conditions)->count();
            }
        }

        return $data;
    }

    public function format($dates, $format)
    {
        $data = [];

        foreach ($dates as $value) {
            $data[] = Carbon::parse($value)->format($format);
        }

        return $data;
    }

    public function adminChartData($count = 8)
    {
        $months = CarbonPeriod::create(Carbon::now()->startOfYear()->toDateString(), '1 month', Carbon::now()->endOfYear()->toDateString());
        $weeks = CarbonPeriod::create(Carbon::now()->startOfWeek()->toDateString(), Carbon::now()->endOfWeek()->toDateString());

        return [
            'users' => [
                'by_month' => [
                    'labels' => $this->format($months, 'M'),
                    'data' => $this->generateData($months, new User, ['role_id' => 2], 'by_month')
                ],
                'by_week' => [
                    'labels' => $this->format($weeks, 'l'),
                    'data' => $this->generateData($weeks, new User, ['role_id' => 2], 'by_week')
                ],
            ],
        ];
    }
}

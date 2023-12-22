<?php

namespace App\Providers;

use App\Models\{ User };
use Illuminate\Support\ServiceProvider;
use Illuminate\Pagination\Paginator;
use Carbon\Carbon;
use Validator;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Validator::extend('phone_number', 'App\\Validators\\PhoneNumber@validate');
        Validator::extend('olderThan', function($attribute, $value, $parameters) {
            $minAge = ( ! empty($parameters)) ? (int) $parameters[0] : 18;
            return Carbon::now()->diff(new Carbon($value))->y >= $minAge;
        }, 'You must be older than 18 years old');

        Paginator::useBootstrap();
    }
}

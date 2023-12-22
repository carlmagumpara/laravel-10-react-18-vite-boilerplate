<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Mail;
use App\Mail\SendVerificationCode;
use App\Services\SemaphoreSms;

class Authentication
{
    public function generateTokenCodeForEmail($user)
    {
        $code = (string) random_int(100000, 999999);
        $token = bin2hex(random_bytes(16));
        $url = route('verification', [
            'token' => $token,
            'email' => $user->email,
        ]);

        Cache::put('verification.'.$token, [
            'id' => $user->id,
            'code' => $code,
        ], now()->addMinutes(60));

        Mail::to($user->email)->send(new SendVerificationCode($user, $code, $url));

        return [
            'token' => $token,
            'code' => $code,
            'url' => $url,
        ];
    }

    public function generateTokenCodeForSMS($number)
    {
        $code = (string) random_int(100000, 999999);
        $token = bin2hex(random_bytes(16));

        Cache::put('verification-sms.'.$token, [
            'number' => $number,
            'code' => $code,
        ], now()->addMinutes(5));

        SemaphoreSms::send([
            'number' => $number,
            'country' => 'PH',
            'content' => config('app.name').': Your verification code is: '.$code.'. This code expires in 5 minutes.',
        ]);

        return [
            'token' => $token,
            'code' => $code,
        ];
    }
}

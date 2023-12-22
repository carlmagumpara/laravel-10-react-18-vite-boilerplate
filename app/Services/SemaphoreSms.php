<?php

namespace App\Services;

use App\Helpers\Utils;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

/**
 * A service class to send sms.
 *
 * @author carl
 * @return bool
 */
class SemaphoreSms
{
    public static $countryCodes;

    public static function init()
    {
        self::$countryCodes = json_decode(file_get_contents(storage_path().'/json/Countries.json'), true);
    }

    public static function send(array $sms)
    {
        self::init();

        try {
            $number = self::validateNumberToInternationalFormat($sms['number'], $sms['country']);

            $response = Http::asForm()->post('https://semaphore.co/api/v4/messages', [
                'apikey' => '36e76847d97e3a4b8bc683d09785b3e0',
                'number' => $number,
                'message' => $sms['content'],
                'sendername' => 'SEMAPHORE'
            ]);

            \Log::info($response);

            return $response;
        } catch (\Throwable $e) {
            return false;
        }

        return false;
    }

    public static function validateNumberToInternationalFormat($number, $countryCode = 'PH')
    {
        $countryCodes = self::$countryCodes;
        $countryCode = self::getCountryCodeByName(strtoupper($countryCode));
        $default_country_code = '63';
        $number = preg_replace("/\([0-9]+?\)/", '', $number);
        $number = preg_replace('/[^0-9]/', '', $number);
        $number = ltrim($number, '0');
        if (array_key_exists($countryCode, $countryCodes)) {
            $pfx = $countryCodes[$countryCode];
        } else {
            $pfx = $default_country_code;
        }
        if (! preg_match('/^'.$pfx.'/', $number)) {
            $number = $pfx.$number;
        }

        return '+'.$number;
    }

    public static function getCountryCodeByName($countryName)
    {
        $countrys = self::$countryCodes;
        $countryCode = 'PH';
        foreach ($countrys as $country) {
            if ($country['name'] === $countryName) {
                $countryCode = $value['code'];
            }
        }

        return $countryCode;
    }
}

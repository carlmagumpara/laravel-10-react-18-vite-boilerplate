<?php

namespace App\Helpers;

class Utils
{    
    public static function distance($lat1, $lon1, $lat2, $lon2, $unit = 'K')
    {
        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) +  cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        $miles = $dist * 60 * 1.1515;
        $unit = strtoupper($unit);

        if ($unit == "K") {
            return round($miles * 1.609344);
        } else if ($unit == "N") {
            return round($miles * 0.8684);
        } else {
            return round($miles);
        }
    }
    
    public static function formatArray($array)
    {
        $count = count($array);
        $formatted = "";
        foreach($array as $key => $value) {
            if ($key !== 0) {
                if ($key === $count - 1) {
                    $formatted .= ', and '.$value;
                } else {
                    $formatted .= ', '.$value;
                }
            } else {
                $formatted .= $value;
            }
        }
        
        return $formatted;
    }

    public static function parseImagesFromHtml($html)
    {
        $doc = new \DOMDocument();
        $doc->loadHTML($html);
        $imageTags = $doc->getElementsByTagName('img');
        $images = [];
        foreach($imageTags as $tag) {
            $images[] = $tag->getAttribute('src');
        }

        return $images;
    }

    public function truncate($string = '', $number = 10) 
    {
        return (strlen($string) > 13) ? substr($string,0,$number).'...' : $string;
    }

    public static function generateRandomNumbersByRange(int $start = 0, int $end = 20)
    {
        $numbers = range($start, $end);
        shuffle($numbers);
        return array_slice($numbers, 0, 1)[0];
    }

    public static function arrayExclude($array, array $excludeKeys)
    {
        foreach($excludeKeys as $key){
            unset($array[$key]);
        }
        return $array;
    }

    public static function ordinal($number)
    {
        $ends = array('th','st','nd','rd','th','th','th','th','th','th');
        if ((($number % 100) >= 11) && (($number%100) <= 13))
            return $number. 'th';
        else
            return $number. $ends[$number % 10];
    }

    public static function generateRandomString($length = 10) 
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';
        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[rand(0, $charactersLength - 1)];
        }
        return $randomString;
    }

}

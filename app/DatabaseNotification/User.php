<?php

namespace App\DatabaseNotification;

use Illuminate\Notifications\DatabaseNotification;

class User extends DatabaseNotification
{
    protected $appends = [
        'photo',
        'content',
        'web_link',
    ];

    public function getPhotoAttribute()
    {
        $data = json_decode($this->attributes['data']);

        if ($data->owner_id !== $data->notify_id) {
            $user = \App\Models\User::find($data->owner_id);

            return $user->photo;
        }

        return asset('images/profile.png');
    }

    public function getContentAttribute()
    {
        $data = json_decode($this->attributes['data']);
        $notification = $data->content;

        if (strpos($data->content, ':user') !== false) {
            $user = \App\Models\User::find($data->owner_id);

            $notification = str_replace(':user', $user->first_name.' '.$user->last_name, $notification);
        }

        if (strpos($data->content, ':notify_user') !== false) {
            $notifyUser = \App\Models\User::find($data->notify_id);

            $notification = str_replace(':notify_user', $notifyUser->first_name.' '.$notifyUser->last_name, $notification);
        }
        
        return $notification;
    }

    public function getWebLinkAttribute()
    {
        $data = json_decode($this->attributes['data']);
        $user = \App\Models\User::find($data->notify_id);

        switch ($data->key) {
            case 'request':
                return 'request';
            default:
                return '#';
        }

        return '#';
    }
}

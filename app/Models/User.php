<?php

namespace App\Models;

use App\DatabaseNotification\User as UserNotification;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\{ HasMany, BelongsTo, HasOne, BelongsToMany, MorphToMany };
use Illuminate\Contracts\Auth\CanResetPassword;
use App\Traits\FormatDates;
use Carbon\Carbon;

class User extends Authenticatable implements MustVerifyEmail, CanResetPassword
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'is_super',
        'role_id',
        'status',
        'first_name',
        'last_name',
        'middle_name',
        'address',
        'photo',
        'gender',
        'date_of_birth',
        'contact_no',
        'contact_no_verified_at',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    protected $appends = [
        'is_admin',
        'is_current',
        'is_profile_completed',
        'is_contact_no_verified',
        'age',
        'created_at_formatted',
        'deleted_at_formatted',
    ];

    public function scopeAdmins($query)
    {
        $query->where('role_id', 1);
    }

    public function getIsAdminAttribute()
    {
        if (! auth()->check()) {
            return false;
        }

        return auth()->user()->role_id === 1;
    }

    public function getIsCurrentAttribute()
    {
        if (! auth()->check()) {
            return false;
        }

        return $this->id === auth()->user()->id;
    }

    public function getIsProfileCompletedAttribute()
    {
        $isCompleted = true;

        return $isCompleted;
    }

    public function getIsContactNoVerifiedAttribute()
    {
        return ! empty($this->contact_no_verified_at);
    }

    public function getAgeAttribute()
    {
        return ! empty($this->date_of_birth) ? Carbon::parse($this->date_of_birth)->diff(Carbon::now())->y : 0;
    }

    public function getPhotoAttribute($value)
    {
        if (!$value) {
            return asset('images/avatars/user.png');
        }

        return $value;
    }

    public function getCreatedAtFormattedAttribute()
    {
        if (empty($this->attributes['created_at'])) {
            return null;
        }

        return $this->getFormatDate($this->attributes['created_at'], 'M d, Y g:i A');
    }

    public function getDeletedAtFormattedAttribute()
    {
        if (empty($this->attributes['deleted_at'])) {
            return null;
        }

        return $this->getFormatDate($this->attributes['deleted_at'], 'M d, Y g:i A');
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }
}

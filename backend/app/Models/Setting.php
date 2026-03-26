<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    /**
     * Get a setting value by key
     */
    public static function get($key, $default = null)
    {
        $setting = static::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Set a setting value
     */
    public static function set($key, $value)
    {
        return static::updateOrCreate(
            ['key' => $key],
            ['value' => $value]
        );
    }

    /**
     * Check if website is locked
     */
    public static function isWebsiteLocked()
    {
        $locked = static::get('website_locked', 'false');

        if ($locked === 'false') {
            return false;
        }

        // Check if there's a timer
        $lockedUntil = static::get('locked_until');

        if ($lockedUntil) {
            $unlockTime = \Carbon\Carbon::parse($lockedUntil);

            if (now()->greaterThan($unlockTime)) {
                // Timer expired, unlock automatically
                static::set('website_locked', 'false');
                static::set('locked_until', null);
                return false;
            }
        }

        return true;
    }

    /**
     * Get remaining lock time in minutes
     */
    public static function getRemainingLockTime()
    {
        $lockedUntil = static::get('locked_until');

        if (!$lockedUntil) {
            return null;
        }

        $unlockTime = \Carbon\Carbon::parse($lockedUntil);

        if (now()->greaterThan($unlockTime)) {
            return 0;
        }

        return now()->diffInMinutes($unlockTime);
    }
}

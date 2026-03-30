<?php

namespace App\Services;

class MenuService
{
    public static function getMenu($user)
    {
        $menu = config('menu');

        return collect($menu)->filter(function ($item) use ($user) {

            if (!isset($item['permission'])) {
                return true;
            }

            return $user->can($item['permission']);

        })->values();

    }
}

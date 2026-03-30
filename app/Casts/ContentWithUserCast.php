<?php

namespace App\Casts;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use App\Models\User;

class ContentWithUserCast implements CastsAttributes
{
    public function get($model, string $key, $value, array $attributes)
    {
        if (is_null($value)) {
            return null;
        }

        $content = is_string($value) ? json_decode($value, true) : $value;

        if (!is_array($content)) {
            return $content;
        }

        $userIds = [];

        foreach ($content as $sectionKey => $section) {
            if (isset($section['user_id']) && !empty($section['user_id'])) {
                $userIds[] = $section['user_id'];
            }
        }

        $userIds = array_unique($userIds);

        $users = [];
        if (!empty($userIds)) {
            $users = User::whereIn('id', $userIds)
                ->pluck('name', 'id')
                ->toArray();
        }

        foreach ($content as $sectionKey => &$section) {
            if (isset($section['user_id']) && !empty($section['user_id'])) {
                $userId = $section['user_id'];
                $section['user_name'] = $users[$userId] ?? null;
            } else {
                $section['user_name'] = null;
            }
        }
        unset($section);

        return $content;
    }

    public function set($model, string $key, $value, array $attributes)
    {
        if (is_array($value)) {
            foreach ($value as $sectionKey => &$section) {
                if (isset($section['user_name'])) {
                    unset($section['user_name']);
                }
            }
            unset($section);
            return json_encode($value);
        }
        return $value;
    }
}

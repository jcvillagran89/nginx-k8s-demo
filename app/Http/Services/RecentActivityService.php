<?php

namespace App\Http\Services;

use App\Models\RecentActivity;

class RecentActivityService
{
    protected $mRecentActivity;

    public function __construct()
    {
        $this->mRecentActivity = new RecentActivity();
    }

    public function getRecentActivities()
    {
        return $this->mRecentActivity
            ->with('user:id,name')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($item) {
                return [
                    'title'       => $item->title,
                    'description' => $item->description,
                    'icon'        => $item->icon,
                    'user'        => $item->user->name ?? 'Usuario desconocido',
                    'type'        => $item->type,
                    'created_at'  => $item->created_at,
                ];
            });
    }

    public function registerActivity(
        $title,
        $description,
        $type = 'primary',
        $icon = null
    ) {
        return $this->mRecentActivity::create([
            'user_id' => auth()->id(),
            'title' => $title,
            'description' => $description,
            'type' => $type,
            'icon' => $icon ?? $this->mRecentActivity::ICONS[$type],
        ]);
    }

}

<?php

return [
    'enabled' => true,

    'layout' => 'admin.layout',

    'route_prefix' => 'admin/pages',
    'route_name_prefix' => 'admin.pages.',

    'middleware' => [
        'web',
        'auth',
        'verified',
        'active',
        'role:admin,superadmin',
        'perm:content.create',
    ],

    'page_model' => App\Models\Page::class,

    'media' => [
        'picker_route' => 'admin.media.picker',
        'store_route' => 'admin.media.store',
    ],

    'features' => [
        'animations' => true,
        'media_library' => true,
        'widgets' => true,
        'advanced_css' => true,
        'seo_panel' => true,
        'layout_panel' => true,
    ],

    'assets_path' => 'vendor/cms-editor-v4',
];


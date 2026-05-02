<?php

use Illuminate\Support\Facades\Route;
use R4Software\CmsEditorV4\Http\Controllers\PageVisualEditorV4Controller;

if (config('editor-v4.enabled', true)) {
    Route::middleware(config('editor-v4.middleware', ['web', 'auth']))
        ->prefix(config('editor-v4.route_prefix', 'admin/pages'))
        ->as(config('editor-v4.route_name_prefix', 'admin.pages.'))
        ->group(function () {
            Route::get('/{page}/edit-v4', [PageVisualEditorV4Controller::class, 'edit'])
                ->name('edit_v4');

            Route::patch('/{page}/update-v4', [PageVisualEditorV4Controller::class, 'update'])
                ->name('update_v4');

            Route::get('/{page}/preview-v4', [PageVisualEditorV4Controller::class, 'preview'])
                ->name('preview_v4');
        });
}

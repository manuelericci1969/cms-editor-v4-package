<?php

namespace R4Software\CmsEditorV4;

use Illuminate\Support\ServiceProvider;

class EditorV4ServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->mergeConfigFrom(__DIR__ . '/../config/editor-v4.php', 'editor-v4');
    }

    public function boot(): void
    {
        $this->loadRoutesFrom(__DIR__ . '/../routes/editor-v4.php');

        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'cms-editor-v4');

        $this->publishes([
            __DIR__ . '/../config/editor-v4.php' => config_path('editor-v4.php'),
        ], 'cms-editor-v4-config');

        $this->publishes([
            __DIR__ . '/../resources/assets/visual-editor-v4' => public_path('vendor/cms-editor-v4'),
        ], 'cms-editor-v4-assets');

        $this->publishes([
            __DIR__ . '/../resources/views' => resource_path('views/vendor/cms-editor-v4'),
        ], 'cms-editor-v4-views');

        $this->publishes([
            __DIR__ . '/../database/migrations' => database_path('migrations'),
        ], 'cms-editor-v4-migrations');
    }
}

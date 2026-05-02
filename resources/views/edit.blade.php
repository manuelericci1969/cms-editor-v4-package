@extends('admin.layout')

@section('no_vite', true)
@section('title', 'Modifica Pagina (Editor V4)')

@section('content')
    @php
        $visualJsonOld = old('visual_json');
        $meta = is_array($page->meta ?? null) ? $page->meta : [];
        $layoutValue = data_get($meta, 'layout');
        $layout = is_array($layoutValue) ? $layoutValue : [];

        $pageSettingsV4 = [
            'metaTitle' => old('meta.title', data_get($meta, 'title')),
            'metaDescription' => old('meta.description', data_get($meta, 'description')),
            'metaKeywords' => old('meta.keywords', data_get($meta, 'keywords')),
            'showTitle' => (bool) old('meta.show_title', data_get($meta, 'show_title', true)),
            'showExcerpt' => (bool) old('meta.show_excerpt', data_get($meta, 'show_excerpt', false)),
            'showPubdate' => (bool) old('meta.show_pubdate', data_get($meta, 'show_pubdate', true)),
            'showAuthor' => (bool) old('meta.show_author', data_get($meta, 'show_author', true)),
            'showBreadcrumbs' => (bool) old('meta.show_breadcrumbs', data_get($meta, 'show_breadcrumbs', true)),
            'layoutWidth' => old('meta.layout.width', data_get($layout, 'width', 'standard')),
            'layoutGutter' => (int) old('meta.layout.gutter', data_get($layout, 'gutter', 24)),
            'layoutTop' => (int) old('meta.layout.top', data_get($layout, 'top', 0)),
        ];

        if (is_array($visualJsonOld)) {
            $visualJsonValue = json_encode($visualJsonOld, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } elseif (is_string($visualJsonOld) && trim($visualJsonOld) !== '') {
            $visualJsonValue = $visualJsonOld;
        } elseif (is_array($page->visual_json ?? null)) {
            $visualJsonValue = json_encode($page->visual_json, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
        } elseif (is_string($page->visual_json ?? null) && trim((string) $page->visual_json) !== '') {
            $visualJsonValue = (string) $page->visual_json;
        } else {
            $visualJsonValue = '';
        }
    @endphp

    <form id="pageFormV4" method="POST" action="{{ route('admin.pages.update_v4', $page) }}">
        @csrf
        @method('PATCH')

        <input type="hidden" name="editor_mode" value="visual">
        <input type="hidden" name="status" id="statusFieldV4" value="{{ old('status', $page->status ?? 'draft') }}">

        <input type="hidden" name="title" id="pageTitleFieldV4" value="{{ old('title', $page->title) }}">
        <input type="hidden" name="slug" value="{{ old('slug', $page->slug) }}">
        <input type="hidden" name="excerpt" value="{{ old('excerpt', $page->excerpt) }}">
        <input type="hidden" name="published_at" value="{{ old('published_at', $page->published_at?->timezone(config('app.timezone'))->format('Y-m-d\TH:i')) }}">
        <input type="hidden" name="is_homepage" value="{{ old('is_homepage', $page->is_homepage ? 1 : 0) }}">

        <textarea name="visual_html" id="visual_html" class="d-none">{{ old('visual_html', $page->visual_html ?? '') }}</textarea>
        <textarea name="visual_css" id="visual_css" class="d-none">{{ old('visual_css', $page->visual_css ?? '') }}</textarea>
        <textarea name="visual_json" id="visual_json" class="d-none">{{ $visualJsonValue }}</textarea>

        <div class="r4v4-editor" id="r4VisualEditorV4">
            <header class="r4v4-topbar">
                <div class="r4v4-brand">
                    <span class="r4v4-logo">R4</span>
                    <div>
                        <div class="r4v4-title">Editor V4</div>
                        <div class="r4v4-subtitle">{{ $page->title }}</div>
                    </div>
                </div>

                <div class="r4v4-actions">
                    <a href="{{ route('admin.dashboard') }}" class="r4v4-btn r4v4-btn-light">Dashboard</a>
                    <a href="{{ route('admin.pages.index') }}" class="r4v4-btn r4v4-btn-light">Esci / Pagine</a>
                    <a href="{{ route('admin.pages.edit_v3', $page) }}" class="r4v4-btn r4v4-btn-light">V3 legacy</a>
                    <a href="{{ route('admin.pages.preview_v4', $page) }}" class="r4v4-btn r4v4-btn-light" target="_blank">Anteprima admin</a>

                    @if($page->slug && $page->status === 'published' && $page->published_at)
                        <a href="{{ route('page.show', $page->slug) }}" class="r4v4-btn r4v4-btn-light" target="_blank">Apri pubblica</a>
                    @endif

                    <button type="button" class="r4v4-btn r4v4-btn-light" data-r4v4-command="media">Media</button>
                    <button type="button" class="r4v4-btn r4v4-btn-light" data-r4v4-command="layers">Layers</button>
                    <button type="button" class="r4v4-btn r4v4-btn-light" data-r4v4-command="focus">Focus canvas</button>
                    <button type="button" class="r4v4-btn r4v4-btn-light" data-r4v4-command="undo">Annulla</button>
                    <button type="button" class="r4v4-btn r4v4-btn-light" data-r4v4-command="redo">Ripeti</button>
                    <button type="button" class="r4v4-btn r4v4-btn-light" data-r4v4-command="preview">Preview canvas</button>
                    <button type="button" class="r4v4-btn r4v4-btn-danger" data-r4v4-command="clear">Svuota</button>

                    <button type="button" class="r4v4-btn r4v4-btn-light" data-r4v4-device="Desktop">Desktop</button>
                    <button type="button" class="r4v4-btn r4v4-btn-light" data-r4v4-device="Tablet">Tablet</button>
                    <button type="button" class="r4v4-btn r4v4-btn-light" data-r4v4-device="Mobile">Mobile</button>

                    <button type="submit" class="r4v4-btn r4v4-btn-secondary" data-r4v4-submit-status="draft">Salva bozza</button>
                    <button type="submit" class="r4v4-btn r4v4-btn-primary" data-r4v4-submit-status="published">Pubblica</button>
                </div>
            </header>

            @if ($errors->any())
                <div class="r4v4-alert r4v4-alert-danger">
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            @if(session('ok'))
                <div class="r4v4-alert r4v4-alert-success">{{ session('ok') }}</div>
            @endif

            <main class="r4v4-workspace">
                <aside class="r4v4-sidebar r4v4-sidebar-left">
                    <div class="r4v4-panel">
                        <div class="r4v4-panel-title">Blocchi</div>
                        <div id="r4v4-blocks"></div>
                    </div>

                    <div class="r4v4-panel">
                        <div class="r4v4-panel-title">Layers</div>
                        <div id="r4v4-layers"></div>
                    </div>
                </aside>

                <section class="r4v4-canvas-area">
                    <div id="r4v4-canvas"></div>
                </section>

                <aside class="r4v4-sidebar r4v4-sidebar-right">
                    <div class="r4v4-panel">
                        <div class="r4v4-panel-title">Stile</div>
                        <div id="r4v4-styles"></div>
                    </div>

                    <div class="r4v4-panel">
                        <div class="r4v4-panel-title">Proprietà</div>
                        <div id="r4v4-traits"></div>
                    </div>
                </aside>
            </main>
        </div>
    </form>

    <div class="r4v4-media-modal" id="r4v4MediaModal" hidden>
        <div class="r4v4-media-backdrop" data-r4v4-media-close></div>
        <div class="r4v4-media-dialog">
            <div class="r4v4-media-header">
                <div>
                    <strong>Libreria Media</strong>
                    <span>Seleziona immagini già caricate o caricane una nuova.</span>
                </div>
                <button type="button" class="r4v4-media-close" data-r4v4-media-close>×</button>
            </div>

            <div class="r4v4-media-toolbar">
                <input type="search" id="r4v4MediaSearch" placeholder="Cerca media...">
                <button type="button" class="r4v4-btn r4v4-btn-light" id="r4v4MediaSearchBtn">Cerca</button>
                <form id="r4v4MediaUploadForm" enctype="multipart/form-data">
                    <input type="file" name="file" id="r4v4MediaUploadFile" accept="image/jpeg,image/png,image/webp">
                    <button type="submit" class="r4v4-btn r4v4-btn-primary">Upload</button>
                </form>
            </div>

            <div class="r4v4-media-body">
                <div class="r4v4-media-grid" id="r4v4MediaGrid"></div>
            </div>

            <div class="r4v4-media-footer">
                <button type="button" class="r4v4-btn r4v4-btn-light" id="r4v4MediaInsertImage">Inserisci immagine</button>
                <button type="button" class="r4v4-btn r4v4-btn-light" id="r4v4MediaInsertGallery">Inserisci galleria</button>
                <button type="button" class="r4v4-btn r4v4-btn-light" id="r4v4MediaInsertSlider">Inserisci slider</button>
                <button type="button" class="r4v4-btn r4v4-btn-light" id="r4v4MediaInsertLogoCarousel">Inserisci carosello lavori/loghi</button>
            </div>
        </div>
    </div>

    @include('cms-editor-v4::menu.page-settings.html')
    @include('cms-editor-v4::menu.layout.html')
    @include('cms-editor-v4::menu.widgets.html')
    @include('cms-editor-v4::menu.elements.html')
    @include('cms-editor-v4::menu.spacing.html')
    @include('cms-editor-v4::menu.typography.html')
    @include('cms-editor-v4::menu.background.html')
    @include('cms-editor-v4::menu.border.html')
    @include('cms-editor-v4::menu.effects.html')
    @include('cms-editor-v4::menu.advanced.html')

    <link rel="stylesheet" href="https://unpkg.com/grapesjs/dist/css/grapes.min.css">
    <link rel="stylesheet" href="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/editor.css') }}">
    <link rel="stylesheet" href="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/sidebar-compact.css') }}">
    <link rel="stylesheet" href="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/topbar-compact.css') }}">
    <link rel="stylesheet" href="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/style-manager-fixes.css') }}">
    <link rel="stylesheet" href="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/layers-floating.css') }}">
    <link rel="stylesheet" href="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/core.css') }}">
    <link rel="stylesheet" href="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/layout.css') }}">
    <link rel="stylesheet" href="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/spacing.css') }}">
    <link rel="stylesheet" href="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/typography.css') }}">

    <script src="https://unpkg.com/grapesjs"></script>
    <script>
        window.R4VisualEditorV4 = {
            htmlFieldId: 'visual_html',
            cssFieldId: 'visual_css',
            jsonFieldId: 'visual_json',
            statusFieldId: 'statusFieldV4',
            formId: 'pageFormV4',
            canvasId: 'r4v4-canvas',
            blocksId: 'r4v4-blocks',
            layersId: 'r4v4-layers',
            stylesId: 'r4v4-styles',
            traitsId: 'r4v4-traits',
            mediaPickerUrl: @json(route('admin.media.picker')),
            mediaUploadUrl: @json(route('admin.media.store')),
            csrfToken: @json(csrf_token()),
            pageSettings: @json($pageSettingsV4)
        };
    </script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/app.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/registry.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/helpers.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/page-settings.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/layout.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/widgets.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/elements.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/spacing.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/typography.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/background.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/border.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/animations-v4-core.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/effects.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/advanced.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/menu/boot.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/layers-floating.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/media-bridge.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/media-tools.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/slider-pro.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/editor-runtime-bridge.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/focus-mode.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/page-settings.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/flash-message.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/text-editing-fix.js') }}"></script>
    <script src="{{ asset(config('editor-v4.assets_path', 'vendor/cms-editor-v4') . '/animation-tools.js') }}"></script>
@endsection

@php
    $r4LayoutMeta = is_array($layout ?? null) ? $layout : [];

    $r4LayoutDefaults = [
        'mode' => 'default',
        'width' => 'standard',
        'max_width' => 1200,
        'gutter' => 24,
        'gutter_tablet' => 20,
        'gutter_mobile' => 16,
        'top' => 0,
        'bottom' => 0,
        'header_offset' => 0,
        'min_height' => 'auto',
        'top_attach' => false,
        'hide_footer' => false,
        'background' => [
            'type' => 'none',
            'color' => '#ffffff',
            'from' => '#ffffff',
            'to' => '#f3f4f6',
            'angle' => 180,
        ],
    ];

    $r4Layout = array_replace_recursive($r4LayoutDefaults, $r4LayoutMeta);
    $r4LayoutBg = is_array($r4Layout['background'] ?? null) ? $r4Layout['background'] : $r4LayoutDefaults['background'];
@endphp

{{--
    Campi persistenti del Layout Studio.
    Sono fuori dal template dinamico, quindi usano form="pageFormV4" per essere sempre inviati
    anche se la tab Layout non viene aperta o se GrapesJS ricostruisce la sidebar.
--}}
<input type="hidden" form="pageFormV4" id="r4LayoutPersistMode" name="meta[layout][mode]" value="{{ old('meta.layout.mode', $r4Layout['mode']) }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistWidth" name="meta[layout][width]" value="{{ old('meta.layout.width', $r4Layout['width']) }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistMaxWidth" name="meta[layout][max_width]" value="{{ old('meta.layout.max_width', $r4Layout['max_width']) }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistGutter" name="meta[layout][gutter]" value="{{ old('meta.layout.gutter', $r4Layout['gutter']) }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistGutterTablet" name="meta[layout][gutter_tablet]" value="{{ old('meta.layout.gutter_tablet', $r4Layout['gutter_tablet']) }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistGutterMobile" name="meta[layout][gutter_mobile]" value="{{ old('meta.layout.gutter_mobile', $r4Layout['gutter_mobile']) }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistTop" name="meta[layout][top]" value="{{ old('meta.layout.top', $r4Layout['top']) }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistBottom" name="meta[layout][bottom]" value="{{ old('meta.layout.bottom', $r4Layout['bottom']) }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistHeaderOffset" name="meta[layout][header_offset]" value="{{ old('meta.layout.header_offset', $r4Layout['header_offset']) }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistMinHeight" name="meta[layout][min_height]" value="{{ old('meta.layout.min_height', $r4Layout['min_height']) }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistTopAttach" name="meta[layout][top_attach]" value="{{ old('meta.layout.top_attach', !empty($r4Layout['top_attach']) ? 1 : 0) }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistHideFooter" name="meta[layout][hide_footer]" value="{{ old('meta.layout.hide_footer', !empty($r4Layout['hide_footer']) ? 1 : 0) }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistBgType" name="meta[layout][background][type]" value="{{ old('meta.layout.background.type', $r4LayoutBg['type'] ?? 'none') }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistBgColor" name="meta[layout][background][color]" value="{{ old('meta.layout.background.color', $r4LayoutBg['color'] ?? '#ffffff') }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistGradientFrom" name="meta[layout][background][from]" value="{{ old('meta.layout.background.from', $r4LayoutBg['from'] ?? '#ffffff') }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistGradientTo" name="meta[layout][background][to]" value="{{ old('meta.layout.background.to', $r4LayoutBg['to'] ?? '#f3f4f6') }}">
<input type="hidden" form="pageFormV4" id="r4LayoutPersistGradientAngle" name="meta[layout][background][angle]" value="{{ old('meta.layout.background.angle', $r4LayoutBg['angle'] ?? 180) }}">

<script>
    window.R4VisualEditorV4 = window.R4VisualEditorV4 || {};
    window.R4VisualEditorV4.pageSettings = Object.assign({}, window.R4VisualEditorV4.pageSettings || {}, {
        layoutMode: @json(old('meta.layout.mode', $r4Layout['mode'])),
        layoutWidth: @json(old('meta.layout.width', $r4Layout['width'])),
        layoutMaxWidth: @json((int) old('meta.layout.max_width', $r4Layout['max_width'])),
        layoutGutter: @json((int) old('meta.layout.gutter', $r4Layout['gutter'])),
        layoutGutterTablet: @json((int) old('meta.layout.gutter_tablet', $r4Layout['gutter_tablet'])),
        layoutGutterMobile: @json((int) old('meta.layout.gutter_mobile', $r4Layout['gutter_mobile'])),
        layoutTop: @json((int) old('meta.layout.top', $r4Layout['top'])),
        layoutBottom: @json((int) old('meta.layout.bottom', $r4Layout['bottom'])),
        layoutHeaderOffset: @json((int) old('meta.layout.header_offset', $r4Layout['header_offset'])),
        layoutMinHeight: @json(old('meta.layout.min_height', $r4Layout['min_height'])),
        layoutTopAttach: @json((bool) old('meta.layout.top_attach', !empty($r4Layout['top_attach']))),
        layoutHideFooter: @json((bool) old('meta.layout.hide_footer', !empty($r4Layout['hide_footer']))),
        layoutBgType: @json(old('meta.layout.background.type', $r4LayoutBg['type'] ?? 'none')),
        layoutBgColor: @json(old('meta.layout.background.color', $r4LayoutBg['color'] ?? '#ffffff')),
        layoutGradientFrom: @json(old('meta.layout.background.from', $r4LayoutBg['from'] ?? '#ffffff')),
        layoutGradientTo: @json(old('meta.layout.background.to', $r4LayoutBg['to'] ?? '#f3f4f6')),
        layoutGradientAngle: @json((int) old('meta.layout.background.angle', $r4LayoutBg['angle'] ?? 180))
    });
</script>

<template id="r4v4-menu-template-layout">
    <div class="r4v4-page-card r4v4-menu-layout">
        <div class="r4v4-page-card-title">Layout pagina</div>
        <div class="r4v4-custom-help">
            Gestisce il canvas generale della pagina: larghezza, full width, spazi dai bordi, attacco al top e modalità landing.
        </div>
        <div class="r4v4-left-page-status" data-r4-left-page-status></div>

        <label>Preset pagina
            <select id="r4LeftLayoutMode" data-r4-layout-key="mode">
                <option value="default">Default CMS</option>
                <option value="boxed">Boxed / centrato</option>
                <option value="full_width">Full width</option>
                <option value="fullscreen">Fullscreen 100vh</option>
                <option value="landing">Landing page</option>
                <option value="blank">Blank canvas</option>
            </select>
        </label>

        <label>Larghezza
            <select id="r4LeftLayoutWidth" data-r4-layout-key="width">
                <option value="standard">Standard</option>
                <option value="boxed">Boxed</option>
                <option value="full">Full width</option>
            </select>
        </label>

        <label>Max width boxed
            <input type="number" id="r4LeftLayoutMaxWidth" data-r4-layout-key="max_width" min="320" max="3000" step="10">
        </label>

        <label>Gutter desktop
            <input type="number" id="r4LeftLayoutGutter" data-r4-layout-key="gutter" min="0" max="200">
        </label>

        <label>Gutter tablet
            <input type="number" id="r4LeftLayoutGutterTablet" data-r4-layout-key="gutter_tablet" min="0" max="200">
        </label>

        <label>Gutter mobile
            <input type="number" id="r4LeftLayoutGutterMobile" data-r4-layout-key="gutter_mobile" min="0" max="200">
        </label>

        <label>Spazio superiore
            <input type="number" id="r4LeftLayoutTop" data-r4-layout-key="top" min="0" max="600">
        </label>

        <label>Spazio inferiore
            <input type="number" id="r4LeftLayoutBottom" data-r4-layout-key="bottom" min="0" max="600">
        </label>

        <label>Offset header fisso
            <input type="number" id="r4LeftLayoutHeaderOffset" data-r4-layout-key="header_offset" min="0" max="300">
        </label>

        <label>Altezza minima
            <select id="r4LeftLayoutMinHeight" data-r4-layout-key="min_height">
                <option value="auto">Auto</option>
                <option value="100vh">100vh</option>
            </select>
        </label>

        <div class="r4v4-form-list">
            <label><span>Attacca al top</span>
                <select id="r4LeftLayoutTopAttach" data-r4-layout-key="top_attach">
                    <option value="0">No</option>
                    <option value="1">Sì</option>
                </select>
            </label>
            <label><span>Nascondi footer meta</span>
                <select id="r4LeftLayoutHideFooter" data-r4-layout-key="hide_footer">
                    <option value="0">No</option>
                    <option value="1">Sì</option>
                </select>
            </label>
        </div>
    </div>

    <div class="r4v4-page-card r4v4-menu-layout">
        <div class="r4v4-page-card-title">Sfondo pagina</div>
        <label>Tipo sfondo
            <select id="r4LeftLayoutBgType" data-r4-layout-key="background.type">
                <option value="none">Nessuno</option>
                <option value="color">Colore</option>
                <option value="gradient">Gradiente</option>
            </select>
        </label>
        <label>Colore
            <input type="color" id="r4LeftLayoutBgColor" data-r4-layout-key="background.color">
        </label>
        <label>Gradiente da
            <input type="color" id="r4LeftLayoutGradientFrom" data-r4-layout-key="background.from">
        </label>
        <label>Gradiente a
            <input type="color" id="r4LeftLayoutGradientTo" data-r4-layout-key="background.to">
        </label>
        <label>Angolo gradiente
            <input type="number" id="r4LeftLayoutGradientAngle" data-r4-layout-key="background.angle" min="0" max="360">
        </label>
    </div>

    <div class="r4v4-page-card r4v4-menu-layout">
        <div class="r4v4-page-card-title">Layout elemento selezionato</div>
        <div class="r4v4-custom-help">Seleziona un contenitore/div nel canvas e scegli come deve comportarsi su mobile.</div>

        <div class="r4v4-form-list">
            <label><span>Mobile layout</span>
                <select data-r4-mobile-layout>
                    <option value="inherit">Predefinito</option>
                    <option value="inline">Mantieni affiancato</option>
                    <option value="stack">Impila verticalmente</option>
                </select>
            </label>
        </div>
    </div>

    <div class="r4v4-page-card r4v4-menu-layout">
        <div class="r4v4-page-card-title">Azioni rapide</div>
        <button type="button" class="r4v4-page-action" data-r4-left-layout-action="apply">Applica layout</button>
    </div>
</template>

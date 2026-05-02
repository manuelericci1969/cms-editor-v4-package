(function () {
    'use strict';

    const h = window.R4V4MenuHelpers;

    const FIELD_MAP = {
        mode: 'r4LayoutPersistMode',
        width: 'r4LayoutPersistWidth',
        max_width: 'r4LayoutPersistMaxWidth',
        gutter: 'r4LayoutPersistGutter',
        gutter_tablet: 'r4LayoutPersistGutterTablet',
        gutter_mobile: 'r4LayoutPersistGutterMobile',
        top: 'r4LayoutPersistTop',
        bottom: 'r4LayoutPersistBottom',
        header_offset: 'r4LayoutPersistHeaderOffset',
        min_height: 'r4LayoutPersistMinHeight',
        top_attach: 'r4LayoutPersistTopAttach',
        hide_title: 'r4LayoutPersistHideTitle',
        hide_footer: 'r4LayoutPersistHideFooter',
        'background.type': 'r4LayoutPersistBgType',
        'background.color': 'r4LayoutPersistBgColor',
        'background.from': 'r4LayoutPersistGradientFrom',
        'background.to': 'r4LayoutPersistGradientTo',
        'background.angle': 'r4LayoutPersistGradientAngle'
    };

    function editor() { return window.r4VisualEditorV4Instance || null; }
    function selected() { const instance = editor(); return instance ? instance.getSelected() : null; }
    function attrs(component) { return component ? Object.assign({}, component.getAttributes() || {}) : {}; }
    function settings() {
        window.R4VisualEditorV4 = window.R4VisualEditorV4 || {};
        window.R4VisualEditorV4.pageSettings = window.R4VisualEditorV4.pageSettings || {};
        return window.R4VisualEditorV4.pageSettings;
    }
    function byId(id) { return document.getElementById(id); }
    function persistField(key) { return byId(FIELD_MAP[key] || ''); }
    function readPersist(key, fallback) { const field = persistField(key); return !field || field.value === '' || typeof field.value === 'undefined' ? fallback : field.value; }
    function writePersist(key, value) { const field = persistField(key); if (field) field.value = value === null || typeof value === 'undefined' ? '' : String(value); }

    function hydratePageSettings(panel) {
        const cfg = settings();
        const data = {
            mode: cfg.layoutMode || readPersist('mode', 'default'),
            width: cfg.layoutWidth || readPersist('width', 'standard'),
            max_width: cfg.layoutMaxWidth ?? readPersist('max_width', '1200'),
            gutter: cfg.layoutGutter ?? readPersist('gutter', '24'),
            gutter_tablet: cfg.layoutGutterTablet ?? readPersist('gutter_tablet', '20'),
            gutter_mobile: cfg.layoutGutterMobile ?? readPersist('gutter_mobile', '16'),
            top: cfg.layoutTop ?? readPersist('top', '0'),
            bottom: cfg.layoutBottom ?? readPersist('bottom', '0'),
            header_offset: cfg.layoutHeaderOffset ?? readPersist('header_offset', '0'),
            min_height: cfg.layoutMinHeight || readPersist('min_height', 'auto'),
            top_attach: typeof cfg.layoutTopAttach === 'undefined' ? readPersist('top_attach', '0') : (cfg.layoutTopAttach ? '1' : '0'),
            hide_title: typeof cfg.layoutHideTitle === 'undefined' ? readPersist('hide_title', '0') : (cfg.layoutHideTitle ? '1' : '0'),
            hide_footer: typeof cfg.layoutHideFooter === 'undefined' ? readPersist('hide_footer', '0') : (cfg.layoutHideFooter ? '1' : '0'),
            bg_type: cfg.layoutBgType || readPersist('background.type', 'none'),
            bg_color: cfg.layoutBgColor || readPersist('background.color', '#ffffff'),
            gradient_from: cfg.layoutGradientFrom || readPersist('background.from', '#ffffff'),
            gradient_to: cfg.layoutGradientTo || readPersist('background.to', '#f3f4f6'),
            gradient_angle: cfg.layoutGradientAngle ?? readPersist('background.angle', '180')
        };

        h.setPanelValue(panel, '#r4LeftLayoutMode', data.mode);
        h.setPanelValue(panel, '#r4LeftLayoutWidth', data.width);
        h.setPanelValue(panel, '#r4LeftLayoutMaxWidth', data.max_width);
        h.setPanelValue(panel, '#r4LeftLayoutGutter', data.gutter);
        h.setPanelValue(panel, '#r4LeftLayoutGutterTablet', data.gutter_tablet);
        h.setPanelValue(panel, '#r4LeftLayoutGutterMobile', data.gutter_mobile);
        h.setPanelValue(panel, '#r4LeftLayoutTop', data.top);
        h.setPanelValue(panel, '#r4LeftLayoutBottom', data.bottom);
        h.setPanelValue(panel, '#r4LeftLayoutHeaderOffset', data.header_offset);
        h.setPanelValue(panel, '#r4LeftLayoutMinHeight', data.min_height);
        h.setPanelValue(panel, '#r4LeftLayoutTopAttach', data.top_attach);
        h.setPanelValue(panel, '#r4LeftLayoutHideTitle', data.hide_title);
        h.setPanelValue(panel, '#r4LeftLayoutHideFooter', data.hide_footer);
        h.setPanelValue(panel, '#r4LeftLayoutBgType', data.bg_type);
        h.setPanelValue(panel, '#r4LeftLayoutBgColor', data.bg_color);
        h.setPanelValue(panel, '#r4LeftLayoutGradientFrom', data.gradient_from);
        h.setPanelValue(panel, '#r4LeftLayoutGradientTo', data.gradient_to);
        h.setPanelValue(panel, '#r4LeftLayoutGradientAngle', data.gradient_angle);
    }

    function hydrateSelectedLayout(panel) {
        const component = selected();
        const field = panel.querySelector('[data-r4-mobile-layout]');
        if (!field) return;
        const currentAttrs = attrs(component);
        field.value = currentAttrs['data-r4-mobile-layout'] || 'inherit';
    }

    function hydrate(panel) { hydratePageSettings(panel); hydrateSelectedLayout(panel); syncAll(panel); }
    function intValue(panel, selector, fallback) { const field = panel.querySelector(selector); const value = parseInt((field ? field.value : '') || fallback, 10); return Number.isFinite(value) ? value : fallback; }
    function value(panel, selector, fallback) { const field = panel.querySelector(selector); return field ? field.value : fallback; }

    function currentLayout(panel) {
        return {
            mode: value(panel, '#r4LeftLayoutMode', 'default'),
            width: value(panel, '#r4LeftLayoutWidth', 'standard'),
            maxWidth: intValue(panel, '#r4LeftLayoutMaxWidth', 1200),
            gutter: intValue(panel, '#r4LeftLayoutGutter', 24),
            gutterTablet: intValue(panel, '#r4LeftLayoutGutterTablet', 20),
            gutterMobile: intValue(panel, '#r4LeftLayoutGutterMobile', 16),
            top: intValue(panel, '#r4LeftLayoutTop', 0),
            bottom: intValue(panel, '#r4LeftLayoutBottom', 0),
            headerOffset: intValue(panel, '#r4LeftLayoutHeaderOffset', 0),
            minHeight: value(panel, '#r4LeftLayoutMinHeight', 'auto'),
            bgType: value(panel, '#r4LeftLayoutBgType', 'none'),
            bgColor: value(panel, '#r4LeftLayoutBgColor', '#ffffff'),
            gradientFrom: value(panel, '#r4LeftLayoutGradientFrom', '#ffffff'),
            gradientTo: value(panel, '#r4LeftLayoutGradientTo', '#f3f4f6'),
            gradientAngle: intValue(panel, '#r4LeftLayoutGradientAngle', 180)
        };
    }

    function enforcePreset(panel) {
        const mode = value(panel, '#r4LeftLayoutMode', 'default');
        const widthField = panel.querySelector('#r4LeftLayoutWidth');
        const minHeightField = panel.querySelector('#r4LeftLayoutMinHeight');
        const topAttachField = panel.querySelector('#r4LeftLayoutTopAttach');
        const hideTitleField = panel.querySelector('#r4LeftLayoutHideTitle');
        const hideFooterField = panel.querySelector('#r4LeftLayoutHideFooter');
        if (mode === 'boxed' && widthField) widthField.value = 'boxed';
        if (mode === 'full_width' && widthField) widthField.value = 'full';
        if (mode === 'fullscreen') { if (widthField) widthField.value = 'full'; if (minHeightField) minHeightField.value = '100vh'; }
        if (mode === 'landing') { if (widthField) widthField.value = 'full'; if (minHeightField) minHeightField.value = '100vh'; if (topAttachField) topAttachField.value = '1'; if (hideTitleField) hideTitleField.value = '1'; }
        if (mode === 'blank') { if (widthField) widthField.value = 'full'; if (minHeightField) minHeightField.value = '100vh'; if (topAttachField) topAttachField.value = '1'; if (hideTitleField) hideTitleField.value = '1'; if (hideFooterField) hideFooterField.value = '1'; }
    }

    function updateRuntimeConfig(panel) {
        const cfg = settings();
        cfg.layoutMode = value(panel, '#r4LeftLayoutMode', 'default');
        cfg.layoutWidth = value(panel, '#r4LeftLayoutWidth', 'standard');
        cfg.layoutMaxWidth = intValue(panel, '#r4LeftLayoutMaxWidth', 1200);
        cfg.layoutGutter = intValue(panel, '#r4LeftLayoutGutter', 24);
        cfg.layoutGutterTablet = intValue(panel, '#r4LeftLayoutGutterTablet', 20);
        cfg.layoutGutterMobile = intValue(panel, '#r4LeftLayoutGutterMobile', 16);
        cfg.layoutTop = intValue(panel, '#r4LeftLayoutTop', 0);
        cfg.layoutBottom = intValue(panel, '#r4LeftLayoutBottom', 0);
        cfg.layoutHeaderOffset = intValue(panel, '#r4LeftLayoutHeaderOffset', 0);
        cfg.layoutMinHeight = value(panel, '#r4LeftLayoutMinHeight', 'auto');
        cfg.layoutTopAttach = value(panel, '#r4LeftLayoutTopAttach', '0') === '1';
        cfg.layoutHideTitle = value(panel, '#r4LeftLayoutHideTitle', '0') === '1';
        cfg.layoutHideFooter = value(panel, '#r4LeftLayoutHideFooter', '0') === '1';
        cfg.layoutBgType = value(panel, '#r4LeftLayoutBgType', 'none');
        cfg.layoutBgColor = value(panel, '#r4LeftLayoutBgColor', '#ffffff');
        cfg.layoutGradientFrom = value(panel, '#r4LeftLayoutGradientFrom', '#ffffff');
        cfg.layoutGradientTo = value(panel, '#r4LeftLayoutGradientTo', '#f3f4f6');
        cfg.layoutGradientAngle = intValue(panel, '#r4LeftLayoutGradientAngle', 180);
    }

    function syncPersistFields(panel) {
        writePersist('mode', value(panel, '#r4LeftLayoutMode', 'default'));
        writePersist('width', value(panel, '#r4LeftLayoutWidth', 'standard'));
        writePersist('max_width', intValue(panel, '#r4LeftLayoutMaxWidth', 1200));
        writePersist('gutter', intValue(panel, '#r4LeftLayoutGutter', 24));
        writePersist('gutter_tablet', intValue(panel, '#r4LeftLayoutGutterTablet', 20));
        writePersist('gutter_mobile', intValue(panel, '#r4LeftLayoutGutterMobile', 16));
        writePersist('top', intValue(panel, '#r4LeftLayoutTop', 0));
        writePersist('bottom', intValue(panel, '#r4LeftLayoutBottom', 0));
        writePersist('header_offset', intValue(panel, '#r4LeftLayoutHeaderOffset', 0));
        writePersist('min_height', value(panel, '#r4LeftLayoutMinHeight', 'auto'));
        writePersist('top_attach', value(panel, '#r4LeftLayoutTopAttach', '0'));
        writePersist('hide_title', value(panel, '#r4LeftLayoutHideTitle', '0'));
        writePersist('hide_footer', value(panel, '#r4LeftLayoutHideFooter', '0'));
        writePersist('background.type', value(panel, '#r4LeftLayoutBgType', 'none'));
        writePersist('background.color', value(panel, '#r4LeftLayoutBgColor', '#ffffff'));
        writePersist('background.from', value(panel, '#r4LeftLayoutGradientFrom', '#ffffff'));
        writePersist('background.to', value(panel, '#r4LeftLayoutGradientTo', '#f3f4f6'));
        writePersist('background.angle', intValue(panel, '#r4LeftLayoutGradientAngle', 180));
    }

    function backgroundValue(layout) {
        if (layout.bgType === 'color') return layout.bgColor;
        if (layout.bgType === 'gradient') return 'linear-gradient(' + layout.gradientAngle + 'deg,' + layout.gradientFrom + ',' + layout.gradientTo + ')';
        return '';
    }

    function cssBgValue(bg) {
        return bg ? bg.replace(/;/g, '') : 'transparent';
    }

    function injectCanvasCss(doc, layout, bg, minHeight) {
        if (!doc || !doc.head) return;
        let style = doc.getElementById('r4v4-layout-preview-style');
        if (!style) {
            style = doc.createElement('style');
            style.id = 'r4v4-layout-preview-style';
            doc.head.appendChild(style);
        }

        const full = ['full', 'full_width', 'fullscreen', 'landing', 'blank'].includes(layout.width) || ['full_width', 'fullscreen', 'landing', 'blank'].includes(layout.mode);
        const boxedCss = (!full && layout.width === 'boxed')
            ? 'max-width:' + layout.maxWidth + 'px !important;margin-left:auto !important;margin-right:auto !important;'
            : 'max-width:none !important;margin-left:0 !important;margin-right:0 !important;';

        style.textContent = `
            html,
            body,
            body.gjs-dashed,
            #wrapper,
            .gjs-cv-canvas,
            .gjs-frame,
            [data-gjs-type="wrapper"] {
                background: ${cssBgValue(bg)} !important;
                min-height: ${minHeight === 'auto' ? '100%' : minHeight} !important;
            }
            body {
                box-sizing: border-box !important;
                margin-top: 0 !important;
                margin-bottom: 0 !important;
                padding-top: ${layout.top}px !important;
                padding-bottom: ${layout.bottom}px !important;
                padding-left: ${layout.gutter}px !important;
                padding-right: ${layout.gutter}px !important;
                ${boxedCss}
            }
        `;
    }

    function applyCanvasPreview(panel) {
        const instance = editor();
        if (!instance || !instance.Canvas || typeof instance.Canvas.getBody !== 'function') return;
        const body = instance.Canvas.getBody();
        const doc = instance.Canvas.getDocument ? instance.Canvas.getDocument() : (body ? body.ownerDocument : null);
        if (!body) return;

        const layout = currentLayout(panel);
        const full = ['full', 'full_width', 'fullscreen', 'landing', 'blank'].includes(layout.width) || ['full_width', 'fullscreen', 'landing', 'blank'].includes(layout.mode);
        const minHeight = (layout.minHeight === '100vh' || ['fullscreen', 'landing', 'blank'].includes(layout.mode)) ? 'calc(100vh - ' + layout.headerOffset + 'px)' : 'auto';
        const bg = backgroundValue(layout);

        injectCanvasCss(doc, layout, bg, minHeight);

        const html = doc ? doc.documentElement : null;
        const wrapper = body.querySelector('#wrapper') || body.querySelector('[data-gjs-type="wrapper"]') || body.firstElementChild;
        [html, body, wrapper].forEach((el) => {
            if (!el) return;
            el.style.setProperty('background', bg || 'transparent', 'important');
            el.style.setProperty('min-height', minHeight === 'auto' ? '100%' : minHeight, 'important');
        });
        body.style.setProperty('box-sizing', 'border-box', 'important');
        body.style.setProperty('margin', '0', 'important');
        body.style.setProperty('padding-top', layout.top + 'px', 'important');
        body.style.setProperty('padding-bottom', layout.bottom + 'px', 'important');
        body.style.setProperty('padding-left', layout.gutter + 'px', 'important');
        body.style.setProperty('padding-right', layout.gutter + 'px', 'important');

        if (!full && layout.width === 'boxed') {
            body.style.setProperty('max-width', layout.maxWidth + 'px', 'important');
            body.style.setProperty('margin-left', 'auto', 'important');
            body.style.setProperty('margin-right', 'auto', 'important');
        } else {
            body.style.setProperty('max-width', 'none', 'important');
            body.style.setProperty('margin-left', '0', 'important');
            body.style.setProperty('margin-right', '0', 'important');
        }
    }

    function syncAll(panel) { enforcePreset(panel); updateRuntimeConfig(panel); syncPersistFields(panel); applyCanvasPreview(panel); }

    function applyMobileLayout(panel) {
        const component = selected();
        const field = panel.querySelector('[data-r4-mobile-layout]');
        if (!component || !field) return;
        const currentAttrs = attrs(component);
        if (field.value === 'inherit') delete currentAttrs['data-r4-mobile-layout'];
        else currentAttrs['data-r4-mobile-layout'] = field.value;
        component.setAttributes(currentAttrs);
        const instance = editor();
        if (instance && typeof instance.trigger === 'function') instance.trigger('update');
    }

    function apply(panel) { syncAll(panel); applyMobileLayout(panel); h.flash(panel, 'Layout applicato al canvas e pronto per il salvataggio.', 'ok'); }

    function bindSubmitSync(panel) {
        const form = document.getElementById((window.R4VisualEditorV4 || {}).formId || 'pageFormV4');
        if (!form || form.dataset.r4LayoutSubmitBound === '1') return;
        form.dataset.r4LayoutSubmitBound = '1';
        form.addEventListener('submit', function () { syncAll(panel); }, true);
    }

    function bindSelectionRefresh(panel) {
        const instance = editor();
        if (!instance || panel.dataset.r4LayoutSelectionBound === '1') return;
        panel.dataset.r4LayoutSelectionBound = '1';
        instance.on('component:selected', function () { hydrateSelectedLayout(panel); });
        instance.on('component:deselected', function () { hydrateSelectedLayout(panel); });
    }

    window.R4V4SidebarMenu.register({
        key: 'layout',
        label: 'Layout',
        order: 20,
        templateId: 'r4v4-menu-template-layout',
        mount(panel) {
            panel.innerHTML = h.templateHtml(this.templateId);
            hydrate(panel);
            bindSubmitSync(panel);
            panel.querySelector('[data-r4-left-layout-action="apply"]')?.addEventListener('click', function () { apply(panel); });
            panel.querySelector('[data-r4-mobile-layout]')?.addEventListener('change', function () { applyMobileLayout(panel); h.flash(panel, 'Layout mobile aggiornato.', 'ok'); });
            panel.querySelectorAll('input, select').forEach((field) => {
                if (field.matches('[data-r4-mobile-layout]')) return;
                field.addEventListener('change', function () { syncAll(panel); });
                field.addEventListener('input', function () { syncAll(panel); });
            });
            setTimeout(function () { hydrate(panel); bindSelectionRefresh(panel); bindSubmitSync(panel); }, 250);
        },
        onActivate(panel) { hydrate(panel); bindSelectionRefresh(panel); bindSubmitSync(panel); }
    });
})();

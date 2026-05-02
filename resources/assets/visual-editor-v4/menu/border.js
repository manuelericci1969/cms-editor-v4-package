(function () {
    'use strict';

    const h = window.R4V4MenuHelpers;
    const RADIUS_PROPS = [
        'border-top-left-radius',
        'border-top-right-radius',
        'border-bottom-right-radius',
        'border-bottom-left-radius'
    ];
    const BORDER_PROPS = ['border-width', 'border-style', 'border-color', 'border-radius', 'box-shadow'].concat(RADIUS_PROPS);
    const SHADOWS = {
        soft: '0 8px 20px rgba(15, 23, 42, .12)',
        medium: '0 14px 35px rgba(15, 23, 42, .18)',
        strong: '0 22px 55px rgba(15, 23, 42, .28)'
    };

    function editor() { return window.r4VisualEditorV4Instance || null; }
    function selected() { const e = editor(); return e ? e.getSelected() : null; }
    function getStyleValue(component, prop) { return component ? ((component.getStyle() || {})[prop] || '') : ''; }
    function applyStyle(prop, value) { const component = selected(); if (component) component.addStyle({ [prop]: value }); }

    function applyRadiusPreset(value) {
        const component = selected();
        if (!component) return;
        const style = { 'border-radius': value };
        RADIUS_PROPS.forEach((prop) => { style[prop] = value; });
        component.addStyle(style);
    }

    function resetBorder() {
        const component = selected();
        if (!component) return;
        const reset = {};
        BORDER_PROPS.forEach((prop) => { reset[prop] = ''; });
        component.addStyle(reset);
    }

    function hydrate(panel) {
        const component = selected();
        panel.querySelectorAll('[data-r4-style-prop]').forEach((field) => {
            const value = getStyleValue(component, field.dataset.r4StyleProp);
            if (field.type === 'color') field.value = value && /^#[0-9a-f]{6}$/i.test(value) ? value : '#000000';
            else field.value = value;
        });
    }

    function bindSelectionRefresh(panel) {
        const instance = editor();
        if (!instance || panel.dataset.r4BorderSelectionBound === '1') return;
        panel.dataset.r4BorderSelectionBound = '1';
        instance.on('component:selected', function () { hydrate(panel); });
        instance.on('component:deselected', function () { hydrate(panel); });
    }

    window.R4V4SidebarMenu.register({
        key: 'border',
        label: 'Bordi',
        order: 80,
        templateId: 'r4v4-menu-template-border',
        selectionOnly: true,
        mount(panel) {
            panel.innerHTML = h.templateHtml(this.templateId);

            panel.querySelectorAll('[data-r4-style-prop]').forEach((field) => {
                field.addEventListener('input', function () { applyStyle(field.dataset.r4StyleProp, field.value.trim()); });
                field.addEventListener('change', function () { applyStyle(field.dataset.r4StyleProp, field.value.trim()); });
            });

            panel.querySelectorAll('[data-r4-radius-preset]').forEach((button) => {
                button.addEventListener('click', function () {
                    applyRadiusPreset(button.dataset.r4RadiusPreset || '0px');
                    hydrate(panel);
                });
            });

            panel.querySelectorAll('[data-r4-shadow-preset]').forEach((button) => {
                button.addEventListener('click', function () {
                    applyStyle('box-shadow', SHADOWS[button.dataset.r4ShadowPreset] || '');
                    hydrate(panel);
                });
            });

            panel.querySelector('[data-r4-border-reset]')?.addEventListener('click', function () {
                resetBorder();
                hydrate(panel);
            });

            setTimeout(function () { hydrate(panel); bindSelectionRefresh(panel); }, 250);
        },
        onActivate(panel) {
            hydrate(panel);
            bindSelectionRefresh(panel);
        }
    });
})();

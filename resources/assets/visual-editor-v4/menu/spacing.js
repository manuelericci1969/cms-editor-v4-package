(function () {
    'use strict';

    const h = window.R4V4MenuHelpers;

    function editor() {
        return window.r4VisualEditorV4Instance || null;
    }

    function selected() {
        const instance = editor();
        return instance ? instance.getSelected() : null;
    }

    function normalizeCssValue(value, unit) {
        const raw = String(value || '').trim();
        if (!raw) return '';
        if (/^-?\d+(\.\d+)?$/.test(raw)) return raw + (unit || 'px');
        return raw;
    }

    function getStyleValue(component, prop) {
        if (!component) return '';
        const style = component.getStyle() || {};
        return style[prop] || '';
    }

    function numericPart(value) {
        const match = String(value || '').match(/^-?\d+(\.\d+)?/);
        return match ? match[0] : '';
    }

    function applyStyle(prop, value) {
        const component = selected();
        if (!component) return;
        component.addStyle({ [prop]: value });
    }

    function resetProps(props) {
        const component = selected();
        if (!component) return;
        const reset = {};
        props.forEach((prop) => { reset[prop] = ''; });
        component.addStyle(reset);
    }

    function hydrate(panel) {
        const component = selected();
        panel.querySelectorAll('[data-r4-spacing]').forEach((field) => {
            field.value = numericPart(getStyleValue(component, field.dataset.r4Spacing));
        });
        panel.querySelectorAll('[data-r4-style-prop]').forEach((field) => {
            field.value = getStyleValue(component, field.dataset.r4StyleProp);
        });
    }

    function bindSelectionRefresh(panel) {
        const instance = editor();
        if (!instance || panel.dataset.r4SpacingSelectionBound === '1') return;
        panel.dataset.r4SpacingSelectionBound = '1';
        instance.on('component:selected', function () { hydrate(panel); });
        instance.on('component:deselected', function () { hydrate(panel); });
    }

    window.R4V4SidebarMenu.register({
        key: 'spacing',
        label: 'Spaziatura',
        order: 50,
        templateId: 'r4v4-menu-template-spacing',
        selectionOnly: true,
        mount(panel) {
            panel.innerHTML = h.templateHtml(this.templateId);

            panel.querySelectorAll('[data-r4-spacing]').forEach((field) => {
                field.addEventListener('input', function () {
                    const group = field.dataset.r4Spacing.startsWith('margin') ? 'margin' : 'padding';
                    const unit = panel.querySelector('[data-r4-spacing-unit="' + group + '"]')?.value || 'px';
                    applyStyle(field.dataset.r4Spacing, normalizeCssValue(field.value, unit));
                });
            });

            panel.querySelectorAll('[data-r4-style-prop]').forEach((field) => {
                field.addEventListener('input', function () {
                    applyStyle(field.dataset.r4StyleProp, field.value.trim());
                });
            });

            panel.querySelector('[data-r4-spacing-reset="margin"]')?.addEventListener('click', function () {
                resetProps(['margin-top', 'margin-right', 'margin-bottom', 'margin-left']);
                hydrate(panel);
            });

            panel.querySelector('[data-r4-spacing-reset="padding"]')?.addEventListener('click', function () {
                resetProps(['padding-top', 'padding-right', 'padding-bottom', 'padding-left']);
                hydrate(panel);
            });

            setTimeout(function () {
                hydrate(panel);
                bindSelectionRefresh(panel);
            }, 250);
        },
        onActivate(panel) {
            hydrate(panel);
            bindSelectionRefresh(panel);
        }
    });
})();

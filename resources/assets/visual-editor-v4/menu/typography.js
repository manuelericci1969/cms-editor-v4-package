(function () {
    'use strict';

    const h = window.R4V4MenuHelpers;
    const TYPOGRAPHY_PROPS = ['font-family', 'font-size', 'font-weight', 'font-style', 'line-height', 'letter-spacing', 'color', 'background-color', 'text-align', 'text-decoration'];

    function editor() {
        return window.r4VisualEditorV4Instance || null;
    }

    function selected() {
        const instance = editor();
        return instance ? instance.getSelected() : null;
    }

    function getStyleValue(component, prop) {
        if (!component) return '';
        const style = component.getStyle() || {};
        return style[prop] || '';
    }

    function applyStyle(prop, value) {
        const component = selected();
        if (!component) return;
        component.addStyle({ [prop]: value });
    }

    function resetTypography() {
        const component = selected();
        if (!component) return;
        const reset = {};
        TYPOGRAPHY_PROPS.forEach((prop) => { reset[prop] = ''; });
        component.addStyle(reset);
    }

    function hydrate(panel) {
        const component = selected();
        panel.querySelectorAll('[data-r4-style-prop]').forEach((field) => {
            const value = getStyleValue(component, field.dataset.r4StyleProp);
            if (field.type === 'color') field.value = value && /^#[0-9a-f]{6}$/i.test(value) ? value : '#000000';
            else field.value = value;
        });

        panel.querySelectorAll('[data-r4-segmented]').forEach((group) => {
            const prop = group.dataset.r4Segmented;
            const value = getStyleValue(component, prop);
            group.querySelectorAll('button').forEach((button) => {
                button.classList.toggle('is-active', button.dataset.r4StyleValue === value);
            });
        });
    }

    function bindSelectionRefresh(panel) {
        const instance = editor();
        if (!instance || panel.dataset.r4TypographySelectionBound === '1') return;
        panel.dataset.r4TypographySelectionBound = '1';
        instance.on('component:selected', function () { hydrate(panel); });
        instance.on('component:deselected', function () { hydrate(panel); });
    }

    window.R4V4SidebarMenu.register({
        key: 'typography',
        label: 'Testo',
        order: 60,
        templateId: 'r4v4-menu-template-typography',
        selectionOnly: true,
        mount(panel) {
            panel.innerHTML = h.templateHtml(this.templateId);

            panel.querySelectorAll('[data-r4-style-prop]').forEach((field) => {
                field.addEventListener('input', function () {
                    applyStyle(field.dataset.r4StyleProp, field.value.trim());
                    hydrate(panel);
                });
                field.addEventListener('change', function () {
                    applyStyle(field.dataset.r4StyleProp, field.value.trim());
                    hydrate(panel);
                });
            });

            panel.querySelectorAll('[data-r4-segmented]').forEach((group) => {
                group.querySelectorAll('button').forEach((button) => {
                    button.addEventListener('click', function () {
                        applyStyle(group.dataset.r4Segmented, button.dataset.r4StyleValue);
                        hydrate(panel);
                    });
                });
            });

            panel.querySelectorAll('[data-r4-toggle-style]').forEach((button) => {
                button.addEventListener('click', function () {
                    const component = selected();
                    if (!component) return;
                    const prop = button.dataset.r4ToggleStyle;
                    const current = getStyleValue(component, prop);
                    const next = current === button.dataset.r4ToggleOn ? button.dataset.r4ToggleOff : button.dataset.r4ToggleOn;
                    applyStyle(prop, next);
                    hydrate(panel);
                });
            });

            panel.querySelector('[data-r4-typography-reset]')?.addEventListener('click', function () {
                resetTypography();
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

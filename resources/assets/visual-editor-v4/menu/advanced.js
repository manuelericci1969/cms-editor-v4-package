(function () {
    'use strict';

    const h = window.R4V4MenuHelpers;

    function editor() { return window.r4VisualEditorV4Instance || null; }
    function selected() { const e = editor(); return e ? e.getSelected() : null; }

    function parseInlineStyle(cssText) {
        const out = {};
        String(cssText || '').split(';').forEach((rule) => {
            const parts = rule.split(':');
            if (parts.length < 2) return;
            const prop = parts.shift().trim();
            const value = parts.join(':').trim();
            if (prop && value) out[prop] = value;
        });
        return out;
    }

    function hydrate(panel) {
        const component = selected();
        const attrs = component ? (component.getAttributes() || {}) : {};

        panel.querySelectorAll('[data-r4-attr]').forEach((field) => {
            field.value = attrs[field.dataset.r4Attr] || '';
        });

        const classesField = panel.querySelector('[data-r4-classes]');
        if (classesField && component) {
            classesField.value = component.getClasses().join(' ');
        } else if (classesField) {
            classesField.value = '';
        }
    }

    function applyAttr(name, value) {
        const component = selected();
        if (!component) return;
        const attrs = Object.assign({}, component.getAttributes() || {});
        if (value) attrs[name] = value;
        else delete attrs[name];
        component.setAttributes(attrs);
    }

    function applyClasses(value) {
        const component = selected();
        if (!component) return;
        const classes = String(value || '').split(/\s+/).map((item) => item.trim()).filter(Boolean);
        component.setClass(classes);
    }

    function resetAdvanced() {
        const component = selected();
        if (!component) return;
        const attrs = Object.assign({}, component.getAttributes() || {});
        delete attrs.id;
        delete attrs.title;
        delete attrs['aria-label'];
        component.setAttributes(attrs);
        component.setClass([]);
    }

    function bindSelectionRefresh(panel) {
        const instance = editor();
        if (!instance || panel.dataset.r4AdvancedSelectionBound === '1') return;
        panel.dataset.r4AdvancedSelectionBound = '1';
        instance.on('component:selected', function () { hydrate(panel); });
        instance.on('component:deselected', function () { hydrate(panel); });
    }

    window.R4V4SidebarMenu.register({
        key: 'advanced',
        label: 'Avanzate',
        order: 100,
        templateId: 'r4v4-menu-template-advanced',
        selectionOnly: true,
        mount(panel) {
            panel.innerHTML = h.templateHtml(this.templateId);

            panel.querySelectorAll('[data-r4-attr]').forEach((field) => {
                field.addEventListener('input', function () {
                    applyAttr(field.dataset.r4Attr, field.value.trim());
                });
            });

            panel.querySelector('[data-r4-classes]')?.addEventListener('input', function (event) {
                applyClasses(event.target.value);
            });

            panel.querySelector('[data-r4-advanced-apply-inline]')?.addEventListener('click', function () {
                const component = selected();
                const css = panel.querySelector('[data-r4-inline-style]')?.value || '';
                if (component) component.addStyle(parseInlineStyle(css));
            });

            panel.querySelector('[data-r4-advanced-reset]')?.addEventListener('click', function () {
                resetAdvanced();
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

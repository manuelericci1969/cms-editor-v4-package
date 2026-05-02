(function () {
    'use strict';

    const h = window.R4V4MenuHelpers;
    const EFFECT_PROPS = ['opacity', 'transform', 'transition', 'filter'];
    const PRESETS = {
        fade: { opacity: '.75', transition: 'opacity .25s ease' },
        lift: { transform: 'translateY(-8px)', transition: 'transform .25s ease, box-shadow .25s ease' },
        zoom: { transform: 'scale(1.04)', transition: 'transform .25s ease' }
    };

    function editor() { return window.r4VisualEditorV4Instance || null; }
    function selected() { const e = editor(); return e ? e.getSelected() : null; }
    function getStyleValue(component, prop) { return component ? ((component.getStyle() || {})[prop] || '') : ''; }
    function applyStyle(prop, value) { const component = selected(); if (component) component.addStyle({ [prop]: value }); forceSyncFields(); }

    function getAttrs(component) {
        return component && component.getAttributes ? (component.getAttributes() || {}) : {};
    }

    function getAnimationValues(panel) {
        return {
            type: panel.querySelector('[data-r4-animation-field="type"]')?.value || '',
            duration: panel.querySelector('[data-r4-animation-field="duration"]')?.value || '700',
            delay: panel.querySelector('[data-r4-animation-field="delay"]')?.value || '0',
            distance: panel.querySelector('[data-r4-animation-field="distance"]')?.value || '40'
        };
    }

    function forceSyncFields() {
        if (window.R4V4Animations && typeof window.R4V4Animations.syncFields === 'function') {
            window.R4V4Animations.syncFields();
            return;
        }

        const instance = editor();
        const cfg = window.R4VisualEditorV4 || {};
        if (!instance) return;

        const htmlField = cfg.htmlFieldId ? document.getElementById(cfg.htmlFieldId) : null;
        const cssField = cfg.cssFieldId ? document.getElementById(cfg.cssFieldId) : null;
        const jsonField = cfg.jsonFieldId ? document.getElementById(cfg.jsonFieldId) : null;

        try {
            if (htmlField && typeof instance.getHtml === 'function') htmlField.value = instance.getHtml();
            if (cssField && typeof instance.getCss === 'function') cssField.value = instance.getCss();
            if (jsonField && typeof instance.getProjectData === 'function') jsonField.value = JSON.stringify(instance.getProjectData());
        } catch (error) {
            console.warn('[R4 Editor V4] Sync campi animazioni non riuscito', error);
        }
    }

    function applyAnimationCssVars(component, values) {
        const el = component && component.getEl && component.getEl();
        if (!el) return;

        const duration = Math.max(100, parseInt(values.duration || '700', 10) || 700);
        const delay = Math.max(0, parseInt(values.delay || '0', 10) || 0);
        const distance = Math.max(0, parseInt(values.distance || '40', 10) || 40);

        el.style.setProperty('--r4-animation-duration', duration + 'ms');
        el.style.setProperty('--r4-animation-delay', delay + 'ms');
        el.style.setProperty('--r4-animation-distance', distance + 'px');
    }

    function applyStyleObject(styles) {
        const component = selected();
        if (component) component.addStyle(styles);
        forceSyncFields();
    }

    function resetEffects() {
        const reset = {};
        EFFECT_PROPS.forEach((prop) => { reset[prop] = ''; });
        applyStyleObject(reset);
    }

    function hydrate(panel) {
        const component = selected();
        panel.querySelectorAll('[data-r4-style-prop]').forEach((field) => {
            const value = getStyleValue(component, field.dataset.r4StyleProp);
            if (field.type === 'range') field.value = value || '1';
            else field.value = value;
        });
        hydrateAnimation(panel);
    }

    function hydrateAnimation(panel) {
        const component = selected();
        const attrs = getAttrs(component);
        const type = panel.querySelector('[data-r4-animation-field="type"]');
        const duration = panel.querySelector('[data-r4-animation-field="duration"]');
        const delay = panel.querySelector('[data-r4-animation-field="delay"]');
        const distance = panel.querySelector('[data-r4-animation-field="distance"]');
        const disabled = !component;

        [type, duration, delay, distance].forEach((field) => { if (field) field.disabled = disabled; });
        panel.querySelectorAll('[data-r4-animation-apply], [data-r4-animation-preview], [data-r4-animation-clear]').forEach((button) => {
            button.disabled = disabled;
        });

        if (!component) {
            if (type) type.value = '';
            if (duration) duration.value = '700';
            if (delay) delay.value = '0';
            if (distance) distance.value = '40';
            return;
        }

        if (type) type.value = attrs['data-r4-animation'] || attrs['data-anim'] || '';
        if (duration) duration.value = attrs['data-r4-animation-duration'] || attrs['data-anim-duration'] || '700';
        if (delay) delay.value = attrs['data-r4-animation-delay'] || attrs['data-anim-delay'] || '0';
        if (distance) distance.value = attrs['data-r4-animation-distance'] || attrs['data-anim-distance'] || '40';
        applyAnimationCssVars(component, getAnimationValues(panel));
    }

    function applyAnimation(panel) {
        const component = selected();
        if (!component) {
            alert('Seleziona prima un elemento nel canvas.');
            return;
        }

        const values = getAnimationValues(panel);

        if (window.R4V4Animations && typeof window.R4V4Animations.apply === 'function') {
            window.R4V4Animations.apply(values, component);
        } else {
            component.addAttributes({
                'data-r4-animation': values.type,
                'data-r4-animation-duration': values.type ? values.duration : '',
                'data-r4-animation-delay': values.type ? values.delay : '',
                'data-r4-animation-distance': values.type ? values.distance : ''
            });
            ['data-anim', 'data-anim-duration', 'data-anim-delay', 'data-anim-distance'].forEach((attr) => {
                if (typeof component.removeAttributes === 'function') component.removeAttributes(attr);
            });
            applyAnimationCssVars(component, values);
            forceSyncFields();
        }
    }

    function clearAnimation(panel) {
        const component = selected();
        if (!component) {
            alert('Seleziona prima un elemento nel canvas.');
            return;
        }

        if (window.R4V4Animations && typeof window.R4V4Animations.clear === 'function') {
            window.R4V4Animations.clear(component);
        } else {
            ['data-r4-animation', 'data-r4-animation-duration', 'data-r4-animation-delay', 'data-r4-animation-distance', 'data-anim', 'data-anim-duration', 'data-anim-delay', 'data-anim-distance']
                .forEach((attr) => { if (typeof component.removeAttributes === 'function') component.removeAttributes(attr); });
            forceSyncFields();
        }

        hydrateAnimation(panel);
    }

    function previewAnimation(panel) {
        const component = selected();
        if (!component) {
            alert('Seleziona prima un elemento nel canvas.');
            return;
        }

        const values = getAnimationValues(panel);
        applyAnimation(panel);

        if (window.R4V4Animations && typeof window.R4V4Animations.preview === 'function') {
            window.R4V4Animations.preview(values, component);
            return;
        }

        const el = component.getEl && component.getEl();
        if (!el) return;
        applyAnimationCssVars(component, values);
        el.classList.remove('r4-animation-visible', 'is-animated');
        void el.offsetWidth;
        el.classList.add('r4-animation-visible', 'is-animated');
    }

    function bindSelectionRefresh(panel) {
        const instance = editor();
        if (!instance || panel.dataset.r4EffectsSelectionBound === '1') return;
        panel.dataset.r4EffectsSelectionBound = '1';
        instance.on('component:selected', function () { hydrate(panel); });
        instance.on('component:deselected', function () { hydrate(panel); });
        instance.on('component:update', function () { hydrate(panel); });
    }

    function bindSubmitSync() {
        const cfg = window.R4VisualEditorV4 || {};
        const form = cfg.formId ? document.getElementById(cfg.formId) : null;
        if (!form || form.dataset.r4AnimationSubmitSync === '1') return;
        form.dataset.r4AnimationSubmitSync = '1';
        form.addEventListener('submit', function () { forceSyncFields(); }, true);
    }

    window.R4V4SidebarMenu.register({
        key: 'effects',
        label: 'Effetti',
        order: 90,
        templateId: 'r4v4-menu-template-effects',
        selectionOnly: true,
        mount(panel) {
            panel.innerHTML = h.templateHtml(this.templateId);
            bindSubmitSync();

            panel.querySelectorAll('[data-r4-style-prop]').forEach((field) => {
                field.addEventListener('input', function () { applyStyle(field.dataset.r4StyleProp, field.value.trim()); });
                field.addEventListener('change', function () { applyStyle(field.dataset.r4StyleProp, field.value.trim()); });
            });

            panel.querySelectorAll('[data-r4-animation-field]').forEach((field) => {
                field.addEventListener('change', function () { applyAnimation(panel); });
            });

            panel.querySelector('[data-r4-animation-apply]')?.addEventListener('click', function () { applyAnimation(panel); forceSyncFields(); });
            panel.querySelector('[data-r4-animation-preview]')?.addEventListener('click', function () { previewAnimation(panel); });
            panel.querySelector('[data-r4-animation-clear]')?.addEventListener('click', function () { clearAnimation(panel); });

            panel.querySelectorAll('[data-r4-effect-preset]').forEach((button) => {
                button.addEventListener('click', function () {
                    applyStyleObject(PRESETS[button.dataset.r4EffectPreset] || {});
                    hydrate(panel);
                });
            });

            panel.querySelector('[data-r4-effects-reset]')?.addEventListener('click', function () {
                resetEffects();
                hydrate(panel);
            });

            setTimeout(function () { hydrate(panel); bindSelectionRefresh(panel); bindSubmitSync(); }, 250);
        },
        onActivate(panel) {
            hydrate(panel);
            bindSelectionRefresh(panel);
            bindSubmitSync();
        }
    });

    document.addEventListener('DOMContentLoaded', function () {
        window.setTimeout(bindSubmitSync, 500);
        window.setTimeout(forceSyncFields, 1200);
    });
})();

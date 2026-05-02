(function () {
    'use strict';

    const h = window.R4V4MenuHelpers;
    const BACKGROUND_PROPS = ['background-color', 'background-image', 'background-size', 'background-position', 'background-repeat'];

    function editor() { return window.r4VisualEditorV4Instance || null; }
    function selected() { const e = editor(); return e ? e.getSelected() : null; }
    function getStyleValue(component, prop) { return component ? ((component.getStyle() || {})[prop] || '') : ''; }
    function applyStyle(prop, value) { const component = selected(); if (component) component.addStyle({ [prop]: value }); }

    function setBackgroundMediaTarget(mode = 'image') {
        const component = selected();
        if (!component) {
            alert('Seleziona prima il contenitore/div a cui vuoi applicare lo sfondo.');
            return false;
        }

        window.R4V4_BACKGROUND_MEDIA_MODE = mode;
        window.R4V4BackgroundMediaTarget = component;
        window.R4V4BackgroundSliderEffect = document.querySelector('[data-r4-bg-slider-effect]')?.value || 'fade';
        window.R4V4BackgroundSliderEffectDuration = document.querySelector('[data-r4-bg-slider-effect-duration]')?.value || '800';
        return true;
    }

    function selectedMediaUrl() {
        const active = document.querySelector('.r4v4-media-item.is-selected, .r4v4-media-item.is-active, .r4v4-media-item.active, [data-r4-media-url].is-selected, [data-r4-media-url].is-active, [data-r4-media-url].active');
        const url = active?.dataset?.r4MediaUrl || active?.dataset?.url || active?.querySelector('img')?.getAttribute('src') || '';
        return url.trim();
    }

    function attrs(component) {
        return component ? Object.assign({}, component.getAttributes() || {}) : {};
    }

    function setAttr(component, name, value) {
        if (!component) return;
        const current = attrs(component);
        if (value === null || value === '') delete current[name];
        else current[name] = value;
        component.setAttributes(current);
    }

    function resetBackground() {
        const component = selected();
        if (!component) return;
        const reset = {};
        BACKGROUND_PROPS.forEach((prop) => { reset[prop] = ''; });
        component.addStyle(reset);
    }

    function applyOverlay(panel) {
        const component = selected();
        if (!component) return;
        const color = panel.querySelector('[data-r4-bg-overlay-color]')?.value || '#000000';
        const opacity = panel.querySelector('[data-r4-bg-overlay-opacity]')?.value || '0.35';
        setAttr(component, 'data-r4-bg-overlay', '1');
        setAttr(component, 'data-r4-bg-overlay-color', color);
        setAttr(component, 'data-r4-bg-overlay-opacity', opacity);
        component.addStyle({ position: getStyleValue(component, 'position') || 'relative', overflow: 'hidden' });
    }

    function removeOverlay() {
        const component = selected();
        if (!component) return;
        setAttr(component, 'data-r4-bg-overlay', null);
        setAttr(component, 'data-r4-bg-overlay-color', null);
        setAttr(component, 'data-r4-bg-overlay-opacity', null);
    }

    function applySlider(panel) {
        const component = selected();
        if (!component) return;
        const raw = panel.querySelector('[data-r4-bg-slider-images]')?.value || '';
        const images = raw.split('\n').map((line) => line.trim()).filter(Boolean);
        const duration = panel.querySelector('[data-r4-bg-slider-duration]')?.value || '5000';
        const effect = panel.querySelector('[data-r4-bg-slider-effect]')?.value || 'fade';
        const effectDuration = panel.querySelector('[data-r4-bg-slider-effect-duration]')?.value || '800';
        if (!images.length) return;

        setAttr(component, 'data-r4-bg-slider', '1');
        setAttr(component, 'data-r4-bg-slider-images', JSON.stringify(images));
        setAttr(component, 'data-r4-bg-slider-duration', duration);
        setAttr(component, 'data-r4-bg-slider-effect', effect);
        setAttr(component, 'data-r4-bg-slider-effect-duration', effectDuration);
        component.addStyle({
            position: getStyleValue(component, 'position') || 'relative',
            overflow: 'hidden',
            'background-image': 'url(' + images[0] + ')',
            'background-size': getStyleValue(component, 'background-size') || 'cover',
            'background-position': getStyleValue(component, 'background-position') || 'center center',
            'background-repeat': 'no-repeat'
        });
    }

    function removeSlider() {
        const component = selected();
        if (!component) return;
        setAttr(component, 'data-r4-bg-slider', null);
        setAttr(component, 'data-r4-bg-slider-images', null);
        setAttr(component, 'data-r4-bg-slider-duration', null);
        setAttr(component, 'data-r4-bg-slider-effect', null);
        setAttr(component, 'data-r4-bg-slider-effect-duration', null);
    }

    function hydrate(panel) {
        const component = selected();
        const currentAttrs = attrs(component);

        panel.querySelectorAll('[data-r4-style-prop]').forEach((field) => {
            const value = getStyleValue(component, field.dataset.r4StyleProp);
            if (field.type === 'color') field.value = value && /^#[0-9a-f]{6}$/i.test(value) ? value : '#000000';
            else field.value = value;
        });

        const imageField = panel.querySelector('[data-r4-background-image]');
        if (imageField) {
            const bg = getStyleValue(component, 'background-image');
            const match = String(bg).match(/url\(["']?(.*?)["']?\)/);
            imageField.value = match ? match[1] : '';
        }

        const overlayColor = panel.querySelector('[data-r4-bg-overlay-color]');
        const overlayOpacity = panel.querySelector('[data-r4-bg-overlay-opacity]');
        if (overlayColor) overlayColor.value = currentAttrs['data-r4-bg-overlay-color'] || '#000000';
        if (overlayOpacity) overlayOpacity.value = currentAttrs['data-r4-bg-overlay-opacity'] || '0.35';

        const sliderImages = panel.querySelector('[data-r4-bg-slider-images]');
        const sliderDuration = panel.querySelector('[data-r4-bg-slider-duration]');
        const sliderEffect = panel.querySelector('[data-r4-bg-slider-effect]');
        const sliderEffectDuration = panel.querySelector('[data-r4-bg-slider-effect-duration]');
        if (sliderImages) {
            try {
                const images = JSON.parse(currentAttrs['data-r4-bg-slider-images'] || '[]');
                sliderImages.value = Array.isArray(images) ? images.join('\n') : '';
            } catch (e) {
                sliderImages.value = '';
            }
        }
        if (sliderDuration) sliderDuration.value = currentAttrs['data-r4-bg-slider-duration'] || '5000';
        if (sliderEffect) sliderEffect.value = currentAttrs['data-r4-bg-slider-effect'] || 'fade';
        if (sliderEffectDuration) sliderEffectDuration.value = currentAttrs['data-r4-bg-slider-effect-duration'] || '800';
    }

    function bindSelectionRefresh(panel) {
        const instance = editor();
        if (!instance || panel.dataset.r4BackgroundSelectionBound === '1') return;
        panel.dataset.r4BackgroundSelectionBound = '1';
        instance.on('component:selected', function () { hydrate(panel); });
        instance.on('component:deselected', function () { hydrate(panel); });
    }

    window.R4V4SidebarMenu.register({
        key: 'background',
        label: 'Sfondo',
        order: 70,
        templateId: 'r4v4-menu-template-background',
        selectionOnly: true,
        mount(panel) {
            panel.innerHTML = h.templateHtml(this.templateId);

            panel.querySelectorAll('[data-r4-style-prop]').forEach((field) => {
                field.addEventListener('input', function () { applyStyle(field.dataset.r4StyleProp, field.value.trim()); });
                field.addEventListener('change', function () { applyStyle(field.dataset.r4StyleProp, field.value.trim()); });
            });

            panel.querySelector('[data-r4-background-image]')?.addEventListener('input', function (event) {
                const value = event.target.value.trim();
                applyStyle('background-image', value ? 'url(' + value + ')' : '');
            });

            panel.querySelector('[data-r4-bg-open-media]')?.addEventListener('click', function () {
                if (!setBackgroundMediaTarget('image')) return;
                h.clickCommand('media');
            });

            panel.querySelector('[data-r4-bg-slider-open-media]')?.addEventListener('click', function () {
                if (!setBackgroundMediaTarget('slider')) return;
                h.clickCommand('media');
            });

            panel.querySelector('[data-r4-bg-use-selected-media]')?.addEventListener('click', function () {
                if (!setBackgroundMediaTarget('image')) return;
                const url = selectedMediaUrl();
                if (!url) return;
                const field = panel.querySelector('[data-r4-background-image]');
                if (field) field.value = url;
                applyStyle('background-image', 'url(' + url + ')');
                applyStyle('background-size', getStyleValue(selected(), 'background-size') || 'cover');
                applyStyle('background-position', getStyleValue(selected(), 'background-position') || 'center center');
                applyStyle('background-repeat', 'no-repeat');
                window.R4V4_BACKGROUND_MEDIA_MODE = false;
                window.R4V4BackgroundMediaTarget = null;
            });

            panel.querySelector('[data-r4-bg-overlay-apply]')?.addEventListener('click', function () {
                applyOverlay(panel);
            });

            panel.querySelector('[data-r4-bg-overlay-remove]')?.addEventListener('click', function () {
                removeOverlay();
                hydrate(panel);
            });

            panel.querySelector('[data-r4-bg-slider-apply]')?.addEventListener('click', function () {
                applySlider(panel);
            });

            panel.querySelector('[data-r4-bg-slider-remove]')?.addEventListener('click', function () {
                removeSlider();
                hydrate(panel);
            });

            panel.querySelector('[data-r4-gradient-apply]')?.addEventListener('click', function () {
                const from = panel.querySelector('[data-r4-gradient="from"]')?.value || '#000000';
                const to = panel.querySelector('[data-r4-gradient="to"]')?.value || '#ffffff';
                const direction = panel.querySelector('[data-r4-gradient="direction"]')?.value || '135deg';
                applyStyle('background-image', 'linear-gradient(' + direction + ', ' + from + ', ' + to + ')');
            });

            panel.querySelector('[data-r4-background-reset]')?.addEventListener('click', function () {
                resetBackground();
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

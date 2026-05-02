(function () {
    'use strict';

    function editor() {
        return window.r4VisualEditorV4Instance || null;
    }

    function selected() {
        const e = editor();
        return e && typeof e.getSelected === 'function' ? e.getSelected() : null;
    }

    function getAttrs(component) {
        return component && typeof component.getAttributes === 'function'
            ? (component.getAttributes() || {})
            : {};
    }

    function toNumber(value, fallback, min) {
        const parsed = parseInt(value, 10);
        if (!Number.isFinite(parsed)) return fallback;
        return Math.max(min, parsed);
    }

    function isTextEditing() {
        const e = editor();
        if (!e || !e.Canvas || !e.Canvas.getDocument) return false;

        const doc = e.Canvas.getDocument();
        if (!doc || !doc.activeElement) return false;

        const active = doc.activeElement;

        return !!(
            active &&
            (
                active.isContentEditable ||
                active.closest?.('[contenteditable="true"]') ||
                active.closest?.('.gjs-rte-toolbar') ||
                active.closest?.('.gjs-rte-actionbar')
            )
        );
    }

    function getValues(component, override) {
        const attrs = getAttrs(component);
        return Object.assign({
            type: attrs['data-r4-animation'] || '',
            duration: attrs['data-r4-animation-duration'] || '700',
            delay: attrs['data-r4-animation-delay'] || '0',
            distance: attrs['data-r4-animation-distance'] || '40'
        }, override || {});
    }

    function setAttr(component, key, value) {
        if (!component) return;
        const normalized = value === null || typeof value === 'undefined' ? '' : String(value).trim();
        const attrs = Object.assign({}, getAttrs(component));

        if (normalized) attrs[key] = normalized;
        else delete attrs[key];

        if (typeof component.setAttributes === 'function') component.setAttributes(attrs);
        if (typeof component.addAttributes === 'function' && normalized) component.addAttributes({ [key]: normalized });
        if (typeof component.removeAttributes === 'function' && !normalized) component.removeAttributes(key);

        const el = typeof component.getEl === 'function' ? component.getEl() : null;
        if (el) {
            if (normalized) el.setAttribute(key, normalized);
            else el.removeAttribute(key);
        }
    }

    function applyCssVars(component, values) {
        const el = component && typeof component.getEl === 'function' ? component.getEl() : null;
        if (!el) return;

        const duration = toNumber(values.duration || '700', 700, 100);
        const delay = toNumber(values.delay || '0', 0, 0);
        const distance = toNumber(values.distance || '40', 40, 0);

        el.style.setProperty('--r4-animation-duration', duration + 'ms');
        el.style.setProperty('--r4-animation-delay', delay + 'ms');
        el.style.setProperty('--r4-animation-distance', distance + 'px');
    }

    function syncFields(options) {
        if (!(options && options.force === true) && isTextEditing()) {
            return;
        }

        const e = editor();
        const cfg = window.R4VisualEditorV4 || {};
        if (!e) return;

        const htmlField = cfg.htmlFieldId ? document.getElementById(cfg.htmlFieldId) : null;
        const cssField = cfg.cssFieldId ? document.getElementById(cfg.cssFieldId) : null;
        const jsonField = cfg.jsonFieldId ? document.getElementById(cfg.jsonFieldId) : null;

        try {
            if (htmlField && typeof e.getHtml === 'function') htmlField.value = cleanVisualHtml(e.getHtml());
            if (cssField && typeof e.getCss === 'function') cssField.value = e.getCss();
            if (jsonField && typeof e.getProjectData === 'function') jsonField.value = JSON.stringify(e.getProjectData());
        } catch (error) {
            console.warn('[R4V4 Animations] sync failed', error);
        }
    }

    function scheduleSyncFields() {
        window.clearTimeout(window.__r4v4AnimationSyncTimer);
        window.__r4v4AnimationSyncTimer = window.setTimeout(function () {
            syncFields();
        }, 350);
    }

    function cleanVisualHtml(html) {
        return String(html || '')
            .replace(/^\s*<body\b[^>]*>/i, '')
            .replace(/<\/body>\s*$/i, '');
    }

    function apply(values, component) {
        const c = component || selected();
        if (!c) return;

        const v = getValues(c, values || {});
        const type = v.type || '';

        setAttr(c, 'data-r4-animation', type);
        setAttr(c, 'data-r4-animation-duration', type ? v.duration || '700' : '');
        setAttr(c, 'data-r4-animation-delay', type ? v.delay || '0' : '');
        setAttr(c, 'data-r4-animation-distance', type ? v.distance || '40' : '');

        ['data-anim', 'data-anim-duration', 'data-anim-delay', 'data-anim-distance'].forEach(function (attr) {
            setAttr(c, attr, '');
        });

        applyCssVars(c, v);

        const e = editor();
        if (e) {
            e.trigger('component:update', c);
            e.trigger('update');
        }
        syncFields({ force: true });
    }

    function clear(component) {
        const c = component || selected();
        if (!c) return;

        ['data-r4-animation', 'data-r4-animation-duration', 'data-r4-animation-delay', 'data-r4-animation-distance', 'data-anim', 'data-anim-duration', 'data-anim-delay', 'data-anim-distance'].forEach(function (attr) {
            setAttr(c, attr, '');
        });

        const el = typeof c.getEl === 'function' ? c.getEl() : null;
        if (el) {
            stopRunningPreview(el);
            el.classList.remove('r4-animation-visible', 'is-animated', 'r4-v4-editor-previewing');
            el.style.removeProperty('--r4-animation-duration');
            el.style.removeProperty('--r4-animation-delay');
            el.style.removeProperty('--r4-animation-distance');
            el.style.removeProperty('animation');
            el.style.removeProperty('clip-path');
            el.style.removeProperty('opacity');
            el.style.removeProperty('transform');
        }

        const e = editor();
        if (e) {
            e.trigger('component:update', c);
            e.trigger('update');
        }
        syncFields({ force: true });
    }

    function px(value) {
        return value + 'px';
    }

    function buildPreviewFrames(type, distance) {
        const d = px(distance);
        const half = px(Math.round(distance / 2));
        const neg = px(distance * -1);
        const negHalf = px(Math.round(distance / -2));

        switch (type) {
            case 'fade-out':
                return [{ opacity: 1 }, { opacity: 0 }];
            case 'fade-in':
                return [{ opacity: 0 }, { opacity: 1 }];
            case 'fade-down':
                return [{ opacity: 0, transform: 'translate3d(0,' + neg + ',0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }];
            case 'fade-left':
                return [{ opacity: 0, transform: 'translate3d(' + d + ',0,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }];
            case 'fade-right':
                return [{ opacity: 0, transform: 'translate3d(' + neg + ',0,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }];
            case 'slide-up':
                return [{ opacity: 1, transform: 'translate3d(0,' + d + ',0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }];
            case 'slide-down':
                return [{ opacity: 1, transform: 'translate3d(0,' + neg + ',0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }];
            case 'slide-left':
                return [{ opacity: 1, transform: 'translate3d(' + d + ',0,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }];
            case 'slide-right':
                return [{ opacity: 1, transform: 'translate3d(' + neg + ',0,0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }];
            case 'swipe-up':
                return [{ opacity: 0, clipPath: 'inset(100% 0 0 0)', transform: 'translate3d(0,' + half + ',0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'translate3d(0,0,0)' }];
            case 'swipe-down':
                return [{ opacity: 0, clipPath: 'inset(0 0 100% 0)', transform: 'translate3d(0,' + negHalf + ',0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'translate3d(0,0,0)' }];
            case 'swipe-left':
                return [{ opacity: 0, clipPath: 'inset(0 0 0 100%)', transform: 'translate3d(' + half + ',0,0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'translate3d(0,0,0)' }];
            case 'swipe-right':
                return [{ opacity: 0, clipPath: 'inset(0 100% 0 0)', transform: 'translate3d(' + negHalf + ',0,0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)', transform: 'translate3d(0,0,0)' }];
            case 'zoom-in':
                return [{ opacity: 0, transform: 'scale(.92)' }, { opacity: 1, transform: 'scale(1)' }];
            case 'zoom-out':
                return [{ opacity: 0, transform: 'scale(1.08)' }, { opacity: 1, transform: 'scale(1)' }];
            case 'flip-up':
                return [{ opacity: 0, transform: 'perspective(900px) rotateX(12deg) translate3d(0,' + d + ',0)' }, { opacity: 1, transform: 'perspective(900px) rotateX(0deg) translate3d(0,0,0)' }];
            case 'fade-up':
            default:
                return [{ opacity: 0, transform: 'translate3d(0,' + d + ',0)' }, { opacity: 1, transform: 'translate3d(0,0,0)' }];
        }
    }

    function stopRunningPreview(el) {
        if (el.__r4V4PreviewAnimation && typeof el.__r4V4PreviewAnimation.cancel === 'function') {
            try { el.__r4V4PreviewAnimation.cancel(); } catch (e) { /* noop */ }
        }
        el.__r4V4PreviewAnimation = null;
    }

    function preview(values, component) {
        const c = component || selected();
        if (!c || typeof c.getEl !== 'function') return;

        const v = getValues(c, values || {});
        if (!v.type) return;

        apply(v, c);

        const el = c.getEl();
        if (!el) return;

        applyCssVars(c, v);
        stopRunningPreview(el);

        const duration = toNumber(v.duration || '700', 700, 100);
        const delay = toNumber(v.delay || '0', 0, 0);
        const distance = toNumber(v.distance || '40', 40, 0);
        const frames = buildPreviewFrames(v.type, distance);

        el.classList.remove('r4-animation-visible', 'is-animated');
        el.classList.add('r4-v4-editor-previewing');
        el.style.animation = 'none';
        el.style.opacity = '';
        el.style.transform = '';
        el.style.clipPath = '';
        void el.offsetWidth;

        if (typeof el.animate === 'function') {
            const animation = el.animate(frames, {
                duration: duration,
                delay: delay,
                easing: 'cubic-bezier(.2,.75,.2,1)',
                fill: 'both'
            });

            el.__r4V4PreviewAnimation = animation;
            animation.onfinish = function () {
                el.classList.add('r4-animation-visible', 'is-animated');
                el.classList.remove('r4-v4-editor-previewing');
                stopRunningPreview(el);
                el.style.opacity = '';
                el.style.transform = '';
                el.style.clipPath = '';
            };
            animation.oncancel = function () {
                el.classList.remove('r4-v4-editor-previewing');
            };
            return;
        }

        const first = frames[0] || {};
        const last = frames[frames.length - 1] || {};
        Object.keys(first).forEach(function (key) { el.style[key] = first[key]; });
        window.setTimeout(function () {
            el.style.transition = 'opacity ' + duration + 'ms cubic-bezier(.2,.75,.2,1), transform ' + duration + 'ms cubic-bezier(.2,.75,.2,1), clip-path ' + duration + 'ms cubic-bezier(.2,.75,.2,1)';
            Object.keys(last).forEach(function (key) { el.style[key] = last[key]; });
        }, delay + 30);
        window.setTimeout(function () {
            el.classList.add('r4-animation-visible', 'is-animated');
            el.classList.remove('r4-v4-editor-previewing');
            el.style.transition = '';
            el.style.opacity = '';
            el.style.transform = '';
            el.style.clipPath = '';
        }, duration + delay + 160);
    }

    function bindFormSync() {
        const cfg = window.R4VisualEditorV4 || {};
        const form = cfg.formId ? document.getElementById(cfg.formId) : null;
        if (!form || form.dataset.r4V4AnimationCoreBound === '1') return;
        form.dataset.r4V4AnimationCoreBound = '1';
        form.addEventListener('submit', function () { syncFields({ force: true }); }, true);
    }

    function boot() {
        const e = editor();
        if (!e) return false;
        if (e.__r4V4AnimationsCoreBooted) return true;
        e.__r4V4AnimationsCoreBooted = true;

        e.on('component:selected', function (component) {
            applyCssVars(component, getValues(component));
        });
        e.on('component:update', function (component) {
            if (isTextEditing()) return;
            applyCssVars(component, getValues(component));
            scheduleSyncFields();
        });
        e.on('component:add', function () { window.setTimeout(scheduleSyncFields, 80); });
        e.on('component:remove', function () { window.setTimeout(scheduleSyncFields, 80); });
        e.on('rte:disable', function () { syncFields({ force: true }); });

        bindFormSync();
        syncFields({ force: true });
        return true;
    }

    window.R4V4Animations = {
        apply: apply,
        clear: clear,
        preview: preview,
        selected: selected,
        getValues: function () { return getValues(selected()); },
        syncFields: function () { syncFields({ force: true }); },
        cleanVisualHtml: cleanVisualHtml
    };

    document.addEventListener('DOMContentLoaded', function () {
        let attempts = 0;
        const timer = window.setInterval(function () {
            attempts += 1;
            if (boot() || attempts > 80) window.clearInterval(timer);
        }, 150);
    });
})();

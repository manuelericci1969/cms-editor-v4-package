(function () {
    'use strict';

    const ANIMATION_OPTIONS = [
        { value: '', label: 'Nessuna animazione' },
        { value: 'fade-in', label: 'Fade in' },
        { value: 'fade-out', label: 'Fade out' },
        { value: 'fade-up', label: 'Fade up' },
        { value: 'fade-down', label: 'Fade down' },
        { value: 'fade-left', label: 'Fade left' },
        { value: 'fade-right', label: 'Fade right' },
        { value: 'slide-up', label: 'Slide up' },
        { value: 'slide-down', label: 'Slide down' },
        { value: 'slide-left', label: 'Slide left' },
        { value: 'slide-right', label: 'Slide right' },
        { value: 'swipe-up', label: 'Swipe up' },
        { value: 'swipe-down', label: 'Swipe down' },
        { value: 'swipe-left', label: 'Swipe left' },
        { value: 'swipe-right', label: 'Swipe right' },
        { value: 'zoom-in', label: 'Zoom in' },
        { value: 'zoom-out', label: 'Zoom out' },
        { value: 'flip-up', label: 'Flip up' }
    ];

    function getEditor() {
        return window.r4VisualEditorV4Instance || null;
    }

    function selectedComponent() {
        const editor = getEditor();
        return editor && editor.getSelected ? editor.getSelected() : null;
    }

    function getAttr(component, key, fallback) {
        const attrs = component && component.getAttributes ? component.getAttributes() : {};
        return attrs[key] || fallback || '';
    }

    function setAttr(component, key, value) {
        if (!component || !component.getAttributes || !component.setAttributes) return;

        const attrs = Object.assign({}, component.getAttributes() || {});
        const normalized = value === null || typeof value === 'undefined' ? '' : String(value).trim();

        if (!normalized) {
            delete attrs[key];
        } else {
            attrs[key] = normalized;
        }

        component.setAttributes(attrs);
    }

    function findPanelTarget() {
        return document.getElementById('r4v4AnimationPanelHost') ||
            document.getElementById('r4v4-traits') ||
            document.getElementById('r4v4-styles') ||
            document.querySelector('.r4v4-sidebar-right') ||
            null;
    }

    function createPanel() {
        if (document.getElementById('r4v4AnimationPanel')) return true;

        const target = findPanelTarget();
        if (!target) return false;

        const panel = document.createElement('div');
        panel.id = 'r4v4AnimationPanel';
        panel.className = 'r4v4-animation-panel';
        panel.innerHTML = '' +
            '<div class="r4v4-animation-panel__title">Animazioni elemento</div>' +
            '<label>Tipo animazione<select id="r4v4AnimationType"></select></label>' +
            '<div class="r4v4-animation-grid">' +
                '<label>Durata ms<input type="number" id="r4v4AnimationDuration" min="100" max="5000" step="100" value="700"></label>' +
                '<label>Delay ms<input type="number" id="r4v4AnimationDelay" min="0" max="5000" step="100" value="0"></label>' +
            '</div>' +
            '<label>Distanza px<input type="number" id="r4v4AnimationDistance" min="0" max="300" step="5" value="40"></label>' +
            '<div class="r4v4-animation-actions">' +
                '<button type="button" class="r4v4-btn r4v4-btn-primary" id="r4v4AnimationApply">Applica</button>' +
                '<button type="button" class="r4v4-btn r4v4-btn-light" id="r4v4AnimationPreview">Preview</button>' +
                '<button type="button" class="r4v4-btn r4v4-btn-danger" id="r4v4AnimationClear">Rimuovi</button>' +
            '</div>' +
            '<p class="r4v4-animation-help">Seleziona immagine, blocco, testo o pulsante nel canvas e scegli l’effetto. I dati vengono salvati come attributi data-r4-animation e funzionano anche nel frontend pubblico.</p>';

        target.prepend(panel);

        const select = document.getElementById('r4v4AnimationType');
        ANIMATION_OPTIONS.forEach(function (option) {
            const el = document.createElement('option');
            el.value = option.value;
            el.textContent = option.label;
            select.appendChild(el);
        });

        bindPanelEvents();
        syncPanelFromSelected();
        return true;
    }

    function setPanelDisabled(disabled) {
        ['r4v4AnimationType', 'r4v4AnimationDuration', 'r4v4AnimationDelay', 'r4v4AnimationDistance', 'r4v4AnimationApply', 'r4v4AnimationPreview', 'r4v4AnimationClear']
            .forEach(function (id) {
                const el = document.getElementById(id);
                if (el) el.disabled = !!disabled;
            });
    }

    function syncPanelFromSelected() {
        const component = selectedComponent();
        const type = document.getElementById('r4v4AnimationType');
        const duration = document.getElementById('r4v4AnimationDuration');
        const delay = document.getElementById('r4v4AnimationDelay');
        const distance = document.getElementById('r4v4AnimationDistance');

        if (!type || !duration || !delay || !distance) return;

        if (!component) {
            type.value = '';
            duration.value = '700';
            delay.value = '0';
            distance.value = '40';
            setPanelDisabled(true);
            return;
        }

        setPanelDisabled(false);
        type.value = getAttr(component, 'data-r4-animation', '');
        duration.value = getAttr(component, 'data-r4-animation-duration', '700');
        delay.value = getAttr(component, 'data-r4-animation-delay', '0');
        distance.value = getAttr(component, 'data-r4-animation-distance', '40');
    }

    function applyAnimation() {
        const editor = getEditor();
        const component = selectedComponent();
        if (!component) {
            alert('Seleziona prima un elemento nel canvas.');
            return;
        }

        const type = document.getElementById('r4v4AnimationType').value;
        const duration = document.getElementById('r4v4AnimationDuration').value || '700';
        const delay = document.getElementById('r4v4AnimationDelay').value || '0';
        const distance = document.getElementById('r4v4AnimationDistance').value || '40';

        setAttr(component, 'data-r4-animation', type);
        setAttr(component, 'data-r4-animation-duration', type ? duration : '');
        setAttr(component, 'data-r4-animation-delay', type ? delay : '');
        setAttr(component, 'data-r4-animation-distance', type ? distance : '');

        if (editor) {
            editor.trigger('component:update', component);
            editor.trigger('update');
        }

        previewAnimation();
    }

    function clearAnimation() {
        const editor = getEditor();
        const component = selectedComponent();
        if (!component) {
            alert('Seleziona prima un elemento nel canvas.');
            return;
        }

        setAttr(component, 'data-r4-animation', '');
        setAttr(component, 'data-r4-animation-duration', '');
        setAttr(component, 'data-r4-animation-delay', '');
        setAttr(component, 'data-r4-animation-distance', '');

        if (editor) {
            editor.trigger('component:update', component);
            editor.trigger('update');
        }

        syncPanelFromSelected();
    }

    function previewAnimation() {
        const editor = getEditor();
        const component = selectedComponent();
        if (!editor || !component || !component.getEl) return;

        const el = component.getEl();
        if (!el) return;

        const type = getAttr(component, 'data-r4-animation', '');
        if (!type) return;

        el.classList.remove('r4-animate-preview');
        void el.offsetWidth;
        el.classList.add('r4-animate-preview');

        window.setTimeout(function () {
            el.classList.remove('r4-animate-preview');
        }, 1300);
    }

    function bindPanelEvents() {
        const apply = document.getElementById('r4v4AnimationApply');
        const preview = document.getElementById('r4v4AnimationPreview');
        const clear = document.getElementById('r4v4AnimationClear');
        const type = document.getElementById('r4v4AnimationType');

        if (apply) apply.addEventListener('click', applyAnimation);
        if (preview) preview.addEventListener('click', previewAnimation);
        if (clear) clear.addEventListener('click', clearAnimation);
        if (type) type.addEventListener('change', applyAnimation);
    }

    function boot() {
        if (!createPanel()) return false;

        const editor = getEditor();
        if (!editor) return false;

        if (editor.__r4v4AnimationsBooted) return true;
        editor.__r4v4AnimationsBooted = true;

        editor.on('component:selected', syncPanelFromSelected);
        editor.on('component:deselected', syncPanelFromSelected);
        editor.on('component:update', syncPanelFromSelected);
        editor.on('load', syncPanelFromSelected);
        syncPanelFromSelected();

        return true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        let attempts = 0;
        const timer = window.setInterval(function () {
            attempts++;
            if (boot() || attempts > 80) {
                window.clearInterval(timer);
            }
        }, 150);
    });
})();

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

(function () {
    'use strict';

    const GRID_CSS = `
.r4v4-section-grid {
    position: relative;
    overflow: hidden;
    margin-top: var(--r4-section-margin-top, 0px);
    margin-bottom: var(--r4-section-margin-bottom, 0px);
    padding-top: var(--r4-section-padding-top, 80px);
    padding-right: var(--r4-section-padding-right, 24px);
    padding-bottom: var(--r4-section-padding-bottom, 80px);
    padding-left: var(--r4-section-padding-left, 24px);
    background: var(--r4-section-background, #ffffff);
    min-height: var(--r4-section-min-height, auto);
}
.r4v4-section-grid-inner {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: var(--r4-section-max-width, 1180px);
    margin-left: auto;
    margin-right: auto;
    display: grid;
    grid-template-columns: repeat(var(--r4-section-columns-desktop, 3), minmax(0, 1fr));
    column-gap: var(--r4-section-column-gap, 32px);
    row-gap: var(--r4-section-row-gap, 32px);
    align-items: stretch;
}
.r4v4-section-column {
    min-width: 0;
    padding: var(--r4-column-padding, 28px);
    background: var(--r4-column-background, #ffffff);
    border: var(--r4-column-border, 1px solid #e5e7eb);
    border-radius: var(--r4-column-radius, 22px);
    box-shadow: var(--r4-column-shadow, 0 14px 35px rgba(15, 23, 42, .06));
}
@media (max-width: 991px) {
    .r4v4-section-grid-inner {
        grid-template-columns: repeat(var(--r4-section-columns-tablet, 2), minmax(0, 1fr));
    }
}
@media (max-width: 575px) {
    .r4v4-section-grid-inner {
        grid-template-columns: repeat(var(--r4-section-columns-mobile, 1), minmax(0, 1fr));
    }
}
`;

    function px(value, fallback) {
        const raw = String(value === null || typeof value === 'undefined' ? fallback : value).trim();
        if (!raw) return fallback + 'px';
        if (/^-?\d+(\.\d+)?$/.test(raw)) return raw + 'px';
        return raw;
    }

    function numberValue(value, fallback, min, max) {
        const parsed = parseInt(value, 10);
        if (!Number.isFinite(parsed)) return fallback;
        return Math.max(min, Math.min(max, parsed));
    }

    function cleanCss(value, fallback) {
        const raw = String(value || '').replace(/;/g, '').trim();
        return raw || fallback;
    }

    function addRuntimeCss(editor) {
        if (!editor || !editor.Css || typeof editor.Css.addRules !== 'function') return;
        const currentCss = typeof editor.getCss === 'function' ? editor.getCss() : '';
        if (currentCss && currentCss.indexOf('.r4v4-section-grid-inner') !== -1) return;
        editor.Css.addRules(GRID_CSS);
    }

    function sectionStyle(component) {
        return {
            '--r4-section-columns-desktop': String(numberValue(component.get('r4ColumnsDesktop'), 3, 1, 6)),
            '--r4-section-columns-tablet': String(numberValue(component.get('r4ColumnsTablet'), 2, 1, 4)),
            '--r4-section-columns-mobile': String(numberValue(component.get('r4ColumnsMobile'), 1, 1, 2)),
            '--r4-section-column-gap': px(component.get('r4ColumnGap'), 32),
            '--r4-section-row-gap': px(component.get('r4RowGap'), 32),
            '--r4-section-padding-top': px(component.get('r4PaddingTop'), 80),
            '--r4-section-padding-right': px(component.get('r4PaddingRight'), 24),
            '--r4-section-padding-bottom': px(component.get('r4PaddingBottom'), 80),
            '--r4-section-padding-left': px(component.get('r4PaddingLeft'), 24),
            '--r4-section-margin-top': px(component.get('r4MarginTop'), 0),
            '--r4-section-margin-bottom': px(component.get('r4MarginBottom'), 0),
            '--r4-section-max-width': px(component.get('r4MaxWidth'), 1180),
            '--r4-section-min-height': String(component.get('r4MinHeight') || 'auto'),
            '--r4-section-background': cleanCss(component.get('r4Background'), '#ffffff')
        };
    }

    function columnStyle(component) {
        return {
            '--r4-column-padding': px(component.get('r4ColumnPadding'), 28),
            '--r4-column-background': cleanCss(component.get('r4ColumnBackground'), '#ffffff'),
            '--r4-column-border': cleanCss(component.get('r4ColumnBorder'), '1px solid #e5e7eb'),
            '--r4-column-radius': px(component.get('r4ColumnRadius'), 22),
            '--r4-column-shadow': cleanCss(component.get('r4ColumnShadow'), '0 14px 35px rgba(15, 23, 42, .06)')
        };
    }

    function registerSectionGrid(editor) {
        if (!editor || editor.__r4SectionGridRegistered) return false;
        editor.__r4SectionGridRegistered = true;
        addRuntimeCss(editor);

        editor.DomComponents.addType('r4-section-column', {
            model: {
                defaults: {
                    name: 'Colonna avanzata',
                    tagName: 'div',
                    draggable: '.r4v4-section-grid-inner',
                    droppable: true,
                    selectable: true,
                    hoverable: true,
                    attributes: { class: 'r4v4-section-column', 'data-r4-component': 'section-column' },
                    r4ColumnPadding: 28,
                    r4ColumnBackground: '#ffffff',
                    r4ColumnBorder: '1px solid #e5e7eb',
                    r4ColumnRadius: 22,
                    r4ColumnShadow: '0 14px 35px rgba(15, 23, 42, .06)',
                    traits: [
                        { type: 'number', name: 'r4ColumnPadding', label: 'Padding colonna', changeProp: true, min: 0, max: 200 },
                        { type: 'text', name: 'r4ColumnBackground', label: 'Sfondo colonna', changeProp: true },
                        { type: 'text', name: 'r4ColumnBorder', label: 'Bordo colonna', changeProp: true },
                        { type: 'number', name: 'r4ColumnRadius', label: 'Radius colonna', changeProp: true, min: 0, max: 120 },
                        { type: 'text', name: 'r4ColumnShadow', label: 'Ombra colonna', changeProp: true }
                    ]
                },
                init() {
                    this.listenTo(this, 'change:r4ColumnPadding change:r4ColumnBackground change:r4ColumnBorder change:r4ColumnRadius change:r4ColumnShadow', this.applyR4ColumnStyle);
                    this.applyR4ColumnStyle();
                },
                applyR4ColumnStyle() { this.addStyle(columnStyle(this)); }
            }
        });

        editor.DomComponents.addType('r4-section-grid', {
            model: {
                defaults: {
                    name: 'Sezione avanzata',
                    tagName: 'section',
                    droppable: '.r4v4-section-grid-inner',
                    selectable: true,
                    hoverable: true,
                    attributes: { class: 'r4v4-section-grid', 'data-r4-component': 'section-grid', 'data-r4-animation': 'none' },
                    r4ColumnsDesktop: 3,
                    r4ColumnsTablet: 2,
                    r4ColumnsMobile: 1,
                    r4ColumnGap: 32,
                    r4RowGap: 32,
                    r4PaddingTop: 80,
                    r4PaddingRight: 24,
                    r4PaddingBottom: 80,
                    r4PaddingLeft: 24,
                    r4MarginTop: 0,
                    r4MarginBottom: 0,
                    r4MaxWidth: 1180,
                    r4MinHeight: 'auto',
                    r4Background: '#ffffff',
                    traits: [
                        { type: 'number', name: 'r4ColumnsDesktop', label: 'Colonne desktop', changeProp: true, min: 1, max: 6 },
                        { type: 'number', name: 'r4ColumnsTablet', label: 'Colonne tablet', changeProp: true, min: 1, max: 4 },
                        { type: 'number', name: 'r4ColumnsMobile', label: 'Colonne mobile', changeProp: true, min: 1, max: 2 },
                        { type: 'number', name: 'r4ColumnGap', label: 'Distanza colonne', changeProp: true, min: 0, max: 200 },
                        { type: 'number', name: 'r4RowGap', label: 'Distanza righe', changeProp: true, min: 0, max: 200 },
                        { type: 'number', name: 'r4PaddingTop', label: 'Padding top', changeProp: true, min: 0, max: 300 },
                        { type: 'number', name: 'r4PaddingRight', label: 'Padding right', changeProp: true, min: 0, max: 300 },
                        { type: 'number', name: 'r4PaddingBottom', label: 'Padding bottom', changeProp: true, min: 0, max: 300 },
                        { type: 'number', name: 'r4PaddingLeft', label: 'Padding left', changeProp: true, min: 0, max: 300 },
                        { type: 'number', name: 'r4MarginTop', label: 'Distanza top', changeProp: true, min: -200, max: 300 },
                        { type: 'number', name: 'r4MarginBottom', label: 'Margine bottom', changeProp: true, min: -200, max: 300 },
                        { type: 'number', name: 'r4MaxWidth', label: 'Larghezza max', changeProp: true, min: 320, max: 2400 },
                        { type: 'text', name: 'r4MinHeight', label: 'Altezza minima', changeProp: true },
                        { type: 'text', name: 'r4Background', label: 'Sfondo / gradiente', changeProp: true },
                        {
                            type: 'select',
                            name: 'data-r4-animation',
                            label: 'Animazione',
                            options: [
                                { id: 'none', name: 'Nessuna' },
                                { id: 'fade-in', name: 'Fade in' },
                                { id: 'fade-up', name: 'Fade up' },
                                { id: 'fade-down', name: 'Fade down' },
                                { id: 'slide-left', name: 'Slide left' },
                                { id: 'slide-right', name: 'Slide right' },
                                { id: 'zoom-in', name: 'Zoom in' }
                            ]
                        }
                    ],
                    components: [
                        {
                            tagName: 'div',
                            attributes: { class: 'r4v4-section-grid-inner' },
                            draggable: false,
                            droppable: '[data-r4-component="section-column"]',
                            components: [
                                { type: 'r4-section-column', components: '<h3 style="font-size:26px;font-weight:900;letter-spacing:-.02em;margin:0 0 12px;color:#111827;">Colonna 1</h3><p style="font-size:16px;line-height:1.7;color:#64748b;margin:0 0 18px;">Inserisci testo, immagini, slider, bottoni o altri elementi dentro questa colonna.</p><a href="#" style="display:inline-block;padding:12px 18px;border-radius:12px;background:#0d6efd;color:#ffffff;text-decoration:none;font-weight:900;">Pulsante</a>' },
                                { type: 'r4-section-column', components: '<h3 style="font-size:26px;font-weight:900;letter-spacing:-.02em;margin:0 0 12px;color:#111827;">Colonna 2</h3><p style="font-size:16px;line-height:1.7;color:#64748b;margin:0;">Puoi selezionare la colonna e modificarne sfondo, spaziature, bordo e contenuto.</p>' },
                                { type: 'r4-section-column', components: '<img src="https://placehold.co/700x420?text=Immagine" alt="" style="width:100%;height:220px;object-fit:cover;border-radius:18px;display:block;margin-bottom:18px;"><h3 style="font-size:26px;font-weight:900;letter-spacing:-.02em;margin:0 0 12px;color:#111827;">Colonna 3</h3><p style="font-size:16px;line-height:1.7;color:#64748b;margin:0;">Questa colonna può contenere immagini, testo, pulsanti e componenti media.</p>' }
                            ]
                        }
                    ]
                },
                init() {
                    this.listenTo(this, 'change:r4ColumnsDesktop change:r4ColumnsTablet change:r4ColumnsMobile change:r4ColumnGap change:r4RowGap change:r4PaddingTop change:r4PaddingRight change:r4PaddingBottom change:r4PaddingLeft change:r4MarginTop change:r4MarginBottom change:r4MaxWidth change:r4MinHeight change:r4Background', this.applyR4SectionStyle);
                    this.applyR4SectionStyle();
                },
                applyR4SectionStyle() { this.addStyle(sectionStyle(this)); }
            }
        });

        editor.BlockManager.add('r4v4-section-grid', {
            label: 'Sezione avanzata',
            category: 'Layout',
            media: '<span class="r4v4-block-icon">▦</span>',
            content: { type: 'r4-section-grid' }
        });

        return true;
    }

    function bootSectionGrid() {
        const editor = window.r4VisualEditorV4Instance || null;
        if (!editor) return false;
        return registerSectionGrid(editor);
    }

    document.addEventListener('DOMContentLoaded', function () {
        let attempts = 0;
        const timer = window.setInterval(function () {
            attempts++;
            if (bootSectionGrid() || attempts > 80) window.clearInterval(timer);
        }, 150);
    });
})();

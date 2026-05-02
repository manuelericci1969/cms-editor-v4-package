(function () {
    'use strict';

    const STYLE_ID = 'r4v4-section-grid-runtime-css';

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
        if (!editor || editor.__r4SectionGridRegistered) return;
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
                    attributes: {
                        class: 'r4v4-section-column',
                        'data-r4-component': 'section-column'
                    },
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
                applyR4ColumnStyle() {
                    this.addStyle(columnStyle(this));
                }
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
                    attributes: {
                        class: 'r4v4-section-grid',
                        'data-r4-component': 'section-grid',
                        'data-r4-animation': 'none'
                    },
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
                                {
                                    type: 'r4-section-column',
                                    components: '<h3 style="font-size:26px;font-weight:900;letter-spacing:-.02em;margin:0 0 12px;color:#111827;">Colonna 1</h3><p style="font-size:16px;line-height:1.7;color:#64748b;margin:0 0 18px;">Inserisci testo, immagini, slider, bottoni o altri elementi dentro questa colonna.</p><a href="#" style="display:inline-block;padding:12px 18px;border-radius:12px;background:#0d6efd;color:#ffffff;text-decoration:none;font-weight:900;">Pulsante</a>'
                                },
                                {
                                    type: 'r4-section-column',
                                    components: '<h3 style="font-size:26px;font-weight:900;letter-spacing:-.02em;margin:0 0 12px;color:#111827;">Colonna 2</h3><p style="font-size:16px;line-height:1.7;color:#64748b;margin:0;">Puoi selezionare la colonna e modificarne sfondo, spaziature, bordo e contenuto.</p>'
                                },
                                {
                                    type: 'r4-section-column',
                                    components: '<img src="https://placehold.co/700x420?text=Immagine" alt="" style="width:100%;height:220px;object-fit:cover;border-radius:18px;display:block;margin-bottom:18px;"><h3 style="font-size:26px;font-weight:900;letter-spacing:-.02em;margin:0 0 12px;color:#111827;">Colonna 3</h3><p style="font-size:16px;line-height:1.7;color:#64748b;margin:0;">Questa colonna può contenere immagini, testo, pulsanti e componenti media.</p>'
                                }
                            ]
                        }
                    ]
                },
                init() {
                    this.listenTo(this, 'change:r4ColumnsDesktop change:r4ColumnsTablet change:r4ColumnsMobile change:r4ColumnGap change:r4RowGap change:r4PaddingTop change:r4PaddingRight change:r4PaddingBottom change:r4PaddingLeft change:r4MarginTop change:r4MarginBottom change:r4MaxWidth change:r4MinHeight change:r4Background', this.applyR4SectionStyle);
                    this.applyR4SectionStyle();
                },
                applyR4SectionStyle() {
                    this.addStyle(sectionStyle(this));
                }
            }
        });

        editor.BlockManager.add('r4v4-section-grid', {
            label: 'Sezione avanzata',
            category: 'Layout',
            media: '<span class="r4v4-block-icon">▦</span>',
            content: { type: 'r4-section-grid' }
        });
    }

    function patchGrapesInit() {
        if (!window.grapesjs || typeof window.grapesjs.init !== 'function' || window.grapesjs.__r4SectionGridPatched) return;
        const originalInit = window.grapesjs.init.bind(window.grapesjs);
        window.grapesjs.__r4SectionGridPatched = true;
        window.grapesjs.init = function () {
            const editor = originalInit.apply(window.grapesjs, arguments);
            registerSectionGrid(editor);
            window.r4VisualEditorV4Instance = editor;
            return editor;
        };
    }

    patchGrapesInit();
    document.addEventListener('DOMContentLoaded', patchGrapesInit);
})();

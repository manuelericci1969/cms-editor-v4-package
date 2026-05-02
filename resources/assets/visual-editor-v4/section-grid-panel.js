(function () {
    'use strict';

    const SECTION_PROPS = [
        ['r4ColumnsDesktop', 'Colonne desktop', 'number'],
        ['r4ColumnsTablet', 'Colonne tablet', 'number'],
        ['r4ColumnsMobile', 'Colonne mobile', 'number'],
        ['r4ColumnGap', 'Distanza colonne', 'number'],
        ['r4RowGap', 'Distanza righe', 'number'],
        ['r4PaddingTop', 'Padding top', 'number'],
        ['r4PaddingRight', 'Padding right', 'number'],
        ['r4PaddingBottom', 'Padding bottom', 'number'],
        ['r4PaddingLeft', 'Padding left', 'number'],
        ['r4MarginTop', 'Distanza top', 'number'],
        ['r4MarginBottom', 'Margine bottom', 'number'],
        ['r4MaxWidth', 'Larghezza max', 'number'],
        ['r4MinHeight', 'Altezza minima', 'text'],
        ['r4Background', 'Sfondo / gradiente', 'text']
    ];

    const COLUMN_PROPS = [
        ['r4ColumnPadding', 'Padding colonna', 'number'],
        ['r4ColumnBackground', 'Sfondo colonna', 'text'],
        ['r4ColumnBorder', 'Bordo colonna', 'text'],
        ['r4ColumnRadius', 'Radius colonna', 'number'],
        ['r4ColumnShadow', 'Ombra colonna', 'text']
    ];

    function editor() {
        return window.r4VisualEditorV4Instance || null;
    }

    function selected() {
        const instance = editor();
        return instance && instance.getSelected ? instance.getSelected() : null;
    }

    function componentKind(component) {
        if (!component) return '';
        const type = component.get ? component.get('type') : '';
        const attrs = component.getAttributes ? component.getAttributes() : {};
        if (type === 'r4-section-grid' || attrs['data-r4-component'] === 'section-grid') return 'section';
        if (type === 'r4-section-column' || attrs['data-r4-component'] === 'section-column') return 'column';
        return '';
    }

    function panelTarget() {
        const blocks = document.getElementById('r4v4-blocks');
        if (blocks && blocks.parentElement) return blocks.parentElement;
        return document.querySelector('.r4v4-sidebar-left') || document.body;
    }

    function fieldHtml(prop, label, type) {
        return '' +
            '<label class="r4v4-section-grid-panel__field">' +
                '<span>' + label + '</span>' +
                '<input type="' + type + '" data-r4-section-grid-prop="' + prop + '">' +
            '</label>';
    }

    function createPanel() {
        if (document.getElementById('r4v4SectionGridPanel')) return true;
        const target = panelTarget();
        if (!target) return false;

        const panel = document.createElement('div');
        panel.id = 'r4v4SectionGridPanel';
        panel.className = 'r4v4-section-grid-panel';
        panel.hidden = true;
        panel.innerHTML = '' +
            '<style>' +
                '.r4v4-section-grid-panel{margin:10px 0 14px;padding:14px;border:1px solid rgba(148,163,184,.24);border-radius:18px;background:linear-gradient(180deg,#111827,#0b1220);color:#e5e7eb;box-shadow:0 16px 36px rgba(0,0,0,.22)}' +
                '.r4v4-section-grid-panel__title{font-size:12px;font-weight:900;text-transform:uppercase;letter-spacing:.08em;margin-bottom:6px;color:#fff}' +
                '.r4v4-section-grid-panel__hint{font-size:11px;line-height:1.45;color:#94a3b8;margin:0 0 12px}' +
                '.r4v4-section-grid-panel__grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
                '.r4v4-section-grid-panel__field{display:flex;flex-direction:column;gap:4px;font-size:10px;font-weight:800;color:#cbd5e1}' +
                '.r4v4-section-grid-panel__field input,.r4v4-section-grid-panel__field select{width:100%;height:34px;border-radius:10px;border:1px solid rgba(148,163,184,.32);background:#020617;color:#fff;padding:0 9px;font-size:11px;outline:none}' +
                '.r4v4-section-grid-panel__field--wide{grid-column:1/-1}' +
                '.r4v4-section-grid-panel__actions{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}' +
                '.r4v4-section-grid-panel__btn{border:0;border-radius:10px;padding:9px 10px;background:#2563eb;color:#fff;font-size:11px;font-weight:900;cursor:pointer}' +
                '.r4v4-section-grid-panel__btn.secondary{background:#334155}' +
                '.r4v4-section-grid-panel__empty{font-size:11px;line-height:1.5;color:#94a3b8;margin:0}' +
            '</style>' +
            '<div class="r4v4-section-grid-panel__title" data-r4-section-grid-title>Sezione avanzata</div>' +
            '<p class="r4v4-section-grid-panel__hint" data-r4-section-grid-hint>Seleziona una sezione avanzata o una colonna per modificare layout e stile.</p>' +
            '<div class="r4v4-section-grid-panel__grid" data-r4-section-grid-fields></div>' +
            '<div class="r4v4-section-grid-panel__actions">' +
                '<button type="button" class="r4v4-section-grid-panel__btn" data-r4-section-grid-add-column>Aggiungi colonna</button>' +
                '<button type="button" class="r4v4-section-grid-panel__btn secondary" data-r4-section-grid-select-parent>Seleziona sezione</button>' +
            '</div>';

        target.parentElement ? target.parentElement.insertBefore(panel, target.nextSibling) : target.prepend(panel);
        bindPanel(panel);
        return true;
    }

    function renderFields(panel, kind) {
        const fields = panel.querySelector('[data-r4-section-grid-fields]');
        if (!fields) return;
        const props = kind === 'section' ? SECTION_PROPS : COLUMN_PROPS;
        fields.innerHTML = props.map(function (item) {
            const wide = item[2] === 'text' ? ' r4v4-section-grid-panel__field--wide' : '';
            return fieldHtml(item[0], item[1], item[2]).replace('r4v4-section-grid-panel__field', 'r4v4-section-grid-panel__field' + wide);
        }).join('');
    }

    function readValue(component, prop) {
        const value = component && component.get ? component.get(prop) : '';
        return value === null || typeof value === 'undefined' ? '' : String(value);
    }

    function writeValue(component, prop, value) {
        if (!component || !component.set) return;
        component.set(prop, value);
        if (typeof component.trigger === 'function') component.trigger('change:' + prop, component, value);
        const instance = editor();
        if (instance && typeof instance.trigger === 'function') instance.trigger('update');
    }

    function syncPanel() {
        const panel = document.getElementById('r4v4SectionGridPanel');
        if (!panel) return;

        const component = selected();
        const kind = componentKind(component);

        if (!kind) {
            panel.hidden = true;
            return;
        }

        panel.hidden = false;
        panel.dataset.kind = kind;
        panel.dataset.cid = component.cid || '';

        const title = panel.querySelector('[data-r4-section-grid-title]');
        const hint = panel.querySelector('[data-r4-section-grid-hint]');
        const addBtn = panel.querySelector('[data-r4-section-grid-add-column]');
        const parentBtn = panel.querySelector('[data-r4-section-grid-select-parent]');

        if (title) title.textContent = kind === 'section' ? 'Sezione avanzata' : 'Colonna avanzata';
        if (hint) hint.textContent = kind === 'section'
            ? 'Gestisci colonne, spaziature, sfondo e responsive della sezione selezionata.'
            : 'Gestisci sfondo, padding, bordo, radius e ombra della colonna selezionata.';
        if (addBtn) addBtn.style.display = kind === 'section' ? '' : 'none';
        if (parentBtn) parentBtn.style.display = kind === 'column' ? '' : 'none';

        renderFields(panel, kind);
        panel.querySelectorAll('[data-r4-section-grid-prop]').forEach(function (field) {
            const prop = field.getAttribute('data-r4-section-grid-prop');
            field.value = readValue(component, prop);
        });
    }

    function bindPanel(panel) {
        panel.addEventListener('input', function (event) {
            const field = event.target.closest('[data-r4-section-grid-prop]');
            if (!field) return;
            const component = selected();
            if (!componentKind(component)) return;
            writeValue(component, field.getAttribute('data-r4-section-grid-prop'), field.value);
        });

        panel.addEventListener('change', function (event) {
            const field = event.target.closest('[data-r4-section-grid-prop]');
            if (!field) return;
            const component = selected();
            if (!componentKind(component)) return;
            writeValue(component, field.getAttribute('data-r4-section-grid-prop'), field.value);
        });

        panel.querySelector('[data-r4-section-grid-add-column]')?.addEventListener('click', function () {
            const component = selected();
            if (componentKind(component) !== 'section') return;
            const inner = component.find('.r4v4-section-grid-inner')[0];
            if (!inner) return;
            inner.append({
                type: 'r4-section-column',
                components: '<h3 style="font-size:26px;font-weight:900;letter-spacing:-.02em;margin:0 0 12px;color:#111827;">Nuova colonna</h3><p style="font-size:16px;line-height:1.7;color:#64748b;margin:0;">Inserisci qui il contenuto della nuova colonna.</p>'
            });
            const instance = editor();
            if (instance && typeof instance.trigger === 'function') instance.trigger('update');
        });

        panel.querySelector('[data-r4-section-grid-select-parent]')?.addEventListener('click', function () {
            const component = selected();
            if (componentKind(component) !== 'column') return;
            const section = component.closest('[data-r4-component="section-grid"]');
            const instance = editor();
            if (section && instance && instance.select) instance.select(section);
        });
    }

    function bootPanel() {
        if (!createPanel()) return false;
        const instance = editor();
        if (!instance) return false;
        if (instance.__r4SectionGridPanelBooted) return true;
        instance.__r4SectionGridPanelBooted = true;
        instance.on('component:selected', syncPanel);
        instance.on('component:deselected', syncPanel);
        instance.on('component:update', syncPanel);
        instance.on('load', syncPanel);
        syncPanel();
        return true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        let attempts = 0;
        const timer = window.setInterval(function () {
            attempts++;
            if (bootPanel() || attempts > 80) window.clearInterval(timer);
        }, 150);
    });
})();

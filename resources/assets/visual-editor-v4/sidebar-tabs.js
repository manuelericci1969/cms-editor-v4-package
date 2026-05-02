(function () {
    'use strict';

    window.R4V4_DISABLE_PAGE_SETTINGS_DRAWER = true;

    const cfg = window.R4VisualEditorV4 || {};

    const TAB_DEFINITIONS = [
        { key: 'page', label: 'Pagina' },
        { key: 'widgets', label: 'Widget' },
        { key: 'elements', label: 'Elementi' },
        { key: 'style', label: 'Stile', selectionOnly: true }
    ];

    const ELEMENT_CATEGORIES = ['layout', 'base', 'media'];
    const WIDGET_CATEGORIES = ['marketing', 'interattivi', 'crewlive', 'pro', 'widget'];

    function byId(id) {
        return id ? document.getElementById(id) : null;
    }

    function normalize(value) {
        return String(value || '')
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function firstField(name) {
        return document.querySelector('[name="' + name + '"]');
    }

    function clickCommand(command) {
        const button = document.querySelector('[data-r4v4-command="' + command + '"]');
        if (button) button.click();
    }

    function setPanelValue(panel, selector, value) {
        const field = panel.querySelector(selector);
        if (field) field.value = value === null || typeof value === 'undefined' ? '' : String(value);
    }

    function getPanelValue(panel, selector, fallback = '') {
        const field = panel.querySelector(selector);
        return field ? String(field.value ?? '') : String(fallback ?? '');
    }

    function setPanelChecked(panel, selector, value) {
        const field = panel.querySelector(selector);
        if (field) field.checked = !!value;
    }

    function getPanelChecked(panel, selector, fallback = false) {
        const field = panel.querySelector(selector);
        return field ? field.checked : !!fallback;
    }

    function syncEditorFieldsBeforeSubmit() {
        const editor = window.r4VisualEditorV4Instance;
        if (!editor) return;

        const htmlField = byId(cfg.htmlFieldId || 'visual_html');
        const cssField = byId(cfg.cssFieldId || 'visual_css');
        const jsonField = byId(cfg.jsonFieldId || 'visual_json');

        if (htmlField) htmlField.value = editor.getHtml();
        if (cssField) cssField.value = editor.getCss();
        if (jsonField) jsonField.value = JSON.stringify(editor.getProjectData());
    }

    function flash(panel, message, type = 'ok') {
        const box = panel.querySelector('[data-r4-left-page-status]');
        if (!box) return;

        box.textContent = message;
        box.className = 'r4v4-left-page-status is-' + type;
        window.clearTimeout(panel._r4LeftPageStatusTimer);
        panel._r4LeftPageStatusTimer = window.setTimeout(function () {
            box.textContent = '';
            box.className = 'r4v4-left-page-status';
        }, 2600);
    }

    function hydratePagePanel(panel) {
        const settings = cfg.pageSettings || {};
        const titleField = byId('pageTitleFieldV4');
        const statusField = byId(cfg.statusFieldId || 'statusFieldV4');

        setPanelValue(panel, '#r4LeftPageTitle', titleField?.value || '');
        setPanelValue(panel, '#r4LeftPageSlug', firstField('slug')?.value || '');
        setPanelValue(panel, '#r4LeftPageExcerpt', firstField('excerpt')?.value || '');
        setPanelValue(panel, '#r4LeftPagePublishedAt', firstField('published_at')?.value || '');
        setPanelValue(panel, '#r4LeftPageStatus', statusField?.value || 'draft');
        setPanelChecked(panel, '#r4LeftPageHomepage', String(firstField('is_homepage')?.value || '0') === '1');

        setPanelValue(panel, '#r4LeftMetaTitle', settings.metaTitle || '');
        setPanelValue(panel, '#r4LeftMetaDescription', settings.metaDescription || '');
        setPanelValue(panel, '#r4LeftMetaKeywords', settings.metaKeywords || '');

        setPanelChecked(panel, '#r4LeftShowTitle', settings.showTitle !== false);
        setPanelChecked(panel, '#r4LeftShowExcerpt', settings.showExcerpt === true);
        setPanelChecked(panel, '#r4LeftShowPubdate', settings.showPubdate !== false);
        setPanelChecked(panel, '#r4LeftShowAuthor', settings.showAuthor !== false);
        setPanelChecked(panel, '#r4LeftShowBreadcrumbs', settings.showBreadcrumbs !== false);

        setPanelValue(panel, '#r4LeftLayoutWidth', settings.layoutWidth || 'standard');
        setPanelValue(panel, '#r4LeftLayoutGutter', typeof settings.layoutGutter === 'undefined' ? '24' : settings.layoutGutter);
        setPanelValue(panel, '#r4LeftLayoutTop', typeof settings.layoutTop === 'undefined' ? '0' : settings.layoutTop);
    }

    function applyPagePanel(panel) {
        const titleField = byId('pageTitleFieldV4');
        const statusField = byId(cfg.statusFieldId || 'statusFieldV4');
        const title = getPanelValue(panel, '#r4LeftPageTitle').trim();
        const slug = getPanelValue(panel, '#r4LeftPageSlug').trim();

        if (titleField) titleField.value = title || titleField.value || 'Senza titolo';
        if (firstField('slug')) firstField('slug').value = slug;
        if (firstField('excerpt')) firstField('excerpt').value = getPanelValue(panel, '#r4LeftPageExcerpt');
        if (firstField('published_at')) firstField('published_at').value = getPanelValue(panel, '#r4LeftPagePublishedAt');
        if (statusField) statusField.value = getPanelValue(panel, '#r4LeftPageStatus', statusField.value || 'draft');
        if (firstField('is_homepage')) firstField('is_homepage').value = getPanelChecked(panel, '#r4LeftPageHomepage') ? '1' : '0';

        const subtitle = document.querySelector('.r4v4-subtitle');
        if (subtitle && titleField) subtitle.textContent = titleField.value || 'Senza titolo';
    }

    function savePagePanel(panel) {
        const form = byId(cfg.formId || 'pageFormV4');
        if (!form) return;

        applyPagePanel(panel);
        syncEditorFieldsBeforeSubmit();
        flash(panel, 'Salvataggio in corso...');

        if (typeof form.requestSubmit === 'function') form.requestSubmit();
        else form.submit();
    }

    function getCategoryTitle(categoryEl) {
        const titleEl = categoryEl.querySelector('.gjs-title, .gjs-category-title, .gjs-block-category-title');
        return titleEl ? titleEl.textContent : categoryEl.textContent;
    }

    function categoryTarget(categoryEl) {
        const key = normalize(getCategoryTitle(categoryEl));

        if (ELEMENT_CATEGORIES.some((name) => key.includes(name))) return 'elements';
        if (WIDGET_CATEGORIES.some((name) => key.includes(name))) return 'widgets';

        return 'widgets';
    }

    function buildPagePanel() {
        const panel = document.createElement('div');
        panel.className = 'r4v4-left-tab-panel r4v4-left-tab-panel-page';
        panel.dataset.r4v4SidebarPanel = 'page';
        panel.hidden = true;
        panel.innerHTML = `
            <div class="r4v4-page-card">
                <div class="r4v4-page-card-title">Base</div>
                <label>Titolo pagina<input type="text" id="r4LeftPageTitle" autocomplete="off"></label>
                <label>Slug<input type="text" id="r4LeftPageSlug" autocomplete="off"></label>
                <label>Estratto<textarea id="r4LeftPageExcerpt" rows="3"></textarea></label>
                <label>Data pubblicazione<input type="datetime-local" id="r4LeftPagePublishedAt"></label>
                <label>Stato<select id="r4LeftPageStatus"><option value="draft">Bozza</option><option value="published">Pubblicata</option><option value="archived">Archiviata</option></select></label>
                <label class="r4v4-left-switch"><input type="checkbox" id="r4LeftPageHomepage"> <span>Homepage</span></label>
            </div>

            <div class="r4v4-page-card">
                <div class="r4v4-page-card-title">SEO</div>
                <label>Meta title<input type="text" id="r4LeftMetaTitle" name="meta[title]" maxlength="60" placeholder="Titolo SEO"></label>
                <label>Meta description<textarea id="r4LeftMetaDescription" name="meta[description]" rows="3" maxlength="160" placeholder="Descrizione SEO"></textarea></label>
                <label>Meta keywords<input type="text" id="r4LeftMetaKeywords" name="meta[keywords]" placeholder="keyword, keyword"></label>
            </div>

            <div class="r4v4-page-card">
                <div class="r4v4-page-card-title">Visibilita frontend</div>
                <input type="hidden" name="meta[show_title]" value="0"><label class="r4v4-left-switch"><input type="checkbox" id="r4LeftShowTitle" name="meta[show_title]" value="1"> <span>Mostra titolo</span></label>
                <input type="hidden" name="meta[show_excerpt]" value="0"><label class="r4v4-left-switch"><input type="checkbox" id="r4LeftShowExcerpt" name="meta[show_excerpt]" value="1"> <span>Mostra estratto</span></label>
                <input type="hidden" name="meta[show_pubdate]" value="0"><label class="r4v4-left-switch"><input type="checkbox" id="r4LeftShowPubdate" name="meta[show_pubdate]" value="1"> <span>Mostra data pubblicazione</span></label>
                <input type="hidden" name="meta[show_author]" value="0"><label class="r4v4-left-switch"><input type="checkbox" id="r4LeftShowAuthor" name="meta[show_author]" value="1"> <span>Mostra autore</span></label>
                <input type="hidden" name="meta[show_breadcrumbs]" value="0"><label class="r4v4-left-switch"><input type="checkbox" id="r4LeftShowBreadcrumbs" name="meta[show_breadcrumbs]" value="1"> <span>Mostra breadcrumb</span></label>
            </div>

            <div class="r4v4-page-card">
                <div class="r4v4-page-card-title">Layout pagina</div>
                <label>Larghezza<select id="r4LeftLayoutWidth" name="meta[layout][width]"><option value="standard">Standard</option><option value="boxed">Boxed</option><option value="full">Full width</option></select></label>
                <label>Gutter<input type="number" id="r4LeftLayoutGutter" name="meta[layout][gutter]" min="0" max="200"></label>
                <label>Spazio superiore<input type="number" id="r4LeftLayoutTop" name="meta[layout][top]" min="0" max="600"></label>
            </div>

            <div class="r4v4-page-card">
                <div class="r4v4-left-page-status" data-r4-left-page-status></div>
                <button type="button" class="r4v4-page-action" data-r4-left-page-action="apply">Applica</button>
                <button type="button" class="r4v4-page-action" data-r4-left-page-action="save">Salva</button>
                <button type="button" class="r4v4-page-action r4v4-page-action-muted" data-r4-left-page-action="media">Media</button>
            </div>
        `;

        panel.querySelector('[data-r4-left-page-action="apply"]')?.addEventListener('click', function () {
            applyPagePanel(panel);
            flash(panel, 'Impostazioni applicate.');
        });

        panel.querySelector('[data-r4-left-page-action="save"]')?.addEventListener('click', function () {
            savePagePanel(panel);
        });

        panel.querySelector('[data-r4-left-page-action="media"]')?.addEventListener('click', function () {
            clickCommand('media');
        });

        panel.querySelectorAll('input, textarea, select').forEach((field) => {
            field.addEventListener('change', function () {
                applyPagePanel(panel);
                flash(panel, 'Modifica applicata.');
            });
        });

        setTimeout(function () { hydratePagePanel(panel); }, 0);
        setTimeout(function () { hydratePagePanel(panel); }, 500);

        const form = byId(cfg.formId || 'pageFormV4');
        if (form && form.dataset.r4v4LeftPageSubmitBound !== '1') {
            form.dataset.r4v4LeftPageSubmitBound = '1';
            form.addEventListener('submit', function () {
                applyPagePanel(panel);
                syncEditorFieldsBeforeSubmit();
            });
        }

        window.R4V4LeftPageSettings = {
            hydrate: function () { hydratePagePanel(panel); },
            apply: function () { applyPagePanel(panel); },
            save: function () { savePagePanel(panel); }
        };

        return panel;
    }

    function buildStylePanel() {
        const panel = document.createElement('div');
        panel.className = 'r4v4-left-tab-panel r4v4-left-style-panel';
        panel.dataset.r4v4SidebarPanel = 'style';
        panel.hidden = true;

        const stylesContainer = byId(cfg.stylesId || 'r4v4-styles');
        const traitsContainer = byId(cfg.traitsId || 'r4v4-traits');

        panel.innerHTML = `
            <div class="r4v4-left-panel-hint r4v4-left-style-empty">
                Seleziona un elemento nel canvas per modificare stile e proprieta.
            </div>
            <div class="r4v4-page-card r4v4-left-style-card" data-r4-style-card="styles">
                <div class="r4v4-page-card-title">Stile elemento</div>
            </div>
            <div class="r4v4-page-card r4v4-left-style-card" data-r4-style-card="traits">
                <div class="r4v4-page-card-title">Proprieta elemento</div>
            </div>
        `;

        const stylesCard = panel.querySelector('[data-r4-style-card="styles"]');
        const traitsCard = panel.querySelector('[data-r4-style-card="traits"]');

        if (stylesContainer && stylesCard) {
            stylesContainer.classList.add('r4v4-left-style-manager');
            stylesCard.appendChild(stylesContainer);
        }

        if (traitsContainer && traitsCard) {
            traitsContainer.classList.add('r4v4-left-trait-manager');
            traitsCard.appendChild(traitsContainer);
        }

        return panel;
    }

    function activateTab(sidebar, tabName) {
        sidebar.querySelectorAll('[data-r4v4-sidebar-tab]').forEach((button) => {
            button.classList.toggle('is-active', button.dataset.r4v4SidebarTab === tabName);
        });

        sidebar.querySelectorAll('[data-r4v4-sidebar-panel]').forEach((panel) => {
            panel.hidden = panel.dataset.r4v4SidebarPanel !== tabName;
            if (!panel.hidden && panel.dataset.r4v4SidebarPanel === 'page') hydratePagePanel(panel);
        });
    }

    function setStyleTabVisible(blocksPanel, visible, activate = false) {
        const button = blocksPanel.querySelector('[data-r4v4-sidebar-tab="style"]');
        const panel = blocksPanel.querySelector('[data-r4v4-sidebar-panel="style"]');
        const empty = panel ? panel.querySelector('.r4v4-left-style-empty') : null;

        if (!button || !panel) return;

        button.hidden = !visible;
        blocksPanel.classList.toggle('has-style-selection', !!visible);

        if (empty) empty.hidden = !!visible;

        if (visible && activate) {
            activateTab(blocksPanel, 'style');
            return;
        }

        if (!visible && button.classList.contains('is-active')) {
            activateTab(blocksPanel, 'elements');
        }
    }

    function bindSelectionAwareStyleTab(blocksPanel) {
        if (blocksPanel.dataset.r4v4StyleSelectionBound === '1') return;
        blocksPanel.dataset.r4v4StyleSelectionBound = '1';

        let attempts = 0;
        const timer = window.setInterval(function () {
            attempts += 1;
            const editor = window.r4VisualEditorV4Instance;

            if (!editor) {
                if (attempts > 40) window.clearInterval(timer);
                return;
            }

            window.clearInterval(timer);

            const refresh = function (activate) {
                const selected = !!editor.getSelected();
                setStyleTabVisible(blocksPanel, selected, selected && activate);
            };

            editor.on('component:selected', function () {
                refresh(true);
            });

            editor.on('component:deselected', function () {
                window.setTimeout(function () { refresh(false); }, 80);
            });

            editor.on('component:remove', function () {
                window.setTimeout(function () { refresh(false); }, 80);
            });

            refresh(false);
        }, 150);
    }

    function distributeCategories(blocksSource, widgetsPanel, elementsPanel) {
        const categories = blocksSource.querySelectorAll('.gjs-block-category, .gjs-category, .gjs-blocks-c');

        if (!categories.length) return false;

        let moved = 0;

        categories.forEach((categoryEl) => {
            if (categoryEl.dataset.r4v4SidebarMoved === '1') return;

            const target = categoryTarget(categoryEl);
            const destination = target === 'elements' ? elementsPanel : widgetsPanel;
            destination.appendChild(categoryEl);
            categoryEl.dataset.r4v4SidebarMoved = '1';
            moved += 1;
        });

        return moved > 0;
    }

    function buildTabs(blocksPanel, blocksSource) {
        if (blocksPanel.dataset.r4v4SidebarTabs === '1') return;
        blocksPanel.dataset.r4v4SidebarTabs = '1';
        blocksPanel.classList.add('r4v4-blocks-panel');

        const title = blocksPanel.querySelector('.r4v4-panel-title');
        if (title) title.textContent = 'Editor';

        const tabbar = document.createElement('div');
        tabbar.className = 'r4v4-left-tabs';
        tabbar.innerHTML = TAB_DEFINITIONS.map((tab) => (
            '<button type="button" data-r4v4-sidebar-tab="' + tab.key + '"' + (tab.selectionOnly ? ' hidden' : '') + '>' + tab.label + '</button>'
        )).join('');

        const pagePanel = buildPagePanel();

        const widgetsPanel = document.createElement('div');
        widgetsPanel.className = 'r4v4-left-tab-panel';
        widgetsPanel.dataset.r4v4SidebarPanel = 'widgets';
        widgetsPanel.hidden = true;
        widgetsPanel.innerHTML = '<div class="r4v4-left-panel-hint">Componenti pronti e sezioni preconfigurate.</div>';

        const elementsPanel = document.createElement('div');
        elementsPanel.className = 'r4v4-left-tab-panel';
        elementsPanel.dataset.r4v4SidebarPanel = 'elements';
        elementsPanel.hidden = true;
        elementsPanel.innerHTML = '<div class="r4v4-left-panel-hint">Elementi base, layout e media.</div>';

        const stylePanel = buildStylePanel();

        blocksSource.parentNode.insertBefore(tabbar, blocksSource);
        blocksSource.parentNode.insertBefore(pagePanel, blocksSource);
        blocksSource.parentNode.insertBefore(widgetsPanel, blocksSource);
        blocksSource.parentNode.insertBefore(elementsPanel, blocksSource);
        blocksSource.parentNode.insertBefore(stylePanel, blocksSource);

        blocksSource.classList.add('r4v4-left-tab-source');
        blocksSource.hidden = true;

        tabbar.querySelectorAll('[data-r4v4-sidebar-tab]').forEach((button) => {
            button.addEventListener('click', function () {
                if (button.hidden) return;
                activateTab(blocksPanel, button.dataset.r4v4SidebarTab);
            });
        });

        const distribute = function () {
            return distributeCategories(blocksSource, widgetsPanel, elementsPanel);
        };

        const observer = new MutationObserver(distribute);
        observer.observe(blocksSource, { childList: true, subtree: false });

        let attempts = 0;
        const timer = setInterval(function () {
            attempts += 1;
            const moved = distribute();
            if (moved || attempts > 30) clearInterval(timer);
        }, 120);

        distribute();
        activateTab(blocksPanel, 'elements');
        bindSelectionAwareStyleTab(blocksPanel);
    }

    function initSidebarTabs() {
        const blocksSource = byId(cfg.blocksId || 'r4v4-blocks');
        if (!blocksSource) return;

        const blocksPanel = blocksSource.closest('.r4v4-panel');
        if (!blocksPanel) return;

        buildTabs(blocksPanel, blocksSource);
    }

    document.addEventListener('DOMContentLoaded', function () {
        initSidebarTabs();
        setTimeout(initSidebarTabs, 350);
        setTimeout(initSidebarTabs, 900);
    });
})();

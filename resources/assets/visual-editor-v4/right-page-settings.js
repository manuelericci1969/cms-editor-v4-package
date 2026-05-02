(function () {
    'use strict';

    const cfg = window.R4VisualEditorV4 || {};

    function byId(id) {
        return id ? document.getElementById(id) : null;
    }

    function firstField(name) {
        return document.querySelector('[name="' + name + '"]');
    }

    function checkedField(name) {
        return document.querySelector('[name="' + name + '"][type="checkbox"]');
    }

    function hiddenField(name) {
        return document.querySelector('[name="' + name + '"][type="hidden"]');
    }

    function createHiddenField(form, name, value = '') {
        let input = firstField(name);
        if (input) return input;

        input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
        return input;
    }

    function ensureMetaFields(form) {
        createHiddenField(form, 'meta[title]');
        createHiddenField(form, 'meta[description]');
        createHiddenField(form, 'meta[keywords]');
        createHiddenField(form, 'meta[layout][width]', 'standard');
        createHiddenField(form, 'meta[layout][gutter]', '24');
        createHiddenField(form, 'meta[layout][top]', '0');

        ['show_title', 'show_excerpt', 'show_pubdate', 'show_author', 'show_breadcrumbs'].forEach((key) => {
            const name = 'meta[' + key + ']';
            if (!hiddenField(name)) createHiddenField(form, name, '0');
            if (!checkedField(name)) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.name = name;
                checkbox.value = '1';
                checkbox.hidden = true;
                form.appendChild(checkbox);
            }
        });
    }

    function safeValue(value, fallback = '') {
        if (value === null || typeof value === 'undefined') return fallback;
        return String(value);
    }

    function getNamedValue(name, fallback = '') {
        const field = firstField(name);
        return field ? safeValue(field.value, fallback) : fallback;
    }

    function setNamedValue(name, value) {
        const field = firstField(name);
        if (field) field.value = safeValue(value);
    }

    function setNamedCheckbox(name, checked) {
        const checkbox = checkedField(name);
        if (checkbox) checkbox.checked = !!checked;
    }

    function getNamedCheckbox(name, fallback = false) {
        const checkbox = checkedField(name);
        return checkbox ? checkbox.checked : fallback;
    }

    function getPanelValue(panel, selector, fallback = '') {
        const field = panel.querySelector(selector);
        return field ? safeValue(field.value, fallback) : fallback;
    }

    function getPanelChecked(panel, selector, fallback = false) {
        const field = panel.querySelector(selector);
        return field ? field.checked : fallback;
    }

    function setPanelValue(panel, selector, value) {
        const field = panel.querySelector(selector);
        if (field) field.value = safeValue(value);
    }

    function setPanelChecked(panel, selector, checked) {
        const field = panel.querySelector(selector);
        if (field) field.checked = !!checked;
    }

    function getSettingsFallback() {
        return cfg.pageSettings || {};
    }

    function hydratePanel(panel) {
        const settings = getSettingsFallback();
        const titleField = byId('pageTitleFieldV4');
        const slugField = firstField('slug');
        const excerptField = firstField('excerpt');
        const publishedAtField = firstField('published_at');
        const homepageField = firstField('is_homepage');
        const statusField = byId(cfg.statusFieldId || 'statusFieldV4');

        setPanelValue(panel, '#r4RightTitle', titleField?.value || '');
        setPanelValue(panel, '#r4RightSlug', slugField?.value || '');
        setPanelValue(panel, '#r4RightExcerpt', excerptField?.value || '');
        setPanelValue(panel, '#r4RightPublishedAt', publishedAtField?.value || '');
        setPanelValue(panel, '#r4RightStatus', statusField?.value || 'draft');
        setPanelChecked(panel, '#r4RightHomepage', String(homepageField?.value || '0') === '1');

        setPanelValue(panel, '#r4RightMetaTitle', getNamedValue('meta[title]', settings.metaTitle || ''));
        setPanelValue(panel, '#r4RightMetaDescription', getNamedValue('meta[description]', settings.metaDescription || ''));
        setPanelValue(panel, '#r4RightMetaKeywords', getNamedValue('meta[keywords]', settings.metaKeywords || ''));

        setPanelChecked(panel, '#r4RightShowTitle', getNamedCheckbox('meta[show_title]', settings.showTitle !== false));
        setPanelChecked(panel, '#r4RightShowExcerpt', getNamedCheckbox('meta[show_excerpt]', settings.showExcerpt === true));
        setPanelChecked(panel, '#r4RightShowPubdate', getNamedCheckbox('meta[show_pubdate]', settings.showPubdate !== false));
        setPanelChecked(panel, '#r4RightShowAuthor', getNamedCheckbox('meta[show_author]', settings.showAuthor !== false));
        setPanelChecked(panel, '#r4RightShowBreadcrumbs', getNamedCheckbox('meta[show_breadcrumbs]', settings.showBreadcrumbs !== false));

        setPanelValue(panel, '#r4RightLayoutWidth', getNamedValue('meta[layout][width]', settings.layoutWidth || 'standard'));
        setPanelValue(panel, '#r4RightLayoutGutter', getNamedValue('meta[layout][gutter]', typeof settings.layoutGutter === 'undefined' ? '24' : settings.layoutGutter));
        setPanelValue(panel, '#r4RightLayoutTop', getNamedValue('meta[layout][top]', typeof settings.layoutTop === 'undefined' ? '0' : settings.layoutTop));
    }

    function applyPanel(panel) {
        const form = byId(cfg.formId || 'pageFormV4');
        if (form) ensureMetaFields(form);

        const titleField = byId('pageTitleFieldV4');
        const slugField = firstField('slug');
        const excerptField = firstField('excerpt');
        const publishedAtField = firstField('published_at');
        const homepageField = firstField('is_homepage');
        const statusField = byId(cfg.statusFieldId || 'statusFieldV4');

        const title = getPanelValue(panel, '#r4RightTitle').trim();
        const slug = getPanelValue(panel, '#r4RightSlug').trim();

        if (titleField && title !== '') titleField.value = title;
        if (slugField && slug !== '') slugField.value = slug;
        if (excerptField) excerptField.value = getPanelValue(panel, '#r4RightExcerpt');
        if (publishedAtField) publishedAtField.value = getPanelValue(panel, '#r4RightPublishedAt');
        if (statusField) statusField.value = getPanelValue(panel, '#r4RightStatus', statusField.value || 'draft');
        if (homepageField) homepageField.value = getPanelChecked(panel, '#r4RightHomepage') ? '1' : '0';

        setNamedValue('meta[title]', getPanelValue(panel, '#r4RightMetaTitle'));
        setNamedValue('meta[description]', getPanelValue(panel, '#r4RightMetaDescription'));
        setNamedValue('meta[keywords]', getPanelValue(panel, '#r4RightMetaKeywords'));

        setNamedCheckbox('meta[show_title]', getPanelChecked(panel, '#r4RightShowTitle'));
        setNamedCheckbox('meta[show_excerpt]', getPanelChecked(panel, '#r4RightShowExcerpt'));
        setNamedCheckbox('meta[show_pubdate]', getPanelChecked(panel, '#r4RightShowPubdate'));
        setNamedCheckbox('meta[show_author]', getPanelChecked(panel, '#r4RightShowAuthor'));
        setNamedCheckbox('meta[show_breadcrumbs]', getPanelChecked(panel, '#r4RightShowBreadcrumbs'));

        setNamedValue('meta[layout][width]', getPanelValue(panel, '#r4RightLayoutWidth', 'standard'));
        setNamedValue('meta[layout][gutter]', getPanelValue(panel, '#r4RightLayoutGutter', '24'));
        setNamedValue('meta[layout][top]', getPanelValue(panel, '#r4RightLayoutTop', '0'));

        const subtitle = document.querySelector('.r4v4-subtitle');
        if (subtitle && titleField) subtitle.textContent = titleField.value || 'Senza titolo';

        if (window.R4V4PageSettings && typeof window.R4V4PageSettings.hydrate === 'function') {
            window.R4V4PageSettings.hydrate();
        }
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
        const box = panel.querySelector('[data-r4-right-status]');
        if (!box) return;

        box.textContent = message;
        box.className = 'r4-right-page-status is-' + type;
        window.clearTimeout(panel._r4RightStatusTimer);
        panel._r4RightStatusTimer = window.setTimeout(function () {
            box.textContent = '';
            box.className = 'r4-right-page-status';
        }, 2600);
    }

    function savePanel(panel) {
        const form = byId(cfg.formId || 'pageFormV4');
        if (!form) return;

        applyPanel(panel);
        syncEditorFieldsBeforeSubmit();
        flash(panel, 'Salvataggio in corso…');

        if (typeof form.requestSubmit === 'function') {
            form.requestSubmit();
        } else {
            form.submit();
        }
    }

    function buildPanel() {
        const panel = document.createElement('section');
        panel.className = 'r4v4-panel r4-right-page-settings-panel';
        panel.id = 'r4v4RightPageSettingsPanel';
        panel.innerHTML = `
            <div class="r4v4-panel-title r4-right-page-title">Impostazioni pagina</div>
            <div class="r4-right-page-body">
                <div class="r4-right-page-section">
                    <h4>Base</h4>
                    <label>Titolo pagina<input type="text" id="r4RightTitle" autocomplete="off"></label>
                    <label>Slug<input type="text" id="r4RightSlug" autocomplete="off"></label>
                    <label>Estratto<textarea id="r4RightExcerpt" rows="3"></textarea></label>
                    <label>Data pubblicazione<input type="datetime-local" id="r4RightPublishedAt"></label>
                    <label>Stato<select id="r4RightStatus"><option value="draft">Bozza</option><option value="published">Pubblicata</option><option value="archived">Archiviata</option></select></label>
                    <label class="r4-right-switch"><input type="checkbox" id="r4RightHomepage"> <span>Imposta come homepage</span></label>
                </div>

                <div class="r4-right-page-section">
                    <h4>SEO</h4>
                    <label>Meta title<input type="text" id="r4RightMetaTitle" maxlength="60" placeholder="Titolo SEO"></label>
                    <label>Meta description<textarea id="r4RightMetaDescription" rows="4" maxlength="160" placeholder="Descrizione SEO"></textarea></label>
                    <label>Meta keywords<input type="text" id="r4RightMetaKeywords" placeholder="keyword, keyword"></label>
                </div>

                <div class="r4-right-page-section">
                    <h4>Visibilità frontend</h4>
                    <label class="r4-right-switch"><input type="checkbox" id="r4RightShowTitle"> <span>Mostra titolo</span></label>
                    <label class="r4-right-switch"><input type="checkbox" id="r4RightShowExcerpt"> <span>Mostra estratto</span></label>
                    <label class="r4-right-switch"><input type="checkbox" id="r4RightShowPubdate"> <span>Mostra data pubblicazione</span></label>
                    <label class="r4-right-switch"><input type="checkbox" id="r4RightShowAuthor"> <span>Mostra autore</span></label>
                    <label class="r4-right-switch"><input type="checkbox" id="r4RightShowBreadcrumbs"> <span>Mostra breadcrumb</span></label>
                </div>

                <div class="r4-right-page-section">
                    <h4>Layout pagina</h4>
                    <label>Larghezza contenitore<select id="r4RightLayoutWidth"><option value="standard">Standard</option><option value="boxed">Boxed</option><option value="full">Full width</option></select></label>
                    <label>Gutter laterale<input type="number" id="r4RightLayoutGutter" min="0" max="200"></label>
                    <label>Spazio superiore<input type="number" id="r4RightLayoutTop" min="0" max="600"></label>
                </div>
            </div>
            <div class="r4-right-page-footer">
                <div class="r4-right-page-status" data-r4-right-status></div>
                <button type="button" class="r4v4-btn r4v4-btn-light" data-r4-right-page-action="apply">Applica</button>
                <button type="button" class="r4v4-btn r4v4-btn-primary" data-r4-right-page-action="save">Salva impostazioni</button>
            </div>
        `;

        panel.querySelector('[data-r4-right-page-action="apply"]')?.addEventListener('click', function () {
            applyPanel(panel);
            flash(panel, 'Impostazioni applicate.');
        });

        panel.querySelector('[data-r4-right-page-action="save"]')?.addEventListener('click', function () {
            savePanel(panel);
        });

        panel.querySelectorAll('input, textarea, select').forEach((field) => {
            field.addEventListener('change', function () {
                applyPanel(panel);
                flash(panel, 'Modifica applicata.');
            });
        });

        return panel;
    }

    function interceptSettingsButton(panel) {
        document.addEventListener('click', function (event) {
            const button = event.target.closest('[data-r4v4-command="settings"]');
            if (!button) return;

            event.preventDefault();
            event.stopImmediatePropagation();
            hydratePanel(panel);
            panel.scrollIntoView({ block: 'start', behavior: 'smooth' });
            panel.classList.add('is-highlighted');
            window.setTimeout(function () { panel.classList.remove('is-highlighted'); }, 900);
        }, true);
    }

    function initRightPageSettings() {
        const form = byId(cfg.formId || 'pageFormV4');
        const sidebar = document.querySelector('.r4v4-sidebar-right');
        if (!form || !sidebar || byId('r4v4RightPageSettingsPanel')) return;

        ensureMetaFields(form);

        const panel = buildPanel();
        sidebar.insertBefore(panel, sidebar.firstElementChild || null);

        hydratePanel(panel);
        interceptSettingsButton(panel);

        form.addEventListener('submit', function () {
            applyPanel(panel);
            syncEditorFieldsBeforeSubmit();
        });

        window.R4V4RightPageSettings = {
            hydrate: function () { hydratePanel(panel); },
            apply: function () { applyPanel(panel); },
            save: function () { savePanel(panel); }
        };
    }

    function boot() {
        let attempts = 0;
        const timer = window.setInterval(function () {
            attempts += 1;
            initRightPageSettings();
            if (byId('r4v4RightPageSettingsPanel') || attempts > 30) {
                window.clearInterval(timer);
            }
        }, 150);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();

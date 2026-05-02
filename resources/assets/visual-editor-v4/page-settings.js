(function () {
    'use strict';

    if (window.R4V4_DISABLE_PAGE_SETTINGS_DRAWER === true) {
        window.R4V4PageSettings = window.R4V4PageSettings || {};
        window.R4V4PageSettings.open = function () {
            const pageTab = document.querySelector('[data-r4v4-sidebar-tab="page"]');
            if (pageTab) pageTab.click();
        };
        window.R4V4PageSettings.close = function () {};
        window.R4V4PageSettings.apply = function () {
            if (window.R4V4LeftPageSettings && typeof window.R4V4LeftPageSettings.apply === 'function') {
                window.R4V4LeftPageSettings.apply();
            }
        };
        window.R4V4PageSettings.hydrate = function () {
            if (window.R4V4LeftPageSettings && typeof window.R4V4LeftPageSettings.hydrate === 'function') {
                window.R4V4LeftPageSettings.hydrate();
            }
        };
        return;
    }

    function byId(id) {
        return document.getElementById(id);
    }

    function firstField(name) {
        return document.querySelector('[name="' + name + '"]');
    }

    function checkedField(name) {
        return document.querySelector('[name="' + name + '"][type="checkbox"]');
    }

    function cfg() {
        return window.R4VisualEditorV4 || {};
    }

    function pageSettings() {
        return cfg().pageSettings || {};
    }

    function setCheckbox(name, value) {
        const checkbox = checkedField(name);
        if (checkbox) checkbox.checked = !!value;
    }

    function setField(name, value) {
        const input = firstField(name);
        if (!input) return;
        input.value = value === null || typeof value === 'undefined' ? '' : String(value);
    }

    function createDrawer() {
        const form = byId('pageFormV4');
        const editorRoot = byId('r4VisualEditorV4');
        if (!form || !editorRoot || byId('r4v4PageSettingsDrawer')) return;

        const titleField = byId('pageTitleFieldV4');
        const slugField = firstField('slug');
        const excerptField = firstField('excerpt');
        const publishedAtField = firstField('published_at');
        const homepageField = firstField('is_homepage');
        const statusField = byId('statusFieldV4');

        const drawer = document.createElement('aside');
        drawer.className = 'r4v4-settings-drawer';
        drawer.id = 'r4v4PageSettingsDrawer';
        drawer.innerHTML = '' +
            '<div class="r4v4-settings-header">' +
                '<div><strong>Impostazioni pagina</strong><span>Gestisci dati, SEO e visibilità frontend.</span></div>' +
                '<button type="button" class="r4v4-settings-close" data-r4v4-settings-close>×</button>' +
            '</div>' +
            '<div class="r4v4-settings-body">' +
                '<div class="r4v4-settings-section">' +
                    '<h4>Base</h4>' +
                    '<label>Titolo pagina<input type="text" id="r4v4SettingsTitle" value=""></label>' +
                    '<label>Slug<input type="text" id="r4v4SettingsSlug" value=""></label>' +
                    '<label>Estratto<textarea id="r4v4SettingsExcerpt" rows="4"></textarea></label>' +
                    '<label>Data pubblicazione<input type="datetime-local" id="r4v4SettingsPublishedAt" value=""></label>' +
                    '<label>Stato<select id="r4v4SettingsStatus"><option value="draft">Bozza</option><option value="published">Pubblicata</option><option value="archived">Archiviata</option></select></label>' +
                    '<label class="r4v4-switch"><input type="checkbox" id="r4v4SettingsHomepage"> <span>Imposta come homepage</span></label>' +
                '</div>' +
                '<div class="r4v4-settings-section">' +
                    '<h4>SEO</h4>' +
                    '<label>Meta title<input type="text" name="meta[title]" maxlength="60" placeholder="Titolo SEO"></label>' +
                    '<label>Meta description<textarea name="meta[description]" rows="4" maxlength="160" placeholder="Descrizione SEO"></textarea></label>' +
                    '<label>Meta keywords<input type="text" name="meta[keywords]" placeholder="keyword, keyword"></label>' +
                '</div>' +
                '<div class="r4v4-settings-section">' +
                    '<h4>Visibilità frontend</h4>' +
                    '<input type="hidden" name="meta[show_title]" value="0"><label class="r4v4-switch"><input type="checkbox" name="meta[show_title]" value="1"> <span>Mostra titolo</span></label>' +
                    '<input type="hidden" name="meta[show_excerpt]" value="0"><label class="r4v4-switch"><input type="checkbox" name="meta[show_excerpt]" value="1"> <span>Mostra estratto</span></label>' +
                    '<input type="hidden" name="meta[show_pubdate]" value="0"><label class="r4v4-switch"><input type="checkbox" name="meta[show_pubdate]" value="1"> <span>Mostra data pubblicazione</span></label>' +
                    '<input type="hidden" name="meta[show_author]" value="0"><label class="r4v4-switch"><input type="checkbox" name="meta[show_author]" value="1"> <span>Mostra autore</span></label>' +
                    '<input type="hidden" name="meta[show_breadcrumbs]" value="0"><label class="r4v4-switch"><input type="checkbox" name="meta[show_breadcrumbs]" value="1"> <span>Mostra breadcrumb</span></label>' +
                '</div>' +
                '<div class="r4v4-settings-section">' +
                    '<h4>Layout pagina</h4>' +
                    '<label>Larghezza contenitore<select name="meta[layout][width]"><option value="standard">Standard</option><option value="boxed">Boxed</option><option value="full">Full width</option></select></label>' +
                    '<label>Gutter laterale<input type="number" name="meta[layout][gutter]" min="0" max="200" value="24"></label>' +
                    '<label>Spazio superiore<input type="number" name="meta[layout][top]" min="0" max="600" value="0"></label>' +
                '</div>' +
            '</div>' +
            '<div class="r4v4-settings-footer">' +
                '<button type="button" class="r4v4-btn r4v4-btn-light" data-r4v4-settings-close>Chiudi</button>' +
                '<button type="button" class="r4v4-btn r4v4-btn-primary" id="r4v4ApplyPageSettings">Applica</button>' +
            '</div>';

        form.appendChild(drawer);

        const titleInput = byId('r4v4SettingsTitle');
        const slugInput = byId('r4v4SettingsSlug');
        const excerptInput = byId('r4v4SettingsExcerpt');
        const publishedAtInput = byId('r4v4SettingsPublishedAt');
        const statusInput = byId('r4v4SettingsStatus');
        const homepageInput = byId('r4v4SettingsHomepage');

        function hydrateMetaFromSavedSettings() {
            const settings = pageSettings();

            setField('meta[title]', settings.metaTitle || '');
            setField('meta[description]', settings.metaDescription || '');
            setField('meta[keywords]', settings.metaKeywords || '');

            setCheckbox('meta[show_title]', settings.showTitle !== false);
            setCheckbox('meta[show_excerpt]', settings.showExcerpt === true);
            setCheckbox('meta[show_pubdate]', settings.showPubdate !== false);
            setCheckbox('meta[show_author]', settings.showAuthor !== false);
            setCheckbox('meta[show_breadcrumbs]', settings.showBreadcrumbs !== false);

            setField('meta[layout][width]', settings.layoutWidth || 'standard');
            setField('meta[layout][gutter]', typeof settings.layoutGutter === 'undefined' ? 24 : settings.layoutGutter);
            setField('meta[layout][top]', typeof settings.layoutTop === 'undefined' ? 0 : settings.layoutTop);
        }

        function syncFromHidden() {
            if (titleInput && titleField) titleInput.value = titleField.value || '';
            if (slugInput && slugField) slugInput.value = slugField.value || '';
            if (excerptInput && excerptField) excerptInput.value = excerptField.value || '';
            if (publishedAtInput && publishedAtField) publishedAtInput.value = publishedAtField.value || '';
            if (statusInput && statusField) statusInput.value = statusField.value || 'draft';
            if (homepageInput && homepageField) homepageInput.checked = String(homepageField.value || '0') === '1';
        }

        function applySettings() {
            const hasTitleValue = titleInput && titleInput.value.trim() !== '';
            const hasSlugValue = slugInput && slugInput.value.trim() !== '';

            if (titleField && titleInput && hasTitleValue) titleField.value = titleInput.value;
            if (slugField && slugInput && hasSlugValue) slugField.value = slugInput.value;
            if (excerptField && excerptInput) excerptField.value = excerptInput.value;
            if (publishedAtField && publishedAtInput) publishedAtField.value = publishedAtInput.value;
            if (statusField && statusInput) statusField.value = statusInput.value || statusField.value || 'draft';
            if (homepageField && homepageInput) homepageField.value = homepageInput.checked ? '1' : '0';

            const subtitle = document.querySelector('.r4v4-subtitle');
            if (subtitle && titleField) subtitle.textContent = titleField.value || 'Senza titolo';

            drawer.classList.remove('is-open');
        }

        function openDrawer() {
            syncFromHidden();
            drawer.classList.add('is-open');
        }

        function closeDrawer() {
            drawer.classList.remove('is-open');
        }

        drawer.querySelectorAll('[data-r4v4-settings-close]').forEach(function (button) {
            button.addEventListener('click', closeDrawer);
        });

        const applyButton = byId('r4v4ApplyPageSettings');
        if (applyButton) applyButton.addEventListener('click', applySettings);

        form.addEventListener('submit', function () {
            syncFromHidden();
            applySettings();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') closeDrawer();
        });

        hydrateMetaFromSavedSettings();
        syncFromHidden();

        window.R4V4PageSettings = window.R4V4PageSettings || {};
        window.R4V4PageSettings.open = openDrawer;
        window.R4V4PageSettings.close = closeDrawer;
        window.R4V4PageSettings.apply = applySettings;
        window.R4V4PageSettings.hydrate = hydrateMetaFromSavedSettings;
    }

    function bindButton() {
        const button = document.querySelector('[data-r4v4-command="settings"]');
        if (!button || button.dataset.r4v4SettingsBound === '1') return false;

        button.dataset.r4v4SettingsBound = '1';
        button.addEventListener('click', function () {
            if (window.R4V4PageSettings && window.R4V4PageSettings.open) {
                window.R4V4PageSettings.open();
            }
        });

        return true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        createDrawer();
        let attempts = 0;
        const timer = window.setInterval(function () {
            attempts++;
            if (bindButton() || attempts > 20) window.clearInterval(timer);
        }, 150);
    });
})();

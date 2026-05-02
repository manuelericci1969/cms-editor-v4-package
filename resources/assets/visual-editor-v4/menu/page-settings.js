(function () {
    'use strict';

    const h = window.R4V4MenuHelpers;

    function hydrate(panel) {
        const cfg = h.cfg();
        const settings = cfg.pageSettings || {};
        const titleField = h.byId('pageTitleFieldV4');
        const statusField = h.byId(cfg.statusFieldId || 'statusFieldV4');

        h.setPanelValue(panel, '#r4LeftPageTitle', titleField?.value || '');
        h.setPanelValue(panel, '#r4LeftPageSlug', h.firstField('slug')?.value || '');
        h.setPanelValue(panel, '#r4LeftPageExcerpt', h.firstField('excerpt')?.value || '');
        h.setPanelValue(panel, '#r4LeftPagePublishedAt', h.firstField('published_at')?.value || '');
        h.setPanelValue(panel, '#r4LeftPageStatus', statusField?.value || 'draft');
        h.setPanelChecked(panel, '#r4LeftPageHomepage', String(h.firstField('is_homepage')?.value || '0') === '1');

        h.setPanelValue(panel, '#r4LeftMetaTitle', settings.metaTitle || '');
        h.setPanelValue(panel, '#r4LeftMetaDescription', settings.metaDescription || '');
        h.setPanelValue(panel, '#r4LeftMetaKeywords', settings.metaKeywords || '');

        h.setPanelChecked(panel, '#r4LeftShowTitle', settings.showTitle !== false);
        h.setPanelChecked(panel, '#r4LeftShowExcerpt', settings.showExcerpt === true);
        h.setPanelChecked(panel, '#r4LeftShowPubdate', settings.showPubdate !== false);
        h.setPanelChecked(panel, '#r4LeftShowAuthor', settings.showAuthor !== false);
        h.setPanelChecked(panel, '#r4LeftShowBreadcrumbs', settings.showBreadcrumbs !== false);
    }

    function apply(panel) {
        const cfg = h.cfg();
        const titleField = h.byId('pageTitleFieldV4');
        const statusField = h.byId(cfg.statusFieldId || 'statusFieldV4');
        const title = h.getPanelValue(panel, '#r4LeftPageTitle').trim();
        const slug = h.getPanelValue(panel, '#r4LeftPageSlug').trim();

        if (titleField) titleField.value = title || titleField.value || 'Senza titolo';
        if (h.firstField('slug')) h.firstField('slug').value = slug;
        if (h.firstField('excerpt')) h.firstField('excerpt').value = h.getPanelValue(panel, '#r4LeftPageExcerpt');
        if (h.firstField('published_at')) h.firstField('published_at').value = h.getPanelValue(panel, '#r4LeftPagePublishedAt');
        if (statusField) statusField.value = h.getPanelValue(panel, '#r4LeftPageStatus', statusField.value || 'draft');
        if (h.firstField('is_homepage')) h.firstField('is_homepage').value = h.getPanelChecked(panel, '#r4LeftPageHomepage') ? '1' : '0';

        const subtitle = document.querySelector('.r4v4-subtitle');
        if (subtitle && titleField) subtitle.textContent = titleField.value || 'Senza titolo';
    }

    function save(panel) {
        const form = h.byId(h.cfg().formId || 'pageFormV4');
        if (!form) return;

        apply(panel);
        h.syncEditorFieldsBeforeSubmit();
        h.flash(panel, 'Salvataggio in corso...');

        if (typeof form.requestSubmit === 'function') form.requestSubmit();
        else form.submit();
    }

    window.R4V4SidebarMenu.register({
        key: 'page',
        label: 'Pagina',
        order: 10,
        templateId: 'r4v4-menu-template-page',
        mount(panel) {
            panel.innerHTML = h.templateHtml(this.templateId);

            panel.querySelector('[data-r4-left-page-action="apply"]')?.addEventListener('click', function () {
                apply(panel);
                h.flash(panel, 'Impostazioni applicate.');
            });

            panel.querySelector('[data-r4-left-page-action="save"]')?.addEventListener('click', function () {
                save(panel);
            });

            panel.querySelector('[data-r4-left-page-action="media"]')?.addEventListener('click', function () {
                h.clickCommand('media');
            });

            panel.querySelectorAll('input, textarea, select').forEach((field) => {
                field.addEventListener('change', function () {
                    apply(panel);
                    h.flash(panel, 'Modifica applicata.');
                });
            });

            setTimeout(function () { hydrate(panel); }, 0);
            setTimeout(function () { hydrate(panel); }, 500);

            const form = h.byId(h.cfg().formId || 'pageFormV4');
            if (form && form.dataset.r4v4LeftPageSubmitBound !== '1') {
                form.dataset.r4v4LeftPageSubmitBound = '1';
                form.addEventListener('submit', function () {
                    apply(panel);
                    h.syncEditorFieldsBeforeSubmit();
                });
            }

            window.R4V4LeftPageSettings = {
                hydrate: function () { hydrate(panel); },
                apply: function () { apply(panel); },
                save: function () { save(panel); }
            };
        },
        onActivate(panel) {
            hydrate(panel);
        }
    });
})();

(function () {
    'use strict';

    const cfg = () => window.R4VisualEditorV4 || {};

    function byId(id) {
        return id ? document.getElementById(id) : null;
    }

    function firstField(name) {
        return document.querySelector('[name="' + name + '"]');
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

    function templateHtml(templateId) {
        const template = byId(templateId);
        return template ? template.innerHTML : '<div class="r4v4-menu-module-placeholder">Modulo non disponibile.</div>';
    }

    function syncEditorFieldsBeforeSubmit() {
        const editor = window.r4VisualEditorV4Instance;
        const settings = cfg();
        if (!editor) return;

        const htmlField = byId(settings.htmlFieldId || 'visual_html');
        const cssField = byId(settings.cssFieldId || 'visual_css');
        const jsonField = byId(settings.jsonFieldId || 'visual_json');

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

    function clickCommand(command) {
        const button = document.querySelector('[data-r4v4-command="' + command + '"]');
        if (button) button.click();
    }

    window.R4V4MenuHelpers = {
        cfg,
        byId,
        firstField,
        setPanelValue,
        getPanelValue,
        setPanelChecked,
        getPanelChecked,
        templateHtml,
        syncEditorFieldsBeforeSubmit,
        flash,
        clickCommand
    };
})();

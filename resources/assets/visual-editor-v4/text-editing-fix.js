(function () {
    'use strict';

    function getEditor() {
        return window.r4VisualEditorV4Instance || null;
    }

    function getCanvasDocument(editor) {
        return editor && editor.Canvas && editor.Canvas.getDocument ? editor.Canvas.getDocument() : null;
    }

    function isEditableTextElement(element) {
        if (!element || element.nodeType !== 1) return false;

        const tagName = String(element.tagName || '').toLowerCase();
        const textTags = ['p', 'span', 'strong', 'em', 'b', 'i', 'u', 'small', 'label', 'a', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'figcaption', 'div'];

        if (!textTags.includes(tagName)) return false;
        if (['img', 'video', 'iframe', 'svg', 'path', 'button', 'input', 'textarea', 'select'].includes(tagName)) return false;

        const text = (element.textContent || '').trim();
        return text.length > 0;
    }

    function markEditableTextElements(editor) {
        const doc = getCanvasDocument(editor);
        if (!doc || !doc.body) return;

        doc.body.querySelectorAll('p,span,strong,em,b,i,u,small,label,a,li,h1,h2,h3,h4,h5,h6,blockquote,figcaption').forEach(function (el) {
            if (!isEditableTextElement(el)) return;

            el.setAttribute('data-r4v4-text-editable', '1');
            el.style.userSelect = 'text';
            el.style.webkitUserSelect = 'text';
            el.style.cursor = 'text';
        });
    }

    function selectedComponentIsText(editor) {
        const selected = editor && editor.getSelected ? editor.getSelected() : null;
        if (!selected) return false;

        const type = selected.get && selected.get('type');
        const tagName = selected.get && selected.get('tagName');
        const el = selected.getEl && selected.getEl();

        if (type === 'text' || type === 'link') return true;
        if (tagName && ['p', 'span', 'a', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'].includes(String(tagName).toLowerCase())) return true;
        return isEditableTextElement(el);
    }

    function startTextEditing(editor, target) {
        if (!editor || !target) return;

        try {
            const component = editor.getSelected && editor.getSelected();
            if (component && !selectedComponentIsText(editor)) {
                return;
            }

            target.setAttribute('contenteditable', 'true');
            target.setAttribute('data-r4v4-editing-text', '1');
            target.style.userSelect = 'text';
            target.style.webkitUserSelect = 'text';
            target.style.cursor = 'text';

            window.setTimeout(function () {
                try {
                    target.focus({ preventScroll: true });
                } catch (error) {
                    target.focus();
                }
            }, 0);
        } catch (error) {
            console.warn('[R4 Editor V4] Text editing focus failed', error);
        }
    }

    function installCanvasGuards(editor) {
        const doc = getCanvasDocument(editor);
        if (!doc || doc.__r4v4TextEditingFixInstalled) return;

        doc.__r4v4TextEditingFixInstalled = true;

        const style = doc.createElement('style');
        style.id = 'r4v4-text-editing-fix-style';
        style.textContent = [
            '[data-r4v4-text-editable="1"]{user-select:text!important;-webkit-user-select:text!important;cursor:text!important;}',
            '[data-r4v4-editing-text="1"]{user-select:text!important;-webkit-user-select:text!important;outline:1px dashed rgba(13,110,253,.35);}',
            '.gjs-selected[data-r4v4-editing-text="1"]{outline:1px dashed rgba(13,110,253,.55)!important;}'
        ].join('\n');
        doc.head.appendChild(style);

        doc.addEventListener('dblclick', function (event) {
            const target = event.target && event.target.closest ? event.target.closest('[data-r4v4-text-editable="1"], p, span, a, li, h1, h2, h3, h4, h5, h6, blockquote') : null;
            if (!target || !isEditableTextElement(target)) return;
            startTextEditing(editor, target);
        }, true);

        doc.addEventListener('mousedown', function (event) {
            const target = event.target && event.target.closest ? event.target.closest('[data-r4v4-editing-text="1"], [contenteditable="true"]') : null;
            if (!target) return;
            event.stopPropagation();
        }, true);

        doc.addEventListener('keydown', function (event) {
            const active = doc.activeElement;
            if (!active || !active.closest || !active.closest('[data-r4v4-editing-text="1"], [contenteditable="true"]')) return;
            event.stopPropagation();
        }, true);

        doc.addEventListener('keyup', function (event) {
            const active = doc.activeElement;
            if (!active || !active.closest || !active.closest('[data-r4v4-editing-text="1"], [contenteditable="true"]')) return;
            event.stopPropagation();
        }, true);

        doc.addEventListener('mouseup', function (event) {
            const active = doc.activeElement;
            if (!active || !active.closest || !active.closest('[data-r4v4-editing-text="1"], [contenteditable="true"]')) return;
            event.stopPropagation();
        }, true);
    }

    function boot() {
        const editor = getEditor();
        if (!editor) return false;

        markEditableTextElements(editor);
        installCanvasGuards(editor);

        editor.on('load', function () {
            markEditableTextElements(editor);
            installCanvasGuards(editor);
        });

        editor.on('component:add component:update component:selected', function () {
            window.setTimeout(function () {
                markEditableTextElements(editor);
                installCanvasGuards(editor);
            }, 100);
        });

        return true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        let attempts = 0;
        const timer = window.setInterval(function () {
            attempts += 1;
            if (boot() || attempts > 50) {
                window.clearInterval(timer);
            }
        }, 100);
    });
})();

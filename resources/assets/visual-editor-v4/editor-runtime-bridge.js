(function () {
    'use strict';

    function normalizeLegacyAnimations(body) {
        if (!body) return;

        body.querySelectorAll('[data-anim]').forEach(function (element) {
            if (!element.hasAttribute('data-r4-animation')) {
                element.setAttribute('data-r4-animation', element.getAttribute('data-anim') || '');
            }
            if (!element.hasAttribute('data-r4-animation-duration') && element.hasAttribute('data-anim-duration')) {
                element.setAttribute('data-r4-animation-duration', element.getAttribute('data-anim-duration') || '700');
            }
            if (!element.hasAttribute('data-r4-animation-delay') && element.hasAttribute('data-anim-delay')) {
                element.setAttribute('data-r4-animation-delay', element.getAttribute('data-anim-delay') || '0');
            }
            if (!element.hasAttribute('data-r4-animation-distance') && element.hasAttribute('data-anim-distance')) {
                element.setAttribute('data-r4-animation-distance', element.getAttribute('data-anim-distance') || '40');
            }
        });
    }

    function revealAnimatedElements(body) {
        if (!body) return;

        body.querySelectorAll('[data-r4-animation], [data-anim]').forEach(function (element) {
            element.classList.add('r4-animation-visible', 'is-animated');
        });
    }

    function forceLeftToRightText(body) {
        if (!body) return;

        body.setAttribute('dir', 'ltr');
        body.style.direction = 'ltr';
        body.style.unicodeBidi = 'normal';

        body.querySelectorAll('p,span,a,li,h1,h2,h3,h4,h5,h6,blockquote,figcaption,strong,em,b,i,u,small,label,div').forEach(function (element) {
            element.setAttribute('dir', 'ltr');
            element.style.direction = 'ltr';
            element.style.unicodeBidi = 'normal';
        });
    }

    function isTextEditing(editor) {
        if (!editor || !editor.Canvas) return false;

        const doc = editor.Canvas.getDocument && editor.Canvas.getDocument();
        if (!doc || !doc.activeElement) return false;

        const active = doc.activeElement;

        return !!(
            active &&
            (
                active.isContentEditable ||
                active.closest?.('[contenteditable="true"]') ||
                active.closest?.('.gjs-rte-toolbar') ||
                active.closest?.('.gjs-rte-actionbar') ||
                active.closest?.('.gjs-selected[contenteditable="true"]')
            )
        );
    }

    function removePublicRuntime(doc) {
        if (!doc) return;

        const runtimeJs = doc.getElementById('r4v4-runtime-js');
        if (runtimeJs && runtimeJs.parentNode) {
            runtimeJs.parentNode.removeChild(runtimeJs);
        }
    }

    function injectEditorPreview(editor) {
        if (!editor || !editor.Canvas) return false;

        const doc = editor.Canvas.getDocument && editor.Canvas.getDocument();
        const body = editor.Canvas.getBody && editor.Canvas.getBody();

        if (!doc || !doc.head || !body) return false;

        forceLeftToRightText(body);

        if (isTextEditing(editor)) {
            return false;
        }

        body.classList.add('page-visual-content');
        normalizeLegacyAnimations(body);
        removePublicRuntime(doc);

        if (!doc.getElementById('r4v4-runtime-css')) {
            const link = doc.createElement('link');
            link.id = 'r4v4-runtime-css';
            link.rel = 'stylesheet';
            link.href = '/assets/page-builder/v4/runtime.css?v=' + Date.now();
            doc.head.appendChild(link);
        }

        if (!doc.getElementById('r4v4-editor-preview-fixes')) {
            const style = doc.createElement('style');
            style.id = 'r4v4-editor-preview-fixes';
            style.textContent = [
                'html,body{min-height:100%;overflow:auto!important;direction:ltr!important;unicode-bidi:normal!important;}',
                '.page-visual-content{min-height:100%;direction:ltr!important;unicode-bidi:normal!important;}',
                'body.gjs-dashed,body.gjs-dashed *{user-select:auto!important;-webkit-user-select:auto!important;direction:ltr!important;unicode-bidi:normal!important;}',
                'body.gjs-dashed p,body.gjs-dashed span,body.gjs-dashed a,body.gjs-dashed li,body.gjs-dashed h1,body.gjs-dashed h2,body.gjs-dashed h3,body.gjs-dashed h4,body.gjs-dashed h5,body.gjs-dashed h6{user-select:text!important;-webkit-user-select:text!important;text-align:inherit;direction:ltr!important;unicode-bidi:normal!important;}',
                '[contenteditable="true"]{direction:ltr!important;unicode-bidi:normal!important;text-align:inherit!important;}',
                '.r4v4-advanced-slider,.r4v4-fullscreen-slider{outline:1px dashed rgba(13,110,253,.25);}',
                '.r4v4-fullscreen-slider{min-height:760px!important;}',
                '.r4v4-fullscreen-slider__viewport{min-height:760px!important;}',
                '.r4v4-fullscreen-slider__content{min-height:760px!important;}',
                '.r4v4-slider-arrow,.r4v4-slider-dot{pointer-events:none!important;}'
            ].join('\n');
            doc.head.appendChild(style);
        }

        revealAnimatedElements(body);

        return true;
    }

    function boot() {
        const editor = window.r4VisualEditorV4Instance;
        if (!editor) return false;

        injectEditorPreview(editor);
        editor.on('load', function () { injectEditorPreview(editor); });
        editor.on('component:add', function () { window.setTimeout(function () { injectEditorPreview(editor); }, 50); });
        editor.on('component:selected', function () { window.setTimeout(function () { injectEditorPreview(editor); }, 50); });
        editor.on('rte:enable', function () {
            const doc = editor.Canvas.getDocument && editor.Canvas.getDocument();
            const body = editor.Canvas.getBody && editor.Canvas.getBody();
            removePublicRuntime(doc);
            forceLeftToRightText(body);
        });

        return true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        let attempts = 0;
        const timer = window.setInterval(function () {
            attempts++;
            if (boot() || attempts > 40) {
                window.clearInterval(timer);
            }
        }, 150);
    });
})();

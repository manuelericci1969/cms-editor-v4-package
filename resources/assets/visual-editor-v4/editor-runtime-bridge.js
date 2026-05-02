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

    function injectRuntime(editor) {
        if (!editor || !editor.Canvas) return false;

        const doc = editor.Canvas.getDocument && editor.Canvas.getDocument();
        const body = editor.Canvas.getBody && editor.Canvas.getBody();

        if (!doc || !doc.head || !body) return false;

        body.classList.add('page-visual-content');
        normalizeLegacyAnimations(body);

        if (!doc.getElementById('r4v4-runtime-css')) {
            const link = doc.createElement('link');
            link.id = 'r4v4-runtime-css';
            link.rel = 'stylesheet';
            link.href = '/assets/page-builder/v4/runtime.css?v=' + Date.now();
            doc.head.appendChild(link);
        }

        if (!doc.getElementById('r4v4-runtime-js')) {
            const script = doc.createElement('script');
            script.id = 'r4v4-runtime-js';
            script.src = '/assets/page-builder/v4/runtime.js?v=' + Date.now();
            script.defer = true;
            script.onload = function () {
                if (doc.defaultView && doc.defaultView.R4V4Runtime && typeof doc.defaultView.R4V4Runtime.boot === 'function') {
                    doc.defaultView.R4V4Runtime.boot();
                }
            };
            doc.body.appendChild(script);
        } else if (doc.defaultView && doc.defaultView.R4V4Runtime && typeof doc.defaultView.R4V4Runtime.boot === 'function') {
            doc.defaultView.R4V4Runtime.boot();
        }

        if (!doc.getElementById('r4v4-editor-preview-fixes')) {
            const style = doc.createElement('style');
            style.id = 'r4v4-editor-preview-fixes';
            style.textContent = [
                'html,body{min-height:100%;overflow:auto!important;}',
                '.page-visual-content{min-height:100%;}',
                '.r4v4-advanced-slider,.r4v4-fullscreen-slider{outline:1px dashed rgba(13,110,253,.25);}',
                '.r4v4-fullscreen-slider{min-height:760px!important;}',
                '.r4v4-fullscreen-slider__viewport{min-height:760px!important;}',
                '.r4v4-fullscreen-slider__content{min-height:760px!important;}',
                '.r4v4-slider-arrow,.r4v4-slider-dot{pointer-events:none;}',
                '[data-r4-animation]::after,[data-anim]::after{content:"Animazione";display:inline-block;margin-left:8px;padding:3px 7px;border-radius:999px;background:#eaf3ff;color:#0d6efd;font-size:11px;font-weight:800;vertical-align:middle;}'
            ].join('\n');
            doc.head.appendChild(style);
        }

        revealAnimatedElements(body);

        return true;
    }

    function boot() {
        const editor = window.r4VisualEditorV4Instance;
        if (!editor) return false;

        injectRuntime(editor);
        editor.on('load', function () { injectRuntime(editor); });
        editor.on('component:add', function () { window.setTimeout(function () { injectRuntime(editor); }, 50); });
        editor.on('component:update', function () { window.setTimeout(function () { injectRuntime(editor); }, 50); });
        editor.on('component:selected', function () { window.setTimeout(function () { injectRuntime(editor); }, 50); });

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

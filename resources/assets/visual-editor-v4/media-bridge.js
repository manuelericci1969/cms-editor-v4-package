(function () {
    'use strict';

    function ensureMediaResolutionModule() {
        if (window.__r4v4MediaResolutionScriptLoaded) return;

        window.__r4v4MediaResolutionScriptLoaded = true;

        const style = document.createElement('style');
        style.id = 'r4v4-modern-sidebar-style';
        style.textContent = `
            .r4v4-sidebar-left {
                background: linear-gradient(180deg, #f8fafc 0%, #eef4fb 100%);
                padding: 10px;
            }

            .r4v4-sidebar-left .r4v4-panel {
                border-radius: 18px;
                border-color: rgba(203, 213, 225, .9);
                box-shadow: 0 12px 28px rgba(15, 23, 42, .06);
                overflow: hidden;
            }

            .r4v4-sidebar-left .r4v4-panel-title {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 12px 14px;
                background: linear-gradient(135deg, #ffffff, #f1f5f9);
                border-bottom-color: rgba(203, 213, 225, .85);
            }

            .r4v4-panel-icon {
                width: 24px;
                height: 24px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border-radius: 9px;
                background: #eaf3ff;
                color: #0d6efd;
                font-size: 12px;
                line-height: 1;
            }

            .r4v4-editor .gjs-blocks-c {
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 10px;
            }

            .r4v4-editor .gjs-block {
                min-height: 82px;
                border-radius: 16px;
                background: linear-gradient(180deg, #ffffff, #f8fafc);
                border-color: #e2e8f0;
                box-shadow: 0 8px 18px rgba(15, 23, 42, .045);
            }

            .r4v4-editor .gjs-block:hover {
                border-color: #8bbcff;
                box-shadow: 0 14px 28px rgba(13, 110, 253, .13);
                transform: translateY(-2px);
            }

            .r4v4-block-icon {
                background: linear-gradient(135deg, #eaf3ff, #eef2ff);
                color: #0d6efd;
                box-shadow: inset 0 0 0 1px rgba(13, 110, 253, .08);
            }

            .r4v4-media-resolution-panel {
                border-top: 4px solid #0d6efd !important;
            }

            .r4v4-media-resolution-body {
                padding: 12px;
            }

            .r4v4-media-resolution-body label,
            .r4v4-media-resolution-toolbar label {
                display: block;
                margin-bottom: 6px;
                font-size: 11px;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: .04em;
                color: #475569;
            }

            .r4v4-media-resolution-body p {
                margin: 0 0 10px;
                font-size: 11px;
                line-height: 1.45;
                color: #64748b;
            }

            .r4v4-media-resolution-select {
                width: 100%;
                padding: 9px 10px;
                border: 1px solid #dbe4ee;
                border-radius: 12px;
                background: #fff;
                color: #172033;
                font-size: 12px;
                font-weight: 800;
            }

            .r4v4-media-resolution-toolbar {
                min-width: 190px;
            }

            .r4v4-media-toolbar {
                align-items: end;
            }

            .r4v4-media-item::after {
                content: attr(data-resolution-label);
                display: inline-flex;
                margin-top: 7px;
                padding: 3px 7px;
                border-radius: 999px;
                background: #eaf3ff;
                color: #084db5;
                font-size: 10px;
                font-weight: 900;
            }
        `;
        document.head.appendChild(style);

        const script = document.createElement('script');
        script.src = '/assets/admin/visual-editor-v4/media-resolution.js?v=' + Date.now();
        script.defer = true;
        document.head.appendChild(script);
    }

    function openR4MediaLibrary() {
        const mediaButton = document.querySelector('[data-r4v4-command="media"]');

        if (mediaButton) {
            mediaButton.click();
            return true;
        }

        return false;
    }

    function bridgeAssetManager() {
        const editor = window.r4VisualEditorV4Instance;

        if (!editor || !editor.Commands) {
            return false;
        }

        editor.Commands.add('open-assets', {
            run: function () {
                openR4MediaLibrary();
            },
            stop: function () {}
        });

        editor.Commands.add('core:open-assets', {
            run: function () {
                openR4MediaLibrary();
            },
            stop: function () {}
        });

        editor.on('asset:open', function () {
            openR4MediaLibrary();
        });

        editor.on('component:dblclick', function (component) {
            const tag = String(component && component.get && component.get('tagName') || '').toLowerCase();
            const type = String(component && component.get && component.get('type') || '').toLowerCase();

            if (tag === 'img' || type === 'image') {
                openR4MediaLibrary();
            }
        });

        return true;
    }

    document.addEventListener('DOMContentLoaded', function () {
        ensureMediaResolutionModule();

        let attempts = 0;
        const timer = window.setInterval(function () {
            attempts++;

            if (bridgeAssetManager() || attempts > 30) {
                window.clearInterval(timer);
            }
        }, 150);
    });
})();

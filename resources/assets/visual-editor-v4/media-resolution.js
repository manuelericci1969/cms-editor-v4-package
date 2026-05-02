(function () {
    'use strict';

    const cfg = window.R4VisualEditorV4 || {};
    const STORAGE_KEY = 'r4v4:media-resolution';
    const DEFAULT_VALUE = 'optimized';

    const OPTIONS = {
        optimized: 'Ottimizzata web',
        thumb: 'Leggera / thumbnail',
        original: 'Originale'
    };

    function getResolution() {
        try {
            return localStorage.getItem(STORAGE_KEY) || DEFAULT_VALUE;
        } catch (error) {
            return DEFAULT_VALUE;
        }
    }

    function setResolution(value) {
        const next = OPTIONS[value] ? value : DEFAULT_VALUE;
        try {
            localStorage.setItem(STORAGE_KEY, next);
        } catch (error) {}

        document.querySelectorAll('[data-r4v4-media-resolution]').forEach((select) => {
            if (select.value !== next) select.value = next;
        });

        updateMediaGridLabels();
    }

    function selectUrl(item, resolution) {
        if (!item || typeof item !== 'object') return '';

        const variants = item.variants || item.conversions || item.sizes || {};

        if (resolution === 'thumb') {
            return item.q25 || item.thumb || item.thumbnail || variants.thumb || variants.thumbnail || item.src || item.url || item.full || '';
        }

        if (resolution === 'original') {
            return item.original_url || item.original || item.full || item.url || item.src || item.q75 || item.thumb || '';
        }

        return item.q75 || item.optimized_url || item.web || item.medium || variants.web || variants.medium || item.full || item.src || item.url || item.thumb || '';
    }

    function normalizeItem(item) {
        if (!item || typeof item !== 'object') return item;

        const resolution = getResolution();
        const selectedUrl = selectUrl(item, resolution);

        return {
            ...item,
            q75: selectedUrl,
            selected_url: selectedUrl,
            selected_resolution: resolution
        };
    }

    function isMediaPickerUrl(input) {
        if (!cfg.mediaPickerUrl) return false;

        const requested = typeof input === 'string'
            ? input
            : (input && input.url ? input.url : '');

        if (!requested) return false;

        try {
            const mediaUrl = new URL(cfg.mediaPickerUrl, window.location.origin);
            const requestedUrl = new URL(requested, window.location.origin);
            return requestedUrl.pathname === mediaUrl.pathname;
        } catch (error) {
            return String(requested).includes(String(cfg.mediaPickerUrl));
        }
    }

    function updateMediaGridLabels() {
        const label = OPTIONS[getResolution()] || OPTIONS[DEFAULT_VALUE];
        document.querySelectorAll('.r4v4-media-item').forEach((item) => {
            item.setAttribute('data-resolution-label', label);
        });
    }

    function watchMediaGrid() {
        const grid = document.getElementById('r4v4MediaGrid');
        if (!grid || grid.__r4v4MediaResolutionObserver) return;

        grid.__r4v4MediaResolutionObserver = true;
        const observer = new MutationObserver(updateMediaGridLabels);
        observer.observe(grid, { childList: true, subtree: true });
        updateMediaGridLabels();
    }

    function patchFetch() {
        if (!window.fetch || window.__r4v4MediaResolutionFetchPatched) return;

        const nativeFetch = window.fetch.bind(window);
        window.__r4v4MediaResolutionFetchPatched = true;

        window.fetch = async function (input, init) {
            const response = await nativeFetch(input, init);

            if (!isMediaPickerUrl(input)) {
                return response;
            }

            try {
                const cloned = response.clone();
                const data = await cloned.json();

                if (Array.isArray(data.items)) {
                    data.items = data.items.map(normalizeItem);
                }

                return new Response(JSON.stringify(data), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            } catch (error) {
                return response;
            }
        };
    }

    function createSelect(className) {
        const select = document.createElement('select');
        select.className = className || 'r4v4-media-resolution-select';
        select.setAttribute('data-r4v4-media-resolution', '1');
        select.innerHTML = Object.keys(OPTIONS).map((key) => {
            return '<option value="' + key + '">' + OPTIONS[key] + '</option>';
        }).join('');
        select.value = getResolution();
        select.addEventListener('change', function () {
            setResolution(select.value);
        });
        return select;
    }

    function injectSidebarControl() {
        const leftSidebar = document.querySelector('.r4v4-sidebar-left');
        if (!leftSidebar || document.getElementById('r4v4MediaResolutionPanel')) return;

        const panel = document.createElement('div');
        panel.className = 'r4v4-panel r4v4-media-resolution-panel';
        panel.id = 'r4v4MediaResolutionPanel';
        panel.innerHTML = '<div class="r4v4-panel-title"><span class="r4v4-panel-icon">▣</span> Immagini</div>' +
            '<div class="r4v4-media-resolution-body">' +
            '<label for="r4v4DefaultMediaResolution">Risoluzione predefinita</label>' +
            '<p>Usata quando inserisci immagini, gallery, slider e caroselli dalla libreria media.</p>' +
            '</div>';

        const body = panel.querySelector('.r4v4-media-resolution-body');
        const select = createSelect('r4v4-media-resolution-select');
        select.id = 'r4v4DefaultMediaResolution';
        body.appendChild(select);

        leftSidebar.insertBefore(panel, leftSidebar.firstChild);
    }

    function injectMediaModalControl() {
        const toolbar = document.querySelector('.r4v4-media-toolbar');
        if (!toolbar || document.getElementById('r4v4ModalMediaResolution')) return;

        const wrap = document.createElement('div');
        wrap.className = 'r4v4-media-resolution-toolbar';
        wrap.innerHTML = '<label for="r4v4ModalMediaResolution">Risoluzione</label>';

        const select = createSelect('r4v4-media-resolution-select');
        select.id = 'r4v4ModalMediaResolution';
        wrap.appendChild(select);

        const uploadForm = toolbar.querySelector('form');
        if (uploadForm) {
            toolbar.insertBefore(wrap, uploadForm);
        } else {
            toolbar.appendChild(wrap);
        }
    }

    function bootUi() {
        injectSidebarControl();
        injectMediaModalControl();
        watchMediaGrid();
        updateMediaGridLabels();
    }

    patchFetch();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootUi);
    } else {
        bootUi();
    }

    window.R4V4MediaResolution = {
        get: getResolution,
        set: setResolution,
        normalizeItem,
        selectUrl
    };
})();

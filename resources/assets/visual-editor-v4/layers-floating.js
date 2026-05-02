(function () {
    'use strict';

    const STORAGE_KEY = 'r4v4_layers_floating_open';

    function byId(id) {
        return document.getElementById(id);
    }

    function getOpenButton() {
        return document.querySelector('[data-r4v4-command="layers"]');
    }

    function createFloatingPanel(layersNode) {
        const panel = document.createElement('section');
        panel.className = 'r4v4-floating-layers';
        panel.setAttribute('aria-label', 'Layers Editor V4');
        panel.hidden = true;
        panel.innerHTML = `
            <div class="r4v4-floating-layers__header">
                <div class="r4v4-floating-layers__title">Layers</div>
                <button type="button" class="r4v4-floating-layers__close" data-r4v4-layers-close aria-label="Chiudi Layers">×</button>
            </div>
            <div class="r4v4-floating-layers__body" data-r4v4-layers-body></div>
        `;

        panel.querySelector('[data-r4v4-layers-body]').appendChild(layersNode);
        document.body.appendChild(panel);

        return panel;
    }

    function setOpen(panel, open) {
        const button = getOpenButton();

        panel.hidden = !open;
        if (button) button.classList.toggle('is-active', open);

        try {
            window.localStorage.setItem(STORAGE_KEY, open ? '1' : '0');
        } catch (error) {
            // localStorage can be unavailable in private browsing or restricted contexts.
        }
    }

    function readInitialOpenState() {
        try {
            return window.localStorage.getItem(STORAGE_KEY) === '1';
        } catch (error) {
            return false;
        }
    }

    function initFloatingLayers() {
        const layersNode = byId('r4v4-layers');
        if (!layersNode || layersNode.dataset.r4v4FloatingReady === '1') return;
        layersNode.dataset.r4v4FloatingReady = '1';

        const sourcePanel = layersNode.closest('.r4v4-panel');
        if (sourcePanel) sourcePanel.classList.add('r4v4-layers-source-panel');

        const panel = createFloatingPanel(layersNode);
        const closeButton = panel.querySelector('[data-r4v4-layers-close]');
        const openButton = getOpenButton();

        if (closeButton) {
            closeButton.addEventListener('click', function () {
                setOpen(panel, false);
            });
        }

        if (openButton && openButton.dataset.r4v4LayersBound !== '1') {
            openButton.dataset.r4v4LayersBound = '1';
            openButton.addEventListener('click', function (event) {
                event.preventDefault();
                setOpen(panel, panel.hidden);
            });
        }

        setOpen(panel, readInitialOpenState());
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initFloatingLayers);
    } else {
        initFloatingLayers();
    }

    window.setTimeout(initFloatingLayers, 350);
    window.setTimeout(initFloatingLayers, 900);
})();

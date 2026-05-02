(function () {
    'use strict';

    function refreshEditor() {
        const editor = window.r4VisualEditorV4Instance;
        if (editor && typeof editor.refresh === 'function') {
            window.setTimeout(function () {
                editor.refresh();
            }, 180);
        }
    }

    function setButtonState(root, button) {
        const expanded = root.classList.contains('is-canvas-expanded');
        button.classList.toggle('is-active', expanded);
        button.textContent = expanded ? 'Mostra stile' : 'Allarga canvas';
        button.title = expanded
            ? 'Mostra il pannello Stile e Proprietà'
            : 'Nascondi il pannello Stile e Proprietà e allarga il canvas';
    }

    function createToggleButton(root) {
        if (document.getElementById('r4v4RightPanelToggle')) return;

        const button = document.createElement('button');
        button.type = 'button';
        button.id = 'r4v4RightPanelToggle';
        button.className = 'r4v4-panel-toggle';

        setButtonState(root, button);

        button.addEventListener('click', function () {
            root.classList.toggle('is-canvas-expanded');
            setButtonState(root, button);
            refreshEditor();
        });

        root.appendChild(button);
    }

    function boot() {
        const root = document.getElementById('r4VisualEditorV4');
        if (!root) return;

        root.classList.remove('is-wide-canvas');
        root.classList.remove('is-right-panel-open');
        createToggleButton(root);
        refreshEditor();
    }

    document.addEventListener('DOMContentLoaded', boot);
})();

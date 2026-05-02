(function () {
    'use strict';

    function resizeEditorCanvas() {
        const editor = window.r4VisualEditorV4Instance;
        if (editor && typeof editor.refresh === 'function') {
            window.setTimeout(function () {
                editor.refresh();
            }, 180);
        }
    }

    function setButtonState(button, active) {
        if (!button) return;
        button.classList.toggle('is-active', active);
        button.textContent = active ? 'Vista completa' : 'Focus canvas';
    }

    function bootFocusMode() {
        const root = document.getElementById('r4VisualEditorV4');
        const button = document.querySelector('[data-r4v4-command="focus"]');
        if (!root || !button) return;

        button.addEventListener('click', function () {
            const isActive = root.classList.toggle('is-focus-mode');
            setButtonState(button, isActive);
            resizeEditorCanvas();
        });

        document.addEventListener('keydown', function (event) {
            if (event.key !== 'Escape') return;
            if (!root.classList.contains('is-focus-mode')) return;

            root.classList.remove('is-focus-mode');
            setButtonState(button, false);
            resizeEditorCanvas();
        });
    }

    document.addEventListener('DOMContentLoaded', bootFocusMode);
})();

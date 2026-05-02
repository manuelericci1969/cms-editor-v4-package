(function () {
    'use strict';

    function removeAlert(alert) {
        if (!alert || alert.dataset.r4v4Dismissed === '1') return;
        alert.dataset.r4v4Dismissed = '1';
        alert.classList.add('is-hiding');
        window.setTimeout(function () {
            if (alert && alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, 220);
    }

    function bootFlashMessages() {
        document.querySelectorAll('.r4v4-alert').forEach(function (alert) {
            if (alert.dataset.r4v4FlashReady === '1') return;
            alert.dataset.r4v4FlashReady = '1';

            var closeButton = document.createElement('button');
            closeButton.type = 'button';
            closeButton.className = 'r4v4-alert-close';
            closeButton.setAttribute('aria-label', 'Chiudi messaggio');
            closeButton.innerHTML = '&times;';
            closeButton.addEventListener('click', function () {
                removeAlert(alert);
            });
            alert.appendChild(closeButton);

            if (alert.classList.contains('r4v4-alert-success')) {
                window.setTimeout(function () {
                    removeAlert(alert);
                }, 3000);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootFlashMessages);
    } else {
        bootFlashMessages();
    }
})();

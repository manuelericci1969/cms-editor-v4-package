(function () {
    'use strict';

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>'"]/g, function (char) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[char];
        });
    }

    function mediaUrl(item) {
        return item.q75 || item.full || item.src || item.url || '';
    }

    function getCfg() {
        return window.R4VisualEditorV4 || {};
    }

    function getEditor() {
        return window.r4VisualEditorV4Instance || null;
    }

    function selectedIds() {
        return Array.from(document.querySelectorAll('.r4v4-media-item.is-selected'))
            .map(function (item) { return Number(item.getAttribute('data-media-id')); })
            .filter(Boolean);
    }

    async function fetchSelectedMedia() {
        const cfg = getCfg();
        const ids = selectedIds();

        if (!ids.length) {
            alert('Seleziona almeno due immagini per creare uno slider.');
            return [];
        }

        const url = new URL(cfg.mediaPickerUrl, window.location.origin);
        url.searchParams.set('pb_mode', 'image');
        url.searchParams.set('per', '100');

        const response = await fetch(url.toString(), { headers: { 'Accept': 'application/json' } });
        const data = await response.json();
        const items = data.items || [];

        return ids.map(function (id) {
            const found = items.find(function (item) { return Number(item.id) === id; });
            if (found) return found;

            const btn = document.querySelector('.r4v4-media-item[data-media-id="' + id + '"]');
            const img = btn ? btn.querySelector('img') : null;
            const title = btn ? btn.innerText.trim() : 'Slide';
            return { id: id, src: img ? img.src : '', title: title, alt: title };
        });
    }

    function insertComponent(html) {
        const editor = getEditor();
        if (!editor) return;

        editor.addComponents(html);
        editor.trigger('update');

        const modal = document.getElementById('r4v4MediaModal');
        if (modal) modal.hidden = true;
    }

    function dots(items) {
        return items.map(function (_, index) {
            const activeClass = index === 0 ? ' is-active' : '';
            const current = index === 0 ? ' aria-current="true"' : ' aria-current="false"';
            return '<button type="button" class="r4v4-slider-dot' + activeClass + '" aria-label="Vai alla slide ' + (index + 1) + '"' + current + '></button>';
        }).join('');
    }

    function advancedSliderHtml(items) {
        const slides = items.map(function (item, index) {
            const src = mediaUrl(item);
            const title = escapeHtml(item.title || item.original_name || 'Slide ' + (index + 1));
            const alt = escapeHtml(item.alt || title);
            const activeClass = index === 0 ? ' is-active' : '';

            return '<article class="r4v4-advanced-slider__slide' + activeClass + '" data-r4v4-slide="' + index + '">' +
                '<div class="r4v4-advanced-slider__image"><img src="' + src + '" alt="' + alt + '"></div>' +
                '<div class="r4v4-advanced-slider__content">' +
                    '<span class="r4v4-advanced-slider__eyebrow">Slide ' + (index + 1) + '</span>' +
                    '<h2>' + title + '</h2>' +
                    '<p>Aggiungi qui testo, descrizione, vantaggi o contenuti promozionali collegati alla fotografia.</p>' +
                    '<a href="#">Approfondisci →</a>' +
                '</div>' +
            '</article>';
        }).join('');

        return '<section class="r4v4-advanced-slider" data-r4v4-slider data-r4v4-autoplay="true" data-r4v4-interval="5000">' +
            '<div class="r4v4-advanced-slider__viewport">' + slides + '</div>' +
            '<button type="button" class="r4v4-slider-arrow r4v4-slider-arrow--prev" aria-label="Slide precedente">‹</button>' +
            '<button type="button" class="r4v4-slider-arrow r4v4-slider-arrow--next" aria-label="Slide successiva">›</button>' +
            '<div class="r4v4-slider-dots">' + dots(items) + '</div>' +
        '</section>';
    }

    function fullscreenSliderHtml(items) {
        const slides = items.map(function (item, index) {
            const src = mediaUrl(item);
            const title = escapeHtml(item.title || item.original_name || 'Titolo slide ' + (index + 1));
            const alt = escapeHtml(item.alt || title);
            const activeClass = index === 0 ? ' is-active' : '';

            return '<article class="r4v4-fullscreen-slider__slide' + activeClass + '" data-r4v4-slide="' + index + '">' +
                '<img src="' + src + '" alt="' + alt + '">' +
                '<div class="r4v4-fullscreen-slider__overlay"></div>' +
                '<div class="r4v4-fullscreen-slider__content">' +
                    '<span>Slide ' + (index + 1) + '</span>' +
                    '<h1>' + title + '</h1>' +
                    '<p>Slider hero a tutto schermo con testo, frecce, pallini e autoplay.</p>' +
                    '<a href="#">Scopri di più</a>' +
                '</div>' +
            '</article>';
        }).join('');

        return '<section class="r4v4-fullscreen-slider" data-r4v4-slider data-r4v4-autoplay="true" data-r4v4-interval="5500">' +
            '<div class="r4v4-fullscreen-slider__viewport">' + slides + '</div>' +
            '<button type="button" class="r4v4-slider-arrow r4v4-slider-arrow--prev" aria-label="Slide precedente">‹</button>' +
            '<button type="button" class="r4v4-slider-arrow r4v4-slider-arrow--next" aria-label="Slide successiva">›</button>' +
            '<div class="r4v4-slider-dots">' + dots(items) + '</div>' +
        '</section>';
    }

    async function insertSlider(type) {
        const items = await fetchSelectedMedia();
        if (!items.length) return;

        if (items.length < 2) {
            alert('Per uno slider efficace seleziona almeno 2 immagini.');
            return;
        }

        insertComponent(type === 'fullscreen' ? fullscreenSliderHtml(items) : advancedSliderHtml(items));
    }

    function addButtons() {
        const footer = document.querySelector('.r4v4-media-footer');
        if (!footer || document.getElementById('r4v4MediaInsertAdvancedSlider')) return;

        const advanced = document.createElement('button');
        advanced.type = 'button';
        advanced.className = 'r4v4-btn r4v4-btn-light';
        advanced.id = 'r4v4MediaInsertAdvancedSlider';
        advanced.textContent = 'Inserisci slider avanzato';

        const fullscreen = document.createElement('button');
        fullscreen.type = 'button';
        fullscreen.className = 'r4v4-btn r4v4-btn-light';
        fullscreen.id = 'r4v4MediaInsertFullscreenSlider';
        fullscreen.textContent = 'Inserisci slider fullscreen';

        const carouselBtn = document.getElementById('r4v4MediaInsertLogoCarousel');
        if (carouselBtn) {
            footer.insertBefore(advanced, carouselBtn);
            footer.insertBefore(fullscreen, carouselBtn);
        } else {
            footer.appendChild(advanced);
            footer.appendChild(fullscreen);
        }

        advanced.addEventListener('click', function () { insertSlider('advanced'); });
        fullscreen.addEventListener('click', function () { insertSlider('fullscreen'); });
    }

    document.addEventListener('DOMContentLoaded', function () {
        let attempts = 0;
        const timer = window.setInterval(function () {
            attempts++;
            addButtons();

            if (document.getElementById('r4v4MediaInsertAdvancedSlider') || attempts > 30) {
                window.clearInterval(timer);
            }
        }, 150);
    });
})();

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

    function getEditor() {
        return window.r4VisualEditorV4Instance || null;
    }

    function getCfg() {
        return window.R4VisualEditorV4 || {};
    }

    function selectedIds() {
        return Array.from(document.querySelectorAll('.r4v4-media-item.is-selected'))
            .map(function (item) { return Number(item.getAttribute('data-media-id')); })
            .filter(Boolean);
    }

    function updateSelectionCount() {
        const counter = document.getElementById('r4v4MediaSelectedCount');
        if (!counter) return;

        const count = selectedIds().length;
        counter.textContent = count === 1 ? '1 immagine selezionata' : count + ' immagini selezionate';
        counter.classList.toggle('is-empty', count === 0);
    }

    async function fetchSelectedMedia() {
        const cfg = getCfg();
        const ids = selectedIds();

        if (!ids.length) {
            alert('Seleziona una o più immagini dalla libreria. Puoi cliccare su più miniature prima di inserire lo slider o il carosello.');
            return [];
        }

        if (!cfg.mediaPickerUrl) {
            return ids.map(function (id) {
                const btn = document.querySelector('.r4v4-media-item[data-media-id="' + id + '"]');
                const img = btn ? btn.querySelector('img') : null;
                const title = btn ? btn.innerText.trim() : 'Media';
                return { id: id, src: img ? img.src : '', title: title, alt: title };
            });
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
            const title = btn ? btn.innerText.trim() : 'Media';
            return { id: id, src: img ? img.src : '', title: title, alt: title };
        });
    }

    function getSelectedCanvasImage(editor) {
        const selected = editor && editor.getSelected ? editor.getSelected() : null;
        if (!selected) return null;

        const tag = String(selected.get && selected.get('tagName') || '').toLowerCase();
        const type = String(selected.get && selected.get('type') || '').toLowerCase();

        if (tag === 'img' || type === 'image') return selected;
        return null;
    }

    function replaceSelectedCanvasImage(item) {
        const editor = getEditor();
        const selectedImage = getSelectedCanvasImage(editor);
        if (!editor || !selectedImage) return false;

        const attrs = selectedImage.getAttributes ? selectedImage.getAttributes() : {};
        attrs.src = mediaUrl(item);
        attrs.alt = item.alt || item.title || item.original_name || '';
        attrs.title = item.title || item.original_name || '';

        selectedImage.setAttributes(attrs);
        editor.trigger('update');
        return true;
    }

    function getBackgroundTarget() {
        const editor = getEditor();
        return window.R4V4BackgroundMediaTarget || (editor && editor.getSelected ? editor.getSelected() : null);
    }

    function finishBackgroundMode() {
        window.R4V4_BACKGROUND_MEDIA_MODE = false;
        window.R4V4BackgroundMediaTarget = null;
        closeModal();
    }

    function applySelectedMediaAsBackground(item) {
        if (window.R4V4_BACKGROUND_MEDIA_MODE !== true && window.R4V4_BACKGROUND_MEDIA_MODE !== 'image') return false;

        const editor = getEditor();
        const component = getBackgroundTarget();
        const src = mediaUrl(item);

        if (!component || !src) return false;

        const style = component.getStyle ? component.getStyle() || {} : {};
        component.addStyle({
            position: style.position || 'relative',
            overflow: style.overflow || 'hidden',
            'background-image': 'url(' + src + ')',
            'background-size': style['background-size'] || 'cover',
            'background-position': style['background-position'] || 'center center',
            'background-repeat': 'no-repeat'
        });

        if (editor && typeof editor.trigger === 'function') editor.trigger('update');

        finishBackgroundMode();
        return true;
    }

    function applySelectedMediaAsBackgroundSlider(items) {
        if (window.R4V4_BACKGROUND_MEDIA_MODE !== 'slider') return false;

        const editor = getEditor();
        const component = getBackgroundTarget();
        const images = items.map(mediaUrl).filter(Boolean);

        if (!component || !images.length) return false;

        const style = component.getStyle ? component.getStyle() || {} : {};
        const attrs = component.getAttributes ? Object.assign({}, component.getAttributes() || {}) : {};

        attrs['data-r4-bg-slider'] = '1';
        attrs['data-r4-bg-slider-images'] = JSON.stringify(images);
        attrs['data-r4-bg-slider-duration'] = attrs['data-r4-bg-slider-duration'] || '5000';
        component.setAttributes(attrs);

        component.addStyle({
            position: style.position || 'relative',
            overflow: style.overflow || 'hidden',
            'background-image': 'url(' + images[0] + ')',
            'background-size': style['background-size'] || 'cover',
            'background-position': style['background-position'] || 'center center',
            'background-repeat': 'no-repeat'
        });

        if (editor && typeof editor.trigger === 'function') editor.trigger('update');

        finishBackgroundMode();
        return true;
    }

    function insertComponent(html) {
        const editor = getEditor();
        if (!editor) return;

        editor.addComponents(html);
        if (typeof editor.getHtml === 'function') {
            editor.trigger('update');
        }

        const modal = document.getElementById('r4v4MediaModal');
        if (modal) modal.hidden = true;
    }

    function closeModal() {
        const modal = document.getElementById('r4v4MediaModal');
        if (modal) modal.hidden = true;
    }

    function imageHtml(items) {
        const item = items[0];
        return '<img src="' + mediaUrl(item) + '" alt="' + escapeHtml(item.alt || item.title || '') + '" style="width:100%;height:auto;border-radius:22px;display:block;">';
    }

    function galleryHtml(items) {
        const cards = items.map(function (item) {
            const src = mediaUrl(item);
            const alt = escapeHtml(item.alt || item.title || item.original_name || '');
            return '<figure style="margin:0;border-radius:22px;overflow:hidden;background:#f8fafc;border:1px solid #e5e7eb;">' +
                '<img src="' + src + '" alt="' + alt + '" style="width:100%;height:240px;object-fit:cover;display:block;">' +
                '</figure>';
        }).join('');

        return '<section class="r4v4-gallery" style="padding:70px 24px;">' +
            '<div class="container" style="max-width:1180px;">' +
            '<div style="display:flex;justify-content:space-between;gap:24px;align-items:end;margin-bottom:28px;flex-wrap:wrap;">' +
            '<div><span style="display:inline-block;margin-bottom:10px;padding:7px 12px;border-radius:999px;background:#eaf3ff;color:#0d6efd;font-weight:900;">Gallery</span><h2 style="font-size:42px;font-weight:900;letter-spacing:-.03em;margin:0;">Galleria fotografica</h2></div>' +
            '<p style="max-width:460px;color:#64748b;line-height:1.7;margin:0;">Raccolta immagini selezionate dalla libreria media.</p>' +
            '</div>' +
            '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;">' + cards + '</div>' +
            '</div>' +
            '</section>';
    }

    function sliderHtml(items) {
        const slides = items.map(function (item, index) {
            const src = mediaUrl(item);
            const title = escapeHtml(item.title || item.original_name || 'Slide ' + (index + 1));
            const alt = escapeHtml(item.alt || title);
            return '<article style="min-width:100%;scroll-snap-align:start;display:grid;grid-template-columns:1.1fr .9fr;gap:34px;align-items:center;">' +
                '<img src="' + src + '" alt="' + alt + '" style="width:100%;height:460px;object-fit:cover;border-radius:28px;display:block;">' +
                '<div><span style="display:inline-block;margin-bottom:14px;padding:7px 12px;border-radius:999px;background:#eaf3ff;color:#0d6efd;font-weight:900;">Slide ' + (index + 1) + '</span><h2 style="font-size:42px;font-weight:900;letter-spacing:-.03em;margin:0 0 16px;">' + title + '</h2><p style="font-size:18px;line-height:1.7;color:#64748b;">Aggiungi qui descrizione, contesto o testo promozionale collegato alla fotografia.</p><a href="#" style="display:inline-block;margin-top:14px;color:#0d6efd;font-weight:900;text-decoration:none;">Approfondisci →</a></div>' +
                '</article>';
        }).join('');

        return '<section class="r4v4-photo-slider" style="padding:80px 24px;background:#f8fafc;">' +
            '<div class="container" style="max-width:1180px;overflow:hidden;">' +
            '<div style="display:flex;gap:0;overflow-x:auto;scroll-snap-type:x mandatory;scroll-behavior:smooth;border-radius:28px;">' + slides + '</div>' +
            '<p style="margin:16px 0 0;color:#64748b;font-size:14px;">Slider generato da ' + items.length + ' immagini. Puoi modificare testi, link e stile direttamente dal canvas.</p>' +
            '</div>' +
            '</section>';
    }

    function logoCarouselHtml(items) {
        const cards = items.map(function (item) {
            const src = mediaUrl(item);
            const title = escapeHtml(item.title || item.original_name || 'Logo / lavoro');
            const alt = escapeHtml(item.alt || title);
            return '<a href="#" target="_blank" style="display:block;text-decoration:none;color:inherit;padding:22px;border:1px solid #e5e7eb;border-radius:22px;background:#fff;box-shadow:0 10px 28px rgba(15,23,42,.06);">' +
                '<img src="' + src + '" alt="' + alt + '" style="width:100%;height:120px;object-fit:contain;display:block;margin-bottom:16px;">' +
                '<strong style="display:block;font-size:18px;color:#111827;">' + title + '</strong>' +
                '<span style="display:block;margin-top:6px;color:#64748b;line-height:1.5;">Descrizione opzionale del lavoro o cliente.</span>' +
                '</a>';
        }).join('');

        const duplicatedCards = cards + cards;

        return '<section class="r4v4-logo-carousel" style="padding:70px 24px;overflow:hidden;">' +
            '<style>@keyframes r4v4LogoMarquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}.r4v4-logo-carousel-track:hover{animation-play-state:paused!important}@media(max-width:768px){.r4v4-logo-carousel-track{animation-duration:35s!important}}</style>' +
            '<div class="container" style="max-width:1180px;">' +
            '<h2 style="font-size:42px;font-weight:900;letter-spacing:-.03em;text-align:center;margin:0 0 30px;">Loghi / lavori realizzati</h2>' +
            '<div style="overflow:hidden;width:100%;">' +
            '<div class="r4v4-logo-carousel-track" style="display:grid;grid-auto-flow:column;grid-auto-columns:minmax(220px,1fr);gap:18px;width:max-content;min-width:200%;animation:r4v4LogoMarquee 28s linear infinite;">' + duplicatedCards + '</div>' +
            '</div>' +
            '<p style="margin:18px 0 0;text-align:center;color:#64748b;font-size:14px;">Carosello automatico. Passa sopra con il mouse per fermare lo scorrimento.</p>' +
            '</div>' +
            '</section>';
    }

    async function handleInsert(buttonId, builder) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        button.addEventListener('click', async function (event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            const items = await fetchSelectedMedia();
            if (!items.length) return;

            if (buttonId === 'r4v4MediaInsertImage') {
                if (applySelectedMediaAsBackground(items[0])) return;

                if (replaceSelectedCanvasImage(items[0])) {
                    closeModal();
                    return;
                }
            }

            if (buttonId === 'r4v4MediaInsertSlider' && applySelectedMediaAsBackgroundSlider(items)) {
                return;
            }

            insertComponent(builder(items));
        }, true);
    }

    function enhanceMediaModal() {
        const footer = document.querySelector('.r4v4-media-footer');
        const grid = document.getElementById('r4v4MediaGrid');
        if (!footer || !grid) return;

        if (!document.getElementById('r4v4MediaSelectedCount')) {
            const info = document.createElement('div');
            info.className = 'r4v4-media-help';
            info.innerHTML = '<strong>Selezione multipla:</strong> clicca su più immagini prima di inserire Gallery, Slider o Carosello. <span id="r4v4MediaSelectedCount" class="is-empty">0 immagini selezionate</span><br><small>Per sostituire una singola immagine: selezionala nel canvas, apri Media, scegli una foto e clicca “Inserisci immagine”. Per uno slider di sfondo: apri Media dal pannello Sfondo → Slider background.</small>';
            footer.prepend(info);
        }

        grid.addEventListener('click', function () {
            window.setTimeout(updateSelectionCount, 0);
        });

        handleInsert('r4v4MediaInsertImage', imageHtml);
        handleInsert('r4v4MediaInsertGallery', galleryHtml);
        handleInsert('r4v4MediaInsertSlider', sliderHtml);
        handleInsert('r4v4MediaInsertLogoCarousel', logoCarouselHtml);
    }

    document.addEventListener('DOMContentLoaded', function () {
        let attempts = 0;
        const timer = window.setInterval(function () {
            attempts++;

            if (document.getElementById('r4v4MediaGrid') && getEditor()) {
                enhanceMediaModal();
                window.clearInterval(timer);
            }

            if (attempts > 30) {
                window.clearInterval(timer);
            }
        }, 150);
    });
})();

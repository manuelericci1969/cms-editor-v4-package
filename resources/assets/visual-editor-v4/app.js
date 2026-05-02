(function () {
    'use strict';

    const cfg = window.R4VisualEditorV4 || {};
    const byId = (id) => id ? document.getElementById(id) : null;
    let selectedMedia = [];

    function readJson(value) {
        if (!value || !String(value).trim()) return null;
        try {
            return JSON.parse(value);
        } catch (error) {
            console.warn('[R4 Editor V4] visual_json non valido:', error);
            return null;
        }
    }

    function mediaUrl(item) {
        return item.q75 || item.full || item.src || item.url || '';
    }

    function escapeHtml(value) {
        return String(value || '').replace(/[&<>'"]/g, function (char) {
            return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' })[char];
        });
    }

    function setActiveDeviceButton(deviceName) {
        document.querySelectorAll('[data-r4v4-device]').forEach((btn) => {
            btn.classList.toggle('is-active', btn.getAttribute('data-r4v4-device') === deviceName);
        });
    }

    function buildStarterContent() {
        return '<section style="padding:96px 24px;background:#f8fafc;">' +
            '<div class="container" style="max-width:1040px;">' +
            '<span style="display:inline-block;margin-bottom:18px;padding:8px 14px;border-radius:999px;background:#eaf3ff;color:#0d6efd;font-weight:800;">Editor V4</span>' +
            '<h1 style="font-size:54px;line-height:1.05;font-weight:900;letter-spacing:-.04em;margin:0 0 22px;color:#111827;">Nuova pagina visuale</h1>' +
            '<p style="font-size:20px;line-height:1.7;color:#64748b;max-width:760px;margin:0;">Trascina i widget dalla sidebar sinistra, seleziona un elemento e modifica stile/proprietà dal pannello destro.</p>' +
            '<div style="margin-top:32px;display:flex;gap:12px;flex-wrap:wrap;">' +
            '<a href="#" style="display:inline-block;padding:14px 22px;border-radius:14px;background:#0d6efd;color:#fff;text-decoration:none;font-weight:800;">Pulsante principale</a>' +
            '<a href="#" style="display:inline-block;padding:14px 22px;border-radius:14px;background:#fff;color:#111827;text-decoration:none;font-weight:800;border:1px solid #dbe4ee;">Secondario</a>' +
            '</div>' +
            '</div>' +
            '</section>';
    }

    function galleryHtml(items) {
        const cards = items.map((item) => {
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
        const slides = items.map((item, index) => {
            const src = mediaUrl(item);
            const title = escapeHtml(item.title || item.original_name || 'Slide ' + (index + 1));
            const alt = escapeHtml(item.alt || title);
            return '<div style="min-width:100%;display:grid;grid-template-columns:1.1fr .9fr;gap:34px;align-items:center;">' +
                '<img src="' + src + '" alt="' + alt + '" style="width:100%;height:460px;object-fit:cover;border-radius:28px;display:block;">' +
                '<div><span style="display:inline-block;margin-bottom:14px;padding:7px 12px;border-radius:999px;background:#eaf3ff;color:#0d6efd;font-weight:900;">Slide ' + (index + 1) + '</span><h2 style="font-size:42px;font-weight:900;letter-spacing:-.03em;margin:0 0 16px;">' + title + '</h2><p style="font-size:18px;line-height:1.7;color:#64748b;">Aggiungi qui descrizione, contesto o testo promozionale collegato alla fotografia.</p><a href="#" style="display:inline-block;margin-top:14px;color:#0d6efd;font-weight:900;text-decoration:none;">Approfondisci →</a></div>' +
                '</div>';
        }).join('');

        return '<section class="r4v4-photo-slider" style="padding:80px 24px;background:#f8fafc;">' +
            '<div class="container" style="max-width:1180px;overflow:hidden;">' +
            '<div style="display:flex;gap:0;overflow-x:auto;scroll-snap-type:x mandatory;">' + slides + '</div>' +
            '<p style="margin:16px 0 0;color:#64748b;font-size:14px;">Suggerimento: in questa prima versione lo slider è orizzontale e scrollabile; nella prossima fase possiamo aggiungere autoplay e frecce JS runtime.</p>' +
            '</div>' +
            '</section>';
    }

    function logoCarouselHtml(items) {
        const cards = items.map((item) => {
            const src = mediaUrl(item);
            const title = escapeHtml(item.title || item.original_name || 'Logo / lavoro');
            const alt = escapeHtml(item.alt || title);
            return '<a href="#" target="_blank" style="display:block;text-decoration:none;color:inherit;padding:22px;border:1px solid #e5e7eb;border-radius:22px;background:#fff;box-shadow:0 10px 28px rgba(15,23,42,.06);">' +
                '<img src="' + src + '" alt="' + alt + '" style="width:100%;height:120px;object-fit:contain;display:block;margin-bottom:16px;">' +
                '<strong style="display:block;font-size:18px;color:#111827;">' + title + '</strong>' +
                '<span style="display:block;margin-top:6px;color:#64748b;line-height:1.5;">Descrizione opzionale del lavoro o cliente.</span>' +
                '</a>';
        }).join('');

        return '<section class="r4v4-logo-carousel" style="padding:70px 24px;">' +
            '<div class="container" style="max-width:1180px;">' +
            '<h2 style="font-size:42px;font-weight:900;letter-spacing:-.03em;text-align:center;margin:0 0 30px;">Loghi / lavori realizzati</h2>' +
            '<div style="display:grid;grid-auto-flow:column;grid-auto-columns:minmax(220px,1fr);gap:18px;overflow-x:auto;padding-bottom:12px;">' + cards + '</div>' +
            '</div>' +
            '</section>';
    }

    function addBlock(editor, id, label, category, content, media) {
        editor.BlockManager.add(id, {
            label,
            category,
            media: media || '<span class="r4v4-block-icon">+</span>',
            content
        });
    }

    function registerBlocks(editor) {
        addBlock(editor, 'r4v4-section', 'Sezione', 'Layout', '<section style="padding:80px 24px;"><div class="container" style="max-width:1140px;"><h2 style="font-size:42px;font-weight:900;letter-spacing:-.03em;margin-bottom:18px;">Nuova sezione</h2><p style="font-size:18px;line-height:1.7;color:#64748b;">Inserisci qui il contenuto della sezione.</p></div></section>');
        addBlock(editor, 'r4v4-container', 'Container', 'Layout', '<div class="container" style="max-width:1140px;padding:40px 24px;"><h3 style="font-size:28px;font-weight:900;">Container</h3><p style="color:#64748b;line-height:1.7;">Contenuto del container.</p></div>');
        addBlock(editor, 'r4v4-two-columns', '2 Colonne', 'Layout', '<section style="padding:70px 24px;"><div class="container"><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:28px;"><div style="padding:32px;border:1px solid #e5e7eb;border-radius:22px;background:#fff;"><h3 style="font-size:26px;font-weight:900;">Colonna 1</h3><p style="color:#64748b;line-height:1.7;">Testo della prima colonna.</p></div><div style="padding:32px;border:1px solid #e5e7eb;border-radius:22px;background:#fff;"><h3 style="font-size:26px;font-weight:900;">Colonna 2</h3><p style="color:#64748b;line-height:1.7;">Testo della seconda colonna.</p></div></div></div></section>');
        addBlock(editor, 'r4v4-three-columns', '3 Colonne', 'Layout', '<section style="padding:70px 24px;"><div class="container"><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;"><div style="padding:28px;border:1px solid #e5e7eb;border-radius:20px;background:#fff;"><h3>Colonna 1</h3><p>Testo.</p></div><div style="padding:28px;border:1px solid #e5e7eb;border-radius:20px;background:#fff;"><h3>Colonna 2</h3><p>Testo.</p></div><div style="padding:28px;border:1px solid #e5e7eb;border-radius:20px;background:#fff;"><h3>Colonna 3</h3><p>Testo.</p></div></div></div></section>');
        addBlock(editor, 'r4v4-spacer', 'Spaziatore', 'Layout', '<div style="height:56px;"></div>');
        addBlock(editor, 'r4v4-divider', 'Separatore', 'Layout', '<hr style="border:0;border-top:1px solid #e5e7eb;margin:32px 0;">');

        addBlock(editor, 'r4v4-heading', 'Titolo', 'Base', '<h2 style="font-size:42px;line-height:1.15;font-weight:900;letter-spacing:-.03em;margin:0 0 18px;">Titolo sezione</h2>');
        addBlock(editor, 'r4v4-text', 'Testo', 'Base', '<p style="font-size:18px;line-height:1.7;color:#475569;">Inserisci qui il tuo testo. Puoi modificarlo direttamente nel canvas.</p>');
        addBlock(editor, 'r4v4-button', 'Pulsante', 'Base', '<a href="#" style="display:inline-block;padding:13px 20px;border-radius:12px;background:#0d6efd;color:#fff;text-decoration:none;font-weight:900;">Pulsante</a>');
        addBlock(editor, 'r4v4-image', 'Immagine', 'Base', '<img src="https://placehold.co/900x520?text=Immagine" alt="" style="width:100%;height:auto;border-radius:22px;display:block;">');
        addBlock(editor, 'r4v4-video', 'Video', 'Base', '<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:22px;background:#111827;"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position:absolute;inset:0;width:100%;height:100%;border:0;" allowfullscreen></iframe></div>');
        addBlock(editor, 'r4v4-icon', 'Icona', 'Base', '<div style="width:58px;height:58px;border-radius:18px;background:#eaf3ff;color:#0d6efd;display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:900;">✓</div>');

        addBlock(editor, 'r4v4-gallery-tool', 'Gallery Media', 'Media', '<section style="padding:70px 24px;"><div class="container" style="max-width:1180px;"><h2 style="font-size:42px;font-weight:900;margin-bottom:24px;">Galleria fotografica</h2><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px;"><img src="https://placehold.co/600x420?text=Foto+1" style="width:100%;height:240px;object-fit:cover;border-radius:22px;"><img src="https://placehold.co/600x420?text=Foto+2" style="width:100%;height:240px;object-fit:cover;border-radius:22px;"><img src="https://placehold.co/600x420?text=Foto+3" style="width:100%;height:240px;object-fit:cover;border-radius:22px;"></div></div></section>');
        addBlock(editor, 'r4v4-slider-tool', 'Slider Foto + Testo', 'Media', '<section style="padding:80px 24px;background:#f8fafc;"><div class="container" style="max-width:1180px;"><div style="display:grid;grid-template-columns:1.1fr .9fr;gap:34px;align-items:center;"><img src="https://placehold.co/900x520?text=Slide" style="width:100%;height:460px;object-fit:cover;border-radius:28px;"><div><span style="display:inline-block;margin-bottom:14px;padding:7px 12px;border-radius:999px;background:#eaf3ff;color:#0d6efd;font-weight:900;">Slider</span><h2 style="font-size:42px;font-weight:900;letter-spacing:-.03em;margin:0 0 16px;">Foto + testo</h2><p style="font-size:18px;line-height:1.7;color:#64748b;">Usa la libreria media per generare uno slider con testi collegati.</p></div></div></div></section>');
        addBlock(editor, 'r4v4-logo-carousel-tool', 'Carosello Lavori', 'Media', '<section style="padding:70px 24px;"><div class="container" style="max-width:1180px;"><h2 style="font-size:42px;font-weight:900;text-align:center;margin:0 0 30px;">Loghi / lavori realizzati</h2><div style="display:grid;grid-auto-flow:column;grid-auto-columns:minmax(220px,1fr);gap:18px;overflow-x:auto;"><a href="#" style="display:block;text-decoration:none;color:inherit;padding:22px;border:1px solid #e5e7eb;border-radius:22px;background:#fff;"><img src="https://placehold.co/300x180?text=Logo" style="width:100%;height:120px;object-fit:contain;"><strong style="display:block;margin-top:12px;">Cliente / lavoro</strong><span style="color:#64748b;">Descrizione opzionale</span></a></div></div></section>');

        addBlock(editor, 'r4v4-hero', 'Hero', 'Marketing', '<section style="padding:120px 24px;background:linear-gradient(135deg,#0d6efd,#111827);color:#fff;"><div class="container" style="max-width:980px;"><span style="display:inline-block;margin-bottom:18px;padding:8px 14px;border-radius:999px;background:rgba(255,255,255,.15);font-weight:800;">Visual Editor V4</span><h1 style="font-size:58px;line-height:1.04;font-weight:900;letter-spacing:-.04em;margin-bottom:22px;">Crea pagine professionali in modo visuale</h1><p style="font-size:20px;line-height:1.65;max-width:720px;opacity:.92;">Una base editoriale moderna, modulare e ispirata ai migliori visual builder.</p><a href="#" style="display:inline-block;margin-top:26px;padding:14px 22px;border-radius:14px;background:#fff;color:#0d6efd;text-decoration:none;font-weight:900;">Call to action</a></div></section>');
        addBlock(editor, 'r4v4-feature-card', 'Feature Card', 'Marketing', '<div style="padding:32px;border:1px solid #e5e7eb;border-radius:22px;background:#fff;box-shadow:0 14px 35px rgba(15,23,42,.08);"><div style="width:48px;height:48px;border-radius:16px;background:#eaf3ff;color:#0d6efd;display:flex;align-items:center;justify-content:center;font-weight:900;margin-bottom:18px;">✓</div><h3 style="font-size:24px;font-weight:900;margin-bottom:12px;">Vantaggio principale</h3><p style="font-size:16px;line-height:1.7;color:#64748b;margin:0;">Descrivi qui il valore del servizio o della funzionalità.</p></div>');
        addBlock(editor, 'r4v4-icon-box', 'Icon Box', 'Marketing', '<div style="display:flex;gap:18px;align-items:flex-start;padding:28px;border-radius:22px;background:#fff;border:1px solid #e5e7eb;"><div style="width:54px;height:54px;flex:0 0 54px;border-radius:18px;background:#eaf3ff;color:#0d6efd;display:flex;align-items:center;justify-content:center;font-weight:900;">★</div><div><h3 style="font-size:22px;font-weight:900;margin:0 0 8px;">Icon Box</h3><p style="margin:0;color:#64748b;line-height:1.7;">Descrizione breve del vantaggio.</p></div></div>');
        addBlock(editor, 'r4v4-stats', 'Statistiche', 'Marketing', '<section style="padding:70px 24px;background:#f8fafc;"><div class="container"><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:22px;text-align:center;"><div><div style="font-size:48px;font-weight:900;color:#0d6efd;">120+</div><p style="color:#64748b;">Clienti</p></div><div><div style="font-size:48px;font-weight:900;color:#0d6efd;">98%</div><p style="color:#64748b;">Soddisfazione</p></div><div><div style="font-size:48px;font-weight:900;color:#0d6efd;">24/7</div><p style="color:#64748b;">Supporto</p></div></div></div></section>');
        addBlock(editor, 'r4v4-testimonial', 'Testimonianza', 'Marketing', '<div style="padding:34px;border-radius:24px;background:#fff;border:1px solid #e5e7eb;box-shadow:0 14px 35px rgba(15,23,42,.08);"><p style="font-size:20px;line-height:1.7;color:#334155;margin:0 0 22px;">“Inserisci qui una testimonianza o recensione del cliente.”</p><strong style="display:block;color:#111827;">Nome Cliente</strong><span style="color:#64748b;">Ruolo / Azienda</span></div>');
        addBlock(editor, 'r4v4-pricing', 'Pricing Card', 'Marketing', '<div style="padding:36px;border:1px solid #dbe4ee;border-radius:26px;background:#fff;box-shadow:0 16px 40px rgba(15,23,42,.08);"><h3 style="font-size:28px;font-weight:900;margin-bottom:10px;">Piano Pro</h3><div style="font-size:46px;font-weight:900;color:#0d6efd;margin-bottom:16px;">€99</div><ul style="padding-left:20px;color:#475569;line-height:1.9;"><li>Funzione principale</li><li>Supporto incluso</li><li>Aggiornamenti</li></ul><a href="#" style="display:block;text-align:center;margin-top:24px;padding:14px 20px;border-radius:14px;background:#0d6efd;color:#fff;text-decoration:none;font-weight:900;">Acquista</a></div>');
        addBlock(editor, 'r4v4-final-cta', 'CTA Finale', 'Marketing', '<section style="padding:80px 24px;background:#111827;color:#fff;"><div class="container" style="max-width:920px;text-align:center;"><h2 style="font-size:44px;line-height:1.1;font-weight:900;letter-spacing:-.03em;margin-bottom:18px;">Pronto a partire?</h2><p style="font-size:18px;line-height:1.7;color:#cbd5e1;max-width:680px;margin:0 auto 28px;">Inserisci qui una call to action forte e chiara.</p><a href="#" style="display:inline-block;padding:14px 24px;border-radius:14px;background:#0d6efd;color:#fff;text-decoration:none;font-weight:900;">Contattaci</a></div></section>');

        addBlock(editor, 'r4v4-faq', 'FAQ', 'Interattivi', '<section style="padding:70px 24px;"><div class="container" style="max-width:860px;"><h2 style="font-size:40px;font-weight:900;text-align:center;margin-bottom:32px;">Domande frequenti</h2><details style="padding:20px;border:1px solid #e5e7eb;border-radius:16px;margin-bottom:12px;background:#fff;"><summary style="font-weight:900;cursor:pointer;">Prima domanda?</summary><p style="color:#64748b;line-height:1.7;margin-top:12px;">Risposta alla prima domanda.</p></details><details style="padding:20px;border:1px solid #e5e7eb;border-radius:16px;background:#fff;"><summary style="font-weight:900;cursor:pointer;">Seconda domanda?</summary><p style="color:#64748b;line-height:1.7;margin-top:12px;">Risposta alla seconda domanda.</p></details></div></section>');
        addBlock(editor, 'r4v4-tabs', 'Tabs', 'Interattivi', '<div style="border:1px solid #e5e7eb;border-radius:22px;overflow:hidden;background:#fff;"><div style="display:flex;background:#f8fafc;border-bottom:1px solid #e5e7eb;"><div style="padding:16px 20px;font-weight:900;color:#0d6efd;">Tab 1</div><div style="padding:16px 20px;font-weight:900;color:#64748b;">Tab 2</div></div><div style="padding:28px;"><h3 style="font-weight:900;">Contenuto Tab</h3><p style="color:#64748b;line-height:1.7;">Contenuto descrittivo della tab.</p></div></div>');
        addBlock(editor, 'r4v4-alert', 'Alert', 'Interattivi', '<div style="padding:18px 20px;border-radius:16px;background:#eaf3ff;color:#0d47a1;border:1px solid #b9d8ff;font-weight:700;">Messaggio informativo importante.</div>');

        addBlock(editor, 'r4v4-crewlive-tech', 'Card Tecnico', 'CrewLive', '<div style="padding:30px;border-radius:24px;background:#fff;border:1px solid #e5e7eb;box-shadow:0 14px 35px rgba(15,23,42,.08);"><span style="display:inline-block;margin-bottom:14px;padding:7px 12px;border-radius:999px;background:#eaf3ff;color:#0d6efd;font-weight:900;">Tecnico</span><h3 style="font-size:26px;font-weight:900;margin-bottom:10px;">Profilo Tecnico</h3><p style="color:#64748b;line-height:1.7;">Audio, luci, video, palco o produzione. Presenta competenze e disponibilità.</p><a href="#" style="display:inline-block;margin-top:12px;color:#0d6efd;font-weight:900;text-decoration:none;">Iscriviti come tecnico →</a></div>');
        addBlock(editor, 'r4v4-crewlive-company', 'Card Azienda', 'CrewLive', '<div style="padding:30px;border-radius:24px;background:#111827;color:#fff;border:1px solid #1f2937;box-shadow:0 14px 35px rgba(15,23,42,.16);"><span style="display:inline-block;margin-bottom:14px;padding:7px 12px;border-radius:999px;background:rgba(255,255,255,.12);font-weight:900;">Azienda / Service</span><h3 style="font-size:26px;font-weight:900;margin-bottom:10px;">Trova tecnici qualificati</h3><p style="color:#cbd5e1;line-height:1.7;">Crea la tua presenza e accedi a figure operative specializzate per eventi e produzioni.</p><a href="#" style="display:inline-block;margin-top:12px;color:#fff;font-weight:900;text-decoration:none;">Iscrivi la tua azienda →</a></div>');
    }

    function initMediaLibrary(editor, syncFields) {
        const modal = byId('r4v4MediaModal');
        const grid = byId('r4v4MediaGrid');
        const search = byId('r4v4MediaSearch');
        const searchBtn = byId('r4v4MediaSearchBtn');
        const uploadForm = byId('r4v4MediaUploadForm');
        const uploadFile = byId('r4v4MediaUploadFile');

        if (!modal || !grid || !cfg.mediaPickerUrl) return;

        async function loadMedia() {
            grid.innerHTML = '<div class="r4v4-media-loading">Caricamento media...</div>';
            const url = new URL(cfg.mediaPickerUrl, window.location.origin);
            url.searchParams.set('pb_mode', 'image');
            url.searchParams.set('per', '48');
            if (search && search.value) url.searchParams.set('q', search.value);

            const response = await fetch(url.toString(), { headers: { 'Accept': 'application/json' } });
            const data = await response.json();
            const items = data.items || [];

            if (!items.length) {
                grid.innerHTML = '<div class="r4v4-media-loading">Nessun media trovato.</div>';
                return;
            }

            grid.innerHTML = items.map((item) => {
                const src = item.thumb || item.q25 || item.src || item.url;
                const title = escapeHtml(item.title || item.original_name || 'Media');
                return '<button type="button" class="r4v4-media-item" data-media-id="' + item.id + '">' +
                    '<img src="' + src + '" alt="' + title + '">' +
                    '<span>' + title + '</span>' +
                    '</button>';
            }).join('');

            grid.querySelectorAll('.r4v4-media-item').forEach((btn) => {
                btn.addEventListener('click', function () {
                    const id = Number(btn.getAttribute('data-media-id'));
                    const item = items.find((m) => Number(m.id) === id);
                    if (!item) return;

                    const exists = selectedMedia.some((m) => Number(m.id) === id);
                    if (exists) {
                        selectedMedia = selectedMedia.filter((m) => Number(m.id) !== id);
                        btn.classList.remove('is-selected');
                    } else {
                        selectedMedia.push(item);
                        btn.classList.add('is-selected');
                    }
                });
            });
        }

        function openMedia() {
            selectedMedia = [];
            modal.hidden = false;
            loadMedia().catch((error) => {
                console.error('[R4 Editor V4] Errore caricamento media', error);
                grid.innerHTML = '<div class="r4v4-media-loading">Errore caricamento media.</div>';
            });
        }

        function closeMedia() {
            modal.hidden = true;
        }

        document.querySelectorAll('[data-r4v4-media-close]').forEach((el) => el.addEventListener('click', closeMedia));
        if (searchBtn) searchBtn.addEventListener('click', () => loadMedia());
        if (search) search.addEventListener('keydown', (event) => { if (event.key === 'Enter') loadMedia(); });

        if (uploadForm && uploadFile && cfg.mediaUploadUrl) {
            uploadForm.addEventListener('submit', async function (event) {
                event.preventDefault();
                if (!uploadFile.files || !uploadFile.files[0]) return;

                const formData = new FormData();
                formData.append('file', uploadFile.files[0]);

                const response = await fetch(cfg.mediaUploadUrl, {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': cfg.csrfToken || ''
                    },
                    body: formData
                });

                if (!response.ok) {
                    alert('Upload non riuscito. Verifica formato e dimensione del file.');
                    return;
                }

                uploadFile.value = '';
                await loadMedia();
            });
        }

        const insertComponent = (html) => {
            editor.addComponents(html);
            syncFields();
            closeMedia();
        };

        const insertImage = byId('r4v4MediaInsertImage');
        const insertGallery = byId('r4v4MediaInsertGallery');
        const insertSlider = byId('r4v4MediaInsertSlider');
        const insertLogoCarousel = byId('r4v4MediaInsertLogoCarousel');

        if (insertImage) insertImage.addEventListener('click', function () {
            if (!selectedMedia.length) return alert('Seleziona almeno una immagine.');
            const item = selectedMedia[0];
            insertComponent('<img src="' + mediaUrl(item) + '" alt="' + escapeHtml(item.alt || item.title || '') + '" style="width:100%;height:auto;border-radius:22px;display:block;">');
        });
        if (insertGallery) insertGallery.addEventListener('click', function () {
            if (!selectedMedia.length) return alert('Seleziona almeno una immagine.');
            insertComponent(galleryHtml(selectedMedia));
        });
        if (insertSlider) insertSlider.addEventListener('click', function () {
            if (!selectedMedia.length) return alert('Seleziona almeno una immagine.');
            insertComponent(sliderHtml(selectedMedia));
        });
        if (insertLogoCarousel) insertLogoCarousel.addEventListener('click', function () {
            if (!selectedMedia.length) return alert('Seleziona almeno una immagine.');
            insertComponent(logoCarouselHtml(selectedMedia));
        });

        return { openMedia };
    }

    document.addEventListener('DOMContentLoaded', function () {
        if (typeof grapesjs === 'undefined') {
            console.error('[R4 Editor V4] GrapesJS non caricato.');
            return;
        }

        const form = byId(cfg.formId);
        const htmlField = byId(cfg.htmlFieldId);
        const cssField = byId(cfg.cssFieldId);
        const jsonField = byId(cfg.jsonFieldId);
        const statusField = byId(cfg.statusFieldId);
        const savedProject = readJson(jsonField ? jsonField.value : '');

        const editor = grapesjs.init({
            container: '#' + cfg.canvasId,
            height: '100%',
            width: '100%',
            fromElement: false,
            storageManager: false,
            canvas: {
                styles: ['https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css']
            },
            blockManager: { appendTo: '#' + cfg.blocksId },
            layerManager: { appendTo: '#' + cfg.layersId },
            selectorManager: { appendTo: '#' + cfg.stylesId },
            traitManager: { appendTo: '#' + cfg.traitsId },
            panels: { defaults: [] },
            deviceManager: {
                devices: [
                    { name: 'Desktop', width: '' },
                    { name: 'Tablet', width: '768px', widthMedia: '992px' },
                    { name: 'Mobile', width: '375px', widthMedia: '576px' }
                ]
            },
            styleManager: {
                appendTo: '#' + cfg.stylesId,
                sectors: [
                    { name: 'Layout', open: true, properties: ['display', 'position', 'width', 'height', 'max-width', 'min-height', 'overflow'] },
                    { name: 'Spaziatura', open: true, properties: ['margin', 'padding'] },
                    { name: 'Tipografia', open: true, properties: ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color', 'text-align', 'text-decoration'] },
                    { name: 'Sfondo', open: false, properties: ['background-color', 'background', 'background-image', 'background-size', 'background-position'] },
                    { name: 'Bordi e ombre', open: false, properties: ['border', 'border-radius', 'box-shadow', 'opacity'] },
                    { name: 'Flex/Grid', open: false, properties: ['flex-direction', 'justify-content', 'align-items', 'flex-wrap', 'gap', 'grid-template-columns'] }
                ]
            }
        });

        window.r4VisualEditorV4Instance = editor;
        registerBlocks(editor);

        if (savedProject && Object.keys(savedProject).length) {
            try {
                editor.loadProjectData(savedProject);
            } catch (error) {
                console.warn('[R4 Editor V4] Impossibile caricare visual_json, uso HTML/CSS:', error);
                if (htmlField && htmlField.value) editor.setComponents(htmlField.value);
                if (cssField && cssField.value) editor.setStyle(cssField.value);
            }
        } else {
            editor.setComponents((htmlField && htmlField.value) ? htmlField.value : buildStarterContent());
            if (cssField && cssField.value) editor.setStyle(cssField.value);
        }

        function syncFields() {
            if (htmlField) htmlField.value = editor.getHtml();
            if (cssField) cssField.value = editor.getCss();
            if (jsonField) jsonField.value = JSON.stringify(editor.getProjectData());
        }

        const mediaLibrary = initMediaLibrary(editor, syncFields);

        editor.on('update', syncFields);

        document.querySelectorAll('[data-r4v4-device]').forEach((btn) => {
            btn.addEventListener('click', function () {
                const device = btn.getAttribute('data-r4v4-device') || 'Desktop';
                editor.setDevice(device);
                setActiveDeviceButton(device);
            });
        });

        document.querySelectorAll('[data-r4v4-command]').forEach((btn) => {
            btn.addEventListener('click', function () {
                const command = btn.getAttribute('data-r4v4-command');

                if (command === 'media' && mediaLibrary) mediaLibrary.openMedia();
                if (command === 'undo') editor.runCommand('core:undo');
                if (command === 'redo') editor.runCommand('core:redo');
                if (command === 'preview') editor.runCommand('preview');
                if (command === 'clear' && window.confirm('Svuotare completamente il canvas?')) {
                    editor.DomComponents.clear();
                    editor.CssComposer.clear();
                    editor.setComponents(buildStarterContent());
                    syncFields();
                }
            });
        });

        document.querySelectorAll('[data-r4v4-submit-status]').forEach((btn) => {
            btn.addEventListener('click', function () {
                if (statusField) statusField.value = btn.getAttribute('data-r4v4-submit-status') || 'draft';
                syncFields();
            });
        });

        if (form) form.addEventListener('submit', syncFields);

        setActiveDeviceButton('Desktop');
        setTimeout(syncFields, 300);
    });
})();

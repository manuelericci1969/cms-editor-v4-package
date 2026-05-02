// Editor V4 - contextual help for left menu fields
(function () {
    'use strict';

    const HELP_MAP = new Map(Object.entries({
        // Sezioni menu
        'pagina': 'Impostazioni generali della pagina: titolo, slug, stato, pubblicazione, SEO e visibilità frontend.',
        'page': 'Impostazioni generali della pagina: titolo, slug, stato, pubblicazione, SEO e visibilità frontend.',
        'layout': 'Gestisce struttura generale, larghezza, spaziature, fullscreen, attacco al top e comportamento responsive.',
        'widgets': 'Raccoglie componenti già pronti e blocchi preconfigurati da inserire velocemente nel canvas.',
        'widget': 'Componente già pronto da inserire nel canvas con configurazione di base preimpostata.',
        'elementi': 'Elementi base come testi, immagini, bottoni, colonne, contenitori e componenti HTML semplici.',
        'elements': 'Elementi base come testi, immagini, bottoni, colonne, contenitori e componenti HTML semplici.',
        'spaziature': 'Gestisce margini e padding dell’elemento selezionato per controllare le distanze interne ed esterne.',
        'spacing': 'Gestisce margini e padding dell’elemento selezionato per controllare le distanze interne ed esterne.',
        'tipografia': 'Gestisce font, dimensione, peso, interlinea, colore e allineamento dei testi selezionati.',
        'typography': 'Gestisce font, dimensione, peso, interlinea, colore e allineamento dei testi selezionati.',
        'sfondo': 'Configura colore, immagine, gradiente e comportamento dello sfondo dell’elemento o della pagina.',
        'background': 'Configura colore, immagine, gradiente e comportamento dello sfondo dell’elemento o della pagina.',
        'bordo': 'Gestisce bordi, raggiatura angoli, ombre e separazioni visive dell’elemento selezionato.',
        'border': 'Gestisce bordi, raggiatura angoli, ombre e separazioni visive dell’elemento selezionato.',
        'effetti': 'Gestisce animazioni, transizioni, opacità, trasformazioni e comportamenti dinamici dell’elemento selezionato.',
        'effects': 'Gestisce animazioni, transizioni, opacità, trasformazioni e comportamenti dinamici dell’elemento selezionato.',
        'avanzate': 'Impostazioni tecniche per classi CSS, ID, attributi, visibilità responsive e ottimizzazioni avanzate.',
        'advanced': 'Impostazioni tecniche per classi CSS, ID, attributi, visibilità responsive e ottimizzazioni avanzate.',
        'layers': 'Mostra la struttura gerarchica degli elementi presenti nel canvas e permette di selezionarli rapidamente.',
        'blocchi': 'Libreria dei blocchi disponibili da trascinare o inserire nella pagina.',

        // Pagina / SEO
        'titolo pagina': 'Nome principale della pagina. Viene usato nel backend e può essere mostrato anche nel frontend.',
        'titolo': 'Nome o testo principale dell’elemento o della pagina.',
        'slug': 'Definisce l’indirizzo pubblico della pagina. Deve essere breve, leggibile e ottimizzato SEO.',
        'estratto': 'Breve riassunto della pagina, utile per anteprime, card, liste contenuti e presentazioni editoriali.',
        'data pubblicazione': 'Permette di programmare o retrodatare la pubblicazione. Se vuota, la pagina può essere pubblicata subito.',
        'stato': 'Definisce se la pagina è bozza, pubblicata o archiviata.',
        'homepage': 'Imposta questa pagina come pagina iniziale del sito, se il CMS prevede una home dinamica.',
        'meta title': 'Titolo SEO mostrato nei risultati dei motori di ricerca. Consigliato entro 55–60 caratteri.',
        'meta description': 'Descrizione SEO mostrata nei risultati di ricerca. Consigliata entro 150–160 caratteri.',
        'meta keywords': 'Parole chiave descrittive della pagina. Oggi hanno valore limitato per Google, ma possono aiutare catalogazione interna o motori minori.',
        'mostra titolo': 'Se attivo, il titolo della pagina viene visualizzato nel frontend.',
        'mostra estratto': 'Se attivo, l’estratto viene mostrato nel frontend sotto o vicino al titolo.',
        'mostra data pubblicazione': 'Mostra la data della pagina. Utile per news e articoli, meno adatto a landing commerciali.',
        'mostra autore': 'Mostra autore o ultimo editor. Utile per blog e contenuti firmati.',
        'mostra breadcrumb': 'Mostra il percorso di navigazione della pagina, utile per usabilità e SEO.',

        // Layout
        'preset pagina': 'Applica una configurazione generale: default, boxed, full width, fullscreen, landing o blank canvas.',
        'larghezza': 'Controlla se il contenuto resta standard, boxed/centrato oppure a piena larghezza.',
        'max width boxed': 'Larghezza massima del contenitore centrato, espressa in pixel.',
        'gutter desktop': 'Spazio laterale interno su desktop. Serve a evitare che il contenuto tocchi i bordi dello schermo.',
        'gutter tablet': 'Spazio laterale interno su tablet.',
        'gutter mobile': 'Spazio laterale interno su smartphone.',
        'spazio superiore': 'Distanza tra l’inizio della pagina o sezione e il contenuto.',
        'spazio inferiore': 'Distanza finale prima della sezione successiva o del footer.',
        'offset header fisso': 'Compensa l’altezza di un header fisso evitando sovrapposizioni con il contenuto.',
        'altezza minima': 'Definisce se la sezione deve adattarsi al contenuto o occupare almeno tutta l’altezza dello schermo.',
        'attacca al top': 'Rimuove lo spazio superiore e avvicina il contenuto al bordo alto o all’header.',
        'nascondi footer meta': 'Nasconde informazioni automatiche o meta dati nel footer della pagina.',
        'tipo sfondo': 'Sceglie tra nessuno sfondo, colore pieno o gradiente.',
        'colore': 'Colore principale dello sfondo o dell’elemento selezionato.',
        'gradiente da': 'Colore iniziale del gradiente.',
        'gradiente a': 'Colore finale del gradiente.',
        'angolo gradiente': 'Direzione del gradiente espressa in gradi.',
        'mobile layout': 'Decide se su mobile gli elementi devono restare affiancati o impilarsi verticalmente.',

        // Stile / controlli comuni
        'tipo': 'Tipo di componente o elemento selezionato.',
        'colonne': 'Numero di colonne occupate dal blocco nella griglia. Il riferimento standard è 12 colonne.',
        'testo': 'Contenuto testuale modificabile.',
        'immagine': 'Elemento immagine o sorgente media associata al componente.',
        'video': 'URL o sorgente del video da incorporare nella pagina.',
        'link': 'Collegamento associato a testo, bottone, immagine o elemento selezionato.',
        'url': 'Indirizzo di destinazione del collegamento o della risorsa.',
        'alt': 'Testo alternativo dell’immagine. Importante per accessibilità e SEO.',
        'caption': 'Didascalia o testo descrittivo visualizzato vicino al media.',
        'allineamento': 'Posizione del contenuto: sinistra, centro, destra o giustificato.',
        'display': 'Modalità di visualizzazione CSS dell’elemento, ad esempio block, flex o grid.',
        'z-index': 'Ordine di sovrapposizione. Valori più alti portano l’elemento sopra gli altri.',
        'classe css': 'Classe CSS personalizzata per applicare stili specifici o integrazioni avanzate.',
        'id css': 'Identificatore univoco dell’elemento, utile per ancore, script o stili mirati.',
        'margin': 'Spazio esterno dell’elemento rispetto agli altri elementi.',
        'margine': 'Spazio esterno dell’elemento rispetto agli altri elementi.',
        'padding': 'Spazio interno tra bordo dell’elemento e contenuto.',
        'top': 'Valore superiore: può riferirsi a margine, padding o posizione.',
        'right': 'Valore destro: può riferirsi a margine, padding o posizione.',
        'bottom': 'Valore inferiore: può riferirsi a margine, padding o posizione.',
        'left': 'Valore sinistro: può riferirsi a margine, padding o posizione.',
        'font': 'Famiglia del carattere usata dal testo selezionato.',
        'font size': 'Dimensione del testo.',
        'dimensione': 'Dimensione del testo o dell’elemento selezionato.',
        'peso': 'Spessore del testo, ad esempio normale, medio o grassetto.',
        'line height': 'Interlinea del testo. Migliora leggibilità e respiro visivo.',
        'letter spacing': 'Spaziatura tra le lettere.',
        'colore testo': 'Colore applicato al testo selezionato.',
        'colore sfondo': 'Colore di sfondo dell’elemento o sezione selezionata.',
        'immagine sfondo': 'Immagine usata come sfondo dell’elemento o della sezione.',
        'background size': 'Definisce come l’immagine di sfondo riempie l’area: cover, contain o valori personalizzati.',
        'background position': 'Posizionamento dell’immagine di sfondo.',
        'border radius': 'Arrotondamento degli angoli dell’elemento.',
        'raggio': 'Arrotondamento degli angoli dell’elemento.',
        'bordo colore': 'Colore del bordo.',
        'bordo spessore': 'Spessore del bordo.',
        'ombra': 'Ombra applicata all’elemento per dare profondità.',
        'animazione': 'Effetto applicato all’elemento, ad esempio fade, slide, zoom o flip.',
        'durata': 'Tempo dell’animazione o transizione, espresso normalmente in millisecondi.',
        'ritardo': 'Tempo di attesa prima dell’avvio dell’animazione.',
        'opacità': 'Trasparenza dell’elemento. 100% è completamente visibile, 0% è invisibile.',
        'transform': 'Trasformazioni CSS come scala, rotazione e traslazione.',
        'hover': 'Stile o comportamento applicato quando il mouse passa sopra l’elemento.',

        // Azioni
        'applica': 'Applica le modifiche al canvas senza necessariamente salvare definitivamente la pagina.',
        'salva': 'Salva le impostazioni correnti della pagina.',
        'media': 'Apre la libreria media per scegliere o caricare immagini e file.',
        'applica layout': 'Applica le impostazioni di layout al canvas corrente.'
    }));

    function normalize(text) {
        return String(text || '')
            .replace(/\s+/g, ' ')
            .replace(/[?:*]/g, '')
            .trim()
            .toLowerCase();
    }

    function directLabelText(label) {
        const clone = label.cloneNode(true);
        clone.querySelectorAll('input, select, textarea, button, small, .r4v4-help, .r4v4-field-help-text').forEach((node) => node.remove());
        return normalize(clone.textContent);
    }

    function findHelp(text) {
        const key = normalize(text);
        if (!key) return '';
        if (HELP_MAP.has(key)) return HELP_MAP.get(key);
        for (const [candidate, help] of HELP_MAP.entries()) {
            if (key === candidate || key.includes(candidate)) return help;
        }
        return '';
    }

    function createButton(helpText, labelText) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'r4v4-help';
        button.dataset.r4Help = helpText;
        button.setAttribute('aria-label', `Informazioni: ${labelText}`);
        button.textContent = '?';
        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            document.querySelectorAll('.r4v4-help.is-open').forEach((el) => {
                if (el !== button) el.classList.remove('is-open');
            });
            button.classList.toggle('is-open');
        });
        return button;
    }

    function injectIntoLabel(label) {
        if (!label || label.dataset.r4HelpReady === '1') return;

        const text = directLabelText(label) || normalize(label.querySelector('span')?.textContent);
        const help = findHelp(text);
        if (!help) return;

        const firstSpan = label.querySelector(':scope > span');
        if (firstSpan && !firstSpan.querySelector('.r4v4-help')) {
            firstSpan.classList.add('r4v4-field-label');
            firstSpan.appendChild(createButton(help, text));
        } else {
            const wrapper = document.createElement('span');
            wrapper.className = 'r4v4-field-label';
            wrapper.appendChild(document.createTextNode(label.childNodes[0]?.nodeType === Node.TEXT_NODE ? label.childNodes[0].textContent.trim() : text));
            wrapper.appendChild(createButton(help, text));

            while (label.firstChild && label.firstChild.nodeType === Node.TEXT_NODE) {
                label.removeChild(label.firstChild);
            }
            label.insertBefore(wrapper, label.firstChild);
        }

        label.dataset.r4HelpReady = '1';
    }

    function injectIntoButton(button) {
        if (!button || button.dataset.r4HelpReady === '1') return;
        const text = normalize(button.textContent);
        const help = findHelp(text);
        if (!help) return;
        button.classList.add('r4v4-has-help');
        button.dataset.r4Help = help;
        button.setAttribute('title', help);
        button.dataset.r4HelpReady = '1';
    }

    function injectHelp(root) {
        const scope = root || document;
        scope.querySelectorAll('.r4v4-sidebar-left label').forEach(injectIntoLabel);
        scope.querySelectorAll('.r4v4-sidebar-left .r4v4-page-action, .r4v4-left-tabs button').forEach(injectIntoButton);
    }

    function boot() {
        const sidebar = document.querySelector('.r4v4-sidebar-left');
        if (!sidebar) return;

        injectHelp(sidebar);

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) injectHelp(node);
                });
            }
        });

        observer.observe(sidebar, { childList: true, subtree: true });

        document.addEventListener('click', function (event) {
            if (!event.target.closest('.r4v4-help')) {
                document.querySelectorAll('.r4v4-help.is-open').forEach((el) => el.classList.remove('is-open'));
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();

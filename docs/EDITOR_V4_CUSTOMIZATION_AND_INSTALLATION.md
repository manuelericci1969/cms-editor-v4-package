# Editor V4 centralizzato - Guida interventi, integrazione CMS e installazione

Questo documento descrive dove intervenire per modificare Editor V4, come il package `r4software/cms-editor-v4-package` interagisce con i CMS Laravel R4Software e come installarlo su altre piattaforme.

Package:

```text
r4software/cms-editor-v4-package
```

Repository:

```text
git@github.com:manuelericci1969/cms-editor-v4-package.git
```

Percorso locale di sviluppo principale:

```bash
/Users/manuelericci/Sites/cms-editor-v4-package
```

CMS locale di test principale:

```bash
/Users/manuelericci/Sites/cms_r4software
```

Branch CMS di test consigliato:

```bash
feature/install-cms-editor-v4-package
```

---

## 1. Architettura generale

Editor V4 è stato estratto dal CMS principale e centralizzato in un package Laravel privato.

Il package contiene:

- controller Laravel dell'editor;
- rotte Editor V4;
- view Blade dell'editor;
- asset JS/CSS dell'interfaccia;
- menu modulare sinistro;
- gestione blocchi, widget, elementi, layout, spaziature, sfondi, bordi, effetti, impostazioni pagina;
- asset pubblicabili in `public/vendor/cms-editor-v4`.

Il CMS host continua a fornire:

- modello `App\Models\Page`;
- rotte admin base;
- autenticazione admin;
- database pagine;
- media library;
- rendering pubblico della pagina;
- layout frontend e runtime pubblico.

---

## 2. File principali del package

### View editor

```text
resources/views/edit.blade.php
```

Qui si modifica la struttura HTML principale dell'editor:

- topbar;
- pulsanti principali;
- sidebar sinistra;
- canvas centrale;
- sidebar destra;
- modale media;
- inclusione dei menu Blade;
- caricamento CSS/JS;
- versione mostrata nella topbar.

Quando si aggiorna la versione visibile, cercare:

```text
Editor V4 · vX.Y.Z
```

### Controller

```text
src/Http/Controllers/PageVisualEditorV4Controller.php
```

Gestisce:

- apertura editor;
- salvataggio pagina;
- preview admin;
- validazione dati;
- persistenza `visual_html`, `visual_css`, `visual_json`, `meta`, `status`.

Qui intervenire per modifiche lato backend, salvataggio, normalizzazione dati, compatibilità con il modello `Page`.

### Rotte

```text
routes/editor-v4.php
```

Definisce le rotte pubblicate dal package.

Rotte tipiche:

```text
GET   /admin/pages/{page}/edit-v4
PATCH /admin/pages/{page}/update-v4
GET   /admin/pages/{page}/preview-v4
```

Il prefisso è configurabile dal CMS tramite:

```text
config/editor-v4.php
```

Chiave:

```php
'route_prefix' => 'admin/pages'
```

---

## 3. Asset principali

Tutti gli asset sorgenti stanno in:

```text
resources/assets/visual-editor-v4
```

Quando il package viene installato o aggiornato nel CMS, vengono pubblicati in:

```text
public/vendor/cms-editor-v4
```

### File JS principali

```text
resources/assets/visual-editor-v4/app.js
```

Inizializzazione principale GrapesJS.

Qui intervenire per:

- configurazione GrapesJS;
- caricamento progetto da `visual_json`;
- caricamento fallback da `visual_html` e `visual_css`;
- registrazione blocchi;
- comandi topbar;
- sincronizzazione campi hidden;
- gestione device desktop/tablet/mobile;
- salvataggio.

Attenzione: non eseguire `editor.getHtml()`, `editor.getCss()` o `editor.getProjectData()` in modo aggressivo durante l'editing testuale/RTE. Può disturbare il caret.

```text
resources/assets/visual-editor-v4/animations-v4-core.js
```

Gestione animazioni.

Qui è stato risolto il problema della scrittura al contrario: il file non deve sincronizzare i campi mentre GrapesJS è in modalità editing testo/RTE.

Regola fondamentale:

```text
Durante RTE/editing testo: non chiamare syncFields() automaticamente.
```

La sincronizzazione deve avvenire:

- al submit;
- alla chiusura RTE;
- quando si applicano effettivamente animazioni;
- con debounce non invasivo.

```text
resources/assets/visual-editor-v4/editor-runtime-bridge.js
```

Bridge tra editor e runtime visuale.

Serve per mostrare una preview coerente dentro il canvas. Non deve caricare il runtime pubblico JS in modo aggressivo durante editing.

Attenzione: il runtime pubblico è pensato per la pagina frontend, non per la modifica GrapesJS.

```text
resources/assets/visual-editor-v4/menu/boot.js
```

Boot del menu modulare sinistro.

```text
resources/assets/visual-editor-v4/menu/*.js
```

Moduli JS del menu:

- `page-settings.js` impostazioni pagina;
- `layout.js` layout pagina/elemento;
- `widgets.js` widget preconfigurati;
- `elements.js` elementi base;
- `spacing.js` margini/padding;
- `typography.js` testo/font;
- `background.js` sfondi;
- `border.js` bordi/ombre;
- `effects.js` effetti/animazioni;
- `advanced.js` classi, attributi, avanzate.

---

## 4. File CSS principali

```text
resources/assets/visual-editor-v4/editor.css
```

Stile generale dell'editor.

```text
resources/assets/visual-editor-v4/sidebar-compact.css
```

Layout sidebar e compattezza del pannello.

```text
resources/assets/visual-editor-v4/topbar-compact.css
```

Topbar, bottoni e layout superiore.

```text
resources/assets/visual-editor-v4/style-manager-fixes.css
```

Fix mirati al pannello stile di GrapesJS.

```text
resources/assets/visual-editor-v4/menu/core.css
```

Stile centrale del menu modulare sinistro.

Qui intervenire per:

- larghezza menu;
- tab Pagina/Layout/Widget/Elementi/Testo ecc.;
- card componenti;
- colori dark theme;
- bordi;
- spaziature laterali;
- header `IMMAGINI`, `EDITOR`, sezioni e accordion.

Variabili importanti:

```css
--r4v4-left-menu-width: 390px;
--r4v4-left-menu-gutter: 8px;
```

---

## 5. Modifiche grafiche frequenti

### Cambiare larghezza menu sinistro

File:

```text
resources/assets/visual-editor-v4/menu/core.css
```

Variabile:

```css
--r4v4-left-menu-width: 390px;
```

### Cambiare spazio interno destro/sinistro menu

File:

```text
resources/assets/visual-editor-v4/menu/core.css
```

Variabile:

```css
--r4v4-left-menu-gutter: 8px;
```

### Cambiare colore delle card componenti

File:

```text
resources/assets/visual-editor-v4/menu/core.css
```

Sezione:

```css
/* Dark theme cards for blocks/widgets/elements in the left menu. */
```

### Cambiare colore header pannelli IMMAGINI / EDITOR

File:

```text
resources/assets/visual-editor-v4/menu/core.css
```

Sezione:

```css
/* Uniforma i pannelli laterali al tema dark */
```

### Cambiare topbar

File:

```text
resources/assets/visual-editor-v4/topbar-compact.css
```

e view:

```text
resources/views/edit.blade.php
```

---

## 6. Modifiche funzionali frequenti

### Aggiungere un nuovo componente/blocco

File principale:

```text
resources/assets/visual-editor-v4/app.js
```

Cercare:

```js
registerBlocks(editor)
```

oppure la funzione di aggiunta blocchi.

Se il blocco appartiene al menu modulare, verificare anche:

```text
resources/assets/visual-editor-v4/menu/widgets.js
resources/assets/visual-editor-v4/menu/elements.js
```

### Aggiungere una nuova sezione nel menu sinistro

File Blade:

```text
resources/views/menu/<nome>/html.blade.php
```

File JS:

```text
resources/assets/visual-editor-v4/menu/<nome>.js
```

Registrazione:

```text
resources/assets/visual-editor-v4/menu/registry.js
resources/assets/visual-editor-v4/menu/boot.js
```

### Modificare salvataggio pagina

File:

```text
src/Http/Controllers/PageVisualEditorV4Controller.php
```

Campi principali:

```text
visual_html
visual_css
visual_json
editor_mode
status
meta
```

### Modificare preview admin

File:

```text
src/Http/Controllers/PageVisualEditorV4Controller.php
```

Metodo:

```text
preview
```

---

## 7. Interazione con il CMS host

Il CMS deve avere:

- modello `App\Models\Page` compatibile;
- campi database:
  - `visual_html`;
  - `visual_css`;
  - `visual_json`;
  - `editor_mode`;
  - `meta`;
  - `status`;
  - `title`;
  - `slug`;
  - `excerpt`;
  - `published_at`;
  - `is_homepage`;
- rotte admin protette da autenticazione;
- media picker compatibile;
- rotta frontend `page.show` se si vuole usare il bottone `Apri pubblica`.

Configurazione CMS:

```text
config/editor-v4.php
```

Esempio:

```php
return [
    'route_prefix' => 'admin/pages',
    'middleware' => ['web', 'auth'],
    'assets_path' => 'vendor/cms-editor-v4',
];
```

---

## 8. Installazione su un altro CMS Laravel

Esempi target:

```text
cms_crewcorepro
cms_memoriamica
cms_garcone
```

### 8.1 Prerequisiti

- Laravel 11 o 12;
- PHP 8.2+;
- accesso GitHub alla repo privata;
- SSH GitHub configurato o token Composer configurato;
- modello `Page` compatibile;
- campi database necessari.

### 8.2 Configurare repository Composer

Nel `composer.json` del CMS host aggiungere:

```json
"repositories": [
    {
        "type": "vcs",
        "url": "git@github.com:manuelericci1969/cms-editor-v4-package.git"
    }
]
```

### 8.3 Richiedere il package

Durante sviluppo:

```bash
composer require r4software/cms-editor-v4-package:@dev --ignore-platform-req=ext-imagick
```

Quando useremo tag stabili:

```bash
composer require r4software/cms-editor-v4-package:0.1.8 --ignore-platform-req=ext-imagick
```

### 8.4 Pubblicare configurazione e asset

```bash
php artisan vendor:publish --tag=cms-editor-v4-config --force
php artisan vendor:publish --tag=cms-editor-v4-assets --force
php artisan optimize:clear
```

Verificare:

```bash
php artisan route:list | grep "edit-v4\|update-v4\|preview-v4"
```

Output atteso:

```text
GET|HEAD admin/pages/{page}/edit-v4
PATCH    admin/pages/{page}/update-v4
GET|HEAD admin/pages/{page}/preview-v4
```

### 8.5 Configurare route prefix

Nel CMS host:

```text
config/editor-v4.php
```

Impostare:

```php
'route_prefix' => 'admin/pages',
```

### 8.6 Disattivare vecchie rotte V4 locali

Nel CMS host, se esistono vecchie rotte V4 in:

```text
routes/web.php
```

commentarle o rimuoverle per evitare duplicazioni nomi route.

Le route devono arrivare dal package:

```text
R4Software\CmsEditorV4\Http\Controllers\PageVisualEditorV4Controller
```

Non dal vecchio controller locale:

```text
Admin\PageVisualEditorV4Controller
```

Verifica:

```bash
php artisan route:list | grep "edit-v4\|update-v4\|preview-v4"
```

---

## 9. Aggiornamento package nel CMS

Dopo una modifica al package:

```bash
cd /Users/manuelericci/Sites/cms_r4software

composer update r4software/cms-editor-v4-package --ignore-platform-req=ext-imagick

php artisan vendor:publish --tag=cms-editor-v4-assets --force

php artisan optimize:clear
```

Verifica commit/versione installata:

```bash
composer show r4software/cms-editor-v4-package | grep -E "versions|source|dist|path"
```

Verifica asset pubblicati:

```bash
grep -n "Editor V4" vendor/r4software/cms-editor-v4-package/resources/views/edit.blade.php
ls -la public/vendor/cms-editor-v4
```

---

## 10. Versionamento

Ogni modifica stabile deve aggiornare:

```text
composer.json
VERSION
resources/views/edit.blade.php, se la versione è mostrata in topbar
```

Esempio:

```json
"version": "0.1.8"
```

File:

```text
VERSION
```

Contenuto:

```text
0.1.8
```

Nota: il `composer.json` del CMS mostra il vincolo richiesto, non sempre la versione installata. Se nel CMS è presente:

```json
"r4software/cms-editor-v4-package": "@dev"
```

Composer installerà l'ultimo commit disponibile su `main`. Per bloccare una versione serve usare tag Git e poi cambiare il vincolo del CMS.

---

## 11. Tag Git per release stabile

Nel package:

```bash
cd /Users/manuelericci/Sites/cms-editor-v4-package

git pull origin main

git tag -a v0.1.8 -m "Editor V4 package v0.1.8"

git push origin v0.1.8
```

Nel CMS:

```json
"r4software/cms-editor-v4-package": "0.1.8"
```

Poi:

```bash
composer update r4software/cms-editor-v4-package --ignore-platform-req=ext-imagick
```

---

## 12. Test obbligatori prima della produzione

Dopo ogni aggiornamento:

1. aprire editor:

```text
/admin/pages/44/edit-v4
```

2. refresh forzato browser:

```text
CMD + SHIFT + R
```

3. testare editing testo:

```text
ciao come stai
```

Risultato corretto:

```text
ciao come stai
```

Risultato errato già risolto in precedenza:

```text
iats emoc oaic
```

4. testare:

- selezione testo;
- backspace;
- scrittura a metà frase;
- salvataggio bozza;
- pubblicazione;
- reload editor;
- preview admin;
- pagina pubblica.

5. testare menu sinistro:

- Pagina;
- Layout;
- Widget;
- Elementi;
- Spaziatura;
- Testo;
- Sfondo;
- Bordi;
- Effetti;
- Avanzate.

6. testare media:

- apertura media picker;
- inserimento immagine;
- gallery;
- slider;
- caroselli.

---

## 13. Rollback locale rapido

Nel CMS:

```bash
cd /Users/manuelericci/Sites/cms_r4software

git status --short

git checkout -- composer.json composer.lock public/vendor/cms-editor-v4

composer install --ignore-platform-req=ext-imagick

php artisan optimize:clear
```

Oppure tornare al branch main del CMS:

```bash
git checkout main
composer install --ignore-platform-req=ext-imagick
php artisan optimize:clear
```

---

## 14. Regola produzione

Non deployare in produzione finché:

- il CMS locale non supera tutti i test;
- il branch CMS non è pulito;
- il package ha versione aggiornata;
- se necessario, il package ha tag Git stabile;
- esiste rollback chiaro;
- si è verificato che il server produzione possa accedere alla repo privata GitHub o abbia token Composer valido.

---

## 15. Procedura consigliata per una nuova modifica

1. modificare package:

```bash
cd /Users/manuelericci/Sites/cms-editor-v4-package
```

2. commit e push package:

```bash
git status --short
git add .
git commit -m "Descrizione modifica Editor V4"
git push origin main
```

3. aggiornare CMS locale:

```bash
cd /Users/manuelericci/Sites/cms_r4software
composer update r4software/cms-editor-v4-package --ignore-platform-req=ext-imagick
php artisan vendor:publish --tag=cms-editor-v4-assets --force
php artisan optimize:clear
```

4. test browser.

5. se ok, commit CMS:

```bash
git status --short
git add composer.json composer.lock public/vendor/cms-editor-v4 docs
 git commit -m "Update Editor V4 package"
```

6. push branch CMS:

```bash
git push origin feature/install-cms-editor-v4-package
```

7. solo dopo, valutare merge/deploy.

---

## 16. Note tecniche importanti

- Non caricare runtime pubblico JS dentro il canvas editor se non strettamente necessario.
- Non chiamare `syncFields()` durante editing testo/RTE.
- Non forzare `contenteditable` manualmente se GrapesJS gestisce già RTE.
- Non usare script globali del CMS per manipolare elementi dentro l'iframe GrapesJS.
- Ogni modifica CSS al menu dovrebbe stare preferibilmente in `menu/core.css` o nei CSS specifici del modulo.
- Ogni modifica di salvataggio deve stare nel controller del package.
- Ogni modifica di rendering pubblico resta nel CMS host, non nel package editor.

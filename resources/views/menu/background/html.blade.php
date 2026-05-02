<template id="r4v4-menu-template-background">
    <div class="r4v4-page-card r4v4-menu-background">
        <div class="r4v4-page-card-title">Sfondo</div>
        <div class="r4v4-custom-help">Gestisci colore, immagine, media gallery e slider background dell'elemento selezionato.</div>

        <div class="r4v4-form-list">
            <label><span>Tipo sfondo</span>
                <select data-r4-bg-mode>
                    <option value="image">Immagine / Colore</option>
                    <option value="gradient">Gradiente</option>
                    <option value="slider">Slider immagini</option>
                </select>
            </label>
            <label><span>Colore sfondo</span><input type="color" data-r4-style-prop="background-color"></label>
            <label><span>Immagine URL</span><input type="text" data-r4-background-image placeholder="https://... oppure /storage/..."></label>
        </div>

        <div class="r4v4-control-actions r4v4-control-actions-grid">
            <button type="button" data-r4-bg-open-media>Apri Media</button>
            <button type="button" data-r4-bg-use-selected-media>Usa media selezionato</button>
        </div>

        <div class="r4v4-form-list">
            <label><span>Dimensione immagine</span>
                <select data-r4-style-prop="background-size">
                    <option value="">Predefinito</option>
                    <option value="cover">Cover</option>
                    <option value="contain">Contain</option>
                    <option value="auto">Auto</option>
                </select>
            </label>
            <label><span>Posizione</span>
                <select data-r4-style-prop="background-position">
                    <option value="">Predefinito</option>
                    <option value="center center">Centro</option>
                    <option value="top center">Alto centro</option>
                    <option value="bottom center">Basso centro</option>
                    <option value="center left">Centro sinistra</option>
                    <option value="center right">Centro destra</option>
                </select>
            </label>
            <label><span>Ripetizione</span>
                <select data-r4-style-prop="background-repeat">
                    <option value="">Predefinito</option>
                    <option value="no-repeat">Non ripetere</option>
                    <option value="repeat">Ripeti</option>
                    <option value="repeat-x">Ripeti X</option>
                    <option value="repeat-y">Ripeti Y</option>
                </select>
            </label>
        </div>
    </div>

    <div class="r4v4-page-card r4v4-menu-background">
        <div class="r4v4-page-card-title">Overlay</div>
        <div class="r4v4-custom-help">Aggiunge un livello sopra lo sfondo e sotto il contenuto.</div>
        <div class="r4v4-form-list">
            <label><span>Colore overlay</span><input type="color" data-r4-bg-overlay-color></label>
            <label><span>Opacita overlay</span><input type="range" min="0" max="1" step="0.05" data-r4-bg-overlay-opacity></label>
        </div>
        <div class="r4v4-control-actions">
            <button type="button" data-r4-bg-overlay-apply>Applica overlay</button>
            <button type="button" data-r4-bg-overlay-remove>Rimuovi overlay</button>
        </div>
    </div>

    <div class="r4v4-page-card r4v4-menu-background">
        <div class="r4v4-page-card-title">Gradiente rapido</div>
        <div class="r4v4-form-list">
            <label><span>Da</span><input type="color" data-r4-gradient="from"></label>
            <label><span>A</span><input type="color" data-r4-gradient="to"></label>
            <label><span>Direzione</span>
                <select data-r4-gradient="direction">
                    <option value="135deg">Diagonale</option>
                    <option value="90deg">Orizzontale</option>
                    <option value="180deg">Verticale</option>
                </select>
            </label>
        </div>
        <div class="r4v4-control-actions">
            <button type="button" data-r4-gradient-apply>Applica gradiente</button>
            <button type="button" data-r4-background-reset>Reset sfondo</button>
        </div>
    </div>

    <div class="r4v4-page-card r4v4-menu-background">
        <div class="r4v4-page-card-title">Slider background</div>
        <div class="r4v4-custom-help">Seleziona più immagini dalla Media Gallery oppure inserisci un URL immagine per riga. Verranno usate come sfondo del contenitore selezionato.</div>
        <div class="r4v4-form-list">
            <label><span>URL immagini</span><textarea rows="5" data-r4-bg-slider-images placeholder="/storage/media/slide-1.jpg&#10;/storage/media/slide-2.jpg"></textarea></label>
            <label><span>Durata slide ms</span><input type="number" data-r4-bg-slider-duration value="5000" min="1000" step="500"></label>
            <label><span>Effetto slider</span>
                <select data-r4-bg-slider-effect>
                    <option value="fade">Fade</option>
                    <option value="zoom">Zoom soft</option>
                    <option value="slide">Slide orizzontale</option>
                    <option value="kenburns">Ken Burns</option>
                </select>
            </label>
            <label><span>Velocita effetto ms</span><input type="number" data-r4-bg-slider-effect-duration value="800" min="150" step="50"></label>
        </div>
        <div class="r4v4-control-actions r4v4-control-actions-grid">
            <button type="button" data-r4-bg-slider-open-media>Seleziona da Media</button>
            <button type="button" data-r4-bg-slider-apply>Applica slider</button>
            <button type="button" data-r4-bg-slider-remove>Rimuovi slider</button>
        </div>
    </div>
</template>

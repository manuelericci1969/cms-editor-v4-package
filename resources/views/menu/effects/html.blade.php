<template id="r4v4-menu-template-effects">
    <div class="r4v4-page-card r4v4-menu-effects">
        <div class="r4v4-page-card-title">Animazioni ingresso / uscita</div>
        <div class="r4v4-custom-help">Seleziona un elemento nel canvas e scegli l'animazione da applicare quando entra nella pagina pubblica.</div>

        <div class="r4v4-form-list">
            <label>
                <span>Tipo animazione</span>
                <select data-r4-animation-field="type">
                    <option value="">Nessuna animazione</option>
                    <option value="fade-in">Fade in</option>
                    <option value="fade-out">Fade out</option>
                    <option value="fade-up">Fade up</option>
                    <option value="fade-down">Fade down</option>
                    <option value="fade-left">Fade left</option>
                    <option value="fade-right">Fade right</option>
                    <option value="slide-up">Slide up</option>
                    <option value="slide-down">Slide down</option>
                    <option value="slide-left">Slide left</option>
                    <option value="slide-right">Slide right</option>
                    <option value="swipe-up">Swipe up</option>
                    <option value="swipe-down">Swipe down</option>
                    <option value="swipe-left">Swipe left</option>
                    <option value="swipe-right">Swipe right</option>
                    <option value="zoom-in">Zoom in</option>
                    <option value="zoom-out">Zoom out</option>
                    <option value="flip-up">Flip up</option>
                </select>
            </label>
            <label><span>Durata ms</span><input type="number" min="100" max="5000" step="100" value="700" data-r4-animation-field="duration"></label>
            <label><span>Delay ms</span><input type="number" min="0" max="5000" step="100" value="0" data-r4-animation-field="delay"></label>
            <label><span>Distanza px</span><input type="number" min="0" max="300" step="5" value="40" data-r4-animation-field="distance"></label>
        </div>

        <div class="r4v4-control-actions r4v4-control-actions-grid">
            <button type="button" data-r4-animation-apply>Applica animazione</button>
            <button type="button" data-r4-animation-preview>Preview</button>
            <button type="button" data-r4-animation-clear>Rimuovi animazione</button>
        </div>
    </div>

    <div class="r4v4-page-card r4v4-menu-effects">
        <div class="r4v4-page-card-title">Effetti CSS</div>
        <div class="r4v4-custom-help">Gestisci opacita e trasformazioni manuali dell'elemento selezionato.</div>

        <div class="r4v4-form-list">
            <label><span>Opacita</span><input type="range" min="0" max="1" step="0.05" data-r4-style-prop="opacity"></label>
            <label><span>Transform</span><input type="text" data-r4-style-prop="transform" placeholder="translateY(-10px) scale(1.02)"></label>
            <label><span>Transition</span><input type="text" data-r4-style-prop="transition" placeholder="all .25s ease"></label>
            <label><span>Filtro</span><input type="text" data-r4-style-prop="filter" placeholder="blur(2px), grayscale(1)"></label>
        </div>
    </div>

    <div class="r4v4-page-card r4v4-menu-effects">
        <div class="r4v4-page-card-title">Preset rapidi</div>
        <div class="r4v4-control-actions r4v4-control-actions-grid">
            <button type="button" data-r4-effect-preset="fade">Fade</button>
            <button type="button" data-r4-effect-preset="lift">Lift</button>
            <button type="button" data-r4-effect-preset="zoom">Zoom</button>
            <button type="button" data-r4-effects-reset>Reset effetti CSS</button>
        </div>
    </div>
</template>

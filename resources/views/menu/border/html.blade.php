<template id="r4v4-menu-template-border">
    <div class="r4v4-page-card r4v4-menu-border">
        <div class="r4v4-page-card-title">Bordi</div>
        <div class="r4v4-custom-help">Gestisci bordo, arrotondamento e ombra dell'elemento selezionato.</div>

        <div class="r4v4-form-list">
            <label><span>Spessore bordo</span><input type="text" data-r4-style-prop="border-width" placeholder="1px"></label>
            <label><span>Stile bordo</span>
                <select data-r4-style-prop="border-style">
                    <option value="">Nessuno</option>
                    <option value="solid">Solido</option>
                    <option value="dashed">Tratteggiato</option>
                    <option value="dotted">Punteggiato</option>
                    <option value="double">Doppio</option>
                </select>
            </label>
            <label><span>Colore bordo</span><input type="color" data-r4-style-prop="border-color"></label>
            <label><span>Radius globale</span><input type="text" data-r4-style-prop="border-radius" placeholder="12px"></label>
        </div>
    </div>

    <div class="r4v4-page-card r4v4-menu-border">
        <div class="r4v4-page-card-title">Radius singoli</div>
        <div class="r4v4-custom-help">Puoi arrotondare ogni angolo in modo indipendente.</div>

        <div class="r4v4-spacing-grid r4v4-radius-grid">
            <label><span>Alto sinistra</span><input type="text" data-r4-style-prop="border-top-left-radius" placeholder="12px"></label>
            <label><span>Alto destra</span><input type="text" data-r4-style-prop="border-top-right-radius" placeholder="12px"></label>
            <label><span>Basso destra</span><input type="text" data-r4-style-prop="border-bottom-right-radius" placeholder="12px"></label>
            <label><span>Basso sinistra</span><input type="text" data-r4-style-prop="border-bottom-left-radius" placeholder="12px"></label>
        </div>

        <div class="r4v4-control-actions r4v4-control-actions-grid">
            <button type="button" data-r4-radius-preset="0px">Squadrato</button>
            <button type="button" data-r4-radius-preset="8px">Leggero</button>
            <button type="button" data-r4-radius-preset="18px">Morbido</button>
            <button type="button" data-r4-radius-preset="999px">Pill</button>
        </div>
    </div>

    <div class="r4v4-page-card r4v4-menu-border">
        <div class="r4v4-page-card-title">Ombra</div>
        <div class="r4v4-form-list">
            <label><span>Box shadow</span><input type="text" data-r4-style-prop="box-shadow" placeholder="0 10px 25px rgba(0,0,0,.15)"></label>
        </div>
        <div class="r4v4-control-actions r4v4-control-actions-grid">
            <button type="button" data-r4-shadow-preset="soft">Soft</button>
            <button type="button" data-r4-shadow-preset="medium">Medium</button>
            <button type="button" data-r4-shadow-preset="strong">Strong</button>
            <button type="button" data-r4-border-reset>Reset</button>
        </div>
    </div>
</template>

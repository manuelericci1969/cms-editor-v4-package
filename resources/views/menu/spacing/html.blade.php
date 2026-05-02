<template id="r4v4-menu-template-spacing">
    <div class="r4v4-page-card r4v4-menu-spacing">
        <div class="r4v4-page-card-title">Margine</div>
        <div class="r4v4-custom-help">Gestisci lo spazio esterno dell'elemento selezionato.</div>

        <div class="r4v4-unit-row">
            <span>Unita</span>
            <select data-r4-spacing-unit="margin">
                <option value="px">px</option>
                <option value="%">%</option>
                <option value="rem">rem</option>
                <option value="em">em</option>
            </select>
        </div>

        <div class="r4v4-spacing-grid">
            <label><span>Sopra</span><input type="number" data-r4-spacing="margin-top" inputmode="decimal"></label>
            <label><span>Destra</span><input type="number" data-r4-spacing="margin-right" inputmode="decimal"></label>
            <label><span>Sotto</span><input type="number" data-r4-spacing="margin-bottom" inputmode="decimal"></label>
            <label><span>Sinistra</span><input type="number" data-r4-spacing="margin-left" inputmode="decimal"></label>
        </div>

        <div class="r4v4-control-actions">
            <button type="button" data-r4-spacing-reset="margin">Reset margine</button>
        </div>
    </div>

    <div class="r4v4-page-card r4v4-menu-spacing">
        <div class="r4v4-page-card-title">Padding</div>
        <div class="r4v4-custom-help">Gestisci lo spazio interno dell'elemento selezionato.</div>

        <div class="r4v4-unit-row">
            <span>Unita</span>
            <select data-r4-spacing-unit="padding">
                <option value="px">px</option>
                <option value="%">%</option>
                <option value="rem">rem</option>
                <option value="em">em</option>
            </select>
        </div>

        <div class="r4v4-spacing-grid">
            <label><span>Sopra</span><input type="number" data-r4-spacing="padding-top" inputmode="decimal"></label>
            <label><span>Destra</span><input type="number" data-r4-spacing="padding-right" inputmode="decimal"></label>
            <label><span>Sotto</span><input type="number" data-r4-spacing="padding-bottom" inputmode="decimal"></label>
            <label><span>Sinistra</span><input type="number" data-r4-spacing="padding-left" inputmode="decimal"></label>
        </div>

        <div class="r4v4-control-actions">
            <button type="button" data-r4-spacing-reset="padding">Reset padding</button>
        </div>
    </div>

    <div class="r4v4-page-card r4v4-menu-spacing">
        <div class="r4v4-page-card-title">Dimensioni</div>
        <div class="r4v4-custom-help">Imposta larghezza, altezza e distanza tra elementi.</div>

        <div class="r4v4-form-list">
            <label><span>Larghezza</span><input type="text" data-r4-style-prop="width" placeholder="auto, 100%, 320px"></label>
            <label><span>Altezza</span><input type="text" data-r4-style-prop="height" placeholder="auto, 420px"></label>
            <label><span>Gap</span><input type="text" data-r4-style-prop="gap" placeholder="16px"></label>
        </div>
    </div>
</template>

<template id="r4v4-menu-template-advanced">
    <div class="r4v4-page-card r4v4-menu-advanced">
        <div class="r4v4-page-card-title">Avanzate</div>
        <div class="r4v4-custom-help">Gestisci identificativi, classi e attributi dell'elemento selezionato.</div>

        <div class="r4v4-form-list">
            <label><span>CSS ID</span><input type="text" data-r4-attr="id" placeholder="sezione-hero"></label>
            <label><span>Classi CSS</span><input type="text" data-r4-classes placeholder="classe-uno classe-due"></label>
            <label><span>Title</span><input type="text" data-r4-attr="title" placeholder="Titolo elemento"></label>
            <label><span>ARIA label</span><input type="text" data-r4-attr="aria-label" placeholder="Etichetta accessibilita"></label>
        </div>
    </div>

    <div class="r4v4-page-card r4v4-menu-advanced">
        <div class="r4v4-page-card-title">Custom CSS inline</div>
        <div class="r4v4-form-list">
            <label><span>CSS veloce</span><textarea rows="5" data-r4-inline-style placeholder="display:flex;\njustify-content:center;"></textarea></label>
        </div>
        <div class="r4v4-control-actions">
            <button type="button" data-r4-advanced-apply-inline>Applica CSS inline</button>
            <button type="button" data-r4-advanced-reset>Reset avanzate</button>
        </div>
    </div>
</template>

<template id="r4v4-menu-template-typography">
    <div class="r4v4-page-card r4v4-menu-typography">
        <div class="r4v4-page-card-title">Testo</div>
        <div class="r4v4-custom-help">Gestisci tipografia e colore dell'elemento selezionato.</div>

        <div class="r4v4-form-list">
            <label><span>Font</span>
                <select data-r4-style-prop="font-family">
                    <option value="">Predefinito</option>
                    <option value="Arial, sans-serif">Arial</option>
                    <option value="Helvetica, Arial, sans-serif">Helvetica</option>
                    <option value="Georgia, serif">Georgia</option>
                    <option value="'Times New Roman', serif">Times New Roman</option>
                    <option value="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif">System UI</option>
                </select>
            </label>

            <label><span>Dimensione</span><input type="text" data-r4-style-prop="font-size" placeholder="16px, 1.2rem"></label>

            <label><span>Peso</span>
                <select data-r4-style-prop="font-weight">
                    <option value="">Predefinito</option>
                    <option value="300">Leggero</option>
                    <option value="400">Normale</option>
                    <option value="500">Medio</option>
                    <option value="600">Semi bold</option>
                    <option value="700">Bold</option>
                    <option value="800">Extra bold</option>
                </select>
            </label>

            <label><span>Line height</span><input type="text" data-r4-style-prop="line-height" placeholder="1.4, 24px"></label>
            <label><span>Spaziatura lettere</span><input type="text" data-r4-style-prop="letter-spacing" placeholder="0px"></label>
        </div>
    </div>

    <div class="r4v4-page-card r4v4-menu-typography">
        <div class="r4v4-page-card-title">Colore e allineamento</div>

        <div class="r4v4-form-list">
            <label><span>Colore testo</span><input type="color" data-r4-style-prop="color"></label>
            <label><span>Colore sfondo</span><input type="color" data-r4-style-prop="background-color"></label>
        </div>

        <div class="r4v4-segmented" data-r4-segmented="text-align">
            <button type="button" data-r4-style-value="left">Sinistra</button>
            <button type="button" data-r4-style-value="center">Centro</button>
            <button type="button" data-r4-style-value="right">Destra</button>
            <button type="button" data-r4-style-value="justify">Giustifica</button>
        </div>
    </div>

    <div class="r4v4-page-card r4v4-menu-typography">
        <div class="r4v4-page-card-title">Stile rapido</div>
        <div class="r4v4-control-actions r4v4-control-actions-grid">
            <button type="button" data-r4-toggle-style="font-weight" data-r4-toggle-on="700" data-r4-toggle-off="400">Grassetto</button>
            <button type="button" data-r4-toggle-style="font-style" data-r4-toggle-on="italic" data-r4-toggle-off="normal">Corsivo</button>
            <button type="button" data-r4-toggle-style="text-decoration" data-r4-toggle-on="underline" data-r4-toggle-off="none">Sottolinea</button>
            <button type="button" data-r4-typography-reset>Reset testo</button>
        </div>
    </div>
</template>

<template id="r4v4-menu-template-page">
    <div class="r4v4-page-card">
        <div class="r4v4-page-card-title">Base</div>
        <label>Titolo pagina<input type="text" id="r4LeftPageTitle" autocomplete="off"></label>
        <label>Slug<input type="text" id="r4LeftPageSlug" autocomplete="off"></label>
        <label>Estratto<textarea id="r4LeftPageExcerpt" rows="3"></textarea></label>
        <label>Data pubblicazione<input type="datetime-local" id="r4LeftPagePublishedAt"></label>
        <label>Stato<select id="r4LeftPageStatus"><option value="draft">Bozza</option><option value="published">Pubblicata</option><option value="archived">Archiviata</option></select></label>
        <label class="r4v4-left-switch"><input type="checkbox" id="r4LeftPageHomepage"> <span>Homepage</span></label>
    </div>

    <div class="r4v4-page-card">
        <div class="r4v4-page-card-title">SEO</div>
        <label>Meta title<input type="text" id="r4LeftMetaTitle" name="meta[title]" maxlength="60" placeholder="Titolo SEO"></label>
        <label>Meta description<textarea id="r4LeftMetaDescription" name="meta[description]" rows="3" maxlength="160" placeholder="Descrizione SEO"></textarea></label>
        <label>Meta keywords<input type="text" id="r4LeftMetaKeywords" name="meta[keywords]" placeholder="keyword, keyword"></label>
    </div>

    <div class="r4v4-page-card">
        <div class="r4v4-page-card-title">Visibilita frontend</div>
        <input type="hidden" name="meta[show_title]" value="0"><label class="r4v4-left-switch"><input type="checkbox" id="r4LeftShowTitle" name="meta[show_title]" value="1"> <span>Mostra titolo</span></label>
        <input type="hidden" name="meta[show_excerpt]" value="0"><label class="r4v4-left-switch"><input type="checkbox" id="r4LeftShowExcerpt" name="meta[show_excerpt]" value="1"> <span>Mostra estratto</span></label>
        <input type="hidden" name="meta[show_pubdate]" value="0"><label class="r4v4-left-switch"><input type="checkbox" id="r4LeftShowPubdate" name="meta[show_pubdate]" value="1"> <span>Mostra data pubblicazione</span></label>
        <input type="hidden" name="meta[show_author]" value="0"><label class="r4v4-left-switch"><input type="checkbox" id="r4LeftShowAuthor" name="meta[show_author]" value="1"> <span>Mostra autore</span></label>
        <input type="hidden" name="meta[show_breadcrumbs]" value="0"><label class="r4v4-left-switch"><input type="checkbox" id="r4LeftShowBreadcrumbs" name="meta[show_breadcrumbs]" value="1"> <span>Mostra breadcrumb</span></label>
    </div>

    <div class="r4v4-page-card">
        <div class="r4v4-left-page-status" data-r4-left-page-status></div>
        <button type="button" class="r4v4-page-action" data-r4-left-page-action="apply">Applica</button>
        <button type="button" class="r4v4-page-action" data-r4-left-page-action="save">Salva</button>
        <button type="button" class="r4v4-page-action r4v4-page-action-muted" data-r4-left-page-action="media">Media</button>
    </div>
</template>

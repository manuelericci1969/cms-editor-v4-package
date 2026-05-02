<?php

namespace R4Software\CmsEditorV4\Http\Controllers;

use Illuminate\Routing\Controller;
use App\Models\Page;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PageVisualEditorV4Controller extends Controller
{
    private const LAYOUT_CSS_START = '/* R4_EDITOR_V4_LAYOUT_START */';
    private const LAYOUT_CSS_END = '/* R4_EDITOR_V4_LAYOUT_END */';

    public function edit(Page $page)
    {
        return view('cms-editor-v4::edit', compact('page'));
    }

    public function preview(Page $page)
    {
        return view('page.show', [
            'page' => $page,
            'preview' => true,
        ]);
    }

    public function update(Request $request, Page $page)
    {
        $data = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string',
            'status' => 'required|in:draft,published,archived',
            'is_homepage' => 'sometimes|boolean',
            'published_at' => 'nullable|date',
            'visual_html' => 'nullable|string',
            'visual_css' => 'nullable|string',
            'visual_json' => 'nullable',
            'meta' => 'nullable|array',
        ]);

        $data['slug'] = $this->uniqueSlug($data['slug'] ?? Str::slug($data['title']), $page->id);
        $data['is_homepage'] = $request->boolean('is_homepage');

        if ($data['status'] === 'published') {
            $data['published_at'] = $data['published_at'] ?? ($page->published_at ?? now());
        }

        if ($data['status'] === 'draft') {
            $data['published_at'] = null;
        }

        $metaCurrent = is_array($page->meta) ? $page->meta : [];
        $metaIn = (array) ($data['meta'] ?? []);
        $meta = array_replace_recursive($metaCurrent, $metaIn);

        $meta['visual_editor_version'] = 'v4';
        $meta['title'] = $metaIn['title'] ?? ($metaCurrent['title'] ?? null);
        $meta['description'] = $metaIn['description'] ?? ($metaCurrent['description'] ?? null);
        $meta['keywords'] = array_key_exists('keywords', $metaIn)
            ? $metaIn['keywords']
            : ($metaCurrent['keywords'] ?? null);

        $meta['show_title'] = $request->has('meta.show_title')
            ? $request->boolean('meta.show_title')
            : ($metaCurrent['show_title'] ?? true);

        $meta['show_excerpt'] = $request->has('meta.show_excerpt')
            ? $request->boolean('meta.show_excerpt')
            : ($metaCurrent['show_excerpt'] ?? false);

        $meta['show_pubdate'] = $request->has('meta.show_pubdate')
            ? $request->boolean('meta.show_pubdate')
            : ($metaCurrent['show_pubdate'] ?? true);

        $meta['show_author'] = $request->has('meta.show_author')
            ? $request->boolean('meta.show_author')
            : ($metaCurrent['show_author'] ?? true);

        $meta['show_breadcrumbs'] = $request->has('meta.show_breadcrumbs')
            ? $request->boolean('meta.show_breadcrumbs')
            : ($metaCurrent['show_breadcrumbs'] ?? true);

        $layout = is_array($meta['layout'] ?? null) ? $meta['layout'] : [];
        $meta['layout'] = $this->normalizeLayout($layout);
        $this->mirrorLayoutToPublicMeta($meta);

        $visualCss = $this->mergeLayoutRuntimeCss($data['visual_css'] ?? '', $meta['layout']);

        $page->fill([
            'title' => $data['title'],
            'slug' => $data['slug'],
            'excerpt' => $data['excerpt'] ?? null,
            'status' => $data['status'],
            'is_homepage' => $data['is_homepage'],
            'published_at' => $data['published_at'] ?? null,
            'editor_mode' => 'visual',
            'visual_html' => $data['visual_html'] ?? null,
            'visual_css' => $visualCss,
            'visual_json' => $request->input('visual_json', []),
            'meta' => $meta,
        ]);

        $page->save();

        if ($page->is_homepage) {
            Page::where('id', '<>', $page->id)->where('is_homepage', true)->update(['is_homepage' => false]);
        }

        return back()->with('ok', 'Pagina Editor V4 aggiornata.');
    }

    private function uniqueSlug(string $slug, ?int $ignoreId = null): string
    {
        $base = Str::slug($slug) ?: 'pagina';
        $candidate = $base;
        $counter = 2;

        while (
            Page::withTrashed()
                ->when($ignoreId, fn ($query) => $query->where('id', '<>', $ignoreId))
                ->where('slug', $candidate)
                ->exists()
        ) {
            $candidate = $base . '-' . $counter;
            $counter++;

            if ($counter > 9999) {
                $candidate = $base . '-' . Str::random(6);
                break;
            }
        }

        return $candidate;
    }

    private function normalizeLayout(array $layoutIn): array
    {
        $modeRaw = (string) ($layoutIn['mode'] ?? 'default');
        $allowedModes = ['default', 'boxed', 'full_width', 'fullscreen', 'landing', 'blank'];
        $mode = in_array($modeRaw, $allowedModes, true) ? $modeRaw : 'default';

        $widthRaw = (string) ($layoutIn['width'] ?? 'standard');
        $widthMap = [
            'standard' => 'standard',
            'container' => 'standard',
            'boxed' => 'boxed',
            'full' => 'full',
            'fullwidth' => 'full',
            'full_width' => 'full',
        ];
        $width = $widthMap[$widthRaw] ?? 'standard';

        if ($mode === 'boxed') {
            $width = 'boxed';
        }
        if (in_array($mode, ['full_width', 'fullscreen', 'landing', 'blank'], true)) {
            $width = 'full';
        }

        $layout = array_merge($layoutIn, [
            'mode' => $mode,
            'width' => $width,
            'max_width' => $this->intBetween($layoutIn['max_width'] ?? 1200, 320, 3000, 1200),
            'gutter' => $this->intBetween($layoutIn['gutter'] ?? 24, 0, 200, 24),
            'gutter_tablet' => $this->intBetween($layoutIn['gutter_tablet'] ?? 20, 0, 200, 20),
            'gutter_mobile' => $this->intBetween($layoutIn['gutter_mobile'] ?? 16, 0, 200, 16),
            'top' => $this->intBetween($layoutIn['top'] ?? 0, 0, 600, 0),
            'bottom' => $this->intBetween($layoutIn['bottom'] ?? 0, 0, 600, 0),
            'header_offset' => $this->intBetween($layoutIn['header_offset'] ?? 0, 0, 300, 0),
            'top_attach' => $this->bool01($layoutIn['top_attach'] ?? false),
            'hide_footer' => $this->bool01($layoutIn['hide_footer'] ?? false),
            'min_height' => in_array(($layoutIn['min_height'] ?? 'auto'), ['auto', '100vh'], true) ? $layoutIn['min_height'] : 'auto',
        ]);

        unset($layout['hide_title']);

        if (in_array($mode, ['fullscreen', 'landing', 'blank'], true)) {
            $layout['min_height'] = '100vh';
        }
        if (in_array($mode, ['landing', 'blank'], true)) {
            $layout['top_attach'] = true;
        }
        if ($mode === 'blank') {
            $layout['hide_footer'] = true;
        }

        $background = is_array($layoutIn['background'] ?? null) ? $layoutIn['background'] : [];
        $bgType = (string) ($background['type'] ?? 'none');
        if (! in_array($bgType, ['none', 'color', 'gradient'], true)) {
            $bgType = 'none';
        }

        $layout['background'] = [
            'type' => $bgType,
            'color' => $this->safeColor($background['color'] ?? '#ffffff', '#ffffff'),
            'from' => $this->safeColor($background['from'] ?? '#ffffff', '#ffffff'),
            'to' => $this->safeColor($background['to'] ?? '#f3f4f6', '#f3f4f6'),
            'angle' => $this->intBetween($background['angle'] ?? 180, 0, 360, 180),
        ];

        return $layout;
    }

    private function mirrorLayoutToPublicMeta(array &$meta): void
    {
        $layout = is_array($meta['layout'] ?? null) ? $meta['layout'] : [];
        $background = is_array($layout['background'] ?? null) ? $layout['background'] : [];
        $bgType = (string) ($background['type'] ?? 'none');

        if ($bgType === 'color') {
            $meta['page_bg'] = [
                'type' => 'color',
                'color' => $this->safeColor($background['color'] ?? '#ffffff', '#ffffff'),
            ];
        } elseif ($bgType === 'gradient') {
            $meta['page_bg'] = [
                'type' => 'gradient',
                'from' => $this->safeColor($background['from'] ?? '#ffffff', '#ffffff'),
                'to' => $this->safeColor($background['to'] ?? '#f3f4f6', '#f3f4f6'),
                'angle' => $this->intBetween($background['angle'] ?? 180, 0, 360, 180),
            ];
        }

        if (! empty($layout['hide_footer'])) {
            $meta['show_pubdate'] = false;
            $meta['show_author'] = false;
        }
    }

    private function mergeLayoutRuntimeCss(?string $css, array $layout): string
    {
        $css = (string) $css;
        $css = preg_replace('/\/\* R4_EDITOR_V4_LAYOUT_START \*\/[\s\S]*?\/\* R4_EDITOR_V4_LAYOUT_END \*\//', '', $css) ?? $css;
        $css = trim($css);

        $layoutCss = $this->layoutRuntimeCss($layout);

        return trim($layoutCss . "\n\n" . $css);
    }

    private function layoutRuntimeCss(array $layout): string
    {
        $mode = (string) ($layout['mode'] ?? 'default');
        $width = (string) ($layout['width'] ?? 'standard');
        $maxWidth = (int) ($layout['max_width'] ?? 1200);
        $gutter = (int) ($layout['gutter'] ?? 24);
        $gutterTablet = (int) ($layout['gutter_tablet'] ?? 20);
        $gutterMobile = (int) ($layout['gutter_mobile'] ?? 16);
        $top = (int) ($layout['top'] ?? 0);
        $bottom = (int) ($layout['bottom'] ?? 0);
        $headerOffset = (int) ($layout['header_offset'] ?? 0);
        $minHeight = (($layout['min_height'] ?? 'auto') === '100vh' || in_array($mode, ['fullscreen', 'landing', 'blank'], true))
            ? "calc(100vh - {$headerOffset}px)"
            : 'auto';

        $bg = $this->layoutBackgroundCss($layout);

        $isFull = $width === 'full' || in_array($mode, ['full_width', 'fullscreen', 'landing', 'blank'], true);
        $boxedCss = $width === 'boxed' && ! $isFull
            ? "max-width:{$maxWidth}px!important;margin-left:auto!important;margin-right:auto!important;"
            : 'max-width:none!important;margin-left:0!important;margin-right:0!important;';

        $hideFooterCss = ! empty($layout['hide_footer'])
            ? ".page-shell__content article>footer{display:none!important;}\n"
            : '';

        $backgroundCss = $bg !== '' ? "background:{$bg}!important;" : '';

        return self::LAYOUT_CSS_START . "\n" .
            ":root{--r4-v4-layout-gutter:{$gutter}px;--r4-v4-layout-gutter-tablet:{$gutterTablet}px;--r4-v4-layout-gutter-mobile:{$gutterMobile}px;}\n" .
            "html body .page-shell{{$backgroundCss}min-height:{$minHeight}!important;}\n" .
            "html body .page-shell__content{padding-top:{$top}px!important;padding-bottom:{$bottom}px!important;padding-left:var(--r4-v4-layout-gutter)!important;padding-right:var(--r4-v4-layout-gutter)!important;{$boxedCss}}\n" .
            "html body .page-shell__content.container,html body .page-shell__content.container-fluid{width:100%!important;}\n" .
            ".page-visual-content{width:100%!important;}\n" .
            "html,body,#wrapper,[data-gjs-type=\"wrapper\"]{{$backgroundCss}min-height:{$minHeight}!important;}\n" .
            "body{padding-top:{$top}px!important;padding-bottom:{$bottom}px!important;padding-left:var(--r4-v4-layout-gutter)!important;padding-right:var(--r4-v4-layout-gutter)!important;{$boxedCss}}\n" .
            "@media(max-width:991.98px){html body .page-shell__content,body{padding-left:var(--r4-v4-layout-gutter-tablet)!important;padding-right:var(--r4-v4-layout-gutter-tablet)!important;}}\n" .
            "@media(max-width:575.98px){html body .page-shell__content,body{padding-left:var(--r4-v4-layout-gutter-mobile)!important;padding-right:var(--r4-v4-layout-gutter-mobile)!important;}}\n" .
            $hideFooterCss .
            self::LAYOUT_CSS_END;
    }

    private function layoutBackgroundCss(array $layout): string
    {
        $background = is_array($layout['background'] ?? null) ? $layout['background'] : [];
        $type = (string) ($background['type'] ?? 'none');

        if ($type === 'color') {
            return $this->safeColor($background['color'] ?? '#ffffff', '#ffffff');
        }

        if ($type === 'gradient') {
            $angle = $this->intBetween($background['angle'] ?? 180, 0, 360, 180);
            $from = $this->safeColor($background['from'] ?? '#ffffff', '#ffffff');
            $to = $this->safeColor($background['to'] ?? '#f3f4f6', '#f3f4f6');

            return "linear-gradient({$angle}deg, {$from}, {$to})";
        }

        return '';
    }

    private function intBetween($value, int $min, int $max, int $default): int
    {
        if (! is_numeric($value)) {
            return $default;
        }

        return max($min, min($max, (int) $value));
    }

    private function bool01($value): bool
    {
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    private function safeColor($value, string $default): string
    {
        $value = trim((string) $value);

        if (preg_match('/^#[0-9a-fA-F]{3,8}$/', $value)) {
            return $value;
        }

        return $default;
    }
}

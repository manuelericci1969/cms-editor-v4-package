(function () {
    'use strict';

    const cfg = window.R4VisualEditorV4 || {};

    const ELEMENT_CATEGORIES = ['layout', 'base', 'media'];
    const WIDGET_CATEGORIES = ['marketing', 'interattivi', 'crewlive', 'pro', 'widget'];

    let editorPanelCollapsed = false;

    function byId(id) {
        return id ? document.getElementById(id) : null;
    }

    function normalize(value) {
        return String(value || '')
            .trim()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    function getCategoryTitle(categoryEl) {
        const titleEl = categoryEl.querySelector('.gjs-title, .gjs-category-title, .gjs-block-category-title');
        return titleEl ? titleEl.textContent : categoryEl.textContent;
    }

    function categoryTarget(categoryEl) {
        const key = normalize(getCategoryTitle(categoryEl));

        if (ELEMENT_CATEGORIES.some((name) => key.includes(name))) return 'elements';
        if (WIDGET_CATEGORIES.some((name) => key.includes(name))) return 'widgets';

        return 'widgets';
    }

    function refreshEditorCanvas() {
        const editor = window.r4VisualEditorV4Instance;
        if (editor && typeof editor.refresh === 'function') {
            window.setTimeout(function () { editor.refresh(); }, 120);
        }
    }

    function injectEditorPanelCss() {
        if (document.getElementById('r4v4EditorPanelCollapseCss')) return;
        const style = document.createElement('style');
        style.id = 'r4v4EditorPanelCollapseCss';
        style.textContent = '' +
            '.r4v4-panel.r4v4-blocks-panel{position:relative;overflow:hidden}' +
            '.r4v4-panel.r4v4-blocks-panel .r4v4-panel-title{display:flex;align-items:center;justify-content:space-between;gap:8px}' +
            '.r4v4-editor-panel-toggle{width:30px;height:30px;border:1px solid rgba(148,163,184,.28);border-radius:10px;background:#020617;color:#e5e7eb;font-size:17px;font-weight:900;line-height:1;cursor:pointer}' +
            '.r4v4-editor-panel-toggle:hover{background:#111827;color:#fff}' +
            '.r4v4-blocks-panel.is-editor-collapsed .r4v4-left-tabs,' +
            '.r4v4-blocks-panel.is-editor-collapsed .r4v4-left-tab-panel,' +
            '.r4v4-blocks-panel.is-editor-collapsed .r4v4-left-tab-source{display:none!important}' +
            '.r4v4-blocks-panel.is-editor-collapsed{min-height:0!important}' +
            '.r4v4-blocks-panel.is-editor-collapsed .r4v4-panel-title{margin-bottom:0!important}' +
            '.r4v4-blocks-panel.is-editor-collapsed::after{content:"Pannello compresso: clicca + per riaprire gli strumenti.";display:block;margin:10px 0 2px;color:#94a3b8;font-size:11px;line-height:1.45}' +
            '.r4v4-sidebar-left{overflow-y:auto;overflow-x:hidden}';
        document.head.appendChild(style);
    }

    function updateEditorPanelToggle(blocksPanel) {
        if (!blocksPanel) return;
        const button = blocksPanel.querySelector('[data-r4v4-editor-panel-toggle]');
        blocksPanel.classList.toggle('is-editor-collapsed', editorPanelCollapsed);
        if (button) {
            button.textContent = editorPanelCollapsed ? '+' : '−';
            button.title = editorPanelCollapsed ? 'Riapri il pannello Editor' : 'Comprimi il pannello Editor';
        }
        refreshEditorCanvas();
    }

    function bindEditorPanelToggle(blocksPanel) {
        if (!blocksPanel || blocksPanel.dataset.r4v4EditorCollapseBound === '1') return;
        blocksPanel.dataset.r4v4EditorCollapseBound = '1';
        injectEditorPanelCss();

        const title = blocksPanel.querySelector('.r4v4-panel-title');
        if (!title) return;

        let button = title.querySelector('[data-r4v4-editor-panel-toggle]');
        if (!button) {
            button = document.createElement('button');
            button.type = 'button';
            button.className = 'r4v4-editor-panel-toggle';
            button.setAttribute('data-r4v4-editor-panel-toggle', '1');
            title.appendChild(button);
        }

        button.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            editorPanelCollapsed = !editorPanelCollapsed;
            updateEditorPanelToggle(blocksPanel);
        });

        updateEditorPanelToggle(blocksPanel);
    }

    function activateTab(sidebar, tabName) {
        sidebar.querySelectorAll('[data-r4v4-sidebar-tab]').forEach((button) => {
            button.classList.toggle('is-active', button.dataset.r4v4SidebarTab === tabName);
        });

        sidebar.querySelectorAll('[data-r4v4-sidebar-panel]').forEach((panel) => {
            const active = panel.dataset.r4v4SidebarPanel === tabName;
            panel.hidden = !active;

            if (active) {
                const module = window.R4V4SidebarMenu.byKey(tabName);
                if (module && typeof module.onActivate === 'function') module.onActivate(panel);
            }
        });

        updateEditorPanelToggle(sidebar);
    }

    function bindSelectionState(blocksPanel) {
        if (blocksPanel.dataset.r4v4SelectionStateBound === '1') return;
        blocksPanel.dataset.r4v4SelectionStateBound = '1';

        let attempts = 0;
        const timer = window.setInterval(function () {
            attempts += 1;
            const editor = window.r4VisualEditorV4Instance;

            if (!editor) {
                if (attempts > 40) window.clearInterval(timer);
                return;
            }

            window.clearInterval(timer);

            const refresh = function () {
                blocksPanel.classList.toggle('has-component-selected', !!editor.getSelected());
            };

            editor.on('component:selected', refresh);
            editor.on('component:deselected', function () { window.setTimeout(refresh, 80); });
            editor.on('component:remove', function () { window.setTimeout(refresh, 80); });

            refresh();
        }, 150);
    }

    function distributeCategories(blocksSource, panels) {
        const categories = blocksSource.querySelectorAll('.gjs-block-category, .gjs-category, .gjs-blocks-c');
        if (!categories.length) return false;

        let moved = 0;

        categories.forEach((categoryEl) => {
            if (categoryEl.dataset.r4v4SidebarMoved === '1') return;

            const target = categoryTarget(categoryEl);
            const destination = panels[target] || panels.widgets;
            if (!destination) return;

            destination.appendChild(categoryEl);
            categoryEl.dataset.r4v4SidebarMoved = '1';
            moved += 1;
        });

        return moved > 0;
    }

    function buildTabs(blocksPanel, blocksSource) {
        if (blocksPanel.dataset.r4v4SidebarTabs === '1') {
            bindEditorPanelToggle(blocksPanel);
            return;
        }
        blocksPanel.dataset.r4v4SidebarTabs = '1';
        blocksPanel.classList.add('r4v4-blocks-panel');

        const title = blocksPanel.querySelector('.r4v4-panel-title');
        if (title) title.textContent = 'Editor';

        bindEditorPanelToggle(blocksPanel);

        const modules = window.R4V4SidebarMenu.all();
        const tabbar = document.createElement('div');
        tabbar.className = 'r4v4-left-tabs';
        tabbar.innerHTML = modules.map((module) => (
            '<button type="button" data-r4v4-sidebar-tab="' + module.key + '"' +
            (module.selectionOnly ? ' data-r4v4-selection-tab="1"' : '') +
            '>' + module.label + '</button>'
        )).join('');

        const panels = {};

        blocksSource.parentNode.insertBefore(tabbar, blocksSource);

        modules.forEach((module) => {
            const panel = document.createElement('div');
            panel.className = 'r4v4-left-tab-panel r4v4-left-tab-panel-' + module.key;
            panel.dataset.r4v4SidebarPanel = module.key;
            panel.hidden = true;
            blocksSource.parentNode.insertBefore(panel, blocksSource);
            panels[module.key] = panel;

            if (typeof module.mount === 'function') module.mount(panel);
        });

        blocksSource.classList.add('r4v4-left-tab-source');
        blocksSource.hidden = true;

        tabbar.querySelectorAll('[data-r4v4-sidebar-tab]').forEach((button) => {
            button.addEventListener('click', function () {
                activateTab(blocksPanel, button.dataset.r4v4SidebarTab);
            });
        });

        const distribute = function () {
            return distributeCategories(blocksSource, panels);
        };

        const observer = new MutationObserver(distribute);
        observer.observe(blocksSource, { childList: true, subtree: false });

        let attempts = 0;
        const timer = setInterval(function () {
            attempts += 1;
            const moved = distribute();
            if (moved || attempts > 30) clearInterval(timer);
        }, 120);

        distribute();
        activateTab(blocksPanel, 'elements');
        bindSelectionState(blocksPanel);
        updateEditorPanelToggle(blocksPanel);
    }

    function initSidebarTabs() {
        const blocksSource = byId(cfg.blocksId || 'r4v4-blocks');
        if (!blocksSource || !window.R4V4SidebarMenu) return;

        const blocksPanel = blocksSource.closest('.r4v4-panel');
        if (!blocksPanel) return;

        buildTabs(blocksPanel, blocksSource);
    }

    function loadHelpModule() {
        if (document.querySelector('script[data-r4v4-help-module="1"]')) return;

        const current = document.currentScript;
        const src = current && current.src
            ? current.src.replace(/boot\.js(?:\?.*)?$/, 'help.js')
            : '/assets/admin/visual-editor-v4/menu/help.js';

        const script = document.createElement('script');
        script.src = src;
        script.defer = true;
        script.dataset.r4v4HelpModule = '1';
        document.body.appendChild(script);
    }

    document.addEventListener('DOMContentLoaded', function () {
        initSidebarTabs();
        loadHelpModule();
        setTimeout(initSidebarTabs, 350);
        setTimeout(initSidebarTabs, 900);
    });
})();

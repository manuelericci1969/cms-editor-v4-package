(function () {
    'use strict';

    const h = window.R4V4MenuHelpers;

    window.R4V4SidebarMenu.register({
        key: 'widgets',
        label: 'Widget',
        order: 30,
        templateId: 'r4v4-menu-template-widgets',
        acceptsBlockCategory: true,
        mount(panel) {
            panel.innerHTML = h.templateHtml(this.templateId);
        }
    });
})();

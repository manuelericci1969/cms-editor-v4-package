(function () {
    'use strict';

    const h = window.R4V4MenuHelpers;

    window.R4V4SidebarMenu.register({
        key: 'elements',
        label: 'Elementi',
        order: 40,
        templateId: 'r4v4-menu-template-elements',
        acceptsBlockCategory: true,
        mount(panel) {
            panel.innerHTML = h.templateHtml(this.templateId);
        }
    });
})();

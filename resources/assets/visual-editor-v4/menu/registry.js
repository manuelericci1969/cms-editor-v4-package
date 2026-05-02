(function () {
    'use strict';

    window.R4V4_DISABLE_PAGE_SETTINGS_DRAWER = true;

    const modules = [];

    window.R4V4SidebarMenu = window.R4V4SidebarMenu || {
        register(module) {
            if (!module || !module.key || !module.label) return;
            modules.push(module);
        },
        all() {
            return modules.slice().sort((a, b) => (a.order || 100) - (b.order || 100));
        },
        byKey(key) {
            return modules.find((module) => module.key === key) || null;
        }
    };
})();

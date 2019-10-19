export function lazyLoad(page) {
    switch (page) {
        case 'normal':
            import('../pages/normal-page.js');
            break;
        case 'windows':
            import('../pages/windows-page.js');
            break;
        case 'dashboard':
            import('../pages/dashboard-page.js');
            break;
        case 'help':
            import('../pages/help-page.js');
            break;
    }
}

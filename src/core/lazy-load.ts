export function lazyLoad(page: string): void {
    switch (page) {
        case 'normal':
            import('../pages/normal-page');
            break;
        case 'windows':
            import('../pages/windows-page');
            break;
        case 'dashboard':
            import('../pages/dashboard-page');
            break;
        case 'help':
            import('../pages/help-page');
            break;
    }
}

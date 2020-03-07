export const installOfflineWatcher = (offlineUpdatedCallback) => {
    window.addEventListener('online', () => offlineUpdatedCallback(false));
    window.addEventListener('offline', () => offlineUpdatedCallback(true));
    offlineUpdatedCallback(navigator.onLine === false);
};

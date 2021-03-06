export const installOfflineWatcher = (offlineUpdatedCallback: (isOffline: boolean) => void): void => {
    window.addEventListener('online', () => offlineUpdatedCallback(false));
    window.addEventListener('offline', () => offlineUpdatedCallback(true));

    offlineUpdatedCallback(!navigator.onLine);
};

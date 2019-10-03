export const installMediaQueryWatcher = (mediaQuery, layoutChangedCallback) => {
    const mql = window.matchMedia(mediaQuery);
    mql.addListener((e) => layoutChangedCallback(e.matches));
    layoutChangedCallback(mql.matches);
};

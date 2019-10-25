export const installMediaQueryWatcher = (
    mediaQuery: string,
    layoutChangedCallback: (mediaQueryMatches: boolean) => void,
): void => {
    const mql = window.matchMedia(mediaQuery);
    mql.addListener(e => layoutChangedCallback(e.matches));
    layoutChangedCallback(mql.matches);
};

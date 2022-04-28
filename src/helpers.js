/**
 * @param url URL
 * @returns {{}}
 */
export function parseSearchPath(url) {
    if (url.search.length === 0) return {};

    return url.search.substring(1)
        .split('&')
        .map(pair => pair.split('='))
        .reduce((acc, pair) => {
            acc[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            return acc;
        }, {});
}

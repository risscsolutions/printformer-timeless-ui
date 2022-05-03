export function parseSearchPath() {
    if (location.search.length === 0) return {};

    return location.search.substring(1)
        .split('&')
        .map(pair => pair.split('='))
        .reduce((acc, pair) => {
            acc[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
            return acc;
        }, {});
}

export function urlQueryObject() {
    let url = new URL(location.href);
    let query = parseSearchPath(url);

    if (process.env.NODE_ENV === 'development') {
        url = new URL(process.env.PF_URL);
        query = {draft: process.env.PF_DRAFT, api_token: process.env.PF_TOKEN};
    }

    return {url, query}
}

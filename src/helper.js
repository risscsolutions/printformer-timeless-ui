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

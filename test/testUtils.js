/**
 * This function matches specified cookieName value
 * @param {string} headers
 * @param {string} cookieName
 * @returns {string} cookie value
 */
export const getCookieValue = (headers, cookieName) => {
  return headers
    .toString()
    .match('(^|;)\\s*' + cookieName + '\\s*=\\s*([^;]+)')
    ?.pop();
};

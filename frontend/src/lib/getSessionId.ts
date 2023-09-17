/**
 * Only use this function on the client. Gets the session id from
 * localstorage if it exists
 */
export const getSessionId = () => {
  return localStorage.getItem('resonate-s');
};

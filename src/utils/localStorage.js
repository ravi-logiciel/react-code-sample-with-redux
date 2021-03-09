import store from 'store';

const USER_SESSION = 'user_session';

/**
 * Set User Session
 *
 * @param {Object} data
 */
function setUserSession(data) {
  setLocalStorage(USER_SESSION, data);
}

/**
 * Get User Session
 *
 * @return {Object}
 */
function getUserSession() {
  return getLocalStorage(USER_SESSION);
}

/**
 * Clear User Session
 */
function clearUserSession() {
  setLocalStorage(USER_SESSION, {});
}

export {
  setUserSession,
  getUserSession,
  clearUserSession,
};

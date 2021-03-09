const DOMAIN_PREFIX = window.location.href.startsWith('https')
  ? 'https'
  : 'http';

const BASE_URLS = {
  development: `${DOMAIN_PREFIX}://<API_BASE_URL>/api`,
  qa: `${DOMAIN_PREFIX}://<API_BASE_URL>/api`,
  production: `${DOMAIN_PREFIX}://<API_BASE_URL>/api`,
};

const API_BASE_URL = BASE_URLS[process.env.REACT_APP_ENV];

/**
 * APIs for Specific Module
 */
const MODULE_API = {
  GET_MODULE: `${API_BASE_URL}/module/#ID#`,
  // Other APIs
}


export { API_BASE_URL, API_URLS, MODULE_API };
import axios from 'axios';

import { API_BASE_URL } from '../configs/api';
import { AUTH_MSG } from '../configs/messages';

import { showErrorMsg } from './notifications';
import { getUserSession } from './localStorage';

/**
 * Cancel Token
 */
const { CancelToken } = axios;

/**
 * Use to cancel Http Requests
 */
let cancelHttpTokens = [];

/**
 * Helper Params used in Request
 */
const HELPER_PARAMS = {
  callback: null, // Function|Null
  hideError: false,

  // Additional Headers
  headers: {
    Accept: 'application/json',
  },
};

/**
 * commandAxios
 * Axios instance for all API requests
 */
const appAxios = axios.create({
  baseURL: API_BASE_URL,
});

/**
 * Get Common Headers
 *
 * @param {String} url
 * @param {Object} additionalHeaders
 *
 * @return {Object} Headers
 */
export const getCommonHeaders = (url, additionalHeaders = {}) => {
  const { access_token = '' } = getUserSession() || {};

  try {
    const headers = {
      Accept: 'application/json',
      'Access-Control-Allow-Origin': '*',

      /* Additional Headers */
      ...additionalHeaders,
    };

    if (access_token) {
      headers.Authorization = `Bearer ${access_token}`;
    }

    return headers;
  } catch (e) {
    return {};
  }
};

/**
 * GET Request
 *
 * @param {String} url
 * @param {Object} HELPER_PARAMS
 */
export const httpGet = async (
  url,
  { callback, headers, responseType, hideError } = HELPER_PARAMS
) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);

    return appAxios
      .get(url, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken(c => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        }),
        responseType,
      })
      .then(httpHandleResponse)
      .catch(err => {
        return httpHandleError(err, { hideError });
      });
  } catch (e) {
    console.error('-- HTTP GET -- ', e);
    return Promise.reject({});
  }
};

/**
 * POST Request
 *
 * @param {String} url
 * @param {Object} params
 * @param {Object} HELPER_PARAMS
 */
export const httpPost = (
  url,
  params,
  { callback, headers, onUploadProgress, hideError } = HELPER_PARAMS
) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);

    return appAxios
      .post(url, params, {
        onUploadProgress,
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken(c => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        }),
      })
      .then(httpHandleResponse)
      .catch(err => {
        return httpHandleError(err, { hideError });
      });
  } catch (e) {
    console.error('-- HTTP POST -- ', e);
    return Promise.reject({});
  }
};

/**
 * PUT Request
 *
 * @param {String} url
 * @param {Object} params
 * @param {Object} HELPER_PARAMS
 */
export const httpPut = (url, params, { callback, headers } = HELPER_PARAMS) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);

    return appAxios
      .put(url, params, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken(c => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        }),
      })
      .then(httpHandleResponse)
      .catch(httpHandleError);
  } catch (e) {
    console.error('-- HTTP PUT -- ', e);
    return Promise.reject({});
  }
};

/**
 * PATCH Request
 *
 * @param {String} url
 * @param {Object} params
 * @param {Object} HELPER_PARAMS
 */
export const httpPatch = (
  url,
  params,
  { callback, headers } = HELPER_PARAMS
) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);

    return appAxios
      .patch(url, params, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken(c => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        }),
      })
      .then(httpHandleResponse)
      .catch(httpHandleError);
  } catch (e) {
    console.error('-- HTTP PATCH -- ', e);
    return Promise.reject({});
  }
};

/**
 * DELETE Request
 *
 * @param {String} url
 * @param {Object} HELPER_PARAMS
 */
export const httpDelete = (url, { callback, headers } = HELPER_PARAMS) => {
  try {
    if (!headers) ({ headers } = HELPER_PARAMS);

    return appAxios
      .delete(url, {
        headers: getCommonHeaders(url, headers),
        cancelToken: new CancelToken(c => {
          cancelHttpTokens.push(c);
          if (callback) callback(c);
        }),
      })
      .then(httpHandleResponse)
      .catch(httpHandleError);
  } catch (e) {
    console.error('-- HTTP DELETE -- ', e);
    return Promise.reject({});
  }
};

/**
 * Handle Success Response
 *
 * @param {Object|Null} res
 *
 * @return {Object|Null}
 */
export const httpHandleResponse = res => {
  cancelHttpTokens = [];

  if (!res) return Promise.reject(null);

  return Promise.resolve(res.data);
};

/**
 * Handle API Error Reponse
 *
 * @param {Object|Null} error
 *
 * @return {Object|String|Null}
 */
export const httpHandleError = (error, { hideError } = {}) => {
  /* error = { error, config, code, request, response } */
  try {
    if (hideError) return Promise.reject(error);

    if (!error) return Promise.reject({});

    /* Handle Cancel Request */
    cancelHttpTokens = [];
    if (!error.request) return Promise.reject('cancelled');

    if (error.message == 'Network failed') {
      showErrorMsg();
      return Promise.reject({});
    }

    const xhr = error.request;
    let err = {};
    if (xhr.response) err = extractJSON(xhr.response);

    if (xhr) {
      switch (xhr.status) {
        case 0:
          showErrorMsg();
          break;

        case 400:
          // Handle Error: 400
          break;

        case 401:
          showErrorMsg(err.message || AUTH_MSG.session_expired);
          localStorage.clear();
          break;

        case 403:
        case 404:
        case 405:
        case 412:
        case 422:
        case 502:
        case 503:
          // Handle Error
          showErrorMsg();
          break;

        default:
          showErrorMsg();
      }
    } else {
      showErrorMsg();
    }

    return Promise.reject(err);
  } catch (e) {
    console.error('-- HTTP HANDLE ERROR -- ', e);
    return Promise.reject({});
  }
};

/**
 * Cancel Http Request
 */
export const httpCancel = () => {
  try {
    cancelHttpTokens.forEach(cancel => cancel());
    cancelHttpTokens = [];
  } catch (e) {
    cancelHttpTokens = [];
  }
};

/**
 * Extract JSON Response
 *
 * @param {JSON} json [JSON Data]
 *
 * @return {Object|String} Extracted value or Blank Object
 */
export const extractJSON = json => {
  try {
    return JSON.parse(json);
  } catch (err) {
    return '';
  }
};

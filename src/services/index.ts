// Creates and configures axios instance
import axios from 'axios';
import * as Cookie from 'universal-cookie';
const API_KEY = process.env.API_KEY;

const dev = process.env.NODE_ENV !== 'production';
const isBrowser = typeof window !== 'undefined';
const cookie = new Cookie.default();

let cachedToken: string = '';

/* Create axios instance */
const api = axios.create({
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
});

const getToken = () => {
  if (!isBrowser) {
    return null;
  }
  if (cachedToken) {
    return cachedToken;
  }
  cachedToken = cookie.get('userAuthToken');
  return cachedToken;
};

/** In dev, intercepts request and logs it into console for dev */
api.interceptors.request.use(
  async (config) => {
    config.params = config.params || {};
    config.params['apikey'] = API_KEY;
    if (
      config.url &&
      isBrowser &&
      !(config.url.includes('/sign_in') || config.url.includes('/sign_up'))
    ) {
      // Using `includes` rather than `===` is a basic means of utilizing this across all four sections of the API
      const key = await getToken();

      if (key && config.headers) {
        config.headers.Authorization = `bearer ${key}`;
      }
    }
    return config;
  },
  (error) => {
    if (dev) {
      console.error('✉️ ', error); // tslint:disable-line no-console
    }
    console.log('error: ', error);
    return Promise.reject(error);
  }
);

/**
 * Passes response.data to services.
 * In dev, intercepts response and logs it into console for dev
 */
api.interceptors.response.use(
  (response) => {
    if (dev) {
      console.info('📩 ', response); // tslint:disable-line no-console
    }
    return response;
  },
  (error) => {
    /*
     * Capture an error from the API and report to sentry
     */
    if (error.response && error.response.data) {
      console.log('Request Failed: ', error);
    }
    if (
      //error.response &&
      //(error.response.status === 401 || error.response.status === 403)
      false
    ) {
      if (isBrowser) {
        const loc = window.location.pathname;
        if (!(loc.includes('/sign_in') || loc.includes('/sign_up'))) {
          window.location.pathname = `/sign_in`;
        }
      }
      throw new axios.Cancel(error.response);
    }
    if (error.response && error.response.status === 429) {
      console.log('Rate Limit Hit!: ', error.response);
      throw new axios.Cancel('Rate Limit');
    }
    /**
     * API should send an error message in the format
     * { error: <message> }
     */
    if (error.response && error.response.data) {
      if (dev) {
        console.error('Error: ', error.response.data.error); // tslint:disable-line no-console
      }
      console.log('Error on Response [expected]', error.response.data);

      return Promise.reject(error.response.data);
    }
    if (dev) {
      console.error('📩 ', error); // tslint:disable-line no-console
    }
    console.log('Error on Response [unexpected]', error);
    return Promise.reject(error.message);
  }
);

/**
 * Inject api instance to the services.
 * This allows the services to be tested separately if needed.
 */
import inventory from './inventory';

// These will be used when accessing the services via the *browser*
const inventorySVC = inventory(api);
// These will be used when accessing the services on *SSR*
// Wouldn't be able to call authorized calls because there would be no cookies

// Send payload as multipart form

export { inventorySVC };

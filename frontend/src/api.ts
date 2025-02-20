import { ACCESS_TOKEN } from './constants';
import { Api } from './services/apiContract';
import log from './services/log';

const getToken = () => localStorage.getItem(ACCESS_TOKEN);

const apiInstance = new Api({
  baseUrl: import.meta.env.VITE_API_URL,
  securityWorker: async () => {
    const token = getToken();
    return token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  },
}).api;

// proxy which maps apiInstance to have automatically log errors with the logger
const api = new Proxy(apiInstance, {
  get(target, prop: string, receiver) {
    const originalMethod = Reflect.get(target, prop, receiver);

    if (typeof originalMethod === 'function') {
      return async function (...args: unknown[]) {
        try {
          return await originalMethod.apply(target, args);
        } catch (error: any) {
          // Avoid logging unnecessary noise - 401 unothorized request

          if (error?.status !== 401) log.error(`API request failed: ${prop}`, { error });
          throw error; // Re-throw to maintain existing behavior
        }
      };
    }
  },
});

export default api;

import { ACCESS_TOKEN } from './constants';
import { Api } from './services/apiContract';

const apiUrl = import.meta.env.VITE_API_URL;
console.log('API URL:', apiUrl);

const apiInstance = new Api({ baseUrl: import.meta.env.VITE_API_URL }).api;

const api = new Proxy(apiInstance, {
  get(target, prop, receiver) {
    const originalMethod = Reflect.get(target, prop, receiver);
    if (typeof originalMethod === 'function') {
      return (...args: any[]) => {
        const lastArg = args[args.length - 1];
        const isParamsObject = typeof lastArg === 'object' && !Array.isArray(lastArg);

        const params: RequestParams = isParamsObject ? lastArg : {};
        const token = localStorage.getItem(ACCESS_TOKEN);

        const updatedParams = {
          ...params,
          headers: {
            ...(params.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        };

        return originalMethod(...args.slice(0, isParamsObject ? -1 : args.length), updatedParams);
      };
    }
    return originalMethod;
  },
});

export default api;

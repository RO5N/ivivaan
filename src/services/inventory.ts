import { AxiosPromise } from 'axios';

const API_PATH = process.env.PROXY_PATH;

type API = {
  get: (url: string) => AxiosPromise;
  post: (url: string, payload: any) => AxiosPromise;
  patch: (url: string, payload: any) => AxiosPromise;
};

const inventory = (api: API) => {
  const getAssets = (max: number, last: number) => api.get(API_PATH + `/inventory?max=${max}&last=${last}`);

  return {
    getAssets
  };
};

export default inventory;

import axios from 'axios';

export const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  timeout: 40000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json; charset=utf-8',
  },
});

export const fetcher = (url: string) => {
    return instance.get(`${url}`).then((res) => {
      if (!res.data) {
        throw Error(res.data.message);
      }
      return res.data;
    });
  };

export default instance;
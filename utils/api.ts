import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  timeout: 40000,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json; charset=utf-8',
  },
});

export const fetcher = (url: string) => {
    return instance.get(`${process.env.NEXT_PUBLIC_APP_URL}/${url}`).then((res) => {
      console.log('API Response:', res.data);
      if (!res.data) {
        throw Error(res.data.message);
      }
      return res.data;
    });
  };

export default instance;
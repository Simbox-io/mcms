import NodeCache from 'node-cache';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { SWRResponse, MutatorCallback, MutatorOptions } from 'swr';
import { PrismaClient, PrismaPromise } from '@prisma/client';
import { gzip, ungzip } from 'node-gzip';

interface CacheServiceInterface {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttl?: number): Promise<boolean>;
  delete(key: string): Promise<void>;
  deleteByPattern(pattern: string): Promise<void>;
  flush(): Promise<void>;
  wrapAxios<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>>;
  wrapPrisma<T extends PrismaClient>(prisma: T): T;
  wrapSWR<T>(key: string, fetcher: () => Promise<T>): Promise<SWRResponse<T>>;
}

class CacheService implements CacheServiceInterface {
  private static instance: CacheService;
  private cache: NodeCache;

  private constructor(ttlSeconds: number) {
    this.cache = new NodeCache({ stdTTL: ttlSeconds, checkperiod: ttlSeconds * 0.2 });
  }

  static getInstance(ttlSeconds: number = 60 * 60): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService(ttlSeconds);
    }
    return CacheService.instance;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    const compressedValue = await gzip(JSON.stringify(value));
    return this.cache.set(key, compressedValue, (ttl || ''));
  }

  async get<T>(key: string): Promise<T | undefined> {
    const compressedValue = this.cache.get<Buffer>(key);
    if (compressedValue === undefined) {
      return undefined;
    }
    const decompressedValue = await ungzip(compressedValue);
    return JSON.parse(decompressedValue.toString());
  }

  async delete(key: string): Promise<void> {
    this.cache.del(key);
  }

  async deleteByPattern(pattern: string): Promise<void> {
    const keys = this.cache.keys();
    keys.forEach((key) => {
      if (key.includes(pattern)) {
        this.cache.del(key);
      }
    });
  }

  async flush(): Promise<void> {
    this.cache.flushAll();
  }

  async wrapAxios<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    const cacheKey = JSON.stringify(config);
    const cachedResponse = await this.get<AxiosResponse<T>>(cacheKey);
    if (cachedResponse) {
      return Promise.resolve(cachedResponse);
    }
    try {
      const response = await axios(config);
      await this.set(cacheKey, response);
      return response;
    } catch (error) {
      throw error;
    }
  }

  wrapPrisma<T extends PrismaClient>(prisma: T): T {
    const wrapper = new Proxy<T>(prisma, {
      get: (target, prop) => {
        const property = target[prop as keyof T];
        if (typeof property === 'function') {
          return async <R>(...args: any[]): Promise<R> => {
            const cacheKey = JSON.stringify({ model: prop, args });
            const cachedResult = await this.get<R>(cacheKey);
            if (cachedResult !== undefined) {
              return Promise.resolve(cachedResult);
            }
            const result = await (property as (...args: any[]) => PrismaPromise<R>)(...args);
            await this.set(cacheKey, result);
            return result;
          };
        }
        return property;
      },
    });
    return wrapper as T;
  }

  async wrapSWR<T>(key: string, fetcher: () => Promise<T>): Promise<SWRResponse<T>> {
    const cachedData = await this.get<T>(key);
    const revalidate = async () => {
      const data = await fetcher();
      await this.set(key, data);
      return data;
    };
    const mutate = async (data?: T | Promise<T | undefined> | MutatorCallback<T>, opts?: boolean | MutatorOptions): Promise<T | undefined> => {
      let newData: T | undefined;
      if (typeof data === 'function') {
        newData = await (data as MutatorCallback<T>)(cachedData);
      } else if (data instanceof Promise) {
        newData = await data;
      } else {
        newData = data;
      }
      if (newData !== undefined) {
        await this.set(key, newData);
      }
      if (opts === true || (opts as MutatorOptions)?.revalidate !== false) {
        newData = await fetcher();
      }
      return newData;
    };
    if (cachedData !== undefined) {
      return Promise.resolve({
        data: cachedData,
        error: undefined,
        revalidate,
        isValidating: false,
        mutate,
        isLoading: false,
      });
    }
    try {
      const data = await fetcher();
      await this.set(key, data);
      return Promise.resolve({
        data,
        error: undefined,
        revalidate,
        isValidating: false,
        mutate,
        isLoading: false,
      });
    } catch (error) {
      return Promise.resolve({
        data: undefined,
        error,
        revalidate,
        isValidating: false,
        mutate,
        isLoading: false,
      });
    }
  }
}

export default CacheService.getInstance();
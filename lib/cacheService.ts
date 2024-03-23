// lib/cacheService.ts

import NodeCache from 'node-cache';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { SWRResponse } from 'swr';
import { PrismaClient } from '@prisma/client';

interface CacheServiceInterface {
  get<T>(key: string): Promise<T | undefined>;
  set<T>(key: string, value: T, ttl?: number): Promise<boolean>;
  delete(key: string): Promise<void>;
  deleteByPattern(pattern: string): Promise<void>;
  flush(): Promise<void>;
  wrapAxios(config: AxiosRequestConfig): Promise<AxiosResponse>;
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

  async get<T>(key: string): Promise<T | undefined> {
    return this.cache.get<T>(key);
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    if (ttl === undefined) {
      return this.cache.set(key, value);
    } else {
      return this.cache.set(key, value, ttl);
    }
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

  async wrapAxios(config: AxiosRequestConfig): Promise<AxiosResponse> {
    const cacheKey = JSON.stringify(config);
    const cachedResponse = await this.get<AxiosResponse>(cacheKey);

    if (cachedResponse) {
      return Promise.resolve(cachedResponse);
    }

    const response = await axios(config);
    await this.set(cacheKey, response);

    return response;
  }

  wrapPrisma<T extends PrismaClient>(prisma: T): T {
    const wrapper = new Proxy(prisma, {
      get: (target, prop) => {
        if (typeof target[prop] === 'function') {
          return async (...args: any[]) => {
            const cacheKey = JSON.stringify({ model: prop, args });
            const cachedResult = await this.get(cacheKey);

            if (cachedResult !== undefined) {
              return Promise.resolve(cachedResult);
            }

            const result = await target[prop](...args);
            await this.set(cacheKey, result);

            return result;
          };
        }
        return target[prop];
      },
    });

    return wrapper as T;
  }

  async wrapSWR<T>(key: string, fetcher: () => Promise<T>): Promise<SWRResponse<T>> {
    const cachedData = await this.get<T>(key);

    if (cachedData !== undefined) {
      return Promise.resolve({ data: cachedData, error: undefined });
    }

    try {
      const data = await fetcher();
      await this.set(key, data);
      return { data, error: undefined };
    } catch (error) {
      return { data: undefined, error };
    }
  }
}

export default CacheService.getInstance();

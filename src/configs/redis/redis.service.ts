import Redis from 'ioredis';
import { singleton } from 'tsyringe';
import { redisConfigOptions } from './redis.config';

@singleton()
export class RedisCache {
  private redis: Redis;
  constructor() {
    this.redis = new Redis(redisConfigOptions);
    this.redis.on('connect', () => {
      console.log('Redis connection established');
    });
    this.redis.on('error', (error) => {
      console.log(error);
    });
  }

  async set(key: string, value: any, expire: number = 300) {
    try {
      const serializedValue = JSON.stringify(value);
      await this.redis.set(key, serializedValue, 'EX', expire);
    } catch (error) {
      console.log(error);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.redis.get(key);
    if (value) {
      return JSON.parse(value);
    }
    return null;
  }

  async del(key: string) {
    return await this.redis.del(key);
  }

  async flushdb(): Promise<void> {
    await this.redis.flushdb();
  }

  getRedisInstance() {
    return this.redis;
  }
}

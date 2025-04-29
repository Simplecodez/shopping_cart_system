import Redis from 'ioredis';
import Redlock, { Lock } from 'redlock';
import { singleton } from 'tsyringe';
import { RedisCache } from './redis.service';

@singleton()
export class RedisLockService {
  private redlock: Redlock;

  constructor(private readonly redisClient: RedisCache) {
    this.redlock = new Redlock([this.redisClient.getRedisInstance()], {
      retryCount: 5,
      retryDelay: 200,
      retryJitter: 100
    });
  }

  async acquire(resource: string, ttl: number = 30000): Promise<Lock> {
    const lock = await this.redlock.acquire([`locks:${resource}`], ttl);
    return lock;
  }

  async release(lock: Lock): Promise<void> {
    await lock.release();
  }
}

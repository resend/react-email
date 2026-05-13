import IORedis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

type Limiter = Pick<RateLimiterRedis, 'consume'>;

const redisUrl = process.env.REDIS_URL;
if (!redisUrl) {
  throw new Error('REDIS_URL is required');
}

const redis = new IORedis(redisUrl, {
  retryStrategy: (times) => {
    if (times > 3) {
      console.error(
        '[REDIS] Connection failed too many times, not retrying (send-test)',
      );
      return null;
    }
    return Math.min(times * 50, 2000);
  },
}).on('error', (error) => {
  console.error('[REDIS] Caught error event', error);
});

export const sendTestIpRatelimit = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'react-email:send-test:ip',
  points: 3,
  duration: 60,
});

export const sendTestRecipientRatelimit = new RateLimiterRedis({
  storeClient: redis,
  keyPrefix: 'react-email:send-test:recipient',
  points: 2,
  duration: 600,
});

/**
 * Wraps RateLimiterRedis#consume so the route handler can stay branch-light.
 * Fails open if the Redis client itself errors (network, auth, etc.) so a Redis
 * incident doesn't take down the legitimate Send button — the Layer-1 firewall
 * still gates volume.
 */
export async function tryConsume(
  limiter: Limiter,
  key: string,
): Promise<{ allowed: boolean }> {
  try {
    await limiter.consume(key);
    return { allowed: true };
  } catch (err) {
    if (err instanceof Error) {
      console.error('[rate-limiter] Redis error, failing open', err);
      return { allowed: true };
    }
    return { allowed: false };
  }
}

import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL
});

redisClient.on('error', (err) => console.error('Redis error:', err));

export const aiRateLimiter = rateLimit({
  store: new RedisStore({
    client: redisClient,
    prefix: 'limit:ai:'
  }),
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // 50 requests/hour/user
  keyGenerator: (req) => req.user.id,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many AI requests',
      limit: req.rateLimit.limit,
      remaining: req.rateLimit.remaining
    });
  }
});
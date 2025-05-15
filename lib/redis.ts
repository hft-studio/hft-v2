import Redis from 'ioredis';

if (!process.env.KV_URL) {
    throw new Error('REDIS_URL is not defined');
}

export const redis = new Redis(process.env.KV_URL, {
    maxRetriesPerRequest: 5,
    retryStrategy: (times: number) => {
        if (times > 3) {
            return null;
        }
        return Math.min(times * 100, 3000);
    },
});

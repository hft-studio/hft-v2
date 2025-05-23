import { expect, test } from "bun:test";

test('should return 401 if the access token is invalid', async () => {
    const response = await fetch('http://localhost:3000/api/cron/pools', {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${'not-the-key'}`,
            'Content-Type': 'application/json'
        }
    });
    expect(response.status).toBe(401);
}); 
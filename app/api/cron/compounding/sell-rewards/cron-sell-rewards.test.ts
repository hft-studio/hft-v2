import { expect, test } from "bun:test";
import { getBaseUrl } from "@/lib/utils";

const baseUrl = getBaseUrl();

test('should return 401 if the access token is invalid', async () => {
    const response = await fetch(`${baseUrl}/api/cron/compounding/sell-rewards`, {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${'not-the-key'}`,
            'Content-Type': 'application/json'
        }
    });
    expect(response.status).toBe(401);
}); 
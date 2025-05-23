import { getBaseUrl } from "@/lib/utils";
import { expect, test } from "bun:test";

const API_KEY = process.env.CRON_SECRET
if (!API_KEY) {
	throw new Error("CRON_SECRET is not defined");
}

const baseUrl = getBaseUrl();

test.skip('should return 401 if the access token is invalid', async () => {
    const response = await fetch(`${baseUrl}/api/cron/compounding/claim-rewards`, {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${'not-the-key'}`,
            'Content-Type': 'application/json'
        }
    });
    
    expect(response.status).toBe(401);
});

test('should return 200 if the access token is valid', async () => {
        const response = await fetch(`${baseUrl}/api/cron/compounding/claim-rewards`, {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    
    expect(response.status).toBe(200);
});

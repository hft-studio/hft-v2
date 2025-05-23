import { expect, test } from "bun:test";
import { getBaseUrl } from "@/lib/utils";

const baseUrl = getBaseUrl();

test('should return 401 if the access token is invalid', async () => {
    const response = await fetch(`${baseUrl}/api/workflows/sell-rewards`, {
        method: 'POST',
        headers: {
            'x-access-token': 'not-the-key',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userId: 'c064667a-bb9f-4e10-afd6-0c2efd1fbfe2'
        })
    });
    expect(response.status).toBe(401);
});


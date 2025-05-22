import { expect, test } from "bun:test";
import { getBaseUrl } from "@/lib/utils";   

const baseUrl = getBaseUrl();

test('should return 401 if the access token is invalid', async () => {
    const response = await fetch(`${baseUrl}/api/workflows/claim-rewards`, {
        method: 'POST',
        headers: {
            'x-access-token': `${'not-the-key'}`,
            'Content-Type': 'application/json'
        }
    });
    expect(response.status).toBe(401);

});


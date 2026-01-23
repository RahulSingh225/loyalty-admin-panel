'use server'

const SUPERSET_URL = process.env.SUPERSET_URL || 'http://10.0.1.216:8088';
const SUPERSET_USERNAME = process.env.SUPERSET_USERNAME || 'admin';
const SUPERSET_PASSWORD = process.env.SUPERSET_PASSWORD || 'admin';


export async function getSupersetGuestToken(dashboardId: string) {
    try {
        // 1. Login to get Access Token & Cookies
        const loginResponse = await fetch(`${SUPERSET_URL}/api/v1/security/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: SUPERSET_USERNAME,
                password: SUPERSET_PASSWORD,
                provider: 'db',
                refresh: true,
            }),
        });

        if (!loginResponse.ok) {
            console.error('Superset Login Failed', await loginResponse.text());
            throw new Error('Failed to login to Superset');
        }

        const loginData = await loginResponse.json();
        const accessToken = loginData.access_token;


        // Capture cookies from login response to pass to subsequent requests
        const cookies = loginResponse.headers.get('set-cookie');

        // 2. Fetch CSRF Token explicitly (More reliable than parsing cookies)
        const csrfResponse = await fetch(`${SUPERSET_URL}/api/v1/security/csrf_token/`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                ...(cookies ? { 'Cookie': cookies } : {}),
            },
        });

        let csrfToken = null;
        if (csrfResponse.ok) {
            const csrfData = await csrfResponse.json();
            csrfToken = csrfData.result;
        } else {
            console.warn('Failed to fetch CSRF token explicitily', await csrfResponse.text());
        }

        // 3. Get Guest Token
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        };

        if (cookies) {
            headers['Cookie'] = cookies;
        }

        if (csrfToken) {
            headers['X-CSRFToken'] = csrfToken;
        }


        const guestTokenResponse = await fetch(`${SUPERSET_URL}/api/v1/security/guest_token/`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                user: {
                    username: 'guest',
                    first_name: 'Guest',
                    last_name: 'User',
                },
                resources: [
                    {
                        type: 'dashboard', // embedded sdk works best with dashboards
                        id: dashboardId,
                    },
                ],
                rls: [],
            }),
        });

        if (!guestTokenResponse.ok) {
            console.error('Superset Guest Token Failed', await guestTokenResponse.text());
            throw new Error('Failed to get guest token');
        }

        const guestTokenData = await guestTokenResponse.json();

        return {
            token: guestTokenData.token,
            supsersetDomain: SUPERSET_URL
        };

    } catch (error) {
        console.error('Error fetching Superset token:', error);
        throw error;
    }
}


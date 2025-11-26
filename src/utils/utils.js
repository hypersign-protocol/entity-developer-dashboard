import config from '../config';
import EventBus from '../eventbus'

let isRefreshing = false;

export async function RequestHandler(url, method = 'GET', body = {}, headers = {}, retry = true) {

    if (!url) {
        throw new Error('url must be passed to RequestHandler')
    }

    const options = {
        method,
        credentials: 'include',
    }

    // headers
    const finalHeaders = { ...headers };
    const normalizedKeys = Object.keys(finalHeaders).map(key => key.toLowerCase());

    if (!normalizedKeys.includes('content-type')) {
        finalHeaders['Content-Type'] = 'application/json';
    }
    if (!normalizedKeys.includes('origin')) {
        finalHeaders['Origin'] = window.location.origin;
    }
    options['headers'] = finalHeaders;

    // body
    if (body && Object.keys(body).length > 0) {
        options['body'] = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const json = await response.json().catch(() => null);

    // ❗ check special cases (like 2FA)
    let message = "";

    if (Array.isArray(json?.message)) {
        message = json.message.join(", ");
    } else if (typeof json?.message === "string") {
        message = json.message;
    } else {
        message = "Unknown error";
    }

    if (!response.ok) {
        // 🚫 Don't refresh if 2FA is required
        if (message.includes("2FA authentication is required")) {
            EventBus.$emit("logoutAll");
            throw new Error("2FA authentication is required");
        }

        if (json.eror && Array.isArray(json.error.details) && json.error.details.length > 0) {
            throw new Error(json.error.details.join(", "));
        }

        // refresh logic
        if ((response.status === 401 || response.status === 403) && retry) {
            if (!isRefreshing) {
                isRefreshing = true;

                try {
                    const refreshRes = await fetch(
                        `${config.studioServer.BASE_URL}api/v1/auth/refresh`,
                        { method: 'POST', credentials: 'include' }
                    );

                    if (refreshRes.ok) {
                        return await RequestHandler(url, method, body, headers, false);
                    } else {
                        EventBus.$emit("logoutAll");
                        throw new Error("Session expired, please login again");
                    }
                } finally {
                    isRefreshing = false;
                }
            }
        }

        // default error
        throw new Error(message || `Request failed with status ${response.status}`);
    }

    return json ?? null;
}



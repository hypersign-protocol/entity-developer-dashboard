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

    if (headers && Object.keys(headers).length > 0) {
        headers["content-type"] = "application/json"
        headers['Origin'] = window.location.origin

        options['headers'] = headers;
    }

    if (body && Object.keys(body).length > 0) {
        options['body'] = JSON.stringify(body)
    }
    const response = await fetch(url, {
        ...options
    })

    const json = await response.json();

    // error handling
    if (!response.ok) {
        if ((response.status === 401 || response.status === 403) && retry) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const refreshRes = await fetch(`${config.studioServer.BASE_URL}api/v1/auth/refresh`, {
                        method: 'POST',
                        credentials: 'include',
                    });

                    if (refreshRes.ok) {
                        return await RequestHandler(url, method, body, headers, false);
                    } else {
                        throw new Error(refreshRes?.message?.[0]?.message || `Refresh failed with status ${refreshRes.status}`)
                    }
                } catch (e) {
                    if (e?.message?.includes("403")) {
                        EventBus.$emit("logoutAll");
                        throw new Error("Unauthorized, please try login again");
                    } else if (e?.message?.includes("401")) {
                        EventBus.$emit("logoutAll");
                        throw new Error("Unauthenticated, please try login again");
                    } else {
                        throw new Error(e?.message || "Error during token refresh");
                    }
                } finally {
                    isRefreshing = false;

                }
            }
        }
    }
    // success handling
    if (json) {
        return json;
    } else {
        return null
    }
}
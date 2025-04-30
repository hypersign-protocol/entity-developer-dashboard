export async function RequestHandler(url, method = 'GET', body = {}, headers = {}) {

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
        console.log({ ok: response.ok, status: response.status })
        if (response.status != 200) {

            if (response.status == 403) {
                throw new Error("Unauthorized, please try login again")
            }

            if (response.status == 401) {
                throw new Error("Unauthenticated, please try login again")
            }

            if (json.error) {
                const erro = json.message[0].message
                throw new Error(erro)
            } else {
                // throw new Error(response.status)
                throw new Error(response.status)
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
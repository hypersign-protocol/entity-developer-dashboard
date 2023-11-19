function sanitizeUrl(url, shouldEndWithSlash = false) {
    if (!url) {
        throw new Error('Please pass a valid url')
    }

    const isUrlEndsWithSlash = url.substr(url.length - 1) === '/'

    if (shouldEndWithSlash) {
        if (!isUrlEndsWithSlash) {
            return url + "/"
        }
    } else {
        if (isUrlEndsWithSlash) {
            return url.substr(0, url.length - 1)
        }
    }
    return url;
}

module.exports = {
    sanitizeUrl
}

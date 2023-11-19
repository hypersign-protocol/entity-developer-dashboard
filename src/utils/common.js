function sanitizeUrl(url) {
    if (!url) {
        throw new Error('Please pass a valid url')
    }

    if (url.substr(url.length - 1) === '/') {
        return url.substr(0, url.length - 1)
    }

    return url;
}

module.exports = {
    sanitizeUrl
}

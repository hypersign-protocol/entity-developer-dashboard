export default {
    methods: {
        toDateTime(d) {
            const newDate = new Date(d)
            const date = newDate.toDateString()
            const hh = newDate.getHours()
            const mm = newDate.getMinutes()
            const ss = newDate.getSeconds()
            return date + ' ' + hh + ':' + mm + ':' + ss
        },
        getHeader(authToken = '') {
            if (authToken != '') {
                // TODO: Remove this userId later
                return {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${authToken}`,
                }
            } else {
                return {
                    "Content-Type": "application/json",
                }
            }
        },
        stringShortner(str, size) {
            if (!str) {
                return "-"
            }
            const l = str.length


            if (l > size) {
                const f = str.substr(0, Math.floor(size / 2))
                const m = '...'
                const last = str.substr(l - ((f).length), l)
                return f + m + last;
            } else {
                return str;
            }

        },
        copyToClip(textToCopy, contentType) {
            if (textToCopy) {
                navigator.clipboard
                    .writeText(textToCopy)
                    .then(() => {
                        this.notifySuccess(
                            `${contentType} copied!`
                        );
                    })
                    .catch((err) => {
                        this.notifyErr(
                            'Error while copying',
                            err
                        );
                    });
            }
        },
        shorten(str) {
            if (!str || str === 'undefined') {
                return ""
            }
            if (str.length <= 8) {
                return str
            }
            const f = str.substr(0, 8)
            const m = "..."
            const l = str.substr(str.length - 8, 8);
            return f + m + l;
        },
        truncate(str, limit) {
            if (!str) {
                return
            }

            if (!limit) {
                return
            }

            // if less than limit then do nothing
            if (str.length <= limit) {
                return str;
            }

            const eachLen = Math.floor(limit / 3); //  we need to 3 parts
            const firstPart = str.substr(0, eachLen);
            const lastPart = str.slice(-eachLen);
            return firstPart + " ... " + lastPart;
        },
        fetchData(url) {
            fetch(url)
                .then((res) => res.json())
                .then((j) => {
                    if (j.status != 200) throw new Error(j.error);
                    return j.message;
                })
                .catch((e) => this.notifyErr(`Error: ${e.message}`));
        },
        notifySuccess(msg) {
            this.$notify({
                group: 'foo',
                title: 'Information',
                type: 'success',
                text: msg
            });
        },
        notifyErr(msg) {
            this.$notify({
                group: 'foo',
                title: 'Error',
                type: 'error',
                text: msg
            });
        },
        formatDate(dateString) {
            return new Date(dateString).toLocaleString('en-us')
        },
        getStatus(sessionDetails) {
            // Sucess, Expired, Pending
            const { expiresAt, step_finish } = sessionDetails

            if (step_finish == 1) {
                return '<span class="badge badge-pill badge-success">Success</span>'
            }

            if (!expiresAt) {
                // Fall back for those record where expiry data not present
                return '<span class="badge badge-pill badge-danger">Expired<span>'
            }

            const now = Date.now()
            const expireDateTime = (new Date(expiresAt)).getTime()
            let hasExpired = false
            if (now > expireDateTime) {
                hasExpired = true;
            }

            if ((step_finish == 0) && hasExpired) {
                return '<span class="badge badge-pill badge-danger">Expired<span>'
            }

            if ((step_finish == 0) && !hasExpired) {
                return '<span class="badge badge-pill badge-warning">Pending<span>'
            }

        }
    }
}

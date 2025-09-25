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

        warnUsers(toaster, variant = 'warning', append = false) {
            this.$bvToast.toast(`This is an experimental feature. Kindly use only for testing purposes.`, {
                title: `⚠️ Warning!`,
                toaster: toaster,
                solid: false,
                variant,
                appendToast: append,
            })
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
        getKycServiceHeader(authToken = '') {
            if (authToken != '') {
                // TODO: Remove this userId later
                return {
                    "Content-Type": "application/json",
                    "x-kyc-access-token": `${authToken}`,
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
        getProfileIcon(name) {
            return "https://api.dicebear.com/7.x/identicon/svg?seed=" + name;
        },
        formatTimeRemaining(targetDate) {
            if (!targetDate || isNaN(new Date(targetDate).getTime())) {
                return 'InActive';
            }
            const now = new Date(); // Get current date
            const expiry = new Date(targetDate); // Convert target date to Date object
            const diffInSeconds = Math.floor((expiry - now) / 1000); // Get the difference in seconds
            // If the target date is in the past
            if (diffInSeconds <= 0) {
                return 'Expired';
            }

            // Time unit conversions
            const months = Math.floor(diffInSeconds / (30 * 24 * 60 * 60)); // Approximate months
            const days = Math.floor((diffInSeconds % (30 * 24 * 60 * 60)) / (24 * 60 * 60)); // Remaining days
            const hours = Math.floor((diffInSeconds % (24 * 60 * 60)) / (60 * 60)); // Remaining hours
            const minutes = Math.floor((diffInSeconds % (60 * 60)) / 60); // Remaining minutes
            const seconds = diffInSeconds % 60; // Remaining seconds

            // Format the output string
            return `${months > 0 ? months + ' month ' : ''}${days > 0 ? days + ' day ' : ''}${hours} hr ${minutes} min ${seconds} sec`;
        },

        getUserStatus(status) {
            // Sucess, Expired, Pending
            if (status == 'Success') {
                return `<span class="badge badge-pill p-2 badge-outline-success">
  <i class="mdi mdi-check-circle-outline mr-1"></i>
  Approved
</span>`
            }

            if (status == 'Failed') {
                return `<span class="badge badge-pill badge-outline-danger p-2">
  <i class="mdi mdi-close-circle-outline mr-1"></i>
  Rejected
</span>`
            }

            if (status == 'Expired') {
                return `<span class="badge badge-pill badge-outline-secondary p-2">
  <i class="mdi mdi-clock-remove-outline mr-1"></i>
  Expired
</span>`
            }

            if (status == 'Pending') {
                return `<span class="badge badge-pill badge-outline-warning p-2">
  <i class="mdi mdi-timer-sand mr-1"></i>
  Pending
</span>`
            }

            return `<span class="badge badge-pill badge-outline-warning p-2">
  <i class="mdi mdi-timer-sand mr-1"></i>
  Pending
</span>`
        },

        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        async generateSHA256Hash(text) {
            const encoder = new TextEncoder();
            const data = encoder.encode(text);
            const hashBuffer = await crypto.subtle.digest('SHA-256', data);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex;
        },
        getStatus(sessionDetails) {
            // Sucess, Expired, Pending
            const { expiresAt, step_finish, ocriddocsDetails, selfiDetails } = sessionDetails

            if (step_finish == 1) {
                return '<span class="badge badge-pill badge-success">Success</span>'
            }


            if (selfiDetails && Object.keys(selfiDetails).length > 0 && selfiDetails.serviceLivenessResult != 3) {
                // Fall back for those record where expiry data not present
                return '<span class="badge badge-pill badge-danger">Failed<span>'
            }

            if (ocriddocsDetails && Object.keys(ocriddocsDetails).length > 0 && ocriddocsDetails.serviceFacialAuthenticationResult != 3) {
                // Fall back for those record where expiry data not present
                return '<span class="badge badge-pill badge-danger">Failed<span>'
            }

            if (!expiresAt) {
                // Fall back for those record where expiry data not present
                return '<span class="badge badge-pill badge-secondary">Expired<span>'
            }

            const now = Date.now()
            const expireDateTime = (new Date(expiresAt)).getTime()
            let hasExpired = false
            if (now > expireDateTime) {
                hasExpired = true;
            }

            if ((step_finish == 0) && hasExpired) {
                return '<span class="badge badge-pill badge-secondary">Expired<span>'
            }

            if ((step_finish == 0) && !hasExpired) {
                return '<span class="badge badge-pill badge-warning">Pending<span>'
            }

        }
    }
}

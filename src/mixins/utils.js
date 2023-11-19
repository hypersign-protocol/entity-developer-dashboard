export default {
    methods: {
        getHeader(authToken = ''){
            if(authToken != ''){
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
        copyToClip(textToCopy,contentType, isapiKeySecret = false) {
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
        shorten(str){
            if(!str || str === 'undefined'){
                return ""
            }
            if(str.length <= 8){
                return str
            }
            const f = str.substr(0,8)
            const m = "..."
            const l = str.substr(str.length - 8, 8);
            return f+m+l;
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
        notifySuccess(msg){
            this.$notify({
              group: 'foo',
              title: 'Information',
              type: 'success',
              text: msg
            });
        },
        notifyErr(msg){
          this.$notify({
              group: 'foo',
              title: 'Error',
              type: 'error',
              text: msg
            });
        },
    }
}

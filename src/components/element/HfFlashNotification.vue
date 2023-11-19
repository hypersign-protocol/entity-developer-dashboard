<template>
    <div class="notificaiton" @click="copyToClip(text, type)" :title='`Copy ${type}`'>
        <div class="text">
            <span>{{ truncate(text, 90)}}  </span>
            <span><i class="far fa-copy copy"></i></span>
        </div>
        <small v-if="description != ''" class="description">{{  description }}</small>
    </div>
</template>
<style scoped>
.notificaiton{
    margin-bottom: 10px;
    border: 0.3px solid #80808040;
    padding: 10px;
    width: 100%;
    background-color: #e6ffec;
    border-radius: 10px;
    cursor: pointer;
    color: grey
}
.copy{
    float: right;
    font-size: 30px;
    color: grey;
    padding: 4px;
}
.description{
    color: #ff1717d4
}

.text{
    font-size: large;
}
</style>

<script>
import UtilsMixin from '../../mixins/utils';

export default {
    props: {
        text: String,
        type: String,
        description: {
            required: false,
            type: String,
        }
    },
    methods: {
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
    },
    mixins: [UtilsMixin]

}
</script>
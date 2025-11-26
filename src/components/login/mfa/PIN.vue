<template>
    <form class="row">
        <v-otp-input
        v-model="otp"
        @finish="done"
      ></v-otp-input>
    </form>
</template>

<script>
// import EventBus from '../../../eventbus';

export default {
    name: 'PIN',
    props: {
        inputType: {
            default: 'text',
            type: String
        }
    },
    data() {
        return {
            otp: "",
            loading: false,
        };
    },
    methods: {
        gotoInput(num) {
            const input = this.$refs["input" + num];
            input.select();
            input.focus();
        },
        done() {
            this.loading = true
            this.$emit('pinTakenEvent', this.otp)
        },
        selectInput(num) {
            this.$refs["input" + num].select();
        },
        backToInput(num) {
            this["pin" + num + 1] = "";
            this.gotoInput(num);
        }
    }
};
</script>

<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

/* Firefox */
input[type=number] {
    -moz-appearance: textfield;
}

input {
    font-size: 20px;
    width: 50px;
    margin-right: 10px;
    text-align: center;
}

.info {
    font-size: 16px;
}

div {
    margin-top: 16px;
    font-size: 24px;
}
</style>
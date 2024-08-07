<template>
    <form class="row center">
        <input class="col" :type="inputType" ref="input1" maxlength="1" v-model="pin1" @keyup.exact="gotoInput(2)"
            @keyup.exact.backspace="backToInput(1)" @focus="selectInput(1)">
        <input class="col" :type="inputType" ref="input2" maxlength="1" v-model="pin2" @keyup.exact="gotoInput(3)"
            @keyup.exact.backspace="backToInput(1)" @focus="selectInput(2)">
        <input class="col" :type="inputType" ref="input3" maxlength="1" v-model="pin3" @keyup.exact="gotoInput(4)"
            @keyup.exact.backspace="backToInput(2)" @focus="selectInput(3)">
        <input class="col" :type="inputType" ref="input4" maxlength="1" v-model="pin4" @keyup.exact="gotoInput(5)"
            @keyup.exact.backspace="backToInput(3)" @focus="selectInput(4)">
        <input class="col" :type="inputType" ref="input5" maxlength="1" v-model="pin5" @keyup.exact="gotoInput(6)"
            @keyup.exact.backspace="backToInput(4)" @focus="selectInput(5)">
        <input class="col" :type="inputType" ref="input6" maxlength="1" v-model="pin6" @keyup.exact="done"
            @keyup.exact.backspace="backToInput(5)" @focus="selectInput(6)">
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
            pin1: "",
            pin2: "",
            pin3: "",
            pin4: "",
            pin5: "",
            pin6: ""
        };
    },

    computed: {
        pins() {
            return this.pin1 + this.pin2 + this.pin3 + this.pin4 + this.pin5 + this.pin6;
        }
    },

    mounted() {
        this.$refs.input1.focus();

        // EventBus.$on('clearPINs', () => {
        //     console.log('Inside clearPINs event handler')
        //     this.pin1 = "";
        //     this.pin2 = "";
        //     this.pin3 = "";
        //     this.pin4 = "";
        //     this.pin5 = "";
        //     this.pin6 = "";

        // })
    },

    methods: {
        gotoInput(num) {
            const input = this.$refs["input" + num];
            input.select();
            input.focus();
        },
        done() {
            this.$emit('pinTakenEvent', this.pins)
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
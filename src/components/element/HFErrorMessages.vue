<template>
    <div class="m" v-if="message">
        {{  message }} <span class="cross"><i  @click="remove"  class="fa fa-times" aria-hidden="true"></i></span>
    </div>
</template>

<style scoped>
.cross{
    float: right;
    cursor: pointer;
    padding: 2px;
    
    width: 30px;
    align-content: center;
    text-align: center;
}
.cross:hover{
    background-color: grey;
    font-weight: bold;
    color: white;
    border-radius: 5px;
}
.m{ 
    border:  1px solid #80808070;
    border-radius: 5px;
    word-wrap: break-word;
    height: 50px;
    text-align: left;
    margin: 0;
    background-color: rgb(243 131 131 / 36%);
    padding: 10px;
    color: rgb(251, 92, 92);
    font-size: large;
    margin-bottom: 3px;
}
</style>

<script>

export default {
    props: {
        message: {
            type: String,
            required: false
        }
    },
    created(){

    },
    methods :{
        remove(event){
            document.getElementById(event.target.id).parentElement.parentElement.remove();
        }
    }

}
</script>
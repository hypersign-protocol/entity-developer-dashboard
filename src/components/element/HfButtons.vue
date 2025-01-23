<template>
  <v-btn  :class="customClass ? `${customClass}` : 'btn button-theme'"
  :title="title"
  depressed
  @click="emitExecuteAction()"
  >
  <span v-if="iconClass">
    <i :class="iconClass" v-if="bIcon==false"></i>
    <b-icon :icon="iconClass" :animation="animate" v-else></b-icon>
  </span>  
  {{name}} 
  </v-btn>
</template>

<script>
export default {
    props:{
      bIcon:{
        type: Boolean,
        require: false,
        default: false
      },
      animate:{
        type: String,
        require: false,
        default: ''},
      name:{
        type: String,
        require:true
      },
      iconClass: {
        type: String,
        require: false
      }, 
      customClass:{
        type:String,
        require:false,
        default: 'btn btn-outline-secondary'
      },
      title:{
        type:String,
        require:false
      }
    },
    computed:{
    //   buttonThemeCss() {
    //   return {
    //     '--button-bg-color': config.app.buttonBgColor,
    //     '--button-text-color':config.app.buttonTextColor
    //   }
    //  },
    },
    methods:{
      emitExecuteAction(){
        this.$emit("executeAction")          
      },
    }
};
</script>

<style >
/* .button-theme {
  background-color:  var(--button-bg-color);
  border-collapse:  var(--button-bg-color);
  color: var(--button-text-color);
  border: 0;
  
}

.button-theme:hover{
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
  background:aliceblue !important;
  border: 1px solid #905ab0 !important;
  color: #905ab0 !important;
} */
</style>

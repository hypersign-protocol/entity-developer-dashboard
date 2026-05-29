<template>
  <v-btn  :class="customClass ? `${customClass}` : 'btn button-theme'"
  :title="title"
  depressed
  @click="emitExecuteAction()"
  >
    <v-icon v-if="isMdi" small left>{{ mdiIconName }}</v-icon>
    <i v-else-if="iconClass" :class="iconClass" class="hf-fa-icon" aria-hidden="true"></i>
    <span v-if="name" class="hf-btn-text">{{ name }}</span>
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
        require:false,
        default: ''
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
    
    computed: {
      isMdi() {
        return this.iconClass && (this.iconClass.startsWith('mdi') || this.iconClass.startsWith('mdi-'));
      },
      mdiIconName() {
        if (!this.iconClass) return '';
        const parts = this.iconClass.split(' ');
        // prefer token that starts with 'mdi-'
        const mdiDash = parts.find(p => p.startsWith('mdi-'));
        if (mdiDash) return mdiDash;
        // otherwise if 'mdi' exists, try to return next token that starts with 'mdi-'
        const mdiIndex = parts.findIndex(p => p === 'mdi');
        if (mdiIndex >= 0 && parts[mdiIndex + 1]) return parts[mdiIndex + 1];
        return parts[0] || '';
      }
    },
    methods:{
      emitExecuteAction(){
        this.$emit("executeAction")          
      },
    }
};
</script>

<style>
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

.hf-fa-icon {
  font-family: "Font Awesome 5 Free", "Font Awesome 5 Brands" !important;
  font-weight: 900 !important;
  font-style: normal !important;
  display: inline-block !important;
  margin-right: 6px !important;
  line-height: 1 !important;
}

.hf-btn-text {
  margin-left: 2px;
}
</style>

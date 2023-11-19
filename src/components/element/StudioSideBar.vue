
<template>
    <div>
      <b-sidebar id="sidebar-right" width="40%" :title="title" right shadow backdrop no-close-on-backdrop>
        <slot />
      </b-sidebar>
    </div>
</template>




<script>
export default {
    props: {
      title: {
                type: String,
                required: true 
        }
    },
  };
  </script>

  

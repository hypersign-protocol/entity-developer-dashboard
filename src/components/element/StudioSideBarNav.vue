<template>
  <div id="sidebar-right">
    <div class="d-flex align-items-center px-2 py-3">
      <div class="rounded-circle overflow-hidden border" style="width:40px;height:40px;flex-shrink:0">
        <img :src="avatar" class="w-100 h-100" style="object-fit:cover" />
      </div>
      <div class="ml-2 font-weight-bold small">{{ service_name }}</div>
    </div>

    <hr class="my-1" />

    <ul class="list-unstyled px-2">
      <li v-for="menu in menus" :key="menu.title" class="py-2 d-flex align-items-center">
        <i :class="menu.icon" class="mr-2"></i>
        <span>{{ menu.title }}</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
    name: "StudioSideBarNav",
    props: {
      menus: {
        type: Array,
        required: true
      },
      avatar: {
        type: String,
        required: true 
      },
      service_name: {
        type: String,
        required: true 
      }
    },
  };
  </script>

  

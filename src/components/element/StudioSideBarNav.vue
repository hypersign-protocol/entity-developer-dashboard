<template>
  <v-navigation-drawer
    expand-on-hover
    id="sidebar-right"
  >
    <v-list>
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-img :src="avatar"></v-img>
        </v-list-item-avatar>
      </v-list-item>

      <v-list-item link>
        <v-list-item-content>
          <v-list-item-title class="text-h6">
            {{ service_name }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list
      nav
      dense
    >
    <v-list-item link v-for="menu in menus" v-bind:key="menu.title">
        <v-list-item-icon>
          <v-icon>{{ menu.icon }}</v-icon>
        </v-list-item-icon>
        <v-list-item-title>{{ menu.title }}</v-list-item-title>
    </v-list-item>
    </v-list>
  </v-navigation-drawer>
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

  

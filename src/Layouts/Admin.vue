<template>
  <div class="min-h-screen h-screen flex layout-bg">
    <sidebar
      :sidebarVisible="sidebarVisible"
      @toggleSidebar="toggleSidebar"
    ></sidebar>
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <navbar @toggleSidebar="toggleSidebar"></navbar>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Navbar from '@/Components/layout/admin/navbar';
import Sidebar from '@/Components/layout/admin/sidebar';

export default {
  name: 'admin',
  components: { Sidebar, Navbar },
  data() {
    return {
      sidebarVisible: false,
    };
  },
  computed: {
    user() {
      return this.$store.getters['app/getUser'];
    },
  },
  metaInfo() {
    return {
      title: this.$i18n.t('Admin Area'),
      titleTemplate: `%s - ${this.$store.getters['app/getAppName']}`,
    };
  },
  methods: {
    toggleSidebar(force = null) {
      if (force !== null) {
        this.sidebarVisible = force;
      } else {
        this.sidebarVisible = !this.sidebarVisible;
      }
    },
  },
};
</script>

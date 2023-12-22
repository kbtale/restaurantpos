<template>
  <div class="min-h-screen flex layout-bg">
    <div class="flex flex-col w-0 flex-1">
      <navbar></navbar>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Navbar from '@/Components/layout/shared/navbar';

export default {
  name: 'public',
  metaInfo() {
    return {
      title: this.$i18n.t('Welcome'),
      titleTemplate: `%s - ${this.$store.getters['app/getAppName']}`,
    };
  },
  components: { Navbar },
};
</script>

<template>
  <router-link :class="mobile ? 'router-link router-link-mobile' : 'router-link router-link-desktop'" :to="to">
    <svg-vue :icon="icon" class="mx-3 w-5 h-5 transition ease-in-out duration-150"></svg-vue>
    {{ label }}
  </router-link>
</template>
<script>
export default {
  name: 'menu-item',
  props: {
    mobile: {
      type: Boolean,
      default: false,
    },
    to: {
      type: String,
      require: true,
    },
    icon: {
      type: String,
      require: true,
    },
    label: {
      type: String,
      require: true,
    },
  },
};
</script>

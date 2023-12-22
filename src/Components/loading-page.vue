<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <vue-element-loading :active="status" size="40" spinner="ring" color="#0d546a" :is-full-screen="fullPage"></vue-element-loading>
</template>
<script>
export default {
  name: 'Loading',
  props: {
    status: {
      type: Boolean,
      required: true,
      default: true,
    },
    fullPage: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    status(value) {
      value ? this.$nprogress.start() : this.$nprogress.done();
    },
  },
};
</script>

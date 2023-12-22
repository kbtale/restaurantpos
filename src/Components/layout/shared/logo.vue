<template>
  <div :class="divPadding" class="flex items-center">
    <img :src="logo" alt="icon" class="h-10 w-auto mx-2 rounded-md" />
    <div :class="textClass" class="inline-block font-semibold uppercase">
      {{ name }}
    </div>
  </div>
</template>
<script>
export default {
  name: 'logo',
  props: {
    divPadding: {
      type: String,
      default: 'px-4',
      required: false,
    },
    textClass: {
      type: String,
      default: 'text-white font-semibold',
      required: false,
    },
  },
  computed: {
    name() {
      return this.$store.getters['app/getAppName'];
    },
    logo() {
      return this.$store.getters['app/getAppLogo'];
    },
  },
};
</script>

<template>
  <div class="mt-1 flex">
    <div
      id="input"
      :class="input ? 'bg-cyan-900' : 'bg-gray-200'"
      aria-checked="false"
      class="relative h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline"
      role="checkbox"
      tabindex="0"
      @click="check"
    >
      <div
        :class="input ? (isRTL ? '-translate-x-5' : 'translate-x-5') : 'translate-x-0'"
        aria-hidden="true"
        class="inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200"
      ></div>
    </div>
    <div class="ml-3 text-sm text-gray-500">
      <small v-if="input">{{ enabledLabel }}</small>
      <small v-else>{{ disabledLabel }}</small>
    </div>
  </div>
</template>
<script>
export default {
  name: 'input-switch',
  props: {
    value: {
      required: false,
    },
    id: {
      type: String,
      required: true,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    enabledLabel: {
      type: String,
      required: true,
    },
    disabledLabel: {
      type: String,
      required: true,
    },
  },

  computed: {
    isRTL() {
      return this.$store.getters['app/getSettings'].app_direction == 'rtl' ? true : false;
    },
    input: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      },
    },
  },
  methods: {
    check() {
      if (!this.readonly) {
        this.input = !this.input;
      }
    },
  },
};
</script>

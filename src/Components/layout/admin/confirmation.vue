<template>
  <div class="fixed z-20 inset-0 overflow-y-auto" v-show="status">
    <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <transition
        duration="300"
        enter-active-class="ease-out duration-300"
        enter-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="ease-in duration-200"
        leave-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div class="fixed inset-0 transition-opacity" v-show="status">
          <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
      </transition>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
      <transition
        enter-active-class="ease-out duration-300"
        enter-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
        enter-to-class="opacity-100 translate-y-0 sm:scale-100"
        leave-active-class="ease-in duration-200"
        leave-class="opacity-100 translate-y-0 sm:scale-100"
        leave-to-class="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
      >
        <div
          aria-labelledby="modal-headline"
          aria-modal="true"
          class="inline-block align-bottom bg-white text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full rounded-md"
          role="dialog"
          v-show="status"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mx-auto flex-shrink-0 flex items-center justify-center h-20 w-20 bg-red-200 sm:mx-0 sm:h-10 sm:w-10">
                <svg-vue class="h-8 w-8 pb-1 text-red-600" icon="font-awesome.exclamation-triangle-light"></svg-vue>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
                  <slot name="title"></slot>
                </h3>
                <div class="mt-2">
                  <p class="text-sm leading-5 text-gray-500 mb-4">
                    <slot></slot>
                  </p>
                  <span class="text-sm text-red-600">{{ $t('This action cannot be undone') }}.</span>
                </div>
              </div>
            </div>
          </div>
          <div class="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse justify-between">
            <button @click="confirmed" class="btn btn-red" type="button">
              {{ $t('Yes Confirm') }}
            </button>
            <button @click="cancelled" class="btn btn-secondary" type="button">
              {{ $t('Cancel') }}
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  name: 'confirmation',
  data() {
    return {
      status: false,
    };
  },
  props: {
    show: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  watch: {
    show(value) {
      this.status = value;
    },
  },
  methods: {
    confirmed() {
      this.$emit('confirmed');
    },
    cancelled() {
      this.$emit('cancelled');
    },
  },
};
</script>

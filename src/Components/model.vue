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
          class="inline-block align-bottom bg-white rounded-md text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-top w-11/12 md:w-10/12 lg:w-8/12"
          role="dialog"
          v-show="status"
        >
          <div class="bg-white p-4">
            <div class="text-center sm:text-left">
              <slot></slot>
              <div class="cursor-pointer absolute top-0 right-0 mt-4 mr-5 text-gray-400 hover:text-gray-600 transition duration-150 ease-in-out" @click.prevent="close">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-label="Close"
                  class="icon icon-tabler icon-tabler-x"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  stroke-width="2.5"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  name: 'model',
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
    close() {
      this.$emit('close');
    },
  },
};
</script>

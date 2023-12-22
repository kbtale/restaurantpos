<template>
  <div class="py-20 flex">
    <div class="m-auto text-gray-500">
      <div class="grid grid-cols-1 justify-items-center h-full w-full">
        <div class="flex justify-center items-center">
          <svg-vue class="h-full h-auto w-24 mb-6" icon="undraw.browsing"></svg-vue>
        </div>
        <div class="flex justify-center items-center">
          <div class="w-full font-semibold">
            {{ $t('No record found in the system') }}
          </div>
        </div>
        <template v-if="search">
          <div class="flex text-sm justify-center items-center">
            {{ $t('Try changing the filters, or rephrasing your search') }}.
          </div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    search: { type: String|Object, default: null },
  },
};
</script>

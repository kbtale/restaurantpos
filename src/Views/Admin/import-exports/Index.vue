<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.recycle-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('Imports and exports') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <router-link class="btn btn-app" to="/admin">
            {{ $t('Back') }}
          </router-link>
        </div>
      </div>
    </div>
    <exports />
    <imports/>
  </main>
</template>
<script>
import Exports from '@/Views/Admin/Import-exports/Exports';
import Imports from '@/Views/Admin/Import-exports/Imports';

export default {
  name: 'ImportExport',
  metaInfo() {
    return {
      title: this.$i18n.t('Imports and exports'),
    };
  },
  components: {
    Exports,Imports
  },
};
</script>

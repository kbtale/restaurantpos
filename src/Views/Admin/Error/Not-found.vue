<template>
  <div class="min-h-screen bg-gray-100">
    <main class="flex-1 relative overflow-y-auto py-24 focus:outline-none" tabindex="0">
      <div class="h-full flex">
        <div class="mx-auto">
          <div class="text-center items-center p-6">
            <svg-vue class="h-full w-full md:h-64 mb-6" icon="undraw.page-not-found"></svg-vue>
            <div class="font-semibold text-2xl">
              {{ $t('Oops! You were not supposed to see this page') }}
            </div>
            <div>{{ $t('The page you are looking for actually does not exist') }}</div>
            <div class="mt-6">
              <router-link active-class class="btn btn-app" exact-active-class to="/admin">{{ $t('Go home') }}</router-link>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<script>
export default {
  name: 'not-found',
  metaInfo() {
    return {
      title: this.$i18n.t('Not found'),
    };
  },
};
</script>

<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.home-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('Welcome') }}
          </h1>
        </div>
      </div>
      <div class="max-w-1/6 mx-auto px-2 sm:px-6 lg:px-8">
        <div class="rounded-md w-full w-full p-3">
          <img class="sem-tool mx-auto rounded-md" src="/images/default/ki.jpg" />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'App',
};
</script>

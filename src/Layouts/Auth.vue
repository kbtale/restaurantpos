<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="bg-center bg-no-repeat bg-cover items-center" :style="{ backgroundImage: 'url(' + backgroundImage + ')' }">
    <div class="container mx-auto">
      <div class="h-full min-h-screen flex">
        <div class="m-auto w-full">
          <div class="flex justify-center">
            <div class="w-full rounded-md shadow-md max-w-md bg-white p-5">
              <div class="justify-center mb-8 md:flex items-center">
                <img :src="logoImage" :alt="appName" class="w-36 h-36" />
              </div>
              <loading class=" " :status="loading"></loading>
              <template v-if="isActive">
                <div class="text-gray-500 text-center mb-8">
                  <h3 class="font-semibold">{{ $t('Hello!') }} {{ activeUser.name }}</h3>
                  {{ $t('You are already logged in successfully.') }}
                </div>
                <div class="flex justify-between">
                  <router-link to="/" class="btn btn-app mt-2">{{ $t('Go to home') }}</router-link>
                  <button @click.prevent="signOut" class="btn btn-red mt-2">{{ $t('Logout') }}</button>
                </div>
              </template>
              <template v-else>
                <router-view />
              </template>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'auth',
  metaInfo() {
    return {
      titleTemplate: `%s - ${this.appName}`,
    };
  },
  data() {
    return {
      isActive: false,
      loading: false,
    };
  },
  watch: {
    activeUser(user) {
      this.loading = true;
      setTimeout(() => {
        this.isActive = user.id > 0;
        this.loading = false;
      }, 1500);
    },
  },
  computed: {
    appName() {
      return this.$store.getters['app/getAppName'];
    },
    logoImage() {
      return this.$store.getters['app/getAppLogo'];
    },
    backgroundImage() {
      return this.$store.getters['app/getAppBackground'];
    },
    activeUser() {
      return this.$store.getters['app/getUser'];
    },
  },
  methods: {
    signOut() {
      this.$store.dispatch('app/logout');
      this.$router.push('/auth/login');
    },
  },
};
</script>

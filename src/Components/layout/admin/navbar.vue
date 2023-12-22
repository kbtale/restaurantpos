<template>
  <div class="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
    <button @click="$emit('toggleSidebar')" aria-label="Open sidebar" class="px-4 text-gray-500 focus:outline-none focus:bg-gray-100 focus:text-gray-600 md:hidden">
      <svg-vue class="h-6 w-6" icon="font-awesome.bars-regular"></svg-vue>
    </button>
    <div class="w-full px-5 flex justify-end items-center">
      <div class="mx-2">
        <language-toggler />
      </div>

      <div class="flex">
        <div class="flex-1 flex items-center">
          <div class="relative" v-on-clickaway="closeDropdown">
            <button
              @click="dropdownOpen = !dropdownOpen"
              aria-haspopup="true"
              aria-label="User menu"
              class="max-w-xs flex items-center text-sm -full focus:outline-none focus:shadow-outline"
              id="user-menu"
            >
              <img :src="user.avatar === 'gravatar' ? user.gravatar : user.avatar" alt="User avatar" class="h-10 w-10 rounded-md" />
            </button>
            <transition
              duration="100"
              enter-active-class="transition ease-out duration-100"
              enter-class="transform opacity-0 scale-95"
              enter-to-class="transform opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75"
              leave-class="transform opacity-100 scale-100"
              leave-to-class="transform opacity-0 scale-95"
            >
              <div :class="isRTL ? 'left-0' : 'right-0'" class="origin-top-right bg-yellow-100 z-10 absolute mt-2 w-56 shadow-lg" v-show="dropdownOpen">
                <div aria-labelledby="user-menu" aria-orientation="vertical" class="py-1 bg-white shadow-xs" role="menu">
                  <div class="px-4 text-xs truncate text-right text-gray-500">{{ $store.getters['app/getVersion'] }} v</div>
                  <div class="flex items-center px-4 ce py-2 border-b border-gray-100">
                    <img :src="user.avatar === 'gravatar' ? user.gravatar : user.avatar" alt="User avatar" class="rounded-md h-8 w-8 mr-3 align-middle" />
                    <div class="w-40">
                      <div class="text-sm font-medium truncate text-gray-800">
                        {{ user.name }}
                      </div>
                      <div class="text-xs truncate text-gray-500">
                        {{ user.email }}
                      </div>
                    </div>
                  </div>
                  <template v-if="navLinks && navLinks.length > 0">
                    <div v-for="(link, index) in navLinks" :key="index">
                      <template v-if="link.is_blank">
                        <a
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                          role="menuitem"
                          target="_blank"
                          :href="link.url"
                        >
                          {{ link.label }}
                        </a>
                      </template>
                      <template v-else>
                        <router-link
                          @click.native="dropdownOpen = false"
                          class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                          role="menuitem"
                          :to="link.url"
                        >
                          {{ link.label }}
                        </router-link>
                      </template>
                    </div>
                  </template>
                  <a
                    @click.prevent="signOut"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                    href="/auth/logout"
                    rel="noopener"
                    role="menuitem"
                    >{{ $t('Sign out') }}</a
                  >
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mixin as clickaway } from 'vue-clickaway';

export default {
  name: 'navbar',
  mixins: [clickaway],
  data() {
    return {
      dropdownOpen: false,
    };
  },
  computed: {
    isRTL() {
      return this.$store.getters['app/getSettings'].app_direction == 'rtl' ? true : false;
    },
    user() {
      return this.$store.getters['app/getUser'];
    },
    navLinks() {
      return window.app.admin_nav_links;
    },
  },
  methods: {
    signOut() {
      this.dropdownOpen = false;
      this.$store.dispatch('app/logout');
      this.$router.push('/auth/login');
    },
    closeDropdown() {
      this.dropdownOpen = false;
    },
  },
};
</script>

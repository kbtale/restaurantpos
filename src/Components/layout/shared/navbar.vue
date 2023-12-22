<template>
  <nav class="bg-white text-yellow-400 shadow">
    <div class="max-w-1/5 mx-auto px-6 sm:px-8 lg:px-10">
      <div class="flex justify-between h-16">
        <logo></logo>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <div class="ml-3 relative">
            <template v-if="user">
              <div class="ml-3 relative" v-on-clickaway="closeDropdown">
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
                      <div class="flex items-center px-4 ce py-2 border-b border-gray-100">
                        <img :src="user.avatar === 'gravatar' ? user.gravatar : user.avatar" alt="User avatar" class="h-8 w-8 mr-3 align-middle -full" />
                        <div class="w-40">
                          <div class="text-sm font-medium truncate text-gray-800">
                            {{ user.name }}
                          </div>
                          <div class="text-xs truncate text-gray-500">
                            {{ user.email }}
                          </div>
                        </div>
                      </div>

                      <router-link
                        @click.native="dropdownOpen = false"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                        role="menuitem"
                        to="/"
                        >{{ $t('Home') }}</router-link
                      >
                      <router-link
                        v-if="isAdmin"
                        @click.native="dropdownOpen = false"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                        role="menuitem"
                        to="/admin/home"
                        >{{ $t('Admin area') }}</router-link
                      >
                      <router-link
                        @click.native="dropdownOpen = false"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                        role="menuitem"
                        to="/account"
                        >{{ $t('Account settings') }}</router-link
                      >
                      <a
                        @click.prevent="signOut"
                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
                        href="/auth/logout"
                        role="menuitem"
                        >{{ $t('Sign out') }}</a
                      >
                    </div>
                  </div>
                </transition>
              </div>
            </template>
          </div>
        </div>
        <div class="-mr-2 flex items-center sm:hidden">
          <button
            @click="menuOpen = !menuOpen"
            class="inline-flex items-center justify-center p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-gray-500 transition duration-150 ease-in-out"
          >
            <svg class="block h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M4 6h16M4 12h16M4 18h16" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
            <svg class="hidden h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M6 18L18 6M6 6l12 12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div class="sm:hidden" v-show="menuOpen">
      <div class="py-3 border-t border-gray-200">
        <template v-if="user">
          <div class="flex items-center px-4">
            <div class="flex-shrink-0">
              <img :src="user.avatar === 'gravatar' ? user.gravatar : user.avatar" alt="User avatar" class="rounded-md h-10 w-10 align-middle" />
            </div>
            <div class="ml-3">
              <div class="text-base font-medium leading-6 text-gray-800">
                {{ user.name }}
              </div>
              <div class="text-sm font-medium leading-5 text-gray-500">
                {{ user.email }}
              </div>
            </div>
          </div>
          <div aria-labelledby="user-menu" aria-orientation="vertical" class="mt-3" role="menu">
            <router-link
              @click.native="dropdownOpen = false"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
              role="menuitem"
              to="/admin"
              >{{ $t('Admin area') }}</router-link
            >
            <router-link
              @click.native="menuOpen = false"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
              role="menuitem"
              to="/account"
              >{{ $t('Account settings') }}</router-link
            >
            <a
              @click.prevent="signOut"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition ease-in-out duration-150"
              href="/auth/logout"
              role="menuitem"
              >{{ $t('Sign out') }}</a
            >
          </div>
        </template>
      </div>
    </div>
  </nav>
</template>
<script>
import { mixin as clickaway } from 'vue-clickaway';
import Logo from '@/Components/layout/shared/logo';

export default {
  name: 'navbar',
  components: { Logo },
  mixins: [clickaway],
  data() {
    return {
      menuOpen: false,
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
    isAdmin() {
      return this.user.role.admin_access;
    },
  },
  methods: {
    signOut() {
      this.menuOpen = false;
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

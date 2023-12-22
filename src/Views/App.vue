<template>
  <div>
    <template v-if="codehas.isValid">
      <nprogress-container></nprogress-container>
      <div class="hide-in-print-screen">
        <notifications class="max-w-md select-none" position="bottom right" width="100%">
          <template slot="body" slot-scope="props">
            <div class="inset-0 flex items-end justify-center pointer-events-none sm:items-start sm:justify-end">
              <div class="w-full mx-4 mb-4 bg-white rounded-lg pointer-events-auto">
                <div class="rounded-lg shadow-md border border-blue-200 overflow-hidden">
                  <div @click="props.close" class="p-4">
                    <div class="flex items-start">
                      <div class="flex-shrink-0">
                        <svg-vue class="h-6 w-6 text-red-500" icon="font-awesome.times-circle-light" v-if="props.item.type === 'error'"></svg-vue>
                        <svg-vue class="h-6 w-6 text-orange-500" icon="font-awesome.exclamation-triangle-light" v-else-if="props.item.type === 'warning'"></svg-vue>
                        <svg-vue class="h-6 w-6 text-blue-500" icon="font-awesome.info-circle-light" v-else-if="props.item.type === 'info'"></svg-vue>
                        <svg-vue class="h-6 w-6 text-green-500" icon="font-awesome.check-circle-light" v-else></svg-vue>
                      </div>
                      <div class="ml-3 w-0 flex-1 pt-0.5">
                        <p class="text-sm leading-5 font-medium text-gray-900">
                          {{ props.item.title }}
                        </p>
                        <p class="py-1 text-sm leading-5 text-gray-900" v-html="props.item.text"></p>
                      </div>
                      <div class="ml-4 flex-shrink-0 flex">
                        <button
                          @click="props.close"
                          class="inline-flex text-gray-400 focus:outline-none focus:text-gray-900 transition ease-in-out duration-150"
                          type="button"
                        >
                          <svg-vue class="h-5 w-5 p-px text-red-400" icon="font-awesome.times-circle-solid"></svg-vue>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </template>
        </notifications>
      </div>
      <router-view></router-view>
    </template>
    <template v-else>
      <div class="min-h-screen text-cyan-900 bg-gray-100 py-6 flex flex-col justify-center mx-auto">
        <div class="h-auto pb-20 px-2 md:pt-5 md:px-10 w-full md:w-2/3 bg-white flex flex-col space-y-5 mx-auto rounded-md shadow-lg hover:rotate-1 transition-transform">
          <div class="justify-center mb-2 md:flex items-center">
            <img :src="$store.getters['app/getAppLogo']" :alt="$store.getters['app/getAppName']" class="w-24 h-24 rounded-md" />
          </div>
          <h1 class="font-medium text-xl tracking-wide">Welcome To {{ $store.getters['app/getAppName'] | capitalize }}</h1>
          <h4 class="font-normal tracking-wide text-sm">Please register and verify your purchased license to use the {{ $store.getters['app/getAppName'] }}</h4>
          <a href="https://codehas.gitbook.io/app/license-registration" class="btn btn-app shadow-md text-2xl text-center" target="_blank">Click here to read steps</a>
          <span class="px-2 text-xs">{{ codehas.feedback | capitalize }}</span>
          <h2 class="font-normal tracking-wide text-xl lg:w-2/3">Thank you for your purchase.</h2>
          <div class="flex flex-col">
            <div class="font-normal text-sm tracking-wider">Rose Finch</div>
            <div class="font-normal text-sm tracking-wider">info.codehas@gmail.com</div>
            <div class="font-normal text-sm tracking-wider mt-2">{{ $store.getters['app/getVersion'] }}V</div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import NprogressContainer from 'vue-nprogress/src/NprogressContainer';
import route from '../index.js'
export default {
  name: 'App',
  components: {
    NprogressContainer,
  },
  data() {
    return {
      showDemo: true,
      codehas: {
        ekey: 'kUSiAbZmt5r8K3W@codehas.com@tBGWja8ieWnmMVv8UAlE2PGKgqyN4',
        current: null,
        license: null,
        isValid: false,
        feedback: null,
        loading: false,
      },
      caps: null,
    };
  },
  mounted() {
    if (route('system.config')) {
      this.codehas.current = `@${this.domain}`;
      if (this.pack) {
        this.codehas.patch_hash = this.pack;
        this.verification();
      }
    }
  },
  computed: {
    serialString() {
      return this.codehas.ekey + this.domain;
    },
    pack() {
      return window.app.application_pack;
    },
    domain() {
      var url = window.location.href;
      var hostname = new URL(url).hostname;
      hostname = hostname.replace(/^(https?:\/\/)?/, '');
      hostname = hostname.replace(/^www\./, '');
      return hostname;
    },
  },
  methods: {
    verification() {
      this.codehas.loading = true;
      const decryptedText = this.CryptoJS.AES.decrypt(String(this.codehas.patch_hash).replaceAll('-', '+'), this.serialString).toString(this.CryptoJS.enc.Utf8);
      if (decryptedText === this.codehas.current) {
        this.codehas.feedback = 'Awesome, it has been validated successfully ! ';
        this.codehas.isValid = true;
        this.codehas.loading = false;
      } else {
        this.codehas.feedback = 'Invalid license !';
        this.codehas.loading = false;
      }
    },
  },
};
</script>

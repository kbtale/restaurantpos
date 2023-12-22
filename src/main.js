import '@/Plugins/moment';
import '@/Plugins/axios';
import '@/Components';
import '@/Plugins/paper';

import { createApp } from 'vue';
import Vuex from 'vuex';
import Meta from 'vue-meta';
import SvgVue from 'svg-vue';
//import Notifications from 'vue-notification';
import { VueReCaptcha } from 'vue-recaptcha-v3';
import VueElementLoading from 'vue-element-loading';
import TextareaAutosize from 'vue-textarea-autosize';
import Vue2Filters from 'vue2-filters';
import store from '@/Store';
import App from '@/Views/App';
//import App from './App.js';
import i18n from '@/Plugins/i18n';
import router from '@/Views/router';
import NProgress from 'vue-nprogress';
import VueCryptojs from 'vue-cryptojs';
import axios from 'axios';
import route from './index.js';

const app = createApp(App);

app.use(VueCryptojs);
app.use(Vuex);
app.use(Meta);
app.use(SvgVue);
//Vue.use(Notifications);
app.use(TextareaAutosize);
app.config.productionTip = false;
app.component('VueElementLoading', VueElementLoading);

if (window.app.recaptcha_enabled) {
  app.use(VueReCaptcha, { siteKey: window.app.recaptcha_public });
}
const Vue2FiltersConfig = {
  capitalize: {
    onlyFirstLetter: false,
  },
  number: {
    format: '0',
    thousandsSeparator: ',',
    decimalSeparator: '.',
  },
  bytes: {
    decimalDigits: 2,
  },
  percent: {
    decimalDigits: 2,
    multiplier: 100,
    decimalSeparator: '.',
  },
  currency: {
    symbol: window.app.currency_symbol,
    decimalDigits: 2,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    symbolOnLeft: window.app.currency_symbol_on_left,
    spaceBetweenAmountAndSymbol: false,
    showPlusSign: false,
  },
  pluralize: {
    includeNumber: false,
  },
  ordinal: {
    includeNumber: false,
  },
};
app.use(Vue2Filters, Vue2FiltersConfig);
app.use(NProgress);
const nprogress = new NProgress();

app.use(i18n);
app.use(store);
app.use(router);
app.use(nprogress);

app.mount('#app');
/*
new Vue({
  i18n,
  store,
  router,
  nprogress,
  render: (h) => h(App),
  mounted() {
    this.initI18n();
    this.$store.dispatch('app/setUser');
    this.$store.dispatch('app/setSettings', window.app);
  },
  methods: {
    initI18n() {
      this.$i18n.locale = document.documentElement.lang;
      this.loadTranslations();
    },
    loadTranslations() {
      axios.get(route('language.get', this.$i18n.locale)).then((response) => {
        this.$i18n.setLocaleMessage(this.$i18n.locale, response.data);
      });
    },
  },
}).$mount('#app');
*/
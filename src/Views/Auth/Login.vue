<template>
  <div class=" ">
    <loading :status="loading"></loading>
    <form @submit.prevent="submit">
      <template v-if="isDemoMode">
        <div class="my-2 bg-green-200 py-3">
          <strong class="pl-5">Click to login as below while demo mode &#128512;</strong>
          <div class="mt-2 text-center">
            <button class="btn btn-app" type="button" @click.prevent="loginAsDemo('admin@admin.com')">
              {{ $t('Log as Admin') }}
            </button>
          </div>
        </div>
        <div class="text-center text-gray-400 mt-2">---------------------------OR---------------------------</div>
      </template>

      <div class="mb-4 pt-1 relative shadow-sm">
        <label class="input-label" for="email">
          {{ $t('Email') }}
        </label>
        <input :placeholder="$t('Email')" class="form-input mt-1" id="email" required type="text" v-model="user.email" />
      </div>
      <div class="mb-4 pt-1 relative shadow-sm">
        <label class="input-label" for="password">
          {{ $t('Password') }}
        </label>
        <input :placeholder="$t('Password')" class="form-input mt-1" id="password" required type="password" v-model="user.password" />
      </div>
      <div class="mb-4 text-right">
        <button class="btn btn-app" id="submit-login" type="submit">
          {{ $t('Sign In') }}
        </button>
      </div>
      <p class="text-sm" v-if="$store.getters['app/getSettings.register']">
        {{ $t("Don't have an account?") }}
        <router-link class="align-baseline font-bold text-blue-700 hover:text-blue-900" to="/auth/register">{{ $t('Create account') }} </router-link>
      </p>
      <p class="text-sm">
        {{ $t('You can not access your account?') }}
        <router-link class="align-baseline font-bold text-blue-700 hover:text-blue-900" to="/auth/recover">{{ $t('Recover account') }} </router-link>
      </p>
    </form>
  </div>
</template>
<script>
import Cookies from 'js-cookie';
export default {
  name: 'login',
  metaInfo() {
    return {
      title: this.$i18n.t('Sign In'),
    };
  },
  computed: {
    isDemoMode() {
      return this.$store.getters['app/isDemo'];
    },
  },
  data() {
    return {
      loading: false,
      user: {
        email: null,
        password: null,
        captcha_hash: null,
      },
    };
  },
  methods: {
    loginAsDemo(email) {
      this.user.email = email;
      this.user.password = '12345678';
      this.submit();
    },
    async submit() {
      this.loading = true;
      if (this.$store.getters['app/getSettings.recaptcha_enabled']) {
        await this.$recaptchaLoaded();
        const token = await this.$recaptcha('login');
        this.user.captcha_hash = token;
        this.login();
      } else {
        this.login();
      }
    },
    login() {
      axios
        .post(route('auth.login'), this.user)
        .then((response) => {
          this.$store.dispatch('app/login', response.data);
          const intendedUrl = Cookies.get('intended_url');
          if (intendedUrl) {
            Cookies.remove('intended_url');
            this.$router.push(intendedUrl);
          } else {
            if (response.data.user.role.admin_access) {
              this.$router.push('/admin');
            }
            this.$router.push('/');
          }
        })
        .catch(() => {
          this.loading = false;
          this.user.password = null;
        });
    },
  },
};
</script>

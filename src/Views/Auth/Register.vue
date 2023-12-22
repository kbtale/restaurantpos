<template>
  <div>
    <loading :status="loading"></loading>
    <form @submit.prevent="submit">
      <div class="mb-4 pt-1 relative shadow-sm">
        <label class="form-label" for="name">
          {{ $t('Name') }}
        </label>
        <input :placeholder="$t('Name')" class="form-input block w-full mt-1 sm:text-sm sm:leading-5" id="name" required v-model="user.name" />
      </div>
      <div class="mb-4 pt-1 relative shadow-sm">
        <label class="form-label" for="email">
          {{ $t('Email') }}
        </label>
        <input :placeholder="$t('Email')" class="form-input block w-full mt-1 sm:text-sm sm:leading-5" id="email" required type="text" v-model="user.email" />
      </div>
      <div class="mb-4 pt-1 relative shadow-sm">
        <label class="form-label" for="password">{{ $t('Password') }}</label>
        <input
          :placeholder="$t('Password')"
          class="form-input block w-full mt-1 sm:text-sm sm:leading-5"
          id="password"
          required
          type="password"
          v-model="user.password"
        />
      </div>
      <div class="mb-4 pt-1 relative shadow-sm">
        <label class="form-label" for="password_confirmation">{{ $t('Confirm password') }} </label>
        <input
          :placeholder="$t('Password')"
          class="form-input block w-full mt-1 sm:text-sm sm:leading-5"
          id="password_confirmation"
          required
          type="password"
          v-model="user.password_confirmation"
        />
      </div>
      <div class="mb-4 text-right">
        <button class="btn btn-app" id="submit-register" type="submit">
          {{ $t('Create account') }}
        </button>
      </div>
      <p class="text-sm">
        {{ $t('Do you already have an account?') }}
        <router-link class="align-baseline font-bold text-blue-700 hover:text-blue-900" to="/auth/login">{{ $t('Sign In') }} </router-link>
      </p>
    </form>
  </div>
</template>
<script>
export default {
  name: 'register',
  metaInfo() {
    return {
      title: this.$i18n.t('Register'),
    };
  },
  data() {
    return {
      loading: false,
      user: {
        name: null,
        email: null,
        password: null,
        password_confirmation: null,
        captcha_hash: null,
      },
    };
  },
  methods: {
    async submit() {
      this.loading = true;
      if (this.$store.getters['app/getSettings.recaptcha_enabled']) {
        await this.$recaptchaLoaded();
        const token = await this.$recaptcha('register');
        this.user.captcha_hash = token;
        this.register();
      } else {
        this.register();
      }
    },
    register() {
      this.loading = true;
      axios
        .post(route('auth.register'), this.user)
        .then((response) => {
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.$store.commit('login', response.data);
          this.loading = false;
          this.$router.push('/');
        })
        .catch(() => {
          this.user.password = null;
          this.user.password_confirmation = null;
          this.loading = false;
        });
    },
  },
};
</script>

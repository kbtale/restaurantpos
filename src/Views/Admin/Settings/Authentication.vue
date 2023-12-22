<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.fingerprint-duotone"></svg-vue>
          <h1 class="content-title">
            {{ $t('Authentication') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <router-link class="btn btn-app" to="/admin/settings">{{ $t('Back') }}</router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <loading :status="loading"></loading>
      <form @submit.prevent="save">
        <div class="content-card-body">
          <div class="px-4 py-5 sm:p-6">
            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-3">
                <label class="form-label" for="app_user_registration">{{ $t('User registration') }}</label>
                <input-switch
                  :disabled-label="$t('User registration is disabled')"
                  :enabled-label="$t('User registration is enabled')"
                  id="app_user_registration"
                  v-model="form.app_user_registration"
                ></input-switch>
                <div class="form-description-text">
                  {{ $t('Allow users to register directly from the authentication page') }}
                </div>
              </div>
              <div class="col-span-3">
                <label class="form-label" for="app_default_role">{{ $t('Default role') }}</label>
                <select class="form-input bg-white" id="app_default_role" required v-model="form.app_default_role">
                  <option :value="null" disabled>
                    {{ $t('Select an option') }}
                  </option>
                  <option :key="index" :value="userRole.id" v-for="(userRole, index) in userRoles">
                    {{ userRole.name }}
                  </option>
                </select>
                <p class="form-description-text">{{ $t('Role that is assigned to a user on the registration page') }}.</p>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="inline-flex">
              <button class="btn btn-app" type="submit">
                {{ $t('Save') }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>
<script>
export default {
  name: 'authentication',
  data() {
    return {
      loading: true,
      userRoles: [],
      form: {
        app_user_registration: null,
        app_default_role: null,
      },
    };
  },
  mounted() {
    this.get();
    this.getUserRoles();
  },
  methods: {
    getUserRoles() {
      axios.get(route('settings.user-roles')).then((response) => {
        this.userRoles = response.data;
      });
    },
    get() {
      axios
        .get(route('settings.get.authentication'))
        .then((response) => {
          this.form = response.data;
          this.loading = false;
        })
        .catch(function () {
          this.$router.push('/admin/settings');
        });
    },
    save() {
      this.loading = true;
      axios
        .post(route('settings.set.authentication'), this.form)
        .then((response) => {
          window.app.register = this.app_user_registration;
          this.$store.commit('setSettings', window.app);
          this.loading = false;
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

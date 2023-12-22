<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.cog-regular"></svg-vue>
          <h1 class="content-title">
            {{ $t('General') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <router-link class="btn btn-app" to="/admin/settings">{{ $t('Back') }}</router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div>
        <loading :status="loading.general"></loading>
        <form @submit.prevent="save">
          <div class="content-card-body">
            <div class="px-4 py-5 bg-white sm:p-6">
              <div class="grid grid-cols-3 gap-3">
                <div class="col-span-3">
                  <label class="form-label" for="app_url">
                    {{ $t('App URL') }}
                  </label>
                  <input :placeholder="$t('App url')" class="form-input" id="app_url" required type="url" v-model="form.app_url" />
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="app_name">
                    {{ $t('App name') }}
                  </label>
                  <input :placeholder="$t('Site name')" class="form-input" id="app_name" required v-model="form.app_name" />
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="app_phone">
                    {{ $t('App Phone') }}
                  </label>
                  <input :placeholder="$t('Site Phone')" class="form-input" id="app_phone" v-model="form.app_phone" />
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="app_address">
                    {{ $t('Address') }}
                  </label>
                  <input :placeholder="$t('Address')" class="form-input" id="app_address" v-model="form.app_address" />
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="app_https">
                    {{ $t('Force HTTPS') }}
                  </label>
                  <input-switch
                    :disabled-label="$t('The site will load from any available protocol')"
                    :enabled-label="$t('The site will be forced to load with https')"
                    id="app_https"
                    v-model="form.app_https"
                  ></input-switch>
                  <div class="form-description-text">{{ $t('Force the loading of the site using HTTPS, to improve the security and SEO positioning of the site') }}.</div>
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
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <loading :status="loading.optimize"></loading>
        <form @submit.prevent="optimizeSystem">
          <div class="px-4 py-5 bg-white sm:p-6">
            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-3">
                <label class="form-label" for="action">{{ $t('System optimization') }}</label>
                <select class="form-input bg-white" id="action" required v-model="system.action">
                  <option :value="null" disabled>
                    {{ $t('Select an option') }}
                  </option>
                  <option value="optimize">{{ $t('Full optimize') }}</option>
                  <option value="cache">{{ $t('Clear only cache') }}</option>
                  <option value="storage_link">{{ $t('Refresh storage link') }}</option>
                  <option value="update">{{ $t('Install update') }}</option>
                </select>
              </div>
              <div class="col-span-3">
                <div v-if="system.output" class="overflow-auto rounded-md p-5 bg-black text-xs text-green-400 w-full">
                  <pre>{{ system.output }}</pre>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="inline-flex">
              <button :disabled="!system.action" class="btn btn-app" type="submit">
                {{ $t('Request') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: 'general',
  data() {
    return {
      loading: {
        optimize: false,
        general: true,
      },
      system: {
        action: 'optimize',
        output: null,
      },
      form: {
        app_url: null,
        app_name: null,
        app_https: null,
        app_address: null,
        app_phone: null,
        app_about: null,
      },
    };
  },
  mounted() {
    this.get();
  },
  methods: {
    optimizeSystem() {
      this.loading.optimize = true;
      this.system.output = null;
      axios
        .post(route('settings.optimize'), this.system)
        .then((response) => {
          this.loading.optimize = false;
          this.system.output = response.data.output;
          setTimeout(() => {
            this.system.output = null;
          }, 12000);
        })
        .catch(() => {
          this.loading.optimize = false;
        });
    },
    get() {
      axios
        .get(route('settings.get.general'))
        .then((response) => {
          this.form = response.data;
          this.loading.general = false;
        })
        .catch(function () {
          this.$router.push('/admin/settings');
        });
    },
    save() {
      this.loading.general = true;
      axios
        .post(route('settings.set.general'), this.form)
        .then((response) => {
          this.loading.general = false;
          window.app.name = this.form.app_name;
          this.$store.commit('setSettings', window.app);
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
        })
        .catch(() => {
          this.loading.general = false;
        });
    },
  },
};
</script>

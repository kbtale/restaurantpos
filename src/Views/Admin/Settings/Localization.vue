<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.language-duotone"></svg-vue>
          <h1 class="content-title">
            {{ $t('Localization') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <router-link class="btn btn-app" to="/admin/settings">
            {{ $t('Back') }}
          </router-link>
        </div>
      </div>
    </div>

    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <loading :status="loading"></loading>
        <form @submit.prevent="save">
          <div class="px-4 py-5 bg-white sm:p-6">
            <div class="grid grid-cols-3 gap-6">
              <div class="col-span-3">
                <label class="form-label" for="app_timezone">{{ $t('Timezone') }}</label>
                <div class="pt-1">
                  <input :placeholder="$t('Timezone')" class="form-input" id="app_timezone" required v-model="form.app_timezone" />
                </div>
                <p class="form-description-text">
                  {{ $t('List of supported timezone can be found') }}
                  <a class="text-blue-500" href="https://www.php.net/manual/en/timezones.php" rel="noopener" target="_blank">{{ $t('here') }}</a>
                  .
                </p>
              </div>
              <div class="col-span-3">
                <label class="form-label" for="app_locale">{{ $t('Site language') }}</label>
                <select class="form-input bg-white" id="app_locale" required v-model="form.app_locale">
                  <option :value="null" disabled>
                    {{ $t('Select an option') }}
                  </option>
                  <option :key="index" :value="language.locale" v-for="(language, index) in languages">
                    {{ language.name }}
                  </option>
                </select>
              </div>
              <div class="col-span-3">
                <label class="form-label" for="app_direction">{{ $t('App direction') }}</label>
                <select class="form-input bg-white" id="app_direction" required v-model="form.app_direction">
                  <option value="ltl">LTL</option>
                  <option value="rtl">RTL</option>
                </select>
              </div>
              <div class="col-span-3">
                <label class="form-label" for="app_date_locale">{{ $t('Date locale') }}</label>
                <input :placeholder="$t('Date locale')" class="form-input" id="app_date_locale" required v-model="form.app_date_locale" />
                <p class="form-description-text">
                  {{ $t('Set locale used for date and time translation') }}. {{ $t('Selected locale must be installed on the operating system') }}.
                </p>
              </div>
              <div class="col-span-3">
                <label class="form-label" for="app_date_format">{{ $t('Date format') }}</label>
                <select class="form-input" id="app_date_format" required v-model="form.app_date_format">
                  <option value="">{{ $t('Select an option') }}</option>
                  <option v-for="(formate, index) in dateFormates" :key="index" :value="formate">{{ formate }}</option>
                </select>
                <p class="form-description-text">
                  {{ $t('Default format for dates on the site') }}.
                  {{ $t('List of supported format can be found') }}
                  <a class="text-blue-500" href="https://momentjs.com/docs/#/displaying/format/" rel="noopener" target="_blank">{{ $t('here') }}</a>
                  .
                </p>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="inline-flex">
              <button class="btn btn-app shadow-sm" type="submit">
                {{ $t('Save') }}
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
  name: 'localization',
  data() {
    return {
      loading: true,
      languages: [],
      dateFormates: window.app.time_date_formats ?? ['Y-m-d H:i:s', 'd-m-Y H:i:s'],
      form: {
        app_timezone: null,
        app_locale: null,
        app_date_locale: null,
        app_date_format: null,
      },
    };
  },
  mounted() {
    this.get();
    this.getLanguages();
  },
  methods: {
    getLanguages() {
      axios.get(route('settings.languages')).then((response) => {
        this.languages = response.data;
      });
    },
    get() {
      axios
        .get(route('settings.get.localization'))
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
        .post(route('settings.set.localization'), this.form)
        .then((response) => {
          this.loading = false;
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          window.location.reload();
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

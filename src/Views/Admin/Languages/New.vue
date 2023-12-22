<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <form @submit.prevent="saveLanguage">
      <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex min-w-0">
            <svg-vue class="content-title-icon" icon="font-awesome.plus-circle-solid"></svg-vue>
            <h1 class="content-title">
              {{ $t('Create language') }}
            </h1>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <router-link class="btn btn-app" to="/admin/languages">
              {{ $t('Back') }}
            </router-link>
          </div>
        </div>
      </div>
      <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
        <div class="content-card-body">
          <loading :status="loading"></loading>
          <div class="md:grid md:grid-cols-3 md:gap-3 px-4 py-5 sm:p-6">
            <div class="md:col-span-1">
              <h3 class="form-description-head">
                {{ $t('Language details') }}
              </h3>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-3 gap-3">
                <div class="col-span-3">
                  <label class="form-label" for="name">{{ $t('Name') }}</label>
                  <div class="pt-1 relative shadow-sm">
                    <input :placeholder="$t('Name')" class="form-input" id="name" required v-model="language.name" />
                  </div>
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="locale">{{ $t('Locale') }}</label>
                  <div class="pt-1 relative shadow-sm">
                    <input :placeholder="$t('Locale')" class="form-input" id="locale" maxlength="5" required v-model="language.locale" />
                  </div>
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="direction">{{ $t('App direction') }}</label>
                  <div class="pt-1 relative shadow-sm">
                    <select id="direction" class="form-input" v-model="language.direction">
                      <option value="ltl">LTL</option>
                      <option value="rtl">RTL</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <span class="inline-flex">
              <router-link class="btn btn-app mx-1" to="/admin/languages">{{ $t('Cancel') }}</router-link>
              <button class="btn btn-app" type="submit">
                {{ $t('Save') }}
              </button>
            </span>
          </div>
        </div>
      </div>
    </form>
  </main>
</template>
<script>
export default {
  name: 'new-language',
  metaInfo() {
    return {
      title: this.$i18n.t('Create language'),
    };
  },
  data() {
    return {
      loading: false,
      language: {
        name: null,
        locale: null,
        direction: 'ltl',
      },
    };
  },
  methods: {
    saveLanguage() {
      this.loading = true;
      axios
        .post(route('languages.store'), this.language)
        .then((response) => {
          this.loading = false;
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.$router.push(`/admin/languages/${response.data.language.id}/edit`);
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

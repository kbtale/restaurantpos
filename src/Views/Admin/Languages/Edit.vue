<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <form @submit.prevent="updateLanguage">
      <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex min-w-0">
            <svg-vue class="content-title-icon" icon="font-awesome.edit-regular"></svg-vue>
            <h1 class="content-title">
              {{ $t('Edit language') }}
              <small>({{ translations.length }})</small>
            </h1>
          </div>
          <div class="mt-4 flex md:mt-0 md:ml-4">
            <template v-if="language.locale && language.locale !== defaultLocale">
              <button @click="deleteLanguageModal = true" class="btn btn-red mx-1" type="button">
                {{ $t('Delete') }}
              </button>
              <router-link class="btn btn-app mx-1" to="/admin/languages">
                {{ $t('Back') }}
              </router-link>
            </template>
            <template v-else>
              <router-link class="btn btn-app" to="/admin/languages">
                {{ $t('Back') }}
              </router-link>
            </template>
          </div>
        </div>
      </div>
      <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
        <div class="content-card-body">
          <loading :status="loading"></loading>
          <div class="md:grid md:grid-cols-3 md:gap-3 px-4 py-3">
            <div class="mt-5 md:mt-0 md:col-span-3">
              <div class="flex flex-col">
                <div class="-my-2 -mx-6 overflow-x-auto">
                  <div class="px-2 align-middle inline-block min-w-full">
                    <template v-for="(translate, index) in translations">
                      <div :key="index" class="col-span-3 px-5 py-2 hover:bg-gray-100 hover:cursor-pointer">
                        <label :id="`label${index}`" @click="convertString(index)" class="cursor-pointer form-label" :for="index">
                          {{ translate.key }}
                        </label>
                        <div class="pt-1 relative">
                          <textarea-autosize
                            :id="index"
                            :class="translate.value !== translate.key ? 'translation-edited' : ''"
                            :placeholder="$t('Enter the translated string')"
                            class="form-input"
                            rows="1"
                            v-model="translate.value"
                          ></textarea-autosize>
                        </div>
                      </div>
                    </template>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <span class="inline-flex">
              <router-link class="btn btn-app mx-1" to="/admin/languages">{{ $t('Cancel') }}</router-link>
              <button @click.prevent="batchConverion" class="btn btn-app mx-1">{{ $t('Batch Translate') }} ({{ stringIndex }})</button>
              <button class="btn btn-app" type="submit">
                {{ $t('Update') }}
              </button>
            </span>
          </div>
        </div>
      </div>
    </form>
    <language-delete-model :show="deleteLanguageModal" @cancelled="deleteLanguageModal = false" @confirmed="deleteLanguage">
      <template #title>{{ $t('Language delete') }}</template>
      {{ $t('Are you sure you want to delete the language?') }}
    </language-delete-model>
  </main>
</template>
<script>
import { forEach } from 'lodash';
import confirmationModel from '@/Components/layout/admin/confirmation';

export default {
  name: 'edit-language',
  metaInfo() {
    return {
      title: this.$i18n.t('Edit language'),
    };
  },
  components: {
    LanguageDeleteModel: confirmationModel,
  },
  data() {
    return {
      stringIndex: 0,
      loading: true,
      defaultLocale: document.documentElement.lang,
      deleteLanguageModal: false,
      language: {
        name: null,
        locale: null,
      },
      translations: {},
    };
  },
  mounted() {
    this.getLanguage();
  },

  methods: {
    batchConverion() {
      forEach(this.translations, (translation, key) => {
        translation.value = document.getElementById(`label${key}`).innerText;
        this.stringIndex++;
      });
    },
    convertString(index) {
      this.translations[`${index}`].value = document.getElementById(`label${index}`).innerText;
    },
    updateLanguage() {
      this.loading = true;
      axios
        .put(route('languages.update', this.$route.params.id), {
          strings: this.translations,
        })
        .then((response) => {
          if (this.language.locale === this.defaultLocale) {
            axios.get(route('language.get', this.$i18n.locale)).then((response) => {
              this.$i18n.setLocaleMessage(this.$i18n.locale, response.data);
            });
          }
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
    getLanguage() {
      this.loading = true;
      axios
        .get(route('languages.show', this.$route.params.id))
        .then((response) => {
          this.language = response.data.language;
          this.translations = response.data.translations;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.$router.push('/admin/languages');
        });
    },
    deleteLanguage() {
      axios
        .delete(route('languages.destroy', this.$route.params.id))
        .then((response) => {
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.$router.push('/admin/languages');
        })
        .catch(() => {
          this.deleteLanguageModal = false;
        });
    },
  },
};
</script>

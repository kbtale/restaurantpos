<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.dollar-sign-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('Currency') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <router-link class="btn btn-app" to="/admin/settings">{{ $t('Back') }}</router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <loading :status="loading"></loading>
        <form @submit.prevent="save">
          <div class="px-4 py-5 sm:p-6">
            <div class="grid grid-cols-3 gap-6">
              <div class="col-span-3">
                <label class="form-label" for="currency_symbol">{{ $t('Currency symbol') }}</label>
                <div class="pt-1">
                  <input :placeholder="$t('Currency symbol')" class="form-input" id="currency_symbol" required v-model="currency.currency_symbol" />
                </div>
              </div>
              <div class="col-span-3">
                <label class="form-label" for="currency_symbol_on_left">{{ $t('Display side') }}</label>
                <input-switch
                  :disabled-label="$t('The will be render on right side')"
                  :enabled-label="$t('The will be render on left side')"
                  id="currency_symbol_on_left"
                  v-model="currency.currency_symbol_on_left"
                ></input-switch>
                <div class="form-description-text">
                  {{ $t('Display side can control currency symbol rendering side along amount to enhance overview') }}.
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="inline-flex">
              <button class="btn btn-green" type="submit">
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
  name: 'currency',
   metaInfo() {
    return {
      title: this.$i18n.t('currency'),
    };
  },
  data() {
    return {
      loading: true,
      currency: {
        currency_symbol: null,
        currency_symbol_on_left: null,
      },
    };
  },
  mounted() {
    this.get();
  },
  methods: {
    get() {
      axios
        .get(route('settings.get.currency'))
        .then((response) => {
          this.currency = response.data;
          this.loading = false;
        })
        .catch(function () {
          this.$router.push('/admin/settings');
        });
    },
    save() {
      this.loading = true;
      axios
        .post(route('settings.set.currency'), this.currency)
        .then((response) => {
          this.loading = false;
          window.app.currency_symbol = this.currency.currency_symbol;
          window.app.currency_symbol_on_left = this.currency.currency_symbol_on_left;
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

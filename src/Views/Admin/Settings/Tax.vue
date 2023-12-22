<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.money-check-alt-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('Tax') }}
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
                <label class="form-label" for="tax_rate">{{ $t('Tax Rate') }}</label>
                <div class="pt-1">
                  <input :placeholder="$t('Tax Rate')" class="form-input" id="tax_rate" required v-model="tax.tax_rate" />
                </div>
              </div>
              <div class="col-span-3">
                <label class="form-label" for="is_vat">{{ $t('Is VAT calculation') }}</label>
                <input-switch
                  :disabled-label="$t('Basic tax calculation will be implemented')"
                  :enabled-label="$t('Vat calculation will be implemented')"
                  id="is_vat"
                  v-model="tax.is_vat"
                ></input-switch>
                <div class="form-description-text">
                  {{ $t('This will control tax calculation implementation') }}
                </div>
              </div>
              <div class="col-span-3">
                <label class="form-label" for="is_tax_included">{{ $t('Is tax included') }}</label>
                <input-switch
                  :disabled-label="$t('The tax amount will be excluded and added')"
                  :enabled-label="$t('The tax amount will be included')"
                  id="is_tax_included"
                  v-model="tax.is_tax_included"
                ></input-switch>
                <div class="form-description-text">
                  {{ $t('This will control how tax can be add to total amount') }}
                </div>
              </div>
              <template v-if="!tax.is_vat">
                <div class="col-span-3">
                  <label class="form-label" for="is_tax_fix">{{ $t('Is fix or percentage') }}</label>
                  <input-switch
                    :disabled-label="$t('The percentage of amount will be added')"
                    :enabled-label="$t('The fixed amount will be added')"
                    id="is_tax_fix"
                    v-model="tax.is_tax_fix"
                  ></input-switch>
                  <div class="form-description-text">
                    {{ $t('This will control tax implementation could be percentage or fixed') }}
                  </div>
                </div>
              </template>
            </div>
          </div>
          <div class="card-footer">
            <div class="inline-flex">
              <button class="btn btn-green shadow-sm" type="submit">
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
  name: 'tax',
  metaInfo() {
    return {
      title: this.$i18n.t('Tax'),
    };
  },
  data() {
    return {
      loading: true,
      tax: {
        is_vat: false,
        tax_rate: null,
        is_tax_fix: null,
        is_tax_included: null,
      },
    };
  },
  mounted() {
    this.get();
  },
  methods: {
    get() {
      axios
        .get(route('settings.get.tax'))
        .then((response) => {
          this.tax = response.data;
          this.loading = false;
        })
        .catch(() => {
          this.$router.push('/admin/settings');
        });
    },
    save() {
      this.loading = true;
      axios
        .post(route('settings.set.tax'), this.tax)
        .then((response) => {
          this.loading = false;
          window.app.tax_setup = {
            tax_id: this.tax.tax_id,
            tax_rate: this.tax.tax_rate,
            is_tax_included: this.tax.is_tax_included,
            is_tax_fix: this.tax.is_tax_fix,
            is_vat: this.tax.is_vat,
          };
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

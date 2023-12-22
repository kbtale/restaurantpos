<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.plus-circle-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('New customer') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <router-link class="btn btn-app" to="/admin/customers">
            {{ $t('Back') }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <loading :status="loading"></loading>
        <form @submit.prevent="saveCustomer">
          <div class="md:grid md:grid-cols-3 md:gap-6 px-4 py-5 sm:p-6">
            <div class="md:col-span-1">
              <h3 class="form-description-head">
                {{ $t('customer details') }}
              </h3>
              <p class="form-description-text">{{ $t('This information will be displayed publicly') }}.</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-3 gap-6">
                <div class="col-span-3">
                  <label class="form-label" for="name">{{ $t('Name') }}</label>
                  <div class="pt-1">
                    <input :placeholder="$t('First name')" class="form-input" id="name" required v-model="customer.name" />
                  </div>
                </div>
                <div class="col-span-3 md:flex md:space-x-2">
                  <div class="w-full">
                    <label class="form-label" for="email">{{ $t('Email') }}</label>
                    <div class="pt-1">
                      <input :placeholder="$t('Email')" class="form-input" id="email" v-model="customer.email" />
                    </div>
                  </div>
                  <div class="w-full">
                    <label class="form-label" for="phone">{{ $t('Phone') }}</label>
                    <div class="pt-1">
                      <input :placeholder="$t('Phone')" class="form-input" id="phone" v-model="customer.phone" />
                    </div>
                  </div>
                </div>

                <div class="col-span-3">
                  <label class="form-label" for="address">{{ $t('Address') }}</label>
                  <div class="pt-1">
                    <input :placeholder="$t('Address')" class="form-input" id="address" v-model="customer.address" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <span class="inline-flex">
              <router-link class="btn btn-app mx-1" to="/admin/customers">{{ $t('Cancel') }}</router-link>
              <button class="btn btn-green" type="submit">
                {{ $t('Save') }}
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  name: 'new',
  metaInfo() {
    return {
      title: this.$i18n.t('Create customer'),
    };
  },
  data() {
    return {
      loading: false,
      customer: {
        name: null,
        last_name: null,
        gender: null,
        date_of_birth: null,
        email: null,
        phone: null,
        address: null,
        company: null,
        tax_id: null,
        shipping_address: null,
      },
    };
  },

  methods: {
    saveCustomer() {
      this.loading = true;
      axios
        .post(route('customers.store'), this.customer)
        .then((response) => {
          this.loading = false;
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.$router.push(`/admin/customers`);
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

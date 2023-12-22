<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.dollar-sign-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('Payment methods') }}
          </h1>
        </div>
        <div class="flex md:mt-0 md:ml-4">
          <router-link class="btn btn-app mx-1" to="/admin/payment-methods/new"> {{ $t('Create') }}</router-link>
          <button @click.prevent="$router.back()" type="button" class="btn btn-app mx-1">
            {{ $t('Back') }}
          </button>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <loading :status="loading"></loading>
        <template v-if="paymentMethodList.length > 0">
          <ul>
            <template v-for="(method, index) in paymentMethodList">
              <li :class="{ 'border-t border-gray-200': index !== 0 }" :key="index">
                <router-link
                  :to="'/admin/payment-methods/' + method.id + '/edit'"
                  class="block hover:bg-gray-50 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                >
                  <div class="flex items-center px-4 py-4 sm:px-6">
                    <div class="min-w-0 flex-1 flex items-center">
                      <div class="min-w-0 flex-1 pr-4 lg:grid lg:grid-cols-2 lg:gap-4">
                        <div class="flex">
                          <div class="inline-block align-middle text-sm font-medium leading-5 text-gray-900">
                            <div class="bg-gray-100 border px-2 py-1 flex">
                              <svg-vue class="content-title-icon w-4 h-4 text-gray-500" icon="font-awesome.tags-regular"></svg-vue>
                              {{ method.title }}
                            </div>
                            <small class="text-xs text-gray-500">{{ $t('Created at') }} : {{ method.created_at }}</small>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <svg-vue class="h-5 w-5 text-gray-400" icon="font-awesome.angle-right-regular"></svg-vue>
                    </div>
                  </div>
                </router-link>
              </li>
            </template>
          </ul>
        </template>
        <template v-else="!loading">
          <no-content />
        </template>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: 'List',
  metaInfo() {
    return {
      title: this.$i18n.t('Payment methods'),
    };
  },
  data() {
    return {
      loading: true,
      paymentMethodList: [],
    };
  },
  mounted() {
    this.getPayment();
  },
  methods: {
    getPayment() {
      this.loading = true;
      axios
        .get(route('payment-methods.index'))
        .then((response) => {
          this.paymentMethodList = response.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

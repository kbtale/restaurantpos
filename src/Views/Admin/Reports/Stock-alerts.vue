<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.file-invoice-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('Stock Alert') }}
          </h1>
        </div>

        <div class="flex md:mt-0 md:ml-4">
          <button @click="printReport" class="btn btn-secondary">
            <svg-vue class="h-5 w-5" icon="font-awesome.print-solid"></svg-vue>
          </button>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body p-4" id="stocks">
        <template v-if="alerts.length">
          <table class="table">
            <thead>
              <tr class="p-2 bg-orange-50">
                <th class="border px-5 py-2 text-left items-center">#</th>
                <th class="border px-5 py-2 text-left items-center w-full">{{ $t('Ingredient name') }}</th>
                <th class="border px-5 py-2 text-left items-center">{{ $t('Price') }}</th>
                <th class="border px-5 py-2 text-left items-center">{{ $t('Availiable Quantity') }}</th>
                <th class="border px-5 py-2 text-left items-center">{{ $t('Alert Quantity') }}</th>
              </tr>
            </thead>
            <tbody>
              <tr class="p-2" v-for="(item, index) in alerts" :key="index">
                <td class="border px-5 py-2 text-left items-center">{{ index + 1 }}</td>
                <td class="border px-5 py-2 text-left items-center">
                  <a :href="`/admin/ingredients/${item.id}/edit`" target="_blank" class="hover:text-blue-500">{{ item.name }}</a>
                  <p class="text-xs text-gray-400 pt-1">{{ item.created_at }}</p>
                </td>
                <td class="border px-5 py-2 text-left items-center">{{ item.price | currency }}</td>
                <td class="border px-5 py-2 text-left items-center">{{ item.quantity }}</td>
                <td class="border px-5 py-2 text-left items-center">{{ item.alert_quantity }}</td>
              </tr>
            </tbody>
          </table>
        </template>
        <template v-else>
          <div class="flex-center">
            <no-content />
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: 'Tax',
  metaInfo() {
    return {
      title: this.$i18n.t('Tax report'),
    };
  },
  data() {
    return {
      loading: false,
      alerts: [],
    };
  },
  mounted() {
    this.getStockAlerts();
  },
  methods: {
    getStockAlerts() {
      this.loading = true;
      axios
        .get(route('stock.alerts'))
        .then((response) => {
          this.loading = false;
          this.alerts = response.data;
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    async printReport() {
      this.loading = true;
      await this.$htmlToPaper('stocks');
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
  },
};
</script>

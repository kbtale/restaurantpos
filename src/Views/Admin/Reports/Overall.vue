<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div id="repairContainer">
      <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
        <div class="md:flex md:items-center md:justify-between">
          <div class="flex min-w-0">
            <svg-vue class="content-title-icon" icon="font-awesome.file-invoice-solid"></svg-vue>
            <h1 class="content-title">
              {{ $t('Overall report') }}
            </h1>
          </div>
          <p v-if="generatedAt && report.list.length">{{ $t('Report created at ') }}: {{ generatedAt }}</p>
          <div class="flex md:mt-0 md:ml-4">
            <button @click="printReport" class="btn btn-secondary">
              <svg-vue class="h-5 w-5" icon="font-awesome.print-solid"></svg-vue>
            </button>
          </div>
        </div>
      </div>
      <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 md:px-8">
        <template>
          <div class="content-card-body p-4 mb-2">
            <div class="md:flex w-full">
              <div class="w-full">
                <label class="form-label" for="order_type">{{ $t('By Order Type') }}</label>
                <select
                  @change="letsUpdateReport"
                  aria-label="Sort by"
                  class="form-input bg-white rounded-none rounded-l-md"
                  id="order_type"
                  v-model="filters.order_type"
                >
                  <option :value="null">{{ $t('By Order Type') }}</option>
                  <option v-for="(ortype, index) in orderTypes" :key="index" :value="ortype.key">{{ ortype.title }}</option>
                </select>
              </div>
              <div v-if="filters.order_type === 'dining'" class="w-full">
                <label class="form-label" for="table">{{ $t('By Serice table') }}</label>
                <select @change="letsUpdateReport" aria-label="Sort by" class="form-input bg-white rounded-none" id="table" v-model="filters.table">
                  <option :value="null">{{ $t('By table') }}</option>
                  <template v-for="(table, index) in tableList">
                    <option :key="index" :value="table.id">
                      {{ table.title }}
                    </option>
                  </template>
                </select>
              </div>
              <div class="w-full">
                <label class="form-label" for="is_duration">{{ $t('By Duration') }}</label>
                <select
                  @change="letsUpdateReport"
                  aria-label="Sort by"
                  class="form-input bg-white rounded-none rounded-r-md"
                  id="is_duration"
                  v-model="filters.is_duration"
                >
                  <option :value="null">{{ $t('By duration') }}</option>
                  <option value="day">{{ $t('Daily') }}</option>
                  <option value="month">{{ $t('Monthly') }}</option>
                  <option value="year">{{ $t('Yearly') }}</option>
                </select>
              </div>
            </div>

            <div v-if="!filters.is_duration" class="shadow-sm md:flex mt-1 md:w-2/3">
              <div class="w-full">
                <label class="form-label" for="start">{{ $t('Starting date') }}</label>
                <input
                  id="start"
                  @change="letsUpdateReport"
                  type="date"
                  v-model="filters.startdate"
                  :title="$t('Starting date')"
                  class="form-input rounded-none rounded-l-md"
                />
              </div>
              <div class="w-full">
                <label class="form-label" for="end">{{ $t('Ending date') }}</label>
                <input
                  id="end"
                  @change="letsUpdateReport"
                  type="date"
                  v-model="filters.enddate"
                  :title="$t('Ending date')"
                  class="form-input rounded-none rounded-r-md"
                />
              </div>
            </div>
            <div class="shadow-sm md:flex mt-1">
              <div class="w-full">
                <label class="form-label" for="taker">{{ $t('By taker') }}</label>
                <select @change="letsUpdateReport" aria-label="Sort by" class="form-input bg-white rounded-none rounded-l-md" id="taker" v-model="filters.taker">
                  <option :value="null">{{ $t('By taker') }}</option>
                  <template v-for="(taker, index) in takerList">
                    <option :key="index" :value="taker.id">
                      {{ taker.name }}
                    </option>
                  </template>
                </select>
              </div>
              <div class="w-full">
                <label class="form-label" for="chef">{{ $t('By Chef') }}</label>
                <select @change="letsUpdateReport" aria-label="Sort by" class="form-input bg-white rounded-none" id="chef" v-model="filters.chef">
                  <option :value="null">{{ $t('By Chef') }}</option>
                  <template v-for="(chef, index) in chefList">
                    <option :key="index" :value="chef.id">
                      {{ chef.name }}
                    </option>
                  </template>
                </select>
              </div>
              <div class="w-full">
                <label class="form-label" for="biller">{{ $t('By Biller') }}</label>
                <select @change="letsUpdateReport" aria-label="Sort by" class="form-input rounded-none rounded-r-md" id="biller" v-model="filters.biller">
                  <option :value="null">{{ $t('By biller') }}</option>
                  <template v-for="(biller, index) in billerList">
                    <option :key="index" :value="biller.id">
                      {{ biller.name }}
                    </option>
                  </template>
                </select>
              </div>
            </div>
          </div>
          <div class="pb-2">
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div class="bg-white overflow-hidden shadow border rounded-md border-gray-400">
                <loading :status="loading"></loading>
                <div class="px-2 py-3 sm:p-4">
                  <div class="text-sm font-medium truncate">
                    {{ $t('Total sale amount') }}
                  </div>
                  <div class="mt-1 font-semibold text-gray-900 text-xs">
                    {{ report.total_price_amount | currency }}
                  </div>
                </div>
              </div>
              <div class="bg-white overflow-hidden shadow border rounded-md border-gray-400">
                <loading :status="loading"></loading>
                <div class="px-2 py-3 sm:p-4">
                  <div class="text-sm font-medium truncate">{{ $t('Total cost amount') }}</div>
                  <div class="mt-1 font-semibold text-gray-900 text-xs">
                    {{ report.total_cost_amount | currency }}
                  </div>
                </div>
              </div>
              <div class="bg-white overflow-hidden shadow border rounded-md border-gray-400">
                <loading :status="loading"></loading>
                <div class="px-2 py-3 sm:p-4">
                  <div class="text-sm font-medium truncate">{{ $t('Total discount amount') }}</div>
                  <div class="mt-1 font-semibold text-gray-900 text-xs">
                    {{ report.total_discount_amount | currency }}
                  </div>
                </div>
              </div>

              <div class="bg-white overflow-hidden shadow border rounded-md border-gray-400">
                <loading :status="loading"></loading>
                <div class="px-2 py-3 sm:p-4">
                  <div class="text-sm font-medium truncate">
                    {{ $t('Total profit amount') }}
                  </div>
                  <div class="mt-1 font-semibold text-gray-900 text-xs">
                    {{ report.totla_profit_amount | currency }}
                  </div>
                </div>
              </div>
              <div class="bg-white overflow-hidden shadow border rounded-md border-gray-400">
                <loading :status="loading"></loading>
                <div class="px-2 py-3 sm:p-4">
                  <div class="text-sm font-medium truncate">
                    {{ $t('Total tax amount') }}
                  </div>
                  <div class="mt-1 font-semibold text-gray-900 text-xs">
                    {{ report.total_tax_amount | currency }}
                  </div>
                </div>
              </div>
              <div class="bg-white overflow-hidden shadow border rounded-md border-gray-400">
                <loading :status="loading"></loading>
                <div class="px-2 py-3 sm:p-4">
                  <div class="text-sm font-medium truncate">{{ $t('Total payable amount') }}</div>
                  <div class="mt-1 font-semibold text-gray-900 text-xs">
                    {{ report.total_payable_amount | currency }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 gap-6">
            <div class="content-card-body">
              <div class="p-4">
                <loading :status="loading"></loading>
                <template v-if="report.list.length">
                  <table class="min-w-full border-collapse block text-xs md:table">
                    <thead class="block md:table-header-group">
                      <tr class="border border-grey-500 md:border-none block md:table-row absolute -top-full md:top-auto rounded-left-full md:left-auto md:relative">
                        <th scope="col" class="py-2 px-3 font-semibold text-left text-gray-900 uppercase">
                          {{ $t('Tracking ID') }}
                        </th>
                        <th scope="col" class="py-2 px-3 font-semibold text-left text-gray-900 uppercase">
                          {{ $t('Customer') }}
                        </th>

                        <th scope="col" class="py-2 px-3 font-semibold text-left text-gray-900 uppercase">
                          {{ $t('Price') }}
                        </th>
                        <th scope="col" class="py-2 px-3 font-semibold text-left text-gray-900 uppercase">
                          {{ $t('Cost') }}
                        </th>
                        <th scope="col" class="py-2 px-3 font-semibold text-left text-gray-900 uppercase">
                          {{ $t('Dicount') }}
                        </th>

                        <th scope="col" class="py-2 px-3 font-semibold text-left text-gray-900 uppercase">
                          {{ $t('Profit') }}
                        </th>
                        <th scope="col" class="py-2 px-3 font-semibold text-left text-gray-900 uppercase">
                          {{ $t('Tax') }}
                        </th>
                        <th scope="col" class="py-2 px-3 font-semibold text-left text-gray-900 uppercase">
                          {{ $t('Payable') }}
                        </th>
                        <th scope="col" class="py-2 px-3 font-semibold text-left text-gray-900 uppercase">
                          {{ $t('Created at') }}
                        </th>
                        <th scope="col" class="py-2 px-3 font-semibold text-left text-gray-900 uppercase">
                          {{ $t('Updated at') }}
                        </th>
                      </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-400">
                      <tr v-for="(order, index) in report.list" :key="index">
                        <td class="px-3 py-1 w-3">
                          <barcode height="15" width="1" font-size="10" margin-top="1" margin-bottom="1" :value="order.tracking">
                            {{ order.tracking }}
                          </barcode>
                        </td>
                        <td class="px-3 py-1">
                          <template v-if="order.customer">
                            {{ order.customer.name | capitalize }}
                            {{ order.customer.email | capitalize }}
                          </template>
                        </td>

                        <td class="px-3 py-1">
                          {{ order.cart_total_price | currency }}
                        </td>
                        <td class="px-3 py-1">
                          {{ order.cart_total_cost | currency }}
                        </td>
                        <td class="px-3 py-1">
                          {{ order.discount_amount | currency }}
                        </td>
                        <td class="px-3 py-1">
                          {{ order.profit_after_all | currency }}
                        </td>
                        <td class="px-3 py-1">
                          {{ order.tax_amount | currency }}
                        </td>
                        <td class="px-3 py-1">
                          {{ order.payable_after_all | currency }}
                        </td>
                        <td class="px-3 py-1">
                          {{ order.created_at }}
                        </td>
                        <td class="px-3 py-1">
                          {{ order.updated_at }}
                        </td>
                      </tr>
                      <tr>
                        <th colspan="10" class="text-right">{{ $t('Total orders') }} :</th>
                        <td>{{ report.orders }}</td>
                      </tr>
                    </tbody>
                  </table>
                </template>
                <template v-else>
                  <div class="h-full flex-center">
                    <no-content />
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </main>
</template>
<script>
import { mapGetters } from 'vuex';
import VueBarcode from 'vue-barcode';
export default {
  name: 'report',
  metaInfo() {
    return {
      title: this.$i18n.t('Overall report'),
    };
  },
  components: {
    barcode: VueBarcode,
  },
  data() {
    return {
      loading: false,
      generatedAt: null,
      takerList: [],
      chefList: [],
      billerList: [],
      tableList: [],
      filters: {
        order_type: null,
        is_duration: null,
        table: null,
        startdate: null,
        enddate: null,
        taker: null,
        chef: null,
        biller: null,
      },
      report: {
        list: [],
      },
    };
  },
  mounted() {
    this.getFilters();
    this.generateReport();
  },

  computed: {
    ...mapGetters({
      orderTypes: 'app/getOrderTypes',
    }),
    anyFilter() {
      return (
        this.filters.table !== null ||
        this.filters.biller !== null ||
        this.filters.customer !== null ||
        this.filters.chef !== null ||
        this.filters.taker !== null ||
        this.filters.is_duration !== null ||
        this.filters.startdate !== null ||
        this.filters.enddate !== null
      );
    },
  },
  methods: {
    currentDateTime() {
      const current = new Date();
      const date = current.getFullYear() + '-' + (current.getMonth() + 1) + '-' + current.getDate();
      const time = current.getHours() + ':' + current.getMinutes() + ':' + current.getSeconds();
      const dateTime = date + ' ' + time;
      this.generatedAt = dateTime;
    },
    async printReport() {
      this.loading = true;
      await this.$htmlToPaper('repairContainer');
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
    letsUpdateReport() {
      this.generateReport();
    },
    getFilters() {
      axios.get(route('sale.filters')).then((response) => {
        this.tableList = response.data.tables;
        this.takerList = response.data.takers;
        this.chefList = response.data.chefs;
        this.billerList = response.data.billers;
      });
    },
    generateReport() {
      this.loading = true;
      axios
        .get(route('sale.report'), {
          params: this.filters,
        })
        .then((response) => {
          this.loading = false;
          this.report = response.data;
          this.currentDateTime();
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

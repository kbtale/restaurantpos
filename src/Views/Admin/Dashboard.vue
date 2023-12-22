<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.tachometer-alt-regular"></svg-vue>
          <h1 class="content-title">
            {{ $t('Dashboard') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button @click="reload" class="btn btn-app" type="button">
            <svg-vue class="w-4 h-4" icon="font-awesome.sync-regular"></svg-vue>
          </button>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-2 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-2 sm:grid-cols-3 text-cyan-900">
        <div class="bg-white overflow-hidden shadow border rounded-md border-gray-400">
          <loading :status="loading.states"></loading>
          <div class="px-2 py-3 sm:p-4">
            <div class="text-sm font-medium truncate">
              {{ $t('Total sale amount') }}
            </div>
            <div class="mt-1 font-semibold text-xs">
              {{ states.total_price_amount | currency }}
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow border rounded-md border-gray-400">
          <loading :status="loading.states"></loading>
          <div class="px-2 py-3 sm:p-4">
            <div class="text-sm font-medium truncate">{{ $t('Total cost amount') }}</div>
            <div class="mt-1 font-semibold text-xs">
              {{ states.total_cost_amount | currency }}
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow border rounded-md border-gray-400">
          <loading :status="loading.states"></loading>
          <div class="px-2 py-3 sm:p-4">
            <div class="text-sm font-medium truncate">{{ $t('Total discount amount') }}</div>
            <div class="mt-1 font-semibold text-xs">
              {{ states.total_discount_amount | currency }}
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow border rounded-md border-gray-400">
          <loading :status="loading.states"></loading>
          <div class="px-2 py-3 sm:p-4">
            <div class="text-sm font-medium truncate">
              {{ $t('Total profit amount') }}
            </div>
            <div class="mt-1 font-semibold text-xs">
              {{ states.totla_profit_amount | currency }}
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow border rounded-md border-gray-400">
          <loading :status="loading.states"></loading>
          <div class="px-2 py-3 sm:p-4">
            <div class="text-sm font-medium truncate">
              {{ $t('Total tax amount') }}
            </div>
            <div class="mt-1 font-semibold text-xs">
              {{ states.total_tax_amount | currency }}
            </div>
          </div>
        </div>
        <div class="bg-white overflow-hidden shadow border rounded-md border-gray-400">
          <loading :status="loading.states"></loading>
          <div class="px-2 py-3 sm:p-4">
            <div class="text-sm font-medium truncate">{{ $t('Total payable amount') }}</div>
            <div class="mt-1 font-semibold text-xs">
              {{ states.total_payable_amount | currency }}
            </div>
          </div>
        </div>
      </div>
      <div class="content-card-body mt-2">
        <div class="grid grid-cols-1 gap-3">
          <div class="flex flex-col bg-white shadow">
            <div class="flex justify-between p-4">
              <div class="content-title">
                {{ $t('Annual graphic view') }}
              </div>
            </div>
            <div class="p-2 pt-0">
              <loading :status="loading.chart"></loading>
              <line-chart :chart-data="chartData" :height="289" ref="chart"></line-chart>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
<script>
import LineChart from '@/Components/line-chart';
import { pickBy, identity } from 'lodash';

export default {
  name: 'dashboard',
  metaInfo() {
    return {
      title: this.$i18n.t('Admin dashboard'),
    };
  },
  components: { LineChart },
  data() {
    return {
      loading: {
        states: false,
        chart: false,
      },
      lineChartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      states: {},
    };
  },
  mounted() {
    this.reload();
  },
  computed: {
    chartData() {
      return {
        labels: [
          this.$t('Jan'),
          this.$t('Feb'),
          this.$t('Mar'),
          this.$t('Apr'),
          this.$t('May'),
          this.$t('Jun'),
          this.$t('Jul'),
          this.$t('Aug'),
          this.$t('Sept'),
          this.$t('Oct'),
          this.$t('Nov'),
          this.$t('Dec'),
        ],
        datasets: [
          {
            label: this.$i18n.t('Sales'),
            backgroundColor: '#0c4f64',
            data: this.lineChartData,
          },
        ],
      };
    },
  },

  methods: {
    reload() {
      this.getAnnualData();
      this.getStates();
    },
    getStates() {
      this.loading.states = true;
      axios
        .get(route('dashboard-states'))
        .then((response) => {
          this.loading.states = false;
          this.states = response.data;
        })
        .catch(() => {
          this.loading.states = false;
        });
    },
    getAnnualData() {
      this.loading.chart = true;
      axios
        .get(route('dashboard-ag'))
        .then((response) => {
          this.lineChartData = response.data;
          this.loading.chart = false;
        })
        .catch(() => {
          this.loading.chart = false;
        });
    },
  },
};
</script>

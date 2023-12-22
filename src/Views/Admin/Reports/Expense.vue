<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.file-invoice-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('Expense report') }}
          </h1>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body p-4" id="expense-report">
        <select @change="getExpenseData" v-model="report.year" class="mb-3 border px-2 py-1 rounded">
          <option value="2022">2022</option>
          <option value="2023">2023</option>
          <option value="2024">2024</option>
          <option value="2025">2025</option>
        </select>
        <line-chart :chart-data="chartData" :height="289" ref="chart"></line-chart>
      </div>
    </div>
  </main>
</template>
<script>
import LineChart from '@/Components/line-chart';
export default {
  name: 'Tax',
  metaInfo() {
    return {
      title: this.$i18n.t('Expense report'),
    };
  },
  components: { LineChart },
  data() {
    return {
      loading: false,
      lineChartData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      report: {
        year: 2023,
      },
    };
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
            label: this.$i18n.t('Expense amount'),
            backgroundColor: '#0c4f64',
            data: this.lineChartData,
          },
        ],
      };
    },
  },
  mounted() {
    this.getExpenseData();
  },
  methods: {
    getExpenseData() {
      this.loading = true;
      axios
        .post(route('expense.report'), this.report)
        .then((response) => {
          this.lineChartData = response.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

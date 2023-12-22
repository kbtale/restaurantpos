<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-1 max-w-1/6 mx-auto px-2">
      <loading :status="loading"></loading>
      <div class="p-2 bg-white mb-1 rounded shadow-md">
        <div class="grid grid-cols-3 lg:grid-cols-11 gap-1">
          <router-link to="/pos" class="text-center border border-gray-400 p-1 cursor-pointer hover:bg-gray-100 mb-1 rounded-md">
            <svg-vue class="content-title-icon mx-auto" icon="font-awesome.reply-all-solid"></svg-vue>
            <span class="text-xs">{{ $t('Back') }}</span>
          </router-link>
          <select v-model="filters.order_type" @change.prevent="getOrdersToPrepare" class="col-span-3 border border-gray-400 p-1 cursor-pointer mb-1 rounded-md px-2">
            <option :value="null">{{ $t('Display All Orders') }}</option>
            <option v-for="(tipe, index) in orderTypes" :key="index" :value="tipe.key">{{ $t('By Order Type') }} : {{ tipe.title }}</option>
          </select>
          <select
            @change.prevent="changeCol"
            id="orders_in_a_row"
            class="col-span-3 border border-gray-400 p-1 cursor-pointer mb-1 rounded-md px-2"
            v-model="orders_in_a_row"
          >
            <option disabled>{{ $t('Select order in a row') }}</option>
            <option value="1">{{ $t('In a row') }} : 1</option>
            <option value="2">{{ $t('In a row') }} : 2</option>
            <option value="3">{{ $t('In a row') }} : 3</option>
            <option value="4">{{ $t('In a row') }} : 4</option>
            <option value="5">{{ $t('In a row') }} : 5</option>
            <option value="6">{{ $t('In a row') }} : 6</option>
          </select>
          <select @change.prevent="changeBg" id="orders_bg" class="col-span-3 border border-gray-400 p-1 cursor-pointer mb-1 rounded-md px-2" v-model="orders_bg">
            <option disabled>{{ $t('Select order background') }}</option>
            <option value="bg-white">{{ $t('Background') }} : {{ $t('White') }}</option>
            <option value="bg-blue-50">{{ $t('Background') }} : {{ $t('Low blue') }}</option>
            <option value="bg-blue-100">{{ $t('Background') }} : {{ $t('Normal blue') }}</option>
            <option value="bg-blue-200">{{ $t('Background') }} : {{ $t('High blue') }}</option>
            <option value="bg-yellow-50">{{ $t('Background') }} : {{ $t('Low yellow') }}</option>
            <option value="bg-yellow-100">{{ $t('Background') }} : {{ $t('Normal yellow') }}</option>
            <option value="bg-yellow-200">{{ $t('Background') }} : {{ $t('High yellow') }}</option>
            <option value="bg-purple-50">{{ $t('Background') }} : {{ $t('Low purple') }}</option>
            <option value="bg-purple-100">{{ $t('Background') }} : {{ $t('Normal purple') }}</option>
            <option value="bg-purple-200">{{ $t('Background') }} : {{ $t('High purple') }}</option>
          </select>
          <button class="text-center border border-gray-400 p-1 cursor-pointer hover:bg-gray-100 mb-1 rounded-md" @click.prevent="getOrdersToPrepare">
            <svg-vue class="content-title-icon mx-auto" icon="font-awesome.sync-alt-solid"></svg-vue>
            <span class="text-xs">{{ $t('Reload') }}</span>
          </button>
        </div>
      </div>
      <template v-if="orders.length">
        <div :class="`py-2 text-cyan-900 grid grid-cols-1 md:grid-cols-${orders_in_a_row} gap-2 `">
          <div v-for="(order, index) in orders" :key="index" class="col-span-1 p-2 rounded-md mb-1 w-full shadow-md border-2 border border-cyan-900" :class="orders_bg">
            <div class="p-2">
              <div class="text-xs flex justify-between items-center">
                {{ $t('Type') }} :

                <span class="border px-2 py-1 bg-yellow-300 rounded"
                  >{{ decodeOrderType(order.order_type) }} {{ order.service_table ? '(' + order.service_table.title + ')' : '' }}</span
                >
              </div>
              <div class="text-xs flex justify-between">
                {{ $t('Customer') }} :
                <span>{{ order.customer.name }}</span>
              </div>
              <div class="text-xs flex justify-between">
                {{ $t('Created at') }} :
                <span>{{ order.took_at }}</span>
              </div>
              <div v-if="order.table" class="text-xs flex justify-between">
                {{ $t('Dinning table') }} :
                <span>{{ order.table.title }}({{ order.table.id }})</span>
              </div>
              <div class="flex justify-between">
                <strong>Order # {{ order.tracking }}</strong>
                <span>{{ $t('Progress') }} : {{ getProgress(order.items) }}%</span>
              </div>
            </div>
            <select @change="updatePreparation(order)" aria-label="Sort by" class="form-input my-1" id="chef" v-model="order.chef_id">
              <option :value="null" disabled>{{ $t('Select who is cooking') }}</option>
              <template v-for="(chef, index) in chefList">
                <option :key="index" :value="chef.id">{{ chef.name }} - {{ chef.email }}</option>
              </template>
            </select>
            <div class="w-full rounded-md bg-gray-200 h-2.5 md:flex">
              <div class="bg-cyan-900 h-2.5 rounded-md" :style="`width: ${getProgress(order.items)}%`"></div>
            </div>
            <div class="m1-2 text-xs text-gray-500 p-2">
              <div v-for="(item, index) in order.items" :key="item.cart_uuid" class="p-2">
                <div class="flex space-x-1 cursor-pointer">
                  <input
                    @change.prevent="updatePreparation(order)"
                    type="checkbox"
                    v-model="item.is_ready"
                    :id="item.cart_uuid"
                    class="cursor-pointer w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 focus:ring-2"
                  />
                  <label class="cursor-pointer" :for="item.cart_uuid">
                    <strong>{{ item.qty }} x {{ item.name }}</strong>
                  </label>
                </div>
                <ul class="ml-2 mt-1 product-topping">
                  <li v-for="(modifier, key) in item.modifiers" v-if="modifier.is_checked" :key="key">- {{ modifier.qty }} x {{ modifier.title }}</li>
                </ul>
                <template v-if="order.note_for_chef">
                  <div class="my-3 p-2">
                    <strong>{{ $t('Instructions') }}:</strong>
                    <p>{{ order.note_for_chef }}</p>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="select-none rounded flex flex-wrap content-center justify-center pt-24 opacity-25">
          <div class="w-full text-center">
            <svg-vue class="h-24 w-24 inline-block" icon="font-awesome.exclamation-triangle-duotone"></svg-vue>
            <p class="text-xl">
              {{ $t('Attention! record not found') }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </main>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
  name: 'kitchenDisplay',
  data() {
    return {
      orders_bg: 'bg-white',
      orders_in_a_row: 2,
      loading: false,
      orders: [],
      filters: {
        order_type: null,
      },
      chefList: [],
    };
  },
  mounted() {
    this.getOrdersToPrepare();
    this.orders_bg = localStorage.getItem('orders_bg') ?? 'bg-white';
    this.orders_in_a_row = localStorage.getItem('orders_in_a_row') ?? 2;
  },
  created() {
    setInterval(() => {
      this.autoSycro();
    }, 30000);
  },
  watch: {},
  computed: {
    ...mapGetters({
      orderTypes: 'app/getOrderTypes',
    }),
  },
  methods: {
    changeCol() {
      localStorage.setItem('orders_in_a_row', this.orders_in_a_row);
    },
    changeBg() {
      localStorage.setItem('orders_bg', this.orders_bg);
    },
    decodeOrderType(orderkey) {
      let data = {};
      this.orderTypes.forEach((item) => {
        if (item.key === orderkey) {
          data = item;
        }
      });
      return data.title;
    },
    updatePreparation(order) {
      order.progress = this.getProgress(order.items);
      this.loading = true;
      axios
        .post(route('pos.order-progress', order.uuid), order)
        .then((response) => {
          this.getOrdersToPrepare();
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    getProgress(items = []) {
      let ready = 0;
      items.forEach((item) => {
        item.is_ready ? ready++ : '';
      });
      return Math.round((ready / items.length) * 100);
    },
    autoSycro() {
      axios
        .get(route('pos.kitchen-orders'), {
          params: {
            ...this.filters,
          },
        })
        .then((response) => {
          this.loading = false;
          this.orders = response.data.orders;
          this.chefList = response.data.chefs;
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    getOrdersToPrepare() {
      this.loading = true;
      this.autoSycro();
    },
  },
};
</script>

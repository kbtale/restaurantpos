<template>
  <div>
    <loading :status="loading" />
    <div v-if="!loading">
      <div class="space-x-2 flex justify-between">
        <h2 class="w-full font-bold tracking-wider uppercase">
          <strong class="text-2xl">{{ app.name }}</strong>
          <small class="text-lg">
            <p v-if="app.phone">{{ app.phone }}</p>
            <p v-html="app.address"></p>
          </small>
        </h2>
      </div>
      <div class="flex items-center mt-2">
        <label class="min-w-32 block font-bold uppercase">{{ $t('Invoice date') }}</label>
        <span class="mr-4 inline-block">:</span>
        <div>{{ order.created_at }}</div>
      </div>
      <div class="flex items-center">
        <label class="min-w-32 block font-bold uppercase">{{ $t('Invoice ID') }}</label>
        <span class="mr-4 inline-block">:</span>
        #{{ order.tracking }} [ {{ order.id }} ]
      </div>
      <div class="flex items-center mb-2">
        <label class="min-w-32 block font-bold uppercase">{{ $t('Type') }}</label>
        <span class="mr-4 inline-block">:</span>
        {{ order.order_type | uppercase }}
      </div>
      <template v-if="order.customer">
        <div class="flex items-center">
          <label class="min-w-32 block font-bold uppercase">{{ $t('Customer name') }}</label>
          <span class="mr-4 inline-block">:</span>
          {{ order.customer.name }}
        </div>
        <div v-if="order.customer.email" class="flex items-center">
          <label class="min-w-32 block font-bold uppercase">{{ $t('Email') }}</label>
          <span class="mr-4 inline-block">:</span>
          {{ order.customer.email }}
        </div>
        <div v-if="order.customer.phone" class="flex items-center">
          <label class="min-w-32 block font-bold uppercase">{{ $t('Phone') }}</label>
          <span class="mr-4 inline-block">:</span>
          {{ order.customer.phone }}
        </div>
        <div v-if="order.customer.address" class="flex items-center">
          <label class="min-w-32 block font-bold uppercase">{{ order.order_type == 'dinning' ? $t('Address') : $t('Shipping to') }}</label>
          <span class="mr-4 inline-block">:</span>
          {{ order.customer.address }}
        </div>
      </template>
      <div class="flex items-center" v-if="order.tax.tax_id">
        <label class="min-w-32 block font-bold uppercase">{{ $t('Tax Identity') }} ({{ $t('VAT') }})</label>
        <span class="mr-4 inline-block">:</span>
        #{{ order.tax.tax_id }}
      </div>
      <div class="my-3 text-black">
        <ul role="lis" class="">
          <li v-for="(item, index) in order.items" :key="index" class="w-full mb-2 py-1 border-t border-black">
            <div class="flex">
              <div class="flex-1 flex flex-col">
                <div class="flex space-x-2 text-left text-xs font-medium text-gray-900">
                  <div class="truncate w-full text-black">
                    <h3>#{{ index + 1 }} - {{ item.name }}</h3>
                    <ul>
                      <li v-for="(modifier, key) in item.modifiers" v-if="modifier.is_checked" class="product-topping flex justify-between text-black">
                        <span>+ {{ modifier.title }}</span>
                        <span>{{ modifier.price | currency }} x {{ modifier.qty }}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="font-semibold text-black h-full border-black border-l w-36">
                    <p class="pl-1 product-topping text-black">{{ item.price | currency }} x {{ item.qty }}</p>
                    <p class="pl-1 product-topping text-black" v-if="item.modifiers_price > 0">{{ item.modifiers_price | currency }}</p>
                    <p class="border-t border-black text-black pl-1">
                      <strong>{{ item.sub_total | currency }}</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <template v-if="order.progress > 99">
        <div class="w-full mt-1 py-1 overflow-hidden">
          <div class="flex justify-between font-semibold">
            <p>{{ $t('Items') }}</p>
            <p>{{ order.items ? order.items.length : 0 }}</p>
          </div>
          <div class="flex justify-between font-semibold">
            <p>{{ $t('Subtotal') }}</p>
            <p>{{ order.cart_total_price | currency }}</p>
          </div>
        </div>

        <div class="w-full mb-1 mt-1 py-1 overflow-hidden">
          <div class="flex justify-between font-semibold">
            <p>{{ $t('Discount') }}(-)</p>
            <p>{{ order.discount_amount | currency }}</p>
          </div>
          <div class="flex justify-between font-semibold">
            <template v-if="order.tax.is_tax_fix">
              <p>{{ $t('Tax') }} ({{ order.tax.rate }} {{ $t('fix') }})</p>
            </template>
            <template v-else>
              <p>{{ $t('Tax') }} ({{ order.tax.rate }}{{ order.tax.is_tax_fix ? '' : '%' }}) (+)</p>
            </template>
            <p>{{ order.tax_amount | currency }}</p>
          </div>
          <div class="flex justify-between font-semibold">
            <p>{{ $t('Total payable') }}</p>
            <p>{{ order.payable_after_all | currency }}</p>
          </div>
        </div>
        <div class="pt-2">
          <div class="flex justify-between">
            <div class="font-bold flex-1">
              {{ $t('Signature') }}
            </div>
            <div class="font-sm">------------------------------</div>
          </div>
        </div>
        <div class="flex place-content-center barder">
          <barcode width="1" :value="order.tracking" class="self-center" height="15" />
        </div>
      </template>
      <template v-else>
        <p class="text-2xl text-center">{{ $t('Order in progress') }} : {{ order.progress }}%</p>
      </template>
    </div>
  </div>
</template>
<script>
import VueBarcode from 'vue-barcode';
import VueQRCodeComponent from 'vue-qrcode-component';

export default {
  name: 'sale-order',
  metaInfo() {
    return {
      title: this.$i18n.t('Print sale order'),
    };
  },
  components: {
    'qr-code': VueQRCodeComponent,
    barcode: VueBarcode,
  },
  computed: {
    app() {
      return this.$store.getters['app/getSettings'];
    },
  },
  data() {
    return {
      loading: false,
      order: {
        qr_link: null,
        discount: 0,
        shipping: 0,
        tax: {
          rate: 0,
          tax_id: null,
          is_tax_included: false,
          is_tax_fix: false,
        },
      },
    };
  },
  mounted() {
    this.getSaleOrder();
  },

  methods: {
    getSaleOrder() {
      this.loading = true;
      axios
        .get(route('print-sale', this.$route.params.uuid))
        .then((response) => {
          this.order = response.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.edit-regular"></svg-vue>
          <h1 class="content-title">
            {{ $t('Edit payment method') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button class="btn btn-red mx-1" type="button" @click="deletePaymentMethodModal = true">
            {{ $t('Delete') }}
          </button>
          <router-link class="btn btn-app mx-1" to="/admin/payment-methods">
            {{ $t('Back') }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <form @submit.prevent="updatePaymentMethod">
          <loading :status="loading"></loading>
          <div class="md:grid md:grid-cols-3 md:gap-3 px-4 py-5 sm:p-6">
            <div class="md:col-span-1">
              <h3 class="form-description-head">
                {{ $t('Payment method') }}
              </h3>
              <p class="form-description-text">{{ $t('Edit payment method detail and information') }}.</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-3 gap-3">
                <div class="col-span-3">
                  <label class="form-label" for="title">{{ $t('Title') }}</label>
                  <input :placeholder="$t('Title')" type="text" class="form-input" id="title" required v-model="payment.title" />
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <span class="inline-flex">
              <router-link class="btn btn-app shadow-sm mx-1" to="/admin/payment-methods">
                {{ $t('Cancel') }}
              </router-link>
              <button class="btn btn-success shadow-sm mx-1" type="submit">
                {{ $t('Save') }}
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
    <delete-model :show="deletePaymentMethodModal" @cancelled="deletePaymentMethodModal = false" @confirmed="deletePaymentMethod">
      <template #title>{{ $t('Delete payment method') }}</template>
      {{ $t('Are you sure you want to delete the payment method ?') }}
      {{ $t('All data will be permanently removed') }}.
    </delete-model>
  </main>
</template>
<script>
import confirmationModel from '@/Components/layout/admin/confirmation';

export default {
  name: 'Edit',
  metaInfo() {
    return {
      title: this.$i18n.t('Edit payment method'),
    };
  },
  components: {
    DeleteModel: confirmationModel,
  },
  data() {
    return {
      loading: true,
      deletePaymentMethodModal: false,
      payment: {
        title: null,
      },
    };
  },
  mounted() {
    this.getPaymentMethod();
  },
  methods: {
    deletePaymentMethod() {
      axios
        .delete(route('payment-methods.destroy', this.$route.params.id))
        .then((response) => {
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.$router.push('/admin/payment-methods');
        })
        .catch(() => {
          this.deletePaymentMethodModal = false;
        });
    },
    updatePaymentMethod() {
      this.loading = true;
      axios
        .put(route('payment-methods.update', this.$route.params.id), this.payment)
        .then((response) => {
          this.loading = false;
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
    getPaymentMethod() {
      this.loading = true;
      axios
        .get(route('payment-methods.show', this.$route.params.id))
        .then((response) => {
          this.payment = response.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

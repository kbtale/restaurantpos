<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.edit-regular"></svg-vue>
          <h1 class="content-title">
            {{ $t('Edit ingredient') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button @click="deleteIngredientModal = true" class="btn btn-red mx-1" type="button">
            {{ $t('Delete') }}
          </button>
          <router-link class="btn btn-app mx-1" to="/admin/ingredients">
            {{ $t('Back') }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <loading :status="loading"></loading>
        <form @submit.prevent="updateIngredient">
          <div class="md:grid md:grid-cols-3 md:gap-6 px-4 py-5 sm:p-6">
            <div class="md:col-span-1">
              <h3 class="form-description-head">
                {{ $t('ingredient information') }}
              </h3>
              <p class="form-description-text">{{ $t('Enter information for new product ingredient') }}.</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-3 gap-6">
                <div class="col-span-3">
                  <label class="form-label" for="name">{{ $t('Name') }}</label>
                  <div class="pt-1">
                    <input :placeholder="$t('Name')" class="form-input" id="name" required v-model="ingredient.name" />
                  </div>
                </div>
                <div class="col-span-3 md:flex md:space-x-2">
                  <div class="w-full">
                    <label class="form-label" for="cost">{{ $t('Cost') }}</label>
                    <input type="number" :placeholder="$t('Cost')" class="form-input" min="0" id="cost" v-model="ingredient.cost" />
                  </div>
                  <div class="w-full">
                    <label class="form-label" :placeholder="$t('Price')" for="price">{{ $t('Price') }}</label>
                    <input type="number" class="form-input" min="0" id="price" v-model="ingredient.price" />
                  </div>
                  <div class="w-full">
                    <label class="form-label" :placeholder="$t('Unit')" for="unit">{{ $t('Uinit') }}</label>
                    <input type="text" class="form-input" min="0" id="unit" v-model="ingredient.unit" />
                  </div>
                </div>
                <div class="col-span-3 md:flex md:space-x-2">
                  <div class="w-full">
                    <label class="form-label" for="quantity">{{ $t('Availible Quantity') }}</label>
                    <input type="number" class="form-input" :placeholder="$t('Availible Quantity')" min="0" id="quantity" v-model="ingredient.quantity" />
                  </div>
                  <div class="w-full">
                    <label class="form-label" for="alert_quantity">{{ $t('Quantity alert') }}</label>
                    <input type="number" :placeholder="$t('Quantity alert')" class="form-input" min="0" id="alert_quantity" v-model="ingredient.alert_quantity" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="inline-flex">
              <router-link class="btn btn-app shadow-sm mx-1" to="/admin/ingredients">{{ $t('Cancel') }}</router-link>
              <button class="btn btn-green shadow-sm" type="submit">
                {{ $t('Update') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <delete-model :show="deleteIngredientModal" @cancelled="deleteIngredientModal = false" @confirmed="deleteIngredient">
      <template #title>{{ $t('Delete ingredient') }}</template>
      {{ $t('Are you sure you want to delete the ingredient ?') }}
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
      title: this.$i18n.t('Edit ingredient'),
    };
  },
  components: {
    DeleteModel: confirmationModel,
  },
  data() {
    return {
      loading: true,
      deleteIngredientModal: false,
      ingredient: {
        name: null,
        price: 1,
        cost: 0,
        quantity: 1,
        alert_quantity: 25,
        unit: null,
      },
    };
  },
  mounted() {
    this.getIngredient();
  },
  methods: {
    updateIngredient() {
      this.loading = true;
      axios
        .patch(route('ingredients.update', this.$route.params.id), this.ingredient)
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
    getIngredient() {
      this.loading = true;
      axios
        .get(route('ingredients.show', this.$route.params.id))
        .then((response) => {
          this.ingredient = response.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    deleteIngredient() {
      axios
        .delete(route('ingredients.destroy', this.$route.params.id))
        .then((response) => {
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.$router.push('/admin/ingredients');
        })
        .catch(() => {
          this.deleteIngredientModal = false;
        });
    },
  },
};
</script>

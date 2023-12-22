<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.edit-regular"></svg-vue>
          <h1 class="content-title">
            {{ $t('Edit food item') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button @click="deleteProductModal = true" class="btn btn-red mx-1" type="button">
            {{ $t('Delete') }}
          </button>
          <router-link class="btn btn-app mx-1" to="/admin/products">
            {{ $t('Back') }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <loading :status="loading"></loading>
        <form @submit.prevent="updateProduct">
          <div class="md:grid md:grid-cols-3 md:gap-4 px-4 py-5 sm:p-6">
            <div class="md:col-span-1">
              <h3 class="form-description-head">
                {{ $t('Food item information') }}
              </h3>
              <p class="form-description-text">{{ $t('Enter information for new food item with ingredients') }}.</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-3 gap-6">
                <div class="col-span-3">
                  <label class="form-label" for="name">{{ $t('Name') }}</label>
                  <div class="pt-1">
                    <input :placeholder="$t('Name')" class="form-input" id="name" required v-model="product.name" />
                  </div>
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="food_category_id">{{ $t('Category') }}</label>
                  <div class="pt-1">
                    <select class="form-input bg-white" id="food_category_id" required v-model="product.food_category_id">
                      <option :value="null" disabled>
                        {{ $t('Select an option') }}
                      </option>
                      <option :key="index" :value="category.id" v-for="(category, index) in foodCategories">
                        {{ category.name }}
                      </option>
                    </select>
                  </div>
                </div>

                <div class="col-span-3">
                  <label for="description" class="form-label">{{ $t('Description') }}</label>
                  <textarea class="form-input" v-model="product.description" rows="3" id="description"></textarea>
                </div>

                <div class="col-span-3">
                  <label class="form-label" for="image">{{ $t('Image') }}</label>
                  <image-input :remove="false" id="image" v-model="image"></image-input>
                </div>
                <div class="col-span-3">
                  <ingredient-consumption @updated="uplink($event)" :item="product" />
                </div>
                <div class="col-span-3 md:flex md:space-x-2">
                  <div class="w-full">
                    <label class="form-label" for="cost">{{ $t('Cost') }}</label>
                    <div class="pt-1">
                      <input :placeholder="$t('Cost')" type="number" step="0.01" class="form-input" id="name" required v-model="product.cost" />
                    </div>
                  </div>
                  <div class="w-full">
                    <label class="form-label" for="price">{{ $t('Price') }}</label>
                    <div class="pt-1">
                      <input :placeholder="$t('Price')" type="number" step="0.01" class="form-input" id="name" required v-model="product.price" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="inline-flex">
              <router-link class="btn btn-app shadow-sm mx-1" to="/admin/products">{{ $t('Cancel') }}</router-link>
              <button class="btn btn-green shadow-sm" type="submit">
                {{ $t('Update') }}
              </button>
            </div>
          </div>
        </form>
        <delete-model :show="deleteProductModal" @cancelled="deleteProductModal = false" @confirmed="deleteProduct">
          <template #title>{{ $t('Delete automated response') }}</template>
          {{ $t('Are you sure you want to delete?') }}
        </delete-model>
      </div>
    </div>
  </main>
</template>
<script>
import confirmationModel from '@/Components/layout/admin/confirmation';
import IngredientConsumption from '@/Components/ingredient-consumption';
export default {
  name: 'Edit',
  metaInfo() {
    return {
      title: this.$i18n.t('Edit product'),
    };
  },
  components: {
    DeleteModel: confirmationModel,
    'ingredient-consumption': IngredientConsumption,
  },
  data() {
    return {
      loading: false,
      deleteProductModal: false,
      foodCategories: [],
      product: {
        ingredients: [],
        name: null,
        food_category_id: null,
      },
      image: { file: null, preview: null },
    };
  },

  mounted() {
    this.getProduct();
    this.getFoodCategories();
  },
  methods: {
    uplink(e) {
      this.product = e;
    },
    getFoodCategories() {
      this.loading = true;
      axios
        .get(route('food.categories'))
        .then((response) => {
          this.foodCategories = response.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    onChangeFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    getProduct() {
      this.loading = true;
      axios
        .get(route('food-items.show', this.$route.params.uuid))
        .then((response) => {
          this.product = response.data;
          this.product.food_category_id = response.data.category.id;
          this.image.preview = response.data.image;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    deleteProduct() {
      axios
        .delete(route('food-items.destroy', this.$route.params.uuid))
        .then((response) => {
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.$router.push('/admin/products');
        })
        .catch(() => {
          this.deleteProductModal = false;
        });
    },
    updateProduct() {
      this.loading = true;
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('name', this.product.name);
      formData.append('price', this.product.price);
      formData.append('food_category_id', this.product.food_category_id);
      formData.append('description', this.product.description);
      formData.append('cost', this.product.cost);
      formData.append('ingredients', JSON.stringify(this.product.ingredients));
      if (this.image.file) {
        formData.append('image', this.image.file);
      }
      axios
        .post(route('food-items.update', this.$route.params.uuid), formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
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
  },
};
</script>

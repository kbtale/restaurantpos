<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.edit-regular"></svg-vue>

          <h1 class="content-title">
            {{ $t('Edit category') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button @click="deleteCategoryModal = true" class="btn btn-red mx-1" type="button">
            {{ $t('Delete') }}
          </button>
          <router-link class="btn btn-app mx-1" to="/admin/categories">
            {{ $t('Back') }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <loading :status="loading"></loading>
        <form @submit.prevent="updateCategory">
          <div class="md:grid md:grid-cols-3 md:gap-4 px-4 py-5 sm:p-6">
            <div class="md:col-span-1">
              <h3 class="form-description-head">
                {{ $t('Category information') }}
              </h3>
              <p class="form-description-text">{{ $t('Edit information for product category') }}.</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-3 gap-6">
                <div class="col-span-3">
                  <label class="form-label" for="name">{{ $t('Name') }}</label>
                  <div class="pt-1">
                    <input :placeholder="$t('Name')" class="form-input" id="name" required v-model="category.name" />
                  </div>
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="image">{{ $t('Image') }}</label>
                  <image-input :remove="false" id="image" v-model="image"></image-input>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="inline-flex">
              <router-link class="btn btn-app shadow-sm mx-1" to="/admin/categories">{{ $t('Cancel') }}</router-link>
              <button class="btn btn-green shadow-sm" type="submit">
                {{ $t('Update') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
    <category-delete-model :show="deleteCategoryModal" @cancelled="deleteCategoryModal = false" @confirmed="deleteCategory">
      <template #title>{{ $t('Delete category') }}</template>
      {{ $t('Are you sure you want to delete the category ?') }}
      {{ $t('All data will be permanently removed') }}.
    </category-delete-model>
  </main>
</template>
<script>
import confirmationModel from '@/Components/layout/admin/confirmation';
export default {
  name: 'Edit',
  metaInfo() {
    return {
      title: this.$i18n.t('Edit category'),
    };
  },
  components: {
    CategoryDeleteModel: confirmationModel,
  },
  data() {
    return {
      loading: true,
      deleteCategoryModal: false,
      category: {
        name: null,
      },
      image: { file: null, preview: null },
    };
  },
  mounted() {
    this.getCategory();
  },
  methods: {
    updateCategory() {
      this.loading = true;
      const formData = new FormData();
      formData.append('_method', 'PUT');
      formData.append('name', this.category.name);
      if (this.image.file) {
        formData.append('image', this.image.file);
      }
      axios
        .post(route('food-categories.update', this.$route.params.id), formData, {
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
    getCategory() {
      this.loading = true;
      axios
        .get(route('food-categories.show', this.$route.params.id))
        .then((response) => {
          this.category = response.data;
          this.image.preview = this.category.image;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    deleteCategory() {
      axios
        .delete(route('food-categories.destroy', this.$route.params.id))
        .then((response) => {
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.$router.push('/admin/categories');
        })
        .catch(() => {
          this.deleteCategoryModal = false;
        });
    },
  },
};
</script>

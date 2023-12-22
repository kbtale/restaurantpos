<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.plus-circle-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('Add food modifier') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <router-link class="btn btn-app" to="/admin/modifiers">
            {{ $t('Back') }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <loading :status="loading"></loading>
        <form @submit.prevent="saveModifier">
          <div class="md:grid md:grid-cols-3 md:gap-4 px-4 py-5 sm:p-6">
            <div class="md:col-span-1">
              <h3 class="form-description-head">
                {{ $t('Food modifier information') }}
              </h3>
              <p class="form-description-text">{{ $t('Enter information for new food modifier with ingredients') }}.</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-3 gap-6">
                <div class="col-span-3">
                  <label class="form-label" for="title">{{ $t('Title') }}</label>
                  <div class="pt-1">
                    <input :placeholder="$t('Title')" class="form-input" id="title" required v-model="modifier.title" />
                  </div>
                </div>

                <div class="col-span-3">
                  <ingredient-consumption @updated="uplink($event)" :item="modifier" />
                </div>
                <div class="col-span-3 md:flex md:space-x-2">
                  <div class="w-full">
                    <label class="form-label" for="cost">{{ $t('Cost') }}</label>
                    <div class="pt-1">
                      <input :placeholder="$t('Cost')" type="number" step="0.01" class="form-input" id="cost" required v-model="modifier.cost" />
                    </div>
                  </div>
                  <div class="w-full">
                    <label class="form-label" for="price">{{ $t('Price') }}</label>
                    <div class="pt-1">
                      <input :placeholder="$t('Price')" type="number" step="0.01" class="form-input" id="price" required v-model="modifier.price" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="inline-flex">
              <router-link class="btn btn-app shadow-sm mx-1" to="/admin/modifiers">{{ $t('Cancel') }}</router-link>
              <button class="btn btn-green shadow-sm" type="submit">
                {{ $t('Save') }}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
<script>
import IngredientConsumption from '@/Components/ingredient-consumption';
export default {
  name: 'New',
  metaInfo() {
    return {
      title: this.$i18n.t('Create modifier'),
    };
  },
  components: {
    'ingredient-consumption': IngredientConsumption,
  },
  data() {
    return {
      loading: false,
      modifier: {
        ingredients: [],
        title: null,
        price: 1,
      },
    };
  },

  methods: {
    uplink(e) {
      this.modifier = e;
    },
    saveModifier() {
      this.loading = true;
      axios
        .post(route('modifiers.store'), this.modifier)
        .then((response) => {
          this.loading = false;
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.$router.push(`/admin/modifiers`);
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

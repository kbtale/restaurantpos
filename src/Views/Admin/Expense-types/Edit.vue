<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.edit-regular"></svg-vue>
          <h1 class="content-title">
            {{ $t('Edit expense type') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button @click="deleteTypeModal = true" class="btn btn-red mx-1" type="button">
            {{ $t('Delete') }}
          </button>
          <router-link class="btn btn-app mx-1" to="/admin/expense-types">
            {{ $t('Back') }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <loading :status="loading"></loading>
        <form @submit.prevent="updateExpenseType">
          <div class="md:grid md:grid-cols-3 md:gap-3 px-4 py-5 sm:p-6">
            <div class="md:col-span-1">
              <h3 class="form-description-head">
                {{ $t('Expense type title') }}
              </h3>
              <p class="form-description-text">{{ $t('Expense type information') }}.</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-3 gap-3">
                <div class="col-span-3">
                  <label class="form-label" for="title">{{ $t('Table title') }}</label>
                  <input :placeholder="$t('Table title')" type="text" class="form-input" id="title" required v-model="type.title" />
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <span class="inline-flex">
              <router-link class="btn btn-app mx-2" to="/admin/expense-types">{{ $t('Cancel') }}</router-link>
              <button class="btn btn-green" type="submit">
                {{ $t('Update') }}
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
    <delete-model :show="deleteTypeModal" @cancelled="deleteTypeModal = false" @confirmed="deleteExpenseType">
      <template #title>{{ $t('Delete expense type') }}</template>
      {{ $t('Are you sure you want to delete the expense type ?') }}
      {{ $t('All data will be permanently removed') }}.
    </delete-model>
  </main>
</template>
<script>
import confirmationModel from '@/Components/layout/admin/confirmation';
export default {
  name: 'edit',
  metaInfo() {
    return {
      title: this.$i18n.t('Edit expense type'),
    };
  },
  components: {
    DeleteModel: confirmationModel,
  },
  data() {
    return {
      loading: true,
      deleteTypeModal: false,
      type: {
        title: null,
      },
    };
  },
  mounted() {
    this.getExpenseType();
  },
  methods: {
    updateExpenseType() {
      this.loading = true;
      axios
        .put(route('expense-types.update', this.$route.params.uuid), this.type)
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
    getExpenseType() {
      this.loading = true;
      axios
        .get(route('expense-types.show', this.$route.params.uuid))
        .then((response) => {
          this.type = response.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    deleteExpenseType() {
      axios
        .delete(route('expense-types.destroy', this.$route.params.uuid))
        .then((response) => {
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.$router.push('/admin/expense-types');
        })
        .catch(() => {
          this.deleteTypeModal = false;
        });
    },
  },
};
</script>

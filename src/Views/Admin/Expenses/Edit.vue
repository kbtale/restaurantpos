<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.edit-regular"></svg-vue>
          <h1 class="content-title">
            {{ $t('Edit expense') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button @click="deleteExpenseModal = true" class="btn btn-red mx-1" type="button">
            {{ $t('Delete') }}
          </button>
          <router-link class="btn btn-app mx-1" to="/admin/expenses">
            {{ $t('Back') }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <loading :status="loading"></loading>
        <form @submit.prevent="updateExpense">
          <div class="md:grid md:grid-cols-3 md:gap-6 px-4 py-5 sm:p-6">
            <div class="md:col-span-1">
              <h3 class="form-description-head">
                {{ $t('Expense details') }}
              </h3>
              <p class="form-description-text">{{ $t('This information will be displayed publicly') }}.</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-3 gap-6">
                <div class="col-span-3">
                  <label class="form-label" for="title">{{ $t('Title') }}</label>
                  <div class="pt-1">
                    <input :placeholder="$t('Title')" class="form-input" id="title" required v-model="expense.title" />
                  </div>
                </div>
                <div class="col-span-3 md:flex md:space-x-2">
                  <div class="w-full">
                    <label class="form-label" for="amount">{{ $t('Amount') }}</label>
                    <div class="pt-1">
                      <input :placeholder="$t('Amount')" min="0" type="number" class="form-input" id="amount" v-model="expense.amount" />
                    </div>
                  </div>
                  <div class="w-full">
                    <label class="form-label" for="expense_type_id">{{ $t('Expense type') }}</label>
                    <div class="pt-1">
                      <select class="form-input" id="expense_type_id" v-model="expense.expense_type_id">
                        <option :value="null">{{ $t('Select an option') }}</option>
                        <option v-for="(type, index) in types" :key="index" :value="type.id">{{ type.title }}</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="col-span-3">
                  <label class="form-label" for="description">{{ $t('Description') }}</label>
                  <textarea :placeholder="$t('Description')" class="form-input" id="description" v-model="expense.description"> </textarea>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <span class="inline-flex">
              <router-link class="btn btn-app mx-1" to="/admin/expenses">{{ $t('Cancel') }}</router-link>
              <button class="btn btn-green mx-1" type="submit">
                {{ $t('Update') }}
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
    <delete-model :show="deleteExpenseModal" @cancelled="deleteExpenseModal = false" @confirmed="deleteExpense">
      <template #title>{{ $t('Delete expense') }}</template>
      {{ $t('Are you sure you want to delete the expense ?') }}
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
      title: this.$i18n.t('Edit expense'),
    };
  },
  components: {
    DeleteModel: confirmationModel,
  },
  data() {
    return {
      loading: true,
      deleteExpenseModal: false,
      types: [],
      expense: {
        name: null,
        email: null,
        phone: null,
        address: null,
      },
    };
  },
  mounted() {
    this.getExpense();
    this.getExpenseTypes();
  },
  methods: {
    getExpenseTypes() {
      this.loading = true;
      axios.get(route('expense-types.list')).then((response) => {
        this.types = response.data;
        this.loading = false;
      });
    },
    updateExpense() {
      this.loading = true;
      axios
        .put(route('expenses.update', this.$route.params.uuid), this.expense)
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
    getExpense() {
      this.loading = true;
      axios
        .get(route('expenses.show', this.$route.params.uuid))
        .then((response) => {
          this.expense = response.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    deleteExpense() {
      axios
        .delete(route('expenses.destroy', this.$route.params.uuid))
        .then((response) => {
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.$router.push('/admin/expenses');
        })
        .catch(() => {
          this.deleteExpenseModal = false;
        });
    },
  },
};
</script>

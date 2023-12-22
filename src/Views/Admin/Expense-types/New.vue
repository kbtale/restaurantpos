<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.plus-circle-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('Add expense type') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <router-link class="btn btn-app" to="/admin/expense-types">
            {{ $t('Back') }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <form @submit.prevent="saveExpenseType">
          <loading :status="loading"></loading>
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
              <router-link class="btn btn-app shadow-sm mx-1" to="/admin/expense-types">
                {{ $t('Cancel') }}
              </router-link>
              <button class="btn btn-app shadow-sm" type="submit">
                {{ $t('Save') }}
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: 'New',
  metaInfo() {
    return {
      title: this.$i18n.t('New expense type'),
    };
  },
  data() {
    return {
      loading: false,
      type: {
        title: null,
      },
    };
  },
  methods: {
    saveExpenseType() {
      this.loading = true;
      axios
        .post(route('expense-types.store'), this.type)
        .then((response) => {
          this.loading = false;
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.$router.push(`/admin/expense-types`);
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

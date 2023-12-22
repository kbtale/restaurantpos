<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.stream-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('Food modifiers') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <router-link class="btn btn-app" to="/admin">
            {{ $t('Back') }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <loading :status="loading"></loading>
        <div class="p-4">
          <div class="w-full flex item-center justify-between">
            <div tabindex="0" class="focus:outline-none text-base sm:text-lg md:text-xl leading-normal text-gray-800">
              <input type="text" id="search" v-model="filters.search" :placeholder="$t('Search')" @change="getFoodModifiers" class="form-input" />
            </div>
            <div class="flex items-center space-x-3">
              <p>{{ $t('Sort By:') }}</p>
              <div class="flex border-2 border-gray-300 rounded-md">
                <select @change="changeSort" aria-label="Sort by" class="form-input border-none" id="status" v-model="sort.column">
                  <option value="name">{{ $t('Name') }}</option>
                  <option value="created_at">{{ $t('Created at') }}</option>
                  <option value="updated_at">{{ $t('Updated at') }}</option>
                </select>
                <button @click="changeSort" class="flex text-gray-800 font-bold px-2 form-input border-none bg-white" type="button">
                  <svg-vue class="h-4 w-4 text-gray-700" icon="font-awesome.sort-amount-down-alt-regular" v-show="sort.order === 'asc'"></svg-vue>
                  <svg-vue class="h-4 w-4 text-gray-700" icon="font-awesome.sort-amount-up-alt-regular" v-show="sort.order === 'desc'"></svg-vue>
                  <span class="ml-2">{{ $t('Sort') }}</span>
                </button>
              </div>
            </div>
          </div>
          <div class="bg-white py-2">
            <div class="bg-gray-100 p-2 mb-2 border sm:flex items-center justify-between">
              <div class="flex md:space-x-2">
                <template v-if="isThereSelectedRow">
                  <button class="btn btn-red" @click.prevent="modifierDeleteModel = true">{{ $t('Delete') }}</button>
                </template>
                <template v-else>
                  <router-link to="/admin/modifiers/new" class="btn btn-app">
                    {{ $t('Add') }}
                  </router-link>
                </template>
              </div>
            </div>
            <div class="overflow-x-auto bg-white">
              <loading :status="loading"></loading>
              <template v-if="modifierList.length">
                <table class="w-full whitespace-nowrap">
                  <tbody>
                    <tr
                      v-for="(modifier, index) in modifierList"
                      :key="index"
                      tabindex="0"
                      class="ffocus:outline-none h-16 border-b border-cyan-900 rounded hover:bg-gray-100"
                    >
                      <td class="pl-4 py-2 items-center">
                        <input
                          :id="'modifier-' + modifier.id"
                          aria-label="Checkbox"
                          :value="modifier.id"
                          @click.stop
                          class="form-checkbox border cursor-pointer h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                          type="checkbox"
                          v-model="selectedRows"
                        />
                      </td>
                      <td class="flex py-2 items-center">
                        <div class="px-2">
                          <p class="text-base font-medium text-xlleading-none text-gray-700">
                            {{ modifier.title }}
                          </p>
                          <span class="text-xs text-gray-400">{{ modifier.created_at }}</span>
                        </div>
                      </td>
                      <td class="py-2 items-center">
                        <p class="text-base font-medium text-xlleading-none text-gray-700">
                          {{ modifier.cost | currency }}
                        </p>
                        <span class="text-xs text-gray-400">{{ $t('Cost') }}</span>
                      </td>
                      <td class="py-2 items-center">
                        <p class="text-base font-medium text-xlleading-none text-gray-700">
                          {{ modifier.price | currency }}
                        </p>
                        <span class="text-xs text-gray-400">{{ $t('Price') }}</span>
                      </td>

                      <td class="py-2 items-center">
                        <router-link :to="`/admin/modifiers/${modifier.id}/edit`" class="bg-cyan-900 hover:bg-cyan-800 text-white rounded text-sm py-3 px-5 rounded">
                          {{ $t('View') }}
                        </router-link>
                      </td>
                    </tr>
                    <tr class="h-3"></tr>
                  </tbody>
                </table>
              </template>
              <template v-else>
                <no-content :search="filters.search" />
              </template>
              <nav class="bg-gray-100 px-4 py-3 flex items-center justify-between sm:px-6">
                <div class="hidden sm:block">
                  <p class="text-sm leading-5 text-gray-700">
                    {{ $t('Per page') }}
                    <select @change="getFoodModifiers" class="border-none py-1 px-2 mr-10" v-model="perPage">
                      <option value="1">1</option>
                      <option value="3">3</option>
                      <option value="5">5</option>
                      <option value="10">10</option>
                      <option value="25">25</option>
                      <option value="50">50</option>
                      <option value="100">100</option>
                      <option value="150">150</option>
                    </select>
                    {{ $t('Showing') }}
                    <span class="font-medium">{{ pagination.perPage * pagination.currentPage - pagination.perPage + 1 }}</span>
                    {{ $t('to') }}
                    <span class="font-medium">{{
                      pagination.perPage * pagination.currentPage <= pagination.total ? pagination.perPage * pagination.currentPage : pagination.total
                    }}</span>
                    {{ $t('of') }}
                    <span class="font-medium">{{ pagination.total }}</span>
                    {{ $t('results') }}
                  </p>
                </div>
                <div class="flex-1 flex justify-between sm:justify-end">
                  <button
                    :class="pagination.currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''"
                    :disabled="pagination.currentPage <= 1"
                    @click="changePage(pagination.currentPage - 1)"
                    class="pagination-link"
                    type="button"
                  >
                    {{ $t('Previous') }}
                  </button>
                  <button
                    :class="pagination.currentPage >= pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''"
                    :disabled="pagination.currentPage >= pagination.totalPages"
                    @click="changePage(pagination.currentPage + 1)"
                    class="ml-3 pagination-link"
                    type="button"
                  >
                    {{ $t('Next') }}
                  </button>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
    <modifier-delete-model :show="modifierDeleteModel" @cancelled="modifierDeleteModel = false" @confirmed="deleteModifierRows">
      <template #title>{{ $t('Delete selected rows') }}</template>
      {{ $t('The product under selected modifiers will be removed as well') }}.
      {{ $t('Are you sure you want to delete the selected food modifiers ?') }}
    </modifier-delete-model>
  </main>
</template>
<script>
import confirmationModel from '@/Components/layout/admin/confirmation';

export default {
  name: 'list',
  metaInfo() {
    return {
      title: this.$i18n.t('Food modifiers'),
    };
  },
  components: {
    ModifierDeleteModel: confirmationModel,
  },
  data() {
    return {
      page: 1,
      modifierDeleteModel: false,
      sort: {
        order: 'asc',
        column: 'created_at',
      },
      filters: {
        search: null,
      },
      selectedRows: [],
      perPage: 10,
      loading: false,
      pagination: {
        currentPage: 0,
        perPage: 0,
        total: 0,
        totalPages: 0,
      },
      modifierList: [],
    };
  },
  mounted() {
    this.getFoodModifiers();
  },
  computed: {
    isThereSelectedRow() {
      return this.selectedRows.length ? true : false;
    },
  },
  methods: {
    deleteModifierRows() {
      this.loading = true;
      this.modifierDeleteModel = false;
      axios
        .delete(route('modifiers.rows.destroy', { rows: this.selectedRows }))
        .then((response) => {
          this.selectedRows = [];
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.getFoodModifiers();
        })
        .catch(() => {
          this.loading = false;
          this.modifierDeleteModel = false;
        });
    },
    changePage(page) {
      if (page > 0 && page <= this.pagination.totalPages && page !== this.page) {
        this.page = page;
        this.getFoodModifiers();
      }
    },
    changeSort() {
      if (this.sort.order === 'asc') {
        this.sort.order = 'desc';
      } else if (this.sort.order === 'desc') {
        this.sort.order = 'asc';
      }
      this.getFoodModifiers();
    },

    getFoodModifiers() {
      this.loading = true;
      axios
        .get(route('modifiers.index'), {
          params: {
            page: this.page,
            sort: this.sort,
            perPage: this.perPage,
            ...this.filters,
          },
        })
        .then((response) => {
          this.modifierList = response.data.items;
          this.pagination = response.data.pagination;
          if (this.pagination.totalPages < this.pagination.currentPage) {
            this.page = this.pagination.totalPages;
            this.getFoodModifiers();
          } else {
            this.loading = false;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

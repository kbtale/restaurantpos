<template>
  <main class="flex-1 relative focus:outline-none" tabindex="0">
    <loading :status="loading"></loading>
    <div class="max-w-1/6 mx-auto p-2">
      <div class="p-2 bg-white mb-1 rounded">
        <div class="grid sm:grid-cols-3 md:grid-cols-12 gap-2">
          <router-link to="/" class="text-center border border-gray-400 p-1 cursor-pointer hover:bg-gray-100 mb-1 rounded-md">
            <svg-vue class="content-title-icon mx-auto" icon="font-awesome.reply-all-solid"></svg-vue>
            <span class="text-xs">{{ $t('Back') }}</span>
          </router-link>
          <button class="text-center border border-gray-400 p-1 cursor-pointer hover:bg-gray-100 mb-1 rounded-md" @click.prevent="loadAll(true)">
            <svg-vue class="content-title-icon mx-auto" icon="font-awesome.times-circle-light"></svg-vue>
            <span class="text-xs">{{ $t('Clear All') }}</span>
          </button>
          <select v-model="sale.order_type" class="col-span-3 border border-gray-400 p-1 cursor-pointer mb-1 rounded-md px-2">
            <option :value="null" disabled>{{ $t('Select order type') }}</option>
            <option v-for="(tipe, index) in orderTypes" :key="index" :value="tipe.key">{{ $t('Order Type') }} : {{ tipe.title }}</option>
          </select>

          <input
            type="text"
            v-model="filters.search"
            @change.prevent="makeSearch"
            class="col-span-3 border border-gray-400 p-1 cursor-pointer mb-1 rounded-md px-2"
            :placeholder="$t('Search product by names')"
          />

          <button class="text-center border border-gray-400 p-1 cursor-pointer hover:bg-gray-100 mb-1 rounded-md" @click.prevent="models.notesModel = true">
            <svg-vue class="content-title-icon mx-auto" icon="font-awesome.file-alt-regular"></svg-vue>
            <span class="text-xs">{{ $t('Notes') }}</span>
          </button>

          <button
            type="button"
            v-if="sale.progress > 99"
            @click.prevent="processCheckout"
            class="text-center border border-gray-400 p-1 cursor-pointer hover:bg-gray-100 mb-1 rounded-md"
          >
            <svg-vue class="content-title-icon mx-auto" icon="font-awesome.save-solid"></svg-vue>
            <span class="text-xs"> {{ $t('Payment') }} </span>
          </button>

          <router-link v-if="!sale.uuid" to="/kitchen-display" class="text-center border border-gray-400 p-1 cursor-pointer hover:bg-gray-100 mb-1 rounded-md">
            <svg-vue class="content-title-icon mx-auto" icon="font-awesome.utensils-solid"></svg-vue>
            <span class="text-xs">{{ $t('kitchen') }}</span>
          </router-link>
          <button type="button" @click.prevent="getAllSubmitOrders" class="text-center border border-gray-400 p-1 cursor-pointer hover:bg-gray-100 mb-1 rounded-md">
            <svg-vue class="content-title-icon mx-auto" icon="font-awesome.list-alt-regular"></svg-vue>
            <span class="text-xs">{{ $t('In Process') }}</span>
          </button>
          <button class="text-center border border-gray-400 p-1 cursor-pointer hover:bg-gray-100 mb-1 rounded-md" v-if="cartItems.length > 0" @click.prevent="saveOrder">
            <svg-vue class="content-title-icon mx-auto" icon="font-awesome.save-solid"></svg-vue>
            <span class="text-xs"> {{ sale.uuid ? $t('Update') : $t('Submit') }} </span>
          </button>
          <button
            type="button"
            v-if="sale.progress < 100 && sale.uuid"
            @click.prevent="models.deleteModel = true"
            class="text-center border border-gray-400 p-1 cursor-pointer hover:bg-gray-100 mb-1 rounded-md"
          >
            <svg-vue class="content-title-icon mx-auto" icon="font-awesome.save-solid"></svg-vue>
            <span class="text-xs"> {{ $t('Remove') }} </span>
          </button>
        </div>
      </div>
      <div class="lg:flex lg:space-x-1">
        <div class="bg-white h-fit p-2 w-full overflow-auto">
          <div class="mb-2">
            <input-select
              id="category"
              :default-label="$t('Filter by category')"
              @change="getProducts"
              v-model="filters.category"
              :options="categories"
              option-label="name"
              required
              searchable
              classes="form-input w-full"
            >
              <template v-slot:selectedOption="props">
                <template v-if="props && !props.anySelected">
                  <span class="block truncate">{{ $t('Select category') }}</span>
                </template>
                <template v-else>
                  <div class="flex items-center space-x-3">
                    <div class="flex-shrink-0 inline-block">
                      <img :src="props.option.image" alt="Icon" class="w-8 h-auto" />
                    </div>
                    <div :class="props.option.id === filters.category ? 'font-semibold' : 'font-normal'" class="font-normal block truncate">
                      {{ props.option.name }}
                    </div>
                  </div>
                </template>
              </template>
              <template v-slot:selectOption="props">
                <div class="flex items-center space-x-3">
                  <div class="flex-shrink-0 inline-block">
                    <img :src="props.option.image" alt="Icon" class="w-8 h-auto" />
                  </div>
                  <div :class="props.option.id === filters.category ? 'font-semibold' : 'font-normal'" class="font-normal block truncate">
                    {{ props.option.name }}
                  </div>
                </div>
              </template>
            </input-select>
            <small v-if="filters.category" class="px-2 pt-4 cursor-pointer text-red-400 hover:text-red-600" @click.prevent="filters.category = null">
              x {{ $t('clear category') }}</small
            >
          </div>
          <div class="product-list overflow-auto">
            <template v-if="products.length">
              <div class="grid grid-cols-3 md:grid-cols-4 gap-1" :class="cols_in_row">
                <div
                  v-for="(product, index) in products"
                  :key="index"
                  class="p-1 border border-gray-400 select-none cursor-pointer transition-shadow bg-gray-50 shadow hover:shadow-lg text-center rounded-md"
                  @click.prevent="pushToCart(product)"
                >
                  <div class="flex justify-center mb-1">
                    <img :src="product.image" :alt="product.name" class="w-full h-full" />
                  </div>
                  <p class="flex-grow font-semibold text-gray-700 text-xs">{{ product.name }}</p>
                  <strong class="text-xs font-semibold text-blue-600">{{ product.price | currency }}</strong>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="select-none bg-blue-gray-100 rounded flex flex-wrap content-center justify-center pt-24 opacity-25">
                <div class="w-full text-center">
                  <svg-vue class="h-24 w-24 inline-block" icon="font-awesome.exclamation-triangle-duotone"></svg-vue>
                  <p class="text-xl">
                    {{ $t('Attention! record not found') }}
                  </p>
                </div>
              </div>
            </template>
          </div>

          <div class="md:flex md:justify-between">
            <button
              :class="pagination.currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''"
              :disabled="pagination.currentPage <= 1"
              @click.prevent="changePage(pagination.currentPage - 1)"
              class="btn btn-app mx-1 w-full"
            >
              {{ $t('Previous') }}
            </button>
            <select @change.prevent="changePerPage" class="form-input rounded-none bg-gray-100" v-model="pagination.perPage">
              <option value="5">5 {{ $t('per page') }}</option>
              <option value="10">10 {{ $t('per page') }}</option>
              <option value="15">15 {{ $t('per page') }}</option>
              <option value="25">25 {{ $t('per page') }}</option>
              <option value="50">50 {{ $t('per page') }}</option>
              <option value="100">100 {{ $t('per page') }}</option>
              <option value="150">150 {{ $t('per page') }}</option>
            </select>
            <select class="form-input rounded-none bg-gray-100" @change.prevent="changeCols" v-model="cols_in_row">
              <option value="lg:grid-cols-2">2 {{ $t('items in row') }}</option>
              <option value="lg:grid-cols-3">3 {{ $t('items in row') }}</option>
              <option value="lg:grid-cols-4">4 {{ $t('items in row') }}</option>
              <option value="lg:grid-cols-5">5 {{ $t('items in row') }}</option>
              <option value="lg:grid-cols-6">6 {{ $t('items in row') }}</option>
              <option value="lg:grid-cols-7">7 {{ $t('items in row') }}</option>
              <option value="lg:grid-cols-8">8 {{ $t('items in row') }}</option>
            </select>
            <button
              :class="pagination.currentPage >= pagination.totalPages ? 'opacity-50 cursor-not-allowed' : ''"
              :disabled="pagination.currentPage >= pagination.totalPages"
              @click.prevent="changePage(pagination.currentPage + 1)"
              class="btn btn-red mx-1 w-full"
            >
              {{ $t('Next') }}
            </button>
          </div>
        </div>
        <div class="bg-white text-cyan-900 h-fit p-2 flex-col justify-between w-full lg:w-1/2">
          <div class="mb-4 flex text-xs justify-between rounded p-2 border border-gray-400">
            <strong v-if="sale.id && sale.uuid" class="items-center">
              {{ $t('Print Order') }}#
              <a :href="`/print/sale/${sale.uuid}`" target="_blank">{{ sale.tracking }}</a>
            </strong>
            <span @click.prevent="models.customersModel = true" class="flex space-x-1 cursor-pointer px-2 hover:text-blue-700">
              <svg-vue class="h-4 w-4 items-center" icon="font-awesome.user-solid"></svg-vue>
              {{ currentCustomer.id > 0 ? currentCustomer.name + ' (' + $t('Edit') + ')' : $t('Select customer') }}
            </span>

            <template v-if="sale.order_type === 'dining'">
              <span @click.prevent="models.serviceTableModel = true" class="flex space-x-1 cursor-pointer px-2 hover:text-blue-700">
                <svg-vue class="h-4 w-4 items-center" icon="font-awesome.utensils-solid"></svg-vue>
                {{ currentTable.id ? currentTable.title + ' (' + $t('Edit') + ')' : $t('Select Table') }}
              </span>
            </template>
          </div>
          <div class="cart-list overflow-auto">
            <ul role="list ">
              <li v-for="(item, index) in cartItems" :key="index" class="w-full mb-1">
                <div class="flex">
                  <div class="bg-gray-100 border-l border-r border-t border-gray-400 p-1 flex-shrink-0 -r-xl">
                    <img :src="item.image" alt="name-product" class="w-full h-16" />
                  </div>
                  <div class="ml-2 flex-1 flex flex-col">
                    <div class="flex space-x-2 text-left text-xs font-medium text-gray-900">
                      <div class="truncate w-full">
                        <h3>{{ item.name }}</h3>
                        <ul v-if="item.modifiers">
                          <li v-for="(modifier, key) in item.modifiers" v-if="modifier.is_checked" class="product-topping flex justify-between">
                            <span>+ {{ modifier.title }}</span>
                            <span>{{ modifier.price | currency }} x {{ modifier.qty }}</span>
                          </li>
                        </ul>
                      </div>
                      <div class="font-semibold text-gray-700 h-full border-gray-500 border-l w-36">
                        <p class="pl-2 product-topping">{{ item.price | currency }} x {{ item.qty }}</p>
                        <p class="pl-2 pb-2 product-topping">{{ item.modifiers_price | currency }}</p>
                        <p class="border-gray-500 border-t pl-2 pt-2">
                          <strong>{{ item.sub_total | currency }}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex justify-between text-cyan-900 border-l border-r border-b border-gray-400 shadow mb-2 pr-1">
                  <div class="flex justify-between">
                    <button :disabled="item.qty < 2 || item.is_ready" @click.prevent="itemQtyChange(item, false)" class="w-6 h-6 font-semibold text-center">-</button>
                    <input disabled="disabled" class="w-10 border-none px-1 text-center" :value="item.qty" />
                    <button :disabled="item.is_ready" @click.prevent="itemQtyChange(item, true)" class="w-6 h-6 font-semibold text-center">+</button>
                  </div>
                  <div class="flex space-x-2">
                    <template v-if="item.is_ready">
                      <span class="text-green-500 flex space-x-1">
                        <svg-vue class="w-6 h-6 p-1" icon="font-awesome.check-circle-solid"></svg-vue>
                        {{ $t('Ready') }}</span
                      >
                    </template>
                    <template v-else>
                      <button @click.prevent="editCartItem(item, true)" type="button" class="text-xs font-semibold text-blue-600 hover:text-blue-500">
                        {{ $t('Modifiers') }}
                      </button>
                      <button @click.prevent="editCartItem(item, false)" type="button" class="text-xs font-semibold text-blue-600 hover:text-blue-500">
                        {{ $t('Edit') }}
                      </button>
                      <button type="button" @click.prevent="unsetCartItem(item)" class="text-xs font-semibold text-red-600 hover:text-red-500">
                        {{ $t('Remove') }}
                      </button>
                    </template>
                  </div>
                </div>
              </li>
            </ul>
            <div v-if="cartTotalItems === 0" class="flex-1 w-full p-4 pt-10 opacity-25 select-none flex flex-col flex-wrap content-center justify-center">
              <svg-vue class="h-16 inline-block" icon="font-awesome.cart-arrow-down-solid"></svg-vue>
              <p>
                {{ $t('Cart empty') }}
              </p>
            </div>
          </div>
          <div class="align-bottom bg-gray-100">
            <div class="md:flex space-x-1">
              <div class="w-full border rounded border-gray-300 py-1 px-2">
                <p class="text-sm text-cyan-900">{{ $t('Subtotal') }}:</p>
                <strong>{{ cartTotalPrice | currency }}</strong>
              </div>
              <div class="w-full border rounded border-gray-300 py-1 px-2">
                <p class="text-sm text-cyan-900">{{ $t('Tax') }}:</p>
                <strong>{{ taxAmount | currency }}</strong>
              </div>
            </div>
            <div class="mt-1">
              <div class="w-full border rounded border-gray-300 py-1 px-2">
                <p class="text-sm text-cyan-900">{{ $t('Total') }}:</p>
                <strong>{{ totalAmount | currency }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <cart-item-edit :show="models.cartItemEditModel" @close="cartItemInfoEditUpdate">
        <template v-if="!models.modifiersModel">
          <strong class="text-gray-600">{{ $t('Update food item information') }}</strong>
          <div class="grid grid-cols-3 gap-2 mt-2">
            <div class="col-span-3">
              <label class="input-label" for="name">
                {{ $t('Food item name') }}
              </label>
              <input :placeholder="$t('Item name')" class="form-input mt-1" id="name" required type="text" v-model="edittedCartItem.name" />
            </div>
            <div class="col-span-3 md:flex md:space-x-2">
              <div class="w-full">
                <label class="input-label" for="price">
                  {{ $t('Price per unit') }}
                </label>
                <input :placeholder="$t('Item price')" class="form-input mt-1" id="price" required type="number" v-model="edittedCartItem.price" />
              </div>
              <div class="w-full">
                <label class="input-label" for="qty">
                  {{ $t('Quantity') }}
                </label>
                <input :placeholder="$t('Item qty')" class="form-input mt-1" id="qty" required type="number" v-model="edittedCartItem.qty" />
              </div>
            </div>
          </div>
        </template>
        <div v-if="models.modifiersModel && edittedCartItem.modifiers" class="col-span-3">
          <strong class="text-gray-600">{{ $t('Update food modifiers') }}</strong>
          <div class="min-h-36 md:h-80 overflow-y-auto p-4">
            <div v-for="(modifier, key) in edittedCartItem.modifiers" class="p-4 bg-gray-50 mb-1 border border-gray-200 rounded-md flex space-x-2">
              <input type="checkbox" :id="`io_${key}`" class="radio h-7 w-7 mt-1" v-model="modifier.is_checked" />
              <label :for="`io_${key}`" class="w-full form-label text-xs justify-between">
                <p :for="`io_${key}`">{{ modifier.title }}</p>
                {{ modifier.price | currency }}
              </label>
              <div v-if="modifier.is_checked" class="flex justify-between items-center">
                <button type="button" :disabled="modifier.qty < 2" @click.prevent="modifier.qty--" class="w-6 h-6 font-semibold text-center text-xl">-</button>
                <input disabled class="w-10 border-none px-1 pt-1 text-center" v-model="modifier.qty ?? 0" />
                <button type="button" @click.prevent="modifier.qty++" class="w-6 h-6 font-semibold text-center text-xl">+</button>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-3 mt-2">
          <button class="btn btn-app w-full" @click.prevent="cartItemInfoEditUpdate">{{ $t('Update') }}</button>
        </div>
      </cart-item-edit>

      <orders-model :show="models.ordersModel" @close="models.ordersModel = false">
        <div class="p-2">
          <strong class="text-xl font-semibold text-cyan-900">{{ $t('Orders in process') }}</strong>
          <template v-if="submittedOrders.length">
            <div class="p-2 grid grid-cols-1 gap-2 text-cyan-900">
              <div
                v-for="(order, index) in submittedOrders"
                :key="index"
                @click.prevent="getAlreadySubmitedOrder(order)"
                class="p-3 rounded-md border border-cyan-900 cursor-pointer bg-gray-50"
              >
                <div class="flex justify-between">
                  <strong>Order # {{ order.tracking }}</strong>
                  <span>{{ $t('Progress') }} : {{ order.progress }}%</span>
                </div>
                <div class="text-xs flex justify-between">
                  {{ $t('Type') }} :

                  <span>{{ decodeOrderType(order.order_type) }} {{ order.service_table ? '(' + order.service_table.title + ')' : '' }}</span>
                </div>
                <div class="text-xs flex justify-between">
                  {{ $t('Customer') }} :
                  <span>{{ order.customer.name }}</span>
                </div>
                <div class="text-xs flex justify-between">
                  {{ $t('Created at') }} :
                  <span>{{ order.created_at }}</span>
                </div>
                <div class="text-xs flex justify-between">
                  {{ $t('Last updated at') }} :
                  <span>{{ order.updated_at }}</span>
                </div>
              </div>
            </div>
          </template>
          <template v-else>
            <div class="select-none bg-blue-gray-100 rounded flex flex-wrap content-center justify-center opacity-25">
              <div class="w-full text-center">
                <svg-vue class="h-24 w-24 inline-block" icon="font-awesome.exclamation-triangle-duotone"></svg-vue>
                <p class="text-xl">
                  {{ $t('Attention! record not found') }}
                </p>
              </div>
            </div>
          </template>
        </div>
      </orders-model>

      <notes-model :show="models.notesModel" @close="models.notesModel = false">
        <div class="py-5 md:flex md:space-x-2 col-span-3 mb-2">
          <div class="w-full">
            <label class="form-label" for="note_for_chef">{{ $t('kitchen note') }}</label>
            <textarea
              class="form-input"
              :placeholder="$t('Instructions to chef will be displayed in kitchen along order details')"
              v-model="sale.note_for_chef"
              id="note_for_chef"
              rows="11"
            ></textarea>
          </div>
          <div class="w-full">
            <label class="form-label" for="staff_note">{{ $t('Staff note') }}</label>
            <textarea class="form-input" :placeholder="$t('Staff note for internal use')" v-model="sale.staff_note" id="staff_note" rows="11"></textarea>
          </div>
          <div class="w-full">
            <label class="form-label" for="payment_note">{{ $t('Payment note') }}</label>
            <textarea class="form-input" :placeholder="$t('Payment note for internal use')" v-model="sale.payment_note" id="payment_note" rows="11"></textarea>
          </div>
        </div>
      </notes-model>

      <table-model :show="models.serviceTableModel" @close="models.serviceTableModel = false">
        <div class="p-3">
          <strong class="text-xl font-semibold text-cyan-900">{{ $t('Service table') }}</strong>
          <div class="p-2 grid grid-cols-2 gap-2">
            <div
              v-for="(table, index) in serviceTables"
              @click.prevent="table.is_booked ? '' : (currentTable = table)"
              class="cursor-pointer col-span-1 border border-gray-400 rounded-md p-4 w-full"
              :class="table.is_booked ? 'bg-red-50' : 'bg-green-50'"
            >
              <label :for="`${index}_table_index`" class="flex justify-between items-center">
                <span>
                  <input :disabled="table.is_booked" type="radio" :id="`${index}_table_index`" v-model="currentTable" :value="table" />
                  {{ table.title }}
                </span>
                <small class="text-xs">{{ table.is_booked ? $t('Serving') : $t('Availiable') }}</small></label
              >
            </div>
          </div>
        </div>
      </table-model>

      <customers-model :show="models.customersModel" @close="models.customersModel = false">
        <div class="grid grid-cols-1 gap-2">
          <div class="col-span-3">
            <label class="form-label" for="customer_id">{{ $t('Select cutomer') }}</label>
            <select id="customer_id" class="form-input p-5" v-model="currentCustomer">
              <option :value="{ id: null }">{{ $t('Select customer') }}</option>
              <option v-if="customers.length" v-for="(customer, index) in customers" :key="index" :value="customer">{{ customer.name }} {{ customer.email }}</option>
            </select>
            <span
              v-if="currentCustomer.id"
              @click.prevent="currentCustomer = { id: null }"
              class="cursor-pointer text-xs px-2 py-2 text-blue-400 hover:text-blue-600 my-2"
              >{{ $t('Need to add new customer? click here') }}</span
            >
          </div>
        </div>

        <form v-if="!currentCustomer.id" @submit.prevent="saveCustomer">
          <div class="md:grid md:grid-cols-3 md:gap-6 px-4 py-5 sm:p-6">
            <div class="md:col-span-1">
              <h3 class="form-description-head">
                {{ $t('customer details') }}
              </h3>
              <p class="form-description-text">{{ $t('This information will be displayed publicly') }}.</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-3 gap-6">
                <div class="col-span-3">
                  <label class="form-label" for="name">{{ $t('Name') }}</label>
                  <div class="pt-1">
                    <input :placeholder="$t('First name')" class="form-input" id="name" required v-model="currentCustomer.name" />
                  </div>
                </div>
                <div class="col-span-3 md:flex md:space-x-2">
                  <div class="w-full">
                    <label class="form-label" for="email">{{ $t('Email') }}</label>
                    <div class="pt-1">
                      <input :placeholder="$t('Email')" class="form-input" id="email" v-model="currentCustomer.email" />
                    </div>
                  </div>
                  <div class="w-full">
                    <label class="form-label" for="phone">{{ $t('Phone') }}</label>
                    <div class="pt-1">
                      <input :placeholder="$t('Phone')" class="form-input" id="phone" v-model="currentCustomer.phone" />
                    </div>
                  </div>
                </div>

                <div class="col-span-3">
                  <label class="form-label" for="address">{{ $t('Address') }}</label>
                  <div class="pt-1">
                    <input :placeholder="$t('Address')" class="form-input" id="address" v-model="currentCustomer.address" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <span class="inline-flex">
              <button class="btn btn-green" type="submit">
                {{ $t('Save') }}
              </button>
            </span>
          </div>
        </form>
      </customers-model>

      <delete-model :show="models.deleteModel" @cancelled="models.deleteModel = false" @confirmed="deleteCategory">
        <template #title>{{ $t('Delete submitted order') }}</template>
        {{ $t('Are you sure you want to delete the order ?') }}
        {{ $t('All data will be permanently removed') }}.
      </delete-model>

      <payment-model :show="models.paymentModel" @close="models.paymentModel = false">
        <div class="grid grid-cols-1 gap-2">
          <div class="col-span-3">
            <label class="form-label" for="payment_method_id">{{ $t('Payment method') }}</label>
            <select id="payment_method_id" class="form-input" v-model="sale.payment_method_id">
              <option :value="null" disabled>{{ $t('Select payment method') }}</option>
              <option v-for="(payment, index) in paymentMethods" :key="index" :value="payment.id">{{ payment.title }}</option>
            </select>
          </div>
          <div class="col-span-3 mb-2 flex space-x-1">
            <div class="w-full">
              <label class="form-label" for="discount_rate">{{ $t('Discount %') }}</label>
              <input type="number" max="99" min="0" id="discount_rate" v-model="sale.discount_rate" class="form-input" required />
            </div>
            <div class="w-full">
              <label class="form-label" for="recipient_amount">{{ $t('Recipient Amount') }}</label>
              <input type="number" id="recipient_amount" step="0.01" v-model="sale.recipient_amount" class="form-input" required />
            </div>
          </div>

          <div class="col-span-3 mb-2">
            <div class="md:flex md:space-x-1">
              <div class="w-full border rounded border-gray-300 py-1 px-2 mb-1 rounded">
                <p class="text-sm text-cyan-900">{{ $t('Subtotal') }}:</p>
                <span>{{ sale.cart_total_price | currency }}</span>
              </div>
              <div class="w-full border rounded border-gray-300 py-1 px-2 mb-1 rounded">
                <p class="text-sm text-cyan-900">{{ $t('Discount Amount') }}:</p>
                <span>{{ discountAmount | currency }}</span>
              </div>
              <div class="w-full border rounded border-gray-300 py-1 px-2 mb-1 rounded">
                <p class="text-sm text-cyan-900">{{ $t('Tax Amount') }}:</p>
                <span>{{ taxAmount | currency }}</span>
              </div>
            </div>
            <div class="flex space-x-1">
              <div class="w-full border rounded border-gray-300 py-1 px-2 mb-1 rounded">
                <p class="text-sm text-cyan-900">{{ $t('Total Payable') }}:</p>
                <span>{{ totalAmount | currency }}</span>
              </div>
              <div class="w-full border border-gray-400 py-1 px-2 mb-1 rounded" :class="balenceAmount >= 0 ? 'bg-green-100' : 'bg-red-100'">
                <p class="text-sm text-cyan-900">{{ $t('Balance') }}:</p>
                <span>{{ balenceAmount | currency }}</span>
              </div>
            </div>
          </div>
          <div class="col-span-3">
            <div class="grid grid-cols-4 md:grid-cols-5 gap-1">
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="enterNumber(7)">7</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="enterNumber(8)">8</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="enterNumber(9)">9</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="addNumber(5)">+5</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="addNumber(10)">+10</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="enterNumber(4)">4</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="enterNumber(5)">5</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="enterNumber(6)">6</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="addNumber(50)">+50</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="addNumber(100)">+100</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="enterNumber(1)">1</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="enterNumber(2)">2</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="enterNumber(3)">3</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="addNumber(150)">+150</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="addNumber(200)">+200</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="enterNumber(0)">0</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="sale.recipient_amount = totalAmount">
                {{ $t('Total') }}
              </button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="clearNumber(0)">x</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="addNumber(1000)">1000</button>
              <button type="button" class="col-span-1 p-3 items-center text-center btn btn-app" @click.prevnet="addNumber(5000)">5000</button>
            </div>
          </div>
        </div>
        <div class="flex space-x-2 py-2">
          <button class="btn btn-red p-5 w-full" @click.prevent="models.paymentModel = false">{{ $t('Cancel') }}</button>
          <button class="btn btn-green p-5 w-full" @click.prevent="checkout">{{ $t('Complete') }}</button>
        </div>
      </payment-model>
    </div>
  </main>
</template>
<script>
import { mapGetters, mapActions } from 'vuex';
import model from '@/Components/model';
import confirmationModel from '@/Components/layout/admin/confirmation';

export default {
  name: 'OrderTaking',
  components: {
    'table-model': model,
    'cart-item-edit': model,
    'orders-model': model,
    'payment-model': model,
    'customers-model': model,
    'notes-model': model,
    'delete-model': confirmationModel,
  },
  data() {
    return {
      loading: false,
      models: {
        modifiersModel: false,
        customersModel: false,
        paymentModel: false,
        ordersModel: false,
        cartItemEditModel: false,
        serviceTableModel: false,
        deleteModel: false,
        notesModel: false,
      },
      search: null,
      addon: {},
      edittedCartItem: {},
      categories: [],
      serviceTables: [],
      submittedOrders: [],
      customers: [],
      products: [],
      paymentMethods: [
        { id: 1, title: 'Cash' },
        { id: 2, title: 'Card' },
      ],
      modifiers: [],
      extras: [],
      cols_in_row: 'lg:grid-cols-6',
      pagination: {
        currentPage: 0,
        perPage: 15,
        total: 0,
        totalPages: 0,
        page: 0,
      },
      currentCustomer: {
        id: null,
      },
      currentTable: {
        id: null,
        is_booked: false,
      },
      filters: {
        category: null,
        search: null,
      },
      sale: {
        recipient_amount: 0,
        payment_method_id: 1,
        progress: 0,
        uuid: null,
        order_type: 'dining',
        tax: {},
        table_id: null,
        cart_total_price: 0,
        discount_rate: 0,
      },
    };
  },
  mounted() {
    this.loadAll(true);
    if (this.$route.params.uuid) {
      this.sale.uuid = this.$route.params.uuid;
      this.getAlreadySubmitedOrder(this.sale);
    }
    this.cols_in_row = localStorage.getItem('cols_in_row') ?? 'lg:grid-cols-6';
  },

  computed: {
    ...mapGetters({
      cartItems: 'cart/getCartItems',
      cartTotalItems: 'cart/getCartTotalItems',
      cartTotalPrice: 'cart/getCartTotalPrice',
      cartTotalCost: 'cart/getCartTotalCost',
      userRole: 'app/getRole',
      orderTypes: 'app/getOrderTypes',
    }),

    getProgress() {
      let items = this.cartItems;
      let ready = 0;
      items.forEach((item) => {
        item.is_ready ? ready++ : '';
      });
      return (ready / items.length) * 100;
    },
    discountAmount() {
      return Number(this.sale.discount_rate / 100) * this.sale.cart_total_price;
    },
    afterDiscount() {
      return this.sale.cart_total_price - this.discountAmount;
    },
    profit() {
      return this.afterDiscount - this.sale.cart_total_cost;
    },
    taxAmount() {
      const amount = this.afterDiscount;
      if (this.sale.tax.is_vat) {
        let rating = '1.' + this.sale.tax.tax_rate ?? this.sale.tax.rate;
        if (this.sale.tax.is_tax_included) {
          return Number(amount - Number(amount / rating));
        } else {
          return Number(Number(amount * rating) - amount);
        }
      } else {
        const rate = Number(this.sale.tax.tax_rate ?? this.sale.tax.rate);
        if (this.sale.tax.is_tax_fix) {
          return rate;
        }
        return amount * (rate / 100);
      }
    },
    totalAmount() {
      if (this.sale.tax.is_tax_included) {
        return Number(this.afterDiscount);
      }
      return Number(this.afterDiscount + this.taxAmount);
    },
    balenceAmount() {
      return this.sale.recipient_amount - this.totalAmount;
    },
  },
  watch: {
    getProgress(value) {
      this.sale.progress = value;
    },
    currentCustomer(value) {
      if (value.id && value.uuid) {
        this.models.customersModel = false;
      }
    },
    currentTable(value) {
      this.models.serviceTableModel = false;
    },
  },
  methods: {
    ...mapActions({
      setCartItems: 'cart/setCartItems',
      unsetCartItems: 'cart/unsetCartItems',
      setCartItem: 'cart/setCartItem',
      unsetCartItem: 'cart/unsetCartItem',
      updateCartItem: 'cart/updateCartItem',
    }),
    enterDecimal() {
      this.sale.recipient_amount += '.';
    },
    clearNumber() {
      this.sale.recipient_amount = 0;
    },
    addNumber(number) {
      this.sale.recipient_amount = Number(this.sale.recipient_amount) + Number(number);
    },
    enterNumber(number) {
      this.sale.recipient_amount += this.sale.recipient_amount == 0 ? number : '' + number;
    },
    processCheckout() {
      this.models.paymentModel = true;
    },
    deleteCategory() {
      this.loading = true;
      this.models.deleteModel = false;
      axios
        .delete(route('sales.destroy', this.sale.uuid))
        .then((response) => {
          this.loading = false;
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.loadAll();
        })
        .catch(() => {
          this.loading = false;
          this.models.deleteModel = false;
        });
    },
    decodeOrderType(orderkey) {
      let data = {};
      this.orderTypes.forEach((item) => {
        if (item.key === orderkey) {
          data = item;
        }
      });
      return data.title;
    },
    storeCustomer() {
      this.loading = true;
      axios
        .post(route('customers.store'), this.currentCustomer)
        .then((response) => {
          this.loading = false;
          this.currentCustomer = response.data.customer;
          this.customers.push(this.currentCustomer);
          this.models.customersModel = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    saveCustomer() {
      if (this.currentCustomer.id) {
        this.sale.customer_id = this.currentCustomer.id;
        this.models.customersModel = false;
      } else {
        this.storeCustomer();
      }
    },
    makeSearch() {
      setTimeout(() => {
        this.getProducts();
      }, 300);
    },
    changeCols() {
      localStorage.setItem('cols_in_row', this.cols_in_row);
    },
    changePerPage() {
      localStorage.setItem('per_page', this.pagination.perPage);
      this.getProducts();
    },
    checkout() {
      this.loading = true;
      this.sale.discount_amount = this.discountAmount;
      this.sale.tax_amount = this.taxAmount;
      this.sale.profit_after_all = this.profit;
      this.sale.payable_after_all = this.totalAmount;
      this.models.paymentModel = false;
      axios
        .post(route('pos.checkout', this.sale.uuid), this.sale)
        .then((response) => {
          this.loading = false;
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'succ',
          });
          let order = this.sale.uuid;
          this.loadAll();
          return this.$router.push(`/print/sale/${order}`);
        })
        .catch((e) => {
          this.models.paymentModel = true;
          this.loading = false;
        });
    },
    getCustomers() {
      this.loading = true;
      axios
        .get(route('pos.customers'))
        .then((response) => {
          this.loading = false;
          this.customers = response.data;
          setTimeout(() => {
            this.currentCustomer = this.customers[0];
          }, 2000);
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    loadAll(loader = false) {
      this.loading = loader;
      this.clearAll();
      this.getCustomers();
      this.getServiceTables();
      this.getCategories();
      this.getProducts();
      this.getPaymentMethods();
      this.clearRouterPrams();
    },
    clearAll() {
      this.sale = {
        recipient_amount: 0,
        payment_method_id: 1,
        progress: 0,
        uuid: null,
        order_type: 'dining',
        tax: {},
        table_id: null,
        cart_total_price: 0,
        discount_rate: 0,
      };
      this.serviceTables = [];
      this.unsetCartItems();
      this.clearFilters();
      this.sale.tax = this.$store.getters['app/getTaxSetup'];
      this.currentCustomer = { id: null };
      this.currentTable = {
        id: null,
        is_booked: false,
      };
    },
    clearFilters() {
      setTimeout(() => {
        this.filters = { category: null, search: null };
      }, 2000);
    },
    editCartItem(item, modifier = false) {
      this.models.modifiersModel = modifier;
      this.models.cartItemEditModel = true;
      this.edittedCartItem = item;
    },
    cartItemInfoEditUpdate() {
      this.updateCartItem(this.edittedCartItem);
      this.models.cartItemEditModel = false;
    },
    itemQtyChange(item, addtion) {
      addtion ? item.qty++ : item.qty--;
      this.updateCartItem(item);
    },
    pushToCart(product) {
      if (product.in_stock > 0) {
        this.setCartItem(product);
      } else {
        this.flashUpOutOfStock();
      }
      if (this.filters.category) {
        this.clearFilters();
      }
    },
    flashUpOutOfStock() {
      this.$notify({
        title: this.$i18n.t('Warning').toString(),
        text: this.$i18n.t('This item is out of stock').toString(),
        type: 'warning',
      });
    },
    getServiceTables() {
      this.loading = true;
      axios.get(route('pos.service-tables')).then((response) => {
        this.loading = false;
        this.serviceTables = response.data;
      });
    },
    getPaymentMethods() {
      this.loading = true;
      axios.get(route('pos.payment-methods')).then((response) => {
        this.loading = false;
        this.paymentMethods = response.data;
      });
    },
    getCategories() {
      this.loading = true;
      axios.get(route('pos.categories')).then((response) => {
        this.loading = false;
        this.categories = response.data;
      });
    },
    getAllSubmitOrders() {
      this.loading = true;
      axios.get(route('pos.submited-orders')).then((response) => {
        this.submittedOrders = response.data;
        this.loading = false;
        this.models.ordersModel = true;
      });
    },
    getAlreadySubmitedOrder(order) {
      this.loading = true;
      this.models.ordersModel = false;
      axios.post(route('pos.submited-order'), { uuid: order.uuid }).then((response) => {
        this.loading = false;
        if (response.data.message) {
          this.loadAll();
          this.$notify({
            title: this.$i18n.t('Warning').toString(),
            text: response.data.message.toString(),
            type: 'warning',
          });
        } else {
          this.models.ordersModel = false;
          this.sale = response.data;
          this.currentTable = this.sale.service_table ?? { id: null };
          this.currentCustomer = this.sale.customer ?? { id: null };
          this.setCartItems(this.sale.items);
        }
      });
    },
    clearRouterPrams() {
      if (this.$route.params.uuid) {
        this.$router.replace({ params: { uuid: null } });
      }
    },
    saveOrder() {
      this.loading = true;
      this.sale.items = this.cartItems;
      this.sale.tax_amount = this.taxAmount;
      this.sale.cart_total_items = this.cartTotalItems;
      this.sale.cart_total_price = this.cartTotalPrice;
      this.sale.cart_total_cost = this.cartTotalCost;
      this.sale.profit_after_all = Number(this.cartTotalPrice - this.cartTotalCost);
      this.sale.payable_after_all = this.totalAmount;
      this.sale.table_id = null;
      if (this.sale.order_type == 'dining') {
        this.sale.table_id = this.sale.table_id ?? this.currentTable.id ?? null;
      }
      this.sale.customer_id = this.sale.customer_id ?? this.currentCustomer.id ?? null;
      this.loading = true;
      this.sale.uuid ? this.updateSale() : this.storeSale();
    },
    updateSale() {
      this.sale.customer_id = this.currentCustomer.id ?? null;
      axios
        .patch(route('sales.update', this.sale.uuid), this.sale)
        .then((response) => {
          this.loading = false;
          this.loadAll();
          this.$router.replace({ params: { uuid: null } });
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    storeSale() {
      axios
        .post(route('sales.store'), this.sale)
        .then((response) => {
          this.loading = false;
          this.loadAll();
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
        })
        .catch((e) => {
          this.loading = false;
        });
    },
    changePage(page) {
      if (page > 0 && page <= this.pagination.totalPages && page !== this.pagination.page) {
        this.pagination.page = page;
        this.getProducts();
      }
    },
    getProducts() {
      this.loading = true;
      let parameters = {
        page: this.pagination.page,
        perPage: this.pagination.perPage,
        ...this.filters,
      };
      axios
        .get(route('pos.products'), { params: parameters })
        .then((response) => {
          this.products = response.data.items;
          this.pagination = response.data.pagination;
          this.pagination.perPage = localStorage.getItem('per_page') ?? 18;
          if (this.pagination.totalPages < this.pagination.currentPage) {
            this.page = this.pagination.totalPages;
            this.getProducts();
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

<style type="text/css">
.cart-list {
  @apply overflow-y-auto;
  height: calc(100vh - 270px);
}
.product-list {
  @apply overflow-y-auto;
  height: calc(95vh - 270px);
}

@media (min-width: theme('screens.md')) {
  .product-list {
    height: calc(86vh - 170px);
  }
  .cart-list {
    @apply overflow-y-auto;
    height: calc(96vh - 300px);
  }
}
</style>

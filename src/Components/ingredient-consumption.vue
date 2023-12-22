<template>
	<div>
		<label class="form-label">{{ $t('Ingredient') }}</label>
		<select class="form-input" v-model="ingredient" @change.prevent="addIngredient">
			<option
				:value="{
					quantity: 0,
				}"
			>
				{{ $t('Select an ingredient to include') }}
			</option>
			<option v-for="(ingredient, index) in ingredients" :key="index" :value="ingredient">{{ ingredient.name }}</option>
		</select>
		<div v-if="product.ingredients" class="mt-2 border border-1 border-gray-300 bg-white rounded-md">
			<table class="table text-left text-xs">
				<thead>
					<tr class="border bg-gray-100 p-2">
						<th class="px-4 py-2 w-full">{{ $t('Ingredient Name') }}</th>
						<th class="px-4 py-2">{{ $t('Availiable QTY') }}</th>
						<th class="px-4 py-2">{{ $t('Consumption QTY') }}</th>
						<th class="px-4 py-2">{{ $t('Cost') }}</th>
						<th class="px-4 py-2">{{ $t('Price') }}</th>
						<th class="px-4 py-2">{{ $t('Action') }}</th>
					</tr>
				</thead>
				<tbody>
					<template v-if="product.ingredients.length">
						<tr class="p-2 border" v-for="(item, index) in product.ingredients">
							<td class="px-4 py-2 w-full">{{ item.name }}</td>
							<td class="px-4 py-2">{{ item.quantity }}</td>
							<td class="px-4 py-2">{{ item.quantity_using }} {{ item.unit }}</td>
							<td class="px-4 py-2">{{ item.cost | currency }}</td>
							<td class="px-4 py-2">{{ item.price | currency }}</td>
							<td class="px-2">
								<button class="btn btn-red p-1 text-xs" @click.prevent="removeItem(index)">X</button>
							</td>
						</tr>
					</template>
					<template v-else>
						<tr>
							<td colspan="7" class="py-3 text-center text-gray-400">{{ $t('No item found!') }}</td>
						</tr>
					</template>
				</tbody>
				<tfoot>
					<tr class="border bg-gray-100">
						<th class="px-4 py-4 text-right" colspan="4">{{ $t('Total') }}</th>
						<th class="px-4 py-4">{{ getProductCost | currency }}</th>
						<th class="px-4 py-4" colspan="2">{{ getProductPrice | currency }}</th>
					</tr>
				</tfoot>
			</table>
		</div>
	</div>
</template>
<script>
export default {
	props: {
		item: { type: Object, required: true },
	},
	data() {
		return {
			loading: false,
			ingredients: [],
			ingredient: {
				quantity: 0,
			},
			product: {
				name: null,
				food_category_id: null,
				ingredients: [],
			},
		};
	},
	mounted() {
		this.product = this.item;
		this.getFoodIngredients();
	},
	computed: {
		getProductCost() {
			let cost = 0;
			this.product.ingredients.forEach((item) => {
				cost += Number(item.cost * item.quantity_using);
			});
			return cost;
		},
		getProductPrice() {
			let price = 0;
			this.product.ingredients.forEach((item) => {
				price += Number(item.price * item.quantity_using);
			});
			return price;
		},
	},
	watch: {
		item(value) {
			this.product = value;
		},
	},
	methods: {
		addIngredient() {
			this.ingredient.quantity_using = this.ingredient.quantity_using ?? 1;
			this.product.ingredients.map((item) => {
				if (item.name == this.ingredient.name) {
					this.removeItem(this.ingredient);
					this.ingredient.quantity_using++;
				}
			});
			this.product.ingredients.push(this.ingredient);
			this.ingredient = {
				quantity: 0,
			};
			this.updateOutSide();
		},
		removeItem(ingredient) {
			this.product.ingredients.splice(this.product.ingredients.indexOf(ingredient), 1);
			this.updateOutSide();
		},
		updateOutSide() {
			this.product.cost = this.getProductCost;
			this.product.price = this.getProductPrice;
			this.$emit('updated', this.product);
		},
		getFoodIngredients() {
			this.loading = true;
			axios
				.get(route('food.ingredients'))
				.then((response) => {
					this.ingredients = response.data;
					this.loading = false;
				})
				.catch(() => {
					this.loading = false;
				});
		},
	},
};
</script>

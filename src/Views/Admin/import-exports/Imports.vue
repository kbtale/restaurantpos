<template>
	<div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
		<div class="content-card-body">
			<form @submit.prevent="importData">
				<loading :status="loading"></loading>
				<div class="md:grid md:grid-cols-3 md:gap-3 px-4 py-5 sm:p-6">
					<div class="md:col-span-1">
						<h3 class="form-description-head">
							{{ $t('Import resources') }}
						</h3>
						<p class="form-description-text">{{ $t('Import resources to database') }}.</p>
					</div>
					<div class="mt-5 md:mt-0 md:col-span-2">
						<div class="grid grid-cols-3 gap-3">
							<div class="col-span-3">
								<label class="form-label" for="resource">{{ $t('Resource') }}</label>
								<select class="form-input" id="resource" v-model="resource" required>
									<option disabled :value="null">{{ $t('Select resource') }}</option>
									<option value="customers">{{ $t('Customers') }}</option>
									<option value="ingredients">{{ $t('Food Ingredients') }}</option>
									<option value="modifiers">{{ $t('Food modifiers') }}</option>
									<option value="categories">{{ $t('Food Categories') }}</option>
									<option value="products">{{ $t('Food items') }}</option>
									<option value="expensetypes">{{ $t('Expense types') }}</option>
									<option value="expenses">{{ $t('Expenses') }}</option>
									<option value="servicetables">{{ $t('Service tables') }}</option>
									<option value="paymentmethods">{{ $t('Payment methods') }}</option>
								</select>
							</div>
							<template v-if="resource">
								<div class="col-span-3 text-xs text-red-400 border-l border-red-500 p-2">
									<p class="text-sm font-semibold">
										{{ $t('Please follow up instructions below for the selected resource') }}
									</p>
									<ul class="">
										<template v-if="resource == 'customers'">
											<li>{{ $t('Column') }} 1 : {{ $t('Customer name') }} ({{ $t('Required') }})</li>
											<li class="text-xs">{{ $t('Column') }} 2 : {{ $t('Phone') }} ({{ $t('optional') }})</li>
											<li class="text-xs">{{ $t('Column') }} 3 : {{ $t('Email') }} ({{ $t('optional') }})</li>
											<li class="text-xs">{{ $t('Column') }} 4 : {{ $t('Address') }} ({{ $t('optional') }})</li>
										</template>
										<template v-if="resource == 'servicetables'">
											<li class="text-xs">{{ $t('Column') }} 1 : {{ $t('Table title') }} ({{ $t('Required') }})</li>
										</template>
										<template v-if="resource == 'categories'">
											<li>{{ $t('Column') }} 1 : {{ $t('Category name') }} ({{ $t('Required') }})</li>
										</template>

										<template v-if="resource == 'products'">
											<li>{{ $t('Column') }} 1 : {{ $t('Product SKU') }} ({{ $t('Required') }})</li>
											<li>{{ $t('Column') }} 2 : {{ $t('name') }} ({{ $t('Required') }})</li>
											<li class="text-xs">{{ $t('Column') }} 3 : {{ $t('Price') }} ({{ $t('Required') }})</li>
											<li class="text-xs">{{ $t('Column') }} 4 : {{ $t('cost') }} ({{ $t('Required') }})</li>
											<li class="text-xs">{{ $t('Column') }} 5 : {{ $t('expiration_date') }} ({{ $t('Required') }})</li>
											<li class="text-xs">{{ $t('Column') }} 6 : {{ $t('category_id') }} ({{ $t('Required') }})</li>
										</template>
										<template v-if="resource == 'ingredients'">
											<li>{{ $t('Column') }} 1 : {{ $t('name') }} ({{ $t('Required') }})</li>
											<li>{{ $t('Column') }} 2 : {{ $t('price') }} ({{ $t('Required') }})</li>
											<li class="text-xs">{{ $t('Column') }} 3 : {{ $t('cost') }} ({{ $t('Required') }})</li>
											<li class="text-xs">{{ $t('Column') }} 4 : {{ $t('unit') }} ({{ $t('Required') }})</li>
											<li class="text-xs">{{ $t('Column') }} 5 : {{ $t('quantity') }} ({{ $t('Required') }})</li>
											<li class="text-xs">{{ $t('Column') }} 6 : {{ $t('quantity_alert') }} ({{ $t('Required') }})</li>
											<li class="text-xs">{{ $t('Column') }} 7 : {{ $t('description') }} ({{ $t('Optional') }})</li>
										</template>
										<template v-if="resource == 'modifiers'">
											<li>{{ $t('Column') }} 1 : {{ $t('title') }} ({{ $t('Required') }})</li>
											<li>{{ $t('Column') }} 2 : {{ $t('price') }} ({{ $t('Required') }})</li>
											<li class="text-xs">{{ $t('Column') }} 3 : {{ $t('cost') }} ({{ $t('Required') }})</li>
										</template>
										<template v-if="resource == 'expenses'">
											<li>{{ $t('Column') }} 1 : {{ $t('title') }} ({{ $t('Required') }})</li>
											<li>{{ $t('Column') }} 2 : {{ $t('amount') }} ({{ $t('Required') }})</li>
											<li>{{ $t('Column') }} 3 : {{ $t('description') }} ({{ $t('Required') }})</li>
											<li>{{ $t('Column') }} 4 : {{ $t('expens_type_id') }} ({{ $t('Required') }})</li>
										</template>
										<template v-if="resource == 'expensetypes'">
											<li>{{ $t('Column') }} 1 : {{ $t('title') }} ({{ $t('Required') }})</li>
										</template>
										<template v-if="resource == 'paymentmethods'">
											<li>{{ $t('Column') }} 1 : {{ $t('title') }} ({{ $t('Required') }})</li>
										</template>
									</ul>
								</div>
							</template>
							<div class="col-span-3">
								<label class="form-label" for="name">{{ $t('Excel CSV file') }}</label>
								<div class="pt-1 relative shadow-sm">
									<input @change="onChangeFileUpload" class="form-input" ref="file" required type="file" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="card-footer">
					<span class="inline-flex">
						<button class="btn btn-app shadow-sm" type="submit">
							{{ $t('Import') }}
						</button>
					</span>
				</div>
			</form>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
			loading: false,
			file: null,
			resource: null,
		};
	},
	methods: {
		importData() {
			this.loading = true;
			const formData = new FormData();
			formData.append('file', this.file);
			formData.append('resource', this.resource);
			axios
				.post(route('imports'), formData, {
					headers: { 'Content-Type': 'multipart/form-data' },
				})
				.then((response) => {
					this.loading = false;
					this.file = null;
					this.resource = null;
					this.$refs.file.value = null;
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
		onChangeFileUpload() {
			this.file = this.$refs.file.files[0];
		},
	},
};
</script>

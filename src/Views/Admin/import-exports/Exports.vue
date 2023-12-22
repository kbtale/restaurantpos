<template>
	<div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
		<div class="content-card-body">
			<form @submit.prevent="exportData">
				<loading :status="loading"></loading>
				<div class="md:grid md:grid-cols-3 md:gap-3 px-4 py-5 sm:p-6">
					<div class="md:col-span-1">
						<h3 class="form-description-head">
							{{ $t('Export resources') }}
						</h3>
						<p class="form-description-text">{{ $t('Export resources from database') }}.</p>
					</div>
					<div class="mt-5 md:mt-0 md:col-span-2">
						<div class="grid grid-cols-3 gap-3">
							<div class="col-span-3">
								<label class="form-label" for="resource">{{ $t('Resource') }}</label>
								<select class="form-input" id="resource" v-model="exportForm.resource" required>
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
							<div class="col-span-3">
								<label class="form-label" for="format">{{ $t('Format') }}</label>
								<select type="text" class="form-input" id="format" v-model="exportForm.format" required>
									<option disabled :value="null">{{ $t('Select file format') }}</option>
									<option value="csv">{{ $t('CSV') }}</option>
									<option value="xlsx">{{ $t('XLSX') }}</option>
									<option value="xls">{{ $t('XLS') }}</option>
									<option value="html">{{ $t('HTML') }}</option>
								</select>
							</div>
						</div>
					</div>
				</div>
				<div class="card-footer">
					<span class="inline-flex">
						<button :disabled="!exportForm.resource || !exportForm.format" class="btn btn-app shadow-sm" type="submit">
							{{ $t('Export') }}
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
			exportForm: {
				resource: null,
				format: null,
			},
		};
	},
	methods: {
		exportData() {
			this.loading = true;
			axios
				.post(route('exports', { responseType: 'blob' }), this.exportForm)
				.then((response) => {
					const type = response.headers['content-type'];
					const blob = new Blob([response.data], { type: type, encoding: 'UTF-8' });
					const link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
					link.download = this.exportForm.resource + '.' + this.exportForm.format;
					link.click();
					this.exportForm = {
						resource: null,
						format: null,
					};
					this.loading = false;
					this.$notify({
						title: this.$i18n.t('Success').toString(),
						text: this.$i18n.t('Data exported successfully').toString(),
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

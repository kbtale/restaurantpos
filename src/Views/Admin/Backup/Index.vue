<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.database-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('Database backups') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button :disabled="loading" @click="takeBackup" class="btn btn-app">
            {{ $t('Generate Backup') }}
          </button>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <loading :status="loading"></loading>
        <template v-if="backupList.length > 0">
          <ul class="border-t border-gray-200">
            <template v-for="(backup, index) in backupList">
              <li :class="{ 'border-t border-gray-200': index !== 0 }" :key="index">
                <div class="block hover:bg-gray-50 focus:outline-none focus:bg-blue-100 transition duration-150 ease-in-out">
                  <div class="md:flex items-center py-4 sm:px-6">
                    <div class="min-w-0 flex-1 flex items-center">
                      <div class="min-w-0 flex-1 px-4 lg:grid lg:grid-cols-2 lg:gap-4">
                        <div>
                          #{{ index + 1 }} - {{ backup.time }}
                          <div class="text-sm leading-5 font-medium text-blue-600 truncate">
                            {{ backup.name }}
                          </div>
                          <div class="mt-2 flex items-center text-sm leading-5 text-gray-900">
                            <svg-vue class="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" icon="font-awesome.database-solid"></svg-vue>
                            <span class="truncate">{{ backup.size }} ({{ backup.uuid }})</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="mt-2 px-4 md:px-0">
                      <button :disabled="loading" @click="restoreFile(backup.name)" class="btn btn-app mx-0 -none -l-md">
                        {{ $t('Restore') }}
                      </button>
                      <button :disabled="loading" @click="deleteFile(backup.name)" class="btn btn-app mx-0 -none -r-md">
                        {{ $t('Delete') }}
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            </template>
          </ul>
        </template>
        <template v-else>
          <no-content />
        </template>
        <restore-confirmation-model :show="restoreModel" @cancelled="restoreModel = false" @confirmed="restoreBackup">
          <template #title>{{ $t('Database Restore') }}</template>
          {{ $t('Your current data could be effect or loss permanently') }}.
          {{ $t('Are you sure you want to restore database backup ?') }}
        </restore-confirmation-model>
        <delete-confirmation-model :show="deleteModel" @cancelled="deleteModel = false" @confirmed="deleteBackup">
          <template #title>{{ $t('Delete database') }}</template>
          {{ $t('Are you sure you want to delete backup file from storage ?') }}
        </delete-confirmation-model>
      </div>
    </div>
  </main>
</template>
<script>
import confirmationModel from '@/Components/layout/admin/confirmation';

export default {
  name: 'index',
  components: {
    RestoreConfirmationModel: confirmationModel,
    DeleteConfirmationModel: confirmationModel,
  },
  metaInfo() {
    return {
      title: this.$i18n.t('Database Backup'),
    };
  },
  data() {
    return {
      restoreModel: false,
      deleteModel: false,
      loading: true,
      backupList: [],
      backupFile: '',
    };
  },
  mounted() {
    this.getBackups();
  },
  methods: {
    deleteFile(file) {
      this.backupFile = file;
      this.deleteModel = true;
    },
    restoreFile(file) {
      this.backupFile = file;
      this.restoreModel = true;
    },
    deleteBackup() {
      this.loading = true;
      this.deleteModel = false;
      axios
        .post(route('backup.destroy', this.backupFile))
        .then((response) => {
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.getBackups();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    restoreBackup() {
      this.$notify({
        title: this.$i18n.t('Be patient').toString(),
        text: this.$i18n.t('Backup restoring process has been started !').toString(),
        type: 'info',
      });
      this.loading = true;
      this.restoreModel = false;
      axios
        .patch(route('backup.restore', this.backupFile))
        .then((response) => {
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    takeBackup() {
      this.$notify({
        title: this.$i18n.t('Attention').toString(),
        text: this.$i18n.t('Backup generating process has been started').toString(),
        type: 'info',
      });
      this.loading = true;
      axios
        .post(route('backup.generate'))
        .then((response) => {
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.getBackups();
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getBackups() {
      this.loading = true;
      axios
        .get(route('backup.index'))
        .then((response) => {
          this.backupList = response.data.list;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

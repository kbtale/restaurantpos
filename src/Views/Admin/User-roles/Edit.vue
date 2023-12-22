<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.edit-regular"></svg-vue>
          <h1 class="content-title">
            {{ $t('Edit user role') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <button @click="deleteUserRoleModal = true" class="btn btn-red mx-1" type="button">
            {{ $t('Delete') }}
          </button>
          <router-link class="btn btn-app mx-1" to="/admin/user-roles">
            {{ $t('Back') }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <loading :status="loading"></loading>
        <form @submit.prevent="updateUserRole">
          <div class="md:grid md:grid-cols-3 md:gap-3 px-4 py-5 sm:p-6">
            <div class="md:col-span-1">
              <h3 class="form-description-head">
                {{ $t('Role details') }}
              </h3>
              <p class="form-description-text">{{ $t('This information will be displayed publicly') }}.</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-3 gap-3">
                <div class="col-span-3">
                  <label class="form-label" for="name">{{ $t('Name') }}</label>
                  <div class="mt-1 relative shadow-sm">
                    <input id="name" v-model="userRole.name" :placeholder="$t('Name')" class="form-input" required />
                  </div>
                </div>
              </div>
            </div>
            <div class="md:col-span-3">
              <div class="py-3">
                <div class="border-t border-gray-200"></div>
              </div>
            </div>
            <div class="md:col-span-1">
              <h3 class="form-description-head">
                {{ $t('Permissions') }}
              </h3>
              <p class="form-description-text">{{ $t('Sections of the application permission') }}.</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <template v-for="(permission, index) in permissions">
                <template v-if="permission.title">
                  <div class="py-1 my-2 col-span-3">
                    <strong class="text-xs">
                      {{ permission.label }}
                    </strong>
                  </div>
                </template>
                <template v-else>
                  <div :key="index" class="col-span-3">
                    <div class="mt-1 flex">
                      <div
                        :class="userRole.permissions.includes(permission.key) ? 'bg-cyan-900' : 'bg-gray-300'"
                        :id="'role_' + permission.key"
                        @click="
                          userRole.permissions.includes(permission.key)
                            ? userRole.permissions.splice(userRole.permissions.indexOf(permission.key), 1)
                            : userRole.permissions.push(permission.key)
                        "
                        aria-checked="false"
                        class="relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline"
                        role="checkbox"
                        tabindex="0"
                      >
                        <div
                          :class="userRole.permissions.includes(permission.key) ? 'translate-x-5' : 'translate-x-0'"
                          aria-hidden="true"
                          class="inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200"
                        ></div>
                      </div>
                      <div class="ml-3 text-xs text-cyan-900 capitalize">
                        {{ permission.label }}
                      </div>
                    </div>
                  </div>
                </template>
              </template>
            </div>
          </div>
          <div class="card-footer flex justify-between">
            <small class="text-xs text-gray-500 pt-4">{{ $t('Last updated at') }} : {{ userRole.updated_at }}</small>
            <span class="inline-flex">
              <router-link class="btn btn-app mx-1" to="/admin/user-roles">{{ $t('Cancel') }}</router-link>
              <button class="btn btn-green mx-1" type="submit">
                {{ $t('Update') }}
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
    <user-role-delete-model :show="deleteUserRoleModal" @cancelled="deleteUserRoleModal = false" @confirmed="deleteUserRole">
      <template #title>{{ $t('Delete user role') }}</template>
      {{ $t('Are you sure you want to delete the user role?') }}
      {{ $t('All users with this role will be moved to the default role') }}.
    </user-role-delete-model>
  </main>
</template>
<script>
import confirmationModel from '@/Components/layout/admin/confirmation';

export default {
  name: 'edit-user-role',
  metaInfo() {
    return {
      title: this.$i18n.t('Edit user role'),
    };
  },
  components: {
    UserRoleDeleteModel: confirmationModel,
  },
  data() {
    return {
      loading: true,
      deleteUserRoleModal: false,
      permissions: [],
      userRole: {
        name: null,
        permissions: [],
      },
    };
  },
  mounted() {
    this.getPermissions();
    this.getUserRole();
  },
  methods: {
    updateUserRole() {
      this.loading = true;
      axios
        .put(route('user-roles.update', this.$route.params.id), this.userRole)
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
    getUserRole() {
      this.loading = true;
      axios
        .get(route('user-roles.show', this.$route.params.id))
        .then((response) => {
          this.userRole = response.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
          this.$router.push('/admin/user-roles');
        });
    },
    deleteUserRole() {
      axios
        .delete(route('user-roles.destroy', this.$route.params.id))
        .then((response) => {
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          this.$router.push('/admin/user-roles');
        })
        .catch(() => {
          this.deleteUserRoleModal = false;
        });
    },
    getPermissions() {
      this.loading = true;
      axios
        .get(route('user-roles.permissions'))
        .then((response) => {
          this.permissions = response.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

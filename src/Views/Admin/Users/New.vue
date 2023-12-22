<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.plus-circle-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('Create user') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <router-link class="btn btn-app" to="/admin/users">
            {{ $t('Back') }}
          </router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <loading :status="loading"></loading>
        <form @submit.prevent="saveUser">
          <div class="md:grid md:grid-cols-3 md:gap-3 px-4 py-5 sm:p-6">
            <div class="md:col-span-1">
              <h3 class="form-description-head">
                {{ $t('User details') }}
              </h3>
              <p class="form-description-text">{{ $t('This information will be displayed publicly') }}.</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-3 gap-3">
                <div class="col-span-3">
                  <label class="form-label" for="name">{{ $t('Name') }}</label>
                  <div class="pt-1 relative shadow-sm">
                    <input :placeholder="$t('Name')" class="form-input" id="name" required v-model="user.name" />
                  </div>
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="email">{{ $t('Email') }}</label>
                  <div class="pt-1 relative shadow-sm">
                    <input :placeholder="$t('Email')" class="form-input" id="email" required type="email" v-model="user.email" />
                  </div>
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="password">{{ $t('Password') }}</label>
                  <div class="pt-1 relative shadow-sm">
                    <input :placeholder="$t('Password')" class="form-input" id="password" required type="password" v-model="user.password" />
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
                {{ $t('User settings') }}
              </h3>
              <p class="form-description-text">{{ $t('User access and permission settings') }}.</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-3 gap-3">
                <div class="col-span-3">
                  <label class="form-label" for="role">{{ $t('Role') }}</label>
                  <div class="pt-1 relative shadow-sm">
                    <select class="form-input bg-white" id="role" required v-model="user.role_id">
                      <option :value="null" disabled>
                        {{ $t('Select an option') }}
                      </option>
                      <option :key="index" :value="userRole.id" v-for="(userRole, index) in userRoles">
                        {{ userRole.name }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="status">{{ $t('Status') }}</label>
                  <input-switch
                    :disabled-label="$t('The user is disabled')"
                    :enabled-label="$t('The user is activated')"
                    id="status"
                    v-model="user.status"
                  ></input-switch>
                  <div class="form-description-text">
                    {{ $t('When the user is deactivated, the registry is created in the system') }}
                    {{ $t('so the email is reserved, but can not login until it is activated again') }}.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <span class="inline-flex">
              <router-link class="btn btn-app mx-1" to="/admin/users">{{ $t('Cancel') }}</router-link>
              <button class="btn btn-app" type="submit">
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
  name: 'new-user',
  metaInfo() {
    return {
      title: this.$i18n.t('Create user'),
    };
  },
  data() {
    return {
      loading: true,
      userRoles: [],
      user: {
        name: null,
        email: null,
        role_id: null,
        status: true,
        password: null,
      },
    };
  },
  mounted() {
    this.getUserRoles();
  },
  methods: {
    saveUser() {
      this.loading = true;
      axios
        .post(route('users.store'), this.user)
        .then((response) => {
          this.loading = false;
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: this.$i18n.t('Data saved correctly').toString(),
            type: 'success',
          });
          this.$router.push(`/admin/users`);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    getUserRoles() {
      this.loading = true;
      axios
        .get(route('users.user-roles'))
        .then((response) => {
          this.userRoles = response.data;
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

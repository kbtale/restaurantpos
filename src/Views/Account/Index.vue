<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.user-tag-regular"></svg-vue>
          <h1 class="content-title">
            {{ $t('Account information') }}
          </h1>
        </div>
        <router-link to="/" class="btn btn-app">
          {{ $t('Back') }}
        </router-link>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <form @submit.prevent="editUser">
          <loading :status="loading.details"></loading>
          <div class="md:grid md:grid-cols-3 md:gap-3 px-4 py-5 sm:p-6">
            <div class="md:col-span-1">
              <h3 class="form-description-head">
                {{ $t('Personal information') }}
              </h3>
              <p class="form-description-text">{{ $t('This information will be displayed publicly so be careful what you share') }}.</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-3 gap-3">
                <div class="col-span-3">
                  <label class="form-label text-white" for="name">{{ $t('Name') }}</label>
                  <div class="pt-1 relative shadow-sm">
                    <input :placeholder="$t('Your name')" class="form-input" id="name" v-model="user.name" />
                  </div>
                </div>

                <div class="col-span-3">
                  <label class="form-label text-white" for="email">{{ $t('Email') }}</label>
                  <div class="pt-1 relative shadow-sm">
                    <input class="form-input" id="email" placeholder="email@email.com" type="email" v-model="user.email" />
                  </div>
                </div>

                <div class="col-span-3">
                  <label class="form-label text-white" for="phone">{{ $t('Phone') }}</label>
                  <div class="pt-1 relative shadow-sm">
                    <input class="form-input" id="phone" :placeholder="$t('Phone')" v-model="user.phone" />
                  </div>
                </div>

                <div class="col-span-3">
                  <label class="form-label text-white" for="Address">{{ $t('Address') }}</label>
                  <div class="pt-1 relative shadow-sm">
                    <textarea class="form-input" id="Address" v-model="user.address"></textarea>
                  </div>
                </div>
              </div>
              <div class="mt-6">
                <label class="block text-sm leading-5 font-medium text-gray-700">{{ $t('Avatar') }}</label>
                <div class="mt-2 flex items-center select-none">
                  <div class="avatar-editor relative inline-block h-20 w-20 overflow-hidden bg-gray-100">
                    <button
                      @click="removeAvatar"
                      class="avatar-editor-remove absolute top-0 right-0 items-center p-0.5 leading-4 bg-red-600 text-white cursor-pointer"
                      type="button"
                      v-show="user.avatar !== 'gravatar'"
                    >
                      <svg-vue class="h-4 w-4 p-px" icon="font-awesome.times-light"></svg-vue>
                    </button>
                    <img :src="user.avatar === 'gravatar' ? user.gravatar : user.avatar_preview" alt="User avatar" class="h-full w-full text-gray-300" />
                  </div>
                  <span class="ml-5 shadow-sm">
                    <input @change="changeAvatar($event)" accept=".png, .jpg, .jpeg" hidden ref="changeAvatar" type="file" />
                    <button
                      @click="selectAvatar"
                      class="py-2 px-3 border border-gray-300 text-sm leading-4 font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800 transition duration-150 ease-in-out"
                      type="button"
                    >
                      {{ $t('Change') }}
                    </button>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <span class="inline-flex">
              <button class="btn btn-app" type="submit">
                {{ $t('Save') }}
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon text-white" icon="font-awesome.user-lock-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('Password change') }}
          </h1>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="content-card-body">
        <form @submit.prevent="changePassword">
          <loading :status="loading.password"></loading>
          <div class="md:grid md:grid-cols-3 md:gap-3 px-4 py-5 sm:p-6">
            <div class="md:col-span-1">
              <h3 class="form-description-head">
                {{ $t('Change password') }}
              </h3>
              <p class="form-description-text">{{ $t('Change your password for a new one, valid for the next login') }}.</p>
            </div>
            <div class="mt-5 md:mt-0 md:col-span-2">
              <div class="grid grid-cols-3 gap-3">
                <div class="col-span-3">
                  <label class="form-label text-white" for="current_password">{{ $t('Current password') }}</label>
                  <div class="pt-1 relative shadow-sm">
                    <input :placeholder="$t('Your current password')" class="form-input" id="current_password" type="password" v-model="user.current_password" />
                  </div>
                </div>
              </div>
              <div class="mt-6 grid grid-cols-3 gap-3">
                <div class="col-span-3">
                  <label class="form-label text-white" for="password">{{ $t('New password') }}</label>
                  <div class="pt-1 relative shadow-sm">
                    <input :placeholder="$t('Your new password')" class="form-input" id="password" type="password" v-model="user.password" />
                  </div>
                </div>
              </div>
              <div class="mt-6 grid grid-cols-3 gap-3">
                <div class="col-span-3">
                  <label class="form-label text-white" for="password_confirmation">{{ $t('Current password') }}</label>
                  <div class="pt-1 relative shadow-sm">
                    <input
                      :placeholder="$t('Confirm your new password')"
                      class="form-input"
                      id="password_confirmation"
                      type="password"
                      v-model="user.password_confirmation"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <span class="inline-flex">
              <button class="btn btn-app" type="submit">
                {{ $t('Change password') }}
              </button>
            </span>
          </div>
        </form>
      </div>
    </div>
  </main>
</template>
<script>
import Navbar from '@/Components/layout/shared/navbar';

export default {
  name: 'Index',
  metaInfo() {
    return {
      title: this.$i18n.t('Account'),
    };
  },
  components: { Navbar },
  mounted() {
    this.getUser();
  },
  data() {
    return {
      user: {
        name: null,
        email: null,
        phone: null,
        address: null,
        avatar: null,
        gravatar: null,
        avatar_preview: null,
        password: null,
        password_confirmation: null,
        current_password: null,
      },
      loading: {
        details: true,
        password: false,
      },
    };
  },
  methods: {
    getUser() {
      this.loading.details = true;
      axios
        .get(route('auth.user'))
        .then((response) => {
          this.loading.details = false;
          this.user = response.data;
          this.user.gravatar = response.data.gravatar;
          this.user.avatar_preview = response.data.avatar;
        })
        .catch(() => {
          this.loading.details = false;
        });
    },
    selectAvatar() {
      this.$refs.changeAvatar.click();
    },
    removeAvatar() {
      this.user.avatar = 'gravatar';
      this.user.avatar_preview = null;
      this.$refs.changeAvatar.value = '';
    },
    changeAvatar(event) {
      if (event.target.files.length) {
        if (['image/png', 'mage/x-citrix-png', 'image/x-png', 'image/jpeg', 'image/x-citrix-jpeg'].includes(event.target.files[0].type)) {
          this.user.avatar = event.target.files[0];
          this.user.avatar_preview = URL.createObjectURL(event.target.files[0]);
        } else {
          this.$notify({
            title: this.$i18n.t('Unsupported file type').toString(),
            text: this.$i18n.t('Only image type files are accepted').toString(),
            type: 'error',
          });
        }
      }
    },
    editUser() {
      const formData = new FormData();
      this.loading.details = true;
      formData.append('name', this.user.name);
      formData.append('email', this.user.email);
      formData.append('phone', this.user.phone);
      formData.append('address', this.user.address);
      formData.append('company_address', this.user.company_address);
      formData.append('company_name', this.user.company_name);
      if (this.user.avatar === 'gravatar') {
        formData.append('gravatar', 'true');
      } else if (this.user.avatar instanceof File) {
        formData.append('avatar', this.user.avatar);
      }
      axios
        .post(route('account.update'), formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: response.data.message.toString(),
            type: 'success',
          });
          if (response.data.user) {
            this.user.avatar = response.data.user.avatar;
            this.user.gravatar = response.data.user.gravatar;
            this.user.avatar_preview = response.data.user.avatar;
            this.$refs.changeAvatar.value = '';
            this.$store.commit('updateUser', response.data.user);
          }
          this.loading.details = false;
        })
        .catch(() => {
          this.loading.details = false;
        });
    },
    changePassword() {
      this.loading.password = true;
      axios
        .post(route('account.password'), {
          current_password: this.user.current_password,
          password: this.user.password,
          password_confirmation: this.user.password_confirmation,
        })
        .then(() => {
          this.loading.password = false;
          this.user.current_password = null;
          this.user.password = null;
          this.user.password_confirmation = null;
          this.$notify({
            title: this.$i18n.t('Success').toString(),
            text: this.$i18n.t('Password changed successfully').toString(),
            type: 'success',
          });
        })
        .catch(() => {
          this.loading.password = false;
        });
    },
  },
};
</script>
<style lang="scss">
.avatar-editor {
  .avatar-editor-remove {
    @apply hidden;
  }

  &:hover {
    .avatar-editor-remove {
      @apply inline-flex;
    }
  }
}
</style>

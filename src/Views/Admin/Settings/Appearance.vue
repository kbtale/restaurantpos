<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.palette-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('Appearance') }}
          </h1>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <router-link class="btn btn-app" to="/admin/settings">{{ $t('Back') }}</router-link>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <loading :status="loading"></loading>
      <form @submit.prevent="save">
        <div class="content-card-body">
          <div class="px-4 py-5 sm:p-6">
            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-3">
                <label class="form-label" for="app_icon">{{ $t('Logo') }}</label>
                <image-input :remove="false" id="app_icon" v-model="app_icon"></image-input>
              </div>
              <div class="col-span-3">
                <label class="form-label" for="app_background">{{ $t('Background') }}</label>
                <image-input :remove="false" id="app_background" v-model="app_background"></image-input>
              </div>
            </div>
          </div>
          <div class="card-footer">
            <div class="inline-flex">
              <button class="btn btn-app" type="submit">
                {{ $t('Save') }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </main>
</template>
<script>
export default {
  name: 'appearance',
  data() {
    return {
      loading: true,
      app_icon: {
        file: null,
        preview: null,
      },
      app_background: {
        file: null,
        preview: null,
      },
    };
  },
  mounted() {
    this.get();
  },
  methods: {
    get() {
      axios
        .get(route('settings.get.appearance'))
        .then((response) => {
          this.app_icon.preview = response.data.app_icon;
          this.app_background.preview = response.data.app_background;
          this.loading = false;
        })
        .catch(function () {
          this.$router.push('/admin/settings');
        });
    },
    save() {
      const formData = new FormData();
      this.loading = true;
      if (this.app_icon.file) {
        formData.append('icon', this.app_icon.file);
      }
      if (this.app_background.file) {
        formData.append('background', this.app_background.file);
      }
      axios
        .post(route('settings.set.appearance'), formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
          this.loading = false;
          if (this.app_icon.file) {
            this.app_icon.file = null;
            window.app.icon = this.app_icon.preview;
            document.querySelector("link[rel*='icon']").href = window.app.icon;
            this.$store.commit('setSettings', window.app);
          }
          if (this.app_background.file) {
            this.app_background.file = null;
            window.app.background = this.app_background.preview;
            this.$store.commit('setSettings', window.app);
          }
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
  },
};
</script>

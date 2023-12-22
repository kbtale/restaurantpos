<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.cogs-solid"></svg-vue>
          <h1 class="content-title">
            {{ $t('App Settings') }}
          </h1>
        </div>
      </div>
    </div>
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="my-3">
        <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          <router-link
            class="col-span-1 flex flex-col text-center cursor-pointer bg-white shadow rounded-md border border-cyan-900"
            tag="li"
            to="/admin/settings/general"
          >
            <div class="flex-1 flex flex-col p-6">
              <div class="flex-shrink-0 mx-auto">
                <svg-vue class="block-link-icon" icon="font-awesome.cog-regular"></svg-vue>
              </div>
              <h3 class="form-description-head">
                {{ $t('General') }}
              </h3>
              <p class="form-description-text">
                {{ $t('Configure general site settings') }}
              </p>
            </div>
          </router-link>
          <router-link
            class="col-span-1 flex flex-col text-center cursor-pointer bg-white shadow rounded-md border border-cyan-900"
            tag="li"
            to="/admin/settings/outgoing-mail"
          >
            <div class="flex-1 flex flex-col p-6">
              <div class="flex-shrink-0 mx-auto">
                <svg-vue class="block-link-icon" icon="font-awesome.inbox-out-duotone"></svg-vue>
              </div>
              <h3 class="form-description-head">
                {{ $t('Outgoing mail') }}
              </h3>
              <p class="form-description-text">
                {{ $t('Configure outgoing email service preferences') }}
              </p>
            </div>
          </router-link>

          <router-link
            class="col-span-1 flex flex-col text-center cursor-pointer bg-white shadow rounded-md border border-cyan-900"
            tag="li"
            to="/admin/settings/appearance"
          >
            <div class="flex-1 flex flex-col p-6">
              <div class="flex-shrink-0 mx-auto">
                <svg-vue class="block-link-icon" icon="font-awesome.palette-solid"></svg-vue>
              </div>
              <h3 class="form-description-head">
                {{ $t('Appearance') }}
              </h3>
              <p class="form-description-text">
                {{ $t('Configure the site icon and background') }}
              </p>
            </div>
          </router-link>
          <router-link
            class="col-span-1 flex flex-col text-center cursor-pointer bg-white shadow rounded-md border border-cyan-900"
            tag="li"
            to="/admin/settings/currency"
          >
            <div class="flex-1 flex flex-col p-2">
              <div class="flex-shrink-0 mx-auto">
                <svg-vue class="block-link-icon" icon="font-awesome.dollar-sign-solid"></svg-vue>
              </div>
              <h3 class="form-description-head">
                {{ $t('Currency') }}
              </h3>
              <p class="form-description-text">
                {{ $t('Configure site currency symbology') }}
              </p>
            </div>
          </router-link>
          <router-link class="col-span-1 flex flex-col text-center cursor-pointer bg-white shadow rounded-md border border-cyan-900" tag="li" to="/admin/settings/tax">
            <div class="flex-1 flex flex-col p-2">
              <div class="flex-shrink-0 mx-auto">
                <svg-vue class="block-link-icon" icon="font-awesome.money-check-alt-solid"></svg-vue>
              </div>
              <h3 class="form-description-head">
                {{ $t('Tax') }}
              </h3>
              <p class="form-description-text">
                {{ $t('Configure tax rate,type and implementation') }}
              </p>
            </div>
          </router-link>
          <router-link
            class="col-span-1 flex flex-col text-center cursor-pointer bg-white shadow rounded-md border border-cyan-900"
            tag="li"
            to="/admin/settings/authentication"
          >
            <div class="flex-1 flex flex-col p-6">
              <div class="flex-shrink-0 mx-auto">
                <svg-vue class="block-link-icon" icon="font-awesome.fingerprint-duotone"></svg-vue>
              </div>
              <h3 class="form-description-head">
                {{ $t('Authentication') }}
              </h3>
              <p class="form-description-text">
                {{ $t('Configure registration,and related things') }}
              </p>
            </div>
          </router-link>
          <router-link
            class="col-span-1 flex flex-col text-center cursor-pointer bg-white shadow rounded-md border border-cyan-900"
            tag="li"
            to="/admin/settings/captcha"
          >
            <div class="flex-1 flex flex-col p-6">
              <div class="flex-shrink-0 mx-auto">
                <svg-vue class="block-link-icon" icon="font-awesome.robot-duotone"></svg-vue>
              </div>
              <h3 class="form-description-head">
                {{ $t('Captcha') }}
              </h3>
              <p class="form-description-text">
                {{ $t('Configure captcha settings & preferences') }}
              </p>
            </div>
          </router-link>
          <router-link
            class="col-span-1 flex flex-col text-center cursor-pointer bg-white shadow rounded-md border border-cyan-900"
            tag="li"
            to="/admin/settings/localization"
          >
            <div class="flex-1 flex flex-col p-6">
              <div class="flex-shrink-0 mx-auto">
                <svg-vue class="block-link-icon" icon="font-awesome.language-duotone"></svg-vue>
              </div>
              <h3 class="form-description-head">
                {{ $t('Localization') }}
              </h3>
              <p class="form-description-text">
                {{ $t('Configure localization settings for the site') }}
              </p>
            </div>
          </router-link>
        </ul>
      </div>
    </div>
  </main>
</template>
<script>
export default {
  name: 'index',
};
</script>

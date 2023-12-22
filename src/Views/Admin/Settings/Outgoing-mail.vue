<template>
  <main class="flex-1 relative overflow-y-auto focus:outline-none" tabindex="0">
    <div class="my-6 max-w-1/6 mx-auto px-4 sm:px-6 lg:px-8">
      <div class="md:flex md:items-center md:justify-between">
        <div class="flex min-w-0">
          <svg-vue class="content-title-icon" icon="font-awesome.inbox-out-duotone"></svg-vue>
          <h1 class="content-title">
            {{ $t('Outgoing mail') }}
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
          <div class="px-4 py-5 bg-white sm:p-6">
            <div class="grid grid-cols-3 gap-3">
              <div class="col-span-3">
                <label class="form-label" for="queue_connection">
                  {{ $t('Processing') }}
                </label>
                <select class="form-input bg-white" id="queue_connection" required v-model="mail.queue_connection">
                  <option :value="null" disabled>
                    {{ $t('Select an option') }}
                  </option>
                  <option value="sync">{{ $t('Send synchronously') }}</option>
                  <option value="database">{{ $t('Should be queued to database and process latter') }}</option>
                </select>
                <template v-if="mail.queue_connection === 'database'">
                  <div v-if="command_1 || command_2" class="form-description-text px-2 md:flex justify-between">
                    {{ $t('Use this command for configuring cron jobs') }}.
                    <small v-if="command_1" class="bg-gray-200 font-semibold px-1"> {{ command_1 }}</small>
                    <small class="font-semibold" v-if="command_1 && command_2"> {{ $t('OR') }}</small>
                    <small v-if="command_2" class="bg-gray-200 font-semibold px-1"> {{ command_2 }}</small>
                  </div>
                </template>
              </div>
              <div class="col-span-3">
                <label class="form-label" for="mail_from_address">
                  {{ $t('From address') }}
                </label>
                <input :placeholder="$t('From address')" class="form-input" id="mail_from_address" required v-model="mail.mail_from_address" />
                <div class="form-description-text">{{ $t('All outgoing application emails will be sent from this email address') }}.</div>
              </div>
              <div class="col-span-3">
                <label class="form-label" for="mail_from_name">
                  {{ $t('From name') }}
                </label>
                <input :placeholder="$t('From name')" class="form-input" id="mail_from_name" required v-model="mail.mail_from_name" />
                <div class="form-description-text">{{ $t('All outgoing application emails will be sent using this name') }}.</div>
              </div>
              <div class="md:col-span-3">
                <div class="pt-2 pb-1">
                  <div class="border-t border-gray-200"></div>
                </div>
              </div>
              <div class="col-span-3">
                <label class="form-label" for="mail_mailer">
                  {{ $t('Outgoing mail method') }}
                </label>
                <select class="form-input bg-white" id="mail_mailer" required v-model="mail.mail_mailer">
                  <option :value="null" disabled>
                    {{ $t('Select an option') }}
                  </option>
                  <option value="mailgun">{{ $t('Mailgun') }}</option>
                  <option value="smtp">{{ $t('SMTP') }}</option>
                  <option value="sendmail">{{ $t('SendMail') }}</option>
                  <option value="log">
                    {{ $t('Log (Email will be saved to error log)') }}
                  </option>
                </select>
              </div>
              <template v-if="mail.mail_mailer === 'smtp'">
                <div class="col-span-3">
                  <label class="form-label" for="mail_host">{{ $t('SMTP Host') }}</label>
                  <input :placeholder="$t('SMTP Host')" class="form-input" id="mail_host" v-model="mail.mail_host" />
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="mail_username">
                    {{ $t('SMTP Username') }}
                  </label>
                  <input :placeholder="$t('SMTP Username')" class="form-input" id="mail_username" v-model="mail.mail_username" />
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="mail_password">
                    {{ $t('SMTP Password') }}
                  </label>
                  <input :placeholder="$t('SMTP Password')" class="form-input" id="mail_password" type="password" v-model="mail.mail_password" />
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="mail_port">
                    {{ $t('SMTP Port') }}
                  </label>
                  <input :placeholder="$t('SMTP Port')" class="form-input" id="mail_port" v-model="mail.mail_port" />
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="mail_encryption">
                    {{ $t('SMTP Encryption') }}
                  </label>
                  <input :placeholder="$t('SMTP Encryption')" class="form-input" id="mail_encryption" v-model="mail.mail_encryption" />
                </div>
              </template>
              <template v-if="mail.mail_mailer === 'mailgun'">
                <div class="col-span-3">
                  <label class="form-label" for="mailgun_domain">
                    {{ $t('Mailgun domain') }}
                  </label>
                  <input :placeholder="$t('Mailgun domain')" class="form-input" id="mailgun_domain" v-model="mail.mailgun_domain" />
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="mailgun_secret">
                    {{ $t('Mailgun secret') }}
                  </label>
                  <input :placeholder="$t('Mailgun secret')" class="form-input" id="mailgun_secret" v-model="mail.mailgun_secret" />
                </div>
                <div class="col-span-3">
                  <label class="form-label" for="mailgun_endpoint">
                    {{ $t('Mailgun endpoint') }}
                  </label>
                  <input :placeholder="$t('Mailgun endpoint')" class="form-input" id="mailgun_endpoint" v-model="mail.mailgun_endpoint" />
                </div>
              </template>
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
  name: 'outgoing-mail',
  data() {
    return {
      loading: true,
      command_1: null,
      command_2: null,
      mail: {
        queue_connection: 'sync',
        mail_from_address: null,
        mail_from_name: null,
        mail_mailer: null,
        mail_encryption: null,
        mail_host: null,
        mail_password: null,
        mail_port: null,
        mail_username: null,
        mailgun_domain: null,
        mailgun_secret: null,
        mailgun_endpoint: null,
      },
    };
  },
  mounted() {
    this.get();
  },
  methods: {
    get() {
      axios
        .get(route('settings.get.outgoing.mail'))
        .then((response) => {
          this.mail = response.data.data;
          this.command_1 = response.data.command_1;
          this.command_2 = response.data.command_2;
          this.loading = false;
        })
        .catch(function () {
          this.$router.push('/admin/settings');
        });
    },
    save() {
      this.loading = true;
      axios
        .post(route('settings.set.outgoing.mail'), this.mail)
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
  },
};
</script>

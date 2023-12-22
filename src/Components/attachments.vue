<template>
    <div>
        <div v-if="preview">
            <div v-if="attachments.length > 0" class="mt-2 col-span-3">
                <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                    <template v-for="(attachment, index) in attachments">
                        <attachment :details="attachment" :qr="true" :key="index" />
                    </template>
                </div>
            </div>
        </div>
        <div v-else class="bg-gray-100 border border-gray-200 p-2">
            <template v-if="upload">
                <input ref="fileInput" hidden type="file" @change="uploadFile($event)" />
                <template v-if="uploadingFileProgress > 0">
                    <div class="relative pt-1">
                        <div class="flex mb-2 items-center justify-between">
                            <div>
                                <span class="text-xs font-semibold inline-block py-1 px-2 uppercase -full text-gray-600 bg-gray-200"> {{ $t('Uploading') }}... </span>
                            </div>
                            <div class="text-right">
                                <span class="text-xs font-semibold inline-block text-gray-600"> {{ uploadingFileProgress }}% </span>
                            </div>
                        </div>
                        <div class="overflow-hidden h-2 text-xs flex bg-gray-200">
                            <div
                                :style="`width:${uploadingFileProgress}%`"
                                class="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-500"
                            ></div>
                        </div>
                    </div>
                </template>
                <template v-else>
                    <label
                        class="w-full flex flex-col items-center px-4 py-3 mb-2 bg-gray-800 text-white tracking-wide uppercase border border-blue cursor-pointer ease-linear transition-all duration-150 hover:bg-gray-700"
                        @click="selectUploadFile"
                    >
                        <svg-vue class="w-6 h-6" icon="font-awesome.cloud-upload-alt-solid"></svg-vue>
                        <span class="mt-1 text-l leading-normal">{{ $t('Attach files one by one') }}</span>
                    </label>
                </template>
            </template>
            <div>
                <loading :status="loading"></loading>
                <div v-if="attachments.length > 0" class="col-span-3">
                    <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-2">
                        <template v-for="(attachment, index) in attachments">
                            <attachment :details="attachment" :key="index" v-on:remove="removeAttachment(index)" />
                        </template>
                    </div>
                </div>
                <div v-else class="text-gray-400 text-center">
                    <p>{{ $t('No attachments') }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'attachments',
    data() {
        return {
            loading: false,
            uploadingFileProgress: 0,
            attachments: [],
        };
    },

    props: {
        upload: {
            type: Boolean,
            default: false,
        },
        preview: {
            type: Boolean,
            default: false,
        },
        files: {
            type: Array,
            default: function () {
                return [];
            },
        },
    },
    watch: {
        attachments(values) {
            this.$emit('attached', values);
        },
    },
    mounted() {
        this.attachments = this.files;
    },
    methods: {
        selectUploadFile() {
            if (!this.loading) {
                this.$refs.fileInput.click();
            } else {
                this.$notify({
                    title: this.$i18n.t('Error').toString(),
                    text: this.$i18n.t('A file is being uploaded').toString(),
                    type: 'warning',
                });
            }
        },
        uploadFile(e) {
            const self = this;
            const formData = new FormData();
            self.loading = true;
            formData.append('file', e.target.files[0]);
            axios
                .post(route('file.upload-attachment'), formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: function (progressEvent) {
                        self.uploadingFileProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    }.bind(this),
                })
                .then(function (response) {
                    self.loading = false;
                    self.uploadingFileProgress = 0;
                    self.$refs.fileInput.value = null;
                    self.attachments.push(response.data);
                })
                .catch(function () {
                    self.loading = false;
                    self.uploadingFileProgress = 0;
                    self.$refs.fileInput.value = null;
                });
        },
        removeAttachment(attachment) {
            this.attachments.splice(attachment, 1);
        },
    },
};
</script>

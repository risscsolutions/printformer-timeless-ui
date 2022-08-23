<template>
    <div class="columns is-multiline p-2 is-vcentered">
        <div class="column is-24 p-2">
            <p class="mb-1" v-html="$translate('SIDEBAR_LEFT_UPLOAD_INFO')"></p>
        </div>
        <step step="1" :text="$translate('SIDEBAR_LEFT_UPLOAD_INFO_STEP_1_TEXT')" :state="upload"></step>
        <step step="2" :text="$translate('SIDEBAR_LEFT_UPLOAD_INFO_STEP_2_TEXT')" :state="check"></step>
        <step step="3" :text="$translate('SIDEBAR_LEFT_UPLOAD_INFO_STEP_3_TEXT')" :state="preview"></step>
    </div>
</template>

<script>
import Events from "@rissc/printformer-editor-client/dist/Events";
import Step from "./upload/Step";

export default {
    name: "UploadInfo",
    components: {Step},
    data() {
        return {
            upload: 'loading',
            check: null,
            preview: null,
        }
    },
    mounted() {
        window.events.on('printformer:mediaUpload:fileSuccess', () => {
            this.upload = 'complete';
            this.check = 'loading';
        });
        window.events.on('printformer:mediaUpload:fileError', () => {
            this.upload = 'failed';
        });
        window.events.on(Events.PREFLIGHT.FAILED, () => {
            this.check = 'failed';
        });
        window.events.on(Events.PREFLIGHT.STARTED, () => {
            this.upload = 'complete';
            this.check = 'loading';
        });
        window.events.on(Events.PREFLIGHT.PROCESSED, (event) => {
            this.upload = 'complete';
            this.check = event.status === 1 ? 'complete' : 'failed';
            this.preview = 'loading';
        });
        window.events.on('TIMELESS:asset-uploaded', () => {
            this.upload = 'complete';
            this.check = 'complete';
            this.preview = 'complete';
        });
    }
}
</script>

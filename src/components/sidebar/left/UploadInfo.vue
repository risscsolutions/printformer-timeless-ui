<template>
    <div class="columns is-multiline p-2 is-vcentered">
        <div class="column is-24 p-2">
            <p class="mb-1">
                Die Verarbeitung deiner Datei läuft.<br>
                Dies kann einige Minuten dauern. Bitte habe solange Geduld.
            </p>
        </div>
        <step step="1" text="Deine Datei wird hochgeladen." :state="upload"></step>
        <step step="2" text="Deine Datei wird geprüft." :state="check"></step>
        <step step="3" text="Datei-Vorschau wird generiert." :state="preview"></step>
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

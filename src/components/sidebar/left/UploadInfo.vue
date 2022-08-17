<template>
    <div class="columns is-multiline p-2 is-vcentered">
        <div class="column is-24 p-2">
            <p class="mb-1">
                Die Verarbeitung deiner Datei läuft.<br>
                Dies kann einige Minuten dauern. Bitte habe solange Geduld.
            </p>
        </div>
        <step step="1" text="Deine Datei wird hochgeladen.">
            <span v-if="icon(upload)" v-bind="iconProps(upload)" slot="icon" v-html="$svg(icon(upload))"></span>
        </step>
        <step step="2" text="Deine Datei wird geprüft.">
            <span v-if="icon(check)" v-bind="iconProps(check)" slot="icon" v-html="$svg(icon(check))"></span>
        </step>
        <step step="3" text="Datei-Vorschau wird generiert.">
            <span v-if="icon(preview)" v-bind="iconProps(preview)" slot="icon" v-html="$svg(icon(preview))"></span>
        </step>
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
            this.check = 'complete';
            this.preview = 'loading';
        });
        window.events.on('TIMELESS:asset-uploaded', () => {
            this.upload = 'complete';
            this.check = 'complete';
            this.preview = 'complete';
        });
    },
    methods: {
        icon(icon) {
            switch (icon) {
                case 'loading':
                    return 'Ladebalken';
                case 'complete':
                    return 'Herunter';
                case 'failed':
                    return 'PfeilFormen'
            }
            return null;
        },
        iconProps(icon) {
            if (icon === 'loading') {
                return {
                    style: 'animation: 1.6s cubic-bezier(0.46, 0.03, 0.52, 0.96) 0s infinite normal none running loader-ring'
                }
            }
            return null;
        }
    }
}
</script>

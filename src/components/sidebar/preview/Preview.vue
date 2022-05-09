<template>
    <div class="column is-1 mr-3 mb-3 width-416 sidebar-no-pager" style="border: 1px solid black">
        <div class="columns is-multiline is-centered p-3">
            <div class="column is-24">
                <div class="columns is-multiline is-vcentered is-gapless">
                    <div class="column is-24">
                        <span class="subtitle is-4">PDF-Vorschau</span>
                    </div>
                    <div class="column is-24">
                    <span>
                        Bitte überprüfen Sie gründlich das Dokument,
                        insbesondere auf Rechtschreibfehler.
                    </span>
                    </div>
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="columns is-vcentered" style="cursor: pointer" @click="downloadFile">
                    <div class="column is-four-fifths">
                        <span class="subtitle is-4">Vorschau herunterladen</span>
                    </div>
                    <div class="column is-one-fifth">
                        <span class="icon" v-html="$svg('Abstand4')"></span>
                    </div>
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="columns is-mobile is-centered" :style="confirmedStyles">
                    <div class="column is-large is-2">
                        <input type="checkbox" @click="toggleConfirmed" v-model="confirmed">
                    </div>
                    <div class="column is-22" style="color: white; cursor: pointer" @click="toggleConfirmed">
                        {{ previewConfig.confirmText }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="css" scoped>
@import "@creativebulma/bulma-divider/dist/bulma-divider.min.css";

.sidebar-container {
    height: 100%;
    flex-direction: column;
    width: 100%;
    display: flex;
}
</style>
<script>
import {mapState} from "vuex";
import TopBar from "./TopBar";
import {EventBus} from '../../../event-bus';
import Events from "@rissc/printformer-editor-client/dist/Events";
import axios from 'axios';

export default {
    name: "preview",
    components: {TopBar},
    computed: {
        ...mapState(['previewConfig']),
        confirmedStyles() {
            return {
                'background-color': this.confirmed ? '#89AC7E' : '#905C6E'
            }
        }
    },
    mounted() {
        window.events.on(Events.PREVIEW_LOADED, (event) => {
            const {
                confirm,
                draftValidator,
                confirmationMessage,
                showLogoInToolbar,
                pdfUrl,
                confirmPreview,
                confirmText,
                downloadUrl,
                editorSteps
            } = event;

            this.$store.commit('setPreviewConfig', event);
        });
    },
    methods: {
        icon(name) {
            return this.$svg(name);
        },
        toggleConfirmed() {
            EventBus.$emit('clicked-confirmed', this.confirmed);
            this.confirmed = !this.confirmed;
        },
        downloadFile() {
            axios.get(this.previewConfig.downloadUrl, {responseType: 'blob'})
                .then(response => {
                    const blob = new Blob([response.data], {type: 'application/pdf'});
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = '';
                    link.click();
                    URL.revokeObjectURL(link.href);
                }).catch(console.error);
        }
    },
    data() {
        return {
            confirmed: false
        }
    }
}
</script>

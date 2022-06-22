<template>
    <div class="column is-1 mr-3 mb-3 width-416 sidebar-no-pager border-solid">
        <div class="columns is-multiline is-centered p-3">
            <div class="column is-24 py-0">
                <div class="content">
                    <h4 class="dark-gray-color like-h4 mb-1">PDF-Vorschau</h4>
                    <span class="dark-gray-color ">Bitte überprüfen Sie gründlich das Doku-ment, insbesondere auf Rechtschreibfehler.</span>
                </div>
            </div>
            <div class="column is-24">
                <hr class="divider">
            </div>
            <div class="column is-24 py-0">
                <div class="columns">
                    <div class="column is-flex is-justify-content-space-between py-2 is-align-items-center" >
                        <span class="dark-gray-color">Vorschau herunterladen</span>
                        <a class="icon" :href="previewConfig.downloadUrl" v-html="$svg('Download')"></a>
                    </div>
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="columns is-mobile is-centered" :style="confirmedStyles">
                    <div class="column is-large is-2 mt-1 ml-3">
                        <input class="bigcheckbox" type="checkbox" @click="toggleConfirmed" v-model="confirmed">
                    </div>
                    <div class="column is-22" style="color: white; cursor: pointer">
                        <button class="has-text-left" style="background-color: transparent" @click="toggleConfirmed">
                            <span class="is-size-6" style="color: white">{{ previewConfig.confirmText }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="css" scoped>
.sidebar-container {
    height: 100%;
    flex-direction: column;
    width: 100%;
    display: flex;
}

.bigcheckbox {
    -ms-transform: scale(2);
    -moz-transform: scale(2);
    -webkit-transform: scale(2);
    -o-transform: scale(2);
    transform: scale(2);
    padding: 10px;
}
</style>
<script>
import {mapState} from "vuex";
import TopBar from "./TopBar";
import {EventBus} from '../../../event-bus';
import Events from "@rissc/printformer-editor-client/dist/Events";

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
        }
    },
    data() {
        return {
            confirmed: false
        }
    }
}
</script>

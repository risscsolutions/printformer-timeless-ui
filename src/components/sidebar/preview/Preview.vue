<template>
    <div class="container is-fluid is-fullheight m-0 p-2">
        <top-bar :confirmed="confirmed"></top-bar>
        <div class="columns">
            <div ref="iframePdfPreview" class="column pl-3" style="display: block"></div>
            <div class="column is-1 mr-3 mb-3 width-416 sidebar-no-pager" style="border: 1px solid black">
                <div class="columns is-multiline is-centered p-3">
                    <div class="column is-24">
                        <span>PDF-Vorschau</span>
                        Bitte überprüfen Sie gründlich das Dokument,
                        insbesondere auf Rechtschreibfehler.
                    </div>
                    <div class="column is-24">
                        Vorschau herunterladen
                    </div>
                    <div class="column is-24">
                        <div class="columns is-mobile is-centered" :style="lelStyles">
                            <div class="column is-one-fifth">
                                <input type="checkbox" @click="toggleConfirmed" v-model="confirmed">
                            </div>
                            <div class="column is-four-fifths" style="color: white">
                                Hiermit bestätige ich, dass die Vorlage so gedruckt werden kann,
                                die Daten sowie Rechtschreibung meiner Datei sind korrekt.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
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
import Events from "@rissc/printformer-editor-client/dist/Events";

export default {
    name: "preview",
    components: {TopBar},
    mounted() {
        // window.events.on(Events.EDITOR_LOADED, () => {
            this.$refs.iframePdfPreview.append(document.getElementById('previewFrame'))
        // });
    },
    computed: {
        ...mapState(['editorConfig']),
        lelStyles() {
            return {
                'background-color': this.confirmed ? '#89AC7E' : '#905C6E'
            }
        }
    },
    methods: {
        icon(name) {
            return this.$svg(name);
        },
        toggleConfirmed() {
            this.confirmed = !this.confirmed
        }
    },
    data() {
        return {
            confirmed: false
        }
    }
}
</script>

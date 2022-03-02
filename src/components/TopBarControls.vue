<template>
    <div class="columns is-mobile">
        <div class="column is-1 ml-2">
            <button class="button is-white">
                <span class="icon is-small">
                    <i class="fas fa-search"></i>
                    <span class="ml-1">55%</span>
                </span>
            </button>
        </div>
        <div class="column is-1 is-offset-13" style="text-align:right;">
            <button class="button is-warning">
                <span class="icon is-small">
                    <i class="fas fa-exclamation-triangle"></i>
                </span>
            </button>
        </div>
        <div class="column">
            <div class="field has-addons">
                <p class="control">
                    <button @click="goBack" class="button">
                        <span class="icon is-small">
                            <i class="fas fa-backward"></i>
                        </span>
                        <span>Zurück zum Artikel</span>
                    </button>
                </p>
                <p class="control">
                    <button @click="editorSave" class="button">
                        <span class="icon is-small">
                            <i class="fas fa-save"></i>
                        </span>
                        <span>Entwurf Speichern</span>
                    </button>
                </p>
                <p class="control">
                    <button @click="pagePreview" class="button">
                        <span class="icon is-small">
                            <i class="fas fa-eye"></i>
                        </span>
                        <span>Weiter zur Vorschau</span>
                    </button>
                </p>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from "vuex";
import Events from "@rissc/printformer-editor-client/dist/Events";

export default {
    name: "top-bar-controls",
    computed: {
        ...mapState(['editorConfig'])
    },
    mounted() {
        window.events.on(Events.EDITOR_LOADED, async (config) => {
            this.$store.commit('setEditorConfig', config);
            this.editorLoaded = true;
        });
    },
    methods: {
        goBack() {

        },
        editorSave() {

        },
        pagePreview() {

        }
    },
    data() {
        return {
            editorLoaded: false
        }
    }
}
</script>

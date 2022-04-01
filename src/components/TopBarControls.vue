<template>
    <div class="columns is-mobile is-vcentered is-centered">
        <div class="column is-2">
            <span @click="editorZoomIn()">
                <i class="fas fa-plus"></i>
            </span>
            <span>55%</span>
            <span @click="editorZoomOut()">
                <i class="fas fa-minus"></i>
            </span>
        </div>
        <div class="column is-1 is-offset-12" style="text-align:right;">
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

            // loop through pages to load threedee preview correctly
            this.wait(2000)
                .then(async () => {
                    let pages = await this.$editor.getPager().pages;
                    await this.$editor.getLoader().show('Loading...');

                    for (let i = 1; i < pages.length; i++) {
                        if (i < pages.length) {
                            await this.$editor.getPager().showPage(i);
                        }
                    }

                    await this.$editor.getPager().showPage(1);
                    await this.$editor.getLoader().hide();
                });

            this.editorLoaded = true;
        });
    },
    methods: {
        goBack() {

        },
        async editorSave() {
            await this.$editor.getLoader().show('Entwurf wird gespeichert...');
            await this.$editor.save();
            await this.$editor.getLoader().hide();
        },
        pagePreview() {

        },
        editorZoomIn() {
            this.$editor.getZoom().in();
        },
        editorZoomOut() {
            this.$editor.getZoom().out();
        },
        wait(t) {
            return new Promise(function(resolve) {
                window.setTimeout(resolve, t)
            });
        }
    },
    data() {
        return {
            currentActiveObject: null,
            editorLoaded: false,
            shouldShowMenu: false
        }
    }
}
</script>

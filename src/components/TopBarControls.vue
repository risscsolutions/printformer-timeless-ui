<template>
    <div class="columns is-mobile is-vcentered is-centered">
        <div class="column is-1 has-text-centered dark-gray-color" style="width: 95px">
            <span @click="editorZoomIn()" style="cursor: pointer">
                <i class="fas fa-plus"></i>
            </span>
            <span>55%</span>
            <span @click="editorZoomOut()" style="cursor: pointer">
                <i class="fas fa-minus"></i>
            </span>
        </div>
        <div class="column buttons has-text-right mb-0">
            <button v-if="hasWarnings" class="button no-radius " style="background: #AC5D7A">
                <span class="icon is-small" v-html="icon('Warnung')"></span>
            </button>
            <button @click="goBack" class="button no-radius is-dark dark-gray-background-color">
                <span class="icon is-small" v-html="icon('Zueueck')"></span>
                <span>Zurück zum Artikel</span>
            </button>
            <button @click="editorSave" class="button no-radius is-info ">
                <span class="icon is-small" v-html="icon('Soeichern')"></span>
                <span>Entwurf Speichern</span>
            </button>
            <button @click="pagePreview" class="button no-radius is-info ">
                <span class="icon is-small" v-html="icon('Auge')"></span>
                <span>Weiter zur Vorschau</span>
            </button>
        </div>
        <div class="column is-2 is-hidden-touch"></div>
    </div>
</template>
<script>
import {mapState, mapGetters} from "vuex";
import Events from "@rissc/printformer-editor-client/dist/Events";

export default {
    name: "top-bar-controls",
    computed: {
        ...mapState(['editorConfig', 'notifications']),
        hasWarnings() {
            return this.notifications.some(notification => ['warning', 'error'].includes(notification.type));
        }
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
        icon(name) {
            return this.$svg(name);
        },
        goBack() {

        },
        editorSave() {
            this.$editor.getLoader().show('Entwurf wird gespeichert...')
                .then(() => this.$catch(this.$editor.save()))
                .then(() => this.$editor.getLoader().hide())
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
            return new Promise(function (resolve) {
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

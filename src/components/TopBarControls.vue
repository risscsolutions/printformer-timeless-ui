<template>
    <div class="columns is-mobile is-vcentered is-centered mb-0" :class="{'blured-no-pointer': traceControlsIsOpen || fullScreenLoaderVisible}">
        <div class="column is-4 dark-gray-color pt-5 pb-0">
            <span @click="editorZoomIn" style="cursor: pointer; vertical-align: middle;" class="svg-20"
                  v-html="icon('Plus')">
            </span>
            <b>{{ zoom }}%</b>
            <span @click="editorZoomOut" style="cursor: pointer; vertical-align: middle;" class="svg-20"
                  v-html="icon('Minus')">
            </span>
        </div>
        <div class="column buttons has-text-right mb-0">
            <button v-if="hasWarnings" @click="openShowroom" class="button no-radius mb-0" style="background: #AC5D7A">
                <span class="icon is-small" v-html="icon('Warnung')"></span>
            </button>
            <button @click="goBack" class="button no-radius is-dark dark-gray-background-color mb-0">
                <span class="icon is-small" v-html="icon('Zueueck')"></span>
                <span class="has-text-weight-light">ZURÜCK ZUM ARTIKEL</span>
            </button>
            <button @click="editorSave" class="button no-radius is-info mb-0">
                <span class="icon is-small" v-html="icon('Soeichern')"></span>
                <span class="has-text-weight-light"
                      title="Dein Entwurf wurde für dich gespeichert">ENTWURF SPEICHERN</span>
            </button>
            <button @click="pagePreview" class="button no-radius is-info mb-0">
                <span class="icon is-small" v-html="icon('Auge')"></span>
                <span class="has-text-weight-light">WEITER ZUR VORSCHAU</span>
            </button>
        </div>
        <div class="column is-2 is-hidden-touch"></div>
    </div>
</template>
<script>
import {mapMutations, mapState} from "vuex";
import Events from "@rissc/printformer-editor-client/dist/Events";
import {goToStep} from "../helpers";
import {urlQueryObject} from "../helper";

export default {
    name: "top-bar-controls",
    computed: {
        ...mapState(['editorConfig', 'notifications', 'traceControlsIsOpen', 'fullScreenLoaderVisible', 'editorLoaded']),
        hasWarnings() {
            return this.notifications.some(notification => ['warning', 'error'].includes(notification.type));
        }
    },
    mounted() {
        window.events.on(Events.EDITOR_LOADED, async (config) => {

            // loop through pages to load threedee preview correctly
            // this.wait(2000)
            //     .then(async () => {
            //         let pages = await this.$editor.getPager().pages;
            //         await this.$editor.getLoader().show('Loading...');
            //
            //         for (let i = 1; i < pages.length; i++) {
            //             if (i < pages.length) {
            //                 await this.$editor.getPager().showPage(i);
            //             }
            //         }
            //
            //         await this.$editor.getPager().showPage(1);
            //         await this.$editor.getLoader().hide();
            //         this.$editor.getZoom().get().then(zoom => this.zoom = parseInt(zoom * 100));
            //     });
        });
    },
    methods: {
        icon(name) {
            return this.$svg(name);
        },
        goBack() {
            goToStep(this.editorConfig.editorSteps.previous, urlQueryObject().query.draft)
        },
        editorSave(e) {
            this.$editor.getLoader().show('Entwurf wird gespeichert...')
            this.showFullScreenLoader();
            this.$catch(this.$editor.save())
                .then(() => {
                    this.hideFullScreenLoader();
                    return this.$editor.getLoader().hide()
                })
                .then(() => {
                    setTimeout(() => $(e.target).tooltip('destroy'), 800);
                    $(e.target)
                        .tooltip({
                            position: {my: "center center", at: "center bottom+35"},
                            classes: {
                                'ui-tooltip': 'py-2 px-4 is-size-7 has-arrow-center-top'
                            }
                        })
                        .tooltip("open");
                })
        },
        pagePreview() {
            this.showFullScreenLoader()
            this.$editor.goToNextStep()
                .then(() => {
                    goToStep(this.editorConfig.editorSteps.next, urlQueryObject().query.draft)
                }, () => this.hideFullScreenLoader());
        },
        editorZoomIn() {
            this.$editor.getZoom().in().then(zoom => this.zoom = parseInt(zoom * 100));
        },
        editorZoomOut() {
            this.$editor.getZoom().out().then(zoom => this.zoom = parseInt(zoom * 100));
        },
        wait(t) {
            return new Promise(function (resolve) {
                window.setTimeout(resolve, t)
            });
        },
        ...mapMutations(['openShowroom', 'showFullScreenLoader', 'hideFullScreenLoader'])
    },
    data() {
        return {
            zoom: 55,
            currentActiveObject: null,
            shouldShowMenu: false
        }
    }
}
</script>

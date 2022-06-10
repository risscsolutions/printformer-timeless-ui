<template>
    <div v-show="editorLoaded" :class="{'is-1 width-50': !showroomIsOpen, 'is-6': showroomIsOpen}" class="column my-3"
         style="display: grid">
        <div class="columns">
            <div class="column has-background-light is-1 width-50">
                <div class="columns direction-column">
                    <div>
                        <button v-show="!showroomIsOpen" class="button is-info no-radius width-50 height-50"
                                @click="openSidebarPanel()">
                      <span class="icon is-small" v-html="$svg('Pfeil3', 'stroke-white')">
                      </span>
                        </button>
                        <button v-show="showroomIsOpen"
                                class="button is-dark dark-gray-background-color no-radius width-50 height-50"
                                @click="closeSidebarPanel()">
                            <span class="icon is-small" v-html="$svg('Pfeil2', 'stroke-white')"></span>
                        </button>
                    </div>
                    <div style="transform-origin: 52px 40px; transform: rotate(270deg);">
                        <b class="dark-gray-color">HINWEISE</b>
                    </div>
                </div>
                <div class="caution-icon">
                    <span v-html="icon('Ausrufezeichen')"></span>
                </div>
            </div>
            <div v-show="showroomIsOpen" class="column p-4 dark-gray-color border-solid"
                 :class="{'sidebar-with-pager': isMultiPage, 'sidebar-no-pager': !isMultiPage}">
                <div v-if="notifications.length && !traceControlsIsOpen">
                    <div v-for="notification in notifications">
                        <b v-if="notification.type === 'error'" class="has-text-danger">Fehler</b>
                        <b v-else-if="notification.type === 'info'" class="has-text-info">Info</b>
                        <b v-else-if="notification.type === 'warning'" class="has-text-warning">Warnung</b>
                        <div class="is-flex is-justify-content-space-between is-align-items-center">
                            <p>{{ notification.message }}</p>
                            <button v-if="notification.action" class="button is-info is-small"
                                    @click="doAction(notification.id)">
                                <span class="icon is-small" v-html="$svg('Pfeil3', 'stroke-white')"></span>
                            </button>
                        </div>
                        <hr class="divider my-3">
                    </div>
                </div>
                <p v-if="!traceControlsIsOpen" class="mb-1 like-h4">
                    KLICKE AUF DIE SYMBOLE IN DER
                    RECHTEN MENÜLEISTE, UM DEINE
                    WERBEARTIKEL ZU GESTALTEN
                </p>
                <p v-else class="mb-1 like-h4">
                    HIER STEHT EIN GANZ TOLLER HILFETEXT.
                    HIER STEHT EIN GANZ TOLLER HILFETEXT.
                    HIER STEHT EIN GANZ TOLLER HILFETEXT.
                </p>
                <component v-if="openControlTab && !traceControlsIsOpen" :is="infoComponent"></component>
                <div>
                    <iframe ref="threedeeiframe"
                            style="min-height: 400px; width: 100%; height: 100%; display: none"></iframe>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>

.caution-icon {
    position: relative;
    top: 50px;
    left: 6px;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.2s ease;
}

.slide-enter,
.slide-leave-to {
    transform: translateX(-100%);
    transition: all 150ms ease-in 0s
}
</style>
<script>
import {mapMutations, mapState} from "vuex";
import Events from "@rissc/printformer-editor-client/dist/Events";
import AssetsInfo from "./AssetsInfo";
import ShapesInfo from "./ShapesInfo";
import TextsInfo from "./TextsInfo";
import ViewSettingsInfo from "./ViewSettingsInfo";
import VariantsInfo from "./VariantsInfo";
import {goToStep} from "../../../helpers";
import {urlQueryObject} from "../../../helper";

export default {
    name: "showroom",
    components: {AssetsInfo, ShapesInfo, TextsInfo, ViewSettingsInfo, VariantsInfo},

    computed: {
        infoComponent() {
            return `${this.openControlTab}-info`;
        },
        isMultiPage() {
            return this.previewPages.length > 1;
        },
        ...mapState(['editorConfig', 'is3D', 'notifications', 'openControlTab', 'previewPages', 'showroomIsOpen', 'traceControlsIsOpen', 'editorLoaded']),
    },
    mounted() {
        window.events.on(Events.EDITOR_LOADED, () => {
            this.currentPage = 1;
            this.has3D = this.editorConfig.configuration.show3DPreview;
        });

        window.events.on(Events.EDITOR_PAGES_PAGED, (pageInfo) => {
            this.currentPage = pageInfo.pageNumber;
        });

        window.events.on(Events.EDITOR_LOADED, async (config) => {
            if (config.configuration.show3DPreview) {
                const editorIframe = document.getElementById('editor-iframe');
                this.$refs.threedeeiframe.src = editorIframe.src.replace(new RegExp(/\/embed/), '/3d');
                this.$editor.setThreeDeeElement(this.$refs.threedeeiframe);
            }
        });

        this.$editor.registerConfirmCallback('LEAVE_EDITOR_WITH_ERRORS', (confirm) => {
            this.openSidebarPanel();

            const dialog = $('#confirm-leave-with-errors');
            dialog
                .dialog({
                    classes: {
                        "ui-dialog": 'py-4 px-6 z-index-2000',
                        "ui-dialog-titlebar": "is-hidden",
                    },
                    autoOpen: false,
                    resizable: false,
                    height: "auto",
                    width: 450,
                    modal: true,
                    buttons: [
                        {
                            text: "JA",
                            class: "button no-radius is-info my-0",
                            click: () => {
                                confirm(true);
                                dialog.dialog("close")
                            }
                        },
                        {
                            text: "ABBRECHEN",
                            class: "button no-radius is-dark dark-gray-background-color my-0",
                            click: () => {
                                confirm(false)
                                dialog.dialog("close");
                            }
                        }
                    ]
                })
                .dialog('open');
        });

        this.$editor.registerConfirmCallback('ASSETS_ARE_LOADING', (confirm) => {
            const dialog = $('#confirm-assets-are-loading');
            dialog
                .text(this.editorConfig.configuration.labels.assetsAreLoading)
                .dialog({
                    classes: {
                        "ui-dialog": 'py-4 px-6',
                        "ui-dialog-titlebar": "is-hidden",
                    },
                    autoOpen: false,
                    resizable: false,
                    height: "auto",
                    width: 450,
                    modal: true,
                    buttons: [
                        {
                            text: "JA",
                            class: "button no-radius is-info my-0",
                            click: () => {
                                confirm(true);
                                dialog.dialog("close")
                            }
                        },
                        {
                            text: "ABBRECHEN",
                            class: "button no-radius is-dark dark-gray-background-color my-0",
                            click: () => {
                                confirm(false)
                                dialog.dialog("close");
                            }
                        }
                    ]
                })
                .dialog('open');

        });

        this.$editor.registerConfirmCallback('HAS_SEEN_ALL_PAGES', (confirm) => {
            const dialog = $('#confirm-has-seen-all-pages');
            dialog
                .text(this.editorConfig.configuration.labels.hasSeenAllPages)
                .dialog({
                    classes: {
                        "ui-dialog": 'py-4 px-6',
                        "ui-dialog-titlebar": "is-hidden",
                    },
                    autoOpen: false,
                    resizable: false,
                    height: "auto",
                    width: 450,
                    modal: true,
                    buttons: [
                        {
                            text: "JA",
                            class: "button no-radius is-info my-0",
                            click: () => {
                                confirm(true);
                                dialog.dialog("close")
                            }
                        },
                        {
                            text: "ABBRECHEN",
                            class: "button no-radius is-dark dark-gray-background-color my-0",
                            click: () => {
                                confirm(false)
                                dialog.dialog("close");
                            }
                        }
                    ]
                })
                .dialog('open');
        });
        this.$editor.registerConfirmCallback('OTHER_USER_REQUESTS_ENTRY', (confirm, user) => {
            if (!user) {
                confirm(false);
                return;
            }
            const dialog = $('#confirm-user-entry-request');
            dialog
                .text(`${user.name} möchte in den Editor. Den Entwurf speichern und abgeben?`)
                .dialog({
                    classes: {
                        "ui-dialog": 'py-4 px-6',
                        "ui-dialog-titlebar": "is-hidden",
                    },
                    autoOpen: false,
                    resizable: false,
                    height: "auto",
                    width: 450,
                    modal: true,
                    buttons: [
                        {
                            text: "JA",
                            class: "button no-radius is-info my-0",
                            click: () => {
                                confirm(true);
                                setTimeout(() => {
                                    goToStep(this.editorConfig.editorSteps.cancel, urlQueryObject().query.draft)
                                }, 200);
                                dialog.dialog("close")
                            }
                        },
                        {
                            text: "ABBRECHEN",
                            class: "button no-radius is-dark dark-gray-background-color my-0",
                            click: () => {
                                confirm(false)
                                dialog.dialog("close");
                            }
                        }
                    ]
                })
                .dialog('open');
        });

        window.events.on(Events.MEDIA_UPLOAD_FILE_ERROR, this.openSidebarPanel.bind(this));
    },
    methods: {
        icon(name) {
            return this.$svg(name);
        },
        doAction(id) {
            this.$editor.getNotifications().doAction(id);
        },
        load3DModel() {
            if (this.is3D !== this.has3D) {
                this.$store.commit('setIs3D', true);
                this.has3D = true;
                this.currentPage = '3D';
                this.$refs.threedeeiframe.style.display = 'block';
            }
        },
        closeSidebarPanel() {
            this.closeShowroom();
            if (!this.has3D) return;

            this.load3DModel();
            this.$refs.threedeeiframe.style.display = 'block';
        },
        openSidebarPanel() {
            this.openShowroom();
            this.$refs.threedeeiframe.style.display = 'none';
        },
        ...mapMutations(['openShowroom', 'closeShowroom']),
    },
    data() {
        return {
            currentPage: null,
            has3D: false,
        }
    }
}
</script>

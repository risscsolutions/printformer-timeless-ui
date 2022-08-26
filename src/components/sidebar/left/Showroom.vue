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
                        <b class="dark-gray-color is-uppercase">{{ $translate('SIDEBAR_LEFT_NOTIFICATIONS_TITLE') }}</b>
                    </div>
                </div>
                <div class="caution-icon">
                    <span v-html="icon('Ausrufezeichen')"></span>
                </div>
            </div>
            <div v-show="showroomIsOpen" class="column p-4 dark-gray-color border-solid"
                 :class="{'sidebar-with-pager': isMultiPage, 'sidebar-no-pager': !isMultiPage}">
                <upload-info v-if="uploading"></upload-info>
                <trace-control-info v-else-if="traceControlsIsOpen"></trace-control-info>
                <template v-else>
                    <notifications></notifications>
                    <component :is="infoComponent"></component>
                </template>
                <div>
                    <iframe v-show="show3DPreview"
                            ref="threedeeiframe"
                            style="min-height: 400px; width: 100%; height: 100%;"></iframe>
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
import {mapGetters, mapMutations, mapState} from "vuex";
import Events from "@rissc/printformer-editor-client/dist/Events";
import AssetsInfo from "./AssetsInfo";
import ShapesInfo from "./ShapesInfo";
import TextsInfo from "./TextsInfo";
import ViewSettingsInfo from "./ViewSettingsInfo";
import VariantsInfo from "./VariantsInfo";
import {goToStep} from "../../../helpers";
import {urlQueryObject} from "../../../helper";
import UploadInfo from "./UploadInfo";
import Notifications from "./Notifications";
import DefaultInfo from "./DefaultInfo";
import TraceControlInfo from "./TraceControlInfo";

export default {
    name: "showroom",
    components: {
        TraceControlInfo,
        Notifications,
        AssetsInfo,
        ShapesInfo,
        TextsInfo,
        ViewSettingsInfo,
        VariantsInfo,
        UploadInfo,
        DefaultInfo
    },

    computed: {
        infoComponent() {
            return `${this.openControlTab ? this.openControlTab : 'Default'}-info`;
        },
        isMultiPage() {
            return this.previewPages.length > 1;
        },
        ...mapState([
            'editorConfig',
            'openControlTab',
            'previewPages',
            'showroomIsOpen',
            'traceControlsIsOpen',
            'editorLoaded'
        ]),
        show3DPreview() {
            return this.editorConfig?.configuration?.show3DPreview;
        }
    },
    mounted() {
        window.events.on(Events.EDITOR_PAGES_PAGED, (pageInfo) => {
            this.currentPage = pageInfo.pageNumber;
        });

        window.events.on(Events.EDITOR_LOADED, async (config) => {
            this.currentPage = 1;
            if (config.configuration.show3DPreview) {
                const editorIframe = document.getElementById('editor-iframe');
                const waitForIt = setInterval(() => {
                    if (this.$refs.threedeeiframe) {
                        clearInterval(waitForIt);
                        this.$refs.threedeeiframe.src = editorIframe.src.replace(new RegExp(/\/embed/), '/3d');
                        this.$editor.setThreeDeeElement(this.$refs.threedeeiframe);
                        setTimeout(() => {
                            this.$editor.getPager().showPage(this.currentPage);
                            this.$editor.getPager().getPagePreview(this.currentPage);
                        }, 10);
                    }
                }, 100);
            }
        });

        window.events.on('TIMELESS:asset-uploading', () => {
            this.uploading = true;
        });
        window.events.on('TIMELESS:asset-uploaded', () => {
            setTimeout(() => this.uploading = false, 200);
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
                            text: this.$translateMultiple(['MODAL_LEAVE_EDITOR_WITH_ERRORS_CONFIRM', 'MODAL_CONFIRM']),
                            class: "button no-radius is-info my-0 is-uppercase",
                            click: () => {
                                confirm(true);
                                dialog.dialog("close")
                            }
                        },
                        {
                            text: this.$translateMultiple(['MODAL_LEAVE_EDITOR_WITH_ERRORS_CANCEL', 'MODAL_CANCEL', 'CANCEL']),
                            class: "button no-radius is-dark dark-gray-background-color my-0 is-uppercase",
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
                            text: this.$translateMultiple(['MODAL_ASSETS_ARE_LOADING_CONFIRM', 'MODAL_CONFIRM']),
                            class: "button no-radius is-info my-0 is-uppercase",
                            click: () => {
                                confirm(true);
                                dialog.dialog("close")
                            }
                        },
                        {
                            text: this.$translateMultiple(['MODAL_ASSETS_ARE_LOADING_CANCEL', 'MODAL_CANCEL', 'CANCEL']),
                            class: "button no-radius is-dark dark-gray-background-color my-0 is-uppercase",
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
                            text: this.$translateMultiple(['MODAL_HAS_SEEN_ALL_PAGES_CONFIRM', 'MODAL_CONFIRM']),
                            class: "button no-radius is-info my-0 is-uppercase",
                            click: () => {
                                confirm(true);
                                dialog.dialog("close")
                            }
                        },
                        {
                            text: this.$translateMultiple(['MODAL_HAS_SEEN_ALL_PAGES_CANCEL', 'MODAL_CANCEL', 'CANCEL']),
                            class: "button no-radius is-dark dark-gray-background-color my-0 is-uppercase",
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
                .text(this.$translate('MODAL_OTHER_USER_REQUESTS_ENTRY_CONTENT', {user: user.name}))
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
                            text: this.$translateMultiple(['MODAL_OTHER_USER_REQUESTS_ENTRY_CONFIRM', 'MODAL_CONFIRM']),
                            class: "button no-radius is-info my-0 is-uppercase",
                            click: () => {
                                confirm(true);
                                setTimeout(() => {
                                    goToStep(this.editorConfig.editorSteps.cancel, urlQueryObject().query.draft)
                                }, 200);
                                dialog.dialog("close")
                            }
                        },
                        {
                            text: this.$translateMultiple(['MODAL_OTHER_USER_REQUESTS_ENTRY_CANCEL', 'MODAL_CANCEL', 'CANCEL']),
                            class: "button no-radius is-dark dark-gray-background-color my-0 is-uppercase",
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
        closeSidebarPanel() {
            this.closeShowroom();
            setTimeout(() => this.$editor.getZoom().get().then(zoom => this.setZoom(parseInt(zoom * 100))), 100);
        },
        openSidebarPanel() {
            this.openShowroom();
            setTimeout(() => this.$editor.getZoom().get().then(zoom => this.setZoom(parseInt(zoom * 100))), 100);

        },
        ...mapMutations(['openShowroom', 'closeShowroom', 'setZoom']),
    },
    data() {
        return {
            uploading: false,
        }
    }
}
</script>

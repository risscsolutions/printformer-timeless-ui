<template>
    <div class="is-flex is-flex-direction-column">
        <div class="columns is-multiline is-centered">
            <div class="column is-24" v-if="allowAddAssets">
                <div class="box columns is-flex-direction-column is-centered is-vcentered gray-background p-2"
                     style="cursor: pointer" :class="{'no-interaction': activeObject}" @click="uploadMediaAsset">
                    <span :style="{'opacity': activeObject ? '50%' : '100%'}"
                          class="dark-gray-color">{{ $translate('SIDEBAR_RIGHT_ASSETS_NEW') }}</span>
                    <span :style="{'opacity': activeObject ? '50%' : '100%'}" class="svg-30 is-flex m-1"
                          v-html="icon('HinzufuegenPlus')"></span>
                </div>
            </div>
            <div class="column is-24" v-if="allowAddAssets">
                <hr class="divider">
            </div>
            <div class="column is-24" v-if="allowAddAssets || isAllowed('asset-replace')">
                <div class="box columns is-flex-direction-column is-centered is-vcentered gray-background p-2"
                     @dragover="dragover"
                     @dragleave="dragleave" @drop="drop"
                     style="cursor: pointer" @click="uploadMediaAsset">
                    <span class="dark-gray-color">{{ $translate('SIDEBAR_RIGHT_ASSETS_UPLOAD_TITLE') }}</span>
                    <span class="svg-30 is-flex m-1" v-html="icon('Bilder_hochladen')"></span>
                    <div class="columns m-0 is-flex-direction-column has-text-centered dark-gray-color">
                        <input ref="uploadFile" type="file" multiple hidden :accept="'.'+editorConfig.configuration.upload.acceptedFileExtensions.join(',.')"
                               @change="uploadImage">
                        <span v-html="assetUploadText"></span>
                    </div>
                </div>
            </div>
            <div v-if="allowAddAssets || isAllowed('asset-replace')" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="isFilled && !isGraphic" class="column is-24 py-0">
                <div class="columns">
                    <div class="column is-flex is-justify-content-space-between py-2 is-align-items-center">
                        <span class="dark-gray-color">{{ $translate('SIDEBAR_RIGHT_ASSETS_QUALITY') }}</span>
                        <span class="dark-gray-color dpi-circle border-solid"
                              :style="{'background-color': qualityColor}"></span>
                    </div>
                </div>
            </div>
            <div v-if="isFilled && !isGraphic" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="isFilled && isAllowed('asset-cut-out')" class="column is-24 py-0">
                <div class="content">
                    <div class="columns">
                        <div class="column is-flex py-2 is-align-items-center">
                            <span class="dark-gray-color">{{ $translate('SIDEBAR_RIGHT_ASSETS_ZOOM') }}</span>
                        </div>
                        <div class="column is-flex is-justify-content-flex-end py-2 is-align-items-center">
                            <button @click="assetZoomIn" :title="$translate('SIDEBAR_RIGHT_ASSETS_ZOOM_IN')"
                                    class="button is-small muted-button width-30">
                                <span class="svg-30 no-interaction is-flex" v-html="icon('HinzufuegenPlus')"></span>
                            </button>
                            <button @click="assetZoomOut" :title="$translate('SIDEBAR_RIGHT_ASSETS_ZOOM_OUT')"
                                    class="button is-small ml-2 muted-button width-30">
                                <span class="svg-30 no-interaction is-flex" v-html="icon('HinzufuegenMinus')"></span>
                            </button>
                            <button @click="assetFit" :title="$translate('SIDEBAR_RIGHT_ASSETS_ZOOM_FIT')"
                                    class="button is-small ml-2 muted-button width-30">
                                <span class="svg-30 no-interaction is-flex" v-html="icon('vergroessern')"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isFilled && isAllowed('asset-cut-out')" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="isAllowed('delete') || isFilled && isAllowed('asset-replace')" class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between py-2 is-align-items-center">
                        <span class="dark-gray-color">{{ $translate('SIDEBAR_RIGHT_ASSETS_DELETE') }}</span>
                        <span @click="deleteAssetBox" style="cursor: pointer" class="svg-30 is-flex"
                              v-html="icon('Loeschen')"></span>
                    </div>
                </div>
            </div>
            <div v-if="isAllowed('delete') || isFilled && isAllowed('asset-replace')" class="column is-24">
                <hr class="divider">
            </div>
            <template v-if="showExtendedSwitch">
                <div class="column is-24 py-0">
                    <div class="columns is-multiline">
                        <div class="column is-flex is-flex-direction-column is-align-items-center py-2">
                            <label class="has-text-weight-medium blue-color mb-2" for="extendedEditSwitch">
                                {{ $translate('SIDEBAR_RIGHT_ASSETS_EXTENDED_EDIT') }}
                            </label>
                            <div class="onoffswitch">
                                <input type="checkbox" :checked="extendedEditSwitchOn" @click="toggleExtendedEdit"
                                       name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" tabindex="0">
                                <label class="onoffswitch-label" for="myonoffswitch">
                                    <span class="onoffswitch-inner"></span>
                                    <span class="onoffswitch-switch"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <extended-edit v-if="extendedEditSwitchOn && activeObject" :active-object="activeObject"
                               :opacity="opacity"
                               :has-trace-button="showTraceButton"
                               :has-alignment="isAllowed('hmove') || isAllowed('vmove')"
                               :has-layer="isAllowed('zindex')"
                               :has-opacity="isAllowed('opacity')" :has-duplicate="isAllowed('duplicate')">
                </extended-edit>
                <div class="column is-24">
                    <hr class="divider">
                </div>
            </template>
        </div>
        <div v-show="hasUserMedias && (allowAddAssets || isAsset)" class="columns is-24 mt-auto">
            <div class="box gray-background">
                <div class="columns is-multiline is-centered">
                    <div class="column is-24">
                        <div class="content is-align-content-center has-text-centered">
                            <span
                                class="dark-gray-color has-text-weight-semibold">{{
                                    $translate('SIDEBAR_RIGHT_ASSETS_USER_MEDIA')
                                }}</span>
                        </div>
                    </div>
                    <div class="column is-24">
                        <div class="tile is-ancestor is-flex-wrap-wrap media-wrapper">
                            <div v-for="media in userMedias" class="tile is-6 p-1 is-parent" style="display: block;">
                                <article style="cursor: pointer;" @click="addUserMedia(media)"
                                         class="tile is-child is-flex is-align-items-center p-1 border-purple">
                                    <figure
                                        class="image is-flex is-align-items-center is-justify-content-center is-flex-grow-1 is-flex-shrink-1">
                                        <img class="has-ratio media-in-wrapper" :src="media.src"
                                             crossorigin="anonymous" draggable="false">
                                    </figure>
                                </article>
                                <p class="is-size-6 dark-gray-color has-text-centered" style="word-break: break-all">
                                    {{ media.name }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="css" scoped>

.dpi-circle {
    border: 1px solid #4f4d4d;
    width: 30px;
    height: 30px;
    border-radius: 5rem;
}

.media-wrapper {
    max-height: 300px;
    overflow-y: auto;
}

.media-in-wrapper {
    height: 100% !important;
    width: auto !important;
    max-width: 100% !important;
    max-height: 60px !important;
}
</style>
<script>
import BlockTypes, {AssetTypes} from "@rissc/printformer-ts-common/dist/BlockTypes";
import Events from "@rissc/printformer-editor-client/dist/Events";
import EditorObject, {Asset, BlockEffects} from "@rissc/printformer-editor-client/dist/Objects";
import bulmaSlider from "bulma-slider/src/js";
import ExtendedEdit from "./ExtendedEdit";
import {mapGetters, mapMutations, mapState} from "vuex";
import BlockActions from "../../../BlockActions";

export default {
    name: "assets",
    props: {
        activeObject: EditorObject
    },
    components: {ExtendedEdit},
    created() {
        this.loadAssets();
    },
    mounted() {
        bulmaSlider.attach();

        window.events.on('TIMELESS:reload-media', () => {
            this.loadUserMedias();
        });

        window.events.on(Events.EDITOR_OBJECT_CLEARED, () => {
            this.dpi = 0;
            this.opacity = 100;
            this.showTraceButton = false;
        });

        window.events.on(Events.EDITOR_OBJECT_SELECTED, (block) => {
            this.dpi = block.dpi;
            this.opacity = (block.opacity * 100);
            this.loadAssets();
            this.showTraceButton = !!block.effects
                .find((effect) => {
                    return [BlockEffects.vector, BlockEffects.embossing].includes(effect.type);
                }) && block.isFilled;
        });

        window.events.on(Events.EDITOR_OBJECT_UPDATED, (block) => {
            this.dpi = block.dpi;
            this.opacity = (block.opacity * 100);
            this.showTraceButton = !!block.effects
                .find((effect) => {
                    return [BlockEffects.vector, BlockEffects.embossing].includes(effect.type);
                }) && block.isFilled;
        });

        this.loadUserMedias();

        const dialog = $('#delete-asset-dialog');
        dialog
            .dialog({
                classes: {
                    "ui-dialog": 'py-4 px-6',
                    "ui-dialog-titlebar": "is-hidden",
                },
                autoOpen: false,
                resizable: false,
                height: "auto",
                width: 384,
                modal: true,
                buttons: [
                    {
                        text: this.$translateMultiple(['MODAL_ASSETS_DELETE_CONFIRM', 'MODAL_DELETE_CONFIRM']),
                        class: "button no-radius is-info my-0 is-uppercase",
                        click: () => {
                            const prohibitedActions = this.activeObject.prohibitedActions;

                            if (prohibitedActions.includes(BlockActions.DELETE)) {
                                if (Asset.isAsset(this.activeObject) && !prohibitedActions.includes(BlockActions.ASSET_REPLACE)) {
                                    this.$catch(this.activeObject.clear())
                                        .then(() => dialog.dialog("close"));
                                }
                            } else {
                                this.$catch(this.activeObject.delete())
                                    .then(() => dialog.dialog("close"));
                            }
                        }
                    },
                    {
                        text: this.$translateMultiple(['MODAL_ASSETS_DELETE_CANCEL', 'MODAL_DELETE_CANCEL', 'CANCEL']),
                        class: "button no-radius is-dark dark-gray-background-color my-0 is-uppercase",
                        click: () => {
                            dialog.dialog("close");
                        }
                    }
                ]
            });
    },
    methods: {
        icon(name) {
            return this.$svg(name);
        },
        async loadAssets() {
            this.assets = await this.$editor.findEditorObjects({
                type: BlockTypes.ASSET
            });
        },
        uploadMediaAsset() {
            this.$refs.uploadFile.click();
        },
        async uploadImage(event) {
            const files = (typeof event.dataTransfer === 'undefined')
                ? event.target.files
                : event.dataTransfer.files;

            window.events.emit('TIMELESS:asset-uploading');

            (this.isAsset
                    ? this.$catch(this.activeObject.replaceWithFile(files[0]))
                    : Promise.all(
                        [...files].map(file => this.$catch(this.$editor.addAssetBlockFromFile(file))))
            ).finally(() => {
                window.events.emit('TIMELESS:asset-uploaded');
                this.loadUserMedias();
            });
        },
        addUserMedia(media) {
            // check has active object and active object is type asset
            // if it has then replace with selected image
            // if not just add a new asset block
            if (this.isAsset) {
                this.$catch(this.activeObject.replaceWithMedia('userMedia', media.id)
                    .then(block => window.events.emit('TIMELESS:asset-replaced', block)));
            } else {
                this.$catch(this.$editor.addAssetBlockFromMedia('userMedia', media.id));
            }
        },
        loadUserMedias() {
            let params = {
                mediaProvider: 'userMedia',
                additionalData: {},
                page: this.pagination.page,
                limit: 50
            }

            this.$editor.getMediaProvider().getMedia(params).then((userMedias) => {
                this.userMedias = userMedias.filter(userMedia => userMedia.id);
            });
        },
        assetZoomIn() {
            this.$catch(this.activeObject.zoomIn());
        },
        assetZoomOut() {
            this.$catch(this.activeObject.zoomOut());
        },
        assetFit() {
            this.$catch(this.activeObject.fitAsset());
        },
        deleteAssetBox(e) {
            $('#delete-asset-dialog')
                .dialog('option', 'position', {my: "right center", at: "left-300 center", of: $(e.currentTarget)})
                .dialog('open');
        },
        dragover(event) {
            event.preventDefault();
            // Add some visual fluff to show the user can drop its files
            if (!event.currentTarget.classList.contains('has-background-success')) {
                event.currentTarget.classList.remove('gray-background');
                event.currentTarget.classList.add('has-background-success');
            }
        },
        dragleave(event) {
            event.currentTarget.classList.add('gray-background');
            event.currentTarget.classList.remove('has-background-success');
        },
        drop(event) {
            event.preventDefault();
            event.currentTarget.classList.add('gray-background');
            event.currentTarget.classList.remove('has-background-success');
            this.$catch(this.uploadImage(event));
        },
        toggleExtendedEdit() {
            this.opacity = (this.activeObject.opacity * 100);
            this.enableExtendedEdit();
        },
        changeOpacity() {
            this.$catch(this.activeObject.setOpacity((parseInt(this.opacity) / 100)));
        },
        duplicateAssetBlock() {
            this.$catch(this.activeObject.duplicate());
        },
        moveUp(allTheWay) {
            this.$catch(this.activeObject.moveZIndexUp(allTheWay));
        },
        moveDown(allTheWay) {
            this.$catch(this.activeObject.moveZIndexDown(allTheWay));
        },
        openAlignment() {
            this.openAlignmentSettings = !this.openAlignmentSettings;
        },
        openLayer() {
            this.openLayerSettings = !this.openLayerSettings;
        },
        centerBlockH() {
            this.$catch(this.activeObject.centerH());
        },
        centerBlockV() {
            this.$catch(this.activeObject.centerV());
        },
        isAllowed(action) {
            return this.isAsset && !this.activeObject.prohibitedActions.includes(action);
        },
        ...mapMutations(['enableExtendedEdit'])
    },
    computed: {
        ...mapState(['editorConfig']),
        showExtendedSwitch() {
            return (this.showTraceButton
                || this.isAllowed(BlockActions.OPACITY)
                || this.isAllowed(BlockActions.H_MOVE)
                || this.isAllowed(BlockActions.V_MOVE)
                || this.isAllowed(BlockActions.Z_INDEX)
                || this.isAllowed(BlockActions.DUPLICATE))
        },
        hasAssets() {
            return this.assets.length > 0;
        },
        hasUserMedias() {
            return this.userMedias.length > 0;
        },
        isAsset() {
            return this.activeObject && Asset.isAsset(this.activeObject);
        },
        isFilled() {
            return this.isAsset && this.activeObject.isFilled;
        },
        isGraphic() {
            return this.isAsset && this.activeObject.assetType === AssetTypes.GRAPHIC;
        },
        qualityColor() {
            if (!this.activeObject) return;

            const dpi = this.activeObject.restrictions.dpi
            let color;

            switch (true) {
                case (this.dpi < dpi.perfect && this.dpi >= dpi.error):
                    color = '#ffc600';
                    break;
                case (this.dpi < dpi.error):
                    color = '#c61e28';
                    break;
                default:
                    color = '#00ac63';
                    break;
            }

            return color;
        },
        ...mapGetters(['allowAddAssets', 'extendedEditSwitchOn']),
        assetUploadText() {
            const computer = `<span class="blue-under">${this.$translate('SIDEBAR_RIGHT_ASSETS_UPLOAD_CONTENT_COMPUTER')}</span>`;

            return "<span>" + this.$translate('SIDEBAR_RIGHT_ASSETS_UPLOAD_CONTENT', {computer}) + "</span>";
        }
    },
    data() {
        return {
            opacity: 0,
            assets: {},
            imageUrl: '',
            userMedias: [],
            dpi: 0,
            pagination: {
                page: 1
            },
            openAlignmentSettings: false,
            openLayerSettings: false,
            showTraceButton: false,
        }
    }
}
</script>

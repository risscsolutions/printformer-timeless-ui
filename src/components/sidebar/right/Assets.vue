<template>
    <div class="is-flex is-flex-direction-column">
        <div class="columns is-multiline is-centered">
            <div class="column is-24" v-if="allowAddAssets">
                <div class="box columns is-flex-direction-column is-centered is-vcentered gray-background p-2"
                     style="cursor: pointer" :class="{'no-interaction': activeObject}" @click="uploadMediaAsset">
                    <span :style="{'opacity': activeObject ? '50%' : '100%'}" class="dark-gray-color">Neue Bildbox</span>
                    <span :style="{'opacity': activeObject ? '50%' : '100%'}" class="svg-20 m-1" v-html="icon('HinzufuegenPlus')"></span>
                </div>
            </div>
            <div class="column is-24" v-if="allowAddAssets">
                <hr class="divider">
            </div>
            <div class="column is-24">
                <div class="box columns is-flex-direction-column is-centered is-vcentered gray-background p-2"
                     style="cursor: pointer" @click="uploadMediaAsset">
                    <span class="dark-gray-color">Bilder hochladen</span>
                    <span class="svg-20 m-1" v-html="icon('Bilder_hochladen')"></span>
                    <div class="columns m-0 is-flex-direction-column has-text-centered dark-gray-color"
                         @dragover="dragover"
                         @dragleave="dragleave" @drop="drop">
                        <input ref="uploadFile" type="file" hidden accept=".jpg,.jpeg,.png,.pdf" @change="uploadImage">
                        <span>vom <span class="blue-under">Computer</span> oder</span>
                        <span>per Drag and Drop</span>
                        <span>in die Box ziehen</span>
                    </div>
                </div>
            </div>
            <div v-if="isAsset && !isGraphic" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="isAsset && !isGraphic" class="column is-24 py-0">
                <div class="columns">
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Bildqualität</span>
                        <span class="dark-gray-color dpi-circle" :style="{'background-color': qualityColor}"></span>
                    </div>
                </div>
            </div>
            <div v-if="isAsset" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="isAsset" class="column is-24 py-0">
                <div class="content">
                    <div class="columns">
                        <div class="column is-14">
                            <span class="dark-gray-color">Bild zoomen</span>
                        </div>
                        <div class="column is-3">
                            <span @click="assetZoomIn" style="cursor: pointer" class="svg-20"
                                  v-html="icon('HinzufuegenPlus')"></span>
                        </div>
                        <div class="column is-3">
                            <span @click="assetZoomOut" style="cursor: pointer" class="svg-20"
                                  v-html="icon('HinzufuegenMinus')"></span>
                        </div>
                        <div class="column is-3">
                            <span @click="assetFit" style="cursor: pointer" class="svg-20"
                                  v-html="icon('vergroessern')"></span>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isAsset" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="isAsset" class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Bildbox löschen</span>
                        <span @click="deleteAssetBox" style="cursor: pointer" class="svg-20"
                              v-html="icon('Loeschen')"></span>
                    </div>
                </div>
            </div>
            <div v-if="isAsset" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="isAsset" class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-flex-direction-column is-align-items-center">
                        <label class="has-text-weight-medium blue-color mb-2" for="extendedEditSwitch">
                            Erweiterte Bild-Bearbeitung
                        </label>
                        <div class="onoffswitch">
                            <input type="checkbox" :checked="extendedEditSwitchOn" @click="enableExtendedEdit"
                                   name="onoffswitch" class="onoffswitch-checkbox" id="myonoffswitch" tabindex="0">
                            <label class="onoffswitch-label" for="myonoffswitch">
                                <span class="onoffswitch-inner"></span>
                                <span class="onoffswitch-switch"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <extended-edit v-if="extendedEditSwitchOn && activeObject" :active-object="activeObject" :opacity="opacity"
                           :has-trace-button="true" :has-alignment="true" :has-layer="true" :has-opacity="true">
            </extended-edit>
            <div v-if="isAsset" class="column is-24">
                <hr class="divider">
            </div>
        </div>
        <div v-if="hasUserMedias" class="columns is-24 mt-auto">
            <div class="box gray-background">
                <div class="columns is-multiline is-centered">
                    <div class="column is-24">
                        <div class="content is-align-content-center has-text-centered">
                            <span class="dark-gray-color has-text-weight-semibold">Deine Bilder</span>
                        </div>
                    </div>
                    <div class="column is-24">
                        <div class="tile is-ancestor is-flex-wrap-wrap media-wrapper">
                            <div v-for="media in userMedias" class="tile is-6 p-1 is-parent">
                                <article style="cursor: pointer" @click="addUserMedia(media)"
                                         class="tile is-child is-flex is-align-items-center p-1 border-purple">
                                    <figure class="image is-flex is-align-items-center is-justify-content-center is-flex-grow-1 is-flex-shrink-1">
                                        <img class="has-ratio media-in-wrapper" :src="media.src" crossorigin="anonymous">
                                    </figure>
                                    <!--                                        <p class="subtitle">{{ media.name }}</p>-->
                                </article>
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
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 5rem;
}
.media-wrapper {
    max-height: 500px;
    overflow-y: scroll;
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
import EditorObject, {Asset} from "@rissc/printformer-editor-client/dist/Objects";
import bulmaSlider from "bulma-slider/src/js";
import ExtendedEdit from "./ExtendedEdit";
import {mapGetters} from "vuex";

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

        window.events.on(Events.EDITOR_OBJECT_SELECTED, (block) => {
            this.dpi = block.dpi;
            this.opacity = (block.opacity * 100)
            this.loadAssets();
        });

        window.events.on(Events.EDITOR_OBJECT_UPDATED, (block) => {
            this.dpi = block.dpi;
            this.opacity = (block.opacity * 100)
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
                        text: "LÖSCHEN",
                        class: "button no-radius is-info my-0",
                        click: () => {
                            this.$catch(this.activeObject.delete())
                                .then(() => dialog.dialog("close"));
                        }
                    },
                    {
                        text: "ABBRECHEN",
                        class: "button no-radius is-dark dark-gray-background-color my-0",
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
            let file;
            if (typeof event.dataTransfer === 'undefined') {
                file = event.target.files[0];
            } else {
                file = event.dataTransfer.files[0];
            }

            this.$catch(this.$editor.addAssetBlockFromFile(file))
                .then(() => this.loadUserMedias());
        },
        addUserMedia(media) {
            // check has active object and active object is type asset
            // if it has then replace with selected image
            // if not just add a new asset block
            if (this.isAsset) {
                this.$catch(this.activeObject.replaceWithMedia('userMedia', media.id));
            } else {
                this.$catch(this.$editor.addAssetBlockFromMedia('userMedia', media.id));
            }
        },
        loadUserMedias() {
            let params = {
                mediaProvider: 'userMedia',
                additionalData: {},
                page: this.pagination.page,
                limit: 25
            }

            this.$editor.getMediaProvider().getMedia(params).then((userMedias) => {
                this.userMedias = userMedias;
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
        enableExtendedEdit() {
            this.opacity = (this.activeObject.opacity * 100);
            this.extendedEditSwitchOn = !this.extendedEditSwitchOn;
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
        }
    },
    computed: {
        hasAssets() {
            return this.assets.length > 0;
        },
        hasUserMedias() {
            return this.userMedias.length > 0;
        },
        isAsset() {
            return this.activeObject && Asset.isAsset(this.activeObject);
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
        ...mapGetters(['allowAddAssets']),

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
            extendedEditSwitchOn: false,
            openAlignmentSettings: false,
            openLayerSettings: false
        }
    }
}
</script>

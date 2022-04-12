<template>
    <div v-if="hasAssets">
        <div class="columns is-multiline is-centered">
            <div class="column is-24">
                <div class="box" style="cursor: pointer" @click="uploadMediaAsset">
                    Neue Bildbox
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="box">
                    <div class="columns is-centered is-multiline">
                        <div class="column is-24" style="cursor: pointer" @click="uploadMediaAsset">
                            <span>Neues Bild hochladen</span>
                            <span>
                                <i class="fas fa-upload"></i>
                            </span>
                        </div>
                        <div class="column is-24">
                            <div class="p-12" @dragover="dragover" @dragleave="dragleave" @drop="drop">
                                <input ref="uploadFile" type="file" hidden accept=".jpg,.jpeg,.png" @change="uploadImage">
                                <span>vom Computer oder per Drag and Drop in die Box ziehen</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isAsset" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="isAsset" class="column is-24">
                <div class="columns is-multiline">
                    <div class="column">
                        <b>Bildqualität</b>
                        <span>{{ dpi }} dpi</span>
                    </div>
                </div>
            </div>
            <div v-if="isAsset" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="isAsset" class="column is-24">
                <div class="content">
                    <div class="columns">
                        <div class="column is-14">
                            <b>Bild zoomen</b>
                        </div>
                        <div class="column is-3" style="cursor: pointer" @click="assetZoomIn">
                            <i class="fas fa-plus-circle fa-1x"></i>
                        </div>
                        <div class="column is-3" style="cursor: pointer" @click="assetZoomOut">
                            <i class="fas fa-minus-circle fa-1x"></i>
                        </div>
                        <div class="column is-3" style="cursor: pointer" @click="assetFit">
                            <i class="fas fa-expand-alt fa-1x"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="isAsset" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="isAsset" class="column is-24">
                <div class="columns is-multiline">
                    <div class="column">
                        <div @click="deleteAssetBox" style="cursor: pointer"><b>Bild löschen</b> <i class="fas fa-trash"></i></div>
                    </div>
                </div>
            </div>
            <div v-if="isAsset" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="isAsset" class="column is-24">
                <div class="columns is-multiline">
                    <div class="column">
                        <div class="field">
                            <input id="extendedEditSwitch" :checked="extendedEditSwitchOn" @click="enableExtendedEdit" class="switch is-info"
                                   name="extendedEditSwitch" type="checkbox">
                            <label for="extendedEditSwitch">Erweiterte Bearbeitung</label>
                        </div>
                    </div>
                </div>
            </div>
            <extended-edit v-if="extendedEditSwitchOn" :active-object="activeObject" :opacity="opacity"
                           :has-alignment="true" :has-layer="true" :has-opacity="true">
            </extended-edit>
            <div v-if="hasUserMedias" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="hasUserMedias" class="column is-24">
                <div class="box">
                    <div class="columns is-multiline is-centered">
                        <div class="column is-24">
                            <div class="content is-align-content-center">
                                <span>Meine Medien</span>
                            </div>
                        </div>
                        <div class="column is-24">
                            <div class="tile is-ancestor is-flex-wrap-wrap" style="max-height: 500px; overflow-y: scroll">
                                <div v-for="media in userMedias" class="tile is-6 is-parent">
                                    <article style="cursor: pointer" @click="addUserMedia(media)" class="tile is-child">
                                        <figure class="image">
                                            <img class="has-ratio" :src="media.src">
                                        </figure>
                                        <p class="subtitle">{{ media.name }}</p>
                                    </article>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="css" scoped>
    @import "@creativebulma/bulma-divider/dist/bulma-divider.min.css";
    @import "/node_modules/bulma-switch/dist/css/bulma-switch.min.css";
    @import "/node_modules/bulma-slider/dist/css/bulma-slider.min.css";
</style>
<script>
import BlockTypes from "@rissc/printformer-ts-common/dist/BlockTypes";
import Events from "@rissc/printformer-editor-client/dist/Events";
import EditorObject, {Asset} from "@rissc/printformer-editor-client/dist/Objects";
import bulmaSlider from "bulma-slider/src/js";
import ExtendedEdit from "./ExtendedEdit";

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
    },
    methods: {
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

            await this.$editor.addAssetBlockFromFile(file);
            this.loadUserMedias();
        },
        addUserMedia(media) {
            // check has active object and active object is type asset
            // if it has then replace with selected image
            // if not just add a new asset block
            if (this.activeObject && this.isAsset) {
                this.activeObject.replaceWithMedia('userMedia', media.id)
            } else {
                this.$editor.addAssetBlockFromMedia('userMedia', media.id)
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
        async assetZoomIn() {
            await this.activeObject.zoomIn();
        },
        async assetZoomOut() {
            await this.activeObject.zoomOut();
        },
        async assetFit() {
            await this.activeObject.fitAsset();
        },
        async deleteAssetBox() {
            await this.activeObject.delete();
        },
        dragover(event) {
            event.preventDefault();
            // Add some visual fluff to show the user can drop its files
            if (!event.currentTarget.classList.contains('has-background-success')) {
                event.currentTarget.classList.remove('has-background-white');
                event.currentTarget.classList.add('has-background-success');
            }
        },
        dragleave(event) {
            event.currentTarget.classList.add('has-background-white');
            event.currentTarget.classList.remove('has-background-success');
        },
        async drop(event) {
            event.preventDefault();
            event.currentTarget.classList.add('has-background-white');
            event.currentTarget.classList.remove('has-background-success');
            await this.uploadImage(event);
        },
        enableExtendedEdit() {
            this.opacity = (this.activeObject.opacity * 100);
            this.extendedEditSwitchOn = !this.extendedEditSwitchOn;
        },
        async changeOpacity() {
            await this.activeObject.setOpacity((parseInt(this.opacity) / 100));
        },
        async duplicateAssetBlock() {
            await this.activeObject.duplicate();
        },
        async moveUp(allTheWay) {
            await this.activeObject.moveZIndexUp(allTheWay);
        },
        async moveDown(allTheWay) {
            await this.activeObject.moveZIndexDown(allTheWay);
        },
        openAlignment() {
            this.openAlignmentSettings = !this.openAlignmentSettings;
        },
        openLayer() {
            this.openLayerSettings = !this.openLayerSettings;
        },
        async centerBlockH() {
            await this.activeObject.centerH();
        },
        async centerBlockV() {
            await this.activeObject.centerV();
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
            extendedEditSwitchOn: false,
            openAlignmentSettings: false,
            openLayerSettings: false
        }
    }
}
</script>

<template>
    <div class="is-flex is-flex-direction-column">
        <div class="columns is-multiline is-centered">
            <div class="column is-24">
                <div class="box columns is-flex-direction-column is-centered is-vcentered gray-background"
                     style="cursor: pointer" @click="uploadMediaAsset">
                    <span class="dark-gray-color">Neue Bildbox</span>
                    <span class="svg-20 m-1" v-html="icon('HinzufuegenPlus')"></span>
                </div>
            </div>
            <div class="column is-24">
                <hr class="divider">
            </div>
            <div class="column is-24">
                <div class="box columns is-flex-direction-column is-centered is-vcentered gray-background"
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
            <div v-if="!isGraphic" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="!isGraphic" class="column is-24 py-0">
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
                        <span class="dark-gray-color">Bild löschen</span>
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
                    <div class="column is-flex is-flex-direction-column is-centered is-vcentered">
                        <div>
                        </div>
                        <div class="field">
                            <input id="extendedEditSwitch" :checked="extendedEditSwitchOn" @click="enableExtendedEdit"
                                   class="switch is-info"
                                   name="extendedEditSwitch" type="checkbox">
                            <label class="has-text-weight-medium blue-color" for="extendedEditSwitch">Erweiterte
                                Bild-Bearbeitung</label>
                        </div>
                    </div>
                </div>
            </div>
            <extended-edit v-if="extendedEditSwitchOn" :active-object="activeObject" :opacity="opacity"
                           :has-alignment="true" :has-layer="true" :has-opacity="true">
            </extended-edit>
            <div v-if="hasUserMedias" class="column is-24">
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
                        <div class="tile is-ancestor is-flex-wrap-wrap" style="max-height: 500px; overflow-y: scroll">
                            <div v-for="media in userMedias" class="tile is-6 p-1 is-parent">
                                <article style="cursor: pointer" @click="addUserMedia(media)"
                                         class="tile is-child is-flex is-align-items-center p-1">
                                    <figure class="image">
                                        <img class="has-ratio" :src="media.src" crossorigin="anonymous">
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
@import "/node_modules/bulma-switch/dist/css/bulma-switch.min.css";
@import "/node_modules/bulma-slider/dist/css/bulma-slider.min.css";

.dpi-circle {
    border: 1px solid #A6A9A9;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 5rem;
}
</style>
<script>
import BlockTypes, {AssetTypes} from "@rissc/printformer-ts-common/dist/BlockTypes";
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
        deleteAssetBox() {
            this.$catch(this.activeObject.delete());
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
                    color = '#d76c33';
                    break;
                case (this.dpi < dpi.error):
                    color = '#B41D1D';
                    break;
                default:
                    color = '#45BE28';
                    break;
            }

            return color;
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

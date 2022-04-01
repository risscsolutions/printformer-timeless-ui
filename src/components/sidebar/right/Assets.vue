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
                <div class="box" style="cursor: pointer" @click="uploadMediaAsset">
                    <div class="columns is-centered is-multiline">
                        <div class="column is-24">
                            <span>Neues Bild hochladen</span>
                            <span>
                                <i class="fas fa-upload"></i>
                            </span>
                        </div>
                        <div class="column is-24">
                            <span>vom Computer oder per Drag and Drop in die Box ziehen</span>
                        </div>
                        <input ref="uploadFile" type="file" hidden @change="uploadImage">
                    </div>
                </div>
            </div>
            <div v-if="hasActiveObject" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="hasActiveObject" class="column is-24">
                <div class="columns is-multiline">
                    <div class="column">
                        <b>Bildqualität</b>
                        <span>{{ dpi }} dpi</span>
                    </div>
                </div>
            </div>
            <div v-if="hasActiveObject" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="hasActiveObject" class="column is-24">
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
            <div v-if="hasActiveObject" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="hasActiveObject" class="column is-24">
                <div class="columns is-multiline">
                    <div class="column">
                        <div @click="deleteAssetBox" class="column" style="cursor: pointer"><b>Bild löschen</b> <i class="fas fa-trash"></i></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="css" scoped>
    @import "@creativebulma/bulma-divider/dist/bulma-divider.min.css";
</style>
<script>
import BlockTypes from "@rissc/printformer-ts-common/dist/BlockTypes";
import Events from "@rissc/printformer-editor-client/dist/Events";
import EditorObject from "@rissc/printformer-editor-client/dist/Objects";

export default {
    name: "assets",
    props: {
        activeObject: EditorObject
    },
    created() {
        this.loadAssets();
    },
    mounted() {
        window.events.on(Events.EDITOR_OBJECT_SELECTED, (block) => {
            this.dpi = block.dpi;
            this.loadAssets();
        });

        window.events.on(Events.EDITOR_OBJECT_UPDATED, (block) => {
            this.dpi = block.dpi;
        });

        this.loadUserMedias();
    },
    methods: {
        async loadAssets() {
            this.pictures = await this.$editor.findEditorObjects({
                type: BlockTypes.ASSET
            });
        },
        uploadMediaAsset() {
            this.$refs.uploadFile.click();
        },
        async uploadImage(event) {
            const file = event.target.files[0];
            await this.$editor.addAssetBlockFromFile(file);
            this.loadUserMedias()
        },
        addUserMedia(media) {
            if (this.activeObject) {
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
                userMedias.forEach((userMedia) => {
                    this.userMedias.push(userMedia);
                });
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
        }
    },
    computed: {
        hasAssets() {
            return this.pictures.length > 0;
        },
        hasUserMedias() {
            return this.userMedias.length > 0;
        },
        hasActiveObject() {
            return this.activeObject !== null;
        }
    },
    data() {
        return {
            pictures: {},
            imageUrl: '',
            userMedias: [],
            dpi: 0,
            pagination: {
                page: 1
            }
        }
    }
}
</script>

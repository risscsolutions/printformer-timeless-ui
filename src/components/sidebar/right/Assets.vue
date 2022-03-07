<template>
    <div v-if="hasAssets">
        <div class="columns is-multiline is-centered">
            <div class="column is-24">
                <div class="box">
                    Neue Bildbox
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="box">
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
                    </div>
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="columns is-multiline">
                    <div class="column"><b>Bildqualität</b></div>
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="content">
                    <div class="columns">
                        <div class="column is-14">
                            <b>Bildqualität</b>
                        </div>
                        <div class="column is-3">
                            <i class="fas fa-plus-circle fa-1x"></i>
                        </div>
                        <div class="column is-3">
                            <i class="fas fa-minus-circle fa-1x"></i>
                        </div>
                        <div class="column is-3">
                            <i class="fas fa-expand-alt fa-1x"></i>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="box">
                    <div class="columns is-multiline is-centered">
                        <div class="column is-24">
                            <div class="content is-align-content-center">
                                <span>Meine Medien</span>
                            </div>
                        </div>
                        <div class="column is-half">lel</div>
                        <div class="column is-half">lel</div>
                        <div class="column is-half">lel</div>
                        <div class="column is-half">lel</div>
                        <div class="column is-half">lel</div>
                        <div class="column is-half">lel</div>
                        <div class="column is-half">lel</div>
                        <div class="column is-half">lel</div>
                        <div class="column is-half">lel</div>
                        <div class="column is-half">lel</div>
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

export default {
    name: "assets",
    created() {
        this.loadAssets();
    },
    mounted() {
        window.events.on(Events.EDITOR_PAGES_PAGED, (pageInfo) => {
            this.currentPage = pageInfo.pageNumber
            this.loadAssets();
        });
    },
    methods: {
        async loadAssets() {
            this.pictures = await this.$editor.findEditorObjects({
                type: BlockTypes.ASSET
            });
        }
    },
    computed: {
        hasAssets() {
            return this.pictures.length > 0
        }
    },
    data() {
        return {
            pictures: {},
            imageUrl: '',
            currentPage: 1
        }
    }
}
</script>

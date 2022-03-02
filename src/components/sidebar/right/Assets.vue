<template>
    <div v-if="hasAssets">
        <div class="content is-small">
            <h1>Bilder</h1>
        </div>
    </div>
</template>

<script>
import BlockTypes from "@rissc/printformer-ts-common/dist/BlockTypes";
import Events from "@rissc/printformer-editor-client/dist/Events";

export default {
    name: "assets",
    created() {
        this.loadPictures();
    },
    mounted() {
        window.events.on(Events.EDITOR_PAGES_PAGED, (pageInfo) => {
            this.currentPage = pageInfo.pageNumber
            this.loadPictures();
        });
    },
    methods: {
        async loadPictures() {
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

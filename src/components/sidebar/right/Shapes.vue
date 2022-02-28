<template>
    <div>
        <div class="content is-small">
            <h1>Formen</h1>
        </div>
    </div>
</template>

<script>
import BlockTypes from "@rissc/printformer-ts-common/dist/BlockTypes";
import CroppingImage from "../../CroppingImage";
import Events from "@rissc/printformer-editor-client/dist/Events";
import {BulmaAccordion} from 'vue-bulma-accordion';

export default {
    name: "shapes",
    components: {CroppingImage, BulmaAccordion},
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
            this.shapes = await this.$editor.findEditorObjects({
                type: BlockTypes.SHAPE
            });
        }
    },
    computed: {
        hasShapes() {
            return this.shapes.length > 0
        }
    },
    data() {
        return {
            shapes: {},
            imageUrl: '',
            currentPage: 1
        }
    }
}
</script>

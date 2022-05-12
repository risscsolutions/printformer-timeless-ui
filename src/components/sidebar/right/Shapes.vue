<template>
    <div>
        <div class="columns is-multiline is-centered">
            <div class="column is-24 py-0">
                <div class="content is-small">
                    <h4 class="dark-gray-color mb-0">Form auswählen</h4>
                </div>
            </div>
            <div class="column is-24">
                <hr class="divider">
            </div>
            <div class="column is-half">
                <div @click="addShapeBlock('rect')" class="shape-rectangle"></div>
            </div>
            <div class="column is-half">
                <div @click="addShapeBlock('circle')" class="shape-circle"></div>
            </div>
            <div class="column is-half">
                <div @click="addShapeBlock('triangle')" class="shape-triangle"></div>
            </div>
            <div class="column is-half mt-5">
<!--                <div @click="addShapeBlock('polygon')" class="shape-polygon"></div>-->
            </div>
<!--            <div class="column is-24 mt-5">-->
<!--                <div class="columns is-multiline">-->
<!--                    <div class="column"><b>Formenfarbe</b></div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="column is-24">-->
<!--                <hr class="divider">-->
<!--            </div>-->
<!--            <div class="column is-24">-->
<!--                <div class="columns is-multiline">-->
<!--                    <div class="column"><b>Transparenz</b></div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="column is-24">-->
<!--                <hr class="divider">-->
<!--            </div>-->
<!--            <div class="column is-24">-->
<!--                <div class="columns is-multiline">-->
<!--                    <div class="column"><b>Formengröße (in mm)</b></div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="column is-24">-->
<!--                <hr class="divider">-->
<!--            </div>-->
<!--            <div class="column is-24">-->
<!--                <div class="columns is-multiline">-->
<!--                    <div class="column"><b>Ausrichtung</b></div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="column is-24">-->
<!--                <hr class="divider">-->
<!--            </div>-->
<!--            <div class="column is-24">-->
<!--                <div class="columns is-multiline">-->
<!--                    <div class="column"><b>Ebene anordnen</b></div>-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="column is-24">-->
<!--                <hr class="divider">-->
<!--            </div>-->
<!--            <div class="column is-24">-->
<!--                <div class="columns is-multiline">-->
<!--                    <div class="column"><b>Duplizieren</b></div>-->
<!--                </div>-->
<!--            </div>-->
        </div>
    </div>
</template>
<style scoped>
.shape-rectangle {
    width: 100px;
    height: 100px;
    background: #0e689a;
}

.shape-triangle {
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 100px solid #0e689a;
}

.shape-circle {
    width: 100px;
    height: 100px;
    background: #0e689a;
    border-radius: 50%
}

.shape-polygon {
    width: 100px;
    height: 57.735px;
    background: #0e689a;
    position: relative;
}

.shape-polygon::before {
    content: "";
    position: absolute;
    top: -28.8675px;
    left: 0;
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-bottom: 28.8675px solid #0e689a;
}

.shape-polygon::after {
    content: "";
    position: absolute;
    bottom: -28.8675px;
    left: 0;
    width: 0;
    height: 0;
    border-left: 50px solid transparent;
    border-right: 50px solid transparent;
    border-top: 28.8675px solid #0e689a;
}
</style>
<script>
import BlockTypes from "@rissc/printformer-ts-common/dist/BlockTypes";
import Events from "@rissc/printformer-editor-client/dist/Events";
import {BulmaAccordion} from 'vue-bulma-accordion';

export default {
    name: "shapes",
    components: {BulmaAccordion},
    created() {
        this.loadShapes();
    },
    mounted() {
        window.events.on(Events.EDITOR_PAGES_PAGED, (pageInfo) => {
            this.currentPage = pageInfo.pageNumber
            this.loadShapes();
        });
    },
    methods: {
        async loadShapes() {
            this.shapes = await this.$editor.findEditorObjects({
                type: BlockTypes.SHAPE
            });
        },
        addShapeBlock(type) {
            this.$catch(this.$editor.addShapeBlock(type));
        },
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

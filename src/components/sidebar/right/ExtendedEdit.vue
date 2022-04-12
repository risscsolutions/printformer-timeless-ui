<template>
    <div class="column is-24">
        <div class="columns is-multiline is-centered">
            <div v-if="activeObject && hasBackgroundColor" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="activeObject && hasBackgroundColor" class="column is-24">
                <div class="columns is-multiline">
                    <div class="column">
                        <b>Hintergrundfarbe</b>
                        <input type="color" class="mobile-input-faker" v-model="currentColor" :name="'Farbe ' + currentColor + ' gewählt'">
                    </div>
                </div>
            </div>
            <div v-if="hasLineHeight" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="hasLineHeight" class="column is-24">
                <div class="field has-addons">
                    <div class="control">
                        <button type="submit" class="button is-info">Zeilenabstand</button>
                    </div>
                    <div class="control is-expanded">
                        <div class="select is-fullwidth">
                            <select name="fonts" @change="changeLineHeight(currentLineHeight)" v-model="currentLineHeight">
                                <option v-for="lineHeight in allLineHeights" :value="lineHeight">
                                    {{ lineHeight }}
                                </option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="hasOpacity" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="hasOpacity" class="column is-24">
                <div class="columns is-multiline">
                    <div class="column">
                        <b>Transparenz</b>
                        <input id="sliderWithValue" class="slider has-output is-fullwidth" v-model="opacityActive"
                               @change="changeOpacity" min="0" max="100" step="1" type="range">
                        <output for="sliderWithValue">{{ opacityActive }}</output>
                    </div>
                </div>
            </div>
            <div v-if="hasAlignment" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="hasAlignment" class="column is-24">
                <div class="columns is-multiline">
                    <div style="cursor: pointer" @click="openAlignment" class="column is-24">
                        <b>Ausrichtung</b>
                    </div>
                    <div v-if="openAlignmentSettings" class="column is-24">
                        <div class="columns is-multiline">
                            <div class="column is-half">
                                <span style="cursor: pointer" @click="centerBlockH">Horizontale Mittelachse</span>
                            </div>
                            <div class="column is-half">
                                <span style="cursor: pointer" @click="centerBlockV">Vertikale Mittelachse</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="hasLayer" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="hasLayer" class="column is-24">
                <div class="columns is-multiline">
                    <div style="cursor: pointer" @click="openLayer" class="column is-24">
                        <b>Ebenen</b>
                    </div>
                    <div v-if="openLayerSettings" class="column is-24">
                        <div class="columns is-multiline">
                            <div class="column is-half">
                                <span style="cursor: pointer" @click="moveUp(true)">In den Vordergrund</span>
                            </div>
                            <div class="column is-half">
                                <span style="cursor: pointer" @click="moveDown(true)">In den Hintergrund</span>
                            </div>
                            <div class="column is-half">
                                <span style="cursor: pointer" @click="moveUp(false)">Eine Ebene nach vorne</span>
                            </div>
                            <div class="column is-half">
                                <span style="cursor: pointer" @click="moveDown(false)">Eine Ebene nach hinten</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div class="column is-24">
                <div class="columns is-multiline">
                    <div class="column">
                        <div @click="duplicateBlock" style="cursor: pointer"><b>Duplizieren</b> <i class="fas fa-copy"></i></div>
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
import Events from "@rissc/printformer-editor-client/dist/Events";
import EditorObject from "@rissc/printformer-editor-client/dist/Objects";
import {Text} from "@rissc/printformer-editor-client/dist/Objects/Blocks";
import bulmaSlider from "bulma-slider/src/js";
import convert from "color-convert";

export default {
    name: "extended-edit",
    props: {
        activeObject: EditorObject,
        opacity: Number,
        hasBackgroundColor: Boolean,
        hasLineHeight: Boolean,
        hasAlignment: Boolean,
        hasOpacity: Boolean,
        hasLayer: Boolean
    },
    computed: {
        currentColor: {
            get() {
                return this.activeObject.is(Text)
                    ? this.activeObject.color.displayColor
                    : this.activeObject.fill.displayColor;
            },
            set(color) {
                const parsedColor = {
                    displayColor: color,
                    colorSpace: 'RGB',
                    values: convert.hex.rgb(color)
                }
                this.activeObject.setFillColor(parsedColor);
            }
        },
    },
    mounted() {
        bulmaSlider.attach();
        this.opacityActive = this.opacity;

        this.$editor.getActiveObject().then((activeObject) => {
            if (typeof activeObject.leading !== 'undefined') {
                this.allLineHeights = activeObject.leading;
            } else {
                this.allLineHeights = [4, 8, 10, 12, 16]
            }
        });

        window.events.on(Events.EDITOR_OBJECT_SELECTED, (block) => {
            this.dpi = block.dpi;
            this.opacityActive = (block.opacity * 100);
        });

        window.events.on(Events.EDITOR_OBJECT_UPDATED, (block) => {
            this.dpi = block.dpi;
            this.opacityActive = (block.opacity * 100);
        });
    },
    methods: {
        async changeOpacity() {
            await this.activeObject.setOpacity((parseInt(this.opacityActive) / 100));
        },
        async duplicateBlock() {
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
        },
        async changeLineHeight(leading) {
            await this.activeObject.setFontLeading(leading);
        }
    },
    data() {
        return {
            opacityActive: 0,
            dpi: 0,
            openAlignmentSettings: false,
            openLayerSettings: false,
            currentLineHeight: null,
            allLineHeights: null
        }
    }
}
</script>

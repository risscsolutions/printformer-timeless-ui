<template>
    <div class="column is-24">
        <div class="columns is-multiline is-centered">
            <div v-if="activeObject && hasBackgroundColor" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="activeObject && hasBackgroundColor" class="column is-24">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Hintergrundfarbe</span>
                        <input type="color" class="mobile-input-faker" v-model="currentColor"
                               :name="'Farbe ' + currentColor + ' gewählt'">
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
                            <select name="fonts" @change="changeLineHeight(currentLineHeight)"
                                    v-model="currentLineHeight">
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
                        <span class="dark-gray-color">Transparenz</span>
                        <input id="sliderWithValue" class="slider has-output is-fullwidth" v-model="opacityActive"
                               @change="changeOpacity" min="0" max="100" step="1" type="range">
                        <output for="sliderWithValue" class="slider-output dark-gray-color">{{ opacityActive }}</output>
                        <b class="dark-gray-color">%</b>
                    </div>
                </div>
            </div>
            <div v-if="hasAlignment" class="column is-24">
                <div class="divider" style="margin: 0 !important;"></div>
            </div>
            <div v-if="hasAlignment" class="column is-24">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Ausrichtung</span>
                        <span @click="openAlignment" style="cursor: pointer" class="svg-20"
                              v-html="icon('Abstand2')"></span>
                    </div>
                    <div v-if="openAlignmentSettings" class="column is-24">
                        <div class="columns is-multiline">
                            <div class="column is-half has-text-centered">
                                <span @click="centerBlockH" style="cursor: pointer" class="svg-20"
                                      v-html="icon('Abstand')"></span>
                            </div>
                            <div class="column is-half has-text-centered">
                                <span @click="centerBlockV" style="cursor: pointer" class="svg-20"
                                      v-html="icon('Abstand2')"></span>
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
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Ebenen</span>
                        <span @click="openLayer" style="cursor: pointer" class="svg-20" v-html="icon('Ebenen')"></span>
                    </div>
                    <div v-if="openLayerSettings" class="column is-24">
                        <div class="columns is-multiline">
                            <div class="column is-half has-text-centered">
                                <span @click="moveUp(true)" style="cursor: pointer" class="svg-20"
                                      v-html="icon('Vorne')"></span>
                            </div>
                            <div class="column is-half has-text-centered">
                                <span @click="moveDown(true)" style="cursor: pointer" class="svg-20"
                                      v-html="icon('Hinten')"></span>
                            </div>
                            <div class="column is-half has-text-centered">
                                <span @click="moveUp(false)" style="cursor: pointer" class="svg-20"
                                      v-html="icon('Vorne2')"></span>
                            </div>
                            <div class="column is-half has-text-centered">
                                <span @click="moveDown(false)" style="cursor: pointer" class="svg-20"
                                      v-html="icon('Hinten2')"></span>
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
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Duplizieren</span>
                        <span @click="duplicateBlock" style="cursor: pointer" class="svg-20"
                              v-html="icon('Ebenen2')"></span>
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

#sliderWithValue {
    width: calc(100% - 5.2rem) !important;
}

.slider-output {
    background: none !important;
    font-weight: bold !important;
    font-size: 16px !important;
    padding-right: 0 !important;
    position: relative !important;
    top: -1px !important;
}
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
                return Text.isText(this.activeObject)
                    ? this.activeObject.color.displayColor
                    : this.activeObject.fill.displayColor;
            },
            set(color) {
                const parsedColor = {
                    displayColor: color,
                    colorSpace: 'RGB',
                    values: convert.hex.rgb(color)
                }
                this.$catch(this.activeObject.setFillColor(parsedColor));
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
        icon(name) {
            return this.$svg(name);
        },
        changeOpacity() {
            this.$catch(this.activeObject.setOpacity((parseInt(this.opacityActive) / 100)));
        },
        duplicateBlock() {
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
        changeLineHeight(leading) {
            this.$catch(this.activeObject.setFontLeading(leading));
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

<template>
    <div class="column is-24">
        <div class="columns is-multiline is-centered">
            <div v-if="activeObject && hasBackgroundColor" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="activeObject && hasBackgroundColor" class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Hintergrundfarbe</span>
                        <input type="color" class="mobile-input-faker" v-model="currentColor"
                               :name="'Farbe ' + currentColor + ' gewählt'">
                    </div>
                </div>
            </div>
            <div v-if="hasLineHeight" class="column is-24">
                <hr class="divider">
            </div>
            <div v-show="hasLineHeight" class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Zeilenabstand</span>
                        <select name="fonts" id="font-leading">
                            <option v-for="lineHeight in allLineHeights" :value="lineHeight">
                                {{ lineHeight }}
                            </option>
                        </select>
                    </div>
                </div>
            </div>
            <div v-if="hasOpacity" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="hasOpacity" class="column is-24 py-0">
                <div class="content">
                    <div class="columns">
                        <div class="column is-13">
                            <span class="dark-gray-color">Transparenz</span>
                        </div>
                        <div class="column is-flex is-justify-content-space-between">
                            <input id="sliderWithValue" class="has-output is-fullwidth" v-model="opacity" min="0" max="100" step="1" type="range">
                            <output for="sliderWithValue"
                                    class="px-2 slider-output dark-gray-color has-text-weight-semibold">{{opacity}}
                            </output>
                            <b class="dark-gray-color has-text-weight-semibold">%</b>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="hasAlignment" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="hasAlignment" class="column is-24 py-0">
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
                <hr class="divider">
            </div>
            <div v-if="hasLayer" class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Ebenen</span>
                        <span @click="openLayer" style="cursor: pointer" class="svg-20" v-html="icon('Ebenen2')"></span>
                    </div>
                    <div v-if="openLayerSettings" class="column is-24">
                        <div class="columns is-multiline">
                            <div class="column is-half has-text-centered">
                                <span @click="moveUp(true)" style="cursor: pointer" class="svg-20" title="Vorne"
                                      v-html="icon('Vorne')"></span>
                            </div>
                            <div class="column is-half has-text-centered">
                                <span @click="moveDown(true)" style="cursor: pointer" class="svg-20" title="Hinten"
                                      v-html="icon('Hinten')"></span>
                            </div>
                            <div class="column is-half has-text-centered">
                                <span @click="moveUp(false)" style="cursor: pointer" class="svg-20" title="Ganz Vorne"
                                      v-html="icon('Vorne2')"></span>
                            </div>
                            <div class="column is-half has-text-centered">
                                <span @click="moveDown(false)" style="cursor: pointer" class="svg-20" title="Ganz Hinten"
                                      v-html="icon('Hinten2')"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column is-24">
                <hr class="divider">
            </div>
            <div class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between">
                        <span class="dark-gray-color">Duplizieren</span>
                        <span @click="duplicateBlock" style="cursor: pointer" class="svg-20"
                              v-html="icon('Ebenen')"></span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style lang="css" scoped>

#sliderWithValue {
    width: 50px !important;
    margin: 0 !important;
}

.slider-output {
    background: none !important;
    font-size: 16px !important;
    padding-right: 0 !important;
    text-align: right;
    margin: 0 !important;
    position: relative;
    right: -2px;
}
</style>
<script>
import Events from "@rissc/printformer-editor-client/dist/Events";
import EditorObject from "@rissc/printformer-editor-client/dist/Objects";
import {Text} from "@rissc/printformer-editor-client/dist/Objects/Blocks";
import convert from "color-convert";

export default {
    name: "extended-edit",
    props: {
        activeObject: EditorObject,
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
        opacity: {
            get() {
                return this.activeObject ? this.activeObject.opacity * 100 : 100;
            },
            set(v) {
                this.$catch(this.activeObject.setOpacity(v / 100));
            }
        },
        leading: {
            get() {
                return this.activeObject.leading;
            },
            set(v) {
                this.$catch(this.activeObject.setFontLeading(v));
            }
        }
    },
    mounted() {
        const $fontLeading = $('#font-leading');
        $fontLeading.selectmenu({
            icons: {button: "broken-arrow"},
            width: 140,
            change: (event, ui) => {
                let value = ui.item.value;
                if (value === 'Auto') {
                    value = undefined;
                }
                this.leading = value;
            }
        });

        $fontLeading.selectmenu("menuWidget").addClass(['height-200', 'width-140'])

        this.$editor.getFontService().getSizes().then((sizes) => {
            this.$store.commit('setFontSizes', sizes);

            if (sizes.length > 1) {
                this.allLineHeights = ['Auto', ...sizes];
            } else {
                this.allLineHeights = ['Auto', 8, 10, 12, 14, 16, 18, 20, 28, 36, 48]
            }

            this.$nextTick(() => $fontLeading.selectmenu('refresh'));
        });

        window.events.on(Events.EDITOR_OBJECT_SELECTED, (block) => {
            if (!Text.isText(block)) return;

            let leading = block.leading;
            leading = leading === null ? 'Auto' : Number(leading);
            $fontLeading.val(leading);
        });
    },
    methods: {
        icon(name) {
            return this.$svg(name);
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
            openAlignmentSettings: false,
            openLayerSettings: false,
            currentLineHeight: null,
            allLineHeights: null
        }
    },
}
</script>

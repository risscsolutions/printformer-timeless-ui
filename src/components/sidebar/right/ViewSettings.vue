<template>
    <div>
        <div class="columns is-multiline is-centered">
            <!--            <div class="column is-24">-->
            <!--                <div class="columns is-multiline">-->
            <!--                    <div class="column">-->
            <!--                        <div class="field">-->
            <!--                            <input id="helpLineSwitch" type="checkbox" name="helpLineSwitch" class="switch is-info">-->
            <!--                            <label for="helpLineSwitch">Hilfslinien (aktuell nicht möglich)</label>-->
            <!--                        </div>-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--            </div>-->
            <!--            <div class="column is-24">-->
            <!--                <hr class="divider">-->
            <!--            </div>-->
            <div class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between py-2 is-align-items-center" >
                        <label class="dark-gray-color" for="extendedEditSwitch">
                            Raster
                        </label>
                        <div class="onoffswitch">
                            <input type="checkbox" v-model="gridSwitchOn"
                                   name="onoffswitch" class="onoffswitch-checkbox" id="gridSwitch" tabindex="0">
                            <label class="onoffswitch-label" for="gridSwitch">
                                <span class="onoffswitch-inner"></span>
                                <span class="onoffswitch-switch"></span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="gridSwitchOn" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="gridSwitchOn" class="column is-24 py-0">
                <div class="columns is-multiline">
                    <div class="column is-flex is-justify-content-space-between py-2 is-align-items-center" >
                        <span class="dark-gray-color">Rasterfarbe</span>
                        <input type="color" id="grid-color" style="opacity: 0" v-model="currentColor" class="button is-rounded color-button-round m-0">
                        <button
                            :style="{'background-color': initialColor}"
                            @click="openColorPicker"
                            class="button is-rounded color-button-round m-0 border-solid">
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="gridSwitchOn" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="gridSwitchOn" class="column is-24 py-0">
                <div class="columns is-multiline">

                    <div class="column is-flex is-justify-content-space-between py-2 is-align-items-center" >
                        <span class="dark-gray-color">Rastergröße (in mm)</span>
                        <input type="number" v-model="gridSize" style="width: 70px">
                    </div>
                </div>
            </div>
            <div class="column is-24">
                <hr class="divider">
            </div>
            <!--            <div class="column is-24">-->
            <!--                <div class="columns is-multiline">-->
            <!--                    <div class="column">-->
            <!--                        <div class="field">-->
            <!--                            <input id="rulerSwitch" type="checkbox" name="rulerSwitch" class="switch is-info">-->
            <!--                            <label for="rulerSwitch">Lineale (nur im Backend einstellbar)</label>-->
            <!--                        </div>-->
            <!--                    </div>-->
            <!--                </div>-->
            <!--            </div>-->
            <!--            <div class="column is-24">-->
            <!--                <hr class="divider">-->
            <!--            </div>-->
        </div>
    </div>
</template>
<style scoped>
</style>
<script>
import Events from "@rissc/printformer-editor-client/dist/Events";
import {BulmaAccordion} from 'vue-bulma-accordion';
import {Text} from "@rissc/printformer-editor-client/dist/Objects/Blocks";
import convert from "color-convert";
import {mapState} from "vuex";

export default {
    name: "view-settings",
    components: {BulmaAccordion},
    created() {
        this.$editor.getSettings().setLengthUnit('mm').then(() => {
            this.$editor.getSettings().getGridSettings().getGridSize().then((v) => {
                this.initialGridSize = parseFloat(v).toFixed(this.editorConfig.configuration.inputs.decimals);
            })
        });

        this.$editor.getSettings().getGridSettings().getVisible().then((v) => {
            this.initialSwitch = v;
        })
        this.$editor.getSettings().getGridSettings().getLineColor().then((value) => {
            const array = value.match(/\d+/g).map(parseFloat);

            this.initialColor = "#" + ((1 << 24) + (array[0] << 16) + (array[1] << 8) + array[2]).toString(16).slice(1);
        })

    },
    mounted() {
        window.events.on(Events.EDITOR_LOADED, ({draftInfo, configuration}) => {
            this.configuration = configuration;
        });
    },
    methods: {
        openColorPicker() {
            document.getElementById('grid-color').click();
        }
    },
    computed: {
        gridSize: {
            get() {
                return this.initialGridSize;
            },
            set(value) {
                this.$editor.getSettings().getGridSettings().setGridSize(value);
                this.initialGridSize = value;
            }
        },
        gridSwitchOn: {
            get() {
                return this.initialSwitch;
            },
            set() {
                this.$editor.getSettings().getGridSettings().toggleGrid().then((v) => {
                    this.initialSwitch = v;
                })
            }
        },
        currentColor: {
            get() {
                return this.initialColor;
            },
            set(color) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
                const rgb = {
                    r: parseInt(result[1], 16),
                    g: parseInt(result[2], 16),
                    b: parseInt(result[3], 16)
                }
                this.$catch(this.$editor.getSettings().getGridSettings().setLineColor(rgb));
                this.initialColor = color;
            }
        },
        ...mapState(['editorConfig'])
    },
    data() {
        return {
            initialGridSize: 10,
            initialSwitch: false,
            initialColor: '#3f3f3f',
            currentPage: 1,
            helpLineSwitchOn: false,
            rulerSwitch: false
        }
    }
}
</script>

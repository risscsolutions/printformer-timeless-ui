<template>
    <div>
        <div class="columns is-multiline is-centered">
            <div class="column is-24">
                <div class="columns is-multiline">
                    <div class="column">
                        <div class="field">
                            <input id="helpLineSwitch" type="checkbox" name="helpLineSwitch" class="switch is-info">
                            <label for="helpLineSwitch">Hilfslinien (aktuell nicht möglich)</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column is-24">
                <hr class="divider">
            </div>
            <div class="column is-24">
                <div class="columns is-multiline">
                    <div class="column">
                        <div class="field">
                            <input id="gridSwitch" type="checkbox" :checked="gridSwitchOn"
                                   @click="toggleGridSwitchOn" name="gridSwitch" class="switch is-info">
                            <label for="gridSwitch">Raster</label>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="gridSwitchOn" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="gridSwitchOn" class="column is-24">
                <div class="columns is-multiline">
                    <div class="column"><b>Rasterfarbe</b></div>
                </div>
            </div>
            <div v-if="gridSwitchOn" class="column is-24">
                <hr class="divider">
            </div>
            <div v-if="gridSwitchOn" class="column is-24">
                <div class="columns is-multiline">
                    <div class="column"><b>Rastergröße (in mm)</b></div>
                </div>
            </div>
            <div class="column is-24">
                <hr class="divider">
            </div>
            <div class="column is-24">
                <div class="columns is-multiline">
                    <div class="column">
                        <div class="field">
                            <input id="rulerSwitch" type="checkbox" name="rulerSwitch" class="switch is-info">
                            <label for="rulerSwitch">Lineale (nur im Backend einstellbar)</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="column is-24">
                <hr class="divider">
            </div>
        </div>
    </div>
</template>
<style scoped>
@import "/node_modules/bulma-switch/dist/css/bulma-switch.min.css";
</style>
<script>
import Events from "@rissc/printformer-editor-client/dist/Events";
import {BulmaAccordion} from 'vue-bulma-accordion';

export default {
    name: "view-settings",
    components: {BulmaAccordion},
    created() {

    },
    mounted() {
        window.events.on(Events.EDITOR_PAGES_PAGED, (pageInfo) => {
            this.currentPage = pageInfo.pageNumber;
        });
    },
    methods: {
        toggleGridSwitchOn() {
            this.gridSwitchOn = !this.gridSwitchOn;
            !this.$editor.getSettings().getGridSettings().toggleGrid();
            this.$editor.getSettings().getGridSettings().setLineColor({
                r: 255,
                g: 0,
                b: 0
            });
        }
    },
    computed: {

    },
    data() {
        return {
            currentPage: 1,
            gridSwitchOn: false,
            helpLineSwitchOn: false,
            rulerSwitch: false
        }
    }
}
</script>

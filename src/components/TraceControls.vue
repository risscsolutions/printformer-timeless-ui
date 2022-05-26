<template>
    <div v-show="traceControlsIsOpen" ref="traceOverlay" class="column my-3" id="trace-overlay">
        <div class="columns">
            <div class="trace-preview column sidebar-no-pager border-top-bottom">
                <div v-if="traceStep === 1 && !simpleColorsApplied" class="columns direction-column">
                    <div class="column has-text-centered" v-html="icon('VectorizerVorschau')"></div>
                    <div class="column has-text-centered trace-preview-info content">
                        <h4 class="mb-0">Nach Farbauswahl erscheint <br>hier deine Logovorschau</h4>
                    </div>
                </div>

                <div v-if="traceStep === 1 && simpleColorsApplied"
                     class="columns direction-column is-align-self-flex-start">
                    <div class="column content is-small mt-2 mx-5 mb-0">
                        <p class="dark-gray-color mb-2 dark-gray-color has-text-weight-bold">
                            SO KÖNNTE DEIN WERBEAUFDRUCK MIT DEINEN FARBEN AUSSEHEN:
                        </p>
                    </div>
                    <div class="column content is-small mx-5 mb-0">
                        <p class="dark-gray-color mb-2 dark-gray-color">
                            Hier siehst du mögliche Kombinationsmöglichkeiten
                        </p>
                    </div>
                    <div class="column columns is-multiline is-24 mb-0" style="overflow: auto">
                        <div v-for="preview in previews" class="column is-8"
                             style="height: 265px">
                            <div class="columns direction-column">
                                <div class="column has-text-centered" v-html="preview.svg" style="height: 200px;"></div>
                                <div class="column has-text-centered content">
                                    <button class="button is-small is-info" @click="selectPreview(preview.colors)"
                                            :disabled="blockUi">
                                        <span>ÜBERNEHMEN</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column content is-small mx-5 mb-0">
                        <p class="dark-gray-color dark-gray-color has-text-weight-bold">
                            ICH MÖCHTE KEINE FARBVERSION DAVON ÜBERNEHMEN. ZEIG MIR WEITERE MÖGLICHKEITEN.
                        </p>
                    </div>
                    <div class="column columns is-24">
                        <div class="column is-8 p-1 columns direction-column">
                            <div class="column has-text-centered content">
                                <button class="button is-small is-info" @click="skipSimpleMode" :disabled="blockUi">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <span>WEITER</span>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="traceStep !== 1" ref="tracePreview" style="height: 100%"></div>
            </div>
            <div class="trace-controls column is-narrow sidebar-no-pager border-solid">
                <div v-show="traceStep === 1" class="column">
                    <div class="content is-small my-2">
                        <h1 class="dark-gray-color mb-2 blue-color has-text-weight-bold">Bestimme deine Druckfarben</h1>
                        <p class="dark-gray-color mb-2 blue-color has-text-weight-bold">
                            Du kannst max. {{ colorLimit }} Farben auswählen.
                        </p>
                        <p class="dark-gray-color mb-0 ">Unsere Farbvorschläge für dich:</p>
                    </div>
                    <div v-if="managedColors.length" class="content is-small" ref="managedColors">
                        <button v-for="managedColor in managedColors" :title="managedColor.name"
                                class="button is-rounded color-button-round"
                                :style="`background-color: ${managedColor.displayColor}`"
                                @click="selectColor(managedColor, $event)" :disabled="simpleColorsApplied">
                        </button>
                        <button v-if="colorLimit > 1" title="Transparent"
                                class="button is-rounded color-button-round chess-background"
                                @click="selectColor('none', $event)" :disabled="simpleColorsApplied"></button>
                    </div>

                    <div class="content">
                        <button class="button is-small is-info" @click="applySimpleColors"
                                :disabled="!selectedSimpleColors.length || selectedSimpleColors.length  > colorLimit || simpleColorsApplied">
                            <span>ÜBERNEHMEN</span>
                        </button>
                    </div>
                </div>
                <div v-show="traceStep === 2" class="column">
                    <div class="content is-small my-2">
                        <h1 class="dark-gray-color mb-2 blue-color has-text-weight-bold">Optional: Optimierung deines
                            Werbeafdrucks</h1>
                        <div ref="traceSettings">
                            <div>
                                <input ref="deSpeckleRange" id="deSpeckleRange" class="" type="range" value="1"
                                       min="0" max="1000" step="1">
                                <span class="px-2 dark-gray-color has-text-weight-semibold vertical-align-sub">Rauschunterdrückung</span>
                                <output ref="deSpeckleInfo" for="deSpeckleRange"
                                        class="slider-output dark-gray-color has-text-weight-semibold vertical-align-sub">
                                    1
                                </output>
                            </div>
                            <div>
                                <input ref="smoothCornersRange" id="smoothCornersRange" class="" type="range" value="1"
                                       min="0" max="1.334" step="0.001">
                                <span class="px-2 dark-gray-color has-text-weight-semibold vertical-align-sub">Eckenglättung</span>
                                <output ref="smoothCornersInfo" for="smoothCornersRange"
                                        class="slider-output dark-gray-color has-text-weight-semibold vertical-align-sub">
                                    1
                                </output>
                            </div>
                            <div>
                                <input ref="optimizePathsRange" id="optimizePathsRange" class="" type="range" value="1"
                                       min="0" max="5" step="0.1">
                                <span class="px-2 dark-gray-color has-text-weight-semibold vertical-align-sub">Bézierkurven</span>
                                <output ref="optimizePathsInfo" for="optimizePathsRange"
                                        class="slider-output dark-gray-color has-text-weight-semibold vertical-align-sub">
                                    1
                                </output>
                            </div>
                        </div>
                    </div>
                    <div class="content">
                        <button class="button is-small is-info" @click="applyGranululu">
                            <span>ÜBERNEHMEN</span>
                        </button>
                    </div>
                </div>
                <div v-show="traceStep === 3" class="column">
                    <div class="content is-small my-2">
                        <h1 class="dark-gray-color mb-2 blue-color has-text-weight-bold">Farben bestimmen und
                            zuweisen</h1>
                        <p class="dark-gray-color mb-2 blue-color has-text-weight-bold">Schritt 1: Druckfarben
                            bestimmen</p>
                        <p class="dark-gray-color mb-0 ">Wähle deine gewünschten Druckfarben aus</p>
                    </div>

                    <div class="content is-small" ref="userColors">
                        <button v-for="(userColor, index) in userColors" v-html="userColor ? null : icon('Plus')"
                                :style="{'background-color': userColor ? userColor.displayColor : null}"
                                @click="chooseColor(index, $event)" class="button is-rounded color-button-round">
                        </button>
                    </div>
                    <hr class="sidebar-divider" v-if="userColorsFilled">

                    <div class="content is-small my-2" v-if="userColorsFilled">
                        <p class="dark-gray-color mb-2 blue-color has-text-weight-bold">Schritt 2: Druckfarben
                            zuweisen</p>
                        <p class="dark-gray-color mb-0 ">Weise die in Schritt 1 bestimmten Druckfarben denen in deinem
                            Bild gefundenen Farben zu.</p>
                    </div>

                    <div class="content is-small my-0" v-if="userColorsFilled">
                        <button v-for="color in colorMap"
                                :style="`background-color: ${color.replaced}; pointer-events: none;`"
                                class="button is-rounded color-button-round">
                        </button>
                    </div>
                    <div class="content is-small is-flex my-0" v-if="userColorsFilled">
                        <button v-for="color in colorMap" v-html="icon('dashed')"
                                style="pointer-events: none;" class="button is-rounded color-button-round is-ghost">
                        </button>
                    </div>
                    <div class="content is-small" v-if="userColorsFilled">
                        <button v-for="(color, index) in colorMap" v-html="icon('Plus')"
                                @click="chooseColor(index)" class="button is-rounded color-button-round">
                        </button>
                    </div>
                    <div class="content" v-show="userColorsFilled">
                        <button class="button is-small is-info" ref="applyTrace">
                            <span>ÜBERNEHMEN</span>
                        </button>
                    </div>
                </div>


                <div style="display:none;">
                    <div ref="resultAsUserMedia">
                        <p class="text-headline">Vektor in Mediamanager speichern</p>

                        <label class="switch">
                            <input ref="resultAsUserMediaSwitch" type="checkbox">
                            <span class="slider round"></span>
                        </label>
                        <hr class="sidebar-divider">
                    </div>


                </div>


                <div class="content">
                    <button ref="cancelTrace" class="button is-small is-dark dark-gray-background-color">
                        <span>ABBRECHEN</span>
                    </button>
                    <button v-html="icon('VectorizerPfeilLinks')" @click="backward"
                            v-if="(traceStep === 1 && simpleColorsApplied || traceStep === 2 || traceStep === 3)"
                            :disabled="blockUi"
                            class="button is-small is-ghost"></button>
                </div>

            </div>
        </div>


        <!--        <div ref="traceLoader" class="trace-loader gradation-four-color-background">-->
        <!--            <svg class="spin-it" version="1.1" id="Ebene_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"-->
        <!--                 viewBox="0 0 36 36" style="enable-background:new 0 0 36 36;" xml:space="preserve">-->
        <!--            <g>-->
        <!--                <path d="M6.14,25.95c-0.23-0.34-0.7-0.43-1.04-0.2c-0.34,0.23-0.43,0.7-0.2,1.04c0.15,0.22,0.3,0.43,0.46,0.64-->
        <!--                    c0.15,0.2,0.37,0.3,0.6,0.3c0.16,0,0.31-0.05,0.45-0.15c0.33-0.25,0.4-0.72,0.15-1.05C6.42,26.35,6.28,26.15,6.14,25.95z"/>-->
        <!--                <path d="M8.48,28.63c-0.31-0.28-0.78-0.25-1.06,0.06C7.15,29,7.17,29.47,7.48,29.75c0.2,0.18,0.4,0.35,0.6,0.51-->
        <!--                    c0.14,0.11,0.3,0.17,0.47,0.17c0.22,0,0.44-0.1,0.58-0.28c0.26-0.32,0.21-0.8-0.11-1.05C8.84,28.94,8.66,28.79,8.48,28.63z"/>-->
        <!--                <path d="M11.63,3.58c-0.24,0.11-0.48,0.22-0.71,0.33c-0.37,0.19-0.52,0.64-0.34,1.01c0.13,0.26,0.4,0.41,0.67,0.41-->
        <!--                    c0.11,0,0.23-0.02,0.34-0.08c0.21-0.11,0.43-0.21,0.64-0.3c0.38-0.17,0.55-0.61,0.38-0.99C12.45,3.58,12,3.41,11.63,3.58z"/>-->
        <!--                <path d="M12.05,30.96c-0.22-0.1-0.43-0.2-0.64-0.31c-0.36-0.19-0.82-0.05-1.01,0.32c-0.19,0.37-0.05,0.82,0.32,1.01-->
        <!--                    c0.23,0.12,0.47,0.24,0.71,0.35c0.1,0.05,0.21,0.07,0.31,0.07c0.28,0,0.56-0.16,0.68-0.44C12.59,31.58,12.42,31.13,12.05,30.96z"/>-->
        <!--                <path d="M4.8,23.45c-0.09-0.22-0.18-0.44-0.26-0.67c-0.14-0.39-0.57-0.58-0.96-0.45c-0.39,0.14-0.59,0.57-0.45,0.96-->
        <!--                    c0.09,0.25,0.18,0.49,0.28,0.73c0.12,0.29,0.4,0.46,0.69,0.46c0.1,0,0.19-0.02,0.29-0.06C4.78,24.27,4.96,23.83,4.8,23.45z"/>-->
        <!--                <path d="M33.71,17.43c-0.01-0.41-0.35-0.73-0.75-0.73c-0.01,0-0.02,0-0.02,0c-0.41,0.01-0.74,0.36-0.73,0.77-->
        <!--                    c0.01,0.17,0.01,0.34,0.01,0.51c0,0.24-0.01,0.48-0.02,0.71c-0.02,0.41,0.29,0.77,0.71,0.79c0.01,0,0.03,0,0.04,0-->
        <!--                    c0.4,0,0.73-0.31,0.75-0.71c0.01-0.26,0.02-0.52,0.02-0.79C33.72,17.81,33.72,17.62,33.71,17.43z"/>-->
        <!--                <path d="M31.65,13.98c0.07,0.23,0.13,0.46,0.18,0.69c0.08,0.34,0.39,0.58,0.73,0.58c0.06,0,0.12-0.01,0.17-0.02-->
        <!--                    c0.4-0.1,0.65-0.5,0.56-0.9c-0.06-0.26-0.13-0.51-0.2-0.76c-0.12-0.4-0.53-0.62-0.93-0.51C31.76,13.17,31.53,13.58,31.65,13.98z"/>-->
        <!--                <path d="M3.23,20.88c0.41-0.06,0.7-0.44,0.64-0.85c-0.03-0.23-0.06-0.47-0.08-0.71c-0.04-0.41-0.4-0.7-0.82-0.68-->
        <!--                    c-0.41,0.04-0.71,0.4-0.68,0.82c0.02,0.26,0.06,0.52,0.09,0.78c0.05,0.38,0.38,0.64,0.74,0.64C3.15,20.88,3.19,20.88,3.23,20.88z"-->
        <!--                />-->
        <!--                <path d="M2.97,17.14c0.03,0,0.05,0,0.08,0c0.38,0,0.7-0.29,0.74-0.67c0.02-0.24,0.06-0.47,0.09-0.7c0.06-0.41-0.21-0.79-0.62-0.86-->
        <!--                    c-0.4-0.06-0.79,0.21-0.86,0.62c-0.04,0.26-0.07,0.52-0.1,0.78C2.26,16.73,2.56,17.1,2.97,17.14z"/>-->
        <!--                <path d="M3.65,13.46c0.09,0.03,0.18,0.05,0.26,0.05c0.3,0,0.59-0.19,0.7-0.49c0.08-0.22,0.17-0.44,0.27-0.66-->
        <!--                    c0.17-0.38-0.01-0.82-0.39-0.99c-0.38-0.16-0.82,0.01-0.99,0.39C3.4,12,3.3,12.24,3.21,12.49C3.06,12.88,3.26,13.31,3.65,13.46z"/>-->
        <!--                <path d="M30.58,11.35c0.13,0.25,0.39,0.4,0.66,0.4c0.12,0,0.24-0.03,0.35-0.09c0.37-0.19,0.51-0.65,0.31-1.01-->
        <!--                    c-0.12-0.23-0.25-0.46-0.38-0.69C31.3,9.6,30.84,9.48,30.49,9.7c-0.36,0.21-0.47,0.67-0.26,1.03-->
        <!--                    C30.35,10.93,30.46,11.14,30.58,11.35z"/>-->
        <!--                <path d="M25.67,29.99c-0.2,0.13-0.4,0.25-0.61,0.37c-0.36,0.21-0.48,0.67-0.27,1.02c0.14,0.24,0.39,0.38,0.65,0.38-->
        <!--                    c0.13,0,0.26-0.03,0.38-0.1c0.23-0.13,0.45-0.27,0.67-0.41c0.35-0.22,0.45-0.69,0.23-1.04C26.48,29.86,26.02,29.76,25.67,29.99z"/>-->
        <!--                <path d="M26.01,4.45c-0.36-0.21-0.82-0.09-1.03,0.26c-0.21,0.36-0.09,0.82,0.26,1.03c0.2,0.12,0.4,0.25,0.6,0.38-->
        <!--                    c0.13,0.08,0.27,0.13,0.42,0.13c0.24,0,0.48-0.12,0.62-0.33c0.23-0.34,0.14-0.81-0.21-1.04C26.46,4.72,26.23,4.58,26.01,4.45z"/>-->
        <!--                <path d="M29.11,6.86c-0.29-0.29-0.77-0.29-1.06,0s-0.29,0.77,0,1.06c0.17,0.17,0.33,0.34,0.49,0.52c0.15,0.16,0.35,0.25,0.56,0.25-->
        <!--                    c0.18,0,0.36-0.06,0.5-0.19c0.31-0.28,0.33-0.75,0.05-1.06C29.47,7.24,29.29,7.05,29.11,6.86z"/>-->
        <!--                <path d="M28.4,27.71c-0.16,0.17-0.33,0.34-0.5,0.51c-0.3,0.29-0.31,0.76-0.02,1.06c0.15,0.15,0.34,0.23,0.54,0.23-->
        <!--                    c0.19,0,0.38-0.07,0.52-0.21c0.19-0.18,0.37-0.37,0.55-0.57c0.28-0.3,0.27-0.78-0.04-1.06C29.16,27.39,28.68,27.4,28.4,27.71z"/>-->
        <!--                <path d="M32.69,20.98c-0.42-0.11-0.81,0.14-0.91,0.54c-0.06,0.23-0.12,0.46-0.19,0.68c-0.12,0.4,0.1,0.82,0.49,0.94-->
        <!--                    c0.07,0.02,0.15,0.03,0.22,0.03c0.32,0,0.62-0.21,0.72-0.53c0.08-0.25,0.15-0.51,0.21-0.76C33.33,21.49,33.09,21.08,32.69,20.98z"-->
        <!--                />-->
        <!--                <path d="M15.44,32.02c-0.23-0.04-0.46-0.09-0.69-0.14c-0.41-0.11-0.81,0.16-0.9,0.56c-0.1,0.4,0.16,0.81,0.56,0.9-->
        <!--                    c0.26,0.06,0.51,0.11,0.78,0.16c0.04,0.01,0.09,0.01,0.13,0.01c0.36,0,0.67-0.25,0.74-0.62C16.12,32.48,15.84,32.09,15.44,32.02z"-->
        <!--                />-->
        <!--                <path d="M31.5,24.53c-0.36-0.2-0.82-0.06-1.02,0.3c-0.11,0.21-0.23,0.41-0.36,0.62c-0.22,0.35-0.11,0.81,0.25,1.03-->
        <!--                    c0.12,0.08,0.26,0.11,0.39,0.11c0.25,0,0.5-0.13,0.64-0.36c0.14-0.22,0.27-0.45,0.4-0.68C31.99,25.18,31.86,24.73,31.5,24.53z"/>-->
        <!--                <path d="M15.39,2.46c-0.26,0.04-0.52,0.09-0.77,0.15c-0.4,0.09-0.66,0.49-0.57,0.89c0.08,0.35,0.39,0.59,0.73,0.59-->
        <!--                    c0.05,0,0.11-0.01,0.16-0.02c0.23-0.05,0.46-0.09,0.7-0.13c0.41-0.07,0.68-0.45,0.62-0.86C16.19,2.67,15.81,2.38,15.39,2.46z"/>-->
        <!--                <path d="M18.99,32.21c-0.24,0.02-0.47,0.03-0.71,0.03c-0.41,0.01-0.74,0.35-0.73,0.77c0.01,0.41,0.34,0.73,0.75,0.73-->
        <!--                    c0.01,0,0.01,0,0.02,0c0.26-0.01,0.52-0.02,0.78-0.04c0.41-0.03,0.73-0.39,0.7-0.8C19.76,32.49,19.37,32.17,18.99,32.21z"/>-->
        <!--                <path d="M19.32,2.3c-0.26-0.02-0.52-0.04-0.79-0.05c-0.37,0.04-0.76,0.31-0.78,0.72c-0.01,0.41,0.31,0.76,0.72,0.78-->
        <!--                    c0.24,0.01,0.47,0.02,0.71,0.04c0.02,0,0.05,0,0.07,0c0.38,0,0.71-0.29,0.75-0.68C20.04,2.7,19.73,2.34,19.32,2.3z"/>-->
        <!--                <path d="M22.47,31.52c-0.22,0.07-0.45,0.14-0.68,0.21c-0.4,0.11-0.63,0.52-0.53,0.92c0.09,0.33,0.39,0.55,0.72,0.55-->
        <!--                    c0.06,0,0.13-0.01,0.2-0.03c0.25-0.07,0.51-0.15,0.76-0.23c0.39-0.13,0.6-0.56,0.47-0.95C23.29,31.6,22.86,31.39,22.47,31.52z"/>-->
        <!--                <path d="M23.15,3.12c-0.25-0.09-0.5-0.17-0.75-0.24c-0.4-0.12-0.82,0.11-0.93,0.51c-0.12,0.4,0.11,0.81,0.51,0.93-->
        <!--                    c0.23,0.07,0.46,0.14,0.68,0.22c0.08,0.03,0.16,0.04,0.24,0.04c0.31,0,0.6-0.19,0.71-0.51C23.75,3.68,23.55,3.25,23.15,3.12z"/>-->
        <!--            </g>-->
        <!--            </svg>-->
        <!--            <div class="info-text text-and-icons-dark">Bitte warten...</div>-->
        <!--        </div>-->
    </div>
</template>

<script>
import Events from "@rissc/printformer-editor-client/dist/Events";
import {Asset, BlockEffects} from "@rissc/printformer-editor-client/dist/Objects";
import {remove, isEmpty, isEqual, uniqWith, shuffle, clone} from "lodash";
import {mapMutations, mapState} from "vuex";

const BLOCK_EFFECTS = {
    embossing: {
        type: 'embossing',
    },
    vector: {
        type: 'vector',
    },
    convert: {
        type: 'convert',
    },
    monochrome: {
        type: 'monochrome',
    },
};

const displayBlockOrNone = (element, flag, block = 'block') => {
    element.style.display = flag ? block : 'none';
}

export default {
    name: "trace-controls",
    data() {
        return {
            effects: [],
            blockEffectType: undefined,
            updateListener: new Map(),
            deSpeckle: 10,
            smoothCorners: 10,
            optimizePaths: 10,
            colorLimit: 0,
            defaultColorLimit: 10,
            patchIdentifierToRevertTo: undefined,
            automationActive: true,
            blockUi: false,
            simpleColorsApplied: false,
            selectedSimpleColors: [],
            previews: [],
            traceStep: 1,
            colorsChosen: false,
            colorMap: [],
            userColors: [],
            userColorsFilled: false,
        }
    },
    computed: {
        ...mapState(['traceControlsIsOpen', 'managedColors', 'colorSpaces']),
    },
    mounted() {
        window.events.on(Events.EDITOR_LOADED, ({draftInfo, configuration}) => {
            this.effects = draftInfo.blockEffects.available;
            const vectorEffect = this.effects.find((blockEffect) => {
                return [BLOCK_EFFECTS.vector.type, BLOCK_EFFECTS.embossing.type].includes(blockEffect.type);
            });

            if (!vectorEffect) {
                // this.button.classList.add('prohibited');
                // this.container.style.display = 'none';
                return;
            }

            this.initialize(configuration);
        });
    },
    methods: {
        initialize(configuration) {
            window.events.on(Events.EDITOR_OBJECT_SELECTED, (target) => {
                if (!Asset.isAsset(target)) return;

                console.debug('TraceControl object selected', {...target});
                if (!target.isFilled) {
                    // this.button.classList.add('prohibited');
                    // this.container.style.display = 'none';

                    if (this.updateListener.has(target)) return;

                    const listener = (newTarget) => {
                        if (target.is(newTarget)) this.showOverlayIfCurrentlySelectedBlockIsVectorized(newTarget);
                    };
                    this.updateListener.set(target, listener);
                    window.events.on(Events.EDITOR_OBJECT_UPDATED, listener, this);
                    return;
                }
            });

            const buttons = [this.$refs.applyTrace, this.$refs.cancelTrace];
            buttons.forEach(button => {
                button.addEventListener('click', () => this.applyTraceAndCloseOverlay(button));
            });

            // Im IE gibt es kein input event auf der range, change wird jedoch bei allen anderen browsern erst nach dem loslassen gefeuert
            // @ts-ignore
            const IE = window.browser === 'IE11' || window.browser === 'deprecatedIE';
            const event = IE ? 'change' : 'input';

            [this.$refs.deSpeckleRange, this.$refs.smoothCornersRange, this.$refs.optimizePathsRange].forEach(element => {
                element.addEventListener(event, e => this.handleRangeInput(e, element));
            });

            [this.$refs.deSpeckleRange, this.$refs.smoothCornersRange, this.$refs.optimizePathsRange].forEach(element => {
                element.addEventListener('mouseup', () => this.startTracing());
            });

            if (!((configuration.sideBar.tabPanel.tabs.multimedia || {}).provider || {}).userMedia)
                this.$refs.resultAsUserMedia.style.display = 'none';

        },
        showOverlayIfCurrentlySelectedBlockIsVectorized(target) {
            console.debug('TraceControl object updated', {...target});
            if (!target.isLoading && target.isFilled && Asset.isAsset(target)) {
                const vectorEffect = target.effects
                    .find((effect) => {
                        return [BlockEffects.vector, BlockEffects.embossing].includes(effect.type);
                    });
                if (!vectorEffect) return;

                target.setActive()
                    .then((block) => {
                        this.openOverlayAndSetSettings(block);
                        window.events.off(Events.EDITOR_OBJECT_UPDATED, this.updateListener.get(target), this);
                        this.updateListener.delete(target);
                    });
            }
        },
        async openOverlayAndSetSettings(target) {
            this.openTraceControls();

            let activeObject;
            if (target) {
                activeObject = target
            } else {
                activeObject = await this.$editor.getActiveObject();
            }

            if (!activeObject) {
                console.error('No asset to Trace!');
                return;
            }

            const settings = activeObject.effectSettings;

            if (isEmpty(settings)) {
                console.error('No effect setting on asset', activeObject);
                return;
            }
            // this.$refs.traceLoader.style.display = 'flex';
            this.blockEffectType = activeObject.effects[0].type;
            this.colorLimit = settings.colorLimit || this.defaultColorLimit;

            this.deSpeckle = settings.deSpeckle || 0
            this.smoothCorners = settings.smoothCorners || 0;
            this.optimizePaths = settings.optimizePaths || 0;
            this.$refs.deSpeckleInfo.innerText = this.$refs.deSpeckleRange.value = this.deSpeckle.toString();
            this.$refs.smoothCornersInfo.innerText = this.$refs.smoothCornersRange.value = this.smoothCorners.toString();
            this.$refs.optimizePathsInfo.innerText = this.$refs.optimizePathsRange.value = this.optimizePaths.toString();

            if (activeObject.colorMap.length > this.colorLimit) {
                this.automationActive = false;
                this.setSettings();
                this.updatePreview(activeObject).then(() => {
                    window.events.on(Events.EDITOR_OBJECT_UPDATED, this.updatePreview, this);
                    this.showOverlay(activeObject);
                });
                return;
            }

            if (activeObject.colorMap.length < this.colorLimit || activeObject.colorMap.length === 1) {
                this.automationActive = false;
            }


            this.startTracing()
                .then(() => {
                    window.events.on(Events.EDITOR_OBJECT_UPDATED, this.updatePreview, this);
                    this.showOverlay(activeObject);
                    // this.$refs.traceLoader.style.display = 'none';
                });
        },
        startTracing(persist = false) {
            console.debug('Start tracing', {persist});
            // this.$refs.traceLoader.style.display = 'flex';
            this.setSettings();
            // this.$refs.traceOverlay.style.pointerEvents = 'none';
            this.$refs.traceOverlay.style.cursor = "wait";
            return this.$editor.getActiveObject()
                .then((editorObject) => {
                    if (!editorObject) {
                        this.closeOverlay();
                        return;
                    }

                    const effectIdentifier = editorObject.effects
                        .find((effect) => {
                            return [BlockEffects.vector, BlockEffects.embossing].includes(effect.type);
                        });
                    return this.$editor.getBlockEffectService()
                        .apply(effectIdentifier.identifier,
                            {
                                deSpeckle: this.deSpeckle,
                                smoothCorners: this.smoothCorners,
                                optimizePaths: this.optimizePaths,
                                colorLimit: this.automationActive ? this.colorLimit : this.defaultColorLimit,
                                persist
                            }
                        ).then((editorObject) => {
                            this.updatePreview(editorObject);
                            // this.$refs.traceOverlay.style.pointerEvents = 'all';
                            this.$refs.traceOverlay.style.cursor = "auto";
                            // this.$refs.traceLoader.style.display = 'none';
                            if (persist) window.events.emit('reload-media');
                        });
                });
        },
        setSettings() {
            this.deSpeckle = Number(this.$refs.deSpeckleRange.value);
            this.smoothCorners = Number(this.$refs.smoothCornersRange.value);
            this.optimizePaths = Number(this.$refs.optimizePathsRange.value);
        },
        handleRangeInput(event, element) {
            const target = event.target;
            if (!target) return;
            switch (element) {
                case this.$refs.deSpeckleRange:
                    this.$refs.deSpeckleInfo.innerText = target.value;
                    break;
                case this.$refs.smoothCornersRange:
                    this.$refs.smoothCornersInfo.innerText = target.value;
                    break;
                case this.$refs.optimizePathsRange:
                    this.$refs.optimizePathsInfo.innerText = target.value;
                    break;
                default:
                    console.error('Unknown trace range:', element);
            }
        },
        async updatePreview(editorObject) {
            this.$refs.tracePreview.innerHTML = (await editorObject.getContent()) || '';
            this.resolveColorsAndUpdateControls(editorObject);
        },
        resolveColorsAndUpdateControls(activeObject) {
            if (!activeObject.colorMap) {
                console.error('NO colorMap on OBJECT', activeObject);
                return;
            }

            this.colors = uniqWith(activeObject.colorMap.map(c => c.replaced).filter((c) => c !== null && c !== 'none'), isEqual);

            displayBlockOrNone(this.$refs.traceSettings, activeObject.containsRasterImages);

            let showColorControl = true;
            const assignedEffect = activeObject.effects.find(effect => BlockEffects.embossing === effect.type);
            if (assignedEffect) {
                const embossingEffect = this.effects.find(e => e.identifier === assignedEffect.identifier);
                if (activeObject.colorMap.length === 1 && isEqual(activeObject.colorMap[0].printcolor, embossingEffect.color)) {
                    showColorControl = false;
                } else {
                    // TODO
                    // this.colorControl.initialize(false, [embossingEffect.color]);
                    // this.colorControl.onObjectSelected(activeObject);
                }
            } else {
                // TODO
                // this.colorControl.initialize(this.canvasToolBar.graphicColorControl.userCanAddColors, this.canvasToolBar.graphicColorControl.colors);
                // this.canvasToolBar.addUserColor.addColorsFromUser({showNoty: false});
                // this.colorControl.onObjectSelected(activeObject);
            }

            // TODO
            // displayBlockOrNone(
            //     this.colorControl.swatchContainer.parentElement,
            //     showColorControl
            // );
            if (!activeObject.containsRasterImages && !showColorControl && !usedColorsBeyondLimit) {
                this.applyTraceAndCloseOverlay(this.$refs.applyTrace);
            }
        },
        async applyTraceAndCloseOverlay(button) {
            if (button !== this.$refs.applyTrace) {
                this.revertSettings();
                const activeObject = await this.$editor.getActiveObject();
                return activeObject.delete()
                    .then(() => {
                        this.$editor.getUndoRedo().clear();
                    })
                    .then(() => {
                        this.$refs.resultAsUserMediaSwitch.checked = false;
                        this.closeOverlay();
                    });
            }

            return (
                this.$refs.resultAsUserMediaSwitch.checked
                    ? this.startTracing(true)
                    : Promise.resolve()
            )
                .then(() => {
                    this.$refs.resultAsUserMediaSwitch.checked = false;
                    this.closeOverlay();
                });
        },
        showOverlay(activeObject) {
            const colorMap = activeObject.colorMap;
            if (!activeObject.containsRasterImages || colorMap.length > this.colorLimit) {
                this.setTraceStep(3); //color picker
            } else if (colorMap.length < this.colorLimit || colorMap.length === 1) {
                this.setTraceStep(2); //granululu
            } else if (colorMap.length === this.colorLimit) {
                this.setTraceStep(1); //automat
            }

            this.openTraceControls();
        },
        closeOverlay() {
            console.log('closeOverlay')
            window.events.off(Events.EDITOR_OBJECT_UPDATED, this.updatePreview, this);
            this.revertTraceStepOne();
            this.revertTraceStepTwo();
            this.closeTraceControls();
            // this.$refs.traceOverlay.style.display = 'none';
        },

        icon(name) {
            return this.$svg(name);
        },
        async applySimpleColors() {
            this.blockUi = true;
            this.simpleColorsApplied = true;

            if (this.selectedSimpleColors.length === 1) {
                this.selectedSimpleColors.push('none');
            }
            const activeObject = await this.$editor.getActiveObject();

            const colorMap = activeObject.colorMap;
            const selectedColors = this.selectedSimpleColors.map(c => c.name || 'none');
            const cartesian = (...a) => a.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())));
            let output = cartesian(selectedColors, selectedColors);

            while (output[0].length < colorMap.length) {
                output = cartesian(output, selectedColors);
            }
            if (this.selectedSimpleColors.length >= colorMap.length) {
                output = output.filter(cs => (new Set(cs)).size === cs.length);
            }

            output = output.filter(cs => !((new Set(cs)).size === 1 && cs[0] === 'none'));

            shuffle(output).slice(0, 27).reduce((p, colors) => {
                return p.then(() => {
                    return new Promise(resolve => {
                        colors.reduce((p2, c, idx) => {
                            return p2.then(a => {
                                if (!colorMap[idx]) return Promise.resolve(a);
                                return a.replaceColor(colorMap[idx], this.selectedSimpleColors.find(ssc => ssc.name === c) || c)
                            });
                        }, Promise.resolve(activeObject))
                            .then((a) => a.getContent())
                            .then((svg) => this.previews.push({svg, colors}))
                            .then(resolve);
                    })
                });
            }, Promise.resolve()).then(() => {
                this.blockUi = false;
            });
        },
        selectColor(color, e) {
            const target = e.target;
            target.classList.toggle('is-active');

            const index = this.selectedSimpleColors.findIndex(ssc => isEqual(ssc, color));
            if (index !== -1) {
                this.selectedSimpleColors.splice(index, 1);
            } else {
                this.selectedSimpleColors.push(color);
            }
        },
        async selectPreview(colors) {
            const activeObject = await this.$editor.getActiveObject();
            const colorMap = activeObject.colorMap;

            await Promise.all(colors.map((c, idx) => {
                return activeObject.replaceColor(colorMap[idx], this.selectedSimpleColors.find(ssc => ssc.name === c) || c)
            }));

            this.closeOverlay();
        },
        async skipSimpleMode() {
            const activeObject = await this.$editor.getActiveObject();

            this.$editor.getUndoRedo().clear()
                .then(() => {
                    this.automationActive = false;
                    return this.startTracing();
                })
                .then(() => {
                    this.setTraceStep(2);
                })

        },
        applyGranululu() {
            this.setTraceStep(3);
        },
        chooseColor(index, event) {
            console.log(index)
            this.setCurrentColorSpace(this.colorSpaces[0]);
            this.setColorClosure((color) => this.userColors.splice(index, 1, color));

            $('#color-picker')
                .dialog('option', 'position', {
                    collision: "fit",
                    my: "center top+10",
                    at: "center bottom",
                    of: $(event.currentTarget)
                })
                .dialog('open');
        },
        revertTraceStepOne() {
            this.simpleColorsApplied = false;
            this.selectedSimpleColors = [];
            this.previews = [];
            const colorButtons = this.$refs.managedColors.children;
            for (let item of colorButtons) {
                item.classList.remove('is-active');
            }
        },
        revertTraceStepTwo() {
            this.automationActive = true;
        },
        revertSettings() {
        },
        async backward() {
            if (this.traceStep === 1) {
                this.revertTraceStepOne();
            } else if (this.traceStep === 2) {
                this.automationActive = true;
                this.revertSettings();

                this.startTracing()
                    .then(() => {
                        this.setTraceStep(1);
                    });
            } else if (this.traceStep === 3) {
                this.setTraceStep(2);
                this.colorsChosen = false;
            }

        },
        setTraceStep(step) {
            this.traceStep = step;
            if (step === 3) {
                this.$editor.getActiveObject().then(editorObject => {
                    this.colorMap = editorObject.colorMap;
                    this.userColors = editorObject.colorMap.map(() => null);
                })
            }
        },
        ...mapMutations(['openTraceControls', 'closeTraceControls', 'setColorClosure', 'setCurrentColorSpace'])

    },
    watch: {
        traceControlsIsOpen(state) {
            const editor = document.querySelector('#pf-container');
            if (state) {
                this.openOverlayAndSetSettings();
                editor.style.position = 'absolute';
                editor.style.zIndex = -9999;
            } else {
                editor.style.position = 'static';
                editor.style.zIndex = null;
            }
        },
        userColors(array) {
            this.userColorsFilled = !array.includes(null);
            console.log('filled',this.userColorsFilled)
        }
    }
}
</script>

<style scoped>
input[type=range] {
    width: 250px;
}

.vertical-align-sub {
    vertical-align: sub;
}
</style>

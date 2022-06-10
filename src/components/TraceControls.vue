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
                                :class="{'chess-background': color.replaced === 'none'}"
                                class="button is-rounded color-button-round">
                        </button>
                    </div>
                    <div class="content is-small is-flex my-0" v-if="userColorsFilled">
                        <button v-for="color in colorMap" v-html="icon('dashed')"
                                style="pointer-events: none;" class="button is-rounded color-button-round is-ghost">
                        </button>
                    </div>
                    <div class="content is-small" v-if="userColorsFilled">
                        <button v-for="(color, index) in assignedColors" v-html="color ? null : icon('Plus')"
                                :style="{'background-color': color ? color.displayColor : null}"
                                :class="{'chess-background': color === 'none'}"
                                @click="assignColor(index, $event)" class="button is-rounded color-button-round">
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
            assignedColors: [],
            userColorsFilled: false,
        }
    },
    computed: {
        ...mapState(['traceControlsIsOpen', 'managedColors', 'colorSpaces', 'userColors']),
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
            this.showFullScreenLoader();
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
                    this.hideFullScreenLoader();
                });
                return;
            }

            if (activeObject.colorMap.length < this.colorLimit && activeObject.colorMap.length === 1) {
                this.automationActive = false;
            }


            this.startTracing()
                .then((editorObject) => {
                    window.events.on(Events.EDITOR_OBJECT_UPDATED, this.updatePreview, this);
                    this.showOverlay(editorObject);
                    this.hideFullScreenLoader();
                });
        },
        startTracing(persist = false) {
            console.debug('Start tracing', {persist});
            this.showFullScreenLoader();
            this.setSettings();
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
                            this.$refs.traceOverlay.style.cursor = "auto";
                            this.hideFullScreenLoader();
                            if (persist) window.events.emit('reload-media');

                            return editorObject;
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
        },
        async applyTraceAndCloseOverlay(button) {
            if (button !== this.$refs.applyTrace) {
                this.revertSettings();
                const activeObject = await this.$editor.getActiveObject();
                const prohibitedActions = activeObject.prohibitedActions;

                if (prohibitedActions.includes('delete')) {
                    if (Asset.isAsset(activeObject) && !prohibitedActions.includes('asset-replace')) {
                        return activeObject.clear()
                            .then(() => {
                                this.$editor.getUndoRedo().clear();
                            })
                            .then(() => {
                                this.$refs.resultAsUserMediaSwitch.checked = false;
                                this.closeOverlay();
                            });
                    }
                }
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
            if (colorMap.length > this.colorLimit) {
                this.setTraceStep(3); //color picker
            } else if (colorMap.length < this.colorLimit && colorMap.length === 1 && activeObject.containsRasterImages) {
                this.setTraceStep(2); //granululu
            } else {
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
                if (!colorMap[idx]) return Promise.resolve(c);
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
                    const step = activeObject.containsRasterImages ? 2 : 3;
                    this.setTraceStep(step);
                })

        },
        applyGranululu() {
            this.setTraceStep(3);
        },
        chooseColor(index, event) {
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
        assignColor(index, event) {
            this.setColorAssignerClosure((color) => {
                this.assignedColors.splice(index, 1, color)
                this.$editor.getActiveObject().then((activeObject) => {
                    activeObject.replaceColor(this.colorMap[index], color);
                });
            });

            $('#color-assigner')
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
                const activeObject = await this.$editor.getActiveObject();
                const step = activeObject.containsRasterImages ? 2 : 1;

                this.setTraceStep(step);
                this.colorsChosen = false;
            }

        },
        setTraceStep(step) {
            this.traceStep = step;
            if (step === 3) {
                this.$editor.getActiveObject().then(editorObject => {
                    this.colorMap = editorObject.colorMap;
                    this.setUserColors(editorObject.colorMap.map(() => null));
                    this.assignedColors = editorObject.colorMap.map(() => null);
                })
            }
        },
        ...mapMutations(['openTraceControls', 'closeTraceControls', 'setColorClosure', 'setCurrentColorSpace', 'setUserColors', 'setColorAssignerClosure', 'showFullScreenLoader', 'hideFullScreenLoader'])

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
            this.userColorsFilled = array.length && !array.includes(null);
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

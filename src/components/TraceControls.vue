<template>
    <div v-show="traceControlsIsOpen" ref="traceOverlay" class="column my-3" id="trace-overlay">
        <div class="columns">
            <div class="trace-preview column sidebar-no-pager border-top-bottom">
                <div v-if="traceStep === 1" class="columns direction-column">
                    <div class="column has-text-centered" v-html="icon('VectorizerVorschau')"></div>
                    <div class="column has-text-centered trace-preview-info content">
                        <h4 class="mb-0"
                            v-html="$translate('VECTORIZER_STEP_1_CENTER_INFO')"></h4>
                    </div>
                </div>
                <div v-if="traceStep === 2"
                     class="columns direction-column is-align-self-flex-start">
                    <div class="column content is-small mt-2 mx-5 mb-0">
                        <p class="dark-gray-color mb-2 dark-gray-color has-text-weight-bold"
                           v-html="$translate('VECTORIZER_STEP_2_CENTER_INFO') ">
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
                                        <span>{{ $translateMultiple(['VECTORIZER_STEP_2_APPLY', 'APPLY']) }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="column content is-small mx-5 mb-0">
                        <p class="dark-gray-color dark-gray-color has-text-weight-bold"
                           v-html="$translate('VECTORIZER_STEP_2_CONTINUE_INFO')">
                        </p>
                    </div>
                    <div class="column columns is-24">
                        <div class="column is-8">
                            <div class="columns direction-column">
                                <div class="column has-text-centered content">
                                    <button class="button is-small is-info" @click="skipSimpleMode" :disabled="blockUi">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <span class="is-uppercase">{{ $translate("VECTORIZER_STEP_2_CONTINUE") }}</span>
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-show="traceStep > 2" v-html="tracePreview" style="height: 100%"></div>
            </div>
            <div class="trace-controls column is-narrow sidebar-no-pager border-solid">
                <div v-show="[1, 2].includes(traceStep)" class="column">
                    <div class="content is-small my-2">
                        <h1 class="dark-gray-color mb-2 blue-color has-text-weight-bold">
                            {{ $translate("VECTORIZER_STEP_1_TITLE") }}
                        </h1>
                        <p class="dark-gray-color mb-2 blue-color has-text-weight-bold">
                            <template v-if="colorLimit === 1">
                                {{ $translate("VECTORIZER_STEP_1_INFO_SINGLE_COLOR") }}
                            </template>
                            <template v-else>
                                {{ $translate("VECTORIZER_STEP_1_INFO_MULTIPLE_COLORS", {colorLimit}) }}
                            </template>
                        </p>
                        <p class="dark-gray-color mb-0 ">
                            {{ $translate("VECTORIZER_STEP_1_COLOR_SUGGESTIONS") }}
                        </p>
                    </div>
                    <div v-if="blockEffectType === 'vector' && managedColors.length" class="content is-small"
                         ref="managedColors">
                        <button v-for="managedColor in managedColors" :title="managedColor.name"
                                class="button is-rounded color-button-round"
                                :style="`background-color: ${managedColor.displayColor}`"
                                @click="selectColor(managedColor, $event)" :disabled="traceStep === 2">
                            <span></span>
                        </button>
                        <button v-if="colorLimit > 1" title="Transparent"
                                class="button is-rounded color-button-round chess-background"
                                @click="selectColor('none', $event)" :disabled="traceStep === 2">
                            <span></span>
                        </button>
                    </div>
                    <div v-else-if="blockEffectType === 'embossing' && !!embossingColor" class="content is-small"
                         ref="managedColors">
                        <button :title="embossingColor.name"
                                class="button is-rounded color-button-round"
                                :style="`background-color: ${embossingColor.displayColor}`"
                                @click="selectColor(embossingColor, $event)" :disabled="traceStep === 2">
                            <span></span>
                        </button>
                    </div>

                    <div class="content">
                        <button class="button is-small is-info is-uppercase" @click="applySimpleColors"
                                :disabled="!selectedSimpleColors.length || selectedSimpleColors.length  > colorLimit || traceStep === 2">
                            <span v-html="$translateMultiple(['VECTORIZER_STEP_1_APPLY', 'APPLY'])"></span>
                        </button>
                    </div>
                </div>
                <div v-show="traceStep === 3" class="column">
                    <div class="content is-small my-2">
                        <h1 class="dark-gray-color mb-2 blue-color has-text-weight-bold">
                            {{ $translate("VECTORIZER_STEP_3_TITLE") }}</h1>
                        <div ref="traceSettings">
                            <div>
                                <input ref="deSpeckleRange" id="deSpeckleRange" class="" type="range" value="1"
                                       min="0" max="1000" step="1">
                                <span class="px-2 dark-gray-color has-text-weight-semibold vertical-align-sub">
                                    {{ $translate("VECTORIZER_STEP_3_DE_SPECKLE") }}
                                </span>
                                <output ref="deSpeckleInfo" for="deSpeckleRange"
                                        class="slider-output dark-gray-color has-text-weight-semibold vertical-align-sub">
                                    1
                                </output>
                            </div>
                            <div>
                                <input ref="smoothCornersRange" id="smoothCornersRange" class="" type="range" value="1"
                                       min="0" max="1.334" step="0.001">
                                <span class="px-2 dark-gray-color has-text-weight-semibold vertical-align-sub">
                                    {{ $translate("VECTORIZER_STEP_3_SMOOTH_CORNERS") }}
                                </span>
                                <output ref="smoothCornersInfo" for="smoothCornersRange"
                                        class="slider-output dark-gray-color has-text-weight-semibold vertical-align-sub">
                                    1
                                </output>
                            </div>
                            <div>
                                <input ref="optimizePathsRange" id="optimizePathsRange" class="" type="range" value="1"
                                       min="0" max="5" step="0.1">
                                <span
                                    class="px-2 dark-gray-color has-text-weight-semibold vertical-align-sub">
                                    {{ $translate("VECTORIZER_STEP_3_BEZIER") }}
                                </span>
                                <output ref="optimizePathsInfo" for="optimizePathsRange"
                                        class="slider-output dark-gray-color has-text-weight-semibold vertical-align-sub">
                                    1
                                </output>
                            </div>
                        </div>
                    </div>
                    <div class="content">
                        <button class="button is-small is-info is-uppercase" @click="applyGranululu">
                            <span v-html="$translateMultiple(['VECTORIZER_STEP_3_APPLY', 'APPLY'])"></span>
                        </button>
                    </div>
                </div>
                <div v-show="traceStep === 4" class="column">
                    <div class="content is-small my-2">
                        <h1 class="dark-gray-color mb-2 blue-color has-text-weight-bold">
                            {{ $translate("VECTORIZER_STEP_4_TITLE") }}
                        </h1>
                        <p class="dark-gray-color mb-2 blue-color has-text-weight-bold">
                            {{ $translate("VECTORIZER_STEP_4_PART_1_TITLE") }}</p>
                        <p class="dark-gray-color mb-0 ">{{ $translate("VECTORIZER_STEP_4_PART_1_CONTENT") }}</p>
                    </div>
                    <div v-if="blockEffectType === 'vector'" class="content is-small" ref="userColors">
                        <button v-for="(userColor, index) in userColors" v-html="userColor ? null : icon('Plus')"
                                :style="{'background-color': userColor ? userColor.displayColor : null}"
                                @click="chooseColor(index, $event)" class="button is-rounded color-button-round">
                        </button>
                    </div>
                    <div v-else class="content is-small" ref="userColors">
                        <button :style="{'background-color': embossingColor ? embossingColor.displayColor : null}"
                                class="button is-rounded color-button-round">
                        </button>
                    </div>
                    <hr class="sidebar-divider" v-if="userColorsFilled">
                    <div class="content is-small my-2" v-if="userColorsFilled">
                        <p class="dark-gray-color mb-2 blue-color has-text-weight-bold">
                            {{ $translate("VECTORIZER_STEP_4_PART_2_TITLE") }}</p>
                        <p class="dark-gray-color mb-0 ">{{ $translate("VECTORIZER_STEP_4_PART_2_CONTENT") }}</p>
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
                        <button class="button is-small is-info is-uppercase" ref="applyTrace" :disabled="!replacedEqualsLimit">
                            <span v-html="$translateMultiple(['VECTORIZER_STEP_4_APPLY', 'APPLY'])"></span>
                        </button>
                    </div>
                </div>
                <div style="display:none;">
                    <div ref="resultAsUserMedia">
                        <p class="text-headline">{{ $translate("VECTORIZER_SAVE_RESULT") }}</p>
                        <label class="switch">
                            <input ref="resultAsUserMediaSwitch" type="checkbox">
                            <span class="slider round"></span>
                        </label>
                        <hr class="sidebar-divider">
                    </div>
                </div>
                <div class="content">
                    <button ref="cancelTrace" class="button is-small is-dark dark-gray-background-color">
                        <span class="is-uppercase">{{ $translateMultiple(['VECTORIZER_CANCEL', 'CANCEL']) }}</span>
                    </button>
                    <!--                    <button v-html="icon('VectorizerPfeilLinks')" @click="backward"-->
                    <!--                            v-if="(traceStep === 2 || traceStep === 3 || traceStep === 4)"-->
                    <!--                            :disabled="blockUi"-->
                    <!--                            class="button is-small is-ghost"></button>-->

                    <button @click="backward" class="button is-small is-info"
                            v-if="(traceStep === 2 || traceStep === 3 || traceStep === 4)"
                            :disabled="blockUi">
                        <span class="is-uppercase">{{ $translate("VECTORIZER_UNDO") }}</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import Events from "@rissc/printformer-editor-client/dist/Events";
import {Asset, BlockEffects} from "@rissc/printformer-editor-client/dist/Objects";
import {isEmpty, isEqual, uniqWith, shuffle} from "lodash";
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
            selectedSimpleColors: [],
            previews: [],
            colorsChosen: false,
            colorMap: [],
            assignedColors: [],
            userColorsFilled: false,

            embossingColor: null,
            tracePreview: ''
        }
    },
    computed: {
        replacedEqualsLimit() {
            return uniqWith(this.colorMap.map(cm => cm.printcolor).filter(c => c !== undefined), isEqual).length <= this.colorLimit
        },
        ...mapState(['traceControlsIsOpen', 'managedColors', 'colorSpaces', 'userColors', 'traceStep']),
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
                    if (this.updateListener.has(target)) return;

                    const listener = (newTarget) => {
                        if (target.is(newTarget)) this.showOverlayIfCurrentlySelectedBlockIsVectorized(newTarget);
                    };
                    this.updateListener.set(target, listener);
                    window.events.on(Events.EDITOR_OBJECT_UPDATED, listener, this);
                }
            });

            window.events.on('TIMELESS:asset-replaced', (target) => {
                if (!Asset.isAsset(target)) return;

                if (this.updateListener.has(target)) return;

                const listener = (newTarget) => {
                    if (target.is(newTarget)) this.showOverlayIfCurrentlySelectedBlockIsVectorized(newTarget);
                };
                this.updateListener.set(target, listener);
                window.events.on(Events.EDITOR_OBJECT_UPDATED, listener, this);
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
            this.embossingColor = activeObject.effects[0].color;

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
                            if (persist) window.events.emit('TIMELESS:reload-media');

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
            this.tracePreview = (await editorObject.getContent()) || '';
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
                this.setTraceStep(4); //color picker
            } else if (colorMap.length < this.colorLimit && colorMap.length === 1 && activeObject.containsRasterImages) {
                this.setTraceStep(3); //granululu
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
            this.setTraceStep(2);

            if (this.selectedSimpleColors.length === 1) {
                this.selectedSimpleColors.push('none');
            }
            const activeObject = await this.$editor.getActiveObject();

            const colorMap = activeObject.colorMap;
            const selectedColors = this.selectedSimpleColors.map(c => typeof c === 'string' ? c : c.name);
            console.debug(this.selectedSimpleColors, selectedColors);

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
                    const step = activeObject.containsRasterImages ? 3 : 4;
                    this.setTraceStep(step);
                })

        },
        applyGranululu() {
            this.setTraceStep(4);
        },
        chooseColor(index, event) {
            if (this.managedColors.length > 0) {
                this.setCurrentColorSpace('MANAGED');
            } else if (this.colorSpaces.length > 0) {
                this.setCurrentColorSpace(this.colorSpaces[0]);
            } else {
                this.setCurrentColorSpace('CMYK');
            }

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
                    activeObject.replaceColor(this.colorMap[index], color)
                        .then(eo => {
                            this.colorMap = eo.colorMap;
                        });
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
            this.setTraceStep(1);
            this.selectedSimpleColors = [];
            this.previews = [];
            this.tracePreview = '';
            const managedColors = this.$refs.managedColors;
            if (managedColors) {
                const colorButtons = managedColors.children;
                for (let item of colorButtons) {
                    item.classList.remove('is-active');
                }
            }
        },
        revertTraceStepTwo() {
            this.automationActive = true;
        },
        revertSettings() {
        },
        async backward() {
            if (this.traceStep === 2) {
                this.revertTraceStepOne();
            } else if (this.traceStep === 3) {
                this.automationActive = true;
                this.revertSettings();

                this.startTracing().then(() => this.setTraceStep(1));
            } else if (this.traceStep === 4) {
                const activeObject = await this.$editor.getActiveObject();
                const step = activeObject.containsRasterImages ? 3 : 1;

                this.setTraceStep(step);
                this.colorsChosen = false;
            }

        },
        setTraceStep(step) {
            this.goToTraceStep(step);
            if (step === 4) {
                this.$editor.getActiveObject().then(editorObject => {
                    this.colorMap = editorObject.colorMap;
                    this.assignedColors = editorObject.colorMap.map(() => null);

                    if (this.blockEffectType === 'embossing') {
                        this.setUserColors([this.embossingColor]);
                        this.userColorsFilled = true;
                    } else {
                        this.setUserColors(new Array(this.colorLimit).fill(null));
                    }
                });
            }
        },
        ...mapMutations(['openTraceControls', 'closeTraceControls', 'setColorClosure', 'setCurrentColorSpace', 'setUserColors', 'setColorAssignerClosure', 'showFullScreenLoader', 'hideFullScreenLoader', 'goToTraceStep'])

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

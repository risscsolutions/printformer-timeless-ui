<template>
    <div v-show="editorLoaded && !traceControlsIsOpen" :class="{'width-105': !isPanelOpen, 'width-456': isPanelOpen}"
         class="column is-1 px-0" style="display: grid">
        <div class="columns pl-3 my-0">
            <div v-show="isPanelOpen || shouldShowMenu" class="column p-2 is-1 mr-3 width-340 border-solid"
                 style="overflow: hidden;">
                <div class="columns is-multiline is-mobile" style="overflow: hidden">
                    <component class="column is-24 p-5" :is="openControlTab"
                               :class="{'sidebar-with-pager': isMultiPage, 'sidebar-no-pager': !isMultiPage}"
                               :activeObject="activeObject"></component>
                </div>
            </div>
            <div class="column is-1 p-0 width-100" style="overflow-y: auto;height: calc(100vh - 70px);overflow-x: hidden;">
                <div class="sidebar-container">
                    <button v-if="allowAddTexts || pageContainsAssets"
                            class="columns py-3 is-gapless is-multiline is-centered is-vcentered is-flex-direction-column"
                            @click="toggleSidebarPanel('assets', $event)" id="asset-menu-button">
                        <span class="mb-1" v-html="icon('Bilder')"></span>
                        <span class="dark-gray-color has-text-weight-medium">Bilder</span>
                    </button>
                    <button v-if="allowAddTexts || pageContainsTexts"
                            class="columns py-3 is-gapless is-multiline is-centered is-vcentered is-flex-direction-column"
                            @click="toggleSidebarPanel('texts', $event)" id="text-menu-button">
                        <span class="mb-1" v-html="icon('Text')"></span>
                        <span class="dark-gray-color has-text-weight-medium">Texte</span>
                    </button>
                    <button v-if="allowAddShapes || pageContainsShapes"
                            class="columns py-3 is-gapless is-multiline is-centered is-vcentered is-flex-direction-column"
                            @click="toggleSidebarPanel('shapes', $event)" id="shape-menu-button">
                        <span class="mb-1" v-html="icon('Formen')"></span>
                        <span class="dark-gray-color has-text-weight-medium">Formen</span>
                    </button>
                    <button
                        class="columns py-3 is-gapless is-multiline is-centered is-vcentered is-flex-direction-column"
                        v-if="hasVariants" @click="toggleSidebarPanel('variants', $event)">
                        <span class="mb-1" v-html="icon('Farbpalette')"></span>
                        <span class="dark-gray-color has-text-weight-medium">Produktfarbe ändern</span>
                    </button>
                    <div class="columns p-0 is-gapless">
                        <button class="column has-text-centered button is-ghost is-small"
                                v-html="icon('VectorizerPfeilLinks')"
                                :disabled="!undoStack.length"
                                @click="backward"></button>
                        <button class="column has-text-centered button is-ghost is-small"
                                v-html="icon('VectorizerPfeilRechts')"
                                :disabled="!redoStack.length"
                                @click="forward"></button>
                    </div>


                    <button
                        class="columns py-3 is-gapless is-multiline is-centered is-vcentered is-flex-direction-column"
                        style="margin-top: auto;"
                        @click="toggleSidebarPanel('view-settings', $event)">
                        <span class="mb-1" v-html="icon('Raster')"></span>
                        <span class="dark-gray-color has-text-weight-medium">Ansicht</span>
                    </button>
                </div>
            </div>
        </div>
        <div style="display: none" id="triangle-left" class="triangle-left"></div>
    </div>
</template>
<style scoped>
.sidebar-container {
    height: 100%;
    flex-direction: column;
    width: 100%;
    display: flex;
}

.slide-enter-active,
.slide-leave-active {
    transition: transform 0.2s ease;
}

.slide-enter,
.slide-leave-to {
    transform: translateX(100%);
    transition: all 150ms ease-in 0s
}

/*css triangle for sidebar menu active |> */
.triangle {
    position: absolute;
    right: -1px;
    top: 100px;
}

.triangle:before,
.triangle:after {
    content: "";
    display: inline-block;
    width: 0;
    height: 0;
}

.triangle:before {
    border-top: 22px solid transparent;
    border-bottom: 22px solid transparent;
    border-right: 22px solid rgb(232, 232, 232);
}

.triangle:after {
    position: absolute;
    right: 0;
    top: 2px;
    border-top: 20px solid transparent;
    border-bottom: 20px solid transparent;
    border-right: 20px solid white;
}
</style>
<script>
import Events from "@rissc/printformer-editor-client/dist/Events";
import {mapGetters, mapMutations, mapState} from "vuex";
import {debounce} from "lodash";
import BlockTypes from "@rissc/printformer-ts-common/dist/BlockTypes";

export default {
    name: "controls",
    computed: {
        blockMenuType() {
            switch (this.activeObject.blockType) {
                case BlockTypes.ASSET:
                    return 'assets';
                case BlockTypes.TEXT:
                    return 'texts';
                case BlockTypes.SHAPE:
                    return 'shapes';
                default:
                    this.shouldShowMenu = false;
                    return null;
            }
        },
        blockTypeByComponent() {
            switch (this.openControlTab) {
                case 'assets':
                    return BlockTypes.ASSET;
                case 'texts':
                    return BlockTypes.TEXT;
                case 'shapes':
                    return BlockTypes.SHAPE;
                default:
                    return null;
            }
        },
        hasAssets() {
            return this.assets.length > 0;
        },
        hasVariants() {
            return this.variants.length > 0;
        },
        isMultiPage() {
            return this.previewPages.length > 1;
        },
        ...mapState(['editorConfig', 'previewPages', 'openControlTab', 'traceControlsIsOpen', 'editorLoaded']),
        ...mapGetters(['allowAddShapes', 'allowAddAssets', 'allowAddTexts']),
    },
    mounted() {
        window.events.on(Events.EDITOR_LOADED, async (config) => {
            this.$store.commit('setEditorConfig', config);

            this.$editor.getPager().pages.then(async (pages) => {
                let prevPages = await Promise.all(pages.map(async (page) => {
                    page.previewImage = await this.$editor.getPager().getPagePreview(page.pageNumber);
                    return page;
                }));
                this.$store.commit('setPreviewPages', prevPages);
            });

            this.assets = await this.$editor.findEditorObjects({type: BlockTypes.ASSET});
            this.variants = await this.$editor.getVariants().getAll();

            this.setOnlyInteractableBlockActive();
            window.events.on(Events.EDITOR_PAGES_PAGED, this.setOnlyInteractableBlockActive, this);


            this.$editor.findEditorObjects({isContentModifieable: true, type: BlockTypes.ASSET})
                .then((blocks) => {
                    this.pageContainsAssets = !!blocks.length
                });
            this.$editor.findEditorObjects({isContentModifieable: true, type: BlockTypes.TEXT})
                .then((blocks) => {
                    this.pageContainsTexts = !!blocks.length
                });
            this.$editor.findEditorObjects({isContentModifieable: true, type: BlockTypes.SHAPE})
                .then((blocks) => {
                    this.pageContainsShapes = !!blocks.length
                });
        });

        let onCancel;
        window.events.on(Events.EDITOR_OBJECT_SELECTED, (block) => {
            this.activeObject = block;
            this.$store.commit('setOpenControlTab', this.blockMenuType);
            this.openSidebarPanel();
            this.showTriangle(this.activeObject.blockType);

            let onUpdate = block => this.activeObject = block;

            if (onCancel) {
                onCancel.cancel();
            } else {
                onCancel = debounce(() => {
                    this.activeObject = null;
                    window.events.off(Events.EDITOR_OBJECT_UPDATED, onUpdate);
                }, 200);
            }

            window.events.once(Events.EDITOR_OBJECT_CLEARED, onCancel);
            window.events.on(Events.EDITOR_OBJECT_UPDATED, onUpdate);
        });

        window.events.on(Events.EDITOR_UNDO_REDO_STACK_CHANGED, () => {
            this.checkStacks();
        });
    },
    methods: {
        setOnlyInteractableBlockActive() {
            if (this.allowAddAssets || this.allowAddTexts || this.allowAddShapes) return;

            this.$editor.findEditorObjects({
                types: [
                    BlockTypes.ASSET,
                    BlockTypes.GRAPHIC,
                    BlockTypes.IMAGE,
                    BlockTypes.PDF,
                    BlockTypes.TEXT,
                    BlockTypes.BARCODE,
                    BlockTypes.SHAPE
                ],
                isContentModifieable: true,
                onPrintAbleLayer: true
            })
                .then(interactableBlocksOnPage => {
                    if (interactableBlocksOnPage.length !== 1) return;
                    const [onlyInteractableBlock] = interactableBlocksOnPage;

                    if (onlyInteractableBlock.blockType === BlockTypes.ASSET
                        && onlyInteractableBlock.isFilled
                        && onlyInteractableBlock.isLoading) {

                        const listener = (newTarget) => {
                            if (onlyInteractableBlock.is(newTarget) && !newTarget.isLoading) {
                                newTarget.setActive();
                                window.events.off(Events.EDITOR_OBJECT_UPDATED, listener, this);
                            }
                        };
                        window.events.on(Events.EDITOR_OBJECT_UPDATED, listener, this);
                        return;
                    }

                    onlyInteractableBlock.setActive();
                });
        },
        icon(name) {
            return this.$svg(name);
        },
        closeSidebarPanel() {
            this.isPanelOpen = false;
            this.shouldShowMenu = false;
        },
        openSidebarPanel() {
            this.isPanelOpen = true;
            this.shouldShowMenu = true;
        },
        showTriangle(type) {
            let button;
            switch (type) {
                case'ASSET':
                    button = $('#asset-menu-button');
                    break;
                case 'TEXT':
                    button = $('#text-menu-button');
                    break;
                case 'SHAPE':
                    button = $('#shape-menu-button');
                    break;
            }
            $('#triangle-left')
                .css('display', 'block')
                .position({my: "right center", at: "left-1 center", of: button});
        },
        toggleSidebarPanel(component, event) {
            const doStuff = () => {
                this.openSidebarPanel();
                this.$store.commit('setOpenControlTab', component);
                const blockType = this.blockTypeByComponent;
                if (!this.activeObject && ((!this.allowAddAssets && blockType === BlockTypes.ASSET)
                    || (!this.allowAddTexts && blockType === BlockTypes.TEXT)
                    || (!this.allowAddShapes && blockType === BlockTypes.SHAPE))) {
                    this.$editor.findEditorObjects({isContentModifieable: true, type: blockType})
                        .then((blocks) => {
                            if (blocks.length) blocks[0].setActive();
                        });
                }
            }

            if ((this.openControlTab !== component) || (this.openControlTab === null && this.activeObject !== null)) {
                $('#triangle-left')
                    .css('display', 'block')
                    .position({my: "right center", at: "left-1 center", of: $(event.currentTarget)});

                if (this.activeObject && component !== this.blockMenuType) {
                    this.activeObject.discard().then(() => {
                        this.activeObject = null;
                        doStuff();
                    });
                    return;
                }

                doStuff();

            } else {
                $('#triangle-left').css('display', 'none');
                this.closeSidebarPanel();
                this.$store.commit('setOpenControlTab', null);
            }
        },
        forward() {
            this.showFullScreenLoader();
            this.$catch(this.$editor.getUndoRedo().redo().then(this.hideFullScreenLoader));
        },
        backward() {
            this.showFullScreenLoader();
            this.$catch(this.$editor.getUndoRedo().undo().then(this.hideFullScreenLoader));
        },

        async checkStacks() {
            await this.$editor.getUndoRedo().getUndoStack().then(stack => this.undoStack = stack);
            await this.$editor.getUndoRedo().getRedoStack().then(stack => this.redoStack = stack);
        },
        ...mapMutations(['showFullScreenLoader', 'hideFullScreenLoader'])
    },
    data() {
        return {
            shouldShowMenu: false,
            isPanelOpen: false,
            activeObject: null,
            assets: [],
            variants: [],
            undoStack: [],
            redoStack: [],
            pageContainsAssets: false,
            pageContainsTexts: false,
            pageContainsShapes: false,
        }
    }
}
</script>

<template>
    <div v-show="this.editorLoaded && !traceControlsIsOpen" :class="{'width-105': !isPanelOpen, 'width-416': isPanelOpen}"
         class="column is-1 px-0" style="display: grid">
        <div class="columns p-3">
            <transition name="slide">
                <div v-show="isPanelOpen || shouldShowMenu" class="column p-2 is-1 mr-3 width-300"
                     style="border: 1px solid #A6A9A9; overflow-x: hidden; overflow-y: auto">
                    <div class="columns is-multiline is-mobile" style="overflow: hidden">
                        <component class="column is-24 p-5" :is="openControlTab"
                                   :class="{'sidebar-with-pager': isMultiPage, 'sidebar-no-pager': !isMultiPage}"
                                   :activeObject="activeObject"></component>
                    </div>
                </div>
            </transition>
            <div class="column is-1 p-0 width-100" style="overflow: auto">
                <div class="sidebar-container">
                    <button
                        class="columns py-3 is-gapless is-multiline is-centered is-vcentered is-flex-direction-column"
                        @click="toggleSidebarPanel('assets')">
                        <span class="mb-1" v-html="icon('Bilder')"></span>
                        <span class="dark-gray-color has-text-weight-medium">Bilder</span>
                    </button>
                    <button v-if="allowAddTexts"
                            class="columns py-3 is-gapless is-multiline is-centered is-vcentered is-flex-direction-column"
                            @click="toggleSidebarPanel('texts')">
                        <span class="mb-1" v-html="icon('Text')"></span>
                        <span class="dark-gray-color has-text-weight-medium">Texte</span>
                    </button>
                    <button v-if="allowAddShapes"
                            class="columns py-3 is-gapless is-multiline is-centered is-vcentered is-flex-direction-column"
                            @click="toggleSidebarPanel('shapes')">
                        <span class="mb-1" v-html="icon('Formen')"></span>
                        <span class="dark-gray-color has-text-weight-medium">Formen</span>
                    </button>
                    <button
                        class="columns py-3 is-gapless is-multiline is-centered is-vcentered is-flex-direction-column"
                        v-if="hasVariants" @click="toggleSidebarPanel('variants')">
                        <span class="mb-1" v-html="icon('Farbpalette')"></span>
                        <span class="dark-gray-color has-text-weight-medium">Produktfarbe ändern</span>
                    </button>
                    <div class="columns p-0 is-gapless">
                        <span class="column has-text-centered" v-html="icon('VectorizerPfeilLinks')"
                              style="cursor: pointer"
                              @click="backward"></span>
                        <span class="column has-text-centered" v-html="icon('VectorizerPfeilRechts')"
                              style="cursor: pointer"
                              @click="forward"></span>
                    </div>


                    <button
                        class="columns py-3 is-gapless is-multiline is-centered is-vcentered is-flex-direction-column"
                        style="margin-top: auto;"
                        @click="toggleSidebarPanel('view-settings')">
                        <span class="mb-1" v-html="icon('Raster')"></span>
                        <span class="dark-gray-color has-text-weight-medium">Ansicht</span>
                    </button>
                </div>
            </div>
        </div>
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
import {mapGetters, mapState} from "vuex";
import {debounce} from "lodash";
import BlockTypes from "@rissc/printformer-ts-common/dist/BlockTypes";

export default {
    name: "controls",
    computed: {
        blockMenuType() {
            switch (this.activeObject.blockType) {
                case 'ASSET':
                    return 'assets';
                case 'TEXT':
                    return 'texts';
                case 'SHAPE':
                    return 'shapes';
                default:
                    this.shouldShowMenu = false;
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
        ...mapState(['editorConfig', 'previewPages', 'openControlTab', 'traceControlsIsOpen']),
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
            this.editorLoaded = true;

            this.setOnlyInteractableBlockActive();
            window.events.on(Events.EDITOR_PAGES_PAGED, this.setOnlyInteractableBlockActive, this);


        });

        let onCancel;
        window.events.on(Events.EDITOR_OBJECT_SELECTED, (block) => {
            this.activeObject = block;
            this.$store.commit('setOpenControlTab', this.blockMenuType);
            this.openSidebarPanel();
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
    },
    methods: {
        setOnlyInteractableBlockActive() {
            if (!(!this.allowAddAssets && !this.allowAddTexts && !this.allowAddShapes)) return;

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
        toggleSidebarPanel(component) {
            if ((this.openControlTab !== component) || (this.openControlTab === null && this.activeObject !== null)) {
                this.openSidebarPanel();
                this.$store.commit('setOpenControlTab', component);
            } else {
                this.closeSidebarPanel();
                this.$store.commit('setOpenControlTab', null);
            }
        },
        forward() {
            this.$catch(this.$editor.getUndoRedo().redo());
        },
        backward() {
            this.$catch(this.$editor.getUndoRedo().undo());
        },
    },
    data() {
        return {
            shouldShowMenu: false,
            editorLoaded: false,
            isPanelOpen: false,
            activeObject: null,
            assets: [],
            variants: []
        }
    }
}
</script>

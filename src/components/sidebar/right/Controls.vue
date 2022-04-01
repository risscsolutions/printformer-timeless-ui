<template>
    <div v-show="this.editorLoaded" :class="{'is-2': !isPanelOpen, 'is-10': isPanelOpen}"
         class="column has-background-light" style="display: grid">
        <div class="columns p-3" style="max-height: calc(100vh - 190px);">
            <transition name="slide">
                <div v-show="isPanelOpen || shouldShowMenu" class="column has-background-light p-2"
                     style="border: 1px solid grey; overflow-x: hidden; overflow-y: scroll">
                    <div class="columns is-multiline is-mobile">
                        <component class="column is-24 p-5" :is="component" :activeObject="activeObject"></component>
                    </div>
                </div>
            </transition>
            <div class="column has-background-light"
                 :class="{'is-24': !isPanelOpen, 'is-7': isPanelOpen, 'is-offset-1': isPanelOpen}">
                <div class="columns is-multiline" style="display: grid">
                    <div v-if="hasAssets" @click="toggleSidebarPanel('assets')"
                         :style="{'border': component === 'assets' ? 'black 5px solid': 'transparent 5px solid'}"
                         class="column is-24 box noselect p-1">
                        <div class="columns is-gapless is-mobile is-multiline is-centered is-vcentered">
                            <div class="column is-24 has-text-centered">
                                <span class="icon is-large">
                                    <i class="fas fa-image fa-2x"></i>
                                </span>
                            </div>
                            <div class="column is-24 has-text-centered">
                                <span class="is-size-4">Bilder</span>
                            </div>
                        </div>
                    </div>
                    <div @click="toggleSidebarPanel('texts')"
                         :style="{'border': component === 'texts' ? 'black 5px solid': 'transparent 5px solid'}"
                         class="column is-24 box noselect p-1">
                        <div class="columns is-gapless is-mobile is-multiline is-centered is-vcentered">
                            <div class="column is-24 has-text-centered">
                                <span class="icon is-large">
                                    <i class="fas fa-eye fa-2x"></i>
                                </span>
                            </div>
                            <div class="column is-24 has-text-centered">
                                <span class="is-size-4">Texte</span>
                            </div>
                        </div>
                    </div>
                    <div @click="toggleSidebarPanel('shapes')"
                         :style="{'border': component === 'shapes' ? 'black 5px solid': 'transparent 5px solid'}"
                         class="column is-24 box noselect p-1">
                        <div class="columns is-gapless is-mobile is-multiline is-centered is-vcentered">
                            <div class="column is-24 has-text-centered">
                                <span class="icon is-large">
                                    <i class="fas fa-square fa-2x"></i>
                                </span>
                            </div>
                            <div class="column is-24 has-text-centered">
                                <span class="is-size-4">Formen</span>
                            </div>
                        </div>
                    </div>
                    <div v-if="hasVariants" @click="toggleSidebarPanel('variants')"
                         :style="{'border': component === 'variants' ? 'black 5px solid': 'transparent 5px solid'}"
                         class="column is-24 box noselect p-1">
                        <div class="columns is-gapless is-mobile is-multiline is-centered is-vcentered">
                            <div class="column is-24 has-text-centered">
                                <span class="icon is-large">
                                    <i class="fas fa-palette fa-2x"></i>
                                </span>
                            </div>
                            <div class="column is-24 has-text-centered">
                                <span class="is-size-4">Varianten</span>
                            </div>
                        </div>
                    </div>
                    <div class="columns is-mobile is-multiline is-centered is-vcentered">
                        <div class="column is-24 has-text-centered">
                            <span style="cursor: pointer" class="icon is-large" @click="backward">
                                <i class="fas fa-step-backward fa-2x"></i>
                            </span>
                            <span style="cursor: pointer" class="icon is-large" @click="forward">
                                <i class="fas fa-step-forward fa-2x"></i>
                            </span>
                        </div>
                    </div>
                    <div @click="toggleSidebarPanel('view-settings')"
                         :style="{'border': component === 'view-settings' ? 'black 5px solid': 'transparent 5px solid'}"
                         class="column is-24 box noselect p-1">
                        <div class="columns is-gapless is-mobile is-multiline is-centered is-vcentered">
                            <div class="column is-24 has-text-centered">
                                <span class="icon is-large">
                                    <i class="fas fa-th fa-2x"></i>
                                </span>
                            </div>
                            <div class="column is-24 has-text-centered">
                                <span class="is-size-4">Ansicht</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
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
import {mapState} from "vuex";
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
        ...mapState(['editorConfig', 'previewPages'])
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
        });

        let onCancel;
        window.events.on(Events.EDITOR_OBJECT_SELECTED, (block) => {
            this.activeObject = block;
            this.component = this.blockMenuType;
            this.openSidebarPanel();
            let onUpdate = block => this.activeObject = block;

            if (onCancel) {
                onCancel.cancel();
            } else {
                onCancel = debounce(() => {
                    this.activeObject = null;
                    this.closeSidebarPanel();
                    this.component = null;
                    window.events.off(Events.EDITOR_OBJECT_UPDATED, onUpdate);
                }, 200);
            }

            window.events.once(Events.EDITOR_OBJECT_CLEARED, onCancel);
            window.events.on(Events.EDITOR_OBJECT_UPDATED, onUpdate);
        });
    },
    methods: {
        closeSidebarPanel() {
            this.isPanelOpen = false;
            this.shouldShowMenu = false;
        },
        openSidebarPanel() {
            this.isPanelOpen = true;
            this.shouldShowMenu = true;
        },
        toggleSidebarPanel(component) {
            if ((this.component !== component) || (this.component === null && this.activeObject !== null)) {
                this.openSidebarPanel();
                this.component = component;
            } else {
                this.closeSidebarPanel();
                this.component = null;
            }
        },
        async forward() {
            await this.$editor.getPager().next();
        },
        async backward() {
            await this.$editor.getPager().previous();
        },
    },
    data() {
        return {
            shouldShowMenu: false,
            component: null,
            editorLoaded: false,
            isPanelOpen: false,
            activeObject: null,
            assets: [],
            variants: []
        }
    }
}
</script>

<template>
    <div v-show="this.editorLoaded" :class="{'width-105': !isPanelOpen, 'width-416': isPanelOpen}"
         class="column is-1 px-0" style="display: grid">
        <div class="columns p-3">
            <transition name="slide">
                <div v-show="isPanelOpen || shouldShowMenu" class="column p-2 is-1 mr-3 width-300"
                     style="border: 1px solid grey; overflow-x: hidden; overflow-y: scroll">
                    <div class="columns is-multiline is-mobile">
                        <component class="column is-24 p-5" :is="openControlTab"
                                   :activeObject="activeObject"></component>
                    </div>
                </div>
            </transition>
            <div class="column is-1 p-0 width-100" style="overflow: auto">
                <div class="sidebar-container">
                    <button class="columns py-3 is-gapless is-multiline is-centered is-vcentered"
                            @click="toggleSidebarPanel('assets')">
                        <span class="mb-1" v-html="icon('Bilder')"></span>
                        <span class="">Bilder</span>
                    </button>
                    <button class="columns py-3 is-gapless is-multiline is-centered is-vcentered"
                            @click="toggleSidebarPanel('texts')">
                        <span class="mb-1" v-html="icon('Text')"></span>
                        <span class="">Texte</span>
                    </button>
                    <button class="columns py-3 is-gapless is-multiline is-centered is-vcentered"
                            @click="toggleSidebarPanel('shapes')">
                        <span class="mb-1" v-html="icon('Formen')"></span>
                        <span class="">Formen</span>
                    </button>
                    <button class="columns py-3 is-gapless is-multiline is-centered is-vcentered"
                            v-if="hasVariants" @click="toggleSidebarPanel('variants')">
                        <span class="mb-1" v-html="icon('Farbpalette')"></span>
                        <span class="">Produktfarbe ändern</span>
                    </button>
                    <div class="columns p-0 is-gapless">
                        <span class="column has-text-centered" v-html="icon('VectorizerPfeilLinks')"
                              @click="backward"></span>
                        <span class="column has-text-centered" v-html="icon('VectorizerPfeilRechts')"
                              @click="forward"></span>
                    </div>


                    <button class="columns py-3 is-gapless is-multiline is-centered is-vcentered"
                            style="margin-top: auto;"
                            @click="toggleSidebarPanel('view-settings')">
                        <span class="mb-1" v-html="icon('Raster')"></span>
                        <span>Ansicht</span>
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
        ...mapState(['editorConfig', 'previewPages', 'openControlTab'])
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
            this.$store.commit('setOpenControlTab', this.blockMenuType);
            this.openSidebarPanel();
            let onUpdate = block => this.activeObject = block;

            if (onCancel) {
                onCancel.cancel();
            } else {
                onCancel = debounce(() => {
                    this.activeObject = null;
                    this.closeSidebarPanel();
                    this.$store.commit('setOpenControlTab', null);
                    window.events.off(Events.EDITOR_OBJECT_UPDATED, onUpdate);
                }, 200);
            }

            window.events.once(Events.EDITOR_OBJECT_CLEARED, onCancel);
            window.events.on(Events.EDITOR_OBJECT_UPDATED, onUpdate);
        });
    },
    methods: {
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
            editorLoaded: false,
            isPanelOpen: false,
            activeObject: null,
            assets: [],
            variants: []
        }
    }
}
</script>

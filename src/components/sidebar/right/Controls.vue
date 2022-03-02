<template>
    <div v-show="this.editorLoaded" :class="{'is-2': !isPanelOpen, 'is-6': isPanelOpen}" class="column has-background-light is-2">
        <div class="columns p-3">
            <transition name="slide">
                <div v-show="isPanelOpen" class="column has-background-light p-2" style="border: 1px solid grey">
                    <div class="columns is-multiline is-mobile">
                        <component class="column is-24" :is="component"></component>
                    </div>
                </div>
            </transition>
            <div class="column has-background-light" :class="{'is-24': !isPanelOpen, 'is-8': isPanelOpen, 'is-offset-2': isPanelOpen}">
                <div class="columns is-multiline">
                    <div @click="toggleSidebarPanel('assets')"
                         :style="{'border': component === 'assets' ? 'black 5px solid': 'transparent 5px solid'}"
                         class="column is-24 box noselect p-1">
                        <div class="columns is-mobile is-multiline is-centered is-vcentered">
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
                        <div class="columns is-mobile is-multiline is-centered is-vcentered">
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
                        <div class="columns is-mobile is-multiline is-centered is-vcentered">
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
                    <div @click="toggleSidebarPanel('variants')"
                         :style="{'border': component === 'variants' ? 'black 5px solid': 'transparent 5px solid'}"
                         class="column is-24 box noselect p-1">
                        <div class="columns is-mobile is-multiline is-centered is-vcentered">
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
                            <span class="icon is-large">
                                <i class="fas fa-step-backward fa-2x"></i>
                            </span>
                            <span class="icon is-large">
                                <i class="fas fa-step-forward fa-2x"></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
.slide-enter-active,
.slide-leave-active
{
    transition: transform 0.2s ease;
}

.slide-enter,
.slide-leave-to {
    transform: translateX(100%);
    transition: all 150ms ease-in 0s
}
</style>
<script>
import Events from "@rissc/printformer-editor-client/dist/Events";
import {mapState} from "vuex";

export default {
    name: "controls",
    computed: {
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

            this.editorLoaded = true;
        });
    },
    methods: {
        closeSidebarPanel() {
            this.isPanelOpen = false
        },
        openSidebarPanel() {
            this.isPanelOpen = true
        },
        toggleSidebarPanel(component) {
            if (this.component !== component) {
                this.openSidebarPanel();
                this.component = component;
            } else {
                this.closeSidebarPanel();
                this.component = null;
            }
        }
    },
    data() {
        return {
            component: null,
            editorLoaded: false,
            isPanelOpen: false
        }
    }
}
</script>

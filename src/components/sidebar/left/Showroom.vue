<template>
    <div v-show="this.editorLoaded" :class="{'is-1': !isPanelOpen, 'is-6': isPanelOpen}" class="column has-background-light" style="display: grid">
        <div class="columns p-3">
            <div class="column has-background-light p-0 is-4">
                <div class="columns is-multiline">
                    <div class="column is-24">
                        <button class="button is-info" @click="toggleSidebarPanel('threedee')">
                            <span class="icon is-small">
                                <i class="fas fa-greater-than"></i>
                            </span>
                        </button>
                    </div>
                    <div class="column ml-5">
                        <div style="transform-origin: 0 0; transform: rotate(90deg)">
                            <span>Hinweise</span>
                        </div>
                    </div>
                </div>
            </div>
            <transition name="slide">
                <div v-show="isPanelOpen" class="column has-background-light p-2" style="border: 1px solid grey">
                    <div class="columns is-multiline is-mobile">
                        <div class="column is-24">
                            <span>
                                KLICKE AUF DIE SYMBOLE IN DER
                                RECHTEN MENÜLEISTE, UM DEINE
                                WERBEARTIKEL ZU GESTALTEN
                            </span>
                        </div>
                        <div class="column is-24">
                            <iframe ref="threedeeiframe" style="min-height: 400px; width: 100%; height: 100%; display: none"></iframe>
                        </div>
                    </div>
                </div>
            </transition>
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
    transform: translateX(-100%);
    transition: all 150ms ease-in 0s
}
</style>
<script>
import {mapState} from "vuex";
import Events from "@rissc/printformer-editor-client/dist/Events";

export default {
    name: "showroom",
    computed: {
        ...mapState(['editorConfig', 'is3D'])
    },
    mounted() {
        window.events.on(Events.EDITOR_LOADED, () => {
            this.currentPage = 1;
            this.has3D = this.editorConfig.configuration.show3DPreview;
        });

        window.events.on(Events.EDITOR_PAGES_PAGED, (pageInfo) => {
            this.currentPage = pageInfo.pageNumber;
        });

        window.events.on(Events.EDITOR_LOADED, async (config) => {
            this.$store.commit('setEditorConfig', config);

            if (config.configuration.show3DPreview) {
                const editorIframe = document.getElementById('editor-iframe');
                this.$refs.threedeeiframe.src = editorIframe.src.replace(new RegExp(/\/embed/), '/3d');
                this.$editor.setThreeDeeElement(this.$refs.threedeeiframe);
            }

            this.editorLoaded = true;
        });
    },
    methods: {
        load3DModel() {
            if (this.is3D !== this.has3D) {
                this.$store.commit('setIs3D', true);
                this.has3D = true;
                this.currentPage = '3D';
                this.$refs.threedeeiframe.style.display = 'block';
            }
        },
        closeSidebarPanel() {
            this.isPanelOpen = false
        },
        openSidebarPanel() {
            this.isPanelOpen = true
        },
        toggleSidebarPanel(component) {
            const threeDee = this.$refs.threedeeiframe;

            if (this.component !== component) {
                this.openSidebarPanel();
                this.component = component;
                this.load3DModel();
                threeDee.style.display = 'block';
            } else {
                this.closeSidebarPanel();
                this.component = null;
                threeDee.style.display = 'none';
            }
        }
    },
    data() {
        return {
            currentPage: null,
            has3D: false,
            component: null,
            editorLoaded: false,
            isPanelOpen: false
        }
    }
}
</script>

<template>
    <div id="three-dee-shower-container">
        <div class="columns">
            <div class="column is-1">
                <div class="columns is-multiline">
                    <div class="column is-12">
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
        </div>
        <div class="sidebar">
            <transition name="slide">
                <div v-show="isPanelOpen" class="sidebar-panel has-background-light p-2" style="border: 1px solid grey">
                    <div class="columns is-multiline is-mobile">
                        <div class="column is-12">
                            <span>
                                KLICKE AUF DIE SYMBOLE IN DER
                                RECHTEN MENÜLEISTE, UM DEINE
                                WERBEARTIKEL ZU GESTALTEN
                            </span>
                        </div>
                        <div class="column is-12" ref="threedee"></div>
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

.sidebar-panel {
    position: fixed;
    left: 60px;
    top: 70px;
    height: 1000px;
    width: 300px;
}
</style>
<script>
import {mapState} from "vuex";
import Events from "@rissc/printformer-editor-client/dist/Events";

export default {
    name: "three-dee-shower",
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
                const threeDee = document.getElementById('three-dee-iframe');
                threeDee.src = editorIframe.src.replace(new RegExp(/\/embed/), '/3d');
                this.$editor.setThreeDeeElement(threeDee);
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
                const threeDee = document.getElementById('three-dee-iframe');
                threeDee.style.display = 'block';
                this.$refs.threedee.appendChild(threeDee);
            }
        },
        closeSidebarPanel() {
            this.isPanelOpen = false
        },
        openSidebarPanel() {
            this.isPanelOpen = true
        },
        toggleSidebarPanel(component) {
            const threeDee = document.getElementById('three-dee-iframe');

            if (this.component !== component) {
                this.openSidebarPanel();
                this.component = component;
                this.load3DModel();
                this.$refs.threedee.appendChild(threeDee);
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

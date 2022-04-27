<template>
    <div v-show="this.editorLoaded" :class="{'is-1 width-50': !isPanelOpen, 'is-6': isPanelOpen}" class="column my-3"
         style="display: grid">
        <div class="columns">
            <div class="column has-background-light is-1 width-50">
                <div class="columns direction-column">
                    <div>
                        <button v-show="!isPanelOpen" class="button is-info no-radius width-50 height-50"
                                @click="toggleSidebarPanel('threedee')">
                      <span class="icon is-small">
                          <i class="fas fa-greater-than"></i>
                      </span>
                        </button>
                        <button v-show="isPanelOpen" class="button is-dark no-radius width-50 height-50"
                                @click="toggleSidebarPanel('threedee')">
                      <span class="icon is-small">
                            <i class="fas fa-less-than"></i>
                        </span>
                        </button>
                    </div>
                    <div style="transform-origin: 52px 40px; transform: rotate(270deg);">
                        <b>HINWEISE</b>
                    </div>
                </div>
                <div class="caution-icon">
                    <span v-html="icon('Ausrufezeichen')"></span>
                </div>
            </div>
            <transition name="slide">
                <div v-show="isPanelOpen" class="column p-4 pt-5" style="border: 1px solid grey">
                    <p v-if="notifications.length === 0" class="mb-1">
                        KLICKE AUF DIE SYMBOLE IN DER
                        RECHTEN MENÜLEISTE, UM DEINE
                        WERBEARTIKEL ZU GESTALTEN
                    </p>
                    <div v-if="notifications.length">
                        <div v-for="notification in notifications">
                            <b class="has-text-danger">{{ notification.type }}</b>
                            <p>{{ notification.message }}</p>
                        </div>
                    </div>
                    <component v-else-if="openControlTab" :is="infoComponent"></component>
                    <div>
                        <iframe ref="threedeeiframe"
                                style="min-height: 400px; width: 100%; height: 100%; display: none"></iframe>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>
<style scoped>

.caution-icon {
    position: relative;
    top: 50px;
    left: 6px;
}

.slide-enter-active,
.slide-leave-active {
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
import AssetsInfo from "./AssetsInfo";
import ShapesInfo from "./ShapesInfo";
import TextsInfo from "./TextsInfo";

export default {
    name: "showroom",
    components: {AssetsInfo, ShapesInfo, TextsInfo},

    computed: {
        ...mapState(['editorConfig', 'is3D', 'notifications', 'openControlTab']),
        infoComponent() {
            return `${this.openControlTab}-info`;
        }
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
        icon(name) {
            return this.$svg(name);
        },
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
            isPanelOpen: false,
        }
    }
}
</script>

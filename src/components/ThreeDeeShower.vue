<template>
    <div id="three-dee-shower-container">
        <div class="columns">
            <div class="column">
                KLICKE AUF DIE SYMBOLE IN DER RECHTEN MENÜLEISTE, UM DEINE WERBEARTIKEL ZU GESTALTEN
            </div>
        </div>
    </div>
</template>
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
                this.load3DModel();
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
            }
        }
    },
    data() {
        return {
            currentPage: null,
            has3D: false
        }
    }
}
</script>

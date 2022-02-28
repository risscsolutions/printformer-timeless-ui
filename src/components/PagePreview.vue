<template>
    <div v-if="previewPages.length > 0" id="page-container">
        <div class="columns is-centered is-mobile">
            <agile :dots="false" :infinite="false" :navButtons="true">
                <div class="slide mb-3" v-for="page in previewPages">
                    <figure class="image has-ratio box p-1"
                            :style="{'border': currentPage === page.pageNumber ? 'black 5px solid': 'transparent 5px solid'}">
                        <img @click="changePage(page.pageNumber)" :src="page.previewImage"/>
                    </figure>
                </div>
            </agile>
        </div>
    </div>
</template>
<script>
import {mapState} from "vuex";
import Events from "@rissc/printformer-editor-client/dist/Events";
import {VueAgile} from "vue-agile";

export default {
    name: "page-preview",
    components: {
        agile: VueAgile
    },
    computed: {
        ...mapState(['editorConfig', 'previewPages'])
    },
    mounted() {
        window.events.on(Events.EDITOR_LOADED, () => {
            this.currentPage = 1;
        });

        window.events.on(Events.EDITOR_PAGES_PAGED, (pageInfo) => {
            this.currentPage = pageInfo.pageNumber;
        });
    },
    methods: {
        changePage(pageNumber) {
            if (this.currentPage !== pageNumber) this.$editor.getPager().showPage(pageNumber)
        }
    },
    data() {
        return {
            currentPage: null
        }
    }
}
</script>

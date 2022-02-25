<template>
    <div v-if="previewPages.length > 0" id="page-container">
        <div class="columns is-centered is-mobile">
            <div class="column is-1">
                <i class="fa-regular fa-less-than"></i>
            </div>
            <div class="column is-2" v-for="page in previewPages">
                <figure class="image has-ratio box m-0 p-1"
                        :style="{'border': currentPage === page.pageNumber ? 'black 5px solid': 'transparent 5px solid'}">
                    <img @click="changePage(page.pageNumber)" :src="page.previewImage"/>
                </figure>
            </div>
            <div class="column is-1">
                <i class="fa-regular fa-greater-than"></i>
            </div>
        </div>
    </div>
</template>
<script>
import {mapState} from "vuex";
import Events from "@rissc/printformer-editor-client/dist/Events";

export default {
    name: "page-preview",
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

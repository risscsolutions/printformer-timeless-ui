<template>
    <div v-if="previewPages.length > 1" class="columns is-mobile is-centered has-background-light">
        <div class="column is-half">
            <agile v-show="previewPages.length > 0" ref="carousel" class="thumbnails" :slidesToShow="4" :dots="false"
                   :infinite="false">
                <div v-for="(page, index) in previewPages" class="slide slide--thumbniail" :key="index"
                     :class="'slide--' + index">
                    <img
                        :style="{'border': currentPage === page.pageNumber ? 'black 5px solid': 'transparent 5px solid'}"
                        @click="changePage(page.pageNumber)" :src="page.previewImage"/>
                </div>
            </agile>
        </div>
    </div>
</template>
<style>
.thumbnails {
    margin: 0 -5px;
    width: calc(100% + 10px);
    display: flex;
    align-items: center;
    justify-content: center;
}

.agile__nav-button {
    background: transparent;
    border: none;
    color: #ccc;
    cursor: pointer;
    font-size: 24px;
    transition-duration: 0.3s;
}

.thumbnails .agile__nav-button {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
}

.thumbnails .agile__nav-button--prev {
    left: -45px;
}

.thumbnails .agile__nav-button--next {
    right: -45px;
}

.agile__nav-button:hover {
    color: #888;
}

.agile__dot {
    margin: 0 10px;
}

.agile__dot button {
    background-color: #eee;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    display: block;
    height: 10px;
    font-size: 0;
    line-height: 0;
    margin: 0;
    padding: 0;
    transition-duration: 0.3s;
    width: 10px;
}

.agile__dot--current button, .agile__dot:hover button {
    background-color: #888;
}

.slide {
    align-items: center;
    box-sizing: border-box;
    color: #fff;
    display: flex;
    height: 450px;
    justify-content: center;
}

.slide--thumbniail {
    cursor: pointer;
    height: 100px;
    padding: 0 5px;
    transition: opacity 0.3s;
}

.slide--thumbniail:hover {
    opacity: 0.75;
}

.slide img {
    height: 100%;
    -o-object-fit: cover;
    object-fit: cover;
    -o-object-position: center;
    object-position: center;
    width: 100%;
}
</style>
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
    watch: {
        previewPages(array) {
            const iFrame = document.querySelector('#editor-iframe');

            if (array.length > 1) {
                iFrame.classList.add('editor-iframe-with-pager');
                iFrame.classList.remove('editor-iframe-no-pager');
            } else {
                iFrame.classList.add('editor-iframe-no-pager');
                iFrame.classList.remove('editor-iframe-with-pager');
            }

        }
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

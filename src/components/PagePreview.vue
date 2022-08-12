<template>
    <div v-if="previewPages.length > 1" class="image-container mx-6">
        <agile v-show="previewPages.length > 0" ref="carousel" :class="setClass" class="thumbnails" :nav-buttons="showSlideNavButtons" :slidesToShow="showSlides" :dots="false" :infinite="false">
            <div v-for="(page, index) in previewPages" class="slide slide--thumbniail" :key="index" :class="setClass">
                <div class="image-container" :style="{'border': currentPage === page.pageNumber ? '#AC5D7A 2px solid': '#A6A9A9 2px solid'}">
                    <img @click="changePage(page.pageNumber)" :src="page.previewImage"/>
<!--                    <span style="color: black">{{ page.pageNumber }}</span>-->
                </div>
            </div>
        </agile>
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
    max-width: 450px;
    justify-content: center;
}

.slide--thumbniail {
    cursor: pointer;
    padding: 0 5px;
    transition: opacity 0.3s;
}

.slide--thumbniail:hover {
    opacity: 0.75;
}

.slide img {
    height: 100px;
    -o-object-fit: cover;
    object-fit: cover;
    -o-object-position: center;
    object-position: center;
    width: 100%;
}

.image-container {
    margin: 0 auto !important;
    max-width: 1000px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.has-few-pages {
    width: unset !important;
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
        showSlides() {
            if (this.windowWidth >= 1400) {
                if (this.previewPages.length < 8) {
                    this.hasFewPages = true;
                    return this.previewPages.length;
                } else {
                    this.hasFewPages = false;
                    return 8;
                }
            } else {
                if (this.previewPages.length > 8) {
                    this.hasFewPages = false;
                    return 8;
                } else {
                    this.hasFewPages = true;
                    return this.previewPages.length;
                }
            }
        },
        setClass() {
            return this.hasFewPages ? 'has-few-pages': null;
        },
        showSlideNavButtons() {
            return this.previewPages.length > 8;
        },
        ...mapState(['editorConfig', 'previewPages'])
    },
    mounted() {
        this.$nextTick(() => {
            window.addEventListener('resize', this.onResize);
        });

        window.events.on(Events.EDITOR_LOADED, () => {
            this.currentPage = 1;
        });

        window.events.on(Events.EDITOR_PAGES_PAGED, (pageInfo) => {
            this.currentPage = pageInfo.pageNumber;

            this.$editor.getPager().pages.then(async (pages) => {
                let prevPages = await Promise.all(pages.map(async (page) => {
                    page.previewImage = await this.$editor.getPager().getPagePreview(page.pageNumber);
                    return page;
                }));

                this.$store.commit('setPreviewPages', prevPages);

            });
        });
    },
    beforeDestroy() {
        window.removeEventListener('resize', this.onResize);
    },
    watch: {
        previewPages(array) {
            const content = document.querySelector('#main-content');
            const iFrame = document.querySelector('#editor-iframe');

            if (array.length > 1) {
                content.classList.add('mb-0');
                iFrame.classList.add('editor-iframe-with-pager');
                iFrame.classList.remove('editor-iframe-no-pager');
            } else {
                content.classList.remove('mb-0');
                iFrame.classList.add('editor-iframe-no-pager');
                iFrame.classList.remove('editor-iframe-with-pager');
            }
        }
    },
    methods: {
        changePage(pageNumber) {
            if (this.currentPage !== pageNumber) this.$editor.getPager().showPage(pageNumber);
        },
        setActive() {
            this.isHovered = !this.isHovered;
        },
        onResize() {
            this.windowWidth = window.innerWidth;

            if (this.windowWidth >= 1400) {
                this.hasFewPages = this.previewPages.length < 8;
            } else {
                this.hasFewPages = this.previewPages.length <= 8;
            }
        }
    },
    data() {
        return {
            hasFewPages: false,
            currentPage: null,
            isHovered: false,
            windowWidth: window.innerWidth
        }
    }
}
</script>

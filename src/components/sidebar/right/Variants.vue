<template>
    <div v-if="hasVariants">
        <div class="column is-24 py-0">
            <div class="content is-small">
                <h4 class="dark-gray-color mb-0">{{ $translate('SIDEBAR_RIGHT_VARIANTS_TITLE') }}</h4>
            </div>
        </div>
        <div class="column is-24">
            <hr class="divider">
        </div>
        <div class="columns is-multiline is-mobile mb-2">
            <div v-for="variant in variants" @click="loadVariant(variant, variant.id)" class="column is-one-third">
                <div v-if="variant.thumbnail.type === 'color'" class="box variant mb-0 border-solid"
                     :class="{'variant-active': currentId === variant.id}"
                     :style="{'background-color': variant.thumbnail.value}">
                    <figure class="image is-square">
                        <span style="border-style: none; outline-color: transparent"></span>
                    </figure>
                </div>
                <div v-else class="box variant p-0 mb-0 border-solid"
                     :class="{'variant-active': currentId === variant.id}">
                    <figure class="image is-square">
                        <img :src="variant.thumbnail.value" height="70px" width="auto">
                    </figure>
                </div>
                <span class="dark-gray-color variant-name" :title="variant.name">{{ variant.name }}</span>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
.variant-name {
    font-size: 10pt;
    text-overflow: ellipsis;
    width: 100%;
    display: block;
    overflow: hidden;
    text-align: center;
}

.variant-active {
    border: 4px solid #0E689A !important;
}

.variant {
    border-radius: 3px;
}
</style>

<script>
import {mapGetters, mapMutations, mapState} from "vuex";

export default {
    name: "variants",
    computed: {
        ...mapGetters(['hasVariants']),
        ...mapState(['editorConfig', 'previewPages', 'variants'])
    },
    async mounted() {
        this.$editor.getVariants().getActive().then((variant) => {
            if (variant) this.currentId = variant.id;
        });
    },
    methods: {
        async loadVariant(variant, index) {
            if (this.currentId !== index) {
                this.currentId = index;
                this.showFullScreenLoader();
                await this.$editor.getVariants().apply(variant.id);
                await this.$editor.save();

                // recommit previewpages after variant change
                this.$editor.getPager().pages.then(async (pages) => {
                    let prevPages = await Promise.all(pages.map(async (page) => {
                        page.previewImage = await this.$editor.getPager().getPagePreview(page.pageNumber);
                        return page;
                    }));

                    this.$store.commit('setPreviewPages', prevPages);
                });

                this.hideFullScreenLoader();
                this.currentId = index;
            }
        },
        ...mapMutations(['showFullScreenLoader', 'hideFullScreenLoader'])
    },
    data() {
        return {
            currentId: 0
        }
    }
}
</script>

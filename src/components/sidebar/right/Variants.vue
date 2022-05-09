<template>
    <div v-if="hasVariants">
        <div class="column is-24 py-0">
            <div class="content is-small">
                <h4 class="dark-gray-color mb-0">Wähle deine Farbe aus</h4>
            </div>
        </div>
        <div class="column is-24">
            <hr class="divider">
        </div>
        <div class="columns is-multiline is-mobile mb-2">
            <div v-for="variant in variants" @click="loadVariant(variant, variant.id)" class="column is-one-third">
                <div v-if="variant.thumbnail.type === 'color'" class="box variant mb-0"
                     :class="{'variant-active': currentId === variant.id}"
                     :style="{'background-color': variant.thumbnail.value}">
                    <figure class="image is-square">
                        <span style="border-style: none; outline-color: transparent"></span>
                    </figure>
                </div>
                <div v-else class="box variant p-0 mb-0" :class="{'variant-active': currentId === variant.id}">
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
    border: 4px solid #000000 !important;
}

.variant {
    border: 3px solid transparent;
}
</style>

<script>
import {mapState} from "vuex";

export default {
    name: "variants",
    computed: {
        hasVariants() {
            return this.variants.length > 0;
        },
        ...mapState(['editorConfig', 'previewPages'])
    },
    async mounted() {
        this.$editor.getVariants().getActive().then((variant) => {
            if (variant) this.currentId = variant.id;
        });

        this.variants = await this.$editor.getVariants().getAll();
    },
    methods: {
        async loadVariant(variant, index) {
            if (this.currentId !== index) {
                this.currentId = index;
                await this.$editor.getLoader().show("Loading...");
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

                await this.$editor.getLoader().hide();
                this.currentId = index;
            }
        }
    },
    data() {
        return {
            variants: [],
            currentId: 0
        }
    }
}
</script>

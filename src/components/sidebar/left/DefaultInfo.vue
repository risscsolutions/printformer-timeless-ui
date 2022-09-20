<template>
    <div class="columns is-multiline p-2 is-align-items-flex-start">
        <div class="column is-24 p-2">
            <p class="mb-1 like-h4 is-uppercase">{{ $translate('SIDEBAR_LEFT_DEFAULT_TITLE') }}</p>
            <p>{{ $translate('SIDEBAR_LEFT_DEFAULT_CONTENT') }}</p>
        </div>
        <div class="columns is-multiline p-2 is-align-items-flex-start" v-if="allowAddAssets || pageContainsAssets">
            <div class="column is-2 has-text-centered icon-left-special-position" v-html="$svg('BilderHinweise')"></div>
            <div class="column is-22">
                <p>{{ $translate('SIDEBAR_LEFT_DEFAULT_ASSET_TAB') }}</p>
            </div>
        </div>
        <div class="columns is-multiline p-2 is-align-items-flex-start" v-if="allowAddTexts || pageContainsTexts">
            <div class="column is-2 has-text-centered icon-left-special-position" v-html="$svg('TexteHinweise')"></div>
            <div class="column is-22">
                <p>{{ $translate('SIDEBAR_LEFT_DEFAULT_TEXT_TAB') }}</p>
            </div>
        </div>
        <div class="columns is-multiline p-2 is-align-items-flex-start" v-if="allowAddShapes || pageContainsShapes">
            <div class="column is-2 has-text-centered icon-left-special-position" v-html="$svg('FormenHinweise')"></div>
            <div class="column is-22">
                <p>{{ $translate('SIDEBAR_LEFT_DEFAULT_SHAPE_TAB') }}</p>
            </div>
        </div>
        <div class="columns is-multiline p-2 is-align-items-flex-start" v-if="hasVariants">
            <div class="column is-2 has-text-centered icon-left-special-position" v-html="$svg('Farbpalette_grau')"></div>
            <div class="column is-22">
                <p>{{ $translate('SIDEBAR_LEFT_DEFAULT_VARIANTS_TAB') }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import {mapGetters, mapState} from "vuex";

export default {
    name: "DefaultInfo",
    computed: {
        ...mapGetters(['allowAddTexts', 'allowAddAssets', 'allowAddShapes', 'hasVariants']),
        ...mapState([
            'pageContainsAssets',
            'pageContainsTexts',
            'pageContainsShapes',
        ]),
    }
}
</script>

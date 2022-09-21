<template>
    <info icon="Farbpalette_grau">
        <template slot="title">
            <p class="mb-1 like-h4 is-uppercase">{{ title }}</p>
        </template>
        <template slot="info">
            <p v-html="p1"></p>
<!--            <p class="mt-2">{{ $translate('SIDEBAR_LEFT_VARIANTS_INFO_PARAGRAPH_2') }}</p>-->
        </template>
        <template slot="tip">
            <p>{{ $translate('SIDEBAR_LEFT_VARIANTS_TIP_PARAGRAPH_1') }}</p>
<!--            <p class="mt-2">{{ $translate('SIDEBAR_LEFT_VARIANTS_TIP_PARAGRAPH_2') }}</p>-->
        </template>
    </info>
</template>

<script>
import Info from "./info";

export default {
    name: "variants-info",
    components: {Info},
    computed: {
        title() {
            return this.$translateMultiple([
                'SIDEBAR_LEFT_VARIANTS_TITLE',
                'SIDEBAR_LEFT_DEFAULT_TITLE',
            ])
        },
        p1() {
            return this.$translate('SIDEBAR_LEFT_VARIANTS_INFO_PARAGRAPH_1', {
                symbol: `<span class="svg-15">${this.$svg('Farbpalette_grau')}</span>`
            })
        },
    }
}
</script>

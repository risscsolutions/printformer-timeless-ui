<template>
    <info icon="BilderHinweise">
        <template slot="title">
            <p class="mb-1 like-h4 is-uppercase">{{ title }}</p>
        </template>
        <template slot="info">
            <p v-html="p1"></p>
            <p v-html="p2" class="mt-2"></p>
            <p class="mt-2" style="text-transform:uppercase;">
                {{ editorConfig.configuration.upload.acceptedFileExtensions.join(', ') }}</p>
        </template>
        <template slot="tip">
            <p>{{ $translate('SIDEBAR_LEFT_ASSETS_TIP_PARAGRAPH_1') }}</p>

            <template v-for="tip in tips">
                <p class="like-h4 my-2">{{ tip.title }}</p>
                <p>{{ tip.content }}</p>
            </template>
        </template>
    </info>
</template>

<script>
import Info from "./info";
import {mapState} from "vuex";

export default {
    name: "assets-info",
    components: {Info},
    computed: {
        ...mapState(['editorConfig',]),
        title() {
            return this.$translateMultiple([
                'SIDEBAR_LEFT_ASSETS_TITLE',
                'SIDEBAR_LEFT_DEFAULT_TITLE',
            ])
        },
        p1() {
            return this.$translate('SIDEBAR_LEFT_ASSETS_INFO_PARAGRAPH_1', {
                symbol: `<span class="svg-15">${this.$svg('BilderHinweise')}</span>`
            })
        },
        p2() {
            return this.$translate('SIDEBAR_LEFT_ASSETS_INFO_PARAGRAPH_2', {
                symbol: `<span class="svg-15">${this.$svg('HinzufuegenPlus')}</span>`
            })
        },
        tips() {
            let tips = [];
            let i = 0;
            do {
                i++;
                const titleKey = `SIDEBAR_LEFT_ASSETS_TIP_${i}_TITLE`;
                const contentKey = `SIDEBAR_LEFT_ASSETS_TIP_${i}_CONTENT`;
                const title = this.$translate(titleKey);
                const content = this.$translate(contentKey);
                if (!!title && title !== titleKey && !!content && content !== contentKey) {
                    tips.push({title, content});
                }
            } while (tips.length === i);

            return tips;
        }
    }
}
</script>

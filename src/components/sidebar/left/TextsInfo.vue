<template>
    <info icon="TexteHinweise">
        <template slot="title">
            <p class="mb-1 like-h4 is-uppercase">{{ title }}</p>
        </template>
        <template slot="info">
            <p v-html="p1"></p>
            <p class="mt-2">{{ $translate('SIDEBAR_LEFT_TEXTS_INFO_PARAGRAPH_2') }}</p>
        </template>
        <template slot="tip">
            <template v-for="(tip, idx) in tips">
                <p :class="{'like-h4': true, 'my-2': idx > 0, 'mb-2': idx === 0}">{{ tip.title }}</p>
                <p>{{ tip.content }}</p>
            </template>
        </template>
    </info>
</template>

<script>
import Info from "./info";

export default {
    name: "texts-info",
    components: {Info},
    computed: {
        title() {
            return this.$translateMultiple([
                'SIDEBAR_LEFT_TEXTS_TITLE',
                'SIDEBAR_LEFT_DEFAULT_TITLE',
            ])
        },
        p1() {
            return this.$translate('SIDEBAR_LEFT_TEXTS_INFO_PARAGRAPH_1', {
                symbol: `<span class="svg-15">${this.$svg('TexteHinweise')}</span>`
            })
        },
        tips() {
            let tips = [];
            let i = 0;
            do {
                i++;
                const titleKey = `SIDEBAR_LEFT_TEXTS_TIP_${i}_TITLE`;
                const contentKey = `SIDEBAR_LEFT_TEXTS_TIP_${i}_CONTENT`;
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

<template>
    <div>
        <template v-if="traceStep === 1">
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_1_PARAGRAPH_1') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_1_PARAGRAPH_2') }}</p>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_1_PARAGRAPH_3') }}</p><br>
            <p class="like-h4">{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_1_PARAGRAPH_4') }}</p>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_1_PARAGRAPH_5') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_1_PARAGRAPH_6') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_1_PARAGRAPH_7') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_1_PARAGRAPH_8') }}</p>
        </template>
        <template v-else-if="traceStep === 2">
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_2_PARAGRAPH_1') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_2_PARAGRAPH_2') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_2_PARAGRAPH_3') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_2_PARAGRAPH_4') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_2_PARAGRAPH_5') }}</p><br>
        </template>
        <template v-else-if="traceStep === 3">
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_3_PARAGRAPH_1') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_3_PARAGRAPH_2') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_3_PARAGRAPH_3') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_3_PARAGRAPH_4') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_3_PARAGRAPH_5') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_3_PARAGRAPH_6') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_3_PARAGRAPH_7') }}</p><br>
        </template>
        <template v-else-if="traceStep === 4">
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_4_PARAGRAPH_1') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_4_PARAGRAPH_2') }}</p><br>
            <p v-html="step4Paragraph3"></p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_4_PARAGRAPH_4') }}</p><br>
            <p v-html="step4Paragraph5"></p>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_4_PARAGRAPH_6') }}</p>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_4_PARAGRAPH_7') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_4_PARAGRAPH_8') }}</p><br>
            <p>{{ $translate('SIDEBAR_LEFT_VECTORIZER_STEP_4_PARAGRAPH_9') }}</p>
        </template>
    </div>
</template>

<script>
import {mapState} from "vuex";

export default {
    name: "TraceControlInfo",
    computed: {
        ...mapState(['traceStep']),
        step4Paragraph3() {
            return this.$translate('SIDEBAR_LEFT_VECTORIZER_STEP_4_PARAGRAPH_3', {
                symbol: `<button class="button is-rounded color-button-round m-0">${this.$svg('Plus')}</button>`
            })
        },
        step4Paragraph5() {
            return this.$translate('SIDEBAR_LEFT_VECTORIZER_STEP_4_PARAGRAPH_5', {
                symbol: `<button class="button is-rounded color-button-round m-0">${this.$svg('Plus')}</button>`
            })
        }
    }
}
</script>

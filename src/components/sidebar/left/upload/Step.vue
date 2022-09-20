<template>
    <div class="column is-24 p-2">
        <div class="columns">
            <div class="column is-2 has-text-centered icon-left-special-position"
                 style="align-content: center;justify-content: center;align-items: center;">
                  <span v-if="icon.length"
                        class="svg-30"
                        v-html="$svg(...icon)"></span>
            </div>
            <div class="column is-22">
                <span class="has-text-weight-semibold dark-gray-color">{{
                        $translate('SIDEBAR_LEFT_UPLOAD_INFO_STEP', {step})
                    }}</span><br>
                {{ text }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Step",
    props: {
        step: {},
        text: {},
        state: {},
    },
    computed: {
        icon() {
            switch (this.state) {
                case 'loading':
                    return ['Ladebalken', 'spinning'];
                case 'complete':
                    return ['Haken'];
                case 'failed':
                    return ['Warnung-Filled'];
            }
            return [];
        }
    }
}
</script>

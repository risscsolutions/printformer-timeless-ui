<template>
    <info icon="Raster_klein">
        <template slot="title">
            <p class="mb-1 like-h4 is-uppercase">{{ title }}</p>
        </template>
        <template slot="info">
            <p>{{ $translate('SIDEBAR_LEFT_SETTINGS_INFO') }}</p>
        </template>
        <template slot="tip">
            <p>{{ $translate('SIDEBAR_LEFT_SETTINGS_TIP') }}</p>
        </template>
    </info>
</template>

<script>
import Info from "./info";
import {mapState} from "vuex";

export default {
    name: "view-settings-info",
    components: {Info},
    computed: {
        ...mapState(['editorConfig',]),
        title() {
            return this.$translateMultiple([
                'SIDEBAR_LEFT_SETTINGS_TITLE',
                'SIDEBAR_LEFT_DEFAULT_TITLE',
            ])
        },
    }
}
</script>

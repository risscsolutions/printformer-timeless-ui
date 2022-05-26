<template>
    <div style="display: none" id="color-assigner" class="is-flex is-flex-wrap-wrap is-align-items-center is-align-content-space-around is-justify-content-space-evenly p-4">
            <button v-for="color in userColors" v-if="color" :title="color.name"
                    class="button is-rounded color-button-round m-0"
                    :style="`background-color: ${color.displayColor}`"
                    @click="applyColor(color)">
            </button>
            <button title="Transparent"
                    class="button is-rounded color-button-round chess-background m-0"
                    @click="applyColor('none')"></button>
    </div>

</template>

<script>
import {mapState} from "vuex";

export default {
    name: "color-assigner",
    computed: {
        ...mapState(['colorAssignerClosure', 'userColors']),
    },
    mounted() {
        const dialog = $('#color-assigner');
        dialog
            .dialog({
                classes: {
                    "ui-dialog": 'p-0',
                    "ui-dialog-titlebar": "is-hidden",
                },
                autoOpen: false,
                resizable: false,
                modal: true,
            });
    },
    methods: {
        applyColor(color) {
            this.colorAssignerClosure(color);
            $('#color-assigner').dialog("close");
        },
    }
}
</script>

<style scoped>
</style>

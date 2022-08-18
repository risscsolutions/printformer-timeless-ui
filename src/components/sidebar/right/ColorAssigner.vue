<template>
    <div style="display: none;" id="color-assigner"
         class="is-flex is-flex-wrap-wrap is-align-items-center is-align-content-space-around is-justify-content-space-evenly pt-4 pl-4">
        <button v-for="color in userColors" v-if="color" :title="color.name"
                class="button is-rounded color-button-round"
                :style="`background-color: ${color.displayColor}`"
                @click="applyColor(color)">
            <span></span>
        </button>
        <button title="Transparent"
                class="button is-rounded color-button-round chess-background"
                @click="applyColor('none')">
            <span></span>
        </button>
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
                width: 'auto',
                height: 'auto',
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

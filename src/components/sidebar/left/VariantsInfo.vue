<template>
    <info icon="Farbpalette">
        <template slot="info">
            <p>Farbvariante hier wählen</p>
        </template>
        <template slot="tipp">
            <p>Hier texte bitte</p>
        </template>
    </info>
</template>

<script>
import Info from "./info";
import {mapState} from "vuex";

export default {
    name: "variants-info",
    components: {Info},
    computed: {
        ...mapState(['editorConfig',])
    }
}
</script>

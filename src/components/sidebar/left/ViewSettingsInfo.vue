<template>
    <info icon="Raster">
        <template slot="info">
            Rasterfarbe hier
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
    name: "view-settings-info",
    components: {Info},
    computed: {
        ...mapState(['editorConfig',])
    }
}
</script>

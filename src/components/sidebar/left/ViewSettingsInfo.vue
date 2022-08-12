<template>
    <info icon="Raster_klein">
        <template slot="title">
            <p class="mb-1 like-h4">TIPPS UND HINWEISE</p>
        </template>
        <template slot="info">
            <p>Aktiviere das Raster, um die die Ausrichtung der verschiedenen Boxen zu erleichtern.</p>
        </template>
        <template slot="tipp">
            <p>Die Größe und Farbe des Rasters kannst du nach deinen Wünschen umstellen. Das hat für die Druckdaten keine Konsequenz, sondern dient nur der besseren Sichtbarkeit für dich.</p>
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

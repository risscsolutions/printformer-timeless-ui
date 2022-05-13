<template>
    <info icon="BilderHinweise">
        <template slot="info">
            <p>Klicke auf das Bildfeld, um Bilder hinzufügen und zu bearbeiten</p>
        </template>
        <template slot="tipp">
            <p>
                Mit einem <b>einfachem Klick</b> auf die Bild
                <wbr>
                box feld kannst du die Größe des Rah
                <wbr>
                mens ändern, drehen und verschieben.
            </p>
            <br/>
            <p>Mit einem <b>doppelten Klick</b> in die Bild
                <wbr>
                box kannst du das Bild innerhalb des Rahmens verschieben und skalieren.
            </p>
            <br/>
            <p>Erlaubte Dateiformate: {{ editorConfig.configuration.upload.acceptedFileExtensions.join(', ') }}</p>
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
        ...mapState(['editorConfig',])
    }
}
</script>

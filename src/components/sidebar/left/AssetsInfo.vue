<template>
    <info icon="BilderHinweise">
        <template slot="title">
            <p class="mb-1 like-h4">TIPPS UND HINWEISE</p>
        </template>
        <template slot="info">
            <p>Wenn du ein Bild (z.B. dein Logo) auf der Werbefläche abbilden möchtest, klicke im Menü rechts auf das Symbol <span class="svg-15" v-html="$svg('BilderHinweise')"></span> </p>
            <p class="mt-2">Klicke zuerst auf dieses Symbol <span class="svg-15" v-html="$svg('HinzufuegenPlus')"></span> und wähle dein Bild aus oder du ziehst dein Bild direkt per Drag & Drop in das Feld „Bilder hochladen“ Bitte verwende eins dieser Dateiformate:</p>
            <p class="mt-2" style="text-transform:uppercase;">{{ editorConfig.configuration.upload.acceptedFileExtensions.join(', ') }}</p>
        </template>
        <template slot="tipp">
            <p>Deine hochgeladenen Bilder werden automatisch geprüft und in „Meine Bilder“ für dich gespeichert. Bitte melde dich dafür zunächst an. </p>

            <p class="like-h4 my-2">Ein Klick auf die Bild-Box</p>
            <p>Ändere die Größe des Rahmens, drehe und verschiebe die Box, wenn die Vorlage es zulässt.</p>

            <p class="like-h4 my-2">Doppelklick auf die Bild-Box</p>
            <p>Verschiebe dein Bild und zoome innerhalb der Bild-Box.</p>

            <p class="like-h4 my-2">Erweiterte Bearbeitung</p>
            <p>Hier kannst du Hilfslinien einzeichnen, die Ausrichtung und die Transparenz deines Bildes anpassen. Lege hier auch ein Raster fest, um die dir Bearbeitung zu erleichtern.</p>

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

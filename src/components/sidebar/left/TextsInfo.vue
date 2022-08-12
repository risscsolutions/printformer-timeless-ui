<template>
    <info icon="TexteHinweise">
        <template slot="title">
            <p class="mb-1 like-h4">TIPPS UND HINWEISE</p>
        </template>
        <template slot="info">
            <p>Wenn du einen Text auf der Werbefläche abbilden möchtest, klicke im Menü rechts auf das Symbol <span class="svg-15" v-html="$svg('TexteHinweise')"></span> und füge zuerst eine Text-Box hinzu. </p>
            <p class="mt-2">Du kannst sowohl den Text in der Box als auch die Box selbst bearbeiten. </p>
        </template>
        <template slot="tipp">
            <p class="like-h4 mb-2">Ein Klick auf die Text-Box</p>
            <p>Ändere die Größe des Rahmens, drehe und verschiebe die Box.</p>

            <p class="like-h4 my-2">Doppelklick auf die Text-Box</p>
            <p>Formatiere deinen Text innerhalb der Text-Box, z.B. Schriftart und Schriftgröße.</p>

            <p class="like-h4 my-2">Erweiterte Bearbeitung</p>
            <p>Hier kannst du die Hintergrundfarbe, den Zeilenabstand und die Transparenz deines Textes anpassen. Lege hier auch die Ebenen fest, auf denen deine Texte erscheinen.</p>
        </template>
    </info>
</template>

<script>
import Info from "./info";

export default {
    name: "texts-info",
    components: {Info}
}
</script>
